"use client";

// WebGL scene for the hero video. Kept in its own module so that `three` and
// @react-three/* only land in a lazily-loaded chunk (never the main bundle,
// never mobile — see HeroVideo3D.tsx which dynamic-imports this with ssr:false).

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

const MAX_TILT = (6 * Math.PI) / 180; // ~6° max mouse tilt
const ACCENT_RGB = "69, 80, 245"; // #4550F5

// Soft radial accent texture — sits behind the video and bleeds past its edges
// to read as a subtle rim / glow.
function makeGlowTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.14,
    size / 2,
    size / 2,
    size * 0.5,
  );
  g.addColorStop(0, `rgba(${ACCENT_RGB}, 0.45)`);
  g.addColorStop(0.6, `rgba(${ACCENT_RGB}, 0.16)`);
  g.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function VideoPanel({ src, active }: { src: string; active: boolean }) {
  const texture = useVideoTexture(src, {
    muted: true,
    loop: true,
    playsInline: true,
  });
  const glow = useMemo(makeGlowTexture, []);
  const tilt = useRef<THREE.Group>(null);

  // Panel size follows the video's real aspect ratio (no stretching).
  const video = texture.image as HTMLVideoElement | undefined;
  const aspect =
    video && video.videoWidth ? video.videoWidth / video.videoHeight : 4 / 3;
  const height = 2.4;
  const width = height * aspect;

  // Play only while the section is on-screen (drei autoplays; we gate it).
  // The forward→reverse boomerang is baked into the video, so a native loop
  // gives the seamless go-and-come with no per-frame seeking.
  useEffect(() => {
    if (!video) return;
    if (active) void video.play?.().catch(() => {});
    else video.pause?.();
  }, [active, video]);

  // Smooth mouse-driven tilt, lerped toward the pointer target.
  useFrame((state) => {
    const g = tilt.current;
    if (!g) return;
    const targetY = state.pointer.x * MAX_TILT;
    const targetX = -state.pointer.y * MAX_TILT;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.06);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
      <group ref={tilt}>
        {/* rim / glow */}
        <mesh position={[0, 0, -0.05]} scale={[width * 1.16, height * 1.2, 1]}>
          <planeGeometry />
          <meshBasicMaterial
            map={glow}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* the video itself */}
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

export function HeroVideoScene({ active, src }: { active: boolean; src: string }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 3.6], fov: 42 }}
      frameloop={active ? "always" : "demand"}
    >
      <Suspense fallback={null}>
        <VideoPanel src={src} active={active} />
      </Suspense>
    </Canvas>
  );
}
