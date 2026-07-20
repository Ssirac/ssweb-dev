"use client";

// Interactive 3D scene (native Spline replacement): a distorted glowing orb
// orbited by floating low-poly shapes, all mouse-reactive. Isolated so three
// loads in a lazy desktop-only chunk (see orb-3d.tsx).

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
    <Float speed={2} floatIntensity={1} rotationIntensity={0.3}>
      <mesh ref={mesh} scale={1.1}>
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

function Shapes() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.25, 0.04);
  });
  return (
    <group ref={group}>
      <Float speed={3} rotationIntensity={1} floatIntensity={1.4}>
        <mesh position={[1.5, 0.7, -0.3]}>
          <icosahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial color="#8B93FF" emissive="#4550F5" emissiveIntensity={0.4} roughness={0.3} metalness={0.5} wireframe />
        </mesh>
      </Float>
      <Float speed={2.4} rotationIntensity={1} floatIntensity={1.2}>
        <mesh position={[-1.6, -0.5, 0.2]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#6E76FF" emissive="#4550F5" emissiveIntensity={0.35} roughness={0.25} metalness={0.6} />
        </mesh>
      </Float>
      <Float speed={2.8} rotationIntensity={1.2} floatIntensity={1.3}>
        <mesh position={[0.4, -1.5, -0.4]} rotation={[0.5, 0, 0]}>
          <torusGeometry args={[0.24, 0.09, 16, 48]} />
          <meshStandardMaterial color="#4550F5" emissive="#4550F5" emissiveIntensity={0.4} roughness={0.3} metalness={0.5} />
        </mesh>
      </Float>
      <Float speed={3.4} floatIntensity={1.5}>
        <mesh position={[-0.7, 1.5, 0.1]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color="#8B93FF" emissive="#6E76FF" emissiveIntensity={0.5} roughness={0.2} metalness={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

export function Orb3DScene() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 5]} intensity={2.2} color="#8B93FF" />
      <pointLight position={[-4, -2, 2]} intensity={1.4} color="#4550F5" />
      <Orb />
      <Shapes />
    </Canvas>
  );
}
