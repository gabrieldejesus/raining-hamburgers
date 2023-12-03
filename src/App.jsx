/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { useGLTF, Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

const Burger = ({ z }) => {
  const ref = useRef();
  const { nodes, materials } = useGLTF("/burger.glb");

  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state) => {
    ref.current.rotation.set(
      (data.rX += 0.001),
      (data.rY += 0.001),
      (data.rZ += 0.001)
    );
    ref.current.position.set(data.x * width, (data.y += 0.025), z);

    if (data.y > height) {
      data.y = -height;
    }
  });

  return (
    <group ref={ref} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.bred_down001_Cylinder008.geometry}
          material={materials.PaletteMaterial002}
        />
        <mesh
          geometry={nodes.bred_down001_Cylinder008_1.geometry}
          material={materials.PaletteMaterial003}
        />
        <mesh
          geometry={nodes.bred_down001_Cylinder008_2.geometry}
          material={materials.PaletteMaterial004}
        />
        <mesh
          geometry={nodes.bred_down001_Cylinder008_3.geometry}
          material={materials.PaletteMaterial001}
        />
      </group>
    </group>
  );
};

useGLTF.preload("/burger.glb");

// 9FCEE2
export default function App() {
  const count = 100;
  const depth = 50;

  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }}>
      <color attach="background" args={["#6BBFE1"]} />

      <spotLight position={[10, 10, 10]} intensity={1} />

      <Suspense fallback={null}>
        <Environment preset="sunset" />

        {Array.from({ length: count }, (_, index) => (
          <Burger key={index} z={-(index / count) * depth - 20} />
        ))}

        <EffectComposer>
          <DepthOfField
            target={[0, 0, depth / 2]}
            focalLength={0.5}
            bokehScale={11}
            height={700}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
