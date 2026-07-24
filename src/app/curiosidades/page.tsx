import type { Metadata } from "next";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";

export const metadata: Metadata = { title: "Curiosidades — David Naranjo Ramírez" };

const CURIOSIDADES = [
  {
    titulo: "Cuatro idiomas, un traductor de formación",
    texto:
      "Antes de la tecnología estudié Traducción e Interpretación. Esa precisión con el lenguaje hoy la aplico a la documentación técnica — en español, inglés, francés y portugués.",
  },
  {
    titulo: "5 años viviendo en Sofía",
    texto:
      "Trabajé en Bulgaria en proyectos globales de software para ensayos clínicos, y antes pasé una etapa enseñando español en Francia. La experiencia internacional se me quedó puesta.",
  },
  {
    titulo: "Supervisé a ~100 personas en plena pandemia",
    texto:
      "Como Supervisor/SME en Pfizer, el equipo creció un 40% y mantuvimos los SLA por encima de lo exigido — atravesando la pandemia y el estallido de la guerra de Ucrania.",
  },
  {
    titulo: "Escribo sobre lo que construyo",
    texto:
      "Publico artículos técnicos en LinkedIn sobre mis proyectos: lo que aprendí de 10 años de datos de fuerza policial, o las decisiones que habrían falsificado mi informe de negocio.",
  },
  {
    titulo: "Marca propia",
    texto:
      "DNR tiene su propio manual de identidad — logos, paletas y tipografías — aplicado a este portfolio, a mi CV y a mis perfiles profesionales.",
  },
  {
    titulo: "Formación musical",
    texto:
      "Estudié música en el conservatorio. La disciplina de práctica diaria se parece más a programar de lo que parece.",
  },
] as const;

export default function CuriosidadesPage() {
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-main">
        <h1 className="v2-h1">Curiosidades</h1>
        <div className="v2-curio-grid">
          {CURIOSIDADES.map((c, i) => (
            <div key={i} className="v2-curio">
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
            </div>
          ))}
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}