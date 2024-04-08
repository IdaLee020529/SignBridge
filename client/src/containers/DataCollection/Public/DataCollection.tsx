// Form.tsx
import React, { useState } from "react";
import InputField from "../../../components/InputField/InputField";
import VideoInput from "../../../components/VideoInput/VideoInput";
import { Button } from "../../../components/Button/Button";
import "./DataCollection.css";
import image from "/images/avatar-hi.png";
import PopupModal from "../../../components/PopupModal/PopupModal";

const DataCollection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    text: "",
  });

  const [resetVideo, setResetVideo] = useState(false);

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      text: "",
    });
    setResetVideo(true); // Set resetVideo to true to trigger video input reset
  };

  const handleVideoReset = () => {
    setResetVideo(false); // Reset resetVideo state
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior
    handleReset();
    await handleOpenModal();
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
      <div>
        <PopupModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default DataCollection;
