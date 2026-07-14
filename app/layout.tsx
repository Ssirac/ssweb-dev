import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import { ScrollProgress } from "@/components/scroll-progress";
import { CommandPalette } from "@/components/command-palette";
import { Grid } from "@/components/background/grid";
import { Spotlight } from "@/components/background/spotlight";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
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
      <body className="noise font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <ScrollProgress />
          <CommandPalette />
          <Grid />
          <Spotlight />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
