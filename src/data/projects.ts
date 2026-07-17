import type { PersonaId } from "./personas";

export interface Project {
  id: string;
  name: string;
  kind: string;
  stack: readonly string[];
  metrics: readonly string[];
  desc: Record<PersonaId, string>;
  warStory: string;
  /** Enlace al repositorio. TODO(David): añadir repos de EDAFatalForce y RondaGuide cuando estén públicos. */
  repo?: string;
}

export const PROJECTS: Record<string, Project> = {
  olist: {
    id: "olist",
    name: "Data Warehouse Olist",
    kind: "Data engineering · SQL",
    stack: ["PostgreSQL", "SQL", "Python", "pandas", "DBeaver", "Git"],
    metrics: [
      "Esquema estrella: 5 dim + 1 fact",
      "ETL auditado en 2 pasadas",
      "KPIs verificados cifra a cifra",
    ],
    desc: {
      hr: "Construí un almacén de datos que convierte cientos de miles de registros de una plataforma de e-commerce en indicadores fiables para tomar decisiones. Cada cifra del informe final está verificada contra los datos originales: si un número no cuadra, no se publica.",
      tech: "Data warehouse en PostgreSQL sobre el dataset público de Olist (e-commerce brasileño). Esquema en estrella con 5 dimensiones, tabla de hechos, índices, vistas y función de utilidad. ETL auditado en dos pasadas: réplica del pipeline en pandas para validar la lógica, y verificación final contra los CSVs reales con KPIs exactos.",
      dev: "DWH en PostgreSQL sobre Olist. Lo interesante no fue el modelo estrella, fue todo lo que se rompió por el camino: un typo histórico en los nombres de columna del propio dataset y una carga de hechos que se colgaba misteriosamente (ver historia abajo).",
      fan: "Cogí los datos reales de una tienda online brasileña enorme —cientos de miles de pedidos— y los ordené en una estructura que permite responder al instante preguntas como: ¿qué se vende más?, ¿dónde?, ¿en qué época del año?",
    },
    warStory:
      "El INSERT de la tabla de hechos se colgaba sin lanzar error. Causa raíz: estadísticas obsoletas del query planner — las 5 dimensiones se cargaban en la misma transacción y el planificador elegía un plan pésimo para el JOIN. Fix: ANALYZE sobre las cinco dimensiones a mitad de transacción. De colgado indefinido a segundos.",
    repo: "https://github.com/dnarram/olist-ecommerce-datawarehouse",
  },
  fatalforce: {
    id: "fatalforce",
    name: "EDAFatalForce",
    kind: "Data science · EDA",
    stack: ["Python", "pandas", "Jupyter", "matplotlib / seaborn", "ACS Census"],
    metrics: [
      "10 años de datos (2015–2024)",
      "3 fuentes cruzadas",
      "Miles de filas corregidas en auditoría",
    ],
    desc: {
      hr: "Análisis riguroso de un tema socialmente sensible: los tiroteos policiales con resultado de muerte en EE. UU. Lo que más valoro del proyecto es la honestidad estadística — sin titulares fáciles, con cada afirmación verificada y comunicada para que la entienda cualquier lector.",
      tech: "EDA avanzado sobre la base Fatal Force del Washington Post (2015–2024), enriquecida con el censo ACS 2020 y legislación de bodycams (NCSL). Limpieza no trivial: imputación de condados ausentes y corrección de miscodificaciones en flee_status y armed_with que afectaban a miles de filas. Entregables: notebook completo, análisis narrativo y artículos de divulgación.",
      dev: "Dos bugs silenciosos en el feature engineering: flee_status mal clasificado y armed_with mal etiquetado. No rompían nada — solo sesgaban miles de filas y, con ellas, las conclusiones. Se detectaron auditando contra el CSV crudo en vez de confiar en el pipeline. Moraleja: los tests no sustituyen a la auditoría de datos.",
      fan: "Diez años de datos sobre tiroteos policiales en EE. UU., cruzados con el censo, contados como una historia que puedes leer sin saber estadística. La parte difícil no fue el análisis: fue asegurarme de que cada frase fuera verdad.",
    },
    warStory:
      "flee_status y armed_with venían mal codificados desde el feature engineering. Ningún test fallaba, ningún gráfico parecía raro — pero miles de filas mentían. La única red de seguridad fue re-derivar las features desde el CSV crudo y comparar distribuciones. Desde entonces: toda cifra publicada se verifica contra la fuente.",
  },
  rondaguide: {
    id: "rondaguide",
    name: "RondaGuide",
    kind: "Full-stack web",
    stack: ["Node.js / Express", "Java", "NGINX", "MySQL", "Leaflet", "HTML / CSS / JS"],
    metrics: [
      "Arquitectura dual tras NGINX",
      "Despliegue full-stack completo",
      "Defendido ante tribunal",
    ],
    desc: {
      hr: "Un producto completo de principio a fin: una guía turística interactiva de Ronda, mi ciudad, desde la idea hasta la aplicación desplegada y defendida ante un tribunal académico. Demuestra algo que valoro: no solo escribo código, entrego y defiendo un producto.",
      tech: "Aplicación web turística con arquitectura dual: Node.js/Express y Java HttpServer tras NGINX como reverse proxy, MySQL como base de datos y mapas interactivos con Leaflet. Del diseño del esquema SQL al despliegue completo, con documentación de instalación reproducible.",
      dev: "Arquitectura dual (Node + Java tras NGINX) que suena sofisticada hasta que un tribunal te pide explicar el enrutado por petición y descubres tus propios puntos ciegos. Además: esquema desincronizado con el código, tipos de FK que no casaban y seeds ausentes. Todo depurado hasta un despliegue limpio.",
      fan: "Una guía interactiva de Ronda —mi ciudad— con mapas para descubrir el Puente Nuevo, el Tajo y los rincones que no salen en las guías. Fue mi proyecto final de desarrollo web y la defendí ante un tribunal.",
    },
    warStory:
      "La importación de la base de datos fallaba en bucle: orden de columnas distinto entre esquema y seeds, y una FK con tipo incompatible que MySQL rechazaba con mensajes crípticos. Se resolvió iterando importación a importación hasta el despliegue limpio. Bonus: aprender a explicar ante tribunal cómo enruta NGINX cada petición entre dos servidores.",
  },
};

export const SKILL_GROUPS = [
  {
    name: "Datos",
    items: ["Python", "pandas", "EDA", "ETL", "PostgreSQL", "MySQL", "DBeaver", "Jupyter"],
  },
  {
    name: "Web",
    items: ["JavaScript / TypeScript", "Node.js / Express", "Java", "HTML / CSS", "Leaflet", "REST"],
  },
  {
    name: "Infra y tooling",
    items: ["NGINX", "Git / GitHub", "Linux", "Documentación técnica"],
  },
] as const;

export const SKILLS_HUMAN = [
  "Análisis de datos y visualización",
  "SQL y bases de datos",
  "Desarrollo web full-stack",
  "Comunicación técnica clara",
  "Dos formaciones exigentes en paralelo",
] as const;

/** Método de trabajo — es una secuencia real, por eso va numerada. */
export const METHOD_STEPS = [
  {
    n: "01",
    title: "Replicar",
    body: "Reproduzco el pipeline con una segunda implementación independiente (p. ej. pandas frente a SQL) para validar la lógica.",
  },
  {
    n: "02",
    title: "Verificar contra el crudo",
    body: "Cada KPI y cada feature se comparan contra los CSVs originales. Si una cifra no cuadra, no se publica.",
  },
  {
    n: "03",
    title: "Documentar y defender",
    body: "READMEs reproducibles, decisiones justificadas y preparación para defenderlo ante quien pregunte — tribunal o tech lead.",
  },
] as const;
