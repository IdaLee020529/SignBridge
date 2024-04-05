import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingPopup from "../../components/SettingPopup/SettingPopup";
import "./Education.css";
import backgroundMusic from "/music/gameMusic.mp3";
import buttonClickedSound from "/music/btnClicked.wav";

export default function Education() {
	const navigate = useNavigate();
	const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);

	// Function to play button clicked sound
	const playButtonClickedSound = () => {
		const audio = new Audio(buttonClickedSound);
		audio.play();
	};

	// Function to update background music volume
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
		<div className="education-layout">
			<div className="education-container">
				<div className="education-game-mode">
					<h1>Game Mode</h1>
					<button
						className="game-btn setting-btn"
						type="button"
						onClick={() => {
							playButtonClickedSound();
							setIsSettingPopupOpen(true); // Open the setting popup
						}}>
						<img src="./images/setting.png" alt="Setting" width="30" height="30" />
					</button>
					<button
						className="game-btn guess-the-word-btn"
						type="button"
						onClick={() => {
							navigate("/guess-the-word");
							playButtonClickedSound();
						}}>
						Guess The Word
					</button>
					<button
						className="game-btn do-the-sign-btn"
						type="button"
						onClick={() => {
							navigate("/do-the-sign");
							playButtonClickedSound();
						}}>
						Do The Sign
					</button>
				</div>
			</div>
			{/* Add audio player for background music */}
			<audio ref={audioRef} autoPlay loop>
				<source src={backgroundMusic} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
			{/* Render SettingPopup if isSettingPopupOpen is true */}
			{isSettingPopupOpen && <SettingPopup onClose={() => setIsSettingPopupOpen(false)} onVolumeChange={updateBackgroundMusicVolume} />}
		</div>
	);
}
