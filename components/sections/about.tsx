"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SectionHeader } from "../ui/section-header";
import { GlowCard } from "../ui/glow-card";
import { CountUp } from "../ui/count-up";
import { TIMELINE, HIGHLIGHT_KEYS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { Sparkles, Rocket, Heart } from "lucide-react";

const HIGHLIGHT_ICONS = { years: Sparkles, projects: Rocket, design: Heart } as const;

// Brand motion clip (moved here from the hero). Native video, poster while loading.
const HeroVideo3D = dynamic(
  () => import("../HeroVideo3D").then((m) => m.HeroVideo3D),
  {
    ssr: false,
    loading: () => (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/videos/ss-hero-poster.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-80"
        />
      </div>
    ),
  },
);

export function About() {
  const { t } = useLang();
  const highlights = HIGHLIGHT_KEYS.map((key) => ({
    icon: HIGHLIGHT_ICONS[key],
    ...t.about.highlights[key],
  }));

  return (
    <section id="about" className="section-anchor relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader tag={t.about.tag} title={t.about.title} subtitle={t.about.subtitle} />

      <div className="grid gap-6 md:grid-cols-3">
        {highlights.map((h, i) => (
          <motion.div key={h.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <GlowCard>
              <h.icon className="text-primary" size={26} />
              <h3 className="mt-4 text-2xl font-bold text-ink"><CountUp text={h.title} /></h3>
              <p className="mt-1 text-sm text-muted">{h.desc}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* brand motion clip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-16 max-w-3xl"
      >
        <HeroVideo3D />
      </motion.div>

      <div className="mt-16">
        <h3 className="mb-8 text-center font-mono text-sm tracking-widest text-muted">{t.about.timelineTitle}</h3>
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-secondary to-transparent md:left-1/2" />
          {TIMELINE.map((year, i) => {
            const item = t.about.timeline[year];
            return (
            <motion.div key={year}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className={`relative mb-8 pl-12 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}>
              <div className={`absolute top-1.5 h-3 w-3 rounded-full bg-primary shadow-glow left-[9px] ${i % 2 ? "md:-left-1.5" : "md:-right-1.5 md:left-auto"}`} />
              <span className="font-mono text-xs text-primary">{year}</span>
              <h4 className="mt-1 text-lg font-semibold text-ink">{item.title}</h4>
              <p className="text-sm text-muted">{item.place}</p>
              <p className="mt-1 text-sm text-ink/70">{item.desc}</p>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
