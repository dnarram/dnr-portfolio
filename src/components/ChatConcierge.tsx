"use client";

import { useEffect, useRef, useState } from "react";
import type { Persona } from "@/data/personas";
import { track, type OriginContext } from "@/lib/track";

interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
}

/**
 * Concierge del portfolio. Habla con /api/chat, que decide el modo:
 *  - "faq": matcher determinista local (coste 0 €)
 *  - "llm": modelo de IA vía servidor (la key nunca toca el cliente)
 */
export default function ChatConcierge({
  persona,
  empresa,
  rol,
  origin,
  onClose,
}: {
  persona: Persona;
  empresa?: string;
  rol?: string;
  origin?: OriginContext;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola — soy el asistente del portfolio de David. Pregúntame por su experiencia, sus proyectos o su encaje con tu equipo. También puedes pegar una oferta de trabajo.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"faq" | "llm" | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    // Descartamos errores y, si la última pregunta quedó sin respuesta del
    // asistente (por un fallo previo), también esa pregunta huérfana: así el
    // historial nunca acaba con dos mensajes "user" seguidos, cosa que la API
    // del modelo rechaza y que rompía toda la conversación (Causa #1).
    const clean = messages.filter((m) => m.role !== "error");
    while (clean.length > 0 && clean[clean.length - 1].role === "user") {
      clean.pop();
    }
    const history = [...clean, { role: "user" as const, content }];
    setMessages([...messages.filter((m) => m.role !== "error"), { role: "user" as const, content }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // El servidor reconstruye el contexto: aquí solo viaja lo imprescindible.
          messages: history.slice(-10).map(({ role, content }) => ({ role, content })),
          persona: persona.id,
          empresa,
          rol,
          context: origin ?? {},
        }),
      });
      const data = (await res.json()) as { reply?: string; mode?: "faq" | "llm"; error?: string };
      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "error", content: data.error ?? "El asistente no está disponible ahora mismo." },
        ]);
      } else {
        if (data.mode) setMode(data.mode);
        const reply = data.reply?.trim();
        setMessages((prev) => [
          ...prev,
          reply
            ? { role: "assistant", content: reply }
            : { role: "error", content: "El asistente no devolvió respuesta. Inténtalo de nuevo." },
        ]);
        track("chat_message", { mode: data.mode ?? "faq", persona: persona.id });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "No se pudo conectar con el asistente. Comprueba tu conexión e inténtalo de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="chat-panel" role="dialog" aria-label="Asistente del portfolio">
      <div className="chat-head">
        <span className="t">concierge · contexto: {persona.chip}</span>
        <button className="chat-close" onClick={onClose} aria-label="Cerrar chat">
          ×
        </button>
      </div>
      <div className="chat-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={"msg " + (m.role === "user" ? "user" : m.role === "error" ? "err" : "ai")}>
            {m.content}
          </div>
        ))}
        {loading && <div className="typing">escribiendo…</div>}
      </div>
      {messages.length <= 1 && (
        <div className="hints">
          {persona.chatHints.map((h) => (
            <button key={h} className="hint" onClick={() => void send(h)}>
              {h}
            </button>
          ))}
        </div>
      )}
      <div className="mode-note">
        {mode === "llm"
          ? "modo: ia — las preguntas se procesan con un proveedor externo; no incluyas datos personales"
          : "modo: faq — respuestas locales de una base verificada; no incluyas datos personales"}
      </div>
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={1}
          value={input}
          placeholder="Escribe tu pregunta…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="chat-send" onClick={() => void send()} disabled={loading || !input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}
