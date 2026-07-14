import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { RunnerGame } from "@/components/sections/runner-game";
import { Terminal } from "@/components/sections/terminal";

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <RunnerGame />
      <Terminal />
    </>
  );
}
