/**
 * Sistema de VISTAS (Fase 4).
 *
 * Una "vista" adapta el portfolio al tipo de visitante. Principio inviolable:
 * la vista REORDENA y ENFATIZA, nunca OCULTA. Si la inferencia se equivoca,
 * el visitante no pierde acceso a nada — solo cambia qué encuentra primero.
 *
 * Resolución en cascada (de más fiable a menos), implementada en VistaProvider:
 *   1. Parámetro de URL (?v=hr) — lo pone David al enviar el enlace
 *   2. Elección previa del visitante (localStorage)
 *   3. Inferencia por referrer (LinkedIn → hr, GitHub → dev)
 *   4. Vista por defecto
 */

export type VistaId = "general" | "hr" | "tech" | "dev";

export const DEFAULT_VISTA: VistaId = "general";

export const VISTA_IDS: readonly VistaId[] = ["general", "hr", "tech", "dev"];

/** Etiquetas bilingües para el selector visible. */
export const VISTA_LABELS: Record<VistaId, { es: string; en: string }> = {
  general: { es: "General", en: "General" },
  hr: { es: "Recruiter", en: "Recruiter" },
  tech: { es: "Perfil de datos", en: "Data profile" },
  dev: { es: "Desarrollo", en: "Engineering" },
};

/** Explicación breve del selector (transparencia con el visitante). */
export const VISTA_HINT: Record<"es" | "en", string> = {
  es: "Cambia el orden del contenido según lo que te interese. No se oculta nada.",
  en: "Reorders the content to match your interest. Nothing is hidden.",
};

/**
 * Orden de PROYECTOS por vista. Todos los proyectos aparecen siempre;
 * solo cambia cuál va primero.
 */
export const PROJECT_ORDER: Record<VistaId, readonly string[]> = {
  // Equilibrado: variedad de disciplinas desde el primer vistazo.
  general: ["olist-data-warehouse", "eda-fatal-force", "portfolio-adaptativo", "rondaguide"],
  // RR. HH. / negocio: primero lo que se entiende sin ser técnico y tiene impacto narrable.
  hr: ["eda-fatal-force", "portfolio-adaptativo", "rondaguide", "olist-data-warehouse"],
  // Recruiter técnico / datos: el modelado y el análisis por delante.
  tech: ["olist-data-warehouse", "eda-fatal-force", "portfolio-adaptativo", "rondaguide"],
  // Desarrollador: el código y la arquitectura primero.
  dev: ["portfolio-adaptativo", "rondaguide", "olist-data-warehouse", "eda-fatal-force"],
};

/**
 * Orden de SECCIONES dentro de la página de un proyecto.
 * Claves = identificadores de sección usados en ProyectoView.
 */
export type SectionKey = "what" | "architecture" | "challenges" | "decisions" | "code";

export const SECTION_ORDER: Record<VistaId, readonly SectionKey[]> = {
  general: ["what", "architecture", "challenges", "decisions", "code"],
  // Negocio: qué es y qué resultado dio; el detalle técnico después.
  hr: ["what", "challenges", "code", "architecture", "decisions"],
  // Datos: arquitectura y decisiones de modelado por delante.
  tech: ["what", "architecture", "decisions", "challenges", "code"],
  // Desarrollo: al código y a las decisiones cuanto antes.
  dev: ["what", "code", "decisions", "architecture", "challenges"],
};

/**
 * Orden de las tarjetas de la home.
 * Claves = rutas de las tres tarjetas.
 */
export const HOME_CARD_ORDER: Record<VistaId, readonly string[]> = {
  general: ["/sobre-mi", "/proyectos", "/curiosidades"],
  hr: ["/sobre-mi", "/proyectos", "/curiosidades"],
  tech: ["/proyectos", "/sobre-mi", "/curiosidades"],
  dev: ["/proyectos", "/curiosidades", "/sobre-mi"],
};

/** Mapea la vista al PersonaId que ya usan el concierge y el generador de CV. */
export function vistaToPersona(v: VistaId): "hr" | "tech" | "dev" | "fan" {
  return v === "general" ? "fan" : v;
}

/** Normaliza un valor arbitrario (query string, storage) a una vista válida. */
export function parseVista(raw: string | null | undefined): VistaId | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return (VISTA_IDS as readonly string[]).includes(v) ? (v as VistaId) : null;
}

/**
 * Inferencia por referrer. Señal débil y solo como último recurso antes del
 * valor por defecto: nunca sobrescribe una elección explícita.
 */
export function inferVistaFromReferrer(referrer: string): VistaId | null {
  if (!referrer) return null;
  const r = referrer.toLowerCase();
  if (r.includes("linkedin.")) return "hr";
  if (r.includes("github.") || r.includes("gitlab.") || r.includes("stackoverflow.")) return "dev";
  return null;
}

/** Ordena una lista de elementos según un orden preferente, sin perder ninguno. */
export function orderBy<T>(items: T[], order: readonly string[], key: (item: T) => string): T[] {
  const rank = new Map(order.map((k, i) => [k, i]));
  return items
    .map((item, i) => ({ item, i, r: rank.get(key(item)) ?? 900 }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.item);
}
