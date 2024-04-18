import "./Communication.css";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CharacterAnimationsProvider } from "../../components/SLP/CharacterAnimations";
import Experience from "../../components/SLP/Experience";
import Man from "../../components/AvatarModels/Man";

function Communication() {
  const [inputText, setInputText] = useState("");
  const [speed, setSpeed] = useState(1); // Initial speed value
  const [selectedOption, setSelectedOption] = useState("option1"); // Default selected option

  const handleMinus = () => {
    setSpeed((prevSpeed) => Math.max(prevSpeed - 0.2, 0)); // Decrease speed by 0.2, but ensure it doesn't go below 0
  };

  const handlePlus = () => {
    setSpeed((prevSpeed) => Math.min(prevSpeed + 0.2, 2)); // Increase speed by 0.2, but ensure it doesn't exceed 2
  };

  const handleReset = () => {
    setSpeed(1); // Reset speed to default value
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const submittedText = formData.get("sigmlUrl");
    setInputText(submittedText);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleBrowseLocalVideo = () => {
    // Code to browse local video file
    alert("Browse local video file")
  };

  const handleOpenCamera = () => {
    // Code to open camera
    alert("Open camera")
  };

  const handleSubmitVideo = () => {
    // Code to submit video
    alert("Submit video")
  };

  const handleResetVideo = () => {
    // Code to reset video
    alert("Reset video")
  }

  return (
    <div className="communication-body">
      <div className="container-wrapper">
        <div className="menu">
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="option1">SLP (Sign Language Production)</option>
            <option value="option2">SLR (Sign Language Recognition)</option>
          </select>
        </div>
        {selectedOption === "option1" && (
          <>
            <div className="sidebar-btns">
              <div className="hand-viewbtn">
                <button>
                  <img src="./images/handview.png" alt="Hand View" className="handviewbtn" />
                </button>
              </div>
              <div className="reset-viewbtn">
                <button>
                  <img src="./images/resetview.png" alt="Reset View" className="resetviewbtn" />
                </button>
              </div>
            </div>
            <div className="canvas-wrapper">
              <Canvas camera={{ position: [1, 55, 225], fov: 45 }} shadows>
                {/* Your 3D scene components */}
                <directionalLight intensity={1} color="white" position={[10, 10, 10]} />
                <CharacterAnimationsProvider>
                  <Experience />
                  <Man animationKeyword={inputText} speed={speed} />
                </CharacterAnimationsProvider>
              </Canvas>
            </div>
            <div className="content-wrapper">
              <div className="controls">
                <label htmlFor="avatarSelect">Avatar: Manuel</label>
              </div>
              <div className="speed-control">
                <label htmlFor="speedControl">Speed:</label>
                <input type="text" id="speedControl" name="speedControl" value={speed} disabled />
                <div className="buttons">
                  <button onClick={handleMinus}>-</button>
                  <button onClick={handlePlus}>+</button>
                  <button onClick={handleReset}>Reset</button>
                </div>
              </div>
              <div className="sigml">
                <form onSubmit={handleSubmit}>
                  <label htmlFor="sigmlUrl">TextBox:</label>
                  <input
                    type="text"
                    id="sigmlUrl"
                    name="sigmlUrl"
                    placeholder="Enter text here"
                    spellCheck="true"
                  />
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </>
        )}
        {selectedOption === "option2" && (
          <>
            <div className="SLR-output-container">
              <div className="SLR-output-wrapper">
                <div className="SLR-output">
                  <h3>SLR Output</h3>
                  <p>Output text here</p>
                </div>
              </div>
            </div>
            <div className="SLR-input-container">
              <div className="SLR-input-wrapper">
                <div className="button-row">
                  <button className="browse-local-video" onClick={handleBrowseLocalVideo}>Browse Local Video</button>
                  <button className="open-camera" onClick={handleOpenCamera}>Open Camera</button>
                </div>
                <div className="preview-info">
                  <p>Preview Info Here</p>
                </div>
                <div className="button-row">
                  <button className="reset-button" onClick={handleResetVideo}>Reset</button>
                  <button className="submit-video" onClick={handleSubmitVideo}>Submit Video</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Communication;
