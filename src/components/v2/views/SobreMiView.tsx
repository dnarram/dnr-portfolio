"use client";

import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { useLang } from "@/components/v2/LangProvider";
import { ABOUT_INTRO, ETAPAS, L } from "@/data/i18n";

export default function SobreMiView() {
  const { lang, ui } = useLang();
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">{ui.about.title}</h1>
        <div className="v2-about">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/avatar.png" alt="David Naranjo Ramírez" className="v2-avatar sm" />
          <div>
            {ABOUT_INTRO.map((par, i) => (
              <p key={i}>{L(par, lang)}</p>
            ))}
          </div>
        </div>

        <section className="v2-sec">
          <h2>{ui.about.trajectory}</h2>
          <ul className="v2-timeline">
            {ETAPAS.map((e, i) => (
              <li key={i}>
                <span className="v2-tl-fecha">{L(e.fecha, lang)}</span>
                <span className="v2-tl-titulo">{L(e.titulo, lang)}</span>
                <span className="v2-tl-donde">{L(e.donde, lang)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="v2-sec">
          <h2>{ui.about.languages}</h2>
          <p>{ui.about.languagesValue}</p>
        </section>
      </main>
      <FloatingConcierge />
    </div>
  );
}
