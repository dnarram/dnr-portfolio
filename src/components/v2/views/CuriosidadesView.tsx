"use client";

import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { useLang } from "@/components/v2/LangProvider";
import { CURIOSIDADES, L } from "@/data/i18n";

export default function CuriosidadesView() {
  const { lang, ui } = useLang();
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">{ui.extras.title}</h1>
        <div className="v2-curio-grid">
          {CURIOSIDADES.map((c, i) => (
            <div key={i} className="v2-curio">
              <h3>{L(c.titulo, lang)}</h3>
              <p>{L(c.texto, lang)}</p>
            </div>
          ))}
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}
