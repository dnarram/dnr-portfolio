"use client";

import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import SqlPlayground from "@/components/v2/SqlPlayground";
import EdaStorytelling from "@/components/v2/EdaStorytelling";
import { useLang } from "@/components/v2/LangProvider";
import { L } from "@/data/i18n";
import type { Proyecto } from "@/data/proyectos";
import { SITE } from "@/data/site";

export default function ProyectoView({ p }: { p: Proyecto }) {
  const { lang, ui } = useLang();
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main v2-project">
        <Link href="/proyectos" className="v2-back">{ui.projects.back}</Link>

        <p className="v2-proj-cat">{L(p.categoria, lang)}</p>
        <h1 className="v2-h1">{p.titulo}</h1>
        <p className="v2-tagline">{L(p.tagline, lang)}</p>
        <p className="v2-stackline">{p.stack.join(" · ")}</p>

        <section className="v2-sec">
          <h2>{ui.project.what}</h2>
          <p>{L(p.resumen, lang)}</p>
        </section>

        {p.slug === "olist-data-warehouse" && <SqlPlayground lang={lang} />}
        {p.slug === "eda-fatal-force" && <EdaStorytelling lang={lang} />}

        <section className="v2-sec">
          <h2>{ui.project.architecture}</h2>
          <ul>
            {p.arquitectura.map((a, i) => (
              <li key={i}>{L(a, lang)}</li>
            ))}
          </ul>
        </section>

        <section className="v2-sec">
          <h2>{ui.project.challenges}</h2>
          {p.retos.map((r, i) => (
            <div key={i} className="v2-reto">
              <h3>{L(r.titulo, lang)}</h3>
              <p>{L(r.texto, lang)}</p>
            </div>
          ))}
        </section>

        <section className="v2-sec">
          <h2>{ui.project.decisions}</h2>
          {p.decisiones.map((d, i) => (
            <div key={i} className="v2-reto">
              <h3>{L(d.titulo, lang)}</h3>
              <p>{L(d.texto, lang)}</p>
            </div>
          ))}
        </section>

        <section className="v2-sec">
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
          {p.articulo && (
            <p className="v2-note">
              {ui.project.relatedArticle} {L(p.articulo, lang)}
            </p>
          )}
        </section>
      </main>
      <FloatingConcierge />
    </div>
  );
}
