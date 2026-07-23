"use client";

// Centered testimonial carousel, rebuilt by eye from nayan_radadiya6's
// 21st.dev component (its source is membership-locked): avatar with a quote
// badge, name, accent role, quote, side arrows, dots and a gentle
// auto-advance (paused on hover, off under reduced motion). Our adaptations:
// initial-letter avatars instead of stock photos and the brand accent
// everywhere. Renders nothing until TESTIMONIALS in lib/data.ts has entries.

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { TESTIMONIALS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = TESTIMONIALS.length;

  // Gentle auto-advance.
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), 6000);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;
  const az = lang === "az";
  const item = TESTIMONIALS[active];

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeader title={az ? "Müştərilər nə deyir" : "What clients say"} />

      <div
        className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl glass px-14 py-10 shadow-premium sm:px-20 sm:py-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* oversized decorative quote mark */}
        <Quote
          size={140}
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-6 text-primary/[0.07]"
          style={{ transform: "scaleX(-1)" }}
        />
        {/* side arrows */}
        <button
          onClick={prev}
          aria-label={az ? "Əvvəlki rəy" : "Previous review"}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full glass text-ink transition hover:border-primary/40 hover:text-primary hover:shadow-glow sm:left-5"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          aria-label={az ? "Növbəti rəy" : "Next review"}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full glass text-ink transition hover:border-primary/40 hover:text-primary hover:shadow-glow sm:right-5"
        >
          <ChevronRight size={18} />
        </button>

        <AnimatePresence mode="wait">
          <motion.figure
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* avatar: real client logo, or initial as fallback */}
            <div className="relative">
              {item.logo ? (
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-glow ring-2 ring-primary/30">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient font-display text-2xl font-bold text-background shadow-glow">
                  {item.name.charAt(0)}
                </div>
              )}
            </div>

            {/* five-star rating */}
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-primary text-primary" />
              ))}
            </div>

            <figcaption className="mt-3">
              <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">{item.name}</h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                {item.role[lang]}
              </p>
            </figcaption>

            <blockquote className="mt-4 max-w-xl text-sm leading-relaxed text-ink/85 sm:text-base">
              {item.quote[lang]}
            </blockquote>
          </motion.figure>
        </AnimatePresence>

        {/* dots */}
        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((entry, i) => (
            <button
              key={entry.name}
              onClick={() => setActive(i)}
              aria-label={`${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-primary" : "w-2 bg-ink/20 hover:bg-ink/40",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
