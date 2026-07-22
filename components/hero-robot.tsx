"use client";

// Cursor-following Spline robot for the hero. Perf notes:
// - the ~3MB scene file is preloaded in parallel with the Spline JS chunk,
//   so slow (mobile) networks don't pay for them sequentially;
// - the scene is stopped whenever the hero is off-screen, freeing the GPU
//   for the rest of the page (this was the desktop scroll-jank source);
// - no scroll parallax on the canvas: per-frame transforms of a large WebGL
//   layer are expensive to composite.

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import type { Application } from "@splinetool/runtime";
import { SplineScene } from "@/components/ui/splite";

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function HeroRobot() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

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
    const on = !reduce && ok && cores >= 4;
    if (on) {
      // Start downloading the scene now, in parallel with the JS chunk.
      try {
        preload(SCENE, { as: "fetch", crossOrigin: "anonymous" });
      } catch {}
    }
    setEnabled(on);
  }, []);

  // Stop rendering while the hero is scrolled out of view.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !ready) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const app = appRef.current;
        if (!app) return;
        try {
          if (entry.isIntersecting) app.play();
          else app.stop();
        } catch {}
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  if (!enabled) return null;

  return (
    <div
      ref={boxRef}
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
        <SplineScene
          scene={SCENE}
          className="h-full w-full"
          onLoad={(app) => {
            appRef.current = app;
            setReady(true);
          }}
        />
      </div>
    </div>
  );
}
