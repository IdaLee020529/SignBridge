import React, { ChangeEvent, useState, useEffect } from "react";
import style from "./AccountForm.module.css";
import AccountInputField from "../accountInputFields/accountInputFields";
import * as Ariakit from "@ariakit/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { GetUserByEmail, UpdateProfileInfo, FetchAllCountries } from "../../../../services/account.service";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

type Country = {
  country: string;
  state: State[];
}

type State = {
  name: string;
  city: string[];
}

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
    // make the picture either File or string
    picture: null as File | null,
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
  const [countries, setCountries] = useState<Country[] | null>(null);

  async function fetchCountry() {
    const response = await FetchAllCountries();
    setCountries(response.data);
  }

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
    setImage(user.data.picture);
    setCustomKey(1);
    setSelectedCountryOption(user.data.country ?? "");
    setSelectedStateOption(user.data.state ?? "");
    setSelectedCityOption(user.data.city ?? "");
  }

  useEffect(() => {
    fetchUser();
    fetchCountry();
  }, []);

  const [selectCountryOpen, setSelectCountryOpen] = useState(false);
  const [selectCityOpen, setSelectCityOpen] = useState(false);
  const [selectStateOpen, setSelectStateOpen] = useState(false);

  const [selectedCountryOption, setSelectedCountryOption] = useState("");
  const [selectedStateOption, setSelectedStateOption] = useState("");
  const [selectedCityOption, setSelectedCityOption] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const [customKey, setCustomKey] = useState(0);

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
    const file = e.target.files && e.target.files[0];

    setFormData((prevFormData) => ({
      ...prevFormData,
      picture: e.target.files ? e.target.files[0] : null,
    }));

    if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setImage(reader.result);
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
    console.log(formData);
    e.preventDefault();
    const isFirstNameValid = validateFirstName(formData.firstName);
    const isLastNameValid = validateLastName(formData.lastName);
    const isAgeValid = validateAge(formData.age);
    const isRaceValid = validateRace(formData.race);
    if (isFirstNameValid && isLastNameValid && isAgeValid && isRaceValid) {
      const data = new FormData();
      
      if (formData.username) {
        data.append('username', formData.username);
      }

      if (formData.picture) {
        data.append('picture', formData.picture);
      }

      if (formData.firstName) {
        data.append('firstName', formData.firstName);
      }

      if (formData.lastName) {
        data.append('lastName', formData.lastName);
      }

      if (formData.age) {
        data.append('age', formData.age);
      }

      if (formData.gender) {
        data.append('gender', formData.gender);
      }

      if (formData.race) {
        data.append('race', formData.race);
      }

      if (formData.country) {
        data.append('country', formData.country);
      }

      if (formData.city) {
        data.append('city', formData.city);
      }

      if (formData.state) {
        data.append('state', formData.state);
      }

      UpdateProfileInfo(email ?? '', data);
      console.log("Form Submitted", formData);
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
        <form onSubmit={handleSubmit} className={style.form} key={customKey}>
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
              defaultValue={formData.country ?? ""}
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
                {countries?.map((country, index) => (
                  <Ariakit.SelectItem key={index} className={style.selectItem} value={country.country} onClick={() => {
                    setSelectedCountryOption(country.country);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      country: country.country,
                    }));
                    setSelectCountryOpen(false);
                  }
                  } />
                ))}
              </Ariakit.SelectPopover>
            </Ariakit.SelectProvider>
          </div>

          <div className={style.selectContainer}>
            <Ariakit.SelectProvider setOpen={(open) => {
                setSelectStateOpen(open)
              }}
              setValue={(value) => {
                setSelectedStateOption(value)
              }}
              defaultValue={formData.state ?? ""}
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
                {
                  selectedCountryOption ? countries?.filter(country => country.country === selectedCountryOption)[0].state.map((state, index) => (
                    <Ariakit.SelectItem key={index} className={style.selectItem} value={state.name} onClick={() => {
                      setSelectedStateOption(state.name);
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        state: state.name,
                      }));
                      setSelectStateOpen(false);
                      setSelectedCityOption("");
                    }
                    } />
                  )) : null
                }
              </Ariakit.SelectPopover>
            </Ariakit.SelectProvider>
          </div>

          <div className={style.selectContainer}>
            <Ariakit.SelectProvider setOpen={(open) => {
                setSelectCityOpen(open)
              }}
              setValue={(value) => {
                setSelectedCityOption(value)
              }}
              defaultValue={formData.city ?? ""}
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
                {
                  selectedStateOption ? countries?.filter(country => country.country === selectedCountryOption)[0].state.filter(state => state.name === selectedStateOption)[0].city.map((city, index) => (
                    <Ariakit.SelectItem key={index} className={style.selectItem} value={city} onClick={() => {
                      setSelectedCityOption(city);
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        city: city,
                      }));
                      setSelectCityOpen(false);
                    }
                    } />
                  )) : null
                }
              </Ariakit.SelectPopover>
            </Ariakit.SelectProvider>
          </div>

          {/* Upload Image */}
          <div className={style.imageUploader}>
            <label htmlFor="file" className={style.uploadLabel}>
              {image ? (
                <img src={image} alt="Uploaded" className={style.uploadedImage} />
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
