import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { GithubStats } from "@/components/sections/github";
import { RunnerGame } from "@/components/sections/runner-game";
import { Terminal } from "@/components/sections/terminal";
import { Contact } from "@/components/sections/contact";
import { Orb3D } from "@/components/orb-3d";
import { ScrollModel } from "@/components/scroll-model";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ScrollModel />
      <Skills />
      <Services />
      <Projects />
      <GithubStats />
      <section className="relative mx-auto max-w-6xl px-6 py-10">
        <Orb3D />
      </section>
      <RunnerGame />
      <Terminal />
      <Contact />
    </>
  );
}
