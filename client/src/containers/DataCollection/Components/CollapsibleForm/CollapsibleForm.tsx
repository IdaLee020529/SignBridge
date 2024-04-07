import React, { useState } from "react";
import "./CollapsibleForm.css";
import { Button } from "../../../../components/Button/Button";
import VideoInput from "../../../../components/VideoInput/VideoInput";

interface CollapsibleContentProps {
  number: string;
  dateTime: string;
  status: string;
  name: string;
  email: string;
  phoneNumber: string;
  text: string;
  videoLink: string;
  avatar: string;
}

const CollapsibleForm: React.FC<CollapsibleContentProps> = ({
  number,
  dateTime,
  status,
  name,
  email,
  phoneNumber,
  text,
  videoLink,
  avatar,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const closeForm = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div
      className={`collapsible-content ${isOpen ? "opened" : "not-opened"}`}
      onClick={closeForm}
    >
      <div className="collapsible-content-header" onClick={toggleOpen}>
        <div className="header-content">
          <h2 className="number">No: {number}</h2>
          <h2 className="dateTime">DateTime: {dateTime}</h2>
          <h2 className="status">Status: {status}</h2>
        </div>
        <div className="expand-icon">
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </div>
      </div>
      {isOpen && (
        <div className="collapsible-content-background">
          <div className="collapsible-content-details">
            <div className="personal-details">
              <h2>Personal Details</h2>
              <div className="personal-details-content">
                <p>
                  <strong>Name:</strong> <span>{name}</span>
                </p>
                <p>
                  <strong>Email:</strong> <span>{email}</span>
                </p>
                <p>
                  <strong>Phone Number:</strong> <span>{phoneNumber}</span>
                </p>
              </div>
            </div>
            <div className="separator"></div>
            <div className="sentence-details">
              <h2>Text/Sentence</h2>
              <div className="sentence-details-content">
                <strong>1.</strong> <span>{text}</span>
              </div>
            </div>
          </div>
          <div className="collapsible-content-footer">
            <div className="content-left">
              <div>
                <strong>Demonstration Video: </strong>
                <a href={videoLink} download>
                  {text}.mp4
                </a>
              </div>

              {status === "In Progress" && (
                <div>
                  <strong>Avatar Video: </strong>
                  <span></span>
                </div>
              )}
            </div>

            <div className="buttons-right">
              {status === "New" && (
                <div className="button-container">
                  <Button
                    type="button"
                    onClick={() => {
                      // Handle accept action
                    }}
                    buttonStyle="btn--accept" // Style for accept button
                    buttonSize="btn--large"
                  >
                    Accept
                  </Button>
                </div>
              )}

              {status === "In Progress" && (
                <div className="button-container">
                  <Button
                    type="button"
                    onClick={() => {}}
                    buttonStyle="btn--send"
                    buttonSize="btn--large"
                  >
                    Send
                  </Button>
                </div>
              )}

              {status === "Rejected" && (
                <div className="button-container">
                  <Button
                    type="button"
                    onClick={() => {}}
                    buttonStyle="btn--send"
                    buttonSize="btn--large"
                  >
                    Send
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleForm;
