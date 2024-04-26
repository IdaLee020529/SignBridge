import React, { useEffect, useRef } from 'react';
import './RulesPopup.css';
import buttonClickedSound from '/music/btnClicked.wav';

interface RulesPopupProps {
  onClose: () => void;
  title: string;
  rules: string[];
}

const RulesPopup: React.FC<RulesPopupProps> = ({ onClose, title, rules }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Function to play button clicked sound
  const playButtonClickedSound = () => {
    const audio = new Audio(buttonClickedSound);
    audio.play();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="popup-container">
      <div ref={popupRef} className="popup-content">
        <h3>{title}</h3>
        <button className="close-btn-pushable" role="button" onClick={() => {
          onClose();
          playButtonClickedSound(); 
        }}>
          <span className="close-btn-shadow"></span>
          <span className="close-btn-edge"></span>
          <span className="close-btn-front text">
            <i className="fa fa-close"></i>
          </span>
        </button>
        
        <div className="popup-details">
          {rules.map((rule, index) => (
            <p key={index}>&#8226; {rule}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RulesPopup;
