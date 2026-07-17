import type { PersonaId } from "./personas";

export interface Candidatura {
  empresa: string;
  persona: PersonaId;
  rol?: string;
  /** Nota breve que aparece en el banner de bienvenida. */
  nota?: string;
}

/**
 * Enlaces personalizados por candidatura: /p/<slug>
 *
 * Flujo de uso: al enviar una candidatura, añade aquí una entrada y
 * comparte la URL en el CV / email. La página precarga la persona,
 * saluda mencionando a la empresa y NO se indexa en buscadores
 * (robots noindex + disallow /p/ en robots.txt).
 *
 * Tras editar este archivo: commit + push → Vercel redespliega solo.
 */
export const CANDIDATURAS: Record<string, Candidatura> = {
  demo: {
    empresa: "Empresa Demo",
    persona: "tech",
    rol: "Data Engineer",
    nota: "Vista de ejemplo — así llega tu equipo al portfolio.",
  },
  "capgemini-2026": {
    empresa: "Capgemini",
    persona: "tech",
    rol: "Data Engineer",
  },
};
