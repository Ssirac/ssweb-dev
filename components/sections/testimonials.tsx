"use client";

// Stacked testimonial deck with explicit controls. The active card is always
// fully on top and readable; the rest peek out behind it, dimmed. Arrows and
// dots (plus clicking a peeking card) switch cards — no hover mechanics,
// which made the lower card unreadable. Renders nothing until TESTIMONIALS
// in lib/data.ts has real entries.

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { TESTIMONIALS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  if (TESTIMONIALS.length === 0) return null;
  const az = lang === "az";
  const count = TESTIMONIALS.length;

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeader title={az ? "Müştərilər nə deyir" : "What clients say"} />

      <div className="grid place-items-center pt-4 [grid-template-areas:'stack']">
        {TESTIMONIALS.map((item, i) => {
          const isActive = i === active;
          return (
            <div
              key={item.name}
              onClick={() => setActive(i)}
              className={cn(
                "flex w-[300px] cursor-pointer select-none flex-col rounded-2xl glass p-5 shadow-premium transition-all duration-500 sm:w-[440px] sm:p-6 [grid-area:stack]",
                isActive
                  ? "z-20 rotate-0 border-primary/30 opacity-100 shadow-glow"
                  : "z-10 -rotate-2 translate-x-6 translate-y-6 scale-[0.97] opacity-70 grayscale sm:translate-x-10 sm:translate-y-8",
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

      {/* controls */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label={az ? "Əvvəlki rəy" : "Previous review"}
          className="flex h-10 w-10 items-center justify-center rounded-full glass text-ink transition hover:border-primary/40 hover:text-primary hover:shadow-glow"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name}
              onClick={() => setActive(i)}
              aria-label={`${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-primary" : "w-2 bg-ink/20 hover:bg-ink/40",
              )}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label={az ? "Növbəti rəy" : "Next review"}
          className="flex h-10 w-10 items-center justify-center rounded-full glass text-ink transition hover:border-primary/40 hover:text-primary hover:shadow-glow"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
