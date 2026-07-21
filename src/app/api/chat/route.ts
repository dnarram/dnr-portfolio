import { NextRequest, NextResponse } from "next/server";
import { AI_PROFILE, SITE } from "@/data/site";
import { cvContextForPersona, allCvIds } from "@/data/cv";
import { PERSONAS, type PersonaId } from "@/data/personas";
import { matchFaq } from "@/data/faq";

/**
 * /api/chat — concierge del portfolio.
 *
 * Dos modos:
 *  - "faq" (por defecto): matcher determinista, coste 0 €.
 *  - "llm": CHAT_MODE=llm + un proveedor configurado. La key vive
 *    SOLO en el servidor. Proveedores soportados (AI_PROVIDER):
 *      · "groq"      → gratis (free tier, EU-friendly). Recomendado.
 *      · "anthropic" → pago por uso (independiente de Claude Code).
 *
 * Notificación opcional a Telegram: si TELEGRAM_BOT_TOKEN y
 * TELEGRAM_CHAT_ID están definidos, cada conversación relevante
 * (y siempre las ofertas de trabajo pegadas) se avisa por Telegram.
 */

const MAX_MESSAGES = 12;
const MAX_CHARS = 8000;
const RATE_LIMIT = 20; // peticiones
const RATE_WINDOW_MS = 10 * 60 * 1000; // por 10 minutos e IP

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Rate limit en memoria: suficiente para tráfico de portfolio en Vercel Hobby.
// Limitación conocida: se reinicia con cada instancia serverless (documentado en CLAUDE.md).
const buckets = new Map<string, { count: number; start: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.start > RATE_WINDOW_MS) {
    buckets.set(ip, { count: 1, start: now });
    return false;
  }
  bucket.count++;
  return bucket.count > RATE_LIMIT;
}

// Kill switch de presupuesto: tope global de mensajes IA por día.
// En memoria (se reinicia por instancia serverless): es un techo
// aproximado, suficiente como protección de coste en Vercel Hobby.
const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT ?? 400);
let daily = { day: "", count: 0 };

function overDailyBudget(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (daily.day !== today) daily = { day: today, count: 0 };
  daily.count += 1;
  return daily.count > DAILY_LIMIT;
}

function sanitizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (
      typeof m !== "object" ||
      m === null ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.trim().length === 0
    ) {
      return null;
    }
    // Truncar en vez de rechazar: una oferta muy larga se recorta, no rompe.
    const content = m.content.length > MAX_CHARS ? m.content.slice(0, MAX_CHARS) : m.content;
    // Colapsar roles consecutivos: las APIs de los modelos exigen que los
    // roles se alternen. Si llegan dos del mismo rol seguidos, los unimos.
    const prev = out[out.length - 1];
    if (prev && prev.role === m.role) {
      prev.content = `${prev.content}\n\n${content}`;
    } else {
      out.push({ role: m.role, content });
    }
  }
  if (out[out.length - 1].role !== "user") return null;
  return out;
}

function buildSystemPrompt(persona: PersonaId, empresa?: string, rol?: string): string {
  const p = PERSONAS[persona];
  const candidatura = empresa
    ? `\nEste enlace es una candidatura dirigida a ${empresa}${rol ? ` para el puesto de ${rol}` : ""}. Puedes mencionarlo con naturalidad.`
    : "";
  return `Eres el asistente del portfolio web de David Naranjo Ramírez. Respondes únicamente sobre David, su formación, sus proyectos y su posible encaje profesional.

${AI_PROFILE}

CV de David (fuente de verdad; datos verificados por él):
${cvContextForPersona(persona)}

El visitante actual se ha identificado como: "${p.label}". Adapta el registro: técnico y con métricas para perfiles técnicos; claro, humano y orientado a encaje para HR; divulgativo y sin jerga para curiosos.${candidatura}

Reglas estrictas:
- No inventes datos que no estén en el perfil o el CV. Si no sabes algo, dilo con naturalidad y sugiere preguntárselo a David directamente.
- Si el visitante pide el CV de David (o tú se lo ofreces tras analizar una oferta), responde brevemente y añade al FINAL de tu respuesta UNA última línea con este formato exacto: CV_BLOCKS: id1,id2,id3 — entre 8 y 14 ids, elegidos y ORDENADOS por relevancia para ESTE visitante según toda la conversación (su vista, la oferta o rol que haya mencionado, sus preguntas). Empieza siempre por el bloque de resumen más adecuado (resumen_tech, resumen_hr o resumen_fan). Ids disponibles: ${allCvIds().filter((i) => i !== "meta_identidad").join(", ")}. No menciones los ids en el texto visible: esa línea se convierte automáticamente en un botón de descarga del PDF.
- Si el visitante pega una oferta de trabajo, analiza el encaje punto por punto con honestidad: qué requisitos cumple David, cuáles cumple parcialmente y cuáles no.
- Sé conciso: máximo ~120 palabras salvo que pidan más detalle.
- Responde en el idioma del visitante (por defecto, español).`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { messages: rawMessages, persona: rawPersona, empresa, rol, context: rawContext } = body as {
    messages?: unknown;
    persona?: unknown;
    empresa?: unknown;
    rol?: unknown;
    context?: unknown;
  };

  const messages = sanitizeMessages(rawMessages);
  if (!messages) {
    return NextResponse.json({ error: "Mensajes inválidos." }, { status: 400 });
  }

  const persona: PersonaId =
    typeof rawPersona === "string" && rawPersona in PERSONAS ? (rawPersona as PersonaId) : "fan";
  const empresaStr = typeof empresa === "string" ? empresa.slice(0, 120) : undefined;
  const rolStr = typeof rol === "string" ? rol.slice(0, 120) : undefined;
  const context = sanitizeContext(rawContext);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiadas peticiones. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 },
    );
  }

  const provider = (process.env.AI_PROVIDER ?? "groq").toLowerCase();
  const providerKey = provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.GROQ_API_KEY;
  const llmEnabled = Boolean(providerKey) && process.env.CHAT_MODE === "llm" && !overDailyBudget();

  const lastUserMsg = messages[messages.length - 1].content;

  // ── Modo FAQ (0 €) — también respaldo si se agota el presupuesto
  // diario del modo IA ────────────────────────────────────────────
  if (!llmEnabled) {
    const reply = matchFaq(lastUserMsg);
    // Petición de CV sin IA: adjuntamos la descarga con la selección de su vista.
    const cvUrl = /\b(cv|curricul)/i.test(
      lastUserMsg.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    )
      ? `/api/cv-pdf?vista=${persona}`
      : undefined;
    // Aun sin IA, avisamos si alguien pega una oferta: no queremos perderla.
    await notifyTelegram({ persona, empresa: empresaStr, rol: rolStr, context, userMsg: lastUserMsg, mode: "faq" });
    return NextResponse.json({ reply, mode: "faq", ...(cvUrl ? { cvUrl } : {}) });
  }

  // ── Modo LLM ────────────────────────────────────────────────────
  try {
    const reply =
      provider === "anthropic"
        ? await callAnthropic(providerKey as string, persona, empresaStr, rolStr, messages)
        : await callGroq(providerKey as string, persona, empresaStr, rolStr, messages);

    if (reply === null) {
      return NextResponse.json(
        { error: "El asistente no está disponible ahora mismo. Inténtalo en un momento." },
        { status: 502 },
      );
    }

    await notifyTelegram({ persona, empresa: empresaStr, rol: rolStr, context, userMsg: lastUserMsg, mode: "llm" });

    // ── Marcador CV_BLOCKS → botón de descarga ──────────────────
    // La IA solo ELIGE ids de bloques; aquí se validan contra la
    // lista real y se convierten en la URL del PDF. El marcador se
    // elimina del texto visible.
    let visible = reply;
    let cvUrl: string | undefined;
    const marker = reply.match(/CV_BLOCKS:\s*([a-z0-9_,\s]+)/i);
    if (marker) {
      visible = reply.replace(/CV_BLOCKS:\s*[a-z0-9_,\s]+/gi, "").trim();
      const valid = new Set(allCvIds());
      const ids = marker[1]
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((id) => valid.has(id) && id !== "meta_identidad")
        .slice(0, 14);
      cvUrl = ids.length > 0 ? `/api/cv-pdf?blocks=${ids.join(",")}&p=${persona}` : `/api/cv-pdf?vista=${persona}`;
    }

    return NextResponse.json({
      reply: visible.trim() || "No he podido generar una respuesta. Reformula la pregunta o escribe a David directamente.",
      mode: "llm",
      ...(cvUrl ? { cvUrl } : {}),
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Error de conexión con el asistente." }, { status: 502 });
  }
}

/* ── Proveedores LLM ──────────────────────────────────────────────
   Devuelven el texto de respuesta, o null si el proveedor falla. */

async function callGroq(
  apiKey: string,
  persona: PersonaId,
  empresa: string | undefined,
  rol: string | undefined,
  messages: ChatMessage[],
): Promise<string | null> {
  // Groq expone un endpoint compatible con OpenAI.
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      max_tokens: 700,
      temperature: 0.4,
      messages: [{ role: "system", content: buildSystemPrompt(persona, empresa, rol) }, ...messages],
    }),
  });
  if (!res.ok) {
    console.error("Groq API error:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(
  apiKey: string,
  persona: PersonaId,
  empresa: string | undefined,
  rol: string | undefined,
  messages: ChatMessage[],
): Promise<string | null> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5",
      max_tokens: 700,
      system: buildSystemPrompt(persona, empresa, rol),
      messages,
    }),
  });
  if (!res.ok) {
    console.error("Anthropic API error:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  return (data.content ?? [])
    .map((block) => (block.type === "text" ? (block.text ?? "") : ""))
    .filter(Boolean)
    .join("\n");
}

/* ── Notificación a Telegram ──────────────────────────────────────
   No-op si no está configurada. Nunca bloquea ni rompe la respuesta
   del chat: los errores se registran y se ignoran. Se dispara solo
   cuando hay señal de interés (oferta pegada, mención de empresa o
   candidatura con origen), para no convertirse en ruido. */

interface OriginContext {
  ref?: string;
  utm_source?: string;
  utm_campaign?: string;
  candidatura?: string;
}

function sanitizeContext(raw: unknown): OriginContext {
  if (typeof raw !== "object" || raw === null) return {};
  const r = raw as Record<string, unknown>;
  const pick = (v: unknown) => (typeof v === "string" ? v.slice(0, 120) : undefined);
  return {
    ref: pick(r.ref),
    utm_source: pick(r.utm_source),
    utm_campaign: pick(r.utm_campaign),
    candidatura: pick(r.candidatura),
  };
}

async function notifyTelegram(payload: {
  persona: PersonaId;
  empresa?: string;
  rol?: string;
  context: OriginContext;
  userMsg: string;
  mode: "faq" | "llm";
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const looksLikeOffer = payload.userMsg.length > 600;
  const hasSignal = looksLikeOffer || payload.empresa || payload.context.candidatura || payload.context.utm_campaign;
  // Solo notifica cuando hay señal real de interés, para no llenar el chat de ruido.
  if (!hasSignal) return;

  const esc = (s: string) => s.replace(/[<&>]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string);
  const origen = [
    payload.context.candidatura && `candidatura: ${payload.context.candidatura}`,
    payload.context.utm_source && `fuente: ${payload.context.utm_source}`,
    payload.context.utm_campaign && `campaña: ${payload.context.utm_campaign}`,
    payload.context.ref && `ref: ${payload.context.ref}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const lines = [
    looksLikeOffer ? "📄 <b>Alguien pegó una oferta en tu portfolio</b>" : "💬 <b>Nueva conversación en tu portfolio</b>",
    `👤 Vista: <b>${payload.persona}</b>${payload.empresa ? ` · Empresa: <b>${esc(payload.empresa)}</b>` : ""}${payload.rol ? ` · Rol: ${esc(payload.rol)}` : ""}`,
    origen && `🔗 ${esc(origen)}`,
    `⚙️ modo: ${payload.mode}`,
    "",
    `📝 ${esc(payload.userMsg.slice(0, 500))}${payload.userMsg.length > 500 ? "…" : ""}`,
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch (error) {
    console.error("Telegram notify error:", error);
  }
}
