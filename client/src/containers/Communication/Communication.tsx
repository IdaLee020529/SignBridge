// Communication.jsx
import "./Communication.css"
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Link, useNavigate } from "react-router-dom";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Cookies from "js-cookie";
// @ts-ignore
import { CharacterAnimationsProvider } from "../../components/SLP/CharacterAnimations";
// @ts-ignore
import Experience from "../../components/SLP/Experience";
// @ts-ignore
import Man from "../../components/AvatarModels/Man";
import handImage from "../../../public/images/hand.png";
import handColoredImage from "../../../public/images/handcolored.png";
import BrowseLocalVideo from "../../components/SLR/BrowseLocalVideo/BrowseLocalVideo";
import OpenCameraRecord from "../../components/SLR/OpenCameraRecord/OpenCameraRecord";
function Communication() {
  const [activeButton, setActiveButton] = useState("SLP");
  const [inputText, setInputText] = useState("");
  const [speed, setSpeed] = useState(1);
  const [handFocus, setHandFocus] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [currentAnimationName, setCurrentAnimationName] = useState("");
  const [isPaused, setPaused] = useState(false);
  const [leftHandedMode, setLeftHandedMode] = useState(false);
  const [fps, setFps] = useState(60); // State to hold FPS value
  const [videoInfo, setVideoInfo] = useState(null);
  const [resetVideo, setResetVideo] = useState(false);

  const handleVideoReset = () => {
    setResetVideo(true); // Reset resetVideo state
  };

  // @ts-ignore
  const handleButtonValue = (event) => {
    const { value } = event.target;
    setActiveButton(event.target.value);
  };

  // @ts-ignore
  const isButtonActive = (buttonValue) => {
    return activeButton === buttonValue;
  };

  // @ts-ignore
  const updateFPS = (newFPS) => {
    setFps(newFPS); // Update FPS state
  };

  // @ts-ignore
  const updateCurrentAnimationName = (animationName) => {
    setCurrentAnimationName(animationName);
  };

  const isUserLoggedIn = () => {
    return Cookies.get("token") ? true : false;
  };

  const isLoggedIn = isUserLoggedIn();

  const toggleSkeleton = () => {
    setShowSkeleton((prevState) => !prevState);
  };

  const handleViewReset = () => {
    // @ts-ignore
    controls.current.reset();
  };

  // @ts-ignore
  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);
  };

  const handleHandFocus = () => {
    setHandFocus((prevFocus) => !prevFocus);
    // @ts-ignore
    controls.current.reset();
  };

  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const submittedText = formData.get("sigmlUrl") as string; // Prevent null value

    try {
      const response = await fetch('http://127.0.0.1:5000/api/SLP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: submittedText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (inputText === submittedText) {
          // If they are the same, append "#" to the submitted text
          setInputText(data['return'] + "#");
        } else {
          // If they are different, update the inputText directly
          setInputText(data['return']);
        }
      } else {
        console.error('Failed to process text');
      }
    } catch (error) {
      console.error('Error processing text: ', error);
    }
  };

  // Function to toggle left-handed mode
  const toggleLeftHandedMode = () => {
    setLeftHandedMode(prevMode => !prevMode);
  };

  const togglePause = () => {
    setPaused((prevState) => !prevState);
  };

  const controls = useRef();

  return (
    <div className={`communication-body ${leftHandedMode ? "left-handed" : ""}`}>
      <div className="container-wrapper">
        <div className="communication-menu">
          <button
            value="SLP"
            onClick={handleButtonValue}
            className={isButtonActive("SLP") ? "active" : ""}
          >
            Sign Language Production (SLP)
          </button>
          <button
            value="SLR"
            onClick={handleButtonValue}
            className={isButtonActive("SLR") ? "active" : ""}
          >
            Sign Language Recognition (SLR)
          </button>
          <div className={`animation ${isButtonActive("SLR") ? "start-about" : "start-home"}`}></div>
        </div>
        {activeButton === "SLP" && (
          <>
            <nav className="sidebar-navigation">
              <ul>
                <li onClick={handleHandFocus} className={handFocus ? "active" : ""}>
                  <img src={handFocus ? handColoredImage : handImage} alt="hand" className="sidebar-btn" />
                  <span className="tooltip">Hand focus mode</span>
                </li>
                <li onClick={handleViewReset}>
                  <img src="./images/resetview.png" className="sidebar-btn" />
                  <span className="tooltip">Reset zoom</span>
                </li>
                <li>
                  <span className="tooltip">None</span>
                </li>
              </ul>
            </nav>
            <div className="canvas-wrapper">
              <Canvas camera={{ position: [0, 0, 225], fov: 55 }}>
                <directionalLight intensity={1} color="white" position={[10, 10, 10]} />
                <CharacterAnimationsProvider>
                  <Experience />
                  <Man
                    animationKeyword={inputText}
                    speed={speed}
                    showSkeleton={showSkeleton}
                    repeat={"Yes"}
                    isPaused={isPaused}
                    updateCurrentAnimationName={updateCurrentAnimationName}
                  />
                </CharacterAnimationsProvider>
                <FPSCounter onUpdateFPS={updateFPS} />
                {/*// @ts-ignore*/}
                <OrbitControls ref={controls} />
                {handFocus && <HandFocusMode />}
              </Canvas>
            </div>
            {isLoggedIn ? (
              <button className="communicationlog-btn">
                <img src="./images/history.png" className="communicationlog-img" />
              </button>
            ) : (
              <a></a>
            )}
            <div className="content-wrapper">
              <h1 className="communication-h1">Avatar Control</h1>
              <div className="communication-toprow">
                <button onClick={toggleLeftHandedMode} className="avatarcontrol-btn">
                  Left-Hand Mode
                  <img src="./images/lefthandmode.png" className="avatarcontrol-img" />
                </button>
                <button className="avatarcontrol-btn" onClick={() => setShowSkeleton((prevState) => !prevState)}>
                  {showSkeleton ? "Hide Skeleton" : "Show Skeleton"}
                  <img src="./images/skeleton.png" className="avatarcontrol-img" />
                </button>
                <button className="avatarcontrol-btn">Ambient</button>
              </div>
              <div className="speed-control">
                <span className="speed-span">Speed : </span>
                <input type="range" className="speed-slider" min="0.2" max="2" step="0.2" value={speed} onChange={handleSpeedChange} />
                <input type="text" className="speed-textbox" value={speed} readOnly />
              </div>
              <div className="communication-middlerow">
                <form onSubmit={handleSubmit}>
                  <textarea className="avatar-textbox" id="sigmlUrl" name="sigmlUrl" placeholder="Enter text here" spellCheck="true" />
                  <button className="avatarplay-btn" type="submit">
                    Play
                  </button>
                  <button className="avatarpause-btn" onClick={togglePause} type="button">
                    {isPaused ? "Unpause" : "Pause"}
                  </button>
                </form>
              </div>
              <hr />
              <h1 className="communication-h1">Stats</h1>
              <div className="communication-bottomrow">
                <span>FPS : </span>
                <input className="fps-box" type="text" value={fps} readOnly />
                <span>Sign / Frame : </span>
                <input className="frame-box" type="text" placeholder="0 / 15" />
                <span>Gloss : </span>
                <input className="gloss-box" type="text" placeholder="None" value={currentAnimationName} readOnly />
              </div>
              <div className="status-row">
                <span>Status : </span>
                <input className="status-box" type="text" placeholder="Playing Sign" />
              </div>
            </div>
          </>
        )}
        {activeButton === "SLR" && (
          <>
            <div className="content-wrapper">
              <BrowseLocalVideo />
              <OpenCameraRecord />
            </div>
            <div className="content-wrapper">
              <h1 className="communication-h1">Generated Sentence</h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function HandFocusMode() {
  const { camera } = useThree();
  const x = -35; // Adjust these values according to your requirements
  const y = 150;
  const z = 100;
  const decimal = 1; // Adjust this value to control the speed of lerping

  useFrame(() => {
    camera.position.lerp({ x, y, z }, decimal);
    camera.lookAt(x, y, z);
  });

  return null;
}

// @ts-ignore
function FPSCounter({ onUpdateFPS }) {
  const frameRef = useRef({ lastTime: performance.now(), frameCount: 0 });

  useFrame(() => {
    const now = performance.now();
    const delta = now - frameRef.current.lastTime;
    frameRef.current.frameCount++;

    if (delta >= 1000) {
      const newFPS = Math.round((frameRef.current.frameCount * 1000) / delta);
      onUpdateFPS(newFPS); // Call the passed callback with the new FPS
      frameRef.current.frameCount = 0;
      frameRef.current.lastTime = now;
    }
  });

  return null; // No need to return anything as DOM updates are handled by the parent
}

export default Communication;