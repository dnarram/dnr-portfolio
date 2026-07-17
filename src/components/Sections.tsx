"use client";

import { useEffect, useState } from "react";
import { PERSONAS, PERSONA_LIST, type Persona, type PersonaId } from "@/data/personas";
import { METHOD_STEPS, SKILL_GROUPS, SKILLS_HUMAN, type Project } from "@/data/projects";
import { SITE } from "@/data/site";

/* ============================================================
   Piezas presentacionales del portfolio adaptativo DNR.
   Toda decisión de color/tipografía viene de los tokens de
   globals.css (Manual de Identidad v2). Aquí no hay HEX.
   ============================================================ */

/* ---- Logo del header ----
   Banner Hashnode oficial (logo DNR + nombre + rol) en una pieza
   horizontal 4:1. Claro sobre fondo claro, Oscuro sobre fondo oscuro
   (Manual §8: nunca cruzar acabado y fondo). */
export function LogoMark({ theme }: { theme: "light" | "dark" }) {
  const src = theme === "dark" ? "/brand/DNR_Hashnode_Oscuro_1000x250.png" : "/brand/DNR_Hashnode_Claro_1000x250.png";
  return (
    <img
      className="logo-banner"
      src={src}
      width={1000}
      height={250}
      alt={`${SITE.name} — ${SITE.role}`}
    />
  );
}

/* ---- Motivo de marca: línea de tendencia con nodos ---- */
export function TrendLine() {
  return (
    <svg className="trendline" viewBox="0 0 720 56" aria-hidden="true" preserveAspectRatio="none">
      <polyline
        points="4,46 120,38 230,42 340,22 460,28 580,12 716,18"
        fill="none"
        stroke="var(--border)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [120, 38],
        [340, 22],
        [580, 12],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.5" fill="var(--accent)" />
      ))}
      {[
        [4, 46],
        [230, 42],
        [460, 28],
        [716, 18],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill="var(--titanio)" />
      ))}
    </svg>
  );
}

/* ---- Gate: selector inicial de visitante ---- */
export function Gate({ onSelect }: { onSelect: (id: PersonaId) => void }) {
  return (
    <div className="gate wrap fadein">
      <div className="eyebrow">portfolio adaptativo · v1.0</div>
      <h1>{"David Naranjo\nRamírez"}</h1>
      <p className="sub">
        Este portfolio no es estático: se recompila según quién lo visita. Dime qué te trae por aquí y te
        enseño exactamente lo que necesitas evaluar.
      </p>
      <div className="gate-grid">
        {PERSONA_LIST.map((id) => {
          const p = PERSONAS[id];
          return (
            <button key={id} className="gate-card" onClick={() => onSelect(id)}>
              <span className="gc-title">{p.gateTitle}</span>
              <br />
              <span className="gc-desc">{p.gateDesc}</span>
              <br />
              <span className="gc-tag">→ compilar vista</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Overlay de recompilación (firma del producto) ---- */
export function MorphOverlay({ target }: { target: PersonaId }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 350);
    const t2 = setTimeout(() => setStep(2), 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return (
    <div className="morph" role="status" aria-live="polite">
      <div className="term">
        <div>$ portfolio adapt --visitante={target}</div>
        {step >= 1 && <div>&nbsp;&nbsp;reordenando proyectos · ajustando registro…</div>}
        {step >= 2 ? (
          <div className="ok">✓ contenido recompilado</div>
        ) : (
          <div>
            <span className="caret" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Barra superior ---- */
export function TopBar({
  persona,
  theme,
  onSelect,
  onToggleTheme,
}: {
  persona: PersonaId;
  theme: "light" | "dark";
  onSelect: (id: PersonaId) => void;
  onToggleTheme: () => void;
}) {
  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <LogoMark theme={theme} />
        <div className="topbar-right">
          <nav className="switcher" aria-label="Cambiar tipo de visitante">
            {PERSONA_LIST.map((id) => (
              <button
                key={id}
                className={"switch-btn" + (id === persona ? " on" : "")}
                aria-pressed={id === persona}
                onClick={() => onSelect(id)}
              >
                {PERSONAS[id].label}
              </button>
            ))}
          </nav>
          <button
            className="theme-btn"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---- Hero adaptativo ---- */
export function Hero({ persona }: { persona: Persona }) {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="eyebrow">portfolio adaptativo · {persona.chip}</div>
        <h1>{persona.tagline}</h1>
        <p className="lede">{persona.lede}</p>
        <div className="meta-row">
          <span>
            <b>{SITE.location}</b>
          </span>
          <span>
            <b>Máster Data Science</b> (Evolve) + <b>DAW</b> (Ilerna)
          </span>
          <span>
            <b>{SITE.availability}</b>
          </span>
        </div>
        <TrendLine />
      </div>
    </section>
  );
}

/* ---- Tarjeta de proyecto adaptativa ---- */
export function ProjectCard({ project, persona }: { project: Project; persona: Persona }) {
  return (
    <article className="proj">
      <div className="proj-head">
        <h3>{project.name}</h3>
        <span className="proj-kind">{project.kind}</span>
      </div>
      <p>{project.desc[persona.id]}</p>
      {persona.showStack && (
        <>
          <div className="metrics">
            {project.metrics.map((m) => (
              <span key={m}>▸ {m}</span>
            ))}
          </div>
          <div className="stack-row">
            {project.stack.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
        </>
      )}
      {persona.showWarStory && (
        <div className="war">
          <span className="war-label">war story</span>
          {project.warStory}
        </div>
      )}
      {persona.showStack && project.repo && (
        <a className="proj-repo" href={project.repo} target="_blank" rel="noreferrer">
          Ver repositorio →
        </a>
      )}
    </article>
  );
}

/* ---- Método de trabajo (secuencia real: por eso va numerada) ---- */
export function MethodSection() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="eyebrow">método</div>
        <h2>Cómo verifico lo que publico</h2>
        <div className="method-grid">
          {METHOD_STEPS.map((s) => (
            <div key={s.n} className="method-step">
              <span className="n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Skills ---- */
export function SkillsSection({ mode }: { mode: "grid" | "human" }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="eyebrow">stack</div>
        <h2>{mode === "grid" ? "Herramientas de trabajo" : "Lo que aporto"}</h2>
        {mode === "grid" ? (
          <div className="skills-grid">
            {SKILL_GROUPS.map((g) => (
              <div key={g.name} className="skill-col">
                <h4>{g.name}</h4>
                <ul>
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="skills-human">
            {SKILLS_HUMAN.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---- CTA final adaptativo ---- */
export function CtaSection({ persona, onCta }: { persona: Persona; onCta: (kind: string) => void }) {
  const href = persona.ctaKind === "github" ? SITE.github : `mailto:${SITE.email}`;
  const external = persona.ctaKind === "github";
  return (
    <section className="cta">
      <div className="wrap">
        <div className="eyebrow">siguiente paso</div>
        <h2>{persona.ctaTitle}</h2>
        <p>{persona.ctaBody}</p>
        <a
          className="btn"
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          onClick={() => onCta(persona.ctaKind)}
        >
          {persona.ctaLabel}
        </a>
        <a className="btn-ghost" href={SITE.linkedin} target="_blank" rel="noreferrer" onClick={() => onCta("linkedin")}>
          LinkedIn
        </a>
      </div>
    </section>
  );
}

/* ---- Footer ---- */
export function Footer() {
  return (
    <div className="footer wrap">
      <span>© {new Date().getFullYear()} {SITE.name}</span>
      <span>build: adaptativo-v1.0</span>
      <span>analítica sin cookies · sin datos personales</span>
      <span>hecho en Ronda</span>
    </div>
  );
}
