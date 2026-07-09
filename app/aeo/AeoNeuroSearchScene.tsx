"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type AeoNeuroSearchSceneProps = {
  reducedMotion: boolean;
};

const semanticLayers: Array<{
  label: string;
  position: [number, number, number];
  accent?: boolean;
}> = [
  { label: "вопрос клиента", position: [-2.88, 1.45, 0.62] },
  { label: "короткий ответ", position: [2.64, 1.14, 0.72], accent: true },
  { label: "доказательство", position: [-2.68, -1.32, 0.72] },
  { label: "заявка", position: [2.44, -1.55, 0.72], accent: true }
];

export function AeoNeuroSearchScene({ reducedMotion }: AeoNeuroSearchSceneProps) {
  return (
    <Canvas
      className="aeo-neuro-canvas"
      data-aeo-neuro-canvas
      role="img"
      aria-label="3D-сцена с браузером, поисковым вопросом клиента и нейро-выдачей AEO"
      camera={{ position: [0, 0.6, 7], fov: 42 }}
      dpr={[1, 1.75]}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.78} />
      <directionalLight position={[3.5, 5, 4]} intensity={1.25} />
      <pointLight position={[-3.4, 2.1, 2.6]} intensity={1.8} color="#ff5a1f" />
      <SceneContent reducedMotion={reducedMotion} />
    </Canvas>
  );
}

function SceneContent({ reducedMotion }: AeoNeuroSearchSceneProps) {
  const browserRef = useRef<THREE.Group | null>(null);
  const pulseRef = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (reducedMotion) {
      return;
    }

    const time = state.clock.elapsedTime;

    if (browserRef.current) {
      browserRef.current.rotation.y = -0.16 + Math.sin(time * 0.42) * 0.045;
      browserRef.current.rotation.x = -0.075 + Math.sin(time * 0.36) * 0.018;
      browserRef.current.position.y = Math.sin(time * 0.7) * 0.045;
    }

    if (pulseRef.current) {
      pulseRef.current.scale.setScalar(1 + Math.sin(time * 2.4) * 0.035);
      pulseRef.current.rotation.z = time * 0.12;
    }
  });

  return (
    <>
      <group ref={browserRef} position={[0, 0, 0]} rotation={[-0.075, -0.16, 0.018]}>
        <RoundedBox args={[5.22, 3.22, 0.18]} radius={0.08} smoothness={5}>
          <meshStandardMaterial color="#ffffff" roughness={0.58} metalness={0.04} />
        </RoundedBox>

        <RoundedBox args={[5.22, 0.42, 0.2]} radius={0.08} smoothness={5} position={[0, 1.4, 0.055]}>
          <meshStandardMaterial color="#101010" roughness={0.72} metalness={0.08} />
        </RoundedBox>

        <RoundedBox args={[4.54, 2.34, 0.08]} radius={0.08} smoothness={5} position={[0, -0.12, 0.14]}>
          <meshStandardMaterial color="#fbfbfa" roughness={0.64} />
        </RoundedBox>

        <mesh ref={pulseRef} position={[1.64, 0.08, 0.24]}>
          <ringGeometry args={[1.0, 1.07, 64]} />
          <meshBasicMaterial color="#ff5a1f" transparent opacity={0.34} depthWrite={false} />
        </mesh>

        <RoundedBox args={[0.68, 0.13, 0.08]} radius={0.04} smoothness={3} position={[-2.18, 1.4, 0.23]}>
          <meshStandardMaterial color="#ff5a1f" roughness={0.54} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[2.15, 0.12, 0.08]} radius={0.04} smoothness={3} position={[0.04, 1.4, 0.23]}>
          <meshStandardMaterial color="#ffffff" roughness={0.54} metalness={0.08} />
        </RoundedBox>
        <RoundedBox args={[3.84, 0.62, 0.08]} radius={0.06} smoothness={4} position={[0, 0.5, 0.23]}>
          <meshStandardMaterial color="#fff7f2" roughness={0.62} metalness={0.04} />
        </RoundedBox>
        <RoundedBox args={[3.4, 0.16, 0.07]} radius={0.04} smoothness={3} position={[0, -0.08, 0.24]}>
          <meshStandardMaterial color="#101010" roughness={0.68} metalness={0.04} />
        </RoundedBox>
        <RoundedBox args={[3.6, 0.52, 0.08]} radius={0.06} smoothness={4} position={[0, -0.78, 0.23]}>
          <meshStandardMaterial color="#ffffff" roughness={0.58} metalness={0.04} />
        </RoundedBox>
      </group>

      <group position={[0, 0, -0.08]}>
        <RoundedBox args={[3.9, 0.045, 0.045]} radius={0.02} smoothness={3} position={[-0.44, 0.88, 0.36]} rotation={[0, 0, 0.12]}>
          <meshBasicMaterial color="#ff5a1f" transparent opacity={0.35} />
        </RoundedBox>
        <RoundedBox args={[3.5, 0.045, 0.045]} radius={0.02} smoothness={3} position={[0.2, -1.02, 0.36]} rotation={[0, 0, -0.1]}>
          <meshBasicMaterial color="#101010" transparent opacity={0.22} />
        </RoundedBox>
      </group>

      {semanticLayers.map((layer, index) => (
        <SemanticLayer key={layer.label} layer={layer} index={index} reducedMotion={reducedMotion} />
      ))}

      <mesh position={[0, -1.92, -0.24]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.2, 4.2]} />
        <meshBasicMaterial color="#080808" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <ContactShadows position={[0, -1.76, 0]} opacity={0.34} scale={7.2} blur={2.2} far={4.2} resolution={256} />
    </>
  );
}

function SemanticLayer({
  layer,
  index,
  reducedMotion
}: {
  layer: (typeof semanticLayers)[number];
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <Float
      speed={reducedMotion ? 0 : 1.35 + index * 0.12}
      floatIntensity={reducedMotion ? 0 : 0.18}
      rotationIntensity={reducedMotion ? 0 : 0.18}
    >
      <group position={layer.position} rotation={[0.08, index % 2 === 0 ? 0.12 : -0.1, 0]}>
        <RoundedBox args={[1.22, 0.34, 0.14]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={layer.accent ? "#ff5a1f" : "#101010"} roughness={0.62} metalness={0.08} />
        </RoundedBox>
        <RoundedBox args={[0.72, 0.07, 0.04]} radius={0.03} smoothness={3} position={[0, 0, 0.11]}>
          <meshBasicMaterial color={layer.accent ? "#ffffff" : "#ff5a1f"} transparent opacity={0.62} />
        </RoundedBox>
      </group>
    </Float>
  );
}
