"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_VISTA,
  inferVistaFromReferrer,
  parseVista,
  type VistaId,
} from "@/data/vistas";

interface VistaCtx {
  vista: VistaId;
  setVista: (v: VistaId) => void;
  /** true si la vista vino de una elección explícita (URL o selector), no inferida */
  explicit: boolean;
}

const Ctx = createContext<VistaCtx | null>(null);

const STORAGE_KEY = "dnr-vista";

export function VistaProvider({ children }: { children: React.ReactNode }) {
  // Servidor y primer render del cliente: vista por defecto (evita desajustes
  // de hidratación). Al montar, resolvemos la cascada real.
  const [vista, setVistaState] = useState<VistaId>(DEFAULT_VISTA);
  const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    // 1) parámetro de URL — la señal más fiable: la pone David al compartir
    const fromUrl = parseVista(new URLSearchParams(window.location.search).get("v"));
    if (fromUrl) {
      setVistaState(fromUrl);
      setExplicit(true);
      try {
        localStorage.setItem(STORAGE_KEY, fromUrl);
      } catch {
        /* almacenamiento no disponible: no es crítico */
      }
      return;
    }

    // 2) elección previa del visitante
    let saved: VistaId | null = null;
    try {
      saved = parseVista(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* ignore */
    }
    if (saved) {
      setVistaState(saved);
      setExplicit(true);
      return;
    }

    // 3) inferencia por referrer (señal débil, no se considera explícita)
    const inferred = inferVistaFromReferrer(document.referrer || "");
    if (inferred) {
      setVistaState(inferred);
      return;
    }

    // 4) por defecto: ya está puesta
  }, []);

  const setVista = (v: VistaId) => {
    setVistaState(v);
    setExplicit(true);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  };

  return <Ctx.Provider value={{ vista, setVista, explicit }}>{children}</Ctx.Provider>;
}

export function useVista(): VistaCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useVista debe usarse dentro de <VistaProvider>");
  return c;
}
