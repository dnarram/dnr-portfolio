import type { Metadata } from "next";
import CuriosidadesView from "@/components/v2/views/CuriosidadesView";

export const metadata: Metadata = { title: "Curiosidades — David Naranjo Ramírez" };

export default function CuriosidadesPage() {
  return <CuriosidadesView />;
}
