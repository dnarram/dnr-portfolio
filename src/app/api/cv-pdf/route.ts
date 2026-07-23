import { NextRequest, NextResponse } from "next/server";
import { CV_PRESETS, ensureCompleteSelection, parseCvBlocks, selectBlocks } from "@/data/cv";
import type { PersonaId } from "@/data/personas";
import { buildCvPdf } from "@/lib/cv-pdf";

/**
 * /api/cv-pdf — descarga del CV adaptado en PDF (un clic).
 *
 *   ?blocks=id1,id2,...  → selección hecha por la IA según la conversación
 *   ?vista=tech|hr|dev|fan → selección curada por vista (respaldo/modo FAQ)
 *   (sin parámetros)     → vista técnica por defecto
 *
 * Los ids inválidos se ignoran; el texto procede solo de cv.ts.
 */

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blocksParam = searchParams.get("blocks");
  const vistaParam = searchParams.get("vista");

  const all = parseCvBlocks();
  const meta = all.find((b) => b.id === "meta_identidad");

  let ids: string[];
  if (blocksParam) {
    ids = blocksParam.split(",");
  } else if (vistaParam && vistaParam in CV_PRESETS) {
    ids = CV_PRESETS[vistaParam as PersonaId];
  } else {
    ids = CV_PRESETS.tech;
  }

  const pParam = searchParams.get("p");
  const persona: PersonaId =
    (pParam && pParam in CV_PRESETS ? (pParam as PersonaId) : null) ??
    (vistaParam && vistaParam in CV_PRESETS ? (vistaParam as PersonaId) : "tech");

  // Completitud garantizada: la selección marca prioridad, no exclusión.
  ids = ensureCompleteSelection(ids, persona);

  let blocks = selectBlocks(ids).filter((b) => b.id !== "meta_identidad");

  // Si la selección venía vacía o toda inválida, respaldo a la vista técnica.
  if (blocks.length === 0) {
    blocks = selectBlocks(CV_PRESETS.tech).filter((b) => b.id !== "meta_identidad");
  }

  try {
    const locParam = searchParams.get("loc");
    const loc =
      locParam === "madrid" ? "Madrid, España" : locParam === "malaga" ? "Málaga, España" : undefined;
    const pdf = await buildCvPdf(meta, blocks, persona, loc);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="CV_David_Naranjo_Ramirez.pdf"',
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("cv-pdf error:", error);
    return NextResponse.json({ error: "No se pudo generar el PDF." }, { status: 500 });
  }
}