"use client";

import { useEffect, useRef, useState } from "react";
import { PERSONAS, type PersonaId } from "@/data/personas";
import { PROJECTS } from "@/data/projects";
import type { Candidatura } from "@/data/candidaturas";
import { track, readOrigin, type OriginContext } from "@/lib/track";
import ChatConcierge from "./ChatConcierge";
import {
  CtaSection,
  Footer,
  Gate,
  Hero,
  MethodSection,
  MorphOverlay,
  ProjectCard,
  SkillsSection,
  TopBar,
} from "./Sections";

type Theme = "light" | "dark";

/**
 * Orquestador del portfolio adaptativo.
 * - Sin candidatura: gate de selección de visitante → morph → contenido.
 * - Con candidatura (/p/<slug>): persona precargada + banner de bienvenida.
 * El tema claro/oscuro muta CTA, logo y tipografía de forma síncrona vía
 * tokens CSS (Manual §8).
 */
export default function Portfolio({
  initialPersona = null,
  candidatura,
}: {
  initialPersona?: PersonaId | null;
  candidatura?: Candidatura & { slug: string };
}) {
  const [persona, setPersona] = useState<PersonaId | null>(initialPersona);
  const [morphTarget, setMorphTarget] = useState<PersonaId | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [origin, setOrigin] = useState<OriginContext>({});
  const [returning, setReturning] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const current = document.documentElement.dataset.theme;
    if (current === "dark") setTheme("dark");

    // Origen del visitante (UTM + referrer), cacheado por sesión.
    setOrigin(readOrigin(candidatura?.slug));

    // Memoria de persona: si el visitante ya eligió una vista antes y no
    // llega por un enlace de candidatura (que manda), la precargamos.
    if (!initialPersona) {
      try {
        const saved = localStorage.getItem("dnr-persona");
        if (saved && saved in PERSONAS) {
          setPersona(saved as PersonaId);
          setReturning(true);
          track("visitor_returning", { persona: saved });
        }
      } catch {
        /* almacenamiento no disponible: gate normal */
      }
    }

    if (candidatura) track("candidatura_view", { slug: candidatura.slug, persona: candidatura.persona });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPersona = (id: PersonaId) => {
    if (id === persona) return;
    track(persona === null ? "persona_selected" : "persona_switched", {
      persona: id,
      ...(candidatura ? { candidatura: candidatura.slug } : {}),
    });
    try {
      localStorage.setItem("dnr-persona", id);
    } catch {
      /* la memoria de persona es best-effort */
    }
    if (reducedMotion.current) {
      setPersona(id);
      return;
    }
    setMorphTarget(id);
    setTimeout(() => {
      setPersona(id);
      setMorphTarget(null);
      window.scrollTo({ top: 0 });
    }, 850);
  };

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("dnr-theme", next);
    } catch {
      /* almacenamiento no disponible: el tema vive solo en la sesión */
    }
    track("theme_toggled", { theme: next });
  };

  if (morphTarget) return <MorphOverlay target={morphTarget} />;
  if (!persona) return <Gate onSelect={selectPersona} />;

  const p = PERSONAS[persona];

  return (
    <div key={persona} className="fadein">
      <TopBar persona={persona} theme={theme} onSelect={selectPersona} onToggleTheme={toggleTheme} />

      {returning && !candidatura && (
        <div className="cand-banner">
          <div className="wrap">
            <span className="mono">bienvenido de nuevo</span>
            Retomas la vista <b>{p.label}</b>.{" "}
            <button
              className="link-btn"
              onClick={() => {
                setReturning(false);
                setPersona(null);
                try {
                  localStorage.removeItem("dnr-persona");
                } catch {
                  /* best-effort */
                }
              }}
            >
              Cambiar de vista
            </button>
          </div>
        </div>
      )}

      {candidatura && (
        <div className="cand-banner">
          <div className="wrap">
            <span className="mono">candidatura</span>
            Hola, equipo de <b>{candidatura.empresa}</b>
            {candidatura.rol ? (
              <>
                {" "}
                — esta vista está preparada para vuestra oferta de <b>{candidatura.rol}</b>.
              </>
            ) : (
              "."
            )}
            {candidatura.nota ? <> {candidatura.nota}</> : null}
          </div>
        </div>
      )}

      <main>
        <Hero persona={p} />

        <section className="section">
          <div className="wrap">
            <div className="eyebrow">proyectos · ordenados para ti</div>
            <h2>Lo que he construido</h2>
            {p.projectOrder.map((pid) => {
              const project = PROJECTS[pid];
              return project ? <ProjectCard key={pid} project={project} persona={p} /> : null;
            })}
          </div>
        </section>

        {p.showMethod && <MethodSection />}
        {p.skillsMode !== "none" && <SkillsSection mode={p.skillsMode} />}

        <CtaSection persona={p} onCta={(kind) => track("cta_click", { kind, persona: p.id })} />
        <Footer />
      </main>

      {!chatOpen && (
        <button
          className="chat-fab"
          onClick={() => {
            setChatOpen(true);
            track("chat_opened", { persona: p.id });
          }}
        >
          <span className="dot">●</span> Pregúntame sobre David
        </button>
      )}
      {chatOpen && (
        <ChatConcierge
          persona={p}
          empresa={candidatura?.empresa}
          rol={candidatura?.rol}
          origin={origin}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
