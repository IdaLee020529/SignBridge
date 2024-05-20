import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import "./InstructionPopup.css";
import InstructionImage from "/images/InfoPopup.png";

interface InstructionPopupProps {
  showInstructionPopup: boolean;
  onClose: () => void;
}

const InstructionPopup: React.FC<InstructionPopupProps> = ({
  showInstructionPopup,
  onClose,
}) => {
  return (
    <div
      className={`instruction-popup ${showInstructionPopup ? "shown" : ""} `}
    >
      <div className="instruction-popup-header">
        <h1 className="instruction-title">Instructions</h1>
        <i className={`fa fa fa-close`} onClick={onClose}></i>
      </div>
      <div className="instruction-popup-details">
        <div className="instruction-popup-details-section1">
          <p>
            <strong>1.</strong> Login a user account
          </p>
          <p>
            <strong>2.</strong> Fill up the details - Name, Email, Text/
            Sentence
          </p>
          <p>
            <strong>3.</strong> Upload a demonstration video of the
            text/sentence
          </p>
          <p>
            <strong>4.</strong> Press the reset button to reset the form or the
            submit button to submit the form
          </p>
        </div>
        <hr className="line-separator" />
        <div className="instruction-popup-details-section2">
          <p>Note:</p>
          <div className="instruction-popup-content">
            <ul>
              <li>The video submitted must be in mp4 format</li>
              <li>
                The video should include either half or entire body of the
                presenter
              </li>
              <li>
                The video will only be used for avatar preparation purpose only
              </li>
            </ul>
          </div>
        </div>
        <div className="instruction-popup-details-section3">
          <p>You can refer to the image below:</p>
          <div className="instruction-popup-details-image">
            <img
              src={InstructionImage}
              alt="instruction-image"
              className="instruction-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionPopup;
