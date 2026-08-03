"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Interruptor de tema claro/oscuro (v2).
 *
 * El tema real ya lo aplica el script de arranque del layout, que lee
 * localStorage (o la preferencia del sistema) y fija data-theme en <html>
 * ANTES del primer pintado — por eso no hay parpadeo. Este componente solo
 * lee ese estado al montar y lo alterna.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("dnr-theme", next);
    } catch {
      /* almacenamiento no disponible: no es crítico */
    }
  };

  const label = theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return (
    <button className="v2-theme" onClick={toggle} aria-label={label} title={label}>
      {theme === "dark" ? (
        // sol
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // luna
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
