"use client";

// Cursor-following Spline robot for the hero. Runs on any WebGL-capable
// device with enough cores (mobile included); very low-end phones and
// reduced-motion users skip it. An indigo light sits behind the robot and
// the scene fades in once loaded so the arrival feels smooth, not a pop.

import { useEffect, useState } from "react";
import { SplineScene } from "@/components/ui/splite";

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function HeroRobot() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // WebGL-heavy scene: skip devices with very few cores (budget phones).
    const cores = navigator.hardwareConcurrency ?? 4;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setEnabled(!reduce && ok && cores >= 4);
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="relative h-[320px] w-full overflow-hidden rounded-3xl sm:h-[400px] lg:h-[480px] xl:h-[540px]"
      style={{ boxShadow: "0 30px 90px -30px rgba(69,80,245,0.45)" }}
    >
      {/* indigo light behind the robot */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 60% at 50% 45%, rgba(69,80,245,0.30), transparent 72%)",
        }}
      />

      {/* loader until the scene is ready */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loader" />
        </div>
      )}

      <div
        className={`h-full w-full transition-opacity duration-700 ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <SplineScene scene={SCENE} className="h-full w-full" onLoad={() => setReady(true)} />
      </div>
    </div>
  );
}
