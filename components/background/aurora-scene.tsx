"use client";

// Subtle animated aurora — a fullscreen fragment shader (fbm noise bands in
// the brand accent). Rendered as a camera-independent fullscreen quad.

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.04;
    float n = fbm(uv * 3.0 + vec2(t, t * 0.6));
    float bands = smoothstep(0.35, 0.95, fbm(vec2(uv.x * 2.0 + t, uv.y * 3.0 - t * 0.5)));
    vec3 c1 = vec3(0.27, 0.31, 0.96); // #4550F5
    vec3 c2 = vec3(0.45, 0.48, 1.0);
    vec3 col = mix(c1, c2, n) * bands;
    // strongest toward the top, gently fading down; kept subtle
    float alpha = bands * 0.22 * smoothstep(0.0, 0.65, uv.y);
    gl_FragColor = vec4(col, alpha);
  }
`;

function Plane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, delta) => {
    if (mat.current) mat.current.uniforms.uTime.value += delta;
  });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function AuroraScene() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1] }}
    >
      <Plane />
    </Canvas>
  );
}
