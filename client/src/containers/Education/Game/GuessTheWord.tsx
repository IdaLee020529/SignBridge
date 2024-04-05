import React, { useState, useRef, useEffect } from "react";
import RulesPopup from "../../../components/RulesPopup/RulesPopup";
import InnerSetting from "../../../components/InnerSetting/InnerSetting";
import "./GuessTheWord.css";
import backgroundMusic from "../../../../public/music/gameMusic2.mp3";
import buttonClickedSound from "../../../../public/music/btnClicked.wav";

interface Question {
  level: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

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

const questions: Question[] = [
  {
    level: 1,
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "London", "Rome"],
    correctAnswer: "Paris",
  },
  {
    level: 2,
    question: "What is the largest planet in our solar system?",
    options: ["Mars", "Jupiter", "Earth", "Saturn"],
    correctAnswer: "Jupiter",
  },
  // Add more questions here
];

const GuessTheWord: React.FC = () => {
  const [isInnerSettingOpen, setIsInnerSettingOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
  const [wrongAnswerIndex, setWrongAnswerIndex] = useState(-1);

  const handleAnswerOptionClick = (selectedOption: string, index: number) => {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    // Check if the selected option is correct
    if (selectedOption === correctAnswer) {
      setScore(score + 1);
      setCorrectAnswerIndex(index);
    } else {
      // Set the background color of the wrong answer to red
      setCorrectAnswerIndex(
        questions[currentQuestionIndex].options.indexOf(correctAnswer)
      );
      setWrongAnswerIndex(index);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
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
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setCorrectAnswerIndex(-1);
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
            Level {questions[currentQuestionIndex].level}
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
            <img src="./images/setting.png" alt="Setting" width="30" height="30"/>
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
                {questions[currentQuestionIndex].question}
              </h3>
              <div className="options-container">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <button
                      className={`answer-option 
                      ${correctAnswerIndex === index ? "correct-answer" : ""}
                      ${wrongAnswerIndex === index ? "wrong-answer" : ""}
                    `}
                      key={index}
                      onClick={() => handleAnswerOptionClick(option, index)}
                    >
                      {option}
                    </button>
                  )
                )}
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
