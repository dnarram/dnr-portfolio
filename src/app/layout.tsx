import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F141C" },
  ],
};

/**
 * Se ejecuta antes del primer paint para evitar el flash de tema
 * incorrecto (FOUC). Manual §8: la transición claro/oscuro debe ser
 * síncrona en logo, tipografía y CTA — los tokens CSS lo garantizan.
 */
const themeInit = `(function(){try{var t=localStorage.getItem("dnr-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: "Data Science & Full-Stack Web Development",
  address: { "@type": "PostalAddress", addressLocality: "Ronda", addressRegion: "Málaga", addressCountry: "ES" },
  sameAs: [SITE.github, SITE.linkedin],
  knowsAbout: ["Data Science", "Data Engineering", "SQL", "PostgreSQL", "Python", "pandas", "Node.js", "Web Development"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const goatcounter = process.env.NEXT_PUBLIC_GOATCOUNTER;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {children}
        {/* Analítica sin cookies (RGPD-friendly, sin banner de consentimiento). Solo se carga si está configurada. */}
        {goatcounter ? (
          <script async data-goatcounter={`https://${goatcounter}.goatcounter.com/count`} src="https://gc.zgo.at/count.js" />
        ) : null}
        {umamiId ? <script defer src={umamiSrc} data-website-id={umamiId} /> : null}
      </body>
    </html>
  );
}
