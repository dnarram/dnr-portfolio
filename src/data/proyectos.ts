import type { Localized } from "./i18n";

/**
 * Proyectos — contenido bilingüe de las páginas dedicadas de la v2.
 * Fuente de verdad: el CV maestro (src/data/cv.ts). Nada inventado.
 */

export interface Proyecto {
  slug: string;
  titulo: string; // nombre propio: igual en ambos idiomas
  tagline: Localized;
  categoria: Localized;
  stack: string[];
  resumen: Localized;
  arquitectura: Localized[];
  retos: Array<{ titulo: Localized; texto: Localized }>;
  decisiones: Array<{ titulo: Localized; texto: Localized }>;
  estado: "publico" | "pendiente" | "privado";
  repo?: string;
  demo?: string;
  articulo?: Localized;
  tono: "cobre" | "azul";
}

export const PROYECTOS: Proyecto[] = [
  {
    slug: "eda-fatal-force",
    titulo: "EDAFatalForce",
    tagline: {
      es: "10 años de datos de fuerza letal policial en EE. UU., corregidos y contados",
      en: "10 years of US police use-of-force data, corrected and told",
    },
    categoria: { es: "Data Science · EDA", en: "Data Science · EDA" },
    stack: ["Python", "pandas", "Jupyter", "ACS 2020 Census", "NCSL"],
    resumen: {
      es: "Análisis exploratorio de la base Fatal Force del Washington Post (2015-2024), enriquecida con el censo ACS 2020 y datos de bodycams de la NCSL. El objetivo: analizar los datos de uso de fuerza letal policial en EE. UU. corrigiendo miscodificaciones del dataset y aportando el contexto socioeconómico sin el cual los números mienten.",
      en: "Exploratory analysis of the Washington Post's Fatal Force dataset (2015-2024), enriched with the ACS 2020 census and NCSL bodycam data. The goal: analyse US police lethal-force data while correcting dataset miscodings and adding the socioeconomic context without which the numbers mislead.",
    },
    arquitectura: [
      { es: "Pipeline de limpieza (cleaning.py): imputación de condados y normalización de fuentes", en: "Cleaning pipeline (cleaning.py): county imputation and source normalisation" },
      { es: "Ingeniería de variables (features.py): recodificación de flee_status y armed_with", en: "Feature engineering (features.py): recoding of flee_status and armed_with" },
      { es: "Notebook de análisis (eda.ipynb) reproducible de principio a fin", en: "Analysis notebook (eda.ipynb), reproducible end to end" },
      { es: "Verificación de cada corrección contra el CSV crudo original", en: "Every correction verified against the original raw CSV" },
    ],
    retos: [
      {
        titulo: { es: "Miscodificaciones a escala de miles de filas", en: "Miscodings across thousands of rows" },
        texto: {
          es: "Los errores críticos estaban en el código de preparación: flee_status miscodificado y armed_with mal etiquetado, afectando a miles de registros. El reto fue detectarlos y corregirlos garantizando la trazabilidad frente a los datos originales — cada corrección se verificó contra el CSV crudo.",
          en: "The critical errors were in the preparation code: miscoded flee_status and mislabelled armed_with, affecting thousands of records. The challenge was detecting and fixing them while keeping full traceability to the original data — every fix verified against the raw CSV.",
        },
      },
      {
        titulo: { es: "Datos sin contexto que inducen a conclusiones erróneas", en: "Data without context leads to wrong conclusions" },
        texto: {
          es: "Las cifras absolutas por estado no significan nada sin población y contexto socioeconómico. Se enriqueció el dataset con el censo ACS 2020 y los datos de regulación de bodycams de la NCSL para que el análisis narrativo se sostuviera.",
          en: "Absolute counts per state mean nothing without population and socioeconomic context. The dataset was enriched with the ACS 2020 census and NCSL bodycam-regulation data so the narrative analysis would hold up.",
        },
      },
    ],
    decisiones: [
      {
        titulo: { es: "Corregir el pipeline, no parchear el notebook", en: "Fix the pipeline, don't patch the notebook" },
        texto: {
          es: "Las correcciones se hicieron en el código fuente de preparación (features.py, cleaning.py) y no como parches locales en el notebook: así cualquier re-ejecución produce datos correctos y el análisis es reproducible.",
          en: "Fixes went into the preparation source code (features.py, cleaning.py) rather than local patches in the notebook: any re-run then produces correct data and the analysis stays reproducible.",
        },
      },
      {
        titulo: { es: "Narrativa por audiencias", en: "Narrative by audience" },
        texto: {
          es: "El mismo análisis se entregó en formatos distintos: notebook técnico, README, análisis narrativo y artículos adaptados por plataforma. Comunicar hallazgos a públicos diferentes es parte del trabajo de datos.",
          en: "The same analysis was delivered in different formats: technical notebook, README, narrative analysis and platform-adapted articles. Communicating findings to different audiences is part of the data work.",
        },
      },
    ],
    estado: "publico",
    repo: "https://github.com/dnarram/Proyecto-Master-DataScience-Evolve-DavidNaranjoRamirez-EDAFatalForce",
    articulo: {
      es: "Lo que aprendí analizando 10 años de violencia policial en EE.UU. — y por qué los datos sin contexto mienten (LinkedIn)",
      en: "What I learned analysing 10 years of US police violence — and why data without context lies (LinkedIn)",
    },
    tono: "cobre",
  },
  {
    slug: "olist-data-warehouse",
    titulo: "Data Warehouse Olist",
    tagline: {
      es: "Un esquema en estrella auditado sobre 100.000+ pedidos de e-commerce",
      en: "An audited star schema over 100,000+ e-commerce orders",
    },
    categoria: { es: "Data Engineering · SQL", en: "Data Engineering · SQL" },
    stack: ["PostgreSQL", "SQL", "Modelado dimensional", "DBeaver", "Git"],
    resumen: {
      es: "Almacén de datos analítico sobre el dataset del e-commerce brasileño Olist: transforma los datos transaccionales crudos en un modelo dimensional consultable para obtener KPIs de negocio. Esquema en estrella con 5 dimensiones y 1 tabla de hechos, con claves, índices, vistas y un proceso ETL auditado en dos pasadas completas.",
      en: "Analytical data warehouse over the Brazilian e-commerce Olist dataset: it turns raw transactional data into a queryable dimensional model for business KPIs. Star schema with 5 dimensions and 1 fact table, with keys, indexes, views and an ETL process audited over two full passes.",
    },
    arquitectura: [
      { es: "Esquema en estrella: 5 dimensiones + 1 tabla de hechos", en: "Star schema: 5 dimensions + 1 fact table" },
      { es: "Claves, índices y vistas para las consultas de negocio", en: "Keys, indexes and views for business queries" },
      { es: "ETL en SQL auditado en dos pasadas completas", en: "SQL ETL audited over two full passes" },
      { es: "Corrección de una errata histórica en los CSV de Olist y de una incoherencia entre el diagrama ER y el esquema", en: "Fixed a historical typo in the Olist CSVs and an inconsistency between the ER diagram and the schema" },
    ],
    retos: [
      {
        titulo: { es: "El INSERT que se colgaba indefinidamente", en: "The INSERT that hung indefinitely" },
        texto: {
          es: "Un INSERT en la tabla de hechos se quedaba colgado sin error. El diagnóstico: estadísticas obsoletas del planificador de PostgreSQL tras cargar las dimensiones. La solución: ANALYZE sobre las cinco dimensiones a mitad de transacción en 02_data.sql. Resolver de raíz, no reintentar a ciegas.",
          en: "An INSERT into the fact table hung with no error. The diagnosis: stale PostgreSQL planner statistics after loading the dimensions. The fix: ANALYZE on the five dimensions mid-transaction in 02_data.sql. Root-cause resolution, not blind retries.",
        },
      },
      {
        titulo: { es: "Una errata histórica en los datos de origen", en: "A historical typo in the source data" },
        texto: {
          es: "Los CSV públicos de Olist arrastran una discrepancia de nombres de columna. Detectarla y documentarla fue parte de la auditoría: los datos de origen también se auditan.",
          en: "The public Olist CSVs carry a column-name discrepancy. Spotting and documenting it was part of the audit: source data gets audited too.",
        },
      },
    ],
    decisiones: [
      {
        titulo: { es: "Esquema en estrella clásico", en: "Classic star schema" },
        texto: {
          es: "Para KPIs de negocio sobre un dataset transaccional, el modelo dimensional en estrella es la opción legible y eficiente: consultas simples, agregaciones rápidas y un diagrama que cualquier analista entiende.",
          en: "For business KPIs over a transactional dataset, the star dimensional model is the readable, efficient choice: simple queries, fast aggregations and a diagram any analyst understands.",
        },
      },
      {
        titulo: { es: "Auditoría como entregable", en: "Audit as a deliverable" },
        texto: {
          es: "El proyecto incluye documentación de auditoría: cada KPI se verificó contra los datos crudos. Un informe de negocio construido sobre datos sin auditar es un riesgo, no un entregable.",
          en: "The project includes audit documentation: every KPI was verified against the raw data. A business report built on unaudited data is a risk, not a deliverable.",
        },
      },
    ],
    estado: "publico",
    repo: "https://github.com/dnarram/olist-ecommerce-datawarehouse",
    articulo: {
      es: "Tres decisiones técnicas que habrían falsificado mi informe de negocio (LinkedIn)",
      en: "Three technical decisions that would have falsified my business report (LinkedIn)",
    },
    tono: "azul",
  },
  {
    slug: "rondaguide",
    titulo: "RondaGuide",
    tagline: {
      es: "Guía turística interactiva de Ronda con arquitectura de doble servidor",
      en: "Interactive tourist guide of Ronda with a dual-server architecture",
    },
    categoria: { es: "Full-Stack · Web", en: "Full-Stack · Web" },
    stack: ["Node.js", "Express", "Java", "NGINX", "MySQL", "Leaflet"],
    resumen: {
      es: "Aplicación web turística interactiva de Ronda con arquitectura de doble servidor tras NGINX: Node.js/Express y un servidor HTTP en Java, base de datos MySQL, mapas interactivos con Leaflet y frontend en HTML/CSS/JS. Es el proyecto final del ciclo DAW (ILERNA).",
      en: "Interactive tourist web app for Ronda with a dual-server architecture behind NGINX: Node.js/Express and a Java HTTP server, a MySQL database, interactive maps with Leaflet and an HTML/CSS/JS frontend. It's the final project of the DAW diploma (ILERNA).",
    },
    arquitectura: [
      { es: "NGINX como proxy inverso delante de dos servidores", en: "NGINX as a reverse proxy in front of two servers" },
      { es: "Backend principal en Node.js/Express", en: "Main backend in Node.js/Express" },
      { es: "Servidor HTTP en Java para parte del servicio", en: "Java HTTP server for part of the service" },
      { es: "MySQL como base de datos y Leaflet para los mapas interactivos", en: "MySQL as the database and Leaflet for the interactive maps" },
    ],
    retos: [
      {
        titulo: { es: "Auditoría técnica completa antes del despliegue", en: "Full technical audit before deployment" },
        texto: {
          es: "La puesta a punto exigió corregir una desincronización de esquema, un desajuste de tipo en una clave foránea, datos semilla ausentes y credenciales expuestas — hasta lograr un despliegue full-stack limpio en local.",
          en: "Getting it production-ready required fixing a schema desync, a foreign-key type mismatch, missing seed data and exposed credentials — until achieving a clean full-stack deployment locally.",
        },
      },
    ],
    decisiones: [
      {
        titulo: { es: "Doble servidor tras NGINX", en: "Dual server behind NGINX" },
        texto: {
          es: "La arquitectura de doble servidor (Node + Java) tras un proxy NGINX permite repartir responsabilidades por tipo de petición y practicar la integración de tecnologías heterogéneas en un mismo despliegue.",
          en: "The dual-server architecture (Node + Java) behind an NGINX proxy splits responsibilities by request type and exercises the integration of heterogeneous technologies in a single deployment.",
        },
      },
    ],
    estado: "privado",
    tono: "cobre",
  },
  {
    slug: "portfolio-adaptativo",
    titulo: "Portfolio Adaptativo DNR",
    tagline: {
      es: "Este mismo sitio: contenido que se adapta a quien lo visita, con IA integrada",
      en: "This very site: content that adapts to each visitor, with built-in AI",
    },
    categoria: { es: "Web · IA aplicada", en: "Web · Applied AI" },
    stack: ["Next.js 15", "TypeScript", "Vercel", "Groq API"],
    resumen: {
      es: "El sitio que estás viendo. Un portfolio que adapta su contenido, narrativa y orden de proyectos según el tipo de visitante, con un concierge de IA capaz de responder sobre el perfil de David y generar un CV en PDF adaptado a la conversación — con modo FAQ determinista de coste cero como respaldo, analítica sin cookies y notificaciones de interés a Telegram.",
      en: "The site you're looking at. A portfolio that adapts its content, narrative and project order to the visitor type, with an AI concierge that answers questions about David's profile and generates a PDF CV tailored to the conversation — with a zero-cost deterministic FAQ fallback, cookieless analytics and interest notifications to Telegram.",
    },
    arquitectura: [
      { es: "Next.js 15 (App Router) + TypeScript en Vercel", en: "Next.js 15 (App Router) + TypeScript on Vercel" },
      { es: "Concierge con cadena de IA (Groq → OpenRouter) y respaldo FAQ sin coste", en: "Concierge with an AI chain (Groq → OpenRouter) and a zero-cost FAQ fallback" },
      { es: "Generador de CV en PDF por bloques priorizados (react-pdf)", en: "PDF CV generator from prioritised blocks (react-pdf)" },
      { es: "Analítica cookieless y aviso de interés vía Telegram", en: "Cookieless analytics and interest alerts via Telegram" },
    ],
    retos: [
      {
        titulo: { es: "Un CV generado por IA sin alucinaciones", en: "An AI-generated CV without hallucinations" },
        texto: {
          es: "La IA nunca redacta el CV: solo elige y ordena bloques de un CV maestro verificado. El servidor valida cada selección, garantiza la completitud del documento y verifica el tope de 2 páginas contra el PDF real renderizado.",
          en: "The AI never writes the CV: it only selects and orders blocks from a verified master CV. The server validates each selection, guarantees the document's completeness and checks the 2-page limit against the actually rendered PDF.",
        },
      },
      {
        titulo: { es: "IA gratuita que no se cae", en: "Free AI that never goes down" },
        texto: {
          es: "Los free tiers se agotan. La solución: una cadena de proveedores con fallback automático y degradación final a un modo FAQ determinista — el visitante siempre recibe respuesta, y si pide el CV, lo recibe igualmente.",
          en: "Free tiers run out. The solution: a provider chain with automatic failover and a final fallback to a deterministic FAQ mode — the visitor always gets an answer, and if they ask for the CV, they get it too.",
        },
      },
    ],
    decisiones: [
      {
        titulo: { es: "Contenido como datos", en: "Content as data" },
        texto: {
          es: "Todo el contenido vive en archivos de datos tipados (src/data/): actualizar el portfolio es editar contenido, no tocar lógica. El CV maestro es una única fuente de verdad de la que derivan el chat y el PDF.",
          en: "All content lives in typed data files (src/data/): updating the portfolio means editing content, not touching logic. The master CV is a single source of truth from which the chat and the PDF derive.",
        },
      },
    ],
    estado: "publico",
    repo: "https://github.com/dnarram",
    demo: "https://dnr-portfolio-omega.vercel.app",
    tono: "azul",
  },
];

export function getProyecto(slug: string): Proyecto | undefined {
  return PROYECTOS.find((p) => p.slug === slug);
}
