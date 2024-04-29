import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import buttonClickedSound from "/music/btnClicked.wav";
import styles from "./GameOver.module.css";

interface GameOverPopupProps {
    onClose: () => void;
    score: number;
}

const GameOverPopup: React.FC<GameOverPopupProps> = ({ score
}) => {
    const navigate = useNavigate();
    const popupRef = useRef<HTMLDivElement>(null);

    const playButtonClickedSound = () => {
        const audio = new Audio(buttonClickedSound);
        audio.play();
    };

    return (
        <div className={styles.gameover_container}>
            <div ref={popupRef} className={styles.gameover_content}>
                <h3>Game Over</h3>
                <div className={styles.gameover_details}>
                <p className={styles.scoreDisplay}>Your Score</p>
                <p className={styles.scoreValue}>{score}</p>
                        <button
                            className={styles.quit_btn}
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
    );
};

export default GameOverPopup;
