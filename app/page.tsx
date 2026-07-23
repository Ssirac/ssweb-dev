import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { CodeShowcase } from "@/components/sections/code-showcase";
import { Skills } from "@/components/sections/skills";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { GithubStats } from "@/components/sections/github";
import { StackBuilderSection } from "@/components/sections/stack-builder";
import { RunnerGame } from "@/components/sections/runner-game";
import { Terminal } from "@/components/sections/terminal";
import { Contact } from "@/components/sections/contact";

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
      <StackBuilderSection />
      <RunnerGame />
      <Terminal />
      <Contact />
    </>
  );
}
