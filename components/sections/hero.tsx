"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { HeroLogo3D } from "../hero-logo-3d";
import { Magnetic } from "../ui/magnetic";
import { AvailabilityBadge } from "../ui/availability-badge";
import { useLang } from "@/lib/i18n";

// Lazy: keeps the Spline runtime out of the initial hero payload.
const HeroRobot = dynamic(
  () => import("../hero-robot").then((m) => m.HeroRobot),
  { ssr: false, loading: () => null },
);

function useTyping(words: readonly string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  // Skip the per-character animation (constant re-renders) on mobile / reduced
  // motion — show the first role statically instead.
  const [animate, setAnimate] = useState<boolean | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setAnimate(!reduce && !mobile);
  }, []);

  useEffect(() => {
    if (animate === null) return;
    if (!animate) { setText(words[0] ?? ""); return; }
    const word = words[i % words.length];
    const speed = del ? 45 : 90;
    const t = setTimeout(() => {
      if (!del) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDel(true), 1400);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setI(i + 1); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words, animate]);
  return text;
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});


export function Hero() {
  const { t } = useLang();
  const typed = useTyping(t.hero.roles);

  // Rotate through the headlines with a soft fade (no scramble).
  const [hi, setHi] = useState(0);
  const count = t.hero.headlines.length;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHi((n) => (n + 1) % count), 3800);
    return () => clearInterval(id);
  }, [count]);
  const headline = t.hero.headlines[hi % count];

  // Scroll-driven 3D: the robot panel recedes/tilts as the hero scrolls away.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const panelRotate = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const panelScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.45]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="section-anchor relative flex min-h-screen flex-col justify-center px-6 pt-28 pb-20 md:px-12 lg:px-20"
    >
      {/* generated indigo-waves backdrop (Higgsfield) with legibility overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-bg.webp" alt="" aria-hidden className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* cinematic vignette — darkens the edges to focus the eye */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(125% 125% at 50% 35%, transparent 55%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* left — copy */}
        <div>
          <motion.div {...fade(0)} className="mb-8">
            <HeroLogo3D size={84} />
          </motion.div>

          <motion.p {...fade(0.05)} className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
            {t.hero.eyebrow}
          </motion.p>

          <div className="relative mt-6 flex min-h-[5rem] max-w-4xl items-start overflow-hidden sm:min-h-[6.5rem] md:min-h-[8rem] lg:min-h-[9rem]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={hi}
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
                animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                exit={{ clipPath: "inset(0 0 0 100%)", opacity: 0.4 }}
                transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-[2.6rem] md:text-5xl lg:text-[2.7rem] xl:text-[3rem]"
              >
                {headline.lead}
                <span className="marker text-ink">{headline.mark}</span>
                {headline.tail}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.div
            {...fade(0.3)}
            className="mt-8 flex items-center gap-2 font-mono text-base text-muted md:text-lg"
            aria-hidden
          >
            <span className="text-primary">$</span>
            <span className="text-ink/80">{typed}</span>
            <span className="inline-block h-5 w-[2px] animate-pulse bg-primary" />
          </motion.div>

          <motion.p {...fade(0.4)} className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            {t.hero.desc}
          </motion.p>

          <motion.div {...fade(0.5)} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="/projects"
                className="group flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-medium text-background shadow-glow transition hover:shadow-glow-lg"
              >
                {t.cta.viewProjects} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-full border border-ink/12 px-6 py-3 font-medium text-ink transition hover:border-primary/50 hover:text-primary"
              >
                <Mail size={17} /> {t.cta.contactMe}
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div {...fade(0.55)} className="mt-6">
            <AvailabilityBadge />
          </motion.div>
        </div>

        {/* right — cursor-following Spline robot (parallax depth on scroll) */}
        <motion.div {...fade(0.6)} className="hidden w-full lg:block lg:justify-self-end">
          <motion.div
            style={{ y: panelY, rotateX: panelRotate, scale: panelScale, opacity: panelOpacity, transformPerspective: 1200 }}
          >
            <HeroRobot />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
