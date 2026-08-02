"use client";

import { useState } from "react";
import ChatConcierge from "@/components/ChatConcierge";
import { PERSONAS } from "@/data/personas";
import { useVista } from "@/components/v2/VistaProvider";
import { VISTA_IDS, VISTA_LABELS, vistaToPersona, type VistaId } from "@/data/vistas";
import { useLang } from "@/components/v2/LangProvider";

/**
 * Concierge flotante (v2): burbuja fija abajo a la derecha que abre el
 * chat como popup. Reutiliza el ChatConcierge completo (IA + FAQ + CV).
 *
 * Fase 4: los chips escriben en el MISMO estado de vista que reordena la
 * página. Una sola fuente de verdad para navegación, contenido y CV:
 * si el visitante se identifica aquí, el portfolio entero se adapta detrás;
 * si llegó con ?v=hr, el chat ya arranca con esa persona.
 */
export default function FloatingConcierge() {
  const [open, setOpen] = useState(false);
  const { vista, setVista } = useVista();
  const { lang } = useLang();
  const persona = PERSONAS[vistaToPersona(vista)];

  return (
    <>
      {open && (
        <div className="v2-chat-panel" role="dialog" aria-label="Asistente del portfolio">
          <div className="v2-chat-chips" aria-label="¿Quién eres?">
            {VISTA_IDS.map((v: VistaId) => (
              <button
                key={v}
                className={"v2-chip" + (vista === v ? " active" : "")}
                onClick={() => setVista(v)}
              >
                {VISTA_LABELS[v][lang]}
              </button>
            ))}
          </div>
          <ChatConcierge persona={persona} onClose={() => setOpen(false)} />
        </div>
      )}
      <button
        className="v2-chat-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente"}
        title="Pregúntame sobre David"
      >
        {open ? "×" : "💬"}
      </button>
    </>
  );
}
