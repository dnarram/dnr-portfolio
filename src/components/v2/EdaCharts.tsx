"use client";

/**
 * Gráficos SVG propios (marca DNR) para el storytelling de EDAFatalForce.
 * Vectoriales, ligeros, funcionan en claro/oscuro vía currentColor y las
 * variables CSS de la paleta. Datos = cifras reales del README del proyecto.
 * Tono sobrio: es un tema sensible; sin dramatismo, foco en el método.
 */

const COPPER = "var(--accent)";
const NAVY = "var(--heading, #162B43)";
const GREY = "var(--text-2, #64748B)";

/* ── 1. Ranking normalizado: bruto vs. por 100k (el hallazgo estrella) ── */
export function ChartRankingSwap() {
  // Ilustrativo de la inversión: en bruto lideran CA/TX; per cápita, WV/MS/VA.
  const bruto = [
    { st: "CA", v: 100 },
    { st: "TX", v: 88 },
    { st: "FL", v: 60 },
    { st: "AZ", v: 42 },
    { st: "WV", v: 9 },
  ];
  const norm = [
    { st: "WV", v: 100 },
    { st: "MS", v: 92 },
    { st: "VA", v: 78 },
    { st: "NM", v: 74 },
    { st: "CA", v: 31 },
  ];
  const bar = (rows: typeof bruto, x0: number, title: string) => {
    const w = 150;
    return (
      <g transform={`translate(${x0},0)`}>
        <text x={w / 2} y={16} textAnchor="middle" fontSize="11" fontWeight="700" fill={NAVY}>
          {title}
        </text>
        {rows.map((r, i) => {
          const y = 34 + i * 30;
          const bw = (r.v / 100) * (w - 34);
          const hot = i === 0;
          return (
            <g key={r.st}>
              <text x={0} y={y + 11} fontSize="10" fontFamily="monospace" fill={GREY}>
                {r.st}
              </text>
              <rect x={26} y={y} width={bw} height={15} rx={2} fill={hot ? COPPER : NAVY} opacity={hot ? 1 : 0.28} />
            </g>
          );
        })}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 380 190" className="eda-svg" role="img" aria-label="Ranking bruto frente a normalizado por población">
      {bar(bruto, 8, "Incidentes totales")}
      {bar(norm, 210, "Por 100.000 hab.")}
      <text x={190} y={185} textAnchor="middle" fontSize="9.5" fill={GREY}>
        WV, MS y VA — invisibles en bruto — encabezan la tasa per cápita
      </text>
    </svg>
  );
}

/* ── 2. Salud mental: tasa de amenaza letal (contraintuitivo, 🟢) ── */
export function ChartMentalHealth() {
  const rows = [
    { label: "Con enfermedad mental", v: 35.3, hot: true },
    { label: "Sin enfermedad mental", v: 44.4, hot: false },
  ];
  const w = 340;
  return (
    <svg viewBox="0 0 380 130" className="eda-svg" role="img" aria-label="Tasa de amenaza letal según salud mental">
      {rows.map((r, i) => {
        const y = 22 + i * 46;
        const bw = (r.v / 50) * (w - 40);
        return (
          <g key={i}>
            <text x={0} y={y - 4} fontSize="10.5" fill={NAVY}>
              {r.label}
            </text>
            <rect x={0} y={y} width={bw} height={20} rx={3} fill={r.hot ? COPPER : NAVY} opacity={r.hot ? 1 : 0.3} />
            <text x={bw + 6} y={y + 15} fontSize="12" fontWeight="700" fill={r.hot ? COPPER : NAVY}>
              {r.v}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── 3. Correlación socioeconómica (Spearman, 🟡) ── */
export function ChartSocioeconomic() {
  const rows = [
    { label: "Ingreso per cápita ↔ incidencia", r: -0.455, sign: "negativa" },
    { label: "Tasa de pobreza ↔ incidencia", r: +0.397, sign: "positiva" },
  ];
  const cx = 190; // centro (r=0)
  const scale = 150; // r=1 → 150px
  return (
    <svg viewBox="0 0 380 130" className="eda-svg" role="img" aria-label="Correlaciones de Spearman socioeconómicas">
      <line x1={cx} y1={20} x2={cx} y2={110} stroke={GREY} strokeWidth="1" strokeDasharray="3 3" />
      <text x={cx} y={124} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={GREY}>
        r = 0
      </text>
      {rows.map((r, i) => {
        const y = 30 + i * 42;
        const len = Math.abs(r.r) * scale;
        const x = r.r < 0 ? cx - len : cx;
        return (
          <g key={i}>
            <text x={8} y={y - 5} fontSize="10" fill={NAVY}>
              {r.label}
            </text>
            <rect x={x} y={y} width={len} height={16} rx={2} fill={COPPER} opacity={0.85} />
            <text x={r.r < 0 ? x - 6 : x + len + 6} y={y + 13} textAnchor={r.r < 0 ? "end" : "start"} fontSize="11" fontWeight="700" fill={NAVY}>
              {r.r > 0 ? "+" : ""}
              {r.r}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── 4. Clustering K-Means: 4 perfiles (PCA 2D esquemático, 🟡) ── */
export function ChartClusters() {
  // 4 nubes esquemáticas separadas parcialmente (ilustra PCA 2D).
  const clusters = [
    { cx: 95, cy: 70, label: "Desarmado", n: 14 },
    { cx: 250, cy: 55, label: "Arma de fuego", n: 18 },
    { cx: 120, cy: 150, label: "Salud mental", n: 12 },
    { cx: 270, cy: 145, label: "Persecución", n: 10 },
  ];
  const rnd = (seed: number) => {
    let s = seed;
    return () => (s = (s * 9301 + 49297) % 233280) / 233280;
  };
  return (
    <svg viewBox="0 0 380 210" className="eda-svg" role="img" aria-label="Cuatro perfiles de incidente por K-Means">
      {clusters.map((c, ci) => {
        const r = rnd(ci * 77 + 3);
        return (
          <g key={ci}>
            {Array.from({ length: c.n }).map((_, i) => (
              <circle
                key={i}
                cx={c.cx + (r() - 0.5) * 60}
                cy={c.cy + (r() - 0.5) * 46}
                r={3}
                fill={ci === 1 ? COPPER : NAVY}
                opacity={ci === 1 ? 0.75 : 0.4}
              />
            ))}
            <text x={c.cx} y={c.cy - 30} textAnchor="middle" fontSize="10" fontWeight="600" fill={ci === 1 ? COPPER : NAVY}>
              {c.label}
            </text>
          </g>
        );
      })}
      <text x={190} y={204} textAnchor="middle" fontSize="9" fill={GREY}>
        Proyección PCA 2D · k = 4 (elbow method) · etiquetas interpretativas
      </text>
    </svg>
  );
}
