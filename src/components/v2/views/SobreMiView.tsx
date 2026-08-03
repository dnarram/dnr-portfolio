"use client";

import { useState } from "react";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { useLang } from "@/components/v2/LangProvider";
import Publicaciones from "@/components/v2/Publicaciones";
import { ABOUT_INTRO, L } from "@/data/i18n";
import {
  CERTIFICACIONES,
  EXPERIENCIA,
  FORMACION,
  IDIOMAS,
  METRICAS,
  TRAYECTORIA_UI,
  type Etapa,
} from "@/data/trayectoria";

/**
 * Bloque maestro-detalle de trayectoria.
 * Al pasar por encima (o enfocar con teclado, o tocar en móvil) de una etapa,
 * sus logros se despliegan en el panel lateral. En pantallas pequeñas el
 * detalle se despliega bajo la propia etapa, que es lo natural al tacto.
 */
function Trayectoria({ etapas, titulo }: { etapas: Etapa[]; titulo: string }) {
  const { lang } = useLang();
  const [activo, setActivo] = useState(0);
  const t = TRAYECTORIA_UI[lang];
  const actual = etapas[activo];

  return (
    <section className="v2-sec tr-block">
      <h2>{titulo}</h2>

      <div className="tr-grid">
        <ol className="tr-list">
          {etapas.map((e, i) => (
            <li key={e.id}>
              <button
                className={"tr-item" + (i === activo ? " active" : "")}
                onMouseEnter={() => setActivo(i)}
                onFocus={() => setActivo(i)}
                onClick={() => setActivo(i)}
                aria-expanded={i === activo}
              >
                <span className="tr-dot" aria-hidden="true" />
                <span className="tr-item-main">
                  <span className="tr-rol">{L(e.rol, lang)}</span>
                  <span className="tr-org">{L(e.org, lang)}</span>
                  <span className="tr-meta">
                    {L(e.fechas, lang)} · {L(e.duracion, lang)} · {L(e.lugar, lang)}
                  </span>
                </span>
              </button>

              {/* Detalle en línea (solo móvil) */}
              {i === activo && (
                <div className="tr-inline">
                  <Detalle etapa={e} lang={lang} label={t.achievements} />
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Panel lateral (solo escritorio) */}
        <aside className="tr-panel" aria-live="polite">
          <Detalle etapa={actual} lang={lang} label={t.achievements} />
        </aside>
      </div>
    </section>
  );
}

function Detalle({ etapa, lang, label }: { etapa: Etapa; lang: "es" | "en"; label: string }) {
  return (
    <div className="tr-detalle">
      <p className="tr-contexto">{L(etapa.contexto, lang)}</p>
      <p className="tr-label">{label}</p>
      <ul className="tr-logros">
        {etapa.logros.map((lg, i) => (
          <li key={i}>{L(lg, lang)}</li>
        ))}
      </ul>
      {etapa.tags.length > 0 && (
        <div className="tr-tags">
          {etapa.tags.map((tg) => (
            <span key={tg} className="tr-tag">
              {tg}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SobreMiView() {
  const { lang, ui } = useLang();
  const t = TRAYECTORIA_UI[lang];

  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">{ui.about.title}</h1>

        {/* Presentación */}
        <div className="v2-about">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/avatar.png" alt="David Naranjo Ramírez" className="v2-avatar sm" />
          <div>
            {ABOUT_INTRO.map((par, i) => (
              <p key={i}>{L(par, lang)}</p>
            ))}
          </div>
        </div>

        {/* Métricas de cabecera */}
        <div className="tr-metricas">
          {METRICAS.map((m, i) => (
            <div key={i} className="tr-metrica">
              <span className="tr-metrica-valor">{m.valor}</span>
              <span className="tr-metrica-label">{L(m.etiqueta, lang)}</span>
            </div>
          ))}
        </div>

        <Trayectoria etapas={EXPERIENCIA} titulo={t.experience} />
        <Trayectoria etapas={FORMACION} titulo={t.education} />

        {/* Certificaciones */}
        <section className="v2-sec">
          <h2>{t.certifications}</h2>
          <ul className="tr-certs">
            {CERTIFICACIONES.map((c, i) => (
              <li key={i}>
                <span className="tr-cert-nombre">{L(c.nombre, lang)}</span>
                <span className="tr-cert-meta">
                  {L(c.emisor, lang)} · {c.anio}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Publicaciones />

        {/* Idiomas */}
        <section className="v2-sec">
          <h2>{t.languages}</h2>
          <div className="tr-idiomas">
            {IDIOMAS.map((idm, i) => (
              <div key={i} className="tr-idioma">
                <div className="tr-idioma-head">
                  <span>{L(idm.idioma, lang)}</span>
                  <span className="tr-idioma-nivel">{idm.nivel}</span>
                </div>
                <div className="tr-barra" aria-hidden="true">
                  <div className="tr-barra-fill" style={{ width: `${idm.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <FloatingConcierge />
    </div>
  );
}
