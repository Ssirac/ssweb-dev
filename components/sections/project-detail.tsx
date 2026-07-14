"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

type Project = (typeof PROJECTS)[number];

export function ProjectDetail({ project: p }: { project: Project }) {
  const { t, lang } = useLang();

  return (
    <section className="section-anchor relative mx-auto max-w-4xl px-6 py-28">
      <Link href="/projects" data-cursor
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition hover:text-primary">
        <ArrowLeft size={14} /> {t.nav.projects}
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-primary">
          <span>{t.projects.categories[p.category]}</span>
          <span className="text-muted">·</span>
          <span className="text-muted">{p.year}</span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">{p.title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{p.desc[lang]}</p>

        <a href={p.demo} target="_blank" rel="noopener noreferrer" data-cursor
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-medium text-background shadow-glow transition hover:shadow-glow-lg">
          <ExternalLink size={16} /> {t.cta.liveDemo}
        </a>

        <div className="mt-10 overflow-hidden rounded-3xl glass shadow-premium">
          <div className="relative aspect-[16/10]">
            <Image src={p.image} alt={p.title} fill priority sizes="(max-width:768px) 100vw, 900px"
              className="object-cover object-top" />
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {lang === "az" ? "Layihə haqqında" : "About the project"}
            </h2>
            <p className="mt-4 leading-relaxed text-ink/80">{p.about[lang]}</p>

            <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {lang === "az" ? "Əsas xüsusiyyətlər" : "Key features"}
            </h3>
            <ul className="mt-4 space-y-2">
              {p.features[lang].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {lang === "az" ? "Rol" : "Role"}
              </h3>
              <p className="mt-2 text-sm text-ink">{p.role[lang]}</p>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {lang === "az" ? "Texnologiya" : "Tech stack"}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.map((tech) => (
                  <span key={tech} className="rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-xs text-ink/80">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
