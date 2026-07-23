"use client";

// Cursor-following Spline robot for the hero. Rendered frameless: the scene's
// baked background is cleared when the runtime allows it, and the canvas edges
// fade out with a radial mask so the robot reads as part of the page backdrop.
//
// Perf notes:
// - the ~3MB scene file is preloaded in parallel with the Spline JS chunk;
// - the canvas is FULLY UNMOUNTED once the hero scrolls out of view (small
//   120px buffer): stop()/play() still left the WebGL layer compositing and
//   the page stuttered below the hero. Unmounting frees the GPU completely;
//   on scroll-back the scene re-inits from HTTP cache behind the warm-up fade;
// - reveal is delayed 400ms after load so shader compilation and the first
//   heavy frames happen while invisible (hides the post-load stutter);
// - no scroll parallax: per-frame transforms of a large WebGL layer jank.

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import type { Application } from "@splinetool/runtime";
import { SplineScene } from "@/components/ui/splite";

// Our own remix of the NEXBOT community scene: SS logo emblem on the chest,
// NEXBOT wall text hidden, background baked to the site's dark tone (07080F).
const SCENE = "https://prod.spline.design/e474W1xFIThd5kSX/scene.splinecode";

// Fade the canvas edges into the page so no rectangle is visible.
const EDGE_MASK = "radial-gradient(78% 72% at 50% 50%, #000 52%, transparent 97%)";

export function HeroRobot() {
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

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

  // Mount the scene only while the hero is (near) the viewport.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !enabled) return;
    // Tight 120px buffer: with 400px the scene kept rendering through the
    // whole top of the About section and it stuttered there.
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "120px 0px 120px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  // Reset the reveal state whenever the scene is unmounted.
  useEffect(() => {
    if (!inView) {
      setReady(false);
      appRef.current = null;
      if (revealTimer.current) clearTimeout(revealTimer.current);
    }
  }, [inView]);

  if (!enabled) return null;

  return (
    <div ref={boxRef} className="relative h-[340px] w-full sm:h-[420px] lg:h-[500px] xl:h-[560px]">
      {inView && (
        <div
          className={`h-full w-full transition-opacity duration-[900ms] ease-out ${
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
              // Warm-up: stay invisible while shaders compile, then fade in.
              revealTimer.current = window.setTimeout(() => setReady(true), 400);
            }}
          />
        </div>
      )}
    </div>
  );
}
