import type { Localized } from "@/data/i18n";

/**
 * Trayectoria (sección "Sobre mí").
 * Separada en Experiencia profesional y Formación, como todo el mundo la
 * entiende. Cada entrada lleva LOGROS de impacto (no tareas) que se despliegan
 * al pasar por encima. Todo verificado contra el CV maestro: nada inventado.
 */

export interface Etapa {
  id: string;
  rol: Localized;
  org: Localized;
  lugar: Localized;
  fechas: Localized;
  /** duración legible, para dar sensación de recorrido */
  duracion: Localized;
  /** una línea de contexto: qué era el puesto */
  contexto: Localized;
  /** logros de impacto — lo que de verdad vende */
  logros: Localized[];
  /** etiquetas de escaneo rápido */
  tags: string[];
}

export const EXPERIENCIA: Etapa[] = [
  {
    id: "pm-tier2",
    rol: { es: "Project Manager — Tier 2 Support", en: "Project Manager — Tier 2 Support" },
    org: { es: "C3i Solutions / HCLTech · Novo Nordisk ePID", en: "C3i Solutions / HCLTech · Novo Nordisk ePID" },
    lugar: { es: "Sofía, Bulgaria", en: "Sofia, Bulgaria" },
    fechas: { es: "may. 2023 – jul. 2023", en: "May 2023 – Jul 2023" },
    duracion: { es: "3 meses", en: "3 months" },
    contexto: {
      es: "Gestión de escalados y peticiones directas de cliente para la solución de software ePID.",
      en: "Ownership of escalations and direct client requests for the ePID software solution.",
    },
    logros: [
      {
        es: "Fundó el soporte de Tier 2 desde cero: diseñó los flujos de trabajo, los SOPs, la documentación técnica y los objetos de conocimiento en la base corporativa.",
        en: "Founded the Tier 2 support function from scratch: designed the workflows, SOPs, technical documentation and knowledge objects in the corporate knowledge base.",
      },
      {
        es: "Resolvió escalados de Tier 1 y peticiones directas del cliente, coordinando con las áreas técnicas y de negocio cuando la incidencia excedía al soporte.",
        en: "Resolved Tier 1 escalations and direct client requests, coordinating with technical and business areas when an issue went beyond support.",
      },
      {
        es: "Seguimiento de KPIs y comunicación con stakeholders internacionales en una organización matricial.",
        en: "Tracked KPIs and communicated with international stakeholders across a matrixed organisation.",
      },
    ],
    tags: ["SOPs", "KPIs", "Stakeholders", "Base de conocimiento"],
  },
  {
    id: "supervisor-sme",
    rol: { es: "Supervisor — Subject Matter Expert (SME)", en: "Supervisor — Subject Matter Expert (SME)" },
    org: { es: "C3i Solutions / HCLTech · soluciones de Pfizer", en: "C3i Solutions / HCLTech · Pfizer solutions" },
    lugar: { es: "Sofía, Bulgaria", en: "Sofia, Bulgaria" },
    fechas: { es: "dic. 2021 – may. 2023", en: "Dec 2021 – May 2023" },
    duracion: { es: "1 año 6 meses", en: "1 year 6 months" },
    contexto: {
      es: "Formación, desarrollo y aseguramiento de la calidad en el soporte de Emergencias Médicas y Desenmascaramiento de Pfizer.",
      en: "Training, development and quality assurance for Pfizer's Medical Emergency and Unblinding support.",
    },
    logros: [
      {
        es: "Lideró una operación de ~100 agentes: el equipo creció un 40% sin que la calidad del servicio se resintiera.",
        en: "Led a ~100-agent operation: the team grew 40% with no drop in service quality.",
      },
      {
        es: "Mantuvo los resultados de SLA por encima de lo exigido por el cliente atravesando la pandemia y el estallido de la guerra en Ucrania.",
        en: "Sustained SLA results above the client's contractual targets through the pandemic and the outbreak of the war in Ukraine.",
      },
      {
        es: "Analizó métricas y SLAs, con reporting y soporte a dirección para decidir acciones correctivas.",
        en: "Analysed service metrics and SLAs, reporting to management to inform corrective action.",
      },
    ],
    tags: ["~100 agentes", "+40% equipo", "SLA", "QA", "Reporting"],
  },
  {
    id: "team-lead",
    rol: { es: "Team Lead — Specialist", en: "Team Lead — Specialist" },
    org: { es: "C3i Solutions / HCLTech · aplicaciones de ensayos clínicos", en: "C3i Solutions / HCLTech · clinical-trial applications" },
    lugar: { es: "Sofía, Bulgaria", en: "Sofia, Bulgaria" },
    fechas: { es: "abr. 2021 – dic. 2021", en: "Apr 2021 – Dec 2021" },
    duracion: { es: "9 meses", en: "9 months" },
    contexto: {
      es: "Entrenamiento de agentes y control de calidad sobre varias aplicaciones de ensayos clínicos.",
      en: "Agent training and quality control across several clinical-trial applications.",
    },
    logros: [
      {
        es: "Responsable del entrenamiento de agentes para asistencia técnica en distintas aplicaciones de ensayos clínicos.",
        en: "Owned agent training for technical support across different clinical-trial applications.",
      },
      {
        es: "Encargado del control de calidad y de la revisión de los procedimientos internos.",
        en: "Responsible for quality control and the review of internal procedures.",
      },
      {
        es: "Coordinó incidencias escaladas de alto impacto con equipos internacionales.",
        en: "Coordinated high-impact escalated incidents with international teams.",
      },
    ],
    tags: ["Formación", "Control de calidad", "Procedimientos"],
  },
  {
    id: "senior-pfizer",
    rol: { es: "Asistencia técnica — Senior", en: "Technical Support — Senior" },
    org: { es: "C3i Solutions / HCLTech · proyecto Pfizer", en: "C3i Solutions / HCLTech · Pfizer account" },
    lugar: { es: "Sofía, Bulgaria", en: "Sofia, Bulgaria" },
    fechas: { es: "ago. 2020 – abr. 2021", en: "Aug 2020 – Apr 2021" },
    duracion: { es: "9 meses", en: "9 months" },
    contexto: {
      es: "Soporte técnico senior a usuarios de plataformas y software de ensayos clínicos de Pfizer.",
      en: "Senior technical support for users of Pfizer's clinical-trial platforms and software.",
    },
    logros: [
      {
        es: "Atendió a usuarios de plataformas de ensayos clínicos en casos de mayor complejidad técnica.",
        en: "Handled clinical-trial platform users on cases of greater technical complexity.",
      },
      {
        es: "Registró, priorizó y resolvió incidencias con trazabilidad completa, en colaboración con equipos internacionales de QA y desarrollo.",
        en: "Logged, prioritised and resolved incidents with full traceability, working with international QA and development teams.",
      },
    ],
    tags: ["Soporte senior", "Trazabilidad", "QA"],
  },
  {
    id: "pfizer",
    rol: { es: "Asistencia técnica", en: "Technical Support" },
    org: { es: "C3i Solutions / HCLTech · proyecto Pfizer", en: "C3i Solutions / HCLTech · Pfizer account" },
    lugar: { es: "Sofía, Bulgaria", en: "Sofia, Bulgaria" },
    fechas: { es: "jun. 2019 – ago. 2020", en: "Jun 2019 – Aug 2020" },
    duracion: { es: "1 año 3 meses", en: "1 year 3 months" },
    contexto: {
      es: "Soporte técnico a usuarios de plataformas y software de ensayos clínicos de Pfizer.",
      en: "Technical support for users of Pfizer's clinical-trial platforms and software.",
    },
    logros: [
      {
        es: "Soporte multilingüe (inglés, francés, portugués y español) por teléfono, correo y chat.",
        en: "Multilingual support (English, French, Portuguese and Spanish) by phone, email and chat.",
      },
      {
        es: "Progresó desde la cuenta de Medidata hasta el proyecto de Pfizer y, después, al nivel senior.",
        en: "Progressed from the Medidata account to the Pfizer project and then to senior level.",
      },
    ],
    tags: ["Multilingüe", "Ensayos clínicos"],
  },
  {
    id: "medidata",
    rol: { es: "Asistencia técnica — Medidata", en: "Technical Support — Medidata" },
    org: { es: "C3i Solutions / HCLTech · proyecto Medidata", en: "C3i Solutions / HCLTech · Medidata account" },
    lugar: { es: "Sofía, Bulgaria", en: "Sofia, Bulgaria" },
    fechas: { es: "ago. 2018 – jun. 2019", en: "Aug 2018 – Jun 2019" },
    duracion: { es: "11 meses", en: "11 months" },
    contexto: {
      es: "Primer puesto en IT corporativo: soporte de software y aplicaciones para Medidata.",
      en: "First role in corporate IT: software and application support for Medidata.",
    },
    logros: [
      {
        es: "Asistió a usuarios involucrados en ensayos clínicos sobre la plataforma Medidata Rave.",
        en: "Supported users involved in clinical trials on the Medidata Rave platform.",
      },
      {
        es: "Punto de partida de una progresión de agente a Project Manager en cinco años.",
        en: "The starting point of a five-year progression from agent to Project Manager.",
      },
    ],
    tags: ["Medidata Rave", "Ensayos clínicos"],
  },
  {
    id: "docencia",
    rol: { es: "Docencia de español y traducción", en: "Spanish Teaching & Translation" },
    org: { es: "Lycée Jean Monnet · Instituto Cervantes París · PerMondo", en: "Lycée Jean Monnet · Instituto Cervantes Paris · PerMondo" },
    lugar: { es: "Francia / España", en: "France / Spain" },
    fechas: { es: "oct. 2016 – dic. 2017", en: "Oct 2016 – Dec 2017" },
    duracion: { es: "1 año 3 meses", en: "1 year 3 months" },
    contexto: {
      es: "Etapa previa a la tecnología: enseñanza de idiomas y traducción profesional.",
      en: "The stage before technology: language teaching and professional translation.",
    },
    logros: [
      {
        es: "Enseñó español a alumnado de secundaria y creó material didáctico de competencia oral.",
        en: "Taught Spanish to secondary students and created oral-competence teaching materials.",
      },
      {
        es: "Apoyó las sesiones de examen oficial DELE en el Instituto Cervantes de París.",
        en: "Supported official DELE examination sessions at the Instituto Cervantes in Paris.",
      },
      {
        es: "Tradujo y revisó de forma voluntaria para la ONG PerMondo.",
        en: "Translated and proofread on a voluntary basis for the NGO PerMondo.",
      },
    ],
    tags: ["Docencia", "Traducción", "DELE"],
  },
];

export const FORMACION: Etapa[] = [
  {
    id: "master-ds",
    rol: { es: "Máster en Data Science e Inteligencia Artificial", en: "MSc in Data Science & Artificial Intelligence" },
    org: { es: "Evolve Academy", en: "Evolve Academy" },
    lugar: { es: "España", en: "Spain" },
    fechas: { es: "abr. 2026 – actualidad", en: "Apr 2026 – present" },
    duracion: { es: "en curso", en: "in progress" },
    contexto: {
      es: "Formación actual en ciencia de datos, ingeniería de datos e IA aplicada.",
      en: "Current training in data science, data engineering and applied AI.",
    },
    logros: [
      {
        es: "Data Warehouse Olist: modelo dimensional en estrella en PostgreSQL con ETL auditado sobre más de 100.000 pedidos.",
        en: "Olist Data Warehouse: a star-schema dimensional model in PostgreSQL with an audited ETL over 100,000+ orders.",
      },
      {
        es: "EDAFatalForce: análisis exploratorio en Python de diez años de datos, con corrección de miscodificaciones verificada contra la fuente cruda.",
        en: "EDAFatalForce: exploratory analysis in Python of ten years of data, correcting miscodings verified against the raw source.",
      },
    ],
    tags: ["Python", "SQL", "PostgreSQL", "ETL", "Machine Learning"],
  },
  {
    id: "daw",
    rol: { es: "CFGS — Desarrollo de Aplicaciones Web (DAW)", en: "Higher Diploma — Web Application Development" },
    org: { es: "ILERNA", en: "ILERNA" },
    lugar: { es: "España", en: "Spain" },
    fechas: { es: "finalizando", en: "completing" },
    duracion: { es: "en curso", en: "in progress" },
    contexto: {
      es: "Ciclo superior de desarrollo web full-stack, de la base de datos al despliegue.",
      en: "Higher vocational degree in full-stack web development, from database to deployment.",
    },
    logros: [
      {
        es: "RondaGuide, proyecto final: arquitectura de doble servidor (Node.js/Express y Java) tras un proxy NGINX, con MySQL y mapas interactivos.",
        en: "RondaGuide, final project: a dual-server architecture (Node.js/Express and Java) behind an NGINX proxy, with MySQL and interactive maps.",
      },
      {
        es: "Auditoría técnica previa al despliegue: corrigió desincronización de esquema, un desajuste de tipo en clave foránea y credenciales expuestas.",
        en: "Pre-deployment technical audit: fixed a schema desynchronisation, a foreign-key type mismatch and exposed credentials.",
      },
    ],
    tags: ["Node.js", "Java", "MySQL", "NGINX", "JavaScript"],
  },
  {
    id: "master-prof",
    rol: { es: "Máster en Profesorado — especialidad Francés", en: "MA in Teacher Training — French" },
    org: { es: "Universidad de Málaga", en: "University of Málaga" },
    lugar: { es: "Málaga, España", en: "Málaga, Spain" },
    fechas: { es: "2017 – 2018", en: "2017 – 2018" },
    duracion: { es: "1 año", en: "1 year" },
    contexto: {
      es: "Formación en didáctica y comunicación pedagógica.",
      en: "Training in didactics and pedagogical communication.",
    },
    logros: [
      {
        es: "Base formal para explicar materia compleja a audiencias distintas: la misma habilidad que hoy aplica a la documentación técnica.",
        en: "A formal grounding in explaining complex subject matter to different audiences — the same skill applied today to technical documentation.",
      },
    ],
    tags: ["Didáctica", "Comunicación"],
  },
  {
    id: "grado-traduccion",
    rol: { es: "Grado en Traducción e Interpretación", en: "BA in Translation & Interpreting" },
    org: { es: "Universidad de Málaga", en: "University of Málaga" },
    lugar: { es: "Málaga, España", en: "Málaga, Spain" },
    fechas: { es: "2016", en: "2016" },
    duracion: { es: "4 años", en: "4 years" },
    contexto: {
      es: "Formación de origen: precisión con el lenguaje en cuatro idiomas de trabajo.",
      en: "Original training: precision with language across four working languages.",
    },
    logros: [
      {
        es: "Dominio profesional de inglés, francés y portugués además del español nativo.",
        en: "Professional command of English, French and Portuguese alongside native Spanish.",
      },
      {
        es: "El hábito de traducir con exactitud es hoy su forma de trabajar los datos: verificar siempre contra la fuente.",
        en: "The habit of translating with precision is today how he works with data: always verify against the source.",
      },
    ],
    tags: ["4 idiomas", "Precisión"],
  },
];

/** Certificaciones — bloque compacto. */
export const CERTIFICACIONES: Array<{ nombre: Localized; emisor: Localized; anio: string }> = [
  {
    nombre: { es: "ICH Good Clinical Practice E6(R2)", en: "ICH Good Clinical Practice E6(R2)" },
    emisor: { es: "Global Health Training Centre", en: "Global Health Training Centre" },
    anio: "2020",
  },
  {
    nombre: { es: "Acreditación de examinadores DELE B1–B2", en: "DELE B1–B2 Examiner Accreditation" },
    emisor: { es: "Instituto Cervantes", en: "Instituto Cervantes" },
    anio: "2017",
  },
];

/** Métricas de cabecera: lo que un recruiter retiene en tres segundos. */
export const METRICAS: Array<{ valor: string; etiqueta: Localized }> = [
  { valor: "5", etiqueta: { es: "años en IT corporativo internacional", en: "years in international corporate IT" } },
  { valor: "~100", etiqueta: { es: "personas en la operación que supervisó", en: "people in the operation he supervised" } },
  { valor: "4", etiqueta: { es: "idiomas de trabajo", en: "working languages" } },
  { valor: "4", etiqueta: { es: "proyectos técnicos publicados", en: "technical projects published" } },
  { valor: "8", etiqueta: { es: "artículos técnicos divulgados", en: "technical articles published" } },
];

/** Idiomas con nivel. */
export const IDIOMAS: Array<{ idioma: Localized; nivel: string; pct: number }> = [
  { idioma: { es: "Español", en: "Spanish" }, nivel: "Nativo", pct: 100 },
  { idioma: { es: "Inglés", en: "English" }, nivel: "C1", pct: 85 },
  { idioma: { es: "Francés", en: "French" }, nivel: "C1", pct: 85 },
  { idioma: { es: "Portugués", en: "Portuguese" }, nivel: "B2", pct: 65 },
];

/** Cadenas de interfaz propias de esta sección (evita tocar i18n.ts). */
export const TRAYECTORIA_UI = {
  es: {
    experience: "Experiencia profesional",
    education: "Formación",
    certifications: "Certificaciones",
    languages: "Idiomas",
    achievements: "Logros",
    hint: "Pasa por encima de una etapa para ver sus logros",
    tapHint: "Toca una etapa para ver sus logros",
  },
  en: {
    experience: "Professional experience",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
    achievements: "Key achievements",
    hint: "Hover over a stage to see its achievements",
    tapHint: "Tap a stage to see its achievements",
  },
} as const;

