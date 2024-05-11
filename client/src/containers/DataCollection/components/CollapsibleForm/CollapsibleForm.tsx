import React, { useState, useEffect } from "react";
import "./CollapsibleForm.css";
import { Button } from "../../../../components/Button/Button";
import VideoInput from "../../../../components/VideoInput/VideoInput";
import { Descriptions } from "antd";
import { getDemoVidById } from "../../../../services/dataset.service";
import { saveAs } from "file-saver";

import { toast } from "react-hot-toast";
import { CreateNotification, GetUserIdByEmail } from "../../../../services/notification.service";
import Cookies from "js-cookie";

interface CollapsibleFormProps {
  number: string;
  form_id: number;
  dateTime: string;
  status: string;
  name: string;
  email: string;
  text: string;
  video_link: string;
  avatar_link?: string;
  user?: string;
  user_id?: number;
  video_name: string;
  avatar_name?: string;
  handleSubmit: Function;
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
  user_id,
  video_name,
  avatar_name,
  handleSubmit,
}) => {
  const downloadVideo = async () => {
    try {
      const video = await getDemoVidById(form_id); // Assuming getDemoVidById returns a Promise
      const blob = new Blob([video.data], { type: "video/mp4" }); // Assuming video.data contains blob data and video.contentType contains the content type
      saveAs(blob, video_name);
    } catch (error) {
      console.error("Error downloading video:", error);
      // Handle download errors gracefully (e.g., display error message)
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  //Video Control
  const [videoInfo, setVideoInfo] = useState(null);
  const [resetVideo, setResetVideo] = useState(false);
  const handleVideoReset = () => {
    setResetVideo(true); // Reset resetVideo state
  };

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

  const video_details_with_video_upload = [
    {
      key: "1",
      label: "Demonstration Video",
      children: (
        <span className="video-details-info">
          <button onClick={() => downloadVideo()}>Download {video_name}</button>
        </span>
      ),
    },
    {
      key: "2",
      label: "Avatar Video",
      children: (
        <span className="video-details-info">
          <VideoInput
            reset={resetVideo}
            onReset={handleVideoReset}
            setVideoInfo={setVideoInfo}
          />
        </span>
      ),
    },
  ];

  const video_details_with_information = [
    {
      key: "1",
      label: "Demonstration Video",
      children: (
        <span className="video-details-info">
          <button onClick={() => downloadVideo()}>Download {video_name}</button>
        </span>
      ),
    },
    {
      key: "2",
      label: "Avatar Video",
      children: (
        <span className="video-details-info">
          <a href={avatar_link} download={avatar_name}>
            {avatar_name}
          </a>
        </span>
      ),
    },
  ];
  
  // For notification
  const getemail = Cookies.get("email");
  const [userIds, setUserIds] = useState("");

  useEffect(() => {
    const getUserId = async () => {
      const res = await GetUserIdByEmail(getemail);
      setUserIds(res.data);
    };
    getUserId();
  }, []);

  // for public (accept/reject) 
  const handleSEAcceptPublicButtonClick = async () => {
    console.log("Sign Expert Accept Public");
    try {
      const notificationData = {
        receiver_id: user_id,
        sender_id: parseInt(userIds),
        message_en: "has accepted your text.",
        message_bm: "telah menerima teks anda.",
        sign_text: text,
        status: 0,
        type: "Text Verification",
        type_value: "accepted",
        created_at: new Date().toISOString(),
      };
      await CreateNotification(notificationData);
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
    try {
      const notificationData = {
        receiver_id: 1,
        sender_id: parseInt(userIds),
        message_en: "has assigned new text.",
        message_bm: "telah menetapkan teks baru.",
        sign_text: text,
        status: 0,
        type: "New Task",
        type_value: "newtask",
        created_at: new Date().toISOString(),
      };
      await CreateNotification(notificationData);
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

  const handleSERejectPublicButtonClick = async () => {
    console.log("Sign Expert Reject Public");
    try {
      const notificationData = {
        receiver_id: user_id,
        sender_id: parseInt(userIds),
        message_en: "has rejected your text.",
        message_bm: "telah menolak teks anda.",
        sign_text: text,
        status: 0,
        type: "Text Verification",
        type_value: "rejected",
        created_at: new Date().toISOString(),
      };
      await CreateNotification(notificationData);
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

  // for admin (accept/reject) 
  const handleSEAcceptAdminButtonClick = async () => {
    console.log("Sign Expert Accept Admin");
    try {
      const notificationData = {
        receiver_id: 1,
        sender_id: parseInt(userIds),
        message_en: "has accepted your avatar.",
        message_bm: "telah menerima avatar anda.",
        sign_text: text,
        status: 0,
        type: "Task Confirmation",
        type_value: "accepted",
        created_at: new Date().toISOString(),
      };
      await CreateNotification(notificationData);
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

  const handleSERejectAdminButtonClick = async () => {
    console.log("Sign Expert Reject Admin");
    try {
      const notificationData = {
        receiver_id: 1,
        sender_id: parseInt(userIds),
        message_en: "has rejected your avatar.",
        message_bm: "telah menolak avatar anda.",
        sign_text: text,
        status: 0,
        type: "Task Confirmation",
        type_value: "rejected",
        created_at: new Date().toISOString(),
      };
      await CreateNotification(notificationData);
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

  // For admin upload
  const handleAdminButtonClick = async () => {
    console.log("Admin upload");
    try {
      const notificationData = {
        receiver_id: 2,
        sender_id: parseInt(userIds),
        message_en: "has uploaded the avatar.",
        message_bm: "telah memuat naik avatar.",
        sign_text: text,
        status: 0,
        type: "Waiting for Verification",
        type_value: "waitingforverification",
        created_at: new Date().toISOString(),
      };
      await CreateNotification(notificationData);
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

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
                  {user === "admin" && (
                    <>
                      {avatar_link == "" && (
                        <Descriptions
                          items={video_details_with_video_upload}
                          bordered
                          layout="vertical"
                        />
                      )}
                      {avatar_link != "" && (
                        <Descriptions
                          items={video_details_with_information}
                          bordered
                          layout="vertical"
                        />
                      )}
                    </>
                  )}
                  {user === "signexpert" && (
                    <Descriptions
                      items={video_details_with_information}
                      bordered
                      layout="vertical"
                    />
                  )}
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
                            status_SE: "Awaiting Accept",
                            status_Admin: "New",
                          };
                          handleSubmit(form_id, updateData);
                          handleSEAcceptPublicButtonClick();
                        }}
                        buttonStyle="btn--accept" // Style for accept button
                        buttonSize="btn--large"
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const updateData = {
                            status_SE: "Cancelled",
                          };
                          handleSubmit(form_id, updateData);
                          handleSERejectPublicButtonClick();
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
                          const updateData = {
                            status_SE: "Verified",
                            status_Admin: "Verified",
                          };
                          handleSubmit(form_id, updateData);
                          handleSEAcceptAdminButtonClick();
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Verify
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const updateData = {
                            status_SE: "Rejected",
                            status_Admin: "Rejected",
                          };
                          handleSubmit(form_id, updateData);
                          handleSERejectAdminButtonClick();
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Reject
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
                          const updateData = {
                            status_SE: "In Progress",
                            status_Admin: "In Progress",
                          };
                          handleSubmit(form_id, updateData);
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
                        onClick={() => {
                          const updateData = {
                            status_SE: "Awaiting Verification",
                            status_Admin: "Awaiting Verification",
                          };
                          handleSubmit(form_id, updateData);
                          handleAdminButtonClick();
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Submit
                      </Button>
                    </div>
                  )}
                  {status === "Rejected" && (
                    <div className="button-container">
                      <Button
                        type="button"
                        onClick={() => {
                          const updateData = {
                            status_SE: "Awaiting Verification",
                            status_Admin: "Awaiting Verification",
                          };
                          handleSubmit(form_id, updateData);
                          handleAdminButtonClick();
                        }}
                        buttonStyle="btn--send"
                        buttonSize="btn--large"
                      >
                        Submit
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
