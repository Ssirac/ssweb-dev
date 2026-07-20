"use client";

// The walking character itself. Static model → procedural walk (step bob +
// waddle) and it turns to face its travel direction. Isolated → lazy chunk.

import { MutableRefObject, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

const URL = "/models/mc-walker.glb";

function Character({ dir }: { dir: MutableRefObject<number> }) {
  const { scene } = useGLTF(URL);
  const g = useRef<THREE.Group>(null);

  const { object, scaleFactor } = useMemo(() => {
    const obj = scene.clone();
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { object: obj, scaleFactor: 1.5 / maxDim };
  }, [scene]);

  useFrame((state) => {
    const grp = g.current;
    if (!grp) return;
    const t = state.clock.elapsedTime;
    // turn to face the travel direction (3/4 view)
    grp.rotation.y = THREE.MathUtils.lerp(grp.rotation.y, dir.current * -0.85, 0.12);
    grp.position.y = Math.abs(Math.sin(t * 7)) * 0.1; // centered step bob
    grp.rotation.z = Math.sin(t * 7) * 0.05; // waddle
  });

  return (
    <group ref={g} scale={scaleFactor}>
      <Center>
        <primitive object={object} />
      </Center>
    </group>
  );
}

export function MinecraftWalkerScene({ dir }: { dir: MutableRefObject<number> }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 4.6], fov: 38 }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <Suspense fallback={null}>
        <Character dir={dir} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(URL);
