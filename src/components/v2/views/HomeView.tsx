"use client";

import Link from "next/link";
import HeaderV2 from "@/components/v2/HeaderV2";
import FloatingConcierge from "@/components/v2/FloatingConcierge";
import { useLang } from "@/components/v2/LangProvider";

export default function HomeView() {
  const { ui } = useLang();
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
          <Link href="/sobre-mi" className="v2-card">
            <span className="v2-card-title">{ui.home.cardAbout}</span>
            <span className="v2-card-sub">{ui.home.cardAboutSub}</span>
          </Link>
          <Link href="/proyectos" className="v2-card">
            <span className="v2-card-title">{ui.home.cardProjects}</span>
            <span className="v2-card-sub">{ui.home.cardProjectsSub}</span>
          </Link>
          <Link href="/curiosidades" className="v2-card">
            <span className="v2-card-title">{ui.home.cardExtras}</span>
            <span className="v2-card-sub">{ui.home.cardExtrasSub}</span>
          </Link>
        </div>
      </main>
      <FloatingConcierge />
    </div>
  );
}
