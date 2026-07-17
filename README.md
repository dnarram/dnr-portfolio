# Portfolio adaptativo — David Naranjo Ramírez

Un portfolio que **se recompila según quién lo visita**. El visitante indica qué le trae (HR, tech recruiter, developer o curioso) y el contenido, el orden de los proyectos, el nivel de detalle y las llamadas a la acción se adaptan a lo que esa persona necesita evaluar — con una transición visible tipo terminal que convierte la adaptación en la firma del producto.

Este repositorio es, en sí mismo, una pieza del portfolio: demuestra contenido-como-datos, un endpoint de IA con guardarraíles y control de coste, analítica de eventos sin cookies y un sistema de diseño derivado de un manual de identidad real (marca DNR, v2).

## Cómo funciona

```
Visitante ──> Gate (¿qué te trae por aquí?) ──> morph "recompilando" ──> vista adaptada
                     │                                                      │
   /p/<slug> ────────┘ (candidaturas: persona precargada + saludo)          │
                                                                            ▼
                                                            Chat concierge ──> /api/chat
                                                                                │
                                                        modo FAQ (0 €, por defecto)
                                                        modo IA (Anthropic, opcional)
```

- **4 vistas por persona** definidas en `src/data/personas.ts`: taglines, orden de proyectos, densidad técnica (stack/métricas/war stories) y CTA distintos.
- **Enlaces por candidatura** (`/p/<slug>`): al enviar una candidatura se añade una entrada en `src/data/candidaturas.ts`; la URL precarga la persona y saluda mencionando a la empresa. No se indexan (robots + noindex).
- **Concierge con dos modos**: FAQ determinista local (coste 0 €) por defecto; modo IA opcional vía Anthropic con la key solo en servidor, rate limit por IP y tope diario de presupuesto con degradación automática a FAQ.
- **Analítica de eventos sin cookies** (GoatCounter o Umami): `persona_selected`, `persona_switched`, `cta_click`, `chat_message`… El feedback loop de Data Science: saber qué proyecto interesa a qué perfil y optimizar el contenido. Sin banner de consentimiento porque no hay cookies ni datos personales.
- **Marca DNR v2**: todos los colores y tipografías salen de los tokens de `src/app/globals.css`, derivados del Manual de Identidad (WCAG AA verificado, CTA con texto `#0F141C` sobre ámbar en modo oscuro, sin degradados ni glow, nunca negro puro).

## Coste: 0 €

| Pieza | Servicio | Plan |
|---|---|---|
| Hosting + serverless | Vercel | Hobby (uso personal no comercial) |
| Dominio | `<proyecto>.vercel.app` | Gratis (dominio propio: ~10 €/año, opcional) |
| Fuentes | Inter + JetBrains Mono autoalojadas (Fontsource) | Gratis y sin llamadas a terceros (RGPD) |
| Chat modo FAQ | Matcher local | 0 € |
| Chat modo IA | Groq (Llama 3.3 70B) | **Gratis** — free tier EU-friendly, sin tarjeta (~1000 msg/día). Alternativa: Anthropic (pago por uso) |
| Notificaciones | Telegram Bot API | Gratis |
| Analítica | GoatCounter o Umami Cloud | Gratis |
| Desarrollo | Claude Code | Suscripción ya pagada — ver `CLAUDE.md` |

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # opcional: solo para IA/analítica
npm run dev                  # http://localhost:3000
```

Antes de publicar, busca `TODO(David)` en el código:

1. `src/data/site.ts` → email y LinkedIn reales.
2. `public/brand/` → copiar `SimpleClaro.png` y `SimpleOscuro.png` y poner `brandAssetsReady: true` en `site.ts`.
3. `src/app/icon.svg` → sustituir el placeholder por el favicon oficial (N en círculo blanco, Manual §8/§10).
4. `src/data/projects.ts` → añadir los repos de EDAFatalForce y RondaGuide cuando estén públicos.

## Despliegue en Vercel (gratis)

1. Sube el repo a GitHub (`git init && git add -A && git commit -m "feat: portfolio adaptativo v1"` y push).
2. En [vercel.com](https://vercel.com) → *Add New Project* → importa el repo. Framework detectado: Next.js. Deploy.
3. Variables de entorno (Settings → Environment Variables), todas opcionales:
   - `NEXT_PUBLIC_SITE_URL` → la URL final (para SEO/sitemap).
   - Analítica: `NEXT_PUBLIC_GOATCOUNTER` **o** `NEXT_PUBLIC_UMAMI_ID` (+ `NEXT_PUBLIC_UMAMI_SRC`).
   - Modo IA: `CHAT_MODE=llm`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `CHAT_DAILY_LIMIT`.
4. Cada `git push` redespliega automáticamente — incluidas las nuevas candidaturas en `candidaturas.ts`.

## Activar el chat con IA (Groq, gratis)

1. Entra en [console.groq.com](https://console.groq.com) → *API Keys* → crea una key (sin tarjeta).
2. En Vercel → Settings → Environment Variables:

| Key | Value |
|---|---|
| `CHAT_MODE` | `llm` |
| `AI_PROVIDER` | `groq` |
| `GROQ_API_KEY` | `gsk_...` |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `CHAT_DAILY_LIMIT` | `200` |

3. Redeploy. Si se agota el tope diario, el chat degrada a modo FAQ solo — nunca se rompe.

## Notificaciones a Telegram (opcional)

Recibe un aviso en el móvil cuando alguien pega una oferta o llega por una candidatura/campaña:

1. En Telegram, habla con **@BotFather** → `/newbot` → copia el **token**.
2. Escribe cualquier cosa a tu bot nuevo, luego abre en el navegador
   `https://api.telegram.org/bot<token>/getUpdates` y copia el `chat.id`.
3. En Vercel añade `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`. Redeploy.

La notificación solo se dispara cuando hay señal de interés (oferta pegada, empresa o campaña), nunca en cada mensaje, para no generar ruido. Funciona en modo FAQ y en modo IA.

## Origen del visitante (UTM + referrer)

Comparte enlaces con parámetros para saber de dónde llega la gente sin tocar la IP (RGPD-friendly):

- LinkedIn: `.../p/acme?utm_source=linkedin&utm_campaign=acme-data`
- El referrer se captura como fuente aproximada cuando no hay UTM.
- El origen viaja en las notificaciones de Telegram y en los eventos de analítica.

## Flujo de candidaturas

```ts
// src/data/candidaturas.ts
"acme-2026": { empresa: "ACME", persona: "tech", rol: "Data Engineer" }
```

Commit + push → comparte `https://tu-dominio/p/acme-2026` en el CV o el email de candidatura. El equipo de ACME aterriza en una vista técnica que les saluda por su nombre.

## OG image (previsualización al compartir)

Cuando compartes el enlace en LinkedIn, WhatsApp, Telegram, Slack o X, esas plataformas muestran `public/og-image.png` (1200×630, marca DNR). Ya está conectada en `src/app/layout.tsx` (`openGraph` + `twitter`).

- `public/og-image.png` — modo claro (la que se sirve por defecto).
- `public/og-image-dark.png` — variante oscura, por si prefieres servirla.
- Los `.svg` del mismo nombre son las fuentes editables.

Si cambias el nombre, el rol o el claim, edita el `.svg` y regenera el PNG:

```bash
python3 -c "import cairosvg; cairosvg.svg2png(url='public/og-image.svg', write_to='public/og-image.png', output_width=1200, output_height=630)"
```

Tras desplegar, valida la tarjeta en [opengraph.xyz](https://www.opengraph.xyz) o en el [Post Inspector de LinkedIn](https://www.linkedin.com/post-inspector/) (este último además fuerza a LinkedIn a refrescar la caché de la imagen).

## Privacidad (RGPD)

Sin cookies, sin fingerprinting, sin datos personales en la analítica. El chat avisa del modo activo y de que no se deben introducir datos personales; en modo IA los mensajes se procesan con un proveedor externo (Anthropic) solo para generar la respuesta.

## Roadmap

- v1.1 — OG image de marca (composición según Manual §8) y CV descargable por persona.
- v1.2 — Versión en inglés (i18n; el contenido ya vive en `src/data/`, listo para duplicar por idioma).
- v2 — Inferencia suave de persona por comportamiento (scroll/clicks) con sugerencia explícita, nunca silenciosa; dashboard propio de analítica.
- SaaS — Multi-tenant: "portfolio adaptativo as a service" para otros candidatos.

---

Hecho en Ronda · Marca DNR v2 · © David Naranjo Ramírez
