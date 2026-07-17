/**
 * Analítica de eventos sin cookies. No-op si no hay proveedor configurado.
 * Eventos que alimentan el feedback loop del portfolio:
 *   persona_selected · persona_switched · theme_toggled · chat_opened ·
 *   chat_message {mode} · cta_click {kind, persona} · candidatura_view {slug}
 */
type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
    goatcounter?: { count: (opts: { path: string; title?: string; event: boolean }) => void };
  }
}

export function track(name: string, data: EventData = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (window.umami?.track) {
      window.umami.track(name, data);
      return;
    }
    if (window.goatcounter?.count) {
      window.goatcounter.count({ path: name, title: JSON.stringify(data), event: true });
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      console.debug("[track]", name, data);
    }
  } catch {
    /* la analítica nunca debe romper la UX */
  }
}

/**
 * Contexto de origen del visitante: parámetros UTM de la URL + referrer.
 * Se lee una vez al montar y se cachea en sessionStorage para no perderlo
 * al navegar. No contiene datos personales: solo de dónde viene la visita.
 */
export interface OriginContext {
  ref?: string;
  utm_source?: string;
  utm_campaign?: string;
  candidatura?: string;
}

const ORIGIN_KEY = "dnr-origin";

export function readOrigin(candidatura?: string): OriginContext {
  if (typeof window === "undefined") return {};
  try {
    const cached = sessionStorage.getItem(ORIGIN_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as OriginContext;
      if (candidatura && !parsed.candidatura) parsed.candidatura = candidatura;
      return parsed;
    }
  } catch {
    /* sessionStorage no disponible: seguimos leyendo de la URL */
  }

  const params = new URLSearchParams(window.location.search);
  const host = (() => {
    try {
      const r = document.referrer;
      return r ? new URL(r).hostname.replace(/^www\./, "") : undefined;
    } catch {
      return undefined;
    }
  })();

  const origin: OriginContext = {
    utm_source: params.get("utm_source")?.slice(0, 120) ?? undefined,
    utm_campaign: params.get("utm_campaign")?.slice(0, 120) ?? undefined,
    // Si no hay utm_source, el referrer hace de fuente aproximada.
    ref: host && host !== window.location.hostname ? host : undefined,
    candidatura,
  };

  try {
    sessionStorage.setItem(ORIGIN_KEY, JSON.stringify(origin));
  } catch {
    /* no crítico */
  }
  return origin;
}
