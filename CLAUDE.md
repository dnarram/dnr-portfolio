# CLAUDE.md — Guía para trabajar en este repo

Portfolio adaptativo de David Naranjo Ramírez (Next.js 15 App Router + TypeScript, sin librerías de UI). El contenido se recompila según el visitante (hr / tech / dev / fan). Despliegue en Vercel Hobby, coste 0 €.

## Comandos

- `npm run dev` — desarrollo en http://localhost:3000
- `npm run build` — build de producción. **Debe pasar antes de cualquier commit.**

## Mapa del proyecto

- `src/data/` — TODO el contenido vive aquí (contenido-como-datos). Textos, personas, proyectos, FAQ, candidaturas, perfil para la IA. Para cambiar copy, no toques componentes.
- `src/components/` — `Portfolio.tsx` (orquestador cliente), `Sections.tsx` (presentacional), `ChatConcierge.tsx` (chat).
- `src/app/globals.css` — tokens de marca. **Única fuente de colores y fuentes.**
- `src/app/api/chat/route.ts` — concierge: modo FAQ (por defecto, 0 €) y modo IA (`CHAT_MODE=llm` + `ANTHROPIC_API_KEY`, key solo en servidor).
- `src/lib/track.ts` — eventos de analítica sin cookies (no-op si no hay proveedor).
- `src/data/candidaturas.ts` — enlaces `/p/<slug>` por candidatura (no indexados).

## Reglas de marca (Manual de Identidad DNR v2 — innegociables)

1. **Nunca HEX en componentes**: usa las variables de `globals.css` (`--accent`, `--heading`, `--text`, `--card`, `--border`, `--code-bg`…).
2. Paleta claro: fondo `#FAFAFA`, titulares `#162B43`, texto `#2C3E50`, acento `#B95319`. Oscuro: fondo `#0F141C` (nunca `#000000`), titulares `#E2E8F0`, texto `#CBD5E1`, acento `#E65F19`.
3. **CTA**: en claro, fondo `#B95319` + texto blanco; en oscuro, fondo `#E65F19` + texto `#0F141C` (el blanco NO cumple AA sobre ámbar). Hover: se oscurece sutilmente, nunca vira a neón.
4. **Prohibido**: degradados, glow, halos, sombras difusas y luces de neón en la UI (los degradados solo existen en los logos de acabado "Medio", que son PNG externos).
5. Tipografía: Inter (UI/lectura) y JetBrains Mono (código, etiquetas técnicas, terminal). Ambas autoalojadas vía Fontsource — no añadir Google Fonts por CDN (RGPD).
6. Bloques tipo código/terminal siempre sobre `--code-bg` (`#0A0E14`) con acentos en el naranja del modo activo.
7. Cualquier combinación de color nueva debe cumplir WCAG 2.1 AA (§9 del manual).
8. Logos: `SimpleClaro.png` solo sobre fondos claros; `SimpleOscuro.png` solo sobre oscuros. Jamás cruzarlos.

## Reglas de contenido

- **Solo hechos verificables.** El perfil de la IA (`site.ts` → `AI_PROFILE`) y la FAQ no admiten afirmaciones que David no pueda defender en entrevista. Ante la duda, preguntar a David.
- El asistente tiene prohibido inventar: mantener esa instrucción en el system prompt.
- Los `TODO(David)` marcan datos personales pendientes (email, LinkedIn, repos). No inventarlos jamás.
- Textos en español; tono técnico y directo, sin humo.

## Reglas técnicas

- La `ANTHROPIC_API_KEY` no debe aparecer nunca en código cliente ni en `NEXT_PUBLIC_*`.
- El rate limit y el tope diario del chat son en memoria: válido para Vercel Hobby; si el tráfico crece, migrar a Upstash/KV (documentarlo aquí si se hace).
- `/p/<slug>` debe seguir sin indexarse (robots + `dynamicParams = false`).
- Accesibilidad: mantener `:focus-visible`, `prefers-reduced-motion`, `aria-*` existentes.
- Definition of done: `npm run build` pasa, sin HEX nuevos en componentes, contraste AA verificado, y David puede explicar el cambio en una entrevista.
