import type { Metadata } from "next";
import SobreMiView from "@/components/v2/views/SobreMiView";

export const metadata: Metadata = { title: "Sobre mí — David Naranjo Ramírez" };

export default function SobreMiPage() {
  return <SobreMiView />;
}
