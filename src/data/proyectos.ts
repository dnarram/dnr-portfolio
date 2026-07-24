/**
 * Proyectos — contenido de las páginas dedicadas de la v2.
 * Fuente de verdad: el CV maestro (src/data/cv.ts). Nada inventado.
 * "estado" controla el bloque de código/demo:
 *   - "publico": muestra enlace al repo
 *   - "pendiente": muestra aviso de publicación próxima
 *   - "privado": disclaimer + CTA de entrevista (caso RondaGuide)
 */

export interface Proyecto {
  slug: string;
  titulo: string;
  tagline: string;
  /** etiqueta corta de categoría para la card */
  categoria: string;
  stack: string[];
  resumen: string;
  arquitectura: string[];
  retos: Array<{ titulo: string; texto: string }>;
  decisiones: Array<{ titulo: string; texto: string }>;
  estado: "publico" | "pendiente" | "privado";
  repo?: string;
  demo?: string;
  articulo?: string;
  /** color de acento de la card (paleta DNR clara) */
  tono: "cobre" | "azul";
}

export const PROYECTOS: Proyecto[] = [
  {
    slug: "eda-fatal-force",
    titulo: "EDAFatalForce",
    tagline: "10 años de datos de fuerza letal policial en EE. UU., corregidos y contados",
    categoria: "Data Science · EDA",
    stack: ["Python", "pandas", "Jupyter", "ACS 2020 Census", "NCSL"],
    resumen:
      "Análisis exploratorio de la base Fatal Force del Washington Post (2015-2024), enriquecida con el censo ACS 2020 y datos de bodycams de la NCSL. El objetivo: analizar los datos de uso de fuerza letal policial en EE. UU. corrigiendo miscodificaciones del dataset y aportando el contexto socioeconómico sin el cual los números mienten.",
    arquitectura: [
      "Pipeline de limpieza (cleaning.py): imputación de condados y normalización de fuentes",
      "Ingeniería de variables (features.py): recodificación de flee_status y armed_with",
      "Notebook de análisis (eda.ipynb) reproducible de principio a fin",
      "Verificación de cada corrección contra el CSV crudo original",
    ],
    retos: [
      {
        titulo: "Miscodificaciones a escala de miles de filas",
        texto:
          "Los errores críticos estaban en el código de preparación: flee_status miscodificado y armed_with mal etiquetado, afectando a miles de registros. El reto fue detectarlos y corregirlos garantizando la trazabilidad frente a los datos originales — cada corrección se verificó contra el CSV crudo.",
      },
      {
        titulo: "Datos sin contexto que inducen a conclusiones erróneas",
        texto:
          "Las cifras absolutas por estado no significan nada sin población y contexto socioeconómico. Se enriqueció el dataset con el censo ACS 2020 y los datos de regulación de bodycams de la NCSL para que el análisis narrativo se sostuviera.",
      },
    ],
    decisiones: [
      {
        titulo: "Corregir el pipeline, no parchear el notebook",
        texto:
          "Las correcciones se hicieron en el código fuente de preparación (features.py, cleaning.py) y no como parches locales en el notebook: así cualquier re-ejecución produce datos correctos y el análisis es reproducible.",
      },
      {
        titulo: "Narrativa por audiencias",
        texto:
          "El mismo análisis se entregó en formatos distintos: notebook técnico, README, análisis narrativo y artículos adaptados por plataforma. Comunicar hallazgos a públicos diferentes es parte del trabajo de datos.",
      },
    ],
    estado: "pendiente",
    articulo:
      "Lo que aprendí analizando 10 años de violencia policial en EE.UU. — y por qué los datos sin contexto mienten (LinkedIn)",
    tono: "cobre",
  },
  {
    slug: "olist-data-warehouse",
    titulo: "Data Warehouse Olist",
    tagline: "Un esquema en estrella auditado sobre 100.000+ pedidos de e-commerce",
    categoria: "Data Engineering · SQL",
    stack: ["PostgreSQL", "SQL", "Modelado dimensional", "DBeaver", "Git"],
    resumen:
      "Almacén de datos analítico sobre el dataset del e-commerce brasileño Olist: transforma los datos transaccionales crudos en un modelo dimensional consultable para obtener KPIs de negocio. Esquema en estrella con 5 dimensiones y 1 tabla de hechos, con claves, índices, vistas y un proceso ETL auditado en dos pasadas completas.",
    arquitectura: [
      "Esquema en estrella: 5 dimensiones + 1 tabla de hechos",
      "Claves, índices y vistas para las consultas de negocio",
      "ETL en SQL auditado en dos pasadas completas",
      "Corrección de una errata histórica en los CSV de Olist y de una incoherencia entre el diagrama ER y el esquema",
    ],
    retos: [
      {
        titulo: "El INSERT que se colgaba indefinidamente",
        texto:
          "Un INSERT en la tabla de hechos se quedaba colgado sin error. El diagnóstico: estadísticas obsoletas del planificador de PostgreSQL tras cargar las dimensiones. La solución: ANALYZE sobre las cinco dimensiones a mitad de transacción en 02_data.sql. Resolver de raíz, no reintentar a ciegas.",
      },
      {
        titulo: "Una errata histórica en los datos de origen",
        texto:
          "Los CSV públicos de Olist arrastran una discrepancia de nombres de columna. Detectarla y documentarla fue parte de la auditoría: los datos de origen también se auditan.",
      },
    ],
    decisiones: [
      {
        titulo: "Esquema en estrella clásico",
        texto:
          "Para KPIs de negocio sobre un dataset transaccional, el modelo dimensional en estrella es la opción legible y eficiente: consultas simples, agregaciones rápidas y un diagrama que cualquier analista entiende.",
      },
      {
        titulo: "Auditoría como entregable",
        texto:
          "El proyecto incluye documentación de auditoría: cada KPI se verificó contra los datos crudos. Un informe de negocio construido sobre datos sin auditar es un riesgo, no un entregable.",
      },
    ],
    estado: "publico",
    repo: "https://github.com/dnarram/olist-ecommerce-datawarehouse",
    articulo:
      "Tres decisiones técnicas que habrían falsificado mi informe de negocio (LinkedIn)",
    tono: "azul",
  },
  {
    slug: "rondaguide",
    titulo: "RondaGuide",
    tagline: "Guía turística interactiva de Ronda con arquitectura de doble servidor",
    categoria: "Full-Stack · Web",
    stack: ["Node.js", "Express", "Java", "NGINX", "MySQL", "Leaflet"],
    resumen:
      "Aplicación web turística interactiva de Ronda con arquitectura de doble servidor tras NGINX: Node.js/Express y un servidor HTTP en Java, base de datos MySQL, mapas interactivos con Leaflet y frontend en HTML/CSS/JS. Es el proyecto final del ciclo DAW (ILERNA).",
    arquitectura: [
      "NGINX como proxy inverso delante de dos servidores",
      "Backend principal en Node.js/Express",
      "Servidor HTTP en Java para parte del servicio",
      "MySQL como base de datos y Leaflet para los mapas interactivos",
    ],
    retos: [
      {
        titulo: "Auditoría técnica completa antes del despliegue",
        texto:
          "La puesta a punto exigió corregir una desincronización de esquema, un desajuste de tipo en una clave foránea, datos semilla ausentes y credenciales expuestas — hasta lograr un despliegue full-stack limpio en local.",
      },
    ],
    decisiones: [
      {
        titulo: "Doble servidor tras NGINX",
        texto:
          "La arquitectura de doble servidor (Node + Java) tras un proxy NGINX permite repartir responsabilidades por tipo de petición y practicar la integración de tecnologías heterogéneas en un mismo despliegue.",
      },
    ],
    estado: "privado",
    tono: "cobre",
  },
  {
    slug: "portfolio-adaptativo",
    titulo: "Portfolio Adaptativo DNR",
    tagline: "Este mismo sitio: contenido que se adapta a quien lo visita, con IA integrada",
    categoria: "Web · IA aplicada",
    stack: ["Next.js 15", "TypeScript", "Vercel", "Groq API"],
    resumen:
      "El sitio que estás viendo. Un portfolio que adapta su contenido, narrativa y orden de proyectos según el tipo de visitante, con un concierge de IA capaz de responder sobre el perfil de David y generar un CV en PDF adaptado a la conversación — con modo FAQ determinista de coste cero como respaldo, analítica sin cookies y notificaciones de interés a Telegram.",
    arquitectura: [
      "Next.js 15 (App Router) + TypeScript en Vercel",
      "Concierge con cadena de IA (Groq → OpenRouter) y respaldo FAQ sin coste",
      "Generador de CV en PDF por bloques priorizados (react-pdf)",
      "Analítica cookieless y aviso de interés vía Telegram",
    ],
    retos: [
      {
        titulo: "Un CV generado por IA sin alucinaciones",
        texto:
          "La IA nunca redacta el CV: solo elige y ordena bloques de un CV maestro verificado. El servidor valida cada selección, garantiza la completitud del documento y verifica el tope de 2 páginas contra el PDF real renderizado.",
      },
      {
        titulo: "IA gratuita que no se cae",
        texto:
          "Los free tiers se agotan. La solución: una cadena de proveedores con fallback automático y degradación final a un modo FAQ determinista — el visitante siempre recibe respuesta, y si pide el CV, lo recibe igualmente.",
      },
    ],
    decisiones: [
      {
        titulo: "Contenido como datos",
        texto:
          "Todo el contenido vive en archivos de datos tipados (src/data/): actualizar el portfolio es editar contenido, no tocar lógica. El CV maestro es una única fuente de verdad de la que derivan el chat y el PDF.",
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