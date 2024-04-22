// Communication.jsx
import "./Communication.css"
import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { CharacterAnimationsProvider } from "../../components/SLP/CharacterAnimations";
import Experience from "../../components/SLP/Experience";
import Man from "../../components/AvatarModels/Man";

function Communication() {
  const [inputText, setInputText] = useState("");
  const [speed, setSpeed] = useState(1); // Initial speed value
  const [handFocus, setHandFocus] = useState(false); // State to track if view needs reset

  const handleMinus = () => {
    setSpeed((prevSpeed) => Math.max(prevSpeed - 0.2, 0)); // Decrease speed by 0.2, but ensure it doesn't go below 0
  };

  const handlePlus = () => {
    setSpeed((prevSpeed) => Math.min(prevSpeed + 0.2, 2)); // Increase speed by 0.2, but ensure it doesn't exceed 2
  };

  const handleSpeedReset = () => {
    setSpeed(1); // Reset speed to default value
  };
  const handleViewReset = () => {
    // Reset camera rotation, and zoom
    controls.current.reset();
  };

  const handleHandFocus = () => {
    setHandFocus(prevFocus => !prevFocus); // Toggle handFocus state
    controls.current.reset();
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const submittedText = formData.get("sigmlUrl");
    setInputText(submittedText);
  };

  const controls = useRef();

  return (
    <div className="communication-body">
      <div className="container-wrapper">
        <div className="menu">
          <select>
            <option value="option1">SLP (Sign Language Production)</option>
            <option value="option2">SLR (Sign Language Recognition)</option>
          </select>
        </div>
        <div className="control-panel">
          <div className="sidebar-btns">
            <div className="hand-viewbtn">
              <p>Hand Focus</p><button title="Hand Focus Mode" onClick={handleHandFocus} className={handFocus ? "handviewbtn-active" : "handviewbtn"}><img src="./images/handview.png" alt="Logo" /></button>
            </div>
            <div className="reset-viewbtn">
              <p>Reset camera</p><button title="Reset Camera" onClick={handleViewReset} className="resetviewbtn"><img src="./images/resetview.png" alt="Logo" /></button>
            </div>
          </div>
        </div>
        <div className="canvas-wrapper">
          <Canvas camera={{ position: [1, 55, 225], fov: 45 }}>
            {/* Your 3D scene components */}
            <directionalLight intensity={1} color="white" position={[10, 10, 10]} />
            <CharacterAnimationsProvider>
              <Experience />
              <Man animationKeyword={inputText} speed={speed} />
            </CharacterAnimationsProvider>
            <OrbitControls ref={controls} />
            {handFocus && <HandFocusMode />}
          </Canvas>
        </div>
        <div className="content-wrapper">
          <div className="avatar-details">
            <label className="avatar-labels" htmlFor="avatarSelect">Avatar Controls</label>
          </div>
          <div>
            <img className="avatar-icons" src="./images/manuelhead.png" alt="Logo" /><label className="avatar-detail-labels" htmlFor="avatarname">Avatar : Manuel</label>
          </div>
          <div>
            <img className="avatar-icons" src="./images/lefthand.png" alt="Logo" /><label className="avatar-detail-labels" htmlFor="vehicle1">Left-handed <i>(Mirrored)</i> </label>
            <input className="lefthand-box" type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
          </div>
          <img className="speedcontrol-img" src="./images/speedcontrol.png" alt="Logo" />
          <label className="speedcontrol-labels" htmlFor="speedControl">Speed:</label>
          <input className="speedcontrol-box" type="text" id="speedControl" name="speedControl" value={speed} disabled />
          <div className="speedcontrol-buttons">
            <button
              className={`speedcontrol-minus ${speed === 0 ? "disabled" : ""}`}
              onClick={handleMinus}
              disabled={speed === 0}
            >
              -
            </button>
            <button
              className={`speedcontrol-plus ${speed === 2 ? "disabled" : ""}`}
              onClick={handlePlus}
              disabled={speed === 2}
            >
              +
            </button>
            <button className="speedcontrol-reset" onClick={handleSpeedReset}>Reset</button>
          </div>
          <br />
          <div className="avatar-details">
              <label className="avatar-labels" htmlFor="sigmlUrl">Animation</label>
              <form onSubmit={handleSubmit}>
              <textarea
              className="avatar-textbox"
              id="sigmlUrl"
              name="sigmlUrl"
                placeholder="Enter text here"
                spellCheck="true"
              />
              <button type="submit">Submit</button>
              <button type="submit">Pause</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function HandFocusMode() {
  const { camera } = useThree();
  const x = -30; // Adjust these values according to your requirements
  const y = 40;
  const z = 100;
  const decimal = 1; // Adjust this value to control the speed of lerping

  useFrame(() => {
    camera.position.lerp({ x, y, z }, decimal);
    camera.lookAt(x, y, z);
  });

  return null;
}
export default Communication;
