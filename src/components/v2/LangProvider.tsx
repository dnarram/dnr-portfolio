"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, UI, detectLang, type Lang } from "@/data/i18n";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** cadenas de interfaz del idioma activo */
  ui: (typeof UI)["es"];
}

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = "dnr-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  // En el servidor y en el primer render del cliente usamos el idioma por
  // defecto (evita desajustes de hidratación). En cuanto monta, ajustamos a
  // la preferencia guardada o a la del navegador.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
    const initial = saved === "es" || saved === "en" ? saved : detectLang(navigator.language);
    setLangState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* almacenamiento no disponible: no es crítico */
    }
  };

  return <Ctx.Provider value={{ lang, setLang, ui: UI[lang] }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang debe usarse dentro de <LangProvider>");
  return c;
}
