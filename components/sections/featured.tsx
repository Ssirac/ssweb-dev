"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { ProjectCard } from "../ui/project-card";
import { PROJECTS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function Featured() {
  const { t } = useLang();
  const featured = PROJECTS.slice(0, 2);

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader tag={t.projects.tag} title={t.projects.title} subtitle={t.projects.subtitle} />

      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-12 flex justify-center">
        <Link href="/projects" data-cursor
          className="group flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-ink transition hover:border-primary/40 hover:shadow-glow">
          {t.cta.viewProjects} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}
