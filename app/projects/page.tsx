import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";
import { GithubStats } from "@/components/sections/github";

export const metadata: Metadata = {
  title: "Projects — SS Developer",
  description: "Selected work and open-source activity — real-time dashboards, e-commerce, chat apps and award-style portfolios.",
};

export default function ProjectsPage() {
  return (
    <>
      <Projects />
      <GithubStats />
    </>
  );
}
