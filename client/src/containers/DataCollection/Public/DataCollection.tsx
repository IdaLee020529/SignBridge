// Form.tsx
import React, { useState } from "react";
import InputField from "../../../components/InputField/InputField";
import VideoInput from "../../../components/VideoInput/VideoInput";
import { Button } from "../../../components/Button/Button";
import "./DataCollection.css";

const Form: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    text: "",
    video: "", // Assuming there's a state for video input as well
  });

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("/api/submitForm", formData);
  //     console.log("Form submitted successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  //   console.log(formData);
  //   setFormData({
  //     name: "",
  //     email: "",
  //     phone: "",
  //     text: "",
  //     video: "", // Reset the video state as well if applicable
  //   });
  // };

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
    <div className="dataForm-container">
      <div className="row justify-content-center">
        <h1>Dataset Collection Form</h1>
        <div className="col-md-8">
          <form>
            {/* <form onSubmit={handleSubmit}> */}
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
              label="Text"
              name="text"
              value={formData.text}
              onChange={handleChange}
            />
            <div className="video-container">
              <VideoInput />
            </div>
            <div className="button-container">
              <Button
                type="button"
                onClick={handleReset}
                buttonStyle="btn--primary"
                buttonSize="btn--medium"
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={() => {}}
                buttonStyle="btn--primary"
                buttonSize="btn--medium"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
