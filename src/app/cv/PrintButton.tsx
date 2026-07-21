"use client";

export default function PrintButton() {
  return (
    <button className="cv-print" onClick={() => window.print()}>
      Imprimir / Guardar como PDF
    </button>
  );
}