import { SITE } from "./site";

interface FaqEntry {
  id: string;
  keywords: readonly string[];
  answer: string;
}

const ENTRIES: readonly FaqEntry[] = [
  {
    id: "resumen",
    keywords: ["resume", "resumen", "perfil", "quien es", "quién es", "30 segundos", "presenta"],
    answer:
      "David Naranjo Ramírez (Málaga/Madrid) combina Data Science y desarrollo web full-stack. Cursa a la vez un Máster en Data Science (Evolve Academy) y el ciclo superior DAW (Ilerna). Tres proyectos completos lo definen: un data warehouse en PostgreSQL con ETL auditado, un EDA de 10 años de datos del Washington Post, y una app web full-stack defendida ante tribunal. Su sello: toda cifra publicada se verifica contra los datos crudos.",
  },
  {
    id: "olist",
    keywords: ["olist", "warehouse", "dwh", "almacen", "almacén", "postgres", "postgresql", "estrella", "sql"],
    answer:
      "Data Warehouse Olist: PostgreSQL sobre el dataset público de e-commerce de Olist. Esquema en estrella (5 dimensiones + tabla de hechos), índices, vistas y función de utilidad. El ETL se auditó en dos pasadas — réplica en pandas y verificación contra los CSVs reales — con KPIs verificados cifra a cifra. Incluye un fix documentado de un INSERT colgado por estadísticas obsoletas del query planner (ANALYZE a mitad de transacción). Código: " +
      "https://github.com/dnarram/olist-ecommerce-datawarehouse",
  },
  {
    id: "fatalforce",
    keywords: ["fatal", "force", "eda", "washington", "tiroteo", "policia", "policía", "censo", "pandas"],
    answer:
      "EDAFatalForce: análisis exploratorio avanzado de la base Fatal Force del Washington Post (2015–2024), enriquecida con el censo ACS 2020 y legislación de bodycams (NCSL). La parte dura fue la limpieza: imputación de condados y corrección de miscodificaciones en flee_status y armed_with que afectaban a miles de filas, todo verificado contra el CSV crudo. Entregables: notebook, análisis narrativo y artículos de divulgación.",
  },
  {
    id: "rondaguide",
    keywords: ["ronda", "rondaguide", "turistic", "turístic", "nginx", "leaflet", "java", "mapa"],
    answer:
      "RondaGuide: app web turística de Ronda con arquitectura dual — Node.js/Express + Java HttpServer tras NGINX como reverse proxy — MySQL y mapas Leaflet. Proyecto final de DAW defendido ante tribunal, con auditoría técnica completa hasta un despliegue full-stack limpio.",
  },
  {
    id: "stack",
    keywords: ["stack", "tecnolog", "herramient", "lenguaje", "skills", "sabe", "experiencia con", "conoce"],
    answer:
      "Stack principal — Datos: Python, pandas, EDA, ETL, PostgreSQL, MySQL, DBeaver, Jupyter. Web: JavaScript/TypeScript, Node.js/Express, Java, HTML/CSS, Leaflet. Infra y tooling: NGINX, Git/GitHub, Linux y documentación técnica cuidada.",
  },
  {
    id: "formacion",
    keywords: ["formacion", "formación", "master", "máster", "estudia", "titulo", "título", "evolve", "ilerna", "daw"],
    answer:
      "Formación en curso y simultánea: Máster en Data Science en Evolve Academy y ciclo formativo de grado superior DAW (Desarrollo de Aplicaciones Web) en Ilerna. Llevar ambas a la vez y al día es parte del argumento: disciplina y gestión del tiempo demostradas, no declaradas.",
  },
  {
    id: "ubicacion",
    keywords: ["ubicacion", "ubicación", "donde", "dónde", "remoto", "malaga", "málaga", "disponib", "reubicar", "presencial"],
    answer:
      "David está en Málaga y Madrid, España. Disponible para trabajo en Málaga, Madrid y alrededores o en remoto. Abierto a reubicación si el proyecto lo requiere.",
  },
  {
    id: "metodo",
    keywords: ["metodo", "método", "audita", "verifica", "calidad", "como trabaja", "cómo trabaja", "proceso"],
    answer:
      "Su método en tres pasos: (1) replicar el pipeline con una implementación independiente para validar la lógica, (2) verificar cada cifra contra los datos crudos — si no cuadra, no se publica — y (3) documentar todo de forma reproducible y defendible. Lo ha aplicado en los tres proyectos del portfolio.",
  },
  {
    id: "contacto",
    keywords: ["contacto", "email", "correo", "linkedin", "cv", "curriculum", "currículum", "entrevista", "llamada"],
    answer: `Puedes escribirle a ${SITE.email} o encontrarle en GitHub (${SITE.github}) y LinkedIn. Responde rápido y puede preparar un CV adaptado al puesto en menos de un día.`,
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const DEFAULT_ANSWER =
  `Buena pregunta — en este modo respondo con una base de preguntas frecuentes y no la tengo cubierta. ` +
  `Puedes preguntarme por sus proyectos (Olist, EDAFatalForce, RondaGuide), su stack, formación, ubicación o cómo contactarle. ` +
  `Para cualquier otra cosa, escríbele directamente: ${SITE.email}.`;

const OFFER_ANSWER =
  "Parece que has pegado una oferta de trabajo — ¡gracias! El análisis de encaje punto por punto lo hace el modo IA del chat, que ahora mismo no está activo. " +
  "Mientras tanto, la referencia rápida: datos (Python, pandas, SQL/PostgreSQL, ETL, EDA), web (Node.js, Java, NGINX) y un método de verificación contra datos crudos. " +
  `Si quieres el análisis detallado, escríbele con la oferta a ${SITE.email} y te responde con el encaje honesto, incluido lo que no cumple.`;

/**
 * Matcher determinista: normaliza acentos, puntúa por coincidencias de
 * keywords y devuelve la entrada con mejor puntuación. Coste: 0 €.
 */
export function matchFaq(userText: string): string {
  const text = normalize(userText);
  if (text.length > 600) return OFFER_ANSWER;

  let best: { entry: FaqEntry; score: number } | null = null;
  for (const entry of ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (text.includes(normalize(kw))) score++;
    }
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  return best ? best.entry.answer : DEFAULT_ANSWER;
}
