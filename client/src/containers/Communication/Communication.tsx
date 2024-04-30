// Communication.jsx
import "./Communication.css"
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Link, useNavigate } from "react-router-dom";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
// @ts-ignore
import { CharacterAnimationsProvider } from "../../components/SLP/CharacterAnimations";
// @ts-ignore
import Experience from "../../components/SLP/Experience";
// @ts-ignore
import Man from "../../components/AvatarModels/Man";
import handImage from "../../../public/images/hand.png";
import handColoredImage from "../../../public/images/handcolored.png";

function Communication() {
  const [inputText, setInputText] = useState("");
  const [speed, setSpeed] = useState(1); // Initial speed value
  const [handFocus, setHandFocus] = useState(false); // State to track if view needs reset
  const [showSkeleton, setShowSkeleton] = useState(false);

  const toggleSkeleton = () => {
    setShowSkeleton(prevState => !prevState);
  };
  
  const handleViewReset = () => {
    // Reset camera rotation, and zoom
    // @ts-ignore
    controls.current.reset();
  };

  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);
  };

  const handleHandFocus = () => {
    setHandFocus(prevFocus => !prevFocus); // Toggle handFocus state
    // @ts-ignore
    controls.current.reset();
  };
  
  // @ts-ignore
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const submittedText = formData.get("sigmlUrl");
    // Check if submittedText is the same as the value from the form data
    if (inputText === submittedText) {
      // If they are the same, append "#" to the submitted text
      setInputText(submittedText + "#");
    } else {
      // If they are different, update the inputText directly
      setInputText(submittedText);
    }
  };
  
  const [leftHandedMode, setLeftHandedMode] = useState(false);

  // Function to toggle left-handed mode
  const toggleLeftHandedMode = () => {
    setLeftHandedMode(prevMode => !prevMode);
  };

  const controls = useRef();
  return (
    <div className={`communication-body ${leftHandedMode ? "left-handed" : ""}`}>
      <div className="container-wrapper">
      <div className="communication-menu">
  <Link to="/communication"><a href="#">Sign Language Production (SLP)</a></Link>
  <Link to="/education"><a href="#">Sign Language Recognition (SLR)</a></Link>
  <div className="animation start-home"></div>
</div>
<nav className="sidebar-navigation">
        <ul>
          <li
            onClick={handleHandFocus}
            className={handFocus ? "active" : ""}
          >
            <img
              src={handFocus ? handColoredImage : handImage}
              alt="hand"
              className="sidebar-btn"
            />
            <span className="tooltip">Hand focus mode</span>
          </li>
          <li onClick={handleViewReset}>
          <img
              src="./images/resetview.png"
              className="sidebar-btn"
            />
              <span className="tooltip">Reset zoom</span>
            </li>
            <li>
              <span className="tooltip">None</span>
            </li>
        </ul>
      </nav>
        <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 225], fov: 55 }}>
            {/* Your 3D scene components */}
            <directionalLight intensity={1} color="white" position={[10, 10, 10]} />
            <CharacterAnimationsProvider>
              <Experience />
          {/* <CameraControl /> */}
              <Man animationKeyword={inputText} speed={speed} showSkeleton={showSkeleton} repeat={"No"}  />
            </CharacterAnimationsProvider>
            {/*@ts-ignore*/} 
            <OrbitControls ref={controls}/>
            {handFocus && <HandFocusMode />}
          </Canvas>
        </div>
        <button className="communicationlog-btn">      <img
              src="./images/history.png"
              className="communicationlog-img"
            /></button>
           {/* <span className="tooltip">Communication history</span> */}
        <div className="content-wrapper">
        <h1 className="communication-h1">Avatar Control</h1>
        <div className="communication-toprow">
        <button onClick={toggleLeftHandedMode} className="avatarcontrol-btn">Left-Hand Mode       <img
              src="./images/lefthandmode.png"
              className="avatarcontrol-img"
            /></button>
        <button className="avatarcontrol-btn" onClick={() => setShowSkeleton(prevState => !prevState)}>
  {showSkeleton ? "Hide Skeleton" : "Show Skeleton"}
      <img
              src="./images/skeleton.png"
              className="avatarcontrol-img"
            /></button>
          <button className="avatarcontrol-btn">Ambient       <img
              src="./images/ambient.png"
              className="avatarcontrol-img"
            /></button>
          </div>
          <div className="speed-control"> 
          <span className="speed-span">Speed : </span>
          <input
        type="range"
        className="speed-slider"
        min="0.2"
        max="2"
        step="0.2"
        value={speed} // Set the value of the slider to the current speed
        onChange={handleSpeedChange} // Update speed when slider value changes
      />
      <input
        type="text"
        className="speed-textbox"
        value={speed}
        readOnly
      />
          </div>
          <div className="communication-middlerow">
          <form onSubmit={handleSubmit}>
          <textarea
              className="avatar-textbox"
              id="sigmlUrl"
              name="sigmlUrl"
                placeholder="Enter text here"
                spellCheck="true"
              />
              <button className="avatarplay-btn" type="submit">Play</button>
              <button className="avatarpause-btn" type="submit">Pause</button>
              </form>
              </div>
              <hr/>
              <h1 className="communication-h1">Stats</h1>
              <div className="communication-bottomrow">
                <span>FPS : </span>
          <input className="fps-box" type="text" placeholder="60"/>
          <span>Sign / Frame : </span>
          <input className="frame-box" type="text" placeholder="0 / 15"/>
          <span>Gloss : </span>
          <input className="gloss-box" type="text" placeholder="Penat"/>
                </div>
                <div className="status-row">
                <span>Status : </span>
          <input className="status-box" type="text" placeholder="Playing Sign"/>
          </div>
              
        </div>
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

function CameraControl() {
  const { camera } = useThree();

  const x = -7.5; // Adjust these values according to your requirements
  const y = 110;
  const z = 215;
  const decimal = 1; // Adjust this value to control the speed of lerping

  useFrame(() => {
    camera.position.lerp({ x, y, z }, decimal);
    camera.lookAt(x, y, z);
  });

  return null;
}

export default Communication;
