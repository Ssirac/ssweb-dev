import type { Metadata } from "next";
import { SnakeGame } from "@/components/sections/snake-game";

export const metadata: Metadata = {
  title: "Play · SS Developer",
  description: "Take a break, play a quick game of Snake.",
};

export default function PlayPage() {
  return (
    <section className="section-anchor relative mx-auto max-w-4xl px-6 py-28">
      <div className="mb-12 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Arcade</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">Snake</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          A little break between the code. Beat your best score.
        </p>
      </div>
      <SnakeGame />
    </section>
  );
}
