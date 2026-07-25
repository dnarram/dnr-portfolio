"use client";

import type { Lang } from "@/data/i18n";
import {
  ChartRankingSwap,
  ChartMentalHealth,
  ChartSocioeconomic,
  ChartClusters,
} from "@/components/v2/EdaCharts";

/**
 * Storytelling de EDAFatalForce.
 * Tema sensible (uso de fuerza letal policial): tono sobrio, foco en el
 * método y el rigor, sin dramatismo. Bilingüe ES/EN.
 * Estructura: (1) hook del ranking normalizado, (2) los dos bugs que
 * habrían falsificado el análisis, (3) tres hallazgos con su fiabilidad,
 * (4) tabla de las 10 preguntas con su nivel de confianza.
 */

type Copy = {
  hookTitle: string;
  hookBody: string;
  hookCaption: string;
  bugsTitle: string;
  bugsIntro: string;
  bug1Title: string;
  bug1Body: string;
  bug2Title: string;
  bug2Body: string;
  findingsTitle: string;
  mhTitle: string;
  mhBody: string;
  socioTitle: string;
  socioBody: string;
  clusterTitle: string;
  clusterBody: string;
  tableTitle: string;
  tableIntro: string;
  legend: { solid: string; orient: string; explor: string };
  qCol: string;
  relCol: string;
};

const T: Record<Lang, Copy> = {
  es: {
    hookTitle: "Los datos sin contexto mienten",
    hookBody:
      "En números absolutos, California y Texas encabezan los incidentes. Pero al ajustar por población — la pregunta correcta — el ranking se invierte por completo: estados pequeños como Virginia Occidental, Misisipi y Virginia superan con creces a los grandes. Es el hallazgo más comunicable del proyecto: la normalización cambia radicalmente las conclusiones de política pública.",
    hookCaption: "Ranking bruto frente a tasa por 100.000 habitantes.",
    bugsTitle: "Dos bugs que habrían falsificado el análisis",
    bugsIntro:
      "La auditoría del proyecto encontró cinco categorías de problemas. Dos eran errores de codificación que, sin corregir, habrían invalidado preguntas enteras del estudio. Cada corrección se verificó contra los datos crudos.",
    bug1Title: "flee_status = «not» clasificado como «other»",
    bug1Body:
      "El valor «not» — el 53% de los registros, 5.575 filas — no encajaba con la expresión regular que detectaba a quienes no huían, así que todas esas víctimas quedaban mal etiquetadas. La pregunta sobre la paradoja de la fuga era completamente inválida antes de la corrección.",
    bug2Title: "armed_with = «undetermined» tratado como armado",
    bug2Body:
      "463 registros con armamento «indeterminado» caían en el valor por defecto y se contaban como víctimas armadas, cuando en realidad el dato era desconocido. Esto sobreestimaba el porcentaje de víctimas armadas en varias preguntas.",
    findingsTitle: "Tres hallazgos, con su nivel de fiabilidad",
    mhTitle: "Salud mental y desescalada",
    mhBody:
      "Contraintuitivo pero bien fundado: los incidentes relacionados con enfermedad mental presentan una tasa de amenaza letal menor que el resto (35,3% frente a 44,4%, diferencia estadísticamente significativa). Una explicación plausible: los protocolos de intervención en crisis priorizan la desescalada.",
    socioTitle: "Contexto socioeconómico",
    socioBody:
      "A nivel de condado, menor renta se asocia con mayor incidencia (correlación de Spearman r = −0,455), y la pobreza refuerza la relación en sentido positivo (r = +0,397). Con una precaución explícita: es una correlación ecológica, a nivel de condado, no individual — no debe leerse como causa.",
    clusterTitle: "Perfiles de incidente (aprendizaje no supervisado)",
    clusterBody:
      "K-Means con k = 4 (elegido por elbow method) identifica cuatro perfiles interpretables: sospechoso desarmado, confrontación con arma de fuego, incidente asociado a enfermedad mental y persecución vehicular. Las etiquetas son interpretativas, no una salida directa del algoritmo.",
    tableTitle: "Diez preguntas, tres niveles de confianza",
    tableIntro:
      "No todas las conclusiones valen lo mismo. Cada pregunta se etiqueta según la firmeza de su evidencia — la señal de un análisis honesto.",
    legend: {
      solid: "Sólido — conclusión firme dentro del dataset",
      orient: "Orientativo — tendencia significativa con limitaciones",
      explor: "Exploratorio — patrón observable, no causal",
    },
    qCol: "Pregunta de investigación",
    relCol: "Fiabilidad",
  },
  en: {
    hookTitle: "Data without context lies",
    hookBody:
      "In raw counts, California and Texas top the incidents. But adjusting for population — the right question — the ranking flips entirely: small states like West Virginia, Mississippi and Virginia far outrank the big ones. It's the project's most communicable finding: normalisation radically changes the public-policy conclusions.",
    hookCaption: "Raw ranking versus rate per 100,000 inhabitants.",
    bugsTitle: "Two bugs that would have falsified the analysis",
    bugsIntro:
      "The project audit found five categories of issues. Two were coding errors that, left uncorrected, would have invalidated entire research questions. Every fix was verified against the raw data.",
    bug1Title: "flee_status = “not” classified as “other”",
    bug1Body:
      "The value “not” — 53% of records, 5,575 rows — didn't match the regular expression detecting non-fleeing victims, so all of them were mislabelled. The flight-paradox question was completely invalid before the fix.",
    bug2Title: "armed_with = “undetermined” treated as armed",
    bug2Body:
      "463 records with “undetermined” weaponry fell through to the default value and were counted as armed victims, when the data was in fact unknown. This overstated the share of armed victims across several questions.",
    findingsTitle: "Three findings, each with its reliability",
    mhTitle: "Mental health and de-escalation",
    mhBody:
      "Counter-intuitive but well grounded: incidents related to mental illness show a lower lethal-threat rate than the rest (35.3% versus 44.4%, a statistically significant difference). A plausible explanation: crisis-intervention protocols prioritise de-escalation.",
    socioTitle: "Socioeconomic context",
    socioBody:
      "At county level, lower income is associated with higher incidence (Spearman r = −0.455), and poverty reinforces the relationship positively (r = +0.397). With an explicit caveat: this is an ecological correlation, at county — not individual — level, and must not be read as cause.",
    clusterTitle: "Incident profiles (unsupervised learning)",
    clusterBody:
      "K-Means with k = 4 (chosen by the elbow method) identifies four interpretable profiles: unarmed suspect, firearm confrontation, mental-illness-related incident, and vehicle pursuit. The labels are interpretive, not a direct algorithm output.",
    tableTitle: "Ten questions, three confidence levels",
    tableIntro:
      "Not all conclusions carry equal weight. Each question is tagged by the strength of its evidence — the mark of an honest analysis.",
    legend: {
      solid: "Solid — firm conclusion within the dataset",
      orient: "Indicative — significant trend with limitations",
      explor: "Exploratory — observable pattern, not causal",
    },
    qCol: "Research question",
    relCol: "Reliability",
  },
};

type Rel = "solid" | "orient" | "explor";
const QUESTIONS: Array<{ es: string; en: string; rel: Rel }> = [
  { es: "Amenaza asignada según la raza, controlando por armamento", en: "Assigned threat by race, controlling for weaponry", rel: "explor" },
  { es: "¿Huir aumenta la probabilidad de respuesta letal?", en: "Does fleeing raise the chance of a lethal response?", rel: "orient" },
  { es: "Renta del condado ↔ tasa de incidentes por 100k", en: "County income ↔ incident rate per 100k", rel: "orient" },
  { es: "¿Cambió la letalidad tras adoptar body cams?", en: "Did lethality change after body-cam adoption?", rel: "explor" },
  { es: "¿Se agrupan los incidentes en perfiles? (clustering)", en: "Do incidents cluster into profiles?", rel: "orient" },
  { es: "¿Siguen los incidentes la población o el desempleo?", en: "Do incidents track population or unemployment?", rel: "orient" },
  { es: "Tipo de fuerza cuando hay enfermedad mental", en: "Force type when mental illness is present", rel: "solid" },
  { es: "¿Hay estacionalidad y picos temporales?", en: "Is there seasonality and temporal peaks?", rel: "solid" },
  { es: "¿Varía la probabilidad de ir armado con la edad?", en: "Does the chance of being armed vary with age?", rel: "orient" },
  { es: "Ajustando por población, ¿qué estados lideran?", en: "Adjusting for population, which states lead?", rel: "orient" },
];

const DOT: Record<Rel, string> = { solid: "🟢", orient: "🟡", explor: "🔴" };

export default function EdaStorytelling({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <div className="eda-story">
      {/* 1 — Hook */}
      <section className="v2-sec eda-hook">
        <h2>{t.hookTitle}</h2>
        <p>{t.hookBody}</p>
        <ChartRankingSwap />
        <p className="eda-caption">{t.hookCaption}</p>
      </section>

      {/* 2 — Los dos bugs */}
      <section className="v2-sec">
        <h2>{t.bugsTitle}</h2>
        <p>{t.bugsIntro}</p>
        <div className="eda-bug">
          <code>flee_status</code>
          <h3>{t.bug1Title}</h3>
          <p>{t.bug1Body}</p>
        </div>
        <div className="eda-bug">
          <code>armed_with</code>
          <h3>{t.bug2Title}</h3>
          <p>{t.bug2Body}</p>
        </div>
      </section>

      {/* 3 — Tres hallazgos */}
      <section className="v2-sec">
        <h2>{t.findingsTitle}</h2>

        <div className="eda-finding">
          <div className="eda-finding-head">
            <span className="eda-rel">🟢</span>
            <h3>{t.mhTitle}</h3>
          </div>
          <p>{t.mhBody}</p>
          <ChartMentalHealth />
        </div>

        <div className="eda-finding">
          <div className="eda-finding-head">
            <span className="eda-rel">🟡</span>
            <h3>{t.socioTitle}</h3>
          </div>
          <p>{t.socioBody}</p>
          <ChartSocioeconomic />
        </div>

        <div className="eda-finding">
          <div className="eda-finding-head">
            <span className="eda-rel">🟡</span>
            <h3>{t.clusterTitle}</h3>
          </div>
          <p>{t.clusterBody}</p>
          <ChartClusters />
        </div>
      </section>

      {/* 4 — Tabla de fiabilidad */}
      <section className="v2-sec">
        <h2>{t.tableTitle}</h2>
        <p>{t.tableIntro}</p>
        <div className="eda-legend">
          <span>🟢 {t.legend.solid}</span>
          <span>🟡 {t.legend.orient}</span>
          <span>🔴 {t.legend.explor}</span>
        </div>
        <div className="eda-qtable-wrap">
          <table className="eda-qtable">
            <thead>
              <tr>
                <th>{t.qCol}</th>
                <th>{t.relCol}</th>
              </tr>
            </thead>
            <tbody>
              {QUESTIONS.map((q, i) => (
                <tr key={i}>
                  <td>{q[lang]}</td>
                  <td className="eda-qrel">{DOT[q.rel]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
