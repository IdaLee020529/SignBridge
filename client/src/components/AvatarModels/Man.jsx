import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCharacterAnimations } from "../SLP/CharacterAnimations";
import * as THREE from "three";
import animationsData from "../../../public/glosses/gloss.json";

const Man = ({props, animationKeyword, speed}) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("../../../public/models/man.glb");
  const { setAnimations, animationIndex } = useCharacterAnimations();
  const { actions, names } = useAnimations(animations, group);

  const [animationQueue, setAnimationQueue] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  useEffect(() => {
    setAnimations(names);
  }, [names]);
    
    useEffect(() => {
      if (animationKeyword) {
        const animationKeywordUpper = animationKeyword.toLocaleUpperCase(); // Convert to uppercase
        const newAnimationQueue = animationsData[animationKeywordUpper] || [];
        setAnimationQueue(newAnimationQueue);
        setCurrentAnimationIndex(0);
      }
    }, [animationKeyword]);
  

  const onAnimationFinished = () => {
    const animationName = animationQueue[currentAnimationIndex];
    const currentAction = actions[animationName];


    // Play the next animation if there are more in the queue
    if (currentAnimationIndex < animationQueue.length - 1) {
      setCurrentAnimationIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    const playNextAnimation = () => {
      const animationName = animationQueue[currentAnimationIndex];
      const currentAction = actions[animationName];

      if (currentAction) {
        if(speed){
          currentAction.setEffectiveTimeScale(speed);
        }
        if (currentAnimationIndex < animationQueue.length - 1) {
          const nextAnimationName = animationQueue[currentAnimationIndex + 1];
          const nextAction = actions[nextAnimationName];

        }

          currentAction.reset().fadeIn(0.5).play();
          currentAction.setLoop(THREE.LoopOnce, 1);
          currentAction.getMixer().addEventListener("finished", onAnimationFinished);
          currentAction.clampWhenFinished = true;
      }
    };

    playNextAnimation();


    // Cleanup function
    return () => {
      const animationName = animationQueue[currentAnimationIndex];
      const currentAction = actions[animationName];
      if (currentAction) {
        currentAction.fadeOut(0.5);
        currentAction.getMixer().removeEventListener("finished", onAnimationFinished);
      }
    };
  }, [animationQueue, actions, currentAnimationIndex]);

  return (
    <group ref={group} {...props} position={[7.5, -105, 0]} dispose={null}>
      <group name="Scene">
        <group name="Armature001" rotation={[1.829, 0, 0]}>
          <primitive object={nodes.root} />
          <primitive object={nodes.Bone} />
          <group name="rp_manuel_animated_001_dancing_geo">
            <skinnedMesh
              name="Mesh003"
              geometry={nodes.Mesh003.geometry}
              material={materials["rp_manuel_animated_001_mat.005"]}
              skeleton={nodes.Mesh003.skeleton}
              frustumCulled={false} // Set frustumCulled to false
            />
            <skinnedMesh
              name="Mesh003_1"
              geometry={nodes.Mesh003_1.geometry}
              material={materials.Tongue}
              skeleton={nodes.Mesh003_1.skeleton}
              frustumCulled={false} // Set frustumCulled to false
            />
          </group>
        </group>
      </group>
    </group>
  );
};

export default Man;

useGLTF.preload("./models/man.glb");
