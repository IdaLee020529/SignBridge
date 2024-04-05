import React, { useState, useRef, useEffect } from "react";
import RulesPopup from "../../../components/RulesPopup/RulesPopup";
import InnerSetting from "../../../components/InnerSetting/InnerSetting";
import "./DoTheSign.css";
import backgroundMusic from "/music/gameMusic2.mp3";
import buttonClickedSound from "/music/btnClicked.wav";
// import Webcam from "react-webcam";

// Function to play button clicked sound
const playButtonClickedSound = () => {
  const audio = new Audio(buttonClickedSound);
  audio.play();
};

// Function to update background music volume
const updateBackgroundMusicVolume = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  if (audioRef.current) {
    audioRef.current.volume = volume;
    updateBackgroundMusicVolume(volume);
  }
};

const DoTheSign: React.FC = () => {
  const [isInnerSettingOpen, setIsInnerSettingOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const updateBackgroundMusicVolume = (volume: number) => {
    if (audioRef.current) {
      const localVolumeValue = localStorage.getItem("volumeValue");
      if (localVolumeValue) {
        const volumeValue = parseInt(localVolumeValue, 10);
        audioRef.current.volume = volumeValue / 100;
      } else {
        audioRef.current.volume = volume;
      }
    }
  };

  useEffect(() => {
    updateBackgroundMusicVolume(1);
  }, []);

  return (
    <div className="do-the-sign-layout">
      <div className="do-the-sign-container">
        <div className="do-the-sign">
          <button
            className="shared-btn2 rules-btn2"
            type="button"
            onClick={() => {
              setShowRules(true);
              playButtonClickedSound();
            }}
          >
            Rules
          </button>
          <button
            className="shared-btn2 hint-btn2"
            type="button"
            onClick={() => {
              playButtonClickedSound();
            }}
          >
            Hint
          </button>
          <h1 className="level-title">Level</h1>
          <h2 className="score-title">Score: </h2>
          <h3 className="timer-title">00:00</h3>
          <button
            className="shared-btn setting-btn3"
            type="button"
            onClick={() => {
              playButtonClickedSound();
              setIsInnerSettingOpen(true);
            }}
          >
            <img src="./images/setting.png" alt="Setting" width="30" height="30"/>
          </button>
          {showRules && (
            <RulesPopup
              onClose={() => setShowRules(false)}
              title="Game Rules"
              rules={[
                "View the word prompt and start performing sign language gestures.",
                "Open the camera to record your sign language gesture, triggering a 20-second timer.",
                "After recording, have the option to upload the video.",
                "Perform sign language gestures accurately to earn points.",
                "Progress to the next level by correctly performing signs.",
                "Incorrect signs end the game.",
                "Your score is displayed at the end of the game.",
              ]}
            />
          )}
          <div className="box-container">
            <div className="left-box">Badan</div>
            <div className="right-box"></div>
          </div>
        </div>
      </div>
      {/* Add audio player for background music */}
      <audio ref={audioRef} autoPlay loop>
        <source src={backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {/* Render InnerSetting if isInnerSettingOpen is true */}
      {isInnerSettingOpen && (
        <InnerSetting
          onClose={() => setIsInnerSettingOpen(false)}
          onVolumeChange={updateBackgroundMusicVolume}
        />
      )}
    </div>
  );
};

export default DoTheSign;
