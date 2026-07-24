import type { Metadata } from "next";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";

export const metadata: Metadata = { title: "Sobre mí — David Naranjo Ramírez" };

const ETAPAS = [
  { fecha: "2026 – hoy", titulo: "Máster en Data Science e IA", donde: "Evolve Academy" },
  { fecha: "finalizando", titulo: "CFGS Desarrollo de Aplicaciones Web (DAW)", donde: "ILERNA" },
  { fecha: "2023", titulo: "Project Manager – Tier 2 Support (Novo Nordisk)", donde: "C3i Solutions / HCLTech · Sofía" },
  { fecha: "2021 – 2023", titulo: "Supervisor – SME (Pfizer) · equipo de ~100 agentes", donde: "C3i Solutions / HCLTech · Sofía" },
  { fecha: "2021", titulo: "Team Lead – Specialist", donde: "C3i Solutions / HCLTech · Sofía" },
  { fecha: "2018 – 2021", titulo: "Asistencia técnica (Medidata, Pfizer)", donde: "C3i Solutions / HCLTech · Sofía" },
  { fecha: "2016 – 2017", titulo: "Docencia de español y traducción", donde: "Francia · Instituto Cervantes (París)" },
] as const;

export default function SobreMiPage() {
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">Sobre mí</h1>
        <div className="v2-about">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/avatar.png" alt="David Naranjo Ramírez" className="v2-avatar sm" />
          <div>
            <p>
              Tiendo puentes entre el desarrollo web full-stack y la ciencia de datos.
              Pasé 5 años en proyectos IT internacionales de ensayos clínicos (Medidata,
              Pfizer, Novo Nordisk) creciendo de agente de soporte técnico a supervisor de
              un equipo de ~100 personas y project manager. Hoy aplico esa madurez a
              construir con datos y con código, de principio a fin.
            </p>
            <p>
              Mi sello: rigor verificable. Audito mis datos contra las fuentes crudas y
              resuelvo los problemas de raíz.
            </p>
          </div>
        </div>

        <section className="v2-sec">
          <h2>Trayectoria</h2>
          <ul className="v2-timeline">
            {ETAPAS.map((e, i) => (
              <li key={i}>
                <span className="v2-tl-fecha">{e.fecha}</span>
                <span className="v2-tl-titulo">{e.titulo}</span>
                <span className="v2-tl-donde">{e.donde}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="v2-sec">
          <h2>Idiomas</h2>
          <p>Español nativo · Inglés C1 · Francés C1 · Portugués B2</p>
        </section>
      </main>
      <FloatingConcierge />
    </div>
  );
}