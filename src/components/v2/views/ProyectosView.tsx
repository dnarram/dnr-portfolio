"use client";

import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { useLang } from "@/components/v2/LangProvider";
import { PROYECTOS } from "@/data/proyectos";
import { L } from "@/data/i18n";

export default function ProyectosView() {
  const { lang, ui } = useLang();
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">{ui.projects.title}</h1>
        <div className="v2-grid">
          {PROYECTOS.map((p) => (
            <Link key={p.slug} href={`/proyectos/${p.slug}`} className={`v2-proj ${p.tono}`}>
              <span className="v2-proj-cat">{L(p.categoria, lang)}</span>
              <span className="v2-proj-title">{p.titulo}</span>
              <span className="v2-proj-tag">{L(p.tagline, lang)}</span>
              <span className="v2-proj-stack">{p.stack.slice(0, 4).join(" · ")}</span>
            </Link>
          ))}
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}
