import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProyectoView from "@/components/v2/views/ProyectoView";
import { PROYECTOS, getProyecto } from "@/data/proyectos";

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
  return <ProyectoView p={p} />;
}
