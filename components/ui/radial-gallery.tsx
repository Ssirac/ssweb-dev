"use client";

// Lightweight radial project wheel. The 21st.dev original pins the viewport
// with GSAP ScrollTrigger (scroll-hijack) and spins a full 360deg circle;
// this rebuild keeps the buried-wheel look but drives a GENTLE sweep from
// Framer Motion's useScroll -> motion values (compositor transforms, spring
// smoothed). No pin, no scroll lock, no per-frame React state, so the page
// keeps scrolling normally. Cards counter-rotate to stay upright and readable.

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// gentle sweep range (deg) as the section scrolls through the viewport
const SWEEP = 22;
// how far apart the cards fan across the top of the wheel
const FAN_STEP = 40;

export function RadialGallery() {
  const { t, lang } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
  const wheelRotate = useTransform(smooth, [0, 1], [-SWEEP, SWEEP]);
  const counterRotate = useTransform(wheelRotate, (r) => -r);

  const n = PROJECTS.length;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-anchor relative mx-auto max-w-6xl overflow-hidden px-6 py-24"
    >
      <div className="mb-4 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.projects.tag}</span>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {t.projects.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{t.projects.subtitle}</p>
      </div>

      {/* buried wheel: only the top band shows, faded at the bottom */}
      <div
        className="relative h-[420px] w-full [mask-image:linear-gradient(to_top,transparent_2%,black_28%)] [-webkit-mask-image:linear-gradient(to_top,transparent_2%,black_28%)] sm:h-[500px]"
      >
        <motion.div
          style={{ rotate: wheelRotate }}
          className="absolute left-1/2 top-full h-[520px] w-[520px] -translate-x-1/2 will-change-transform sm:h-[720px] sm:w-[720px]"
        >
          {PROJECTS.map((p, i) => {
            // fan the cards across the top of the circle, centered straight up
            const aDeg = (i - (n - 1) / 2) * FAN_STEP;
            const aRad = (aDeg * Math.PI) / 180;
            // radius = half the wheel width (responsive via the wheel size)
            const rPct = 50; // percent of the wheel box
            const x = rPct * Math.sin(aRad);
            const y = -rPct * Math.cos(aRad);
            const isHovered = hovered === i;
            const dim = hovered !== null && !isHovered;
            const label = t.projects.categories[p.category];

            return (
              <div
                key={p.slug}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}%, ${y}%)`,
                  zIndex: isHovered ? 30 : 10,
                }}
              >
                <motion.div style={{ rotate: counterRotate }}>
                  <Link
                    href={`/projects/${p.slug}`}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    data-cursor
                    className={cn(
                      "group relative block h-[240px] w-[180px] overflow-hidden rounded-2xl border border-ink/10 shadow-premium transition-all duration-500 ease-out sm:h-[300px] sm:w-[220px]",
                      isHovered ? "-translate-y-3 scale-105" : "scale-100",
                      dim ? "opacity-40 blur-[2px] grayscale" : "opacity-100",
                    )}
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="220px"
                      className={cn(
                        "object-cover transition-transform duration-700",
                        "fit" in p && p.fit === "contain" ? "object-contain bg-background/70" : "object-top",
                        isHovered ? "scale-110" : "scale-100 grayscale-[25%]",
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div className="flex items-start justify-between">
                        <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-ink backdrop-blur">
                          {label}
                        </span>
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white transition-all duration-500",
                            isHovered ? "rotate-0 opacity-100" : "-rotate-45 opacity-0",
                          )}
                        >
                          <ArrowUpRight size={12} />
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold leading-tight text-ink">{p.title}</h3>
                        <div
                          className={cn(
                            "mt-2 h-0.5 bg-primary transition-all duration-500",
                            isHovered ? "w-full opacity-100" : "w-0 opacity-0",
                          )}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/projects"
          data-cursor
          className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm text-ink transition hover:border-primary/40 hover:text-primary hover:shadow-glow"
        >
          {lang === "az" ? "Bütün layihələr" : "All projects"} <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
