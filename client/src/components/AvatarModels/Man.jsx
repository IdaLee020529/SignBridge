import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import animationsData from "../../../public/glosses/gloss.json";

const Man = ({
  props,
  animationKeyword,
  speed = 1,
  showSkeleton,
  repeat,
  isPaused,
  updateCurrentAnimationName = () => {},
}) => {
  const group = useRef();
  const skeletonHelperRef = useRef(null);
  const { nodes, materials, animations } = useGLTF("../../../public/models/man.glb");
  const { actions } = useAnimations(animations, group);

  const [animationQueue, setAnimationQueue] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [prevAnimationKeyword, setPrevAnimationKeyword] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  useEffect(() => {
    if (animationKeyword && animationKeyword !== prevAnimationKeyword) {
      // Replace any "+" with whitespace
      const sanitizedAnimationKeyword = animationKeyword.replace(/\+/g, ' ');
      const animationKeywords = sanitizedAnimationKeyword.split(" ");
      let newAnimationQueue = [];
  
      for (let i = animationKeywords.length; i >= 1; i--) {
        const combinedKeyword = animationKeywords.slice(0, i).join(" ").toUpperCase();
        const animationData = animationsData.find((item) => item.keyword === combinedKeyword);
  
        if (animationData) {
          newAnimationQueue.push(...animationData.animations);
          animationKeywords.splice(0, i);
          i = animationKeywords.length + 1;
        }
      }
  
      animationKeywords.forEach((keyword) => {
        const singleKeyword = keyword.toUpperCase();
        const animationData = animationsData.find((item) => item.keyword === singleKeyword);
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
      setCurrentAnimationIndex((prevIndex) => prevIndex + 1);
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
      const nextAction = actions[animationName];

      if (nextAction) {
        if (currentAction) {
          currentAction.fadeOut(0.5);
          currentAction.getMixer().removeEventListener("finished", onAnimationFinished);
        }

        if (speed) {
          nextAction.setEffectiveTimeScale(speed);
        }

        nextAction.reset().fadeIn(0.5).play();
        nextAction.setLoop(THREE.LoopOnce);
        nextAction.clampWhenFinished = true;
        nextAction.getMixer().addEventListener("finished", onAnimationFinished);

        setCurrentAction(nextAction);
        updateCurrentAnimationName(animationName);
      }
    };

    if (!isPaused && animationQueue.length > 0) {
      playNextAnimation();
    }

    return () => {
      if (currentAction) {
        currentAction.getMixer().removeEventListener("finished", onAnimationFinished);
      }
    };
  }, [animationQueue, currentAnimationIndex, actions, speed, isPaused, updateCurrentAnimationName]);

  useEffect(() => {
    if (currentAction) {
      currentAction.paused = isPaused;
    }
  }, [isPaused, currentAction]);

  useEffect(() => {
    if (showSkeleton && !skeletonHelperRef.current) {
      const helper = new THREE.SkeletonHelper(group.current);
      helper.position.set(0, 100, 0);
      group.current.add(helper);
      skeletonHelperRef.current = helper;
    } else if (!showSkeleton && skeletonHelperRef.current) {
      group.current.remove(skeletonHelperRef.current);
      skeletonHelperRef.current = null;
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
              frustumCulled={false}
            />
            <skinnedMesh
              name="Mesh003_1"
              geometry={nodes.Mesh003_1.geometry}
              material={materials.Tongue}
              skeleton={nodes.Mesh003_1.skeleton}
              frustumCulled={false}
            />
          </group>
        </group>
      </group>
    </group>
  );
};

export default Man;
