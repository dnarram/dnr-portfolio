"use client";

import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { useLang } from "@/components/v2/LangProvider";
import { useVista } from "@/components/v2/VistaProvider";
import { PROYECTOS, type Proyecto } from "@/data/proyectos";
import { publicacionesDe } from "@/data/publicaciones";
import { L } from "@/data/i18n";
import { PROJECT_ORDER, orderBy } from "@/data/vistas";

/**
 * Rejilla de proyectos.
 *
 * El primero según la vista del visitante se muestra DESTACADO a todo el ancho:
 * es el que mejor encaja con su perfil y merece el mayor impacto visual.
 * Cada tarjeta añade dos cosas que antes faltaban:
 *  - métricas de escala (lo que hace el proyecto memorable de un vistazo)
 *  - señales de qué hay dentro (código, demo, pieza interactiva, artículos),
 *    para que el visitante sepa qué le espera antes de hacer clic.
 */

const UI = {
  es: {
    featured: "Destacado para tu perfil",
    repo: "Código",
    demo: "En producción",
    interactive: "Demo interactiva",
    articles: (n: number) => `${n} ${n === 1 ? "artículo" : "artículos"}`,
    privateLabel: "Privado",
    pendingLabel: "Publicándose",
    explore: "Ver proyecto",
  },
  en: {
    featured: "Highlighted for your profile",
    repo: "Source",
    demo: "Live",
    interactive: "Interactive demo",
    articles: (n: number) => `${n} ${n === 1 ? "article" : "articles"}`,
    privateLabel: "Private",
    pendingLabel: "Publishing",
    explore: "View project",
  },
} as const;

/** Proyectos que incorporan una pieza interactiva propia dentro de su página. */
const INTERACTIVOS = new Set(["olist-data-warehouse", "eda-fatal-force"]);

function Senales({ p, lang }: { p: Proyecto; lang: "es" | "en" }) {
  const t = UI[lang];
  const arts = publicacionesDe(p.slug).length;
  const items: string[] = [];
  if (p.estado === "publico" && p.repo) items.push(t.repo);
  if (p.demo) items.push(t.demo);
  if (INTERACTIVOS.has(p.slug)) items.push(t.interactive);
  if (arts > 0) items.push(t.articles(arts));
  if (p.estado === "privado") items.push(t.privateLabel);
  if (p.estado === "pendiente") items.push(t.pendingLabel);
  if (items.length === 0) return null;
  return (
    <span className="pj-senales">
      {items.map((s) => (
        <span key={s} className="pj-senal">
          {s}
        </span>
      ))}
    </span>
  );
}

function Metricas({ p, lang }: { p: Proyecto; lang: "es" | "en" }) {
  if (!p.metricas || p.metricas.length === 0) return null;
  return (
    <span className="pj-metricas">
      {p.metricas.map((m, i) => (
        <span key={i} className="pj-metrica">
          <span className="pj-metrica-valor">{m.valor}</span>
          <span className="pj-metrica-label">{L(m.etiqueta, lang)}</span>
        </span>
      ))}
    </span>
  );
}

function Tarjeta({ p, lang, destacado }: { p: Proyecto; lang: "es" | "en"; destacado?: boolean }) {
  const t = UI[lang];
  return (
    <Link
      href={`/proyectos/${p.slug}`}
      className={`pj-card ${p.tono}` + (destacado ? " pj-featured" : "")}
    >
      <span className="pj-head">
        <span className="pj-cat">{L(p.categoria, lang)}</span>
        {p.anio && <span className="pj-anio">{p.anio}</span>}
      </span>

      {destacado && <span className="pj-badge">{t.featured}</span>}

      <span className="pj-title">{p.titulo}</span>
      <span className="pj-tag">{L(p.tagline, lang)}</span>

      <Metricas p={p} lang={lang} />

      <span className="pj-stack">
        {p.stack.slice(0, destacado ? 6 : 4).map((s) => (
          <span key={s} className="pj-chip">
            {s}
          </span>
        ))}
      </span>

      <span className="pj-foot">
        <Senales p={p} lang={lang} />
        <span className="pj-cta">
          {t.explore} <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}

export default function ProyectosView() {
  const { lang, ui } = useLang();
  const { vista } = useVista();
  // La vista REORDENA los proyectos; nunca oculta ninguno.
  const proyectos = orderBy([...PROYECTOS], PROJECT_ORDER[vista], (p) => p.slug);
  const [primero, ...resto] = proyectos;

  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">{ui.projects.title}</h1>
        <div className="pj-grid">
          {primero && <Tarjeta p={primero} lang={lang} destacado />}
          {resto.map((p) => (
            <Tarjeta key={p.slug} p={p} lang={lang} />
          ))}
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}
