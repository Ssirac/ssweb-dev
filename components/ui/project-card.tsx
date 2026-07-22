"use client";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

type Project = (typeof PROJECTS)[number];

const MAX_TILT = 8; // degrees

export function ProjectCard({ p }: { p: Project }) {
  const { t, lang } = useLang();

  // Pointer-driven 3D tilt + a glare that tracks the cursor (holographic feel).
  // Disabled for users who prefer reduced motion.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 15, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 45%)`;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative overflow-hidden rounded-3xl glass glass-accent shadow-premium transition-[box-shadow,border-color] duration-300 ease-out [transform-style:preserve-3d] hover:border-primary/30 hover:shadow-glow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={p.image}
          alt={p.title}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* bottom fade so the action buttons stay legible */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 pb-5 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" data-cursor
              aria-label={`${p.title} live demo`}
              className="flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-background shadow-glow">
              <ExternalLink size={15} /> {t.cta.liveDemo}
            </a>
          )}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" data-cursor
              aria-label={`${p.title} source code`}
              className="flex items-center gap-1.5 rounded-full glass-strong px-4 py-2 text-sm text-ink">
              <Github size={15} /> {t.cta.code}
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        <span className="font-mono text-xs text-primary">{t.projects.categories[p.category]}</span>
        <Link href={`/projects/${p.slug}`} className="mt-1 block">
          <h3 className="text-xl font-semibold text-ink transition-colors group-hover:text-primary">{p.title}</h3>
        </Link>
        <p className="mt-2 text-sm text-muted">{p.desc[lang]}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tech.map((tech) => (
            <span key={tech} className="rounded-full border border-ink/10 bg-ink/5 px-2.5 py-1 text-xs text-ink/80">{tech}</span>
          ))}
        </div>
        <Link href={`/projects/${p.slug}`} data-cursor
          className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:gap-2">
          {lang === "az" ? "Ətraflı" : "Details"} <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* cursor-tracking glare — sits above content, never intercepts clicks */}
      <motion.div
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.article>
  );
}
