import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";

export default function HomePage() {
  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/avatar.png" alt="David Naranjo Ramírez" className="v2-avatar" />
        <h1 className="v2-name">David Naranjo Ramírez</h1>
        <p className="v2-role">Data Scientist · Desarrollador Web Full-Stack</p>
        <p className="v2-lede">
          5 años en proyectos IT internacionales de ensayos clínicos, hoy construyendo
          con datos y con código. Málaga / Madrid · remoto.
        </p>

        <p className="v2-ask">¿Qué te gustaría saber?</p>
        <div className="v2-cards">
          <Link href="/sobre-mi" className="v2-card">
            <span className="v2-card-title">Sobre mí</span>
            <span className="v2-card-sub">Trayectoria, formación e idiomas</span>
          </Link>
          <Link href="/proyectos" className="v2-card">
            <span className="v2-card-title">Mis Proyectos</span>
            <span className="v2-card-sub">Datos, web e IA — con código y retos reales</span>
          </Link>
          <Link href="/curiosidades" className="v2-card">
            <span className="v2-card-title">Curiosidades</span>
            <span className="v2-card-sub">Lo que no cabe en un CV</span>
          </Link>
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}