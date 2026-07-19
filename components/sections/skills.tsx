"use client";
import { motion } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiTailwindcss, SiPostgresql,
  SiPrisma, SiMongodb, SiDocker, SiFigma, SiExpress, SiGit,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { SectionHeader } from "../ui/section-header";
import { Marquee } from "../ui/marquee";
import { SKILLS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const MARQUEE = [
  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS",
  "HTML", "CSS", "Git", "Figma", "Framer Motion", "Node.js",
];

const ICONS: Record<string, IconType> = {
  React: SiReact, "Next.js": SiNextdotjs, TypeScript: SiTypescript, "Node.js": SiNodedotjs,
  Tailwind: SiTailwindcss, PostgreSQL: SiPostgresql, Prisma: SiPrisma, MongoDB: SiMongodb,
  Docker: SiDocker, Figma: SiFigma, Express: SiExpress, Git: SiGit,
};

export function Skills() {
  const { t } = useLang();
  return (
    <section id="skills" className="section-anchor relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader tag={t.skills.tag} title={t.skills.title} subtitle={t.skills.subtitle} />

      <div className="mb-12">
        <Marquee items={MARQUEE} />
      </div>

      <div className="mb-14 flex flex-wrap justify-center gap-4">
        {Object.entries(ICONS).map(([name, Icon], i) => (
          <motion.div key={name}
            initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: i * 0.04 }} whileHover={{ y: -6, scale: 1.1 }}
            className="group flex h-16 w-16 items-center justify-center rounded-2xl glass shadow-premium transition hover:border-primary/40 hover:shadow-glow"
            data-cursor title={name}>
            <Icon className="text-2xl text-muted transition group-hover:text-primary" />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        {SKILLS.map((s, i) => (
          <motion.div key={s.name}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-ink">{s.name}</span>
              <span className="font-mono text-muted">{s.level}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }}
                viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-brand-gradient shadow-glow" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
