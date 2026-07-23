"use client";

// Particle word-morph, embedded at the end of the Skills section ("the tools
// I work with" cycled as particles). Tech terms are language-neutral, so no
// i18n needed. Desktop only; the effect itself also pauses its rAF loop
// whenever it scrolls off-screen.

import { useEffect, useState } from "react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { SKILLS } from "@/lib/data";

// SS DEV first, then every tool from the skills list (stays in sync with it).
const WORDS = ["SS DEV", ...SKILLS.map((s) => s.name.toUpperCase())];

export function ParticleWords() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(desktop && !reduce);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="relative mx-auto mt-16 max-w-3xl">
      <ParticleTextEffect words={WORDS} className="mx-auto w-full" />
    </div>
  );
}
