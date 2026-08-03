import type { Localized } from "@/data/i18n";

/**
 * Publicaciones técnicas.
 *
 * IMPORTANTE: los títulos y subtítulos NO se traducen nunca. Cada artículo se
 * publicó en un idioma concreto; traducir el título haría creer al visitante
 * que el artículo está en su idioma y se llevaría una decepción al abrirlo.
 * Por eso `titulo` y `subtitulo` son strings planos, no Localized, y cada
 * entrada lleva una etiqueta de idioma visible.
 */

export type Plataforma = "Hashnode" | "Medium" | "dev.to" | "LinkedIn";

export interface Publicacion {
  /** título tal como se publicó — nunca traducido */
  titulo: string;
  /** subtítulo original; vacío si la plataforma no lo usa */
  subtitulo?: string;
  url: string;
  plataforma: Plataforma;
  /** idioma en que está escrito el artículo */
  idioma: "es" | "en";
  /** slug del proyecto del que trata, para enlazarlas desde su página */
  proyecto: "olist-data-warehouse" | "eda-fatal-force";
}

export const PUBLICACIONES: Publicacion[] = [
  /* ── Data Warehouse Olist ─────────────────────────────── */
  {
    titulo:
      "Por qué PostgreSQL eligió el peor plan posible para mi ETL (y cómo lo arreglé con 5 líneas)",
    subtitulo:
      "Nested Loop vs Hash Join, estadísticas desactualizadas y el fan-out que infla tus ventas en silencio",
    url: "https://davidnaranjoramirez.hashnode.dev/por-que-postgresql-eligio-el-peor-plan-posible-para-mi-etl-y-como-lo-arregle-con-5-lineas",
    plataforma: "Hashnode",
    idioma: "es",
    proyecto: "olist-data-warehouse",
  },
  {
    titulo:
      "Mi INSERT tardaba 25 minutos y no era culpa de los datos: construyendo un Data Warehouse de e-commerce con PostgreSQL",
    url: "https://dev.to/evolve-space/mi-insert-tardaba-25-minutos-y-no-era-culpa-de-los-datos-construyendo-un-data-warehouse-de-4e14",
    plataforma: "dev.to",
    idioma: "es",
    proyecto: "olist-data-warehouse",
  },
  {
    titulo: "100.000 pedidos me contaron por qué sus clientes no vuelven",
    subtitulo:
      "Lo que aprendí construyendo un Data Warehouse de e-commerce durante mi Máster en Data Science en Evolve",
    url: "https://medium.com/@naranjoramirez.d/100-000-pedidos-me-contaron-por-qué-sus-clientes-no-vuelven-3df12f659999",
    plataforma: "Medium",
    idioma: "es",
    proyecto: "olist-data-warehouse",
  },
  {
    titulo: "Tres decisiones técnicas que habrían falsificado mi informe de negocio",
    subtitulo:
      "Lo que un data warehouse sobre 100.000 pedidos me enseñó sobre la fragilidad de los datos",
    url: "https://www.linkedin.com/pulse/tres-decisiones-técnicas-que-habrían-falsificado-mi-naranjo-ramírez-nodte/",
    plataforma: "LinkedIn",
    idioma: "es",
    proyecto: "olist-data-warehouse",
  },

  /* ── EDAFatalForce ────────────────────────────────────── */
  {
    titulo:
      "Building a reproducible EDA pipeline on police shooting data: architecture, bugs, and lessons",
    subtitulo:
      "A deep-dive into modular data engineering decisions, two silent bugs that invalidated entire analyses, and the statistical choices behind 10 research questions.",
    url: "https://davidnaranjoramirez.hashnode.dev/building-a-reproducible-eda-pipeline-on-police-shooting-data-architecture-bugs-and-lessons",
    plataforma: "Hashnode",
    idioma: "en",
    proyecto: "eda-fatal-force",
  },
  {
    titulo:
      "10.430 muertes, 10 preguntas y un pipeline en Python: lo que los datos de violencia policial en EE.UU. no te cuentan a simple vista",
    url: "https://dev.to/evolve-space/10430-muertes-10-preguntas-y-un-pipeline-en-python-lo-que-los-datos-de-violencia-policial-en-54j6",
    plataforma: "dev.to",
    idioma: "es",
    proyecto: "eda-fatal-force",
  },
  {
    titulo: "Cuando el gobierno deja de contar los muertos, los datos cuentan otra historia",
    subtitulo:
      "Una lectura de 5 minutos sobre lo que se pierde — y lo que se recupera — cuando aplicas ciencia de datos a un problema con carga humana real.",
    url: "https://medium.com/@naranjoramirez.d/cuando-el-gobierno-deja-de-contar-los-muertos-los-datos-cuentan-otra-historia-8c26b9654a0c",
    plataforma: "Medium",
    idioma: "es",
    proyecto: "eda-fatal-force",
  },
  {
    titulo:
      "Lo que aprendí analizando 10 años de violencia policial en EE.UU. — y por qué los datos sin contexto mienten",
    url: "https://www.linkedin.com/pulse/lo-que-aprendí-analizando-10-años-de-violencia-en-y-naranjo-ramírez-m3lhe/",
    plataforma: "LinkedIn",
    idioma: "es",
    proyecto: "eda-fatal-force",
  },
];

/** Agrupación por proyecto, con su encabezado bilingüe. */
export const GRUPOS: Array<{ proyecto: Publicacion["proyecto"]; titulo: Localized }> = [
  {
    proyecto: "olist-data-warehouse",
    titulo: { es: "Data Warehouse Olist", en: "Olist Data Warehouse" },
  },
  {
    proyecto: "eda-fatal-force",
    titulo: { es: "EDAFatalForce", en: "EDAFatalForce" },
  },
];

export function publicacionesDe(slug: string): Publicacion[] {
  return PUBLICACIONES.filter((p) => p.proyecto === slug);
}

/** Cadenas de interfaz de la sección. */
export const PUBLICACIONES_UI = {
  es: {
    title: "Publicaciones",
    intro:
      "Escribo sobre lo que construyo. Cada artículo aborda el mismo proyecto desde un ángulo distinto según su audiencia: el detalle técnico, la lectura de negocio o la historia humana detrás de los datos.",
    projectIntro: "Artículos publicados sobre este proyecto:",
    original: "Idioma original",
    readOn: "Leer en",
    countArticles: "artículos publicados en",
    countPlatforms: "plataformas",
    articles: "artículos",
  },
  en: {
    title: "Publications",
    intro:
      "I write about what I build. Each article approaches the same project from a different angle depending on its audience: the technical detail, the business reading, or the human story behind the data.",
    projectIntro: "Articles published about this project:",
    original: "Original language",
    readOn: "Read on",
    countArticles: "articles published across",
    countPlatforms: "platforms",
    articles: "articles",
  },
} as const;
