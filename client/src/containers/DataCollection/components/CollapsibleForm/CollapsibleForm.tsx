import React, { useState } from "react";
import "./CollapsibleForm.css";
import { Button } from "../../../../components/Button/Button";
import VideoInput from "../../../../components/VideoInput/VideoInput";
import { Descriptions } from "antd";
import { updateFormById } from "../../../../services/dataset.service";

interface CollapsibleFormProps {
  number: string;
  form_id: number;
  dateTime: string;
  status: string;
  name: string;
  email: string;
  text: string;
  video_link?: string;
  avatar_link?: string;
  user?: string;
  video_name?: string;
  avatar_name?: string;
}

const CollapsibleForm: React.FC<CollapsibleFormProps> = ({
  number,
  form_id,
  dateTime,
  status,
  name,
  email,
  text,
  video_link,
  avatar_link,
  user,
  video_name,
  avatar_name,
}) => {
  const handleSubmit = async (
    formId: number,
    updateData: Record<string, string>
  ) => {
    try {
      await updateFormById(formId, updateData);
      // Handle success if needed
    } catch (error) {
      console.error("Error updating form:", error);
      // Handle error if needed
    }
  };
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

  const personal_details = [
    {
      key: "1",
      label: "Name",
      children: <span className="personal-details-info">{name}</span>,
    },
    {
      key: "2",
      label: "Email",
      children: <span className="personal-details-info">{email}</span>,
    },
  ];

  const video_details = [
    {
      key: "1",
      label: "Demonstration Video",
      children: (
        <span className="video-details-info">
          <a href={video_link} download={video_name}>
            {video_name}
          </a>
        </span>
      ),
    },
    {
      key: "1",
      label: "Avatar Video",
      children: <span className="video-details-info">{avatar_link}</span>,
    },
  ];

  return (
    <div
      className={`collapsible-content ${isOpen ? "opened" : "not-opened"}`}
      onClick={closeForm}
    >
      <div
        className={`collapsible-content-header ${user}`}
        onClick={toggleOpen}
      >
        <div className="header-content">
          <h2 className="number">No: {number}</h2>
          <h2 className="dateTime">Date & Time: {dateTime}</h2>
          <h2 className="status">Status: {status}</h2>
        </div>
        <div className="expand-icon">
          {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
        </div>
      </div>
      {isOpen && (
        <div className="collapsible-content-background">
          <div className="collapsible-content-details">
            <div className={`personal-details ${user}`}>
              <h2>PERSONAL DETAILS</h2>
              <div className="row">
                <div className="col-md-6">
                  <Descriptions items={personal_details} bordered column={1} />
                </div>
              </div>
            </div>
            <div className="sentence-details">
              <h2>TEXT/ SENTENCE</h2>
              <div className="sentence-details-content">
                <p>{text}</p>
              </div>
            </div>
          </div>
          <div className="collapsible-content-footer">
            <div className={`content-left ${user}`}>
              <h2>VIDEO DETAILS</h2>
              <div className="row">
                <div className="col-md-6">
                  <Descriptions
                    items={video_details}
                    bordered
                    layout="vertical"
                  />
                </div>
              </div>
            </div>
            <div className="buttons-right">
              {user === "signexpert" && (
                <>
                  {status === "New" && (
                    <div className="button-container">
                      <Button
                        type="button"
                        onClick={() => {
                          const updateData = {
                            status_SE: "In Progress",
                            status_Admin: "New",
                          };
                          handleSubmit(form_id, updateData);
                        }}
                        buttonStyle="btn--accept" // Style for accept button
                        buttonSize="btn--large"
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle cancel action
                        }}
                        buttonStyle="btn--cancel" // Style for cancel button
                        buttonSize="btn--large"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {status === "Awaiting Verification" && (
                    <div className="button-container">
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle verify action
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Verify
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle reject action
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {status === "In Progress" && (
                    <div className="button-container">
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle send action
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Send
                      </Button>
                    </div>
                  )}
                </>
              )}
              {user === "admin" && (
                <>
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
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle cancel action
                        }}
                        buttonStyle="btn--cancel" // Style for cancel button
                        buttonSize="btn--large"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {status === "Awaiting Verification" && (
                    <div className="button-container">
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle verify action
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Verify
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle reject action
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {status === "In Progress" && (
                    <div className="button-container">
                      <Button
                        type="button"
                        onClick={() => {
                          // Handle send action
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Send
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleForm;
