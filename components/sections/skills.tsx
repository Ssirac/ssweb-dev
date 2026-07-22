"use client";
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiTailwindcss, SiPostgresql,
  SiPrisma, SiMongodb, SiDocker, SiFigma, SiExpress, SiGit,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { SectionHeader } from "../ui/section-header";
import { Marquee } from "../ui/marquee";
import { useLang } from "@/lib/i18n";
import { SkillsSphere } from "../skills-sphere";
import { SkillRadar } from "../ui/skill-radar";

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

      <SkillRadar />
    </section>
  );
}
