import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

// import Woman from "./Woman";
import Man from "../AvatarModels/Man";
const Experience = () => {
  const controls = useRef();
  const { camera } = useThree();

  // Set up camera controls and limits
  useFrame(() => {
    controls.current.update();
  });

  return (
    <>
      <OrbitControls
        ref={controls}
        camera={camera}
        zoomSpeed={3}
        minPolarAngle={Math.PI / 2.5} // Set minimum angle (in radians)
        maxPolarAngle={Math.PI / 2.5} // Set maximum angle (in radians)
      />
      <ambientLight />
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <group position={[0, -1, 0]}>
        <Man />
      </group>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 1, 1]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};

export default Experience;