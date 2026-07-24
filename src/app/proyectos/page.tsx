import type { Metadata } from "next";
import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { PROYECTOS } from "@/data/proyectos";

export const metadata: Metadata = { title: "Proyectos — David Naranjo Ramírez" };

export default function ProyectosPage() {
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">Mis Proyectos</h1>
        <div className="v2-grid">
          {PROYECTOS.map((p) => (
            <Link key={p.slug} href={`/proyectos/${p.slug}`} className={`v2-proj ${p.tono}`}>
              <span className="v2-proj-cat">{p.categoria}</span>
              <span className="v2-proj-title">{p.titulo}</span>
              <span className="v2-proj-tag">{p.tagline}</span>
              <span className="v2-proj-stack">{p.stack.slice(0, 4).join(" · ")}</span>
            </Link>
          ))}
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}