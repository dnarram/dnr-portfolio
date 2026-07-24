"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/proyectos", label: "Mis Proyectos" },
  { href: "/curiosidades", label: "Curiosidades" },
] as const;

export default function HeaderV2() {
  const pathname = usePathname();
  return (
    <header className="v2-header">
      <Link href="/" className="v2-logo" aria-label="Inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/DNR_Hashnode_Claro_1000x250.png" alt="DNR — David Naranjo Ramírez" className="v2-logo-img light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/DNR_Hashnode_Oscuro_1000x250.png" alt="DNR — David Naranjo Ramírez" className="v2-logo-img dark" />
      </Link>
      <nav className="v2-tabs" aria-label="Secciones">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={"v2-tab" + (pathname.startsWith(t.href) ? " active" : "")}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}