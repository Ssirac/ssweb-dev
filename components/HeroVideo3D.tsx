"use client";

// Hero video — a native, autoplaying muted loop of the baked boomerang clip.
// Plain <video> (no WebGL) so it starts instantly and never janks page load.
// The browser decodes off the main thread → smooth; autoplay is reliable.

import { useEffect, useRef } from "react";

// ?v bumped whenever the encoded clip changes (v2 = baked forward→reverse boomerang).
const MP4 = "/videos/ss-hero.mp4?v=2";
const WEBM = "/videos/ss-hero.webm?v=2";
const POSTER = "/videos/ss-hero-poster.jpg";

export function HeroVideo3D() {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause when scrolled out of view to save resources; resume when back.
  useEffect(() => {
    const el = boxRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
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
      {/* soft accent wash behind the video */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl"
        style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(69,80,245,0.20), transparent 70%)" }}
      />
      <video
        ref={videoRef}
        className="relative h-full w-full rounded-2xl object-cover"
        poster={POSTER}
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={WEBM} type="video/webm" />
        <source src={MP4} type="video/mp4" />
      </video>
    </div>
  );
}
