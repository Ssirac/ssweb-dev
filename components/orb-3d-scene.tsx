"use client";

// Distorted, glowing, mouse-reactive orb (drei MeshDistortMaterial). Isolated
// so three loads in a lazy desktop-only chunk (see orb-3d.tsx).

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function Orb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += 0.003;
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, state.pointer.y * 0.45, 0.05);
    m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, state.pointer.x * 0.35, 0.05);
  });
  return (
    <Float speed={2} floatIntensity={1.1} rotationIntensity={0.3}>
      <mesh ref={mesh} scale={1.35}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          color="#4550F5"
          emissive="#4550F5"
          emissiveIntensity={0.35}
          distort={0.45}
          speed={2.2}
          roughness={0.22}
          metalness={0.55}
        />
      </mesh>
    </Float>
  );
}

export function Orb3DScene() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 3.2], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 5]} intensity={2.2} color="#8B93FF" />
      <pointLight position={[-4, -2, 2]} intensity={1.4} color="#4550F5" />
      <Orb />
    </Canvas>
  );
}
