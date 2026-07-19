"use client";

// 3D video hero element.
//   • Desktop + motion allowed → WebGL panel (three lives in a lazy chunk).
//   • Mobile (<768px) or prefers-reduced-motion or no WebGL → plain <video> + poster.
// The heavy scene is dynamic-imported with ssr:false so `three` never ships to
// mobile and never runs on the server.

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { advancePingPong, type PingPongDirection } from "./hero-video-ping-pong";

const MP4 = "/videos/ss-hero.mp4";
const WEBM = "/videos/ss-hero.webm";
const POSTER = "/videos/ss-hero-poster.jpg";

const HeroVideoScene = dynamic(
  () => import("./hero-video-3d-scene").then((m) => m.HeroVideoScene),
  { ssr: false },
);

/** Dependency-free fallback: poster + muted looping video. */
function VideoFallback({ active }: { active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const direction = useRef<PingPongDirection["current"]>(1);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      direction.current = 1;
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  // Hand-driven ping-pong bounce: rAF loop only runs while in view.
  useEffect(() => {
    const v = ref.current;
    if (!v || !active) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      advancePingPong(v, delta, direction);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      poster={POSTER}
      preload="metadata"
      muted
      playsInline
    >
      <source src={WEBM} type="video/webm" />
      <source src={MP4} type="video/mp4" />
    </video>
  );
}

export function HeroVideo3D() {
  const [mode, setMode] = useState<"pending" | "webgl" | "plain">("pending");
  const [visible, setVisible] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Decide rendering path on the client (matchMedia / WebGL are browser-only).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const decide = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = mq.matches;
      let canWebGL = false;
      try {
        const c = document.createElement("canvas");
        canWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        canWebGL = false;
      }
      setMode(reduce || mobile || !canWebGL ? "plain" : "webgl");
    };
    decide();
    mq.addEventListener?.("change", decide);
    return () => mq.removeEventListener?.("change", decide);
  }, []);

  // Play only while scrolled into view.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
      style={{ boxShadow: "0 30px 80px -30px rgba(69,80,245,0.4)" }}
    >
      {/* accent wash behind the (transparent) canvas */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(69,80,245,0.20), transparent 70%)",
        }}
      />
      {mode === "webgl" && <HeroVideoScene active={visible} src={MP4} />}
      {mode === "plain" && <VideoFallback active={visible} />}
      {mode === "pending" && (
        // reserve layout with the poster while we decide (avoids any flash / CLS)
        // eslint-disable-next-line @next/next/no-img-element
        <img src={POSTER} alt="" className="h-full w-full object-cover" />
      )}
    </div>
  );
}
