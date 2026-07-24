"use client";

import { useState } from "react";
import ChatConcierge from "@/components/ChatConcierge";
import { PERSONAS, type PersonaId } from "@/data/personas";

/**
 * Concierge flotante (v2): burbuja fija abajo a la derecha que abre el
 * chat como popup. Reutiliza el ChatConcierge completo (IA + FAQ + CV).
 * El visitante puede indicar su perfil con un chip para que las
 * respuestas y el CV se adapten; por defecto, perfil técnico.
 */
export default function FloatingConcierge() {
  const [open, setOpen] = useState(false);
  const [personaId, setPersonaId] = useState<PersonaId>("tech");

  return (
    <>
      {open && (
        <div className="v2-chat-panel" role="dialog" aria-label="Asistente del portfolio">
          <div className="v2-chat-chips" aria-label="¿Quién eres?">
            {(Object.keys(PERSONAS) as PersonaId[]).map((id) => (
              <button
                key={id}
                className={"v2-chip" + (personaId === id ? " active" : "")}
                onClick={() => setPersonaId(id)}
              >
                {PERSONAS[id].chip}
              </button>
            ))}
          </div>
          <ChatConcierge persona={PERSONAS[personaId]} onClose={() => setOpen(false)} />
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