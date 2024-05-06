import React, { ChangeEvent, useState, useEffect } from "react";
import style from "./AccountForm.module.css";
import AccountInputField from "../accountInputFields/accountInputFields";
import * as Ariakit from "@ariakit/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { GetUserByEmail, UpdateProfileInfo } from "../../../../services/account.service";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const AccountForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    // email: "",
    age: "",
    gender: "",
    race: "",
    country: "",
    city: "",
    state: "",
    picture: "",
  });

  const [error, setError] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    race: "",
  });

  const email = Cookies.get("email");

  async function fetchUser() {
    const user = await GetUserByEmail(email ?? "");

    // only set the user.data.email to form email
    setFormData((prevFormData) => ({
      ...prevFormData,
      username: user.data.username,
      picture: user.data.picture,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      age: user.data.age,
      gender: user.data.gender,
      race: user.data.race,
      country: user.data.country,
      city: user.data.city,
      state: user.data.state,
    }));
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const [selectCountryOpen, setSelectCountryOpen] = useState(false);
  const [selectCityOpen, setSelectCityOpen] = useState(false);
  const [selectStateOpen, setSelectStateOpen] = useState(false);
  const [selectedCountryOption, setSelectedCountryOption] = useState("");
  const [selectedCityOption, setSelectedCityOption] = useState("");
  const [selectedStateOption, setSelectedStateOption] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let isValid = true;
  
    if (isValid) {
      if (type === 'radio' && name === 'gender') {
        setFormData({ ...formData, gender: value });
      } else if (type === 'radio' ) {
        setFormData({ ...formData, [name]: parseInt(value) });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }

    let errorMessage = '';

    switch (name) {
      case 'firstName':
        errorMessage = validateFirstName(value) ? '' : 'First name must be at least 3 characters long';
        break;
      case 'lastName':
        errorMessage = validateLastName(value) ? '' : 'Last name must be at least 3 characters long';
        break;
      case 'age':
        errorMessage = validateAge(value) ? '' : 'Age must be between 2 and 150';
        break;
      case 'race':
        errorMessage = validateRace(value) ? '' : 'Race must contain only letters and be at least 3 characters long';
        break;
      default:
        break;
    }

    setError((prevError) => ({
      ...prevError,
      [name]: errorMessage,
    }));
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the selected file from the input element
    const file = e.target.files && e.target.files[0];
    if (file) {
        // Create a new instance of FileReader to read the file content
        const reader = new FileReader();

        // Define an event listener to execute when the file reading is completed
        reader.onloadend = () => {
            // Check if the result of file reading is a string (data URL)
            if (typeof reader.result === 'string') {
                // Update the image state with the new image data URL
                setImage(reader.result);

                // Update the formData picture field with the new image data URL
                // Ensure the type conversion to string
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    picture: reader.result as string,
                }));
            }
        };
        // Start reading the file as a data URL
        reader.readAsDataURL(file);
    }
  };

  // ---------- Validation Functions ----------
  const validateFirstName = (value: string) => {
    if ( value && value.trim() !== "" && value.length < 3) {
      setError((prev) => ({ ...prev, firstName: "First name must be at least 3 characters long" }));
      return false;
    }
    setError((prev) => ({ ...prev, firstName: "" }));
    return true;
  };
  
  const validateLastName = (value: string) => {
    if (value && value.trim() !== "" && value.length < 3) { // Add a check for value
      setError((prev) => ({ ...prev, lastName: "Last name must be at least 3 characters long" }));
      return false;
    }
    setError((prev) => ({ ...prev, lastName: "" }));
    return true;
  };
  
  
  const validateAge = (value: string) => {
    if ( value && value.trim() !== "" && (+value < 2 || +value > 150 || isNaN(+value))) {
      setError((prev) => ({ ...prev, age: "Age must be between 2 and 150" }));
      return false;
    }
    setError((prev) => ({ ...prev, age: "" }));
    return true;
  };
  
  const validateRace = (value: string) => {
    if ( value && value.trim() !== "") {
      const lettersRegex = /^[a-zA-Z]+$/;
      if (!lettersRegex.test(value)) {
        setError((prev) => ({ ...prev, race: "Race must contain only letters" }));
        return false;
      } else if (value.length < 3) {
        setError((prev) => ({ ...prev, race: "Race must be at least 3 characters long" }));
        return false;
      }
    }
    setError((prev) => ({ ...prev, race: "" }));
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFirstNameValid = validateFirstName(formData.firstName);
    const isLastNameValid = validateLastName(formData.lastName);
    const isAgeValid = validateAge(formData.age);
    const isRaceValid = validateRace(formData.race);
    if (isFirstNameValid && isLastNameValid && isAgeValid && isRaceValid) {
      console.log("Form Submitted", formData);
      UpdateProfileInfo(email ?? '', formData); // Fix: Convert user_id to number
      toast.success("Personal details updated successfully");
    } else {
      console.log("Form Submission Failed", error);
      toast.error("Personal details update failed");
    }
  };

  return (
    <div className={style.accountFormContainer}>
      <div className={style.accountContent}>
        <h1>Personal Detail</h1>
        <form onSubmit={handleSubmit} className={style.form} key={formData.username}>
          <AccountInputField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={error.username}
          />
          <div className={style.inputGroup}>
            <AccountInputField
              // key={formData.firstName}
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={error.firstName}
            />
            <AccountInputField
              // key={formData.lastName}
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={error.lastName}
            />
          </div>
          <div className={style.inputGroup}>
            <AccountInputField
              // key={formData.age}
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              error={error.age}
            />
            {/* <AccountInputField
              // key={formData.gender}
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={error.gender}
            /> */}
            <div className={style.radio_group}>
              <label className={style.genderLabel}>Gender</label>
              <div className={style.gender}>
                <input type="radio" name="gender" id="male" value="male" onChange={handleChange} checked={formData.gender === "male"} /><label htmlFor="male"> Male</label>
                <input type="radio" name="gender" id="female" value="female" className="female" onChange={handleChange} checked={formData.gender === "female"} /><label htmlFor="female"> Female</label>
              </div>     
            </div>   
          </div>
          <AccountInputField
            // key={formData.race}
            label="Race"
            name="race"
            value={formData.race}
            onChange={handleChange}
            error={error.race}
          />

          <div className={style.selectContainer}>
            <Ariakit.SelectProvider setOpen={(open) => {
                setSelectCountryOpen(open)
              }}
              setValue={(value) => {
                console.log(value)
                setSelectedCountryOption(value)
              }}
              defaultValue={""}
            >
              <Ariakit.SelectLabel className={style.label}>
                Country
              </Ariakit.SelectLabel>
              <Ariakit.Select className={style.selectTrigger}>
                {selectedCountryOption ? selectedCountryOption : "Select a country" }
                <div className={`${style.selectTriggerIcon} ${selectCountryOpen ? style.selectIconFocus : ''}`}>
                  <ChevronDownIcon />
                </div>
              </Ariakit.Select>
              <Ariakit.SelectPopover gutter={4} sameWidth className={style.selectPopover}>
                <Ariakit.SelectItem className={style.selectItem} value="Apple" />
                <Ariakit.SelectItem className={style.selectItem} value="Banana" />
                <Ariakit.SelectItem className={style.selectItem} value="Orange" />
              </Ariakit.SelectPopover>
            </Ariakit.SelectProvider>
          </div>

          <div className={style.selectContainer}>
            <Ariakit.SelectProvider setOpen={(open) => {
                setSelectCityOpen(open)
              }}
              setValue={(value) => {
                console.log(value)
                setSelectedCityOption(value)
              }}
              defaultValue={""}
              >
              <Ariakit.SelectLabel className={style.label}>
                City
              </Ariakit.SelectLabel>
              <Ariakit.Select className={style.selectTrigger}>
                {selectedCityOption ? selectedCityOption : "Select a city" }
                <div className={`${style.selectTriggerIcon} ${selectCityOpen ? style.selectIconFocus : ''}`}>
                  <ChevronDownIcon />
                </div>
              </Ariakit.Select>
              <Ariakit.SelectPopover gutter={4} sameWidth className={style.selectPopover}>
                <Ariakit.SelectItem className={style.selectItem} value="Apple" />
                <Ariakit.SelectItem className={style.selectItem} value="Banana" />
                <Ariakit.SelectItem className={style.selectItem} value="Orange" />
              </Ariakit.SelectPopover>
            </Ariakit.SelectProvider>
          </div>

          <div className={style.selectContainer}>
            <Ariakit.SelectProvider setOpen={(open) => {
                setSelectStateOpen(open)
              }}
              setValue={(value) => {
                console.log(value)
                setSelectedStateOption(value)
              }}
              defaultValue={""}
              >
              <Ariakit.SelectLabel className={style.label}>
                State
              </Ariakit.SelectLabel>
              <Ariakit.Select className={style.selectTrigger}>
                {selectedStateOption ? selectedStateOption : "Select a state" }
                <div className={`${style.selectTriggerIcon} ${selectStateOpen ? style.selectIconFocus : ''}`}>
                  <ChevronDownIcon />
                </div>
              </Ariakit.Select>
              <Ariakit.SelectPopover gutter={4} sameWidth className={style.selectPopover}>
                <Ariakit.SelectItem className={style.selectItem} value="Apple" />
                <Ariakit.SelectItem className={style.selectItem} value="Banana" />
                <Ariakit.SelectItem className={style.selectItem} value="Orange" />
              </Ariakit.SelectPopover>
            </Ariakit.SelectProvider>
          </div>

          {/* Upload Image */}
          <div className={style.imageUploader}>
            <label htmlFor="file" className={style.uploadLabel}>
              {formData.picture ? (
                <img src={formData.picture} alt="Uploaded" className={style.uploadedImage} />
              ) : (
                <span>Upload Image</span>
              )}
            </label>
            <label htmlFor="file" className={style.uploadButton}>
              Select Image
              <input
                type="file"
                id="file"
                className={style.uploadInput}
                onChange={handleImageChange}
                style={{ display: 'none'}} // Hide the input element
              />
            </label>
          </div>
          
          <button type="submit" className={style.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
