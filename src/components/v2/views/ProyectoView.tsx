"use client";

import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import SqlPlayground from "@/components/v2/SqlPlayground";
import EdaStorytelling from "@/components/v2/EdaStorytelling";
import Publicaciones from "@/components/v2/Publicaciones";
import { useLang } from "@/components/v2/LangProvider";
import { useVista } from "@/components/v2/VistaProvider";
import { SECTION_ORDER, type SectionKey } from "@/data/vistas";
import { L } from "@/data/i18n";
import type { Proyecto } from "@/data/proyectos";
import { SITE } from "@/data/site";

export default function ProyectoView({ p }: { p: Proyecto }) {
  const { lang, ui } = useLang();
  const { vista } = useVista();

  // Cada sección se define una vez y se renderiza en el orden que marca la
  // vista del visitante. Todas se muestran SIEMPRE: la vista reordena, no oculta.
  const sections: Record<SectionKey, React.ReactNode> = {
    what: (
      <section className="v2-sec" key="what">
        <h2>{ui.project.what}</h2>
        <p>{L(p.resumen, lang)}</p>
      </section>
    ),
    architecture: (
      <section className="v2-sec" key="architecture">
        <h2>{ui.project.architecture}</h2>
        <ul>
          {p.arquitectura.map((a, i) => (
            <li key={i}>{L(a, lang)}</li>
          ))}
        </ul>
      </section>
    ),
    challenges: (
      <section className="v2-sec" key="challenges">
        <h2>{ui.project.challenges}</h2>
        {p.retos.map((r, i) => (
          <div key={i} className="v2-reto">
            <h3>{L(r.titulo, lang)}</h3>
            <p>{L(r.texto, lang)}</p>
          </div>
        ))}
      </section>
    ),
    decisions: (
      <section className="v2-sec" key="decisions">
        <h2>{ui.project.decisions}</h2>
        {p.decisiones.map((d, i) => (
          <div key={i} className="v2-reto">
            <h3>{L(d.titulo, lang)}</h3>
            <p>{L(d.texto, lang)}</p>
          </div>
        ))}
      </section>
    ),
    code: (
      <section className="v2-sec" key="code">
        <h2>{ui.project.codeDemo}</h2>
        {p.estado === "publico" && (
          <p>
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="v2-btn">
                {ui.project.viewRepo}
              </a>
            )}{" "}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="v2-btn ghost">
                {ui.project.viewLive}
              </a>
            )}
          </p>
        )}
        {p.estado === "pendiente" && <p className="v2-note">{ui.project.pending}</p>}
        {p.estado === "privado" && (
          <div className="v2-disclaimer">
            <p>
              <strong>{ui.disclaimer.title}</strong> {ui.disclaimer.body}
            </p>
            <p>
              {ui.disclaimer.ctaPre}
              <a href={`mailto:${SITE.email}`}>{ui.disclaimer.ctaLink}</a>.
            </p>
          </div>
        )}
        {/* Publicaciones reales sobre este proyecto (enlaces, no texto plano) */}
        <Publicaciones proyecto={p.slug} />
      </section>
    ),
  };

  const order = SECTION_ORDER[vista];

  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main v2-project">
        <Link href="/proyectos" className="v2-back">{ui.projects.back}</Link>

        <p className="v2-proj-cat">{L(p.categoria, lang)}</p>
        <h1 className="v2-h1">{p.titulo}</h1>
        <p className="v2-tagline">{L(p.tagline, lang)}</p>
        <p className="v2-stackline">{p.stack.join(" · ")}</p>

        {/* "Qué es" va siempre primero: es el contexto sin el cual nada se entiende */}
        {sections.what}

        {/* Piezas interactivas ancladas aquí: son la demostración estrella y
            deben aparecer pronto sea cual sea la vista. */}
        {p.slug === "olist-data-warehouse" && <SqlPlayground lang={lang} />}
        {p.slug === "eda-fatal-force" && <EdaStorytelling lang={lang} />}

        {/* El resto de secciones, en el orden que prefiere esta vista */}
        {order.filter((k) => k !== "what").map((k) => sections[k])}
      </main>
      <FloatingConcierge />
    </div>
  );
}
