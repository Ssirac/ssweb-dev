"use client";

// 3D "coin" version of the SS brand mark: the logo texture on both faces, a
// glowing accent rim, a slow spin plus Float drift and a little mouse tilt.
// Isolated so three only loads in a lazy desktop chunk (see hero-logo-3d.tsx).

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";

const R = 0.9;

function Coin() {
  const tex = useTexture("/sslogo.jpg");
  tex.colorSpace = THREE.SRGBColorSpace;
  const grp = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = grp.current;
    if (!g) return;
    g.rotation.y += delta * 0.5; // slow, continuous spin
    const targetX = -state.pointer.y * 0.3; // subtle mouse tilt
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.06);
  });

  return (
    <Float speed={2} rotationIntensity={0.12} floatIntensity={0.6}>
      <group ref={grp}>
        {/* front face */}
        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[R, 64]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
        {/* back face — rotated so the logo reads correctly (not mirrored) */}
        <mesh position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[R, 64]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
        {/* glowing accent rim */}
        <mesh>
          <torusGeometry args={[R, 0.045, 20, 90]} />
          <meshStandardMaterial
            color="#4550F5"
            emissive="#4550F5"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function HeroLogo3DScene() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 3.6], fov: 34 }}
    >
      <ambientLight intensity={0.85} />
      <pointLight position={[3, 3, 4]} intensity={1.3} />
      <Suspense fallback={null}>
        <Coin />
      </Suspense>
    </Canvas>
  );
}
