import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import { PROFILE } from "@/lib/data";
import { LanguageProvider } from "@/lib/i18n";
import { ScrollProgress } from "@/components/scroll-progress";
import { CommandPalette } from "@/components/command-palette";
import { Grid } from "@/components/background/grid";
import { Spotlight } from "@/components/background/spotlight";
import { Aurora } from "@/components/background/aurora";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Konami } from "@/components/konami";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "SS Developer — Junior Frontend Developer",
    template: "%s · SS Developer",
  },
  description:
    "Portfolio of SS Developer — a junior frontend developer building clean, modern web experiences with React, Next.js & TypeScript.",
  keywords: ["Junior Frontend Developer", "Next.js", "React", "TypeScript", "Web Developer", "ssweb.dev"],
  authors: [{ name: "SS Developer" }],
  openGraph: {
    title: "SS Developer — Junior Frontend Developer",
    description: "Clean, modern web experiences built with React, Next.js & TypeScript.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={`${GeistSans.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.dataset.theme='light';var a=localStorage.getItem('accent');if(a){var p=JSON.parse(a);document.documentElement.style.setProperty('--c-primary',p[0]);document.documentElement.style.setProperty('--c-secondary',p[1]);}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: PROFILE.name,
              url: SITE_URL,
              jobTitle: "Junior Frontend Developer",
              email: `mailto:${PROFILE.email}`,
              sameAs: [
                PROFILE.socials.github,
                PROFILE.socials.linkedin,
                PROFILE.socials.instagram,
              ],
              knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Frontend Development"],
            }),
          }}
        />
      </head>
      <body className="noise font-sans antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-medium focus:text-background"
        >
          İçəriyə keç
        </a>
        <LanguageProvider>
          <ScrollProgress />
          <CommandPalette />
          <Aurora />
          <Grid />
          <Spotlight />
          <Navbar />
          <main id="main" className="relative z-10">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Konami />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
