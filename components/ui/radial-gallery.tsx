"use client";

// Lightweight radial project wheel. The 21st.dev original pins the viewport
// with GSAP ScrollTrigger (scroll-hijack) and spins a full 360deg circle;
// this rebuild keeps the buried-wheel look but drives a GENTLE sweep from
// Framer Motion's useScroll -> motion values (compositor transforms, spring
// smoothed). No pin, no scroll lock, no per-frame React state. Cards fan out
// from a pivot at the bottom of the band and counter-rotate to stay upright.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SWEEP = 18; // gentle rotation range (deg) across the scroll

export function RadialGallery() {
  const { t, lang } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
  const wheelRotate = useTransform(smooth, [0, 1], [-SWEEP, SWEEP]);
  const counterRotate = useTransform(wheelRotate, (r) => -r);

  const n = PROJECTS.length;
  const R = mobile ? 150 : 300; // circle radius (px)
  const fanStep = mobile ? 34 : 40; // degrees between cards
  const cardW = mobile ? 140 : 210;
  const cardH = mobile ? 190 : 285;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-anchor relative mx-auto max-w-6xl overflow-hidden px-6 py-24"
    >
      <div className="mb-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.projects.tag}</span>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {t.projects.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{t.projects.subtitle}</p>
      </div>

      {/* the band: cards fan up from a pivot at its bottom, faded at the edge */}
      <div className="relative h-[360px] w-full [mask-image:linear-gradient(to_top,transparent_0%,black_22%)] [-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_22%)] sm:h-[430px]">
        {/* pivot point at bottom center; the wheel rotates around it */}
        <motion.div
          style={{ rotate: wheelRotate }}
          className="absolute bottom-0 left-1/2 h-0 w-0 will-change-transform"
        >
          {PROJECTS.map((p, i) => {
            const aDeg = (i - (n - 1) / 2) * fanStep;
            const aRad = (aDeg * Math.PI) / 180;
            const x = R * Math.sin(aRad);
            const y = -R * Math.cos(aRad);
            const isHovered = hovered === i;
            const dim = hovered !== null && !isHovered;
            const label = t.projects.categories[p.category];

            return (
              <div
                key={p.slug}
                className="absolute left-0 top-0"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
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
                    style={{ width: cardW, height: cardH }}
                    className={cn(
                      "group relative block overflow-hidden rounded-2xl border border-ink/10 shadow-premium transition-all duration-500 ease-out",
                      isHovered ? "-translate-y-3 scale-105" : "scale-100",
                      dim ? "opacity-40 blur-[2px] grayscale" : "opacity-100",
                    )}
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="210px"
                      className={cn(
                        "transition-transform duration-700",
                        "fit" in p && p.fit === "contain"
                          ? "object-contain bg-background/70"
                          : "object-cover object-top",
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
                        <h3 className="text-base font-bold leading-tight text-ink sm:text-lg">{p.title}</h3>
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

      <div className="mt-4 flex justify-center">
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
