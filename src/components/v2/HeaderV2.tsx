"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/v2/LangProvider";
import { LANGS } from "@/data/i18n";
import { useVista } from "@/components/v2/VistaProvider";
import ThemeToggle from "@/components/v2/ThemeToggle";
import { VISTA_IDS, VISTA_LABELS, VISTA_HINT, type VistaId } from "@/data/vistas";

export default function HeaderV2() {
  const pathname = usePathname();
  const { lang, setLang, ui } = useLang();
  const { vista, setVista } = useVista();

  const tabs = [
    { href: "/sobre-mi", label: ui.tabs.about },
    { href: "/proyectos", label: ui.tabs.projects },
    { href: "/curiosidades", label: ui.tabs.extras },
  ];

  return (
    <header className="v2-header">
      <Link href="/" className="v2-logo" aria-label="Inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/DNR_Hashnode_Claro_1000x250.png" alt="DNR — David Naranjo Ramírez" className="v2-logo-img light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/DNR_Hashnode_Oscuro_1000x250.png" alt="DNR — David Naranjo Ramírez" className="v2-logo-img dark" />
      </Link>
      <div className="v2-header-right">
        <nav className="v2-tabs" aria-label="Secciones">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={"v2-tab" + (pathname.startsWith(t.href) ? " active" : "")}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <select
          className="v2-vista"
          value={vista}
          onChange={(e) => setVista(e.target.value as VistaId)}
          title={VISTA_HINT[lang]}
          aria-label={VISTA_HINT[lang]}
        >
          {VISTA_IDS.map((v) => (
            <option key={v} value={v}>
              {VISTA_LABELS[v][lang]}
            </option>
          ))}
        </select>
        <div className="v2-lang" role="group" aria-label="Idioma / Language">
          {LANGS.map((l) => (
            <button
              key={l}
              className={"v2-lang-btn" + (lang === l ? " active" : "")}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
