"use client";

// Client testimonials. Renders NOTHING until TESTIMONIALS in lib/data.ts has
// real, permission-granted quotes in it (no fabricated social proof).

import { motion } from "framer-motion";
import { SectionHeader } from "../ui/section-header";
import { TESTIMONIALS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function Testimonials() {
  const { lang } = useLang();
  if (TESTIMONIALS.length === 0) return null;
  const az = lang === "az";

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeader title={az ? "Müştərilər nə deyir" : "What clients say"} />
      <div className="grid gap-6 md:grid-cols-2">
        {TESTIMONIALS.map((item) => (
          <motion.figure
            key={item.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl glass p-7 shadow-premium"
          >
            <blockquote className="leading-relaxed text-ink/85">
              {"“"}
              {item.quote[lang]}
              {"”"}
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-ink">{item.name}</span>
              <span className="text-muted"> · {item.role[lang]}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
