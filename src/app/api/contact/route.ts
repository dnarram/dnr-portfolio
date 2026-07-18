import { NextRequest, NextResponse } from "next/server";

/**
 * /api/contact — canal de captación opt-in.
 *
 * A diferencia de /api/chat (que habla con el modelo de IA y por eso pide
 * NO incluir datos personales), este endpoint recibe el email que el
 * visitante entrega VOLUNTARIAMENTE para que David le responda. El dato
 * NO se envía a ningún proveedor de IA: solo se reenvía a David por
 * Telegram. Base legal RGPD: consentimiento explícito del visitante al
 * pulsar "Enviar a David".
 */

const MAX_NOTE = 1000;
const MAX_TRANSCRIPT = 6;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const buckets = new Map<string, { count: number; start: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.start > RATE_WINDOW_MS) {
    buckets.set(ip, { count: 1, start: now });
    return false;
  }
  b.count++;
  return b.count > RATE_LIMIT;
}

// Validación de email deliberadamente simple: descarta basura obvia sin
// pretender validar entregabilidad (eso lo dirá el primer correo real).
function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

const esc = (s: string) => s.replace(/[<&>]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { email, note, persona, empresa, rol, transcript } = body as {
    email?: unknown;
    note?: unknown;
    persona?: unknown;
    empresa?: unknown;
    rol?: unknown;
    transcript?: unknown;
  };

  if (typeof email !== "string" || !isEmail(email.trim())) {
    return NextResponse.json({ error: "Introduce un email válido." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Demasiados envíos. Espera unos minutos." }, { status: 429 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  // Si Telegram no está configurado, no perdemos el lead: devolvemos ok
  // igualmente para no dar mala experiencia, pero lo dejamos en el log.
  if (!token || !chatId) {
    console.warn("Contacto recibido pero Telegram no está configurado:", email);
    return NextResponse.json({ ok: true });
  }

  const emailStr = email.trim().slice(0, 254);
  const noteStr = typeof note === "string" ? note.slice(0, MAX_NOTE) : "";
  const personaStr = typeof persona === "string" ? persona.slice(0, 40) : "—";
  const empresaStr = typeof empresa === "string" ? empresa.slice(0, 120) : "";
  const rolStr = typeof rol === "string" ? rol.slice(0, 120) : "";

  // Transcripción reciente para que David llegue con contexto a la respuesta.
  let convo = "";
  if (Array.isArray(transcript)) {
    convo = transcript
      .slice(-MAX_TRANSCRIPT)
      .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
      .map((m) => `${m.role === "user" ? "🧑" : "🤖"} ${esc(String(m.content).slice(0, 300))}`)
      .join("\n");
  }

  const lines = [
    "🔔 <b>Nuevo contacto desde tu portfolio</b>",
    `✉️ <b>${esc(emailStr)}</b>`,
    `👤 Vista: ${esc(personaStr)}${empresaStr ? ` · Empresa: <b>${esc(empresaStr)}</b>` : ""}${rolStr ? ` · Rol: ${esc(rolStr)}` : ""}`,
    noteStr ? `📝 ${esc(noteStr)}` : "",
    convo ? `\n<b>Conversación:</b>\n${convo}` : "",
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch (error) {
    console.error("Contacto: error notificando a Telegram:", error);
    return NextResponse.json({ error: "No se pudo enviar. Inténtalo de nuevo." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}