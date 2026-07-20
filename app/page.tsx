import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { RunnerGame } from "@/components/sections/runner-game";
import { Terminal } from "@/components/sections/terminal";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Projects />
      <RunnerGame />
      <Terminal />
      <Contact />
    </>
  );
}
