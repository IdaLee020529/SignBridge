import React, { useState, useRef, useEffect } from "react";
import RulesPopup from "../components/RulesPopup/RulesPopup";
import InnerSetting from "../components/InnerSetting/InnerSetting";
import "./GuessTheWord.css";
import backgroundMusic from "/music/gameMusic2.mp3";
import buttonClickedSound from "/music/btnClicked.wav";
import { Canvas } from "@react-three/fiber";
import { CharacterAnimationsProvider } from "../../../components/SLP/CharacterAnimations";
import Experience from "../../../components/SLP/Experience";
import Man from "../../../components/AvatarModels/Man";

interface Question {
    level: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

interface GlossData {
    [key: string]: any;
}

// Function to play button clicked sound
const playButtonClickedSound = () => {
    const audio = new Audio(buttonClickedSound);
    audio.play();
};

const questionList: Question[] = [];
let level = 1;

const GuessTheWord: React.FC = () => {
    const [isInnerSettingOpen, setIsInnerSettingOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
    const [wrongAnswerIndex, setWrongAnswerIndex] = useState(-1);
    const [animationKeyword, setAnimationKeyword] = useState("");
    const [answerOptions, setAnswerOptions] = useState<string[]>([]);
    const [questions, setQuestions] = useState<Question>();
    console.log("Question List: ", questionList)

    const loadAnimationKeywords = async (): Promise<GlossData | null> => {
        try {
            const response = await fetch("/glosses/gloss.json");
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch: ${response.status} ${response.statusText}`
                );
            }
            const data: GlossData = await response.json();

            const lowercaseData: GlossData = {};
            for (const key in data) {
                lowercaseData[key.toLowerCase()] = data[key];
            }

            const combinedData: GlossData = { ...data, ...lowercaseData };

            return combinedData;
        } catch (error) {
            console.error("Failed to load animation keywords:", error);
            return null;
        }
    };

    const pickRandomKeyword = async () => {
        const glossData = await loadAnimationKeywords();
        console.log("glossData", glossData);
        if (glossData) {
            const keys = Object.keys(glossData);
            console.log("Keys", keys);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            setAnimationKeyword(randomKey);
            const newQuestion = { level: level++, question: "", options: [], correctAnswer: randomKey };
            setQuestions(newQuestion);
            questionList.push(newQuestion);
            console.log("Question List: ", questionList);
            console.log("Selected animation keyword:", randomKey);
        }
    };

    // const updateCurrentQuestionCorrectAnswer = (answer: string) => {
    //     const updatedQuestions = questionList.map((question, index) => {
    //         if (index === currentQuestionIndex) {
    //             return { ...question, correctAnswer: answer };
    //         }
    //         return question;
    //     });
    //     // setQuestions(updatedQuestions);
    //     console.log("Updated questions:", updatedQuestions);
    // };

    useEffect(() => {
        pickRandomKeyword();
    }, [currentQuestionIndex]);

    useEffect(() => {
        const fetchAnswerOptions = async () => {
            if (animationKeyword !== "") {
                const options = await generateAnswerOptions(animationKeyword);
                setAnswerOptions(options);
            }
        };

        fetchAnswerOptions();
    }, [animationKeyword]);

    useEffect(() => {
        console.log("Answer option: ", answerOptions);
        console.log("Questions: ", questions);
    }, [answerOptions, questions]);

    const generateAnswerOptions = async (
        animationKeyword: string
    ): Promise<string[]> => {
        const options: string[] = [];
        const glossData = await loadAnimationKeywords();
        if (glossData) {
            const glossKeys = Object.keys(glossData).filter((key) =>
                /^[A-Z]+$/.test(key)
            );

            const filteredGlossKeys = glossKeys.filter(
                (key) => key.toLowerCase() !== animationKeyword.toLowerCase()
            );

            for (let i = filteredGlossKeys.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filteredGlossKeys[i], filteredGlossKeys[j]] = [
                    filteredGlossKeys[j],
                    filteredGlossKeys[i],
                ];
            }

            let randomIndex = Math.floor(
                Math.random() * filteredGlossKeys.length
            );

            for (let i = 0; i < 4; i++) {
                const randomKey = filteredGlossKeys[randomIndex];
                const lowercaseOption = randomKey.toLowerCase();
                options.push(lowercaseOption);
                randomIndex = (randomIndex + 1) % filteredGlossKeys.length;
            }

            options[Math.floor(Math.random() * 4)] =
                animationKeyword.toLowerCase();
            return options;
        } else {
            return [];
        }
    };

    const handleAnswerOptionClick = async (
        selectedOption: string,
        index: number
    ) => {
        try {
            const glossData = await loadAnimationKeywords();
            if (
                glossData &&
                questions
            ) {
                const correctAnswer = questions.correctAnswer;
                const correctAnswerLowerCase = correctAnswer.toLowerCase();
                const correctAnswerFromData = glossData[correctAnswerLowerCase];

                console.log("Selected option:", selectedOption);
                console.log("Correct answer:", correctAnswerLowerCase);
                console.log("Question List: ", questionList);

                if (selectedOption.toLowerCase() === correctAnswerLowerCase) {
                    setScore(score + 1);
                    setCorrectAnswerIndex(index);
                } else {
                    setCorrectAnswerIndex(
                        questions.options.indexOf(
                            correctAnswerFromData
                        )
                    );
                    setWrongAnswerIndex(index);
                }

                const nextQuestionIndex = currentQuestionIndex + 1;
                if (nextQuestionIndex < questionList.length) {
                    setTimeout(() => {
                        setCurrentQuestionIndex(nextQuestionIndex);
                        setCorrectAnswerIndex(-1);
                        setWrongAnswerIndex(-1); // Reset wrong answer background
                    }, 2000);
                } else {
                    setTimeout(() => {
                        setShowScore(true);
                        setWrongAnswerIndex(-1);
                    }, 2000);
                }
            } else {
                console.error("Failed to load glossData or questions.");
            }
        } catch (error) {
            console.error("Error handling answer option click:", error);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setCorrectAnswerIndex(-1);
    };

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
        <div className="guess-the-word-layout">
            <div className="guess-the-word-container">
                <div className="guess-the-word">
                    <button
                        className="shared-btn rules-btn"
                        type="button"
                        onClick={() => {
                            setShowRules(true);
                            playButtonClickedSound();
                        }}
                    >
                        Rules
                    </button>
                    <h1 className="level-title">
                        {questionList.length > 0 && questionList[currentQuestionIndex]
                            ? `Level ${questionList[currentQuestionIndex].level}`
                            : "Loading..."}
                    </h1>
                    <h2 className="score-title">Score: {score}</h2>
                    <button
                        className="shared-btn setting-btn2"
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
                            title="Game Rules"
                            rules={[
                                "Select the correct answer to earn points.",
                                "Advance to the next level by answering correctly.",
                                "Choosing incorrectly ends the game.",
                                "Your score will be displayed at the end of the game.",
                            ]}
                        />
                    )}
                    {showScore ? (
                        <div className="result-container">
                            <button onClick={resetQuiz}>Try Again</button>
                        </div>
                    ) : (
                        <div className="question-container">
                            <h3 className="question">
                                <div className="education-canvas-wrapper">
                                    <Canvas
                                        camera={{
                                            position: [1, 55, 225],
                                            fov: 45,
                                        }}
                                    >
                                        {/* Your 3D scene components */}
                                        <directionalLight
                                            intensity={1}
                                            color="white"
                                            position={[10, 10, 10]}
                                        />
                                        <CharacterAnimationsProvider>
                                            <Experience />
                                            <Man
                                                animationKeyword={
                                                    animationKeyword
                                                }
                                            />
                                        </CharacterAnimationsProvider>
                                    </Canvas>
                                </div>
                            </h3>
                            <div className="options-container">
                                {answerOptions.map((option, index) => (
                                    <button
                                        className={`answer-option 
                      ${correctAnswerIndex === index ? "correct-answer" : ""}
                      ${wrongAnswerIndex === index ? "wrong-answer" : ""}
                    `}
                                        key={index}
                                        onClick={() =>
                                            handleAnswerOptionClick(
                                                option,
                                                index
                                            )
                                        }
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
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

export default GuessTheWord;
