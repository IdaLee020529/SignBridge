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

interface DataSubmissionFormProps {
  user: string;
}

const DataSubmissionForm: React.FC<DataSubmissionFormProps> = ({ user }) => {
  //Modal Control (Onsubmit popup)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //Form Data Control
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // phone: "",
    text: "",
  });

  //Video Control
  const [resetVideo, setResetVideo] = useState(false);

  const handleVideoReset = () => {
    setResetVideo(false); // Reset resetVideo state
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      // phone: "",
      text: "",
    });
    setResetVideo(true); // Set resetVideo to true to trigger video input reset
  };

  //Submit Control
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior
    if (
      nameError.length === 0 &&
      emailError.length === 0 &&
      textError.length === 0
    ) {
      const user_id = 1;
      const status = "New";
      const demo_link = "";
      const avatar_link = "";
      const data = {
        user_id,
        name,
        email,
        text_sentence: text,
        status,
        demo_link,
        avatar_link,
      };
      try {
        const submitFormRequest = await submitForm(data);
      } catch (error: any) {
        console.error("Error");
      }
    }
    handleReset();
    await handleOpenModal();
  };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

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
      console.log("Testing123");
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

  return (
    <div className="dataForm">
      <div className="dataForm-header-container">
        <div className="dataForm-header">
          <h1>Dataset Collection Form</h1>
        </div>
      </div>
      <div className="dataForm-cover">
        <div className={`dataForm-card ${user}`}>
          <h1>Lets Get in Touch</h1>
          <h3>We're open for more suggestions</h3>
          <div className={"dataForm-card-content"}>
            <div className="dataForm-card-info">
              <LocationIcon />
              <p>
                {" "}
                Address: AI Lab @ The Orchard, NEUON AI Sdn Bhd (1308301-T,
                Kuching - Samarahan Expressway, 94300 Kota Samarahan, Sarawak
              </p>
            </div>
            <div className="dataForm-card-info2">
              {/* <img src={phoneIcon} alt="location" className="phone-icon" /> */}
              <PhoneIcon />
              {/* <p>Phone: [Phone Number]</p> */}
              <p>Phone: 082-368 302</p>
            </div>
            <div className="dataForm-card-info2">
              {/* <img src={emailIcon} alt="location" className="email-icon" /> */}
              <EmailIcon />
              <p>Email: info@neuon.ai</p>
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
                  label="Name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  error={nameError}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                />
                <InputField
                  label="Text/ Sentence"
                  name="text"
                  value={text}
                  onChange={handleTextChange}
                  multipleLines={true}
                  error={textError}
                />
                <div className="video-container">
                  <VideoInput reset={resetVideo} onReset={handleVideoReset} />
                </div>
                <div className="button-container">
                  <Button
                    type="button"
                    onClick={handleReset}
                    buttonStyle="btn--reset"
                    buttonSize="btn--large"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    buttonStyle="btn--submit"
                    buttonSize="btn--large"
                  >
                    Submit
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