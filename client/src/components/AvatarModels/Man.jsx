import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCharacterAnimations } from "../SLP/CharacterAnimations";
import * as THREE from "three";
import animationsData from "../../../public/glosses/gloss.json";

const Man = ({ props, animationKeyword, speed, showSkeleton, repeat, isPaused, updateCurrentAnimationName  = () => {} }) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("../../../public/models/man.glb");
  const { actions, names } = useAnimations(animations, group);

  const [animationQueue, setAnimationQueue] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [prevAnimationKeyword, setPrevAnimationKeyword] = useState(null);
  useEffect(() => {
    if (animationKeyword && animationKeyword !== prevAnimationKeyword) {
      const animationKeywords = animationKeyword.split(" "); // Split into individual words
      let newAnimationQueue = [];
  
      for (let i = animationKeywords.length; i >= 1; i--) {
        const combinedKeyword = animationKeywords.slice(0, i).join(" ").toUpperCase();
        const animationData = animationsData.find(item => item.keyword === combinedKeyword);
        
        if (animationData) {
          newAnimationQueue.push(...animationData.animations);
          // Remove the used keywords from animationKeywords array
          animationKeywords.splice(0, i);
          // Reset i to the length of the remaining keywords
          i = animationKeywords.length + 1;
        }
      }
  
      // Add remaining single keywords
      animationKeywords.forEach(keyword => {
        const singleKeyword = keyword.toUpperCase();
        const animationData = animationsData.find(item => item.keyword === singleKeyword);
        if (animationData) {
          newAnimationQueue.push(...animationData.animations);
        }
      });
  
      setAnimationQueue(newAnimationQueue);
      setCurrentAnimationIndex(0);
      setPrevAnimationKeyword(animationKeyword);
    }
  }, [animationKeyword, prevAnimationKeyword]);
    

  const onAnimationFinished = () => {
    if (currentAnimationIndex < animationQueue.length - 1) {
      setCurrentAnimationIndex(prevIndex => prevIndex + 1);
    } else if (repeat === "Yes") {
      setTimeout(() => {
        setAnimationQueue([]);
        setCurrentAnimationIndex(0);
        setPrevAnimationKeyword(null);
      }, 2000);
    }
  };
  useEffect(() => {
  
    const playNextAnimation = () => {
      const animationName = animationQueue[currentAnimationIndex];
      const currentAction = actions[animationName];
  
      if (currentAction) {
        // // Apply pause or unpause to all actions
        // Object.values(actions).forEach(action => {
        //   action.paused = true;
        // });
  
        // if (!isPaused) {
        //   Object.values(actions).forEach(action => {
        //     action.paused = false;
        //   });
          if (speed) {
            currentAction.setEffectiveTimeScale(speed);
          }
          currentAction.reset().fadeIn(0.5).play();
          currentAction.setLoop(THREE.LoopOnce, 1);
          currentAction.getMixer().addEventListener("finished", onAnimationFinished);
          currentAction.clampWhenFinished = true;
  
          updateCurrentAnimationName(animationName);
        // }
      }
    };
  
    playNextAnimation();
  
    return () => {
      const animationName = animationQueue[currentAnimationIndex];
      const currentAction = actions[animationName];
      if (currentAction) {
        currentAction.fadeOut(0.5);
        currentAction.getMixer().removeEventListener("finished", onAnimationFinished);
      }
    };
  }, [animationQueue, actions, currentAnimationIndex, speed, isPaused, repeat, updateCurrentAnimationName]);
  
  function getNumberOfFrames(action, frameRate) {
    const duration = action.getClip().duration; // Duration of the clip in seconds
    return Math.round(duration * frameRate);
  }

  useEffect(() => {
    const helper = new THREE.SkeletonHelper(group.current);
    if (showSkeleton) {
      helper.position.set(0, 100, 0); // Set the helper position coordinates (x, y, z)
      group.current.add(helper);
    } else if (!showSkeleton) {
      group.current.remove(helper);
    }
  }, [showSkeleton]);

  return (
    <group ref={group} {...props} position={[0, 0, 0]} dispose={null}>
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
