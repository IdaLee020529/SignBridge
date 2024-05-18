import React, { useState, useRef, useEffect } from "react";
import RulesPopup from "../components/RulesPopup/RulesPopup";
import HintPopup from "../components/HintPopup/HintPopup";
import InnerSetting from "../components/InnerSetting/InnerSetting";
import VideoRecorder from "../components/RecordVideo/VideoRecorder";
import "./DoTheSign.css";
import backgroundMusic from "/music/gameMusic2.mp3";
import buttonClickedSound from "/music/btnClicked.wav";
import correctAnswerSound from "/music/correctMusic.mp3";
import wrongAnswerSound from "/music/wrongMusic.mp3";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface GlossAnimation {
    keyword: string;
    animations: string[];
    category: string;
}

const playButtonClickedSound = () => {
    const audio = new Audio(buttonClickedSound);
    audio.play();
};

const playCorrectAnswerSound = () => {
    const audio = new Audio(correctAnswerSound);
    audio.play();
};

const playWrongAnswerSound = () => {
    const audio = new Audio(wrongAnswerSound);
    audio.play();
};

const loadAnimationKeywords = async (): Promise<GlossAnimation[] | null> => {
    try {
        const response = await fetch("/glosses/gloss.json");
        if (!response.ok) {
            throw new Error(
                `Failed to fetch: ${response.status} ${response.statusText}`
            );
        }
        const data: GlossAnimation[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load animation keywords:", error);
        return null;
    }
};

const pickRandomKeyword = async (
    setAnimationKeyword: React.Dispatch<React.SetStateAction<string>>
) => {
    const data = await loadAnimationKeywords();

    if (data) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomKeyword = data[randomIndex].keyword;

        // Format each word to have the first letter capitalized
        const formattedKeyword = randomKeyword
            .split(" ")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");

        setAnimationKeyword(formattedKeyword); // Set the formatted keyword in state
    }
};

const DoTheSign: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isInnerSettingOpen, setIsInnerSettingOpen] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [recordingStarted, setRecordingStarted] = useState(false); // State to track if recording has started
    const [countdown, setCountdown] = useState(20);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isCameraVisible, setIsCameraVisible] = useState(true); // State to control camera visibility
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [animationKeyword, setAnimationKeyword] = useState<string>("");
    const [hintUsedCount, setHintUsedCount] = useState(0); // State to track the number of times hint has been used

    // Function to start countdown timer
    const startCountdown = () => {
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

    const handleVideoData = (data: { return: string }) => {
        console.log("Received data from VideoRecorder:", data);

        // Extract the relevant part of the data
        const dataString = data.return;
        const keywords = dataString.split(",").map((word) => word.trim());

        if (keywords.includes(animationKeyword)) {
            setScore((prevScore) => prevScore + 2);
            playCorrectAnswerSound();
            toast.success(t("correctSign"))
        } else {
            setScore((prevScore) => prevScore - 2);
            playWrongAnswerSound();
            toast.error(t("wrongSign"))
        }

        // Increase level and pick a new random keyword
        setLevel((prevLevel) => prevLevel + 1);
        pickRandomKeyword(setAnimationKeyword);

        // Reset the timer, camera, and hint used state
        setCountdown(20);
        setIsCameraVisible(false);
        setHintUsedCount(0); // Reset hint used count
        setTimeout(() => {
            setIsCameraVisible(true);
        }, 100); // Adjust the timeout duration if needed
    };

    useEffect(() => {
        pickRandomKeyword(setAnimationKeyword);
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
                            if (hintUsedCount < 2) {
                                setShowHint(true);
                                setHintUsedCount(hintUsedCount + 1);
                                playButtonClickedSound();
                            } else {
                                toast(t("hintError"), {
                                    icon: "🤪",
                                });
                            }
                        }}
                    >
                        {t("hint")}
                    </button>
                    <h1 className="level-title">{t("level")}: {level}</h1>
                    <h2 className="score-title">{t("score")}: {score}</h2>
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
                                t("dts_rules8"),
                                t("dts_rules9"),
                            ]}
                        />
                    )}
                    {showHint && (
                        <HintPopup
                            onClose={() => setShowHint(false)}
                            title={t("game_hint")}
                            animationKeyword={animationKeyword}
                        />
                    )}
                    <div className="box-container">
                        <div className="left-box">{animationKeyword}</div>
                        <div className="right-box">
                            {isCameraVisible && (
                                <VideoRecorder
                                    onStartRecording={startCountdown}
                                    onStopRecording={stopCountdown}
                                    onVideoData={handleVideoData}
                                />
                            )}
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
