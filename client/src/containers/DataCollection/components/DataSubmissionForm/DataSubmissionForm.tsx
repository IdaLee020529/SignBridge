import React, { useState } from "react";
import InputField from "../../../../components/InputField/InputField";
import { Button } from "../../../../components/Button/Button";
import VideoInput from "../../../../components/VideoInput/VideoInput";
import EmailIcon from "../EmailIcon/EmailIcon";
import PhoneIcon from "../PhoneIcon/PhoneIcon";
import InfoIcon from "../InfoIcon/InfoIcon";
import LocationIcon from "../LocationIcon/LocationIcon";
import submitForm from "../../../../services/dataset.service";
import "./DataSubmissionForm.css";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

interface DataSubmissionFormProps {
  user: string;
}

const DataSubmissionForm: React.FC<DataSubmissionFormProps> = ({ user }) => {
  //Modal Control (Onsubmit popup)
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //Video Control
  const [videoInfo, setVideoInfo] = useState(null);
  const [resetVideo, setResetVideo] = useState(false);
  const handleVideoReset = () => {
    setResetVideo(true); // Reset resetVideo state
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setText("");
    setNameError("");
    setEmailError("");
    setTextError("");
    setResetVideo(true); // Set resetVideo to true to trigger video input reset
  };

  //Validation Control
  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Name is required");
      return "Name is required";
    }
    setNameError("");
    return undefined;
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return "Email is required";
    }
    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return "Invalid email format";
    }
    setEmailError("");
    return undefined;
  };

  const validateText = (value: string) => {
    if (!value.trim()) {
      setTextError("Text/Sentence is required");
      return "Text/Sentence is required";
    }
    setTextError("");
    return undefined;
  };

  //Form Element Setup
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setName(e.target.value);
    validateName(e.target.value);
  };

  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
    validateText(e.target.value);
  };

  //Submit Control
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior
    if (
      nameError.length === 0 &&
      emailError.length === 0 &&
      textError.length === 0 &&
      videoInfo != null
    ) {
      const user_id = Cookies.get("user_id");
      if (!user_id) {
        console.log("Please login");
      } else {
        const status_SE = "New";
        const status_Admin = "-";
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("text_sentence", text);
        formData.append("status_SE", status_SE);
        formData.append("status_Admin", status_Admin);
        if (videoInfo) {
          formData.append("video", videoInfo);
          try {
            const submitFormRequest = await submitForm(formData);
            console.log(submitFormRequest);
          } catch (error: any) {
            console.error("Error");
          }
          handleReset();
          await handleOpenModal();
        }
      }
    }
  };

  return (
    <div className="dataForm">
      <div className="dataForm-header-container">
        <div className="dataForm-header">
          <h1>{t('dataset_collection_form')}</h1>
        </div>
      </div>
      <div className="dataForm-cover">
        <div className={`dataForm-card ${user}`}>
          <h1>{t('in_touch')}</h1>
          <h3>{t('more_suggestions')}</h3>
          <div className={"dataForm-card-content"}>
            <div className="dataForm-card-info">
              <LocationIcon />
              <p>
                {" "}
                {t('neoun_address')}
              </p>
            </div>
            <div className="dataForm-card-info2">
              {/* <img src={phoneIcon} alt="location" className="phone-icon" /> */}
              <PhoneIcon />
              {/* <p>Phone: [Phone Number]</p> */}
              <p>{t('neoun_phone')}</p>
            </div>
            <div className="dataForm-card-info2">
              {/* <img src={emailIcon} alt="location" className="email-icon" /> */}
              <EmailIcon />
              <p>{t('neoun_email')}</p>
            </div>
            <div className="dataForm-card-info"></div>
          </div>
        </div>
        <div className="dataForm-container">
          <div className="dataForm-info-block">
            <InfoIcon />
          </div>
          <div className="row justify-content-center input-container">
            <div className="col-md-8">
              <form onSubmit={handleSubmit} noValidate>
                <InputField
                  label={t('name_input')}
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  error={nameError}
                />
                <InputField
                  label={t('email_input')}
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                />
                <InputField
                  label={t('text_sentence_input')}
                  name="text"
                  value={text}
                  onChange={handleTextChange}
                  multipleLines={true}
                  error={textError}
                />
                <div className="video-container">
                  <VideoInput
                    reset={resetVideo}
                    onReset={handleVideoReset}
                    setVideoInfo={setVideoInfo}
                  />
                </div>
                <div className="button-container">
                  <Button
                    type="button"
                    onClick={handleReset}
                    buttonStyle="btn--reset"
                    buttonSize="btn--large"
                  >
                    {t('reset_btn')}
                  </Button>
                  <Button
                    type="submit"
                    buttonStyle="btn--submit"
                    buttonSize="btn--large"
                  >
                    {t('submit_btn')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSubmissionForm;