"use client";

import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { useLang } from "@/components/v2/LangProvider";
import { useVista } from "@/components/v2/VistaProvider";
import { HOME_CARD_ORDER, orderBy } from "@/data/vistas";

export default function HomeView() {
  const { ui } = useLang();
  const { vista } = useVista();

  // Las tres tarjetas se muestran siempre; la vista solo decide cuál va primero.
  const cards = [
    { href: "/sobre-mi", title: ui.home.cardAbout, sub: ui.home.cardAboutSub },
    { href: "/proyectos", title: ui.home.cardProjects, sub: ui.home.cardProjectsSub },
    { href: "/curiosidades", title: ui.home.cardExtras, sub: ui.home.cardExtrasSub },
  ];
  const ordered = orderBy(cards, HOME_CARD_ORDER[vista], (c) => c.href);

  return (
    <div className="v2-root">
      <HeaderV2 />
      <main className="v2-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/avatar.png" alt="David Naranjo Ramírez" className="v2-avatar" />
        <h1 className="v2-name">David Naranjo Ramírez</h1>
        <p className="v2-role">{ui.home.role}</p>
        <p className="v2-lede">{ui.home.lede}</p>

        <p className="v2-ask">{ui.home.ask}</p>
        <div className="v2-cards">
          {ordered.map((c) => (
            <Link key={c.href} href={c.href} className="v2-card">
              <span className="v2-card-title">{c.title}</span>
              <span className="v2-card-sub">{c.sub}</span>
            </Link>
          ))}
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}
