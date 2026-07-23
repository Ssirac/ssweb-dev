"use client";

// Particle word-morph interlude (fills the slot the orb used to occupy).
// Tech terms are language-neutral, so no i18n needed. Desktop only; the
// effect itself also pauses its rAF loop whenever it scrolls off-screen.

import { useEffect, useState } from "react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

const WORDS = ["SS DEV", "REACT", "NEXT.JS", "TYPESCRIPT", "TAILWIND", "FRONTEND"];

export function ParticleWords() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(desktop && !reduce);
  }, []);

  if (!enabled) return null;

  return (
    <section aria-hidden className="relative mx-auto max-w-4xl px-6 py-10">
      <ParticleTextEffect words={WORDS} className="mx-auto w-full" />
    </section>
  );
}
