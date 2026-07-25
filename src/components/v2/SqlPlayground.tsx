"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/data/i18n";

/**
 * Playground SQL embebido del Data Warehouse Olist.
 * Carga sql.js (SQLite en WebAssembly) desde CDN — 100% en el navegador del
 * visitante, sin servidor, sin coste. Ejecuta SQL real contra una muestra
 * calibrada que reproduce los 12 insights reales del proyecto de David.
 *
 * sql.js se carga por <script> desde jsDelivr en tiempo de ejecución, así que
 * no engorda el bundle ni añade una dependencia npm.
 */

const SQLJS_VERSION = "1.11.0";
const SQLJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${SQLJS_VERSION}`;

// Tipos mínimos de la API de sql.js que usamos.
interface SqlJsResult {
  columns: string[];
  values: Array<Array<string | number | null>>;
}
interface SqlJsDatabase {
  exec: (sql: string) => SqlJsResult[];
}
interface SqlJsStatic {
  Database: new () => SqlJsDatabase;
}
declare global {
  interface Window {
    initSqlJs?: (config?: { locateFile?: (f: string) => string }) => Promise<SqlJsStatic>;
  }
}

interface Example {
  label: { es: string; en: string };
  sql: string;
}

const EXAMPLES: Example[] = [
  {
    label: { es: "KPIs generales", en: "Overall KPIs" },
    sql: `SELECT
  COUNT(*)                        AS lineas,
  COUNT(DISTINCT order_id)        AS pedidos,
  COUNT(DISTINCT customer_key)    AS clientes,
  ROUND(SUM(total_sale), 2)       AS ingresos,
  ROUND(AVG(total_sale), 2)       AS ticket_medio,
  ROUND(AVG(review_score), 2)     AS valoracion
FROM fact_sales;`,
  },
  {
    label: { es: "Cuota de mercado por estado", en: "Market share by state" },
    sql: `SELECT
  c.customer_state                                              AS estado,
  ROUND(SUM(f.total_sale), 2)                                   AS ingresos,
  ROUND(100.0 * SUM(f.total_sale)
        / (SELECT SUM(total_sale) FROM fact_sales), 1)          AS cuota_pct,
  ROUND(AVG(f.total_sale), 2)                                   AS ticket_medio
FROM fact_sales f
JOIN dim_customer c ON f.customer_key = c.customer_key
GROUP BY c.customer_state
ORDER BY ingresos DESC
LIMIT 8;`,
  },
  {
    label: { es: "Retraso de entrega vs. satisfacción", en: "Delivery delay vs. satisfaction" },
    sql: `SELECT
  CASE
    WHEN delivery_delay_days >= 12 THEN '3 · retraso grave'
    WHEN delivery_delay_days >= 5  THEN '2 · tardío'
    ELSE '1 · a tiempo'
  END                             AS franja_entrega,
  COUNT(*)                        AS lineas,
  ROUND(AVG(review_score), 2)     AS valoracion_media
FROM fact_sales
GROUP BY franja_entrega
ORDER BY franja_entrega;`,
  },
  {
    label: { es: "Ranking de vendedores por cuartil (NTILE)", en: "Seller ranking by quartile (NTILE)" },
    sql: `WITH ventas_vendedor AS (
  SELECT seller_key, SUM(total_sale) AS ingresos
  FROM fact_sales
  GROUP BY seller_key
),
cuartiles AS (
  SELECT ingresos, NTILE(4) OVER (ORDER BY ingresos DESC) AS cuartil
  FROM ventas_vendedor
)
SELECT
  cuartil,
  COUNT(*)                        AS vendedores,
  ROUND(SUM(ingresos), 2)         AS ingresos,
  ROUND(100.0 * SUM(ingresos)
        / (SELECT SUM(ingresos) FROM ventas_vendedor), 1) AS cuota_pct
FROM cuartiles
GROUP BY cuartil
ORDER BY cuartil;`,
  },
  {
    label: { es: "Tasa de recompra (retención)", en: "Repeat-purchase rate (retention)" },
    sql: `WITH pedidos_por_cliente AS (
  SELECT customer_key, COUNT(DISTINCT order_id) AS n_pedidos
  FROM fact_sales
  GROUP BY customer_key
)
SELECT
  COUNT(*)                                              AS clientes,
  SUM(CASE WHEN n_pedidos > 1 THEN 1 ELSE 0 END)        AS repiten,
  ROUND(100.0 * SUM(CASE WHEN n_pedidos > 1 THEN 1 ELSE 0 END)
        / COUNT(*), 2)                                  AS retencion_pct
FROM pedidos_por_cliente;`,
  },
];

const UI = {
  es: {
    title: "Pruébalo: SQL en vivo sobre el Data Warehouse",
    intro:
      "Esto ejecuta SQL real (SQLite en tu navegador) sobre una muestra que reproduce los hallazgos reales del proyecto. Elige una consulta de ejemplo o escribe la tuya.",
    run: "Ejecutar",
    running: "Ejecutando…",
    loading: "Cargando el motor SQL…",
    rows: "filas",
    error: "Error",
    hint: "▶ Pulsa «Ejecutar» para lanzar la consulta.",
    schemaNote:
      "Esquema en estrella: fact_sales (hechos) + dim_customer, dim_product, dim_seller, dim_payment, dim_date.",
  },
  en: {
    title: "Try it: live SQL on the Data Warehouse",
    intro:
      "This runs real SQL (SQLite in your browser) on a sample that reproduces the project's real findings. Pick an example query or write your own.",
    run: "Run",
    running: "Running…",
    loading: "Loading the SQL engine…",
    rows: "rows",
    error: "Error",
    hint: "▶ Press “Run” to execute the query.",
    schemaNote:
      "Star schema: fact_sales (facts) + dim_customer, dim_product, dim_seller, dim_payment, dim_date.",
  },
};

export default function SqlPlayground({ lang }: { lang: Lang }) {
  const [db, setDb] = useState<SqlJsDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sql, setSql] = useState(EXAMPLES[0].sql);
  const [result, setResult] = useState<SqlJsResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const startedRef = useRef(false);
  const t = UI[lang];

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("No se pudo cargar " + src));
        document.head.appendChild(s);
      });

    (async () => {
      try {
        if (!window.initSqlJs) await loadScript(`${SQLJS_CDN}/sql-wasm.js`);
        const SQL = await window.initSqlJs!({ locateFile: (f) => `${SQLJS_CDN}/${f}` });
        const seed = await fetch("/data/olist_seed.sql").then((r) => r.text());
        const database = new SQL.Database();
        database.exec(seed);
        setDb(database);
        // No ejecutamos nada al cargar: la tabla debe aparecer SOLO cuando el
        // visitante pulsa "Ejecutar", para que el botón tenga un efecto visible.
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const run = () => {
    if (!db) return;
    setBusy(true);
    setRunError(null);
    try {
      const res = db.exec(sql);
      setResult(res[0] ?? { columns: [], values: [] });
    } catch (e) {
      setRunError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setBusy(false);
    }
  };

  const loadExample = (ex: Example) => {
    // Solo carga el SQL en el editor y limpia resultados previos: el visitante
    // pulsa "Ejecutar" para verlo correr. Así el botón siempre "hace algo".
    setSql(ex.sql);
    setRunError(null);
    setResult(null);
  };

  return (
    <section className="v2-sec sqlpg">
      <h2>{t.title}</h2>
      <p className="v2-note">{t.intro}</p>
      <p className="sqlpg-schema">{t.schemaNote}</p>

      <div className="sqlpg-examples">
        {EXAMPLES.map((ex, i) => (
          <button key={i} className="sqlpg-chip" onClick={() => loadExample(ex)} disabled={loading}>
            {ex.label[lang]}
          </button>
        ))}
      </div>

      <textarea
        className="sqlpg-editor"
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        spellCheck={false}
        rows={10}
      />

      <div className="sqlpg-bar">
        <button className="v2-btn" onClick={run} disabled={loading || busy || !db}>
          {loading ? t.loading : busy ? t.running : `▶ ${t.run}`}
        </button>
        {result && !runError && (
          <span className="sqlpg-count">
            {result.values.length} {t.rows}
          </span>
        )}
      </div>

      {loadError && <p className="sqlpg-error">{t.error}: {loadError}</p>}
      {runError && <p className="sqlpg-error">{t.error}: {runError}</p>}

      {!result && !runError && !loadError && !loading && (
        <p className="sqlpg-hint">{t.hint}</p>
      )}

      {result && result.columns.length > 0 && (
        <div className="sqlpg-table-wrap">
          <table className="sqlpg-table">
            <thead>
              <tr>
                {result.columns.map((c, i) => (
                  <th key={i}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.values.slice(0, 100).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell === null ? "∅" : String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
