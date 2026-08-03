"use client";

import { useState } from "react";
import { useLang } from "@/components/v2/LangProvider";
import { L } from "@/data/i18n";
import {
  GRUPOS,
  PUBLICACIONES,
  PUBLICACIONES_UI,
  publicacionesDe,
  type Publicacion,
} from "@/data/publicaciones";

/**
 * Publicaciones técnicas.
 *
 * Los títulos se muestran SIEMPRE en su idioma original — nunca se traducen —
 * con una etiqueta de idioma visible para que el visitante sepa qué va a abrir.
 *
 * Dos modos:
 *  - <Publicaciones />                 → resumen plegable para "Sobre mí": ocupa
 *                                        dos filas cerradas y escala a N artículos
 *                                        sin crecer. La fila cerrada ya informa.
 *  - <Publicaciones proyecto="slug" /> → lista completa dentro de esa página
 */

function Item({ p }: { p: Publicacion }) {
  return (
    <li>
      <a href={p.url} target="_blank" rel="noopener noreferrer" className="pub-item">
        <span className="pub-top">
          <span className="pub-plat">{p.plataforma}</span>
          <span className="pub-idioma" title={p.idioma === "es" ? "Espanol" : "English"}>
            {p.idioma === "es" ? "ES" : "EN"}
          </span>
        </span>
        <span className="pub-titulo">{p.titulo}</span>
        {p.subtitulo && <span className="pub-sub">{p.subtitulo}</span>}
        <span className="pub-arrow" aria-hidden="true">
          &rarr;
        </span>
      </a>
    </li>
  );
}

export default function Publicaciones({ proyecto }: { proyecto?: string }) {
  const { lang } = useLang();
  const [abierto, setAbierto] = useState<string | null>(null);
  const t = PUBLICACIONES_UI[lang];

  // ── Modo proyecto: lista completa dentro de su página ──
  if (proyecto) {
    const items = publicacionesDe(proyecto);
    if (items.length === 0) return null;
    return (
      <div className="pub-compact">
        <p className="pub-label">{t.projectIntro}</p>
        <ul className="pub-list">
          {items.map((p) => (
            <Item key={p.url} p={p} />
          ))}
        </ul>
      </div>
    );
  }

  // ── Modo resumen: acordeon compacto por proyecto ──
  const plataformas = Array.from(new Set(PUBLICACIONES.map((p) => p.plataforma)));

  return (
    <section className="v2-sec">
      <h2>{t.title}</h2>


      <div className="pub-acordeon">
        {GRUPOS.map((g) => {
          const items = publicacionesDe(g.proyecto);
          if (items.length === 0) return null;
          const open = abierto === g.proyecto;
          const plats = Array.from(new Set(items.map((i) => i.plataforma)));
          return (
            <div key={g.proyecto} className={"pub-acc" + (open ? " open" : "")}>
              <button
                className="pub-acc-head"
                onClick={() => setAbierto(open ? null : g.proyecto)}
                aria-expanded={open}
              >
                <span className="pub-acc-titulo">{L(g.titulo, lang)}</span>
                <span className="pub-acc-meta">
                  {items.length} {t.articles} · {plats.join(" · ")}
                </span>
                <span className="pub-acc-chevron" aria-hidden="true">
                  &rsaquo;
                </span>
              </button>
              {open && (
                <ul className="pub-list pub-acc-body">
                  {items.map((p) => (
                    <Item key={p.url} p={p} />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
