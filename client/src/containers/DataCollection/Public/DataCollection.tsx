// Form.tsx
import React, { useState } from "react";
import InputField from "../../../components/InputField/InputField";
import VideoInput from "../../../components/VideoInput/VideoInput";
import { Button } from "../../../components/Button/Button";
import "./DataCollection.css";
import axios from "axios";
import image from "/images/avatar-hi.png";
// import PopupModal from "../../../components/PopupModal/PopupModal";

const Form: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    text: "",
    video: "", // Assuming there's a state for video input as well
  });
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    // e.preventDefault();
    // try {
    //   const response = await axios.post("/api/submitForm", formData);
    //   console.log("Form submitted successfully:", response.data);
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    // }
    // console.log(formData);
    // setFormData({
    //   name: "",
    //   email: "",
    //   phone: "",
    //   text: "",
    //   video: "", // Reset the video state as well if applicable
    // });
    handleOpenModal();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      text: "",
      video: "", // Reset the video state as well if applicable
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  return (
    <div className="dataForm-bg">
      <img src={image} alt="" className="background-image" />
      <div className="dataForm-container">
        <div className="row justify-content-center">
          <div className="dataForm-container-header">
            <h1>Dataset Collection Form</h1>
          </div>
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <InputField
                label="Text/ Sentence"
                name="text"
                value={formData.text}
                onChange={handleChange}
                multipleLines={true}
              />
              <div className="video-container">
                <VideoInput />
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
                  type="button"
                  onClick={() => {}}
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
      <div>
        {/* <PopupModal isOpen={isOpen} onClose={handleCloseModal} /> */}
      </div>
    </div>
  );
};

export default Form;
