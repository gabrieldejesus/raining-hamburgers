/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { useGLTF, Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

const Burger = ({ z, index, speed }) => {
  const ref = useRef();
  const { nodes, materials } = useGLTF("/burger.glb");

  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height * 2),
    spin: THREE.MathUtils.randFloat(8, 12),
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state, delta) => {
    if (delta < 0.1) {
      ref.current.position.set(
        index === 0 ? 0 : data.x * width,
        (data.y += delta * speed),
        -z
      );
    }

    ref.current.rotation.set(
      (data.rX += delta / data.spin),
      Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI,
      (data.rZ += delta / data.spin)
    );

    if (data.y > height * (index === 0 ? 4 : 1)) {
      data.y = -(height * (index === 0 ? 4 : 1));
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

export default function App() {
  const speed = 1;
  const count = 150;
  const depth = 80;
  const easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2));

  return (
    <main className="main">
      <img src="/flint.png" alt="Flint" className="flint" />

      <Canvas
        className="canvas"
        gl={{ alpha: false }}
        camera={{ near: 0.01, far: 110, fov: 30 }}
      >
        <color attach="background" args={["#6BBFE1"]} />

        <spotLight position={[10, 10, 10]} intensity={1} />

        <Suspense fallback={null}>
          <Environment preset="sunset" />

          {Array.from({ length: count }, (_, index) => (
            <Burger
              key={index}
              index={index}
              z={Math.round(easing(index / count) * depth)}
              speed={speed}
            />
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
    </main>
  );
}
