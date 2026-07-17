import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Portfolio from "@/components/Portfolio";
import { CANDIDATURAS } from "@/data/candidaturas";

/**
 * Enlaces personalizados por candidatura: /p/<slug>
 * Se generan estáticamente desde data/candidaturas.ts y NO se indexan.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CANDIDATURAS).map((slug) => ({ slug }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CandidaturaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cand = CANDIDATURAS[slug];
  if (!cand) notFound();
  return <Portfolio initialPersona={cand.persona} candidatura={{ slug, ...cand }} />;
}
