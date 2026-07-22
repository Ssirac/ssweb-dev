"use client";

// Cursor-following Spline robot for the hero. Rendered frameless: the scene's
// own background is cleared when the runtime allows it, and the canvas edges
// are faded out with a radial mask so the robot reads as part of the page
// backdrop instead of a boxed panel.
//
// Perf notes:
// - the ~3MB scene file is preloaded in parallel with the Spline JS chunk;
// - the scene is stopped whenever the hero is off-screen (GPU freed);
// - no scroll parallax: per-frame transforms of a large WebGL layer jank.

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import type { Application } from "@splinetool/runtime";
import { SplineScene } from "@/components/ui/splite";

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

// Fade the canvas edges into the page so no rectangle is visible.
const EDGE_MASK = "radial-gradient(78% 72% at 50% 50%, #000 52%, transparent 97%)";

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
    <div ref={boxRef} className="relative h-[340px] w-full sm:h-[420px] lg:h-[500px] xl:h-[560px]">
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
        style={{ WebkitMaskImage: EDGE_MASK, maskImage: EDGE_MASK }}
      >
        <SplineScene
          scene={SCENE}
          className="h-full w-full"
          onLoad={(app) => {
            appRef.current = app;
            // Clear the scene's baked background if the runtime supports it,
            // so the page backdrop shows through behind the robot.
            try {
              const a = app as unknown as { setBackgroundColor?: (c: string) => void };
              a.setBackgroundColor?.("rgba(0,0,0,0)");
            } catch {}
            setReady(true);
          }}
        />
      </div>
    </div>
  );
}
