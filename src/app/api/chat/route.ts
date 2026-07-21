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

/**
 * ¿El texto pide EXPLÍCITAMENTE el CV? Puerta única para generar el
 * botón de descarga: solo cuando el visitante lo pide en su mensaje.
 * "resume/resumir" NO cuenta (en español es "resumir", no currículo).
 */
function isCvRequest(text: string): boolean {
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /\bcv\b|curricul|curriculum vitae|hoja de vida/.test(t);
}

/**
 * Detecta si el visitante ancla la posición en la Comunidad de Madrid
 * (por el texto del chat o una oferta pegada). Si es así, el CV muestra
 * "Madrid, España"; si no, la de por defecto.
 */
const MADRID_RE = new RegExp(
  "\\b(madrid|alcala de henares|alcorcon|leganes|getafe|mostoles|fuenlabrada|" +
    "torrejon|parla|alcobendas|las rozas|pozuelo|san sebastian de los reyes|" +
    "rivas|majadahonda|collado villalba|aranjuez|coslada|valdemoro|tres cantos)\\b",
  "i",
);
function mentionsMadrid(text: string): boolean {
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return MADRID_RE.test(t);
}

/** Poblaciones de la provincia de Málaga (incluye Ronda, donde vive David). */
const MALAGA_RE = new RegExp(
  "\\b(malaga|marbella|ronda|velez malaga|fuengirola|torremolinos|benalmadena|" +
    "estepona|antequera|mijas|rincon de la victoria|nerja|alhaurin|coin|" +
    "cartama|torre del mar|manilva|casares|axarquia|costa del sol)\\b",
  "i",
);
function mentionsMalaga(text: string): boolean {
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return MALAGA_RE.test(t);
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
- SOLO si el visitante pide EXPLÍCITAMENTE el CV, currículo o curriculum de David en su mensaje, responde brevemente y añade al FINAL de tu respuesta UNA última línea con este formato exacto: CV_BLOCKS: id1,id2,id3 — entre 8 y 14 ids, elegidos y ORDENADOS por relevancia para ESTE visitante según toda la conversación (su vista, la oferta o rol que haya mencionado, sus preguntas). Empieza siempre por el bloque de resumen más adecuado (resumen_tech, resumen_hr o resumen_fan). Ids disponibles: ${allCvIds().filter((i) => i !== "meta_identidad").join(", ")}. No menciones los ids en el texto visible. NUNCA ofrezcas ni añadas el CV por iniciativa propia: si no te lo piden explícitamente, no incluyas la línea CV_BLOCKS aunque analices una oferta o hables de su experiencia.
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

  // Cadena de proveedores de IA con fallback (orden: Groq → OpenRouter →
  // Anthropic). Un proveedor entra en la cadena solo si su key está
  // configurada. Si toda la cadena falla, el chat degrada a modo FAQ.
  const llmEnabled =
    process.env.CHAT_MODE === "llm" &&
    !overDailyBudget() &&
    Boolean(process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY);

  const lastUserMsg = messages[messages.length - 1].content;

  // Ubicación dinámica (#1, #3): si la conversación (mensajes del visitante,
  // oferta pegada, rol o empresa) ancla la posición en Madrid, el CV muestra
  // "Madrid, España"; en cualquier otro caso —incluida mención explícita de
  // Málaga o ausencia de ubicación— muestra "Málaga, España" (por defecto).
  const convText =
    messages.filter((m) => m.role === "user").map((m) => m.content).join(" ") +
    " " + (empresaStr ?? "") + " " + (rolStr ?? "");
  const locQS =
    mentionsMadrid(convText) && !mentionsMalaga(convText) ? "&loc=madrid" : "&loc=malaga";

  // Respuesta FAQ (0 €): respaldo cuando no hay IA configurada, se agotó el
  // presupuesto, o TODA la cadena de proveedores falló. Nunca deja al
  // visitante sin respuesta; si pide el CV, se lo entrega igualmente.
  const faqResponse = async () => {
    const reply = matchFaq(lastUserMsg);
    const cvUrl = isCvRequest(lastUserMsg) ? `/api/cv-pdf?vista=${persona}${locQS}` : undefined;
    await notifyTelegram({ persona, empresa: empresaStr, rol: rolStr, context, userMsg: lastUserMsg, mode: "faq" });
    return NextResponse.json({ reply, mode: "faq", ...(cvUrl ? { cvUrl } : {}) });
  };

  // ── Modo IA con cadena de fallback ──────────────────────────────
  if (llmEnabled) {
    try {
      const llm = await callLlmChain(persona, empresaStr, rolStr, messages);
      if (llm) {
        await notifyTelegram({ persona, empresa: empresaStr, rol: rolStr, context, userMsg: lastUserMsg, mode: "llm" });

        // ── Marcador CV_BLOCKS → botón de descarga ──────────────
        // La IA solo ELIGE ids de bloques; aquí se validan contra la lista
        // real y se convierten en la URL del PDF. El marcador se elimina del
        // texto visible; el botón solo se genera si el visitante pidió el CV.
        let visible = llm.reply;
        let cvUrl: string | undefined;
        const marker = llm.reply.match(/CV_BLOCKS:\s*([a-z0-9_,\s]+)/i);
        if (marker) visible = llm.reply.replace(/CV_BLOCKS:\s*[a-z0-9_,\s]+/gi, "").trim();
        if (marker && isCvRequest(lastUserMsg)) {
          const valid = new Set(allCvIds());
          const ids = marker[1]
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter((id) => valid.has(id) && id !== "meta_identidad")
            .slice(0, 14);
          cvUrl = ids.length > 0 ? `/api/cv-pdf?blocks=${ids.join(",")}&p=${persona}${locQS}` : `/api/cv-pdf?vista=${persona}${locQS}`;
        }

        return NextResponse.json({
          reply:
            visible.trim() ||
            (cvUrl
              ? "Aquí tienes el CV de David adaptado a tu perfil — puedes descargarlo con el botón de abajo."
              : "No he podido generar una respuesta. Reformula la pregunta o escribe a David directamente."),
          mode: "llm",
          ...(cvUrl ? { cvUrl } : {}),
        });
      }
      // Toda la cadena falló → degradamos a FAQ (no devolvemos un error muerto).
      console.warn("Chat: toda la cadena de IA falló; degradando a FAQ");
    } catch (error) {
      console.error("Chat route error:", error);
      // Cualquier excepción inesperada → también degradamos a FAQ.
    }
  }

  return faqResponse();
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

/**
 * OpenRouter — un endpoint OpenAI-compatible que da acceso a modelos
 * gratuitos. Enviamos una LISTA de modelos: OpenRouter prueba el siguiente
 * si el primero está saturado o caído (fallback entre modelos gratis, en
 * una sola petición). La lista rota con el tiempo; se configura por env.
 */
async function callOpenRouter(
  persona: PersonaId,
  empresa: string | undefined,
  rol: string | undefined,
  messages: ChatMessage[],
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  const models = (
    process.env.OPENROUTER_MODELS ??
    "meta-llama/llama-3.3-70b-instruct:free,openai/gpt-oss-120b:free"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (models.length === 0) return null;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://dnr-portfolio-omega.vercel.app",
      "X-Title": "Portfolio DNR",
    },
    body: JSON.stringify({
      model: models[0],
      models, // OpenRouter prueba estos en orden si el primero falla
      max_tokens: 700,
      temperature: 0.4,
      messages: [{ role: "system", content: buildSystemPrompt(persona, empresa, rol) }, ...messages],
    }),
  });
  if (!res.ok) {
    console.error("OpenRouter API error:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Orquestador de la cadena de IA. Prueba los proveedores en orden y
 * devuelve la primera respuesta no vacía, o null si todos fallan (lo que
 * hace que el handler degrade a FAQ). Un proveedor solo entra si su key
 * está configurada.
 */
async function callLlmChain(
  persona: PersonaId,
  empresa: string | undefined,
  rol: string | undefined,
  messages: ChatMessage[],
): Promise<{ reply: string; provider: string } | null> {
  const chain: Array<{ name: string; run: () => Promise<string | null> }> = [];
  if (process.env.GROQ_API_KEY)
    chain.push({ name: "groq", run: () => callGroq(process.env.GROQ_API_KEY as string, persona, empresa, rol, messages) });
  if (process.env.OPENROUTER_API_KEY)
    chain.push({ name: "openrouter", run: () => callOpenRouter(persona, empresa, rol, messages) });
  if (process.env.ANTHROPIC_API_KEY)
    chain.push({ name: "anthropic", run: () => callAnthropic(process.env.ANTHROPIC_API_KEY as string, persona, empresa, rol, messages) });

  for (const p of chain) {
    try {
      const r = await p.run();
      if (r && r.trim()) {
        if (p.name !== chain[0].name) console.warn(`Chat: respondió el fallback "${p.name}"`);
        return { reply: r, provider: p.name };
      }
    } catch (e) {
      console.error(`Chat: el proveedor "${p.name}" lanzó una excepción`, e);
    }
  }
  return null;
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
