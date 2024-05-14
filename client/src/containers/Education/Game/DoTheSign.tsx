import React, { useState, useRef, useEffect } from "react";
import RulesPopup from "../components/RulesPopup/RulesPopup";
import InnerSetting from "../components/InnerSetting/InnerSetting";
import VideoRecorder from "../components/RecordVideo/VideoRecorder";
import "./DoTheSign.css";
import backgroundMusic from "/music/gameMusic2.mp3";
import buttonClickedSound from "/music/btnClicked.wav";
import { useTranslation } from "react-i18next";

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
    const { t, i18n } = useTranslation();
    const [isInnerSettingOpen, setIsInnerSettingOpen] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [recordingStarted, setRecordingStarted] = useState(false); // State to track if recording has started
    const [countdown, setCountdown] = useState(20);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Function to start countdown timer
    const startCountdown = () => {
        recordingStarted;
        setRecordingStarted(true); // Set recording started flag
        timerRef.current = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 0) {
                    clearInterval(timerRef.current!); // Clear timer when countdown reaches 0
                    return 20; // Reset countdown value
                } else {
                    return prevCountdown - 1; // Decrement countdown
                }
            });
        }, 1000);
    };

    // Function to stop countdown timer
    const stopCountdown = () => {
        setRecordingStarted(false); // Set recording started flag to false
        if (timerRef.current) {
            clearInterval(timerRef.current); // Clear the timer interval
        }
    };

    // Function to format time as MM:SS
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

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
                        {t("rules")}
                    </button>
                    <button
                        className="shared-btn2 hint-btn2"
                        type="button"
                        onClick={() => {
                            playButtonClickedSound();
                        }}
                    >
                        {t("hint")}
                    </button>
                    <h1 className="level-title">{t("level")}</h1>
                    <h2 className="score-title">{t("score")}</h2>
                    <h3 className="timer-title">{formatTime(countdown)}</h3>
                    <button
                        className="shared-btn setting-btn3"
                        type="button"
                        onClick={() => {
                            playButtonClickedSound();
                            setIsInnerSettingOpen(true);
                        }}
                    >
                        <img
                            src="./images/setting.png"
                            alt="Setting"
                            width="30"
                            height="30"
                        />
                    </button>
                    {showRules && (
                        <RulesPopup
                            onClose={() => setShowRules(false)}
                            title={t("game_rules")}
                            rules={[
                                t("dts_rules1"),
                                t("dts_rules2"),
                                t("dts_rules3"),
                                t("dts_rules4"),
                                t("dts_rules5"),
                                t("dts_rules6"),
                                t("dts_rules7"),
                            ]}
                        />
                    )}
                    <div className="box-container">
                        <div className="left-box">Mata</div>
                        <div className="right-box">
                            <VideoRecorder
                                onStartRecording={startCountdown}
                                onStopRecording={stopCountdown}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Add audio player for background music */}
            <audio ref={audioRef} autoPlay loop>
                <source src={backgroundMusic} type="audio/mpeg" />
                {t("not_support_music")}
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
