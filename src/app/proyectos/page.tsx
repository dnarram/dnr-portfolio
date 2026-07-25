import type { Metadata } from "next";
import ProyectosView from "@/components/v2/views/ProyectosView";

export const metadata: Metadata = { title: "Proyectos — David Naranjo Ramírez" };

export default function ProyectosPage() {
  return <ProyectosView />;
}
