import type { Metadata } from "next";
import { CV_PRESETS, displayTitle, parseCvBlocks, selectBlocks } from "@/data/cv";
import type { PersonaId } from "@/data/personas";
import PrintButton from "./PrintButton";

/**
 * /cv — CV adaptado por bloques.
 *
 *   /cv                → todos los bloques públicos (versión completa)
 *   /cv?vista=tech     → selección curada para esa vista (tech|hr|dev|fan)
 *   /cv?blocks=a,b,c   → selección explícita por ids (la que puede
 *                        construir la IA del chat; ids inválidos se ignoran)
 *
 * El contenido procede EXCLUSIVAMENTE de src/data/cv.ts: aquí no se
 * genera ni se reescribe texto.
 */

export const metadata: Metadata = {
  title: "CV — David Naranjo Ramírez",
  robots: { index: false, follow: false },
};

function field(lines: string[], label: string): string | null {
  const hit = lines.find((l) => l.trim().toLowerCase().startsWith(`- ${label.toLowerCase()}`));
  if (!hit) return null;
  const idx = hit.indexOf(":");
  return idx === -1 ? null : hit.slice(idx + 1).trim();
}

export default async function CvPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const vista =
    typeof sp.vista === "string" && sp.vista in CV_PRESETS ? (sp.vista as PersonaId) : null;
  const blocksParam = typeof sp.blocks === "string" ? sp.blocks.split(",") : null;

  const all = parseCvBlocks();
  const meta = all.find((b) => b.id === "meta_identidad");

  let ids: string[];
  if (blocksParam && blocksParam.length > 0) {
    ids = blocksParam;
  } else if (vista) {
    ids = CV_PRESETS[vista];
  } else {
    ids = all.map((b) => b.id).filter((id) => id !== "meta_identidad");
  }
  const blocks = selectBlocks(ids).filter((b) => b.id !== "meta_identidad");

  const nombre = meta ? field(meta.lines, "Nombre completo") : null;
  const titular = meta ? field(meta.lines, "Titular profesional") : null;
  const tagline = meta ? field(meta.lines, "Tagline de aptitudes") : null;
  const email = meta ? field(meta.lines, "Email de contacto") : null;
  const linkedin = meta ? field(meta.lines, "LinkedIn") : null;
  const github = meta ? field(meta.lines, "GitHub") : null;
  const portfolio = meta ? field(meta.lines, "Portfolio web") : null;
  const ubicacion = meta ? field(meta.lines, "Ubicación") : null;

  return (
    <div className="cv-root">
      <div className="cv-page">
        <div className="cv-toolbar">
          <a href="/" className="cv-back">← Volver al portfolio</a>
          <PrintButton />
        </div>

        <header className="cv-header">
          <h1>{nombre ?? "David Naranjo Ramírez"}</h1>
          {titular && <p className="cv-titular">{titular}</p>}
          {tagline && <p className="cv-tagline">{tagline}</p>}
          <p className="cv-contact">
            {[ubicacion, email, linkedin, github, portfolio].filter(Boolean).join(" · ")}
          </p>
        </header>

        {blocks.map((b) => (
          <section key={b.id} className="cv-block">
            <h2>{displayTitle(b)}</h2>
            <ul>
              {b.lines
                .filter((l) => l.trim().length > 0)
                .map((l, i) => {
                  const t = l.trim();
                  return t.startsWith("- ") ? (
                    <li key={i}>{t.slice(2)}</li>
                  ) : (
                    <li key={i} className="cv-prose">{t}</li>
                  );
                })}
            </ul>
          </section>
        ))}

        <footer className="cv-footer">
          CV generado desde el portfolio adaptativo · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}