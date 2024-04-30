import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import buttonClickedSound from "/music/btnClicked.wav";
import noUiSlider from "nouislider";
import wNumb from "wnumb";
import "nouislider/dist/nouislider.css";
import "./InnerSetting.css";

interface SettingPopupProps {
  onClose: () => void;
  onVolumeChange: (volume: number) => void;
}

const SettingPopup: React.FC<SettingPopupProps> = ({
  onClose,
  onVolumeChange,
}) => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem("volumeValue");
    return storedVolume ? parseInt(storedVolume, 10) : 100;
  });

  const playButtonClickedSound = () => {
    const audio = new Audio(buttonClickedSound);
    audio.play();
  };

  const ambientSliderRef = useRef<HTMLDivElement | null>(null);
  // @ts-ignore
  const ambientSlider = useRef<noUiSlider.API | null>(null);

  useEffect(() => {
    const ambientSliderElement = ambientSliderRef.current;
    if (ambientSliderElement) {
      const formatOptions = { decimals: 0 };
      if (ambientSlider.current !== null) {
        ambientSlider.current.destroy();
      }
      ambientSlider.current = noUiSlider.create(ambientSliderElement, {
        start: [volume],
        behaviour: "snap",
        animate: true,
        animationDuration: 300,
        orientation: "horizontal",
        connect: [true, false],
        step: 5,
        range: {
          min: [0],
          max: [100],
        },
        format: wNumb(formatOptions),
      });
      ambientSlider.current.on("slide", (values: string[]) => {
        const newVolume = parseInt(values[0]);
        setVolume(newVolume);
        onVolumeChange(newVolume / 100);
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      localStorage.setItem("volumeValue", volume.toString());
    };
  }, [onClose, onVolumeChange, volume]);

  return (
    <div className="setting-container2">
      <div ref={popupRef} className="setting-content2">
        <h3>Setting</h3>
        <button
          className="close_btn_pushable"
          role="button"
          onClick={() => {
            onClose();
            playButtonClickedSound();
          }}
        >
          <span className="close_btn_shadow"></span>
          <span className="close_btn_edge"></span>
          <span className="close_btn_front text">
            <i className="fa fa-close"></i>
          </span>
        </button>
        <div className="setting-details2">
          <h4 className="volume-title">Music Volume:</h4>
          <div className="game-volume-bar-container">
            <div className="slider-layout">
              <i className="fa fa-volume-down"></i>
              <div
                ref={ambientSliderRef}
                id="ambient-volume"
                className="volume-slider"
              />
              <i className="fa fa-volume-up"></i>
            </div>
            <div
              className="slider-value-label float-left"
              id="ambient-volume-label"
            >
              {volume}
            </div>
            <button
              className="quit-btn"
              type="button"
              onClick={() => {
                navigate("/education");
                playButtonClickedSound();
              }}
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;