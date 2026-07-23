"use client";

// Interactive LEGO stack builder section: visitors click the tech blocks and
// they jump onto the SS Developer profile brick. Fills the slot the particle
// interlude used to occupy (that moved into the Skills section).

import { SectionHeader } from "../ui/section-header";
import StackBuilder from "../ui/interactive-tech-stack-builder";
import { useLang } from "@/lib/i18n";

export function StackBuilderSection() {
  const { lang } = useLang();
  const az = lang === "az";

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        title={az ? "Stekimi özün yığ" : "Build my stack"}
        subtitle={
          az
            ? "Bloklara klik et: texnologiyalar profilin üstünə düzülsün."
            : "Click the blocks: the technologies stack up on the profile."
        }
      />
      <StackBuilder />
    </section>
  );
}
