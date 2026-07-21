import path from "path";
import fs from "fs";
import React from "react";
import { Document, Font, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import {
  atsSection,
  toCvEntry,
  PERSONA_AFFINITY,
  type CvBlock,
  type CvEntry,
  type CvLine,
} from "@/data/cv";
import type { PersonaId } from "@/data/personas";

/**
 * CV adaptado en PDF — compacto, jerárquico y ATS-friendly. Marca DNR.
 *
 * Diseño (manual DNR, paleta clara): nombre en TEXTO real (los ATS no
 * leen imágenes), logo Simple a la derecha (<300px ⇒ Simple, según
 * manual), secciones con encabezados estándar, una columna, texto
 * 100% seleccionable, plano y mate.
 *
 * Jerarquía: cada línea tiene prioridad 1/2/3 y afinidades. Se incluye
 * SIEMPRE todo p1; después p2 y p3 por orden de afinidad con el
 * visitante hasta llenar 2 páginas. Verificación exacta: se renderiza,
 * se cuentan páginas y se recortan opcionales hasta caber.
 */

const FONT_DIR = path.join(process.cwd(), "public", "fonts");
const BRAND_DIR = path.join(process.cwd(), "public", "brand");

let fontsReady = false;
function ensureFonts() {
  if (fontsReady) return;
  Font.register({
    family: "Inter",
    fonts: [
      { src: path.join(FONT_DIR, "Inter-500.ttf"), fontWeight: 500 },
      { src: path.join(FONT_DIR, "Inter-600.ttf"), fontWeight: 600 },
      { src: path.join(FONT_DIR, "Inter-800.ttf"), fontWeight: 800 },
    ],
  });
  Font.register({
    family: "JetBrains Mono",
    fonts: [{ src: path.join(FONT_DIR, "JBMono-600.ttf"), fontWeight: 600 }],
  });
  fontsReady = true;
}

function countPdfPages(buf: Buffer): number {
  const m = buf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g);
  return m ? m.length : 1;
}

const C = {
  ink: "#2C3E50",
  head: "#162B43",
  sub: "#64748B",
  accent: "#B95319",
  hairline: "#E2E8F0",
  faint: "#94A3B8",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 34,
    paddingHorizontal: 40,
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 8.9,
    color: C.ink,
    backgroundColor: "#FFFFFF",
  },
  accentBar: { position: "absolute", top: 0, left: 0, bottom: 0, width: 5, backgroundColor: C.accent },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { fontWeight: 800, fontSize: 17, color: C.head, letterSpacing: 0.3 },
  titular: { fontWeight: 600, fontSize: 8.8, color: C.accent, marginTop: 1.5 },
  contactPrimary: { fontSize: 8, color: C.ink, marginTop: 4 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 3 },
  contactItem: { flexDirection: "row", marginRight: 12, marginTop: 1 },
  contactLabel: { fontWeight: 600, fontSize: 7.2, color: C.accent, marginRight: 3 },
  contactValue: { fontSize: 7.2, color: C.sub },
  logo: { width: 74, height: 40 },
  headerRule: { borderBottomWidth: 2, borderBottomColor: C.accent, marginTop: 8, marginBottom: 11 },

  pageNum: {
    position: "absolute",
    bottom: 14,
    right: 40,
    fontFamily: "JetBrains Mono",
    fontWeight: 600,
    fontSize: 6.6,
    color: C.faint,
  },

  section: { marginBottom: 11 },
  h2: {
    fontWeight: 800,
    fontSize: 8.2,
    color: C.head,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    borderBottomWidth: 0.7,
    borderBottomColor: C.hairline,
    paddingBottom: 1.5,
    marginBottom: 5,
  },

  entry: { marginBottom: 7 },
  entryHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3.5 },
  entryTitle: { fontWeight: 600, fontSize: 9.1, color: C.head, flex: 1, paddingRight: 8 },
  entryAside: { fontSize: 7.4, color: C.sub },
  entrySub: { fontSize: 8.6, color: C.sub, marginBottom: 3.5, textAlign: "justify" },

  row: { flexDirection: "row", marginTop: 1.5 },
  dot: { width: 8, color: C.accent, fontWeight: 800, fontSize: 8.9 },
  itemText: { flex: 1, textAlign: "justify" },
  itemLabel: { fontWeight: 600, color: C.head },
  prose: { textAlign: "justify" },

  footer: {
    position: "absolute",
    bottom: 14,
    left: 40,
    right: 40,
    fontFamily: "JetBrains Mono",
    fontWeight: 600,
    fontSize: 6.2,
    color: C.faint,
  },
});

function field(lines: string[], label: string): string | null {
  const hit = lines.find((l) => l.trim().toLowerCase().startsWith(`- ${label.toLowerCase()}`));
  if (!hit) return null;
  const idx = hit.indexOf(":");
  return idx === -1 ? null : hit.slice(idx + 1).trim();
}

/* Bloques "planos": la cabecera de sección ya los nombra, así que NO
   llevan encabezado de entrada propio (evita "Idiomas → Idiomas",
   "Competencias → Competencias transversales", etc.). Los bloques de
   entrada (exp_/edu_/proj_) sí tienen encabezado real (puesto, título,
   proyecto). El resumen se maneja aparte como "Perfil". */
function isFlatBlock(id: string): boolean {
  return (
    id.startsWith("skill_") ||
    id.startsWith("extras_") ||
    id === "idiomas" ||
    id === "certs" ||
    id === "condiciones" ||
    id === "motivacion" ||
    id === "objetivo_puesto"
  );
}

/* ── Motor de selección jerárquica ─────────────────────────────── */

interface Renderable {
  entry: CvEntry;
  section: string;
  visible: CvLine[];
}

interface OptionalRef { r: Renderable; line: CvLine }

function lineUnits(l: CvLine): number {
  return Math.max(1, Math.ceil(l.text.length / 110));
}

/** Presupuesto heurístico inicial (~2 páginas densas); la verificación
    exacta por conteo de páginas ajusta después. */
const BUDGET = 102;

export function assembleCv(blocks: CvBlock[], persona: PersonaId): Renderable[] {
  const affinities = new Set(PERSONA_AFFINITY[persona] ?? []);
  const renderables: Renderable[] = blocks.map((b) => ({
    entry: toCvEntry(b),
    section: atsSection(b.id),
    visible: [],
  }));

  let units = 0;

  // Pase 1 — obligatorio: todo p1 (+ coste fijo de cada encabezado de entrada)
  for (const r of renderables) {
    units += r.entry.heading ? 1 : 0;
    if (r.entry.sub) units += 1;
    for (const l of r.entry.lines) {
      if (l.priority === 1) {
        r.visible.push(l);
        units += lineUnits(l);
      }
    }
  }

  // Pases 2 y 3 — opcionales por prioridad y afinidad con el visitante
  const optionals: OptionalRef[] = [];
  for (const prio of [2, 3] as const) {
    // Primero los que matchean la afinidad de la persona, en orden natural
    for (const pass of [0, 1]) {
      for (const r of renderables) {
        for (const l of r.entry.lines) {
          if (l.priority !== prio) continue;
          const matches = l.affinity.some((a) => affinities.has(a));
          if ((pass === 0 && matches) || (pass === 1 && !matches)) {
            optionals.push({ r, line: l });
          }
        }
      }
    }
  }

  const included: OptionalRef[] = [];
  for (const o of optionals) {
    const cost = lineUnits(o.line);
    if (units + cost > BUDGET) continue;
    o.r.visible.push(o.line);
    included.push(o);
    units += cost;
  }

  // Restaurar el orden natural de las líneas dentro de cada entrada
  for (const r of renderables) {
    const order = new Map(r.entry.lines.map((l, i) => [l, i]));
    r.visible.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  }

  // Guardamos los opcionales incluidos para poder recortarlos (exacto)
  lastIncluded = included;
  return renderables;
}

let lastIncluded: OptionalRef[] = [];

/* ── Render ─────────────────────────────────────────────────────── */

function renderItem(l: CvLine, key: number) {
  if (l.role === "prose") {
    return (
      <Text key={key} style={styles.prose}>{l.text}</Text>
    );
  }
  // "Etiqueta: valor" → etiqueta en semibold para escaneo rápido
  const idx = l.text.indexOf(":");
  const hasLabel = idx > 0 && idx < 40;
  return (
    <View key={key} style={styles.row}>
      <Text style={styles.dot}>•</Text>
      {hasLabel ? (
        <Text style={styles.itemText}>
          <Text style={styles.itemLabel}>{l.text.slice(0, idx + 1)}</Text>
          {" " + l.text.slice(idx + 1).trim()}
        </Text>
      ) : (
        <Text style={styles.itemText}>{l.text}</Text>
      )}
    </View>
  );
}

export async function buildCvPdf(
  meta: CvBlock | undefined,
  blocks: CvBlock[],
  persona: PersonaId = "tech",
  locationOverride?: string,
): Promise<Buffer> {
  ensureFonts();

  const nombre = meta ? field(meta.lines, "Nombre completo") ?? "David Naranjo Ramírez" : "David Naranjo Ramírez";
  const titular = meta ? field(meta.lines, "Titular profesional") : null;

  // Contacto estructurado: URLs limpias (sin esquema ni www) y con etiqueta.
  const clean = (u: string) => u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  const cf = (label: string) => (meta ? field(meta.lines, label) : null);
  const ubicacion = locationOverride ?? cf("Ubicación");
  const email = cf("Email de contacto");
  const primary = [ubicacion, email].filter(Boolean).join("   ·   ");
  const links = (
    [
      ["LinkedIn", cf("LinkedIn")],
      ["GitHub", cf("GitHub")],
      ["Portfolio", cf("Portfolio web")],
    ] as const
  )
    .filter(([, v]) => Boolean(v))
    .map(([label, v]) => ({ label, value: clean(v as string) }));

  const logoPath = path.join(BRAND_DIR, "logo-simple-claro.png");
  const logo = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

  const renderables = assembleCv(blocks, persona);
  const included = lastIncluded;

  const makeDoc = (rs: Renderable[]) => {
    // Agrupar por sección estándar preservando el orden de aparición.
    // Un bloque "plano" (skills, idiomas, certs…) no muestra su encabezado
    // propio, así que si se quedó sin líneas visibles NO aporta nada: se
    // descarta para no dejar una sección con el título y el cuerpo vacío (#2).
    const hasContent = (r: Renderable): boolean => {
      const flat = r.section === "Perfil" || isFlatBlock(r.entry.blockId);
      if (flat) return r.visible.length > 0;
      return Boolean(r.entry.heading) || r.visible.length > 0;
    };
    const sections: Array<{ name: string; items: Renderable[] }> = [];
    for (const r of rs) {
      if (!hasContent(r)) continue;
      const last = sections[sections.length - 1];
      if (last && last.name === r.section) last.items.push(r);
      else sections.push({ name: r.section, items: [r] });
    }

    return (
      <Document title="CV — David Naranjo Ramírez" author="David Naranjo Ramírez">
        <Page size="A4" style={styles.page}>
          <View style={styles.accentBar} fixed />

          <View style={styles.headerRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.name}>{nombre.toUpperCase()}</Text>
              {titular && <Text style={styles.titular}>{titular}</Text>}
              {primary ? <Text style={styles.contactPrimary}>{primary}</Text> : null}
              {links.length > 0 && (
                <View style={styles.contactRow}>
                  {links.map((it) => (
                    <View key={it.label} style={styles.contactItem}>
                      <Text style={styles.contactLabel}>{it.label}</Text>
                      <Text style={styles.contactValue}>{it.value}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            {logo && <Image style={styles.logo} src={{ data: logo, format: "png" }} />}
          </View>
          <View style={styles.headerRule} />

          <Text
            style={styles.pageNum}
            fixed
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />

          {sections.map((s, si) => {
            const flatSection = s.name === "Perfil";
            const renderEntry = (r: Renderable) => {
              const flat = flatSection || isFlatBlock(r.entry.blockId);
              return (
                <View key={r.entry.blockId} style={flat ? undefined : styles.entry}>
                  {!flat && r.entry.heading && (
                    <View style={styles.entryHead}>
                      <Text style={styles.entryTitle}>{r.entry.heading}</Text>
                      {r.entry.aside ? <Text style={styles.entryAside}>{r.entry.aside}</Text> : null}
                    </View>
                  )}
                  {r.entry.sub ? <Text style={styles.entrySub}>{r.entry.sub}</Text> : null}
                  {r.visible.map((l, i) => renderItem(l, i))}
                </View>
              );
            };
            const [first, ...rest] = s.items;
            return (
              <View key={si} style={styles.section}>
                {/* Cabecera + primer bloque van juntos: un título de sección
                    nunca queda huérfano al final de una página (#2). */}
                <View wrap={false}>
                  <Text style={styles.h2}>{s.name}</Text>
                  {first ? renderEntry(first) : null}
                </View>
                {rest.map((r) => renderEntry(r))}
              </View>
            );
          })}

          <Text style={styles.footer} fixed>
            CV adaptado generado desde el portfolio · dnr-portfolio-omega.vercel.app
          </Text>
        </Page>
      </Document>
    );
  };

  let active = renderables.slice();
  let buf = Buffer.from(await renderToBuffer(makeDoc(active)));

  // Verificación exacta del tope de 2 páginas, en dos niveles:
  // 1) quitar opcionales por lotes desde el final (los de menor
  //    prioridad/afinidad entraron los últimos);
  // 2) si aun con solo lo obligatorio no cabe, quitar entradas enteras
  //    del final (las menos relevantes según el orden de selección).
  let guard = 16;
  while (countPdfPages(buf) > 2 && guard-- > 0) {
    if (included.length > 0) {
      const batch = Math.max(1, Math.floor(included.length / 3));
      for (let i = 0; i < batch; i++) {
        const drop = included.pop();
        if (drop) drop.r.visible = drop.r.visible.filter((l) => l !== drop.line);
      }
    } else if (active.length > 2) {
      active = active.slice(0, active.length - 1);
    } else {
      break;
    }
    buf = Buffer.from(await renderToBuffer(makeDoc(active)));
  }
  return buf;
}