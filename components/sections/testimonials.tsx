"use client";

// Stacked testimonial cards. Layout adapted from rxxndy's 21st.dev
// twitter-testimonial-cards; the tweet costume is intentionally dropped
// (no X branding, handles, dates or engagement counts) because these quotes
// were approved directly by the clients, not posted anywhere. Renders
// nothing until TESTIMONIALS in lib/data.ts has real entries.

import { useState } from "react";
import { SectionHeader } from "../ui/section-header";
import { TESTIMONIALS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OFFSETS = [
  "translate-x-0 translate-y-0",
  "translate-x-8 translate-y-10 sm:translate-x-16 sm:translate-y-12",
  "translate-x-16 translate-y-20 sm:translate-x-32 sm:translate-y-24",
];

export function Testimonials() {
  const { lang } = useLang();
  const [active, setActive] = useState<number | null>(null);
  if (TESTIMONIALS.length === 0) return null;
  const az = lang === "az";

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeader title={az ? "Müştərilər nə deyir" : "What clients say"} />

      <div className="grid place-items-center pb-24 pt-6 [grid-template-areas:'stack']">
        {TESTIMONIALS.map((item, i) => {
          const isActive = active === i;
          const otherActive = active !== null && !isActive;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(isActive ? null : i)}
              style={{ zIndex: 10 + i }}
              className={cn(
                "relative flex w-[300px] cursor-pointer select-none flex-col rounded-2xl glass p-5 shadow-premium transition-all duration-500 -skew-y-[6deg] sm:w-[420px] sm:p-6 [grid-area:stack]",
                OFFSETS[i % OFFSETS.length],
                isActive && "-rotate-1 scale-[1.03] border-primary/40 shadow-glow",
                otherActive && "opacity-60 grayscale",
              )}
            >
              {/* header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-display text-lg font-bold text-background">
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{item.name}</p>
                  <p className="truncate text-xs text-muted">{item.role[lang]}</p>
                </div>
              </div>

              {/* quote */}
              <p className="text-sm leading-relaxed text-ink/85">
                {"“"}
                {item.quote[lang]}
                {"”"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
