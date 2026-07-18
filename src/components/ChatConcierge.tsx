"use client";

import { useEffect, useRef, useState } from "react";
import type { Persona } from "@/data/personas";
import { track, type OriginContext } from "@/lib/track";

interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
}

// Umbral de aviso por entrada larguísima (algo por debajo del límite del
// servidor, 8000). Una oferta normal ronda los 2000-4000 caracteres.
const MAX_INPUT_CHARS = 7500;

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
  // Campo de contacto opt-in: se despliega solo cuando el visitante muestra
  // interés (pega una oferta o pregunta cómo contactar). El email va DIRECTO
  // a David vía /api/contact, nunca al proveedor de IA.
  const [showContact, setShowContact] = useState(false);
  const [contactDismissed, setContactDismissed] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactNote, setContactNote] = useState("");
  const [contactState, setContactState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    // Entrada larguísima: en vez de truncar en silencio (perdiendo info) o
    // gastar una llamada, pedimos al visitante que pegue solo lo esencial.
    // El límite del servidor es 8000; avisamos algo antes para dar margen.
    if (content.length > MAX_INPUT_CHARS) {
      setInput("");
      setMessages((prev) => [
        ...prev,
        { role: "user", content },
        {
          role: "assistant",
          content:
            "Eso es bastante largo y podría perder detalle si lo proceso entero. Pégame solo la sección de requisitos y responsabilidades de la oferta y te doy el encaje de David punto por punto.",
        },
      ]);
      return;
    }

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

  // Señales de interés: una oferta pegada (texto largo) o preguntar por
  // contacto/contratación despliega el campo de contacto de forma natural.
  useEffect(() => {
    if (showContact || contactDismissed) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const t = lastUser.content.toLowerCase();
    const interesado =
      lastUser.content.length > 400 ||
      /contact|contrat|correo|email|e-mail|escrib|hablar con david|llamar|entrevista/.test(t);
    if (interesado) setShowContact(true);
  }, [messages, showContact, contactDismissed]);

  const sendContact = async () => {
    const email = contactEmail.trim();
    if (!email || contactState === "sending") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactState("error");
      return;
    }
    setContactState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          note: contactNote.trim(),
          persona: persona.id,
          empresa,
          rol,
          transcript: messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setContactState("sent");
      track("contact_submitted", { persona: persona.id });
    } catch {
      setContactState("error");
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
      {showContact && (
        <div className="contact-box">
          {contactState === "sent" ? (
            <p className="contact-ok">✓ Enviado. David recibirá tu email y te responderá.</p>
          ) : (
            <>
              <div className="contact-top">
                <p className="contact-lead">¿Quieres que David te escriba? Déjale tu email y te responde él directamente.</p>
                <button
                  className="contact-dismiss"
                  onClick={() => {
                    setShowContact(false);
                    setContactDismissed(true);
                  }}
                  aria-label="Cerrar campo de contacto"
                >
                  ×
                </button>
              </div>
              <input
                className="contact-input"
                type="email"
                inputMode="email"
                placeholder="tu@email.com"
                value={contactEmail}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  if (contactState === "error") setContactState("idle");
                }}
              />
              <input
                className="contact-input"
                type="text"
                placeholder="Mensaje corto (opcional): empresa, puesto…"
                value={contactNote}
                onChange={(e) => setContactNote(e.target.value)}
              />
              <button className="contact-send" onClick={() => void sendContact()} disabled={contactState === "sending"}>
                {contactState === "sending" ? "Enviando…" : "Enviar a David"}
              </button>
              {contactState === "error" && <span className="contact-err">Revisa el email e inténtalo de nuevo.</span>}
              <span className="contact-legal">Solo se usa para que David te responda. No se comparte con terceros.</span>
            </>
          )}
        </div>
      )}
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
