"use client";

// Scroll-driven 3D model showcase. Loads a .glb (drei useGLTF), auto-centers +
// normalises its scale, and rotates it by the scroll progress passed in from the
// wrapper (plus a little mouse tilt). Isolated → three loads in a lazy chunk.

import { MutableRefObject, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/pirate-captain.glb";

function Model({ progress }: { progress: MutableRefObject<number> }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);

  // clone + normalise scale so any model fits the frame
  const { object, scaleFactor } = useMemo(() => {
    const obj = scene.clone();
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { object: obj, scaleFactor: 2.2 / maxDim };
  }, [scene]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // always-on idle spin + float bob; scroll adds extra rotation on top
    g.rotation.y = t * 0.6 + progress.current * Math.PI * 3 + state.pointer.x * 0.4;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.2 + 0.05, 0.06);
    g.position.y = Math.sin(t * 1.4) * 0.12;
  });

  return (
    <group ref={group} scale={scaleFactor}>
      <Center>
        <primitive object={object} />
      </Center>
    </group>
  );
}

export function ScrollModelScene({ progress }: { progress: MutableRefObject<number> }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 42 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#6E76FF" />
      <Suspense fallback={null}>
        <Model progress={progress} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
