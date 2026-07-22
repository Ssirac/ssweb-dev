import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { CodeShowcase } from "@/components/sections/code-showcase";
import { Skills } from "@/components/sections/skills";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { GithubStats } from "@/components/sections/github";
import { RunnerGame } from "@/components/sections/runner-game";
import { Terminal } from "@/components/sections/terminal";
import { Contact } from "@/components/sections/contact";
import { SplineShowcase } from "@/components/sections/spline-showcase";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CodeShowcase />
      <Skills />
      <Services />
      <Projects />
      <GithubStats />
      <SplineShowcase />
      <RunnerGame />
      <Terminal />
      <Contact />
    </>
  );
}
