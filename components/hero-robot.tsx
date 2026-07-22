"use client";

// Spline robot for the hero right panel (cursor-following). Desktop + WebGL +
// motion only — the Spline runtime and scene are heavy, so smaller screens
// never load them (the About section's video carries the visual there).

import { useEffect, useState } from "react";
import { SplineScene } from "@/components/ui/splite";

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function HeroRobot() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setEnabled(desktop && !reduce && ok);
  }, []);

  if (!enabled) return null;

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-3xl xl:h-[540px]">
      <SplineScene scene={SCENE} className="h-full w-full" />
    </div>
  );
}
