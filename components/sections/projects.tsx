"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "../ui/section-header";
import { ProjectCard } from "../ui/project-card";
import { PROJECTS, PROJECT_CATEGORIES } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Projects() {
  const { t } = useLang();
  const [cat, setCat] = useState<string>("All");
  const filtered = cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === cat);

  return (
    <section id="projects" className="section-anchor relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader tag={t.projects.tag} title={t.projects.title} subtitle={t.projects.subtitle} />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {PROJECT_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} data-cursor
            className={cn("rounded-full px-4 py-1.5 text-sm transition",
              cat === c ? "bg-brand-gradient text-background shadow-glow" : "glass text-muted hover:text-background")}>
            {t.projects.categories[c]}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
