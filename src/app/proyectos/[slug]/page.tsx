import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { PROYECTOS, getProyecto } from "@/data/proyectos";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProyecto(slug);
  return { title: p ? `${p.titulo} — David Naranjo Ramírez` : "Proyecto" };
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProyecto(slug);
  if (!p) notFound();

  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main v2-project">
        <Link href="/proyectos" className="v2-back">← Todos los proyectos</Link>

        <p className="v2-proj-cat">{p.categoria}</p>
        <h1 className="v2-h1">{p.titulo}</h1>
        <p className="v2-tagline">{p.tagline}</p>
        <p className="v2-stackline">{p.stack.join(" · ")}</p>

        <section className="v2-sec">
          <h2>Qué es</h2>
          <p>{p.resumen}</p>
        </section>

        <section className="v2-sec">
          <h2>Arquitectura</h2>
          <ul>
            {p.arquitectura.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          {/* Fase 3: diagrama visual de la arquitectura */}
        </section>

        <section className="v2-sec">
          <h2>Retos afrontados</h2>
          {p.retos.map((r, i) => (
            <div key={i} className="v2-reto">
              <h3>{r.titulo}</h3>
              <p>{r.texto}</p>
            </div>
          ))}
        </section>

        <section className="v2-sec">
          <h2>Decisiones técnicas</h2>
          {p.decisiones.map((d, i) => (
            <div key={i} className="v2-reto">
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </div>
          ))}
        </section>

        <section className="v2-sec">
          <h2>Código y demo</h2>
          {p.estado === "publico" && (
            <p>
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="v2-btn">
                  Ver repositorio →
                </a>
              )}{" "}
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className="v2-btn ghost">
                  Ver en producción →
                </a>
              )}
            </p>
          )}
          {p.estado === "pendiente" && (
            <p className="v2-note">
              El repositorio se está preparando para su publicación. Muy pronto aquí.
            </p>
          )}
          {p.estado === "privado" && (
            <div className="v2-disclaimer">
              <p>
                <strong>Aún no puedo compartir este proyecto públicamente.</strong> Es mi
                proyecto final del ciclo DAW y está pendiente de defensa ante el tribunal,
                así que el código permanece privado hasta entonces.
              </p>
              <p>
                ¿Quieres verlo por dentro? <a href={`mailto:${SITE.email}`}>Contáctame para una
                entrevista</a> y te lo cuento con todo detalle.
              </p>
            </div>
          )}
          {p.articulo && <p className="v2-note">Artículo relacionado: {p.articulo}</p>}
        </section>
      </main>
      <FloatingConcierge />
    </div>
  );
}