export type PersonaId = "hr" | "tech" | "dev" | "fan";

export interface Persona {
  id: PersonaId;
  label: string;
  gateTitle: string;
  gateDesc: string;
  chip: string;
  tagline: string;
  lede: string;
  projectOrder: readonly string[];
  showStack: boolean;
  showWarStory: boolean;
  showMethod: boolean;
  skillsMode: "grid" | "human" | "none";
  ctaTitle: string;
  ctaBody: string;
  ctaKind: "email" | "github";
  ctaLabel: string;
  chatHints: readonly string[];
}

export const PERSONAS: Record<PersonaId, Persona> = {
  hr: {
    id: "hr",
    label: "HR / People",
    gateTitle: "Trabajo en RRHH o People",
    gateDesc: "Quiero evaluar encaje, trayectoria y comunicación.",
    chip: "perfil: hr_people",
    tagline: "Datos que se convierten en decisiones.\nHistorias que se entienden.",
    lede:
      "Curso a la vez un Máster en Data Science y un ciclo superior de Desarrollo Web — dos formaciones exigentes, simultáneas y al día. Eso dice más de mi disciplina que cualquier adjetivo. Lo que construyo lo termino, lo verifico y lo sé explicar a cualquier audiencia.",
    projectOrder: ["fatalforce", "rondaguide", "olist"],
    showStack: false,
    showWarStory: false,
    showMethod: false,
    skillsMode: "human",
    ctaTitle: "¿Hablamos?",
    ctaBody:
      "Disponible para entrevistas presenciales en Málaga o en remoto. Puedo enviarte un CV adaptado al puesto en menos de un día.",
    ctaKind: "email",
    ctaLabel: "Contactar con David",
    chatHints: [
      "Resume su perfil en 30 segundos",
      "¿Cómo compagina dos formaciones a la vez?",
      "¿Encaja con esta oferta? (pega el texto)",
    ],
  },
  tech: {
    id: "tech",
    label: "Tech recruiter",
    gateTitle: "Recruiter técnico / Hiring manager",
    gateDesc: "Quiero ver stack, arquitectura y resultados concretos.",
    chip: "perfil: tech_recruiter",
    tagline: "Data engineering + full-stack.\nCero cifras sin auditar.",
    lede:
      "Python/pandas y SQL en el lado de datos; Node, Java y NGINX en el lado web. Mi sello: verificar cada número contra los datos crudos antes de presentarlo. Dos auditorías completas de ETL, esquemas en estrella y despliegues full-stack reales, no tutoriales.",
    projectOrder: ["olist", "fatalforce", "rondaguide"],
    showStack: true,
    showWarStory: false,
    showMethod: true,
    skillsMode: "grid",
    ctaTitle: "Stack completo y código",
    ctaBody:
      "Repositorios con README, documentación de instalación y decisiones de arquitectura justificadas. Pídeme el CV técnico o pega tu oferta en el chat para un análisis de encaje.",
    ctaKind: "github",
    ctaLabel: "Ver GitHub",
    chatHints: [
      "¿Encaja con esta oferta? (pega el texto)",
      "¿Qué hizo exactamente en el data warehouse?",
      "¿Qué experiencia tiene con PostgreSQL?",
    ],
  },
  dev: {
    id: "dev",
    label: "Developer",
    gateTitle: "Soy developer / futuro compañero",
    gateDesc: "Cuéntame los bugs difíciles y las decisiones de diseño.",
    chip: "perfil: dev_peer",
    tagline: "Me gustan los bugs silenciosos:\nlos que no rompen nada, solo mienten.",
    lede:
      "Un INSERT que se cuelga sin error, un typo histórico en las columnas de un dataset famoso, una FK cuyo tipo no casa. Mis proyectos favoritos son los que me obligaron a leer planes de ejecución y auditar contra el CSV crudo en vez de confiar en el pipeline.",
    projectOrder: ["olist", "fatalforce", "rondaguide"],
    showStack: true,
    showWarStory: true,
    showMethod: true,
    skillsMode: "grid",
    ctaTitle: "Hablemos de código",
    ctaBody:
      "Si te ha picado la curiosidad alguna de estas historias, el código está en GitHub y yo siempre tengo tiempo para discutir un plan de ejecución raro.",
    ctaKind: "github",
    ctaLabel: "Ver GitHub",
    chatHints: [
      "Cuéntame el bug del query planner",
      "¿Por qué una arquitectura dual en RondaGuide?",
      "¿Cómo se audita un ETL contra el dato crudo?",
    ],
  },
  fan: {
    id: "fan",
    label: "Curioso",
    gateTitle: "Solo estoy curioseando",
    gateDesc: "Cuéntamelo como una historia, sin jerga.",
    chip: "perfil: visitante",
    tagline: "Convierto tablas gigantes de datos\nen historias que cualquiera entiende.",
    lede:
      "Soy de Ronda (sí, la del puente). Me dedico a ordenar montañas de datos hasta que cuentan algo que importa: desde diez años de estadísticas policiales de EE. UU. hasta una guía interactiva de mi propia ciudad.",
    projectOrder: ["rondaguide", "fatalforce", "olist"],
    showStack: false,
    showWarStory: false,
    showMethod: false,
    skillsMode: "none",
    ctaTitle: "Gracias por pasarte",
    ctaBody:
      "Si algo te ha llamado la atención, escríbeme. Y si algún día vienes a Ronda, RondaGuide te enseña lo que no sale en las guías.",
    ctaKind: "email",
    ctaLabel: "Escribir a David",
    chatHints: [
      "¿Qué hace exactamente un data scientist?",
      "¿Qué es lo más curioso que has encontrado en los datos?",
      "Háblame de Ronda",
    ],
  },
};

export const PERSONA_LIST: readonly PersonaId[] = ["hr", "tech", "dev", "fan"];
