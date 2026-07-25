/**
 * Multilenguaje ES/EN — diccionarios propios tipados, sin librería externa.
 * El tipo Dict obliga a que ES y EN tengan exactamente las mismas claves:
 * si añades una cadena en un idioma y olvidas el otro, no compila.
 */

export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];
export const DEFAULT_LANG: Lang = "es";

/** Una cadena en los dos idiomas. */
export type Localized = Record<Lang, string>;
export const L = (s: Localized, lang: Lang): string => s[lang];

/** Detección por navegador: "en*" → en; cualquier otro → es (por defecto). */
export function detectLang(nav: string | undefined | null): Lang {
  if (nav && nav.toLowerCase().startsWith("en")) return "en";
  return DEFAULT_LANG;
}

/* ── Cadenas de interfaz (chrome) ─────────────────────────── */

interface UIStrings {
  tabs: { about: string; projects: string; extras: string };
  home: {
    role: string;
    lede: string;
    ask: string;
    cardAbout: string;
    cardAboutSub: string;
    cardProjects: string;
    cardProjectsSub: string;
    cardExtras: string;
    cardExtrasSub: string;
  };
  projects: { title: string; back: string };
  project: {
    what: string;
    architecture: string;
    challenges: string;
    decisions: string;
    codeDemo: string;
    viewRepo: string;
    viewLive: string;
    pending: string;
    relatedArticle: string;
  };
  disclaimer: { title: string; body: string; ctaPre: string; ctaLink: string };
  about: { title: string; trajectory: string; languages: string; languagesValue: string };
  extras: { title: string };
  chat: { open: string; close: string; who: string; tooltip: string };
  langName: { es: string; en: string };
}

export const UI: Record<Lang, UIStrings> = {
  es: {
    tabs: { about: "Sobre mí", projects: "Mis Proyectos", extras: "Curiosidades" },
    home: {
      role: "Data Scientist · Desarrollador Web Full-Stack",
      lede: "5 años en proyectos IT internacionales de ensayos clínicos, hoy construyendo con datos y con código. Málaga / Madrid · remoto.",
      ask: "¿Qué te gustaría saber?",
      cardAbout: "Sobre mí",
      cardAboutSub: "Trayectoria, formación e idiomas",
      cardProjects: "Mis Proyectos",
      cardProjectsSub: "Datos, web e IA — con código y retos reales",
      cardExtras: "Curiosidades",
      cardExtrasSub: "Lo que no cabe en un CV",
    },
    projects: { title: "Mis Proyectos", back: "← Todos los proyectos" },
    project: {
      what: "Qué es",
      architecture: "Arquitectura",
      challenges: "Retos afrontados",
      decisions: "Decisiones técnicas",
      codeDemo: "Código y demo",
      viewRepo: "Ver repositorio →",
      viewLive: "Ver en producción →",
      pending: "El repositorio se está preparando para su publicación. Muy pronto aquí.",
      relatedArticle: "Artículo relacionado:",
    },
    disclaimer: {
      title: "Aún no puedo compartir este proyecto públicamente.",
      body: "Es mi proyecto final del ciclo DAW y está pendiente de defensa ante el tribunal, así que el código permanece privado hasta entonces.",
      ctaPre: "¿Quieres verlo por dentro? ",
      ctaLink: "Contáctame para una entrevista",
    },
    about: {
      title: "Sobre mí",
      trajectory: "Trayectoria",
      languages: "Idiomas",
      languagesValue: "Español nativo · Inglés C1 · Francés C1 · Portugués B2",
    },
    extras: { title: "Curiosidades" },
    chat: { open: "Abrir asistente", close: "Cerrar asistente", who: "¿Quién eres?", tooltip: "Pregúntame sobre David" },
    langName: { es: "ES", en: "EN" },
  },
  en: {
    tabs: { about: "About", projects: "Projects", extras: "Beyond the CV" },
    home: {
      role: "Data Scientist · Full-Stack Web Developer",
      lede: "5 years in international clinical-trial IT projects, now building with data and code. Málaga / Madrid · remote.",
      ask: "What would you like to know?",
      cardAbout: "About me",
      cardAboutSub: "Career, education and languages",
      cardProjects: "Projects",
      cardProjectsSub: "Data, web and AI — with real code and challenges",
      cardExtras: "Beyond the CV",
      cardExtrasSub: "What doesn't fit on a résumé",
    },
    projects: { title: "Projects", back: "← All projects" },
    project: {
      what: "What it is",
      architecture: "Architecture",
      challenges: "Challenges faced",
      decisions: "Technical decisions",
      codeDemo: "Code & demo",
      viewRepo: "View repository →",
      viewLive: "View live →",
      pending: "The repository is being prepared for publication. Coming here soon.",
      relatedArticle: "Related article:",
    },
    disclaimer: {
      title: "I can't share this project publicly yet.",
      body: "It's my final project for the Web Development diploma and is pending defence before the board, so the code stays private until then.",
      ctaPre: "Want to see it from the inside? ",
      ctaLink: "Get in touch for an interview",
    },
    about: {
      title: "About me",
      trajectory: "Career",
      languages: "Languages",
      languagesValue: "Spanish native · English C1 · French C1 · Portuguese B2",
    },
    extras: { title: "Beyond the CV" },
    chat: { open: "Open assistant", close: "Close assistant", who: "Who are you?", tooltip: "Ask me about David" },
    langName: { es: "ES", en: "EN" },
  },
};

/* ── Contenido bilingüe: trayectoria (Sobre mí) ───────────── */

export const ETAPAS: Array<{ fecha: Localized; titulo: Localized; donde: Localized }> = [
  {
    fecha: { es: "2026 – hoy", en: "2026 – present" },
    titulo: { es: "Máster en Data Science e IA", en: "MSc in Data Science & AI" },
    donde: { es: "Evolve Academy", en: "Evolve Academy" },
  },
  {
    fecha: { es: "finalizando", en: "completing" },
    titulo: { es: "CFGS Desarrollo de Aplicaciones Web (DAW)", en: "Higher Diploma in Web Application Development" },
    donde: { es: "ILERNA", en: "ILERNA" },
  },
  {
    fecha: { es: "2023", en: "2023" },
    titulo: { es: "Project Manager – Tier 2 Support (Novo Nordisk)", en: "Project Manager – Tier 2 Support (Novo Nordisk)" },
    donde: { es: "C3i Solutions / HCLTech · Sofía", en: "C3i Solutions / HCLTech · Sofia" },
  },
  {
    fecha: { es: "2021 – 2023", en: "2021 – 2023" },
    titulo: {
      es: "Supervisor – SME (Pfizer) · equipo de ~100 agentes",
      en: "Supervisor – SME (Pfizer) · ~100-agent team",
    },
    donde: { es: "C3i Solutions / HCLTech · Sofía", en: "C3i Solutions / HCLTech · Sofia" },
  },
  {
    fecha: { es: "2021", en: "2021" },
    titulo: { es: "Team Lead – Specialist", en: "Team Lead – Specialist" },
    donde: { es: "C3i Solutions / HCLTech · Sofía", en: "C3i Solutions / HCLTech · Sofia" },
  },
  {
    fecha: { es: "2018 – 2021", en: "2018 – 2021" },
    titulo: { es: "Asistencia técnica (Medidata, Pfizer)", en: "Technical support (Medidata, Pfizer)" },
    donde: { es: "C3i Solutions / HCLTech · Sofía", en: "C3i Solutions / HCLTech · Sofia" },
  },
  {
    fecha: { es: "2016 – 2017", en: "2016 – 2017" },
    titulo: { es: "Docencia de español y traducción", en: "Spanish teaching and translation" },
    donde: { es: "Francia · Instituto Cervantes (París)", en: "France · Instituto Cervantes (Paris)" },
  },
];

export const ABOUT_INTRO: Localized[] = [
  {
    es: "Tiendo puentes entre el desarrollo web full-stack y la ciencia de datos. Pasé 5 años en proyectos IT internacionales de ensayos clínicos (Medidata, Pfizer, Novo Nordisk) creciendo de agente de soporte técnico a supervisor de un equipo de ~100 personas y project manager. Hoy aplico esa madurez a construir con datos y con código, de principio a fin.",
    en: "I bridge full-stack web development and data science. I spent 5 years in international clinical-trial IT projects (Medidata, Pfizer, Novo Nordisk), growing from technical support agent to supervisor of a ~100-person team and project manager. Today I apply that maturity to building with data and code, end to end.",
  },
  {
    es: "Mi sello: rigor verificable. Audito mis datos contra las fuentes crudas y resuelvo los problemas de raíz.",
    en: "My hallmark: verifiable rigour. I audit my data against the raw sources and fix problems at the root.",
  },
];

/* ── Contenido bilingüe: curiosidades ─────────────────────── */

export const CURIOSIDADES: Array<{ titulo: Localized; texto: Localized }> = [
  {
    titulo: { es: "Cuatro idiomas, un traductor de formación", en: "Four languages, a translator by training" },
    texto: {
      es: "Antes de la tecnología estudié Traducción e Interpretación. Esa precisión con el lenguaje hoy la aplico a la documentación técnica — en español, inglés, francés y portugués.",
      en: "Before tech I studied Translation & Interpreting. That precision with language now goes into technical documentation — in Spanish, English, French and Portuguese.",
    },
  },
  {
    titulo: { es: "5 años viviendo en Sofía", en: "5 years living in Sofia" },
    texto: {
      es: "Trabajé en Bulgaria en proyectos globales de software para ensayos clínicos, y antes pasé una etapa enseñando español en Francia. La experiencia internacional se me quedó puesta.",
      en: "I worked in Bulgaria on global clinical-trial software projects, and before that spent time teaching Spanish in France. The international experience stuck with me.",
    },
  },
  {
    titulo: { es: "Supervisé a ~100 personas en plena pandemia", en: "I supervised ~100 people mid-pandemic" },
    texto: {
      es: "Como Supervisor/SME en Pfizer, el equipo creció un 40% y mantuvimos los SLA por encima de lo exigido — atravesando la pandemia y el estallido de la guerra de Ucrania.",
      en: "As Supervisor/SME at Pfizer, the team grew 40% and we kept SLAs above target — through the pandemic and the outbreak of the war in Ukraine.",
    },
  },
  {
    titulo: { es: "Escribo sobre lo que construyo", en: "I write about what I build" },
    texto: {
      es: "Publico artículos técnicos en LinkedIn sobre mis proyectos: lo que aprendí de 10 años de datos de fuerza policial, o las decisiones que habrían falsificado mi informe de negocio.",
      en: "I publish technical articles on LinkedIn about my projects: what I learned from 10 years of police-force data, or the decisions that would have falsified my business report.",
    },
  },
  {
    titulo: { es: "Marca propia", en: "My own brand" },
    texto: {
      es: "DNR tiene su propio manual de identidad — logos, paletas y tipografías — aplicado a este portfolio, a mi CV y a mis perfiles profesionales.",
      en: "DNR has its own identity manual — logos, palettes and typography — applied to this portfolio, my CV and my professional profiles.",
    },
  },
  {
    titulo: { es: "Formación musical", en: "Musical training" },
    texto: {
      es: "Estudié música en el conservatorio. La disciplina de práctica diaria se parece más a programar de lo que parece.",
      en: "I studied music at the conservatory. The discipline of daily practice is more like programming than it looks.",
    },
  },
];
