// Generador de la muestra Olist para el playground SQL (SQLite).
// Reproduce el esquema en estrella de David y calibra los datos para que las
// consultas devuelvan proporciones fieles a sus hallazgos reales.
import fs from "fs";

const rnd = (seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)(42);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const pickW = (pairs) => { // [ [val, peso], ... ]
  const tot = pairs.reduce((s, p) => s + p[1], 0); let r = rnd() * tot;
  for (const [v, w] of pairs) { if ((r -= w) <= 0) return v; } return pairs[0][0];
};
const money = (min, max) => Math.round((min + rnd() * (max - min)) * 100) / 100;

// ── Dimensiones ────────────────────────────────────────────
// Estados calibrados: SP domina (~37% ingresos, ticket más bajo)
const STATES = [["SP",34],["RJ",13],["MG",11],["RS",6],["PR",5],["SC",4],["BA",4],["DF",3],["GO",3],["ES",2]];
const CATEGORIES = [
  "bed_bath_table","health_beauty","sports_leisure","furniture_decor","computers_accessories",
  "housewares","watches_gifts","telephony","auto","toys","cool_stuff","garden_tools",
  "perfumery","baby","electronics","stationery","fashion_bags_accessories","pet_shop",
];
const PAYMENTS = [["credit_card",75],["boleto",20],["voucher",3],["debit_card",2]];

let sql = [];
sql.push("PRAGMA foreign_keys=ON;");

// dim_date (2016-09 .. 2018-10)
sql.push(`CREATE TABLE dim_date (date_key INTEGER PRIMARY KEY, full_date TEXT, year INTEGER, month INTEGER, month_name TEXT, weekday INTEGER, is_weekend INTEGER);`);
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const dates = [];
for (let y = 2016; y <= 2018; y++) {
  for (let m = 1; m <= 12; m++) {
    if (y === 2016 && m < 9) continue;
    if (y === 2018 && m > 10) continue;
    for (let d = 1; d <= 28; d += 3) {
      const key = y * 10000 + m * 100 + d;
      const wd = new Date(y, m - 1, d).getDay();
      dates.push({ key, y, m, d, wd });
      sql.push(`INSERT INTO dim_date VALUES (${key},'${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}',${y},${m},'${MONTHS[m-1]}',${wd},${wd===0||wd===6?1:0});`);
    }
  }
}

// dim_customer (clientes reales; ~3% repetirán)
sql.push(`CREATE TABLE dim_customer (customer_key INTEGER PRIMARY KEY, customer_unique_id TEXT UNIQUE, customer_city TEXT, customer_state TEXT);`);
const N_CUST = 2500;
const customers = [];
for (let i = 1; i <= N_CUST; i++) {
  const st = pickW(STATES);
  customers.push({ key: i, st });
  sql.push(`INSERT INTO dim_customer VALUES (${i},'cust_${i.toString(36)}','city_${st.toLowerCase()}','${st}');`);
}

// dim_seller (para que el cuartil top ~86% ingresos: pocos vendedores dominan)
sql.push(`CREATE TABLE dim_seller (seller_key INTEGER PRIMARY KEY, seller_id TEXT UNIQUE, seller_city TEXT, seller_state TEXT);`);
const N_SELL = 120;
for (let i = 1; i <= N_SELL; i++) {
  const st = pickW(STATES);
  sql.push(`INSERT INTO dim_seller VALUES (${i},'sell_${i.toString(36)}','city_${st.toLowerCase()}','${st}');`);
}
// pesos de vendedor: los 30 primeros (cuartil top) concentran la mayoría
const sellerWeight = (k) => 1 / Math.pow(k, 1.3);  // curva calibrada: cuartil top ~86% de ingresos (hallazgo real)
let sellerWeightTotal = 0; for (let k = 1; k <= N_SELL; k++) sellerWeightTotal += sellerWeight(k);

// dim_product
sql.push(`CREATE TABLE dim_product (product_key INTEGER PRIMARY KEY, product_id TEXT UNIQUE, category TEXT, category_pt TEXT);`);
const N_PROD = 300;
for (let i = 1; i <= N_PROD; i++) {
  const cat = pick(CATEGORIES);
  sql.push(`INSERT INTO dim_product VALUES (${i},'prod_${i.toString(36)}','${cat}','${cat}_pt');`);
}

// dim_payment
sql.push(`CREATE TABLE dim_payment (payment_key INTEGER PRIMARY KEY, payment_type TEXT, installments INTEGER);`);
const payKeys = {};
let pk = 0;
for (const [type] of PAYMENTS) for (const inst of [1,2,3,6,10]) { pk++; payKeys[`${type}_${inst}`] = pk; sql.push(`INSERT INTO dim_payment VALUES (${pk},'${type}',${inst});`); }

// ── fact_sales ─────────────────────────────────────────────
sql.push(`CREATE TABLE fact_sales (
  sale_key INTEGER PRIMARY KEY,
  order_id TEXT, date_key INTEGER REFERENCES dim_date(date_key),
  customer_key INTEGER REFERENCES dim_customer(customer_key),
  product_key INTEGER REFERENCES dim_product(product_key),
  seller_key INTEGER REFERENCES dim_seller(seller_key),
  payment_key INTEGER REFERENCES dim_payment(payment_key),
  price REAL, freight REAL, total_sale REAL,
  review_score INTEGER, delivery_delay_days INTEGER
);`);

let sk = 0, orderN = 0;
const N_ORDERS = 2500;

// ── Asignación determinista de pedidos a clientes (retención exacta) ──
// Queremos: repetidores / clientes_reales = 3.05% (hallazgo real de David).
// Si R clientes tienen 2 pedidos y U clientes tienen 1, entonces
//   pedidos = 2R + U   y   clientes = R + U   y   R/(R+U) = 0.0305.
// Resolviendo para pedidos = 2500 → clientes ≈ 2426, R ≈ 74.
const TARGET_RETENTION = 0.0305;
const clientesReales = Math.round(N_ORDERS / (1 + TARGET_RETENTION));
const R = Math.round(clientesReales * TARGET_RETENTION);          // repetidores (2 pedidos)
const U = clientesReales - R;                                     // únicos (1 pedido)
// Lista de dueños de pedido: R clientes aparecen 2 veces, U una vez.
const owners = [];
for (let i = 1; i <= R; i++) { owners.push(i); owners.push(i); }  // repetidores: ids 1..R
for (let i = R + 1; i <= R + U; i++) owners.push(i);              // únicos
// Barajado determinista (Fisher-Yates con la PRNG sembrada)
for (let i = owners.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [owners[i], owners[j]] = [owners[j], owners[i]]; }
// Aseguramos que hay al menos tantos clientes en la dimensión como clientesReales
// (N_CUST se define arriba; clientesReales ≤ N_CUST).

for (let o = 0; o < owners.length; o++) {
  orderN++;
  const oid = `order_${(o + 1).toString(36)}`;
  const cust = customers[owners[o] - 1];        // dueño determinista de este pedido
  const dk = pick(dates).key;
  const dateKey = rnd() < 0.08 ? 20171101 : dk; // pico Black Friday nov-2017
  const payType = pickW(PAYMENTS);
  const inst = payType === "credit_card" ? pick([1,2,3,6,10]) : 1;
  let seller; { const TW = sellerWeightTotal; let r = rnd() * TW; for (let sN = 1; sN <= N_SELL; sN++) { if ((r -= sellerWeight(sN)) <= 0) { seller = sN; break; } } seller = seller || 1; }
  const nLines = pickW([[1,70],[2,20],[3,10]]);
  for (let li = 0; li < nLines; li++) {
    sk++;
    const isSP = cust.st === "SP";
    const price = isSP ? money(30, 170) : money(28, 225);
    const freight = money(8, 40);
    const payMult = payType === "credit_card" ? 1.08 : 0.92;
    const total = Math.round((price * payMult + freight) * 100) / 100;
    const delay = pickW([[0,55],[2,20],[5,12],[12,8],[25,5]]);
    let score;
    if (delay >= 12)     score = pickW([[1,46],[2,30],[3,16],[4,5],[5,3]]);  // grave → ~1.7
    else if (delay >= 5) score = pickW([[5,34],[4,30],[3,20],[2,10],[1,6]]); // tardío → ~3.75
    else if (delay >= 2) score = pickW([[5,54],[4,29],[3,11],[2,4],[1,2]]);  // leve → ~4.3
    else                 score = pickW([[5,64],[4,25],[3,7],[2,3],[1,1]]);   // a tiempo → ~4.48
    sql.push(`INSERT INTO fact_sales VALUES (${sk},'${oid}',${dateKey},${cust.key},${1+Math.floor(rnd()*N_PROD)},${seller},${payKeys[`${payType}_${inst}`]},${price},${freight},${total},${score},${delay});`);
  }
}

// vistas de negocio (las dos del diagrama de David)
sql.push(`CREATE VIEW vw_monthly_sales AS
  SELECT d.year, d.month, d.month_name, COUNT(DISTINCT f.order_id) AS orders,
         ROUND(SUM(f.total_sale),2) AS revenue, ROUND(AVG(f.review_score),2) AS avg_score
  FROM fact_sales f JOIN dim_date d ON f.date_key=d.date_key
  GROUP BY d.year,d.month,d.month_name ORDER BY d.year,d.month;`);
sql.push(`CREATE VIEW vw_seller_performance AS
  SELECT s.seller_id, COUNT(*) AS lines, ROUND(SUM(f.total_sale),2) AS revenue, ROUND(AVG(f.review_score),2) AS avg_score
  FROM fact_sales f JOIN dim_seller s ON f.seller_key=s.seller_key
  GROUP BY s.seller_id ORDER BY revenue DESC;`);

fs.writeFileSync("/tmp/olist_seed.sql", sql.join("\n"));
console.log("SQL generado:", sql.length, "sentencias ·", sk, "líneas de venta ·", orderN, "pedidos");