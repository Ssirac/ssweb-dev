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
import { SkillsSphere } from "../skills-sphere";

const MARQUEE = [
  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS",
  "HTML", "CSS", "Git", "Figma", "Framer Motion", "Node.js",
];

const ICONS: Record<string, IconType> = {
  React: SiReact, "Next.js": SiNextdotjs, TypeScript: SiTypescript, "Node.js": SiNodedotjs,
  Tailwind: SiTailwindcss, PostgreSQL: SiPostgresql, Prisma: SiPrisma, MongoDB: SiMongodb,
  Docker: SiDocker, Figma: SiFigma, Express: SiExpress, Git: SiGit,
};

const SKILL_ITEMS = Object.entries(ICONS).map(([name, Icon]) => ({ name, Icon }));

export function Skills() {
  const { t } = useLang();
  return (
    <section id="skills" className="section-anchor relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader tag={t.skills.tag} title={t.skills.title} subtitle={t.skills.subtitle} />

      <div className="mb-12">
        <Marquee items={MARQUEE} />
      </div>

      <div className="mb-14">
        <SkillsSphere items={SKILL_ITEMS} />
      </div>

      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        {SKILLS.map((s, i) => (
          <motion.div key={s.name}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="will-change-transform">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-ink">{s.name}</span>
              <span className="font-mono text-muted">{s.level}%</span>
            </div>
            {/* Track holds the final width; the fill scales along X so the
                animation runs on the GPU (compositor) — no per-frame layout
                reflow, which is what caused the stutter on mobile. */}
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div style={{ width: `${s.level}%` }} className="h-full">
                <motion.div
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                  className="h-full w-full rounded-full bg-brand-gradient shadow-glow will-change-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
