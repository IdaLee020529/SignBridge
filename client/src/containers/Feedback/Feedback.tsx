import style from "./Feedback.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import RatingEmoji from "../../components/RatingEmoji/RatingEmoji";
import ImageInput from "../../components/ImageInput/ImageInput";
import { useNavigate } from "react-router-dom";

import { CreateFeedback } from "../../services/feedback.service";

const Feedback = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: null,
    gender: "male",
    phoneNo: "",
    email: "",
    fcategory: "Whole Website",
    experience: 5,
    friendliness: 5,
    quality: 5,
    recommended: 5,
    question1: "",
    question2: "",
    question3: "",
    screenshot: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phoneNo: "",
    email: "",
    fcategory: "",
  });

  const questionMapping = {
    "Whole Website": {
      question1: "Which feature of the website do you prefer the most?",
      question2: "What should we change to improve the overall experience?",
      question3: "Any other feedback or suggestions?",
    },
    "Game 1": {
      question1: "What do you like most about Game 1?",
      question2: "What improvements would you suggest for Game 1?",
      question3: "Any other comments or suggestions for Game 1?",
    },
    "Game 2": {
      question1: "What features of Game 2 do you find most appealing?",
      question2: "How can we enhance your experience with Game 2?",
      question3: "Any other feedback or ideas for Game 2?",
    },
  };

  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [resetImage, setResetImage] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement >) => {
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

    switch (name) {
      case 'firstName':
        isValid = validateFirstName(value);
        break;
      case 'lastName':
        isValid = validateLastName(value);
        break;
      case 'age':
        isValid = validateAge(value ? +value : 0);
        break;
      case 'phoneNo':
        isValid = validatePhoneNo(value);
        break;
      case 'email':
        isValid = validateEmail(value);
        break;
      default:
        break;
    }
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, fcategory: selectedCategory });
  };

  const handleDropdownClick = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  // ---------- Validations ----------
  const validateFirstName = (value: string) => {
    if (!value.trim()) {
      setFormErrors((prev) => ({ ...prev, firstName: "First name is required" }));
      return false;
    } else if (value.length < 3) {
      setFormErrors((prev) => ({ ...prev, firstName: "First name must be at least 3 characters long" }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, firstName: "" }));
    return true;
  };
  
  const validateLastName = (value: string) => {
    if (!value.trim()) {
      setFormErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
      return false;
    } else if (value.length < 3) {
      setFormErrors((prev) => ({ ...prev, lastName: "Last name must be at least 3 characters long" }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, lastName: "" }));
    return true;
  };
  
  const validateAge = (value: number) => {
    if (!value) {
      setFormErrors((prev) => ({ ...prev, age: "Age is required" }));
      return false;
    } else if (+value < 2 || +value > 150 || isNaN(+value)) {
      setFormErrors((prev) => ({ ...prev, age: "Age must be between 2 and 150" }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, age: "" }));
    return true;
  };
  
  const validatePhoneNo = (value: string) => {
    const phoneNoRegex = /^\d{3}-\d{3}-\d{4}$|^\d{3}-\d{4}-\d{4}$/;
    if (!value.trim()) {
      setFormErrors((prev) => ({ ...prev, phoneNo: "Phone number is required" }));
      return false;
    } else if (!phoneNoRegex.test(value)) {
      setFormErrors((prev) => ({ ...prev, phoneNo: "Invalid phone number format" }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, phoneNo: "" }));
    return true;
  };
  
  const validateEmail = (value: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!value.trim()) {
      setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!emailRegex.test(value)) {
      setFormErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  // ---------- Handle form submission ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFirstNameValid = validateFirstName(formData.firstName);
    const isLastNameValid = validateLastName(formData.lastName);
    const isAgeValid = validateAge(formData.age || 0);
    const isPhoneNoValid = validatePhoneNo(formData.phoneNo);
    const isEmailValid = validateEmail(formData.email);

    if (isFirstNameValid && isLastNameValid && isAgeValid && isEmailValid && isPhoneNoValid ) {
      await CreateFeedback(formData);
      handleFormReset();
      navigate("/feedback-success");
      

      toast.success("Feedback submitted successfully!");
    } else {
      toast.error("Please fill in the form correctly!");
    }
  };

  // ---------- Handle form reset ----------
  const handleFormReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      age: null,
      gender: "male",
      phoneNo: "",
      email: "",
      fcategory: "Whole Website",
      experience: 5,
      friendliness: 5,
      quality: 5,
      recommended: 5,
      question1: "",
      question2: "",
      question3: "",
      screenshot: "",
    });
    
    setResetImage(true);

    setFormErrors({
      firstName: "",
      lastName: "",
      age: "",
      phoneNo: "",
      email: "",
      fcategory: "",
    });
  };

  const handleImageReset = () => {
    setResetImage(false); 
  };

  return (
    <>
      <div className={style.feedback_header_container}>
        <h1 className={style.feedback_heading}>Feedback Us</h1>
        <p className={style.feedback_subheading}>We would love to hear your thoughts, concerns or problems with anything so we can improve! Thank you!</p>
      </div>
      <div className={style.feedback_container}>
        {/* Feedback Form */}
        <div className={style.feedback_box}>
          <form id="feedbackForm" onSubmit={handleSubmit}>
            <legend className={style.feedback_legend}>Personal Details</legend>
            <fieldset className={style.feedback_fieldset}>
              <div className={style.feedback_row}>
                <div className={style.feedback_input}>
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" maxLength={25} value={formData.firstName} onChange={handleFormChange} />
                  {formErrors.firstName.length > 0 && <div className={style.feedback_error}>{formErrors.firstName}</div>}
                </div>

                <div className={style.feedback_input}>
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" maxLength={25} value={formData.lastName} onChange={handleFormChange} />
                  {formErrors.lastName && <div className={style.feedback_error}>{formErrors.lastName}</div>}
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input}>
                  <label>Age</label>
                  <input type="text" id="age" name="age" max={150} min={2} value={formData.age || ""} onChange={handleFormChange} />
                  {formErrors.age && <div className={style.feedback_error}>{formErrors.age}</div>}
                </div>

                <div className={style.feedback_input}>
                  <label>Gender</label>
                  <div className={style.gender}>
                    <input type="radio" name="gender" id="male" value="male" onChange={handleFormChange} checked={formData.gender === "male"} /><label htmlFor="male"> Male</label>
                    <input type="radio" name="gender" id="female" value="female" className="female" onChange={handleFormChange} /><label htmlFor="female"> Female</label>
                  </div>
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input}>
                  <label>Email Address</label>
                  <input type="text" name="email" id="email" value={formData.email} onChange={handleFormChange} />
                  {formErrors.email && <div className={style.feedback_error}>{formErrors.email}</div>}
                </div>

                <div className={style.feedback_input}>
                  <label>Phone Number</label>
                  <input type="text" id="phoneNo" name="phoneNo" maxLength={15} value={formData.phoneNo} onChange={handleFormChange} />
                  {formErrors.phoneNo && <div className={style.feedback_error}>{formErrors.phoneNo}</div>}
                </div>
              </div>
            </fieldset>

            <legend className={style.feedback_legend}>Rating</legend>
            <fieldset className={style.feedback_fieldset}>
              <div className={style.feedback_row}>
                <div className={`${style.feedback_input} ${isOpenDropdown ? `${style.open}` : ""}`}>
                  <label>Feedback Category</label>
                  <div className={style.select_wrapper}>
                    <select id="fcategory" className={style.fcategory} onChange={handleSelectChange} onClick={handleDropdownClick} value={formData.fcategory}>
                      {/* dropdown */}
                      <option value="Whole Website">Whole Website</option>
                      <option value="Game 1">Game 1 - Guess The Word</option>
                      <option value="Game 2">Game 2 - Do The Sign</option>
                    </select>
                    <div className={style.arrow_down}></div>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Rating Emoji */}
            <fieldset className={style.feedback_fieldset}>
              <div className={style.feedback_row}>
                <div className={style.feedback_input2}>
                  <label>Experience</label>
                  <div className={style.rating_emojis}>
                    <RatingEmoji type="radio" name="experience" className="super_happy" id="super-happy" value={5} onChange={handleFormChange} checked={formData.experience === 5} />
                    <RatingEmoji type="radio" name="experience" className="happy" id="happy" value={4} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="experience" className="neutral" id="neutral" value={3} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="experience" className="sad" id="sad" value={2} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="experience" className="super_sad" id="super-sad" value={1} onChange={handleFormChange} />
                  </div>
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input2}>
                  <label>Friendliness</label>
                  <div className={style.rating_emojis}>
                    <RatingEmoji type="radio" name="friendliness" className="super_happy" id="super-happy1" value={5} onChange={handleFormChange} checked={formData.friendliness === 5} />
                    <RatingEmoji type="radio" name="friendliness" className="happy" id="happy1" value={4} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="friendliness" className="neutral" id="neutral1" value={3} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="friendliness" className="sad" id="sad1" value={2} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="friendliness" className="super_sad" id="super-sad1" value={1} onChange={handleFormChange} />
                  </div>
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input2}>
                  <label>Quality</label>
                  <div className={style.rating_emojis}>
                    <RatingEmoji type="radio" name="quality" className="super_happy" id="super-happy2" value={5} onChange={handleFormChange} checked={formData.quality === 5} />
                    <RatingEmoji type="radio" name="quality" className="happy" id="happy2" value={4} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="quality" className="neutral" id="neutral2" value={3} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="quality" className="sad" id="sad2" value={2} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="quality" className="super_sad" id="super-sad2" value={1} onChange={handleFormChange} />
                  </div>
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input2}>
                  <label>Recommended</label>
                  <div className={style.rating_emojis}>
                    <RatingEmoji type="radio" name="recommended" className="super_happy" id="super-happy3" value={5} onChange={handleFormChange} checked={formData.recommended === 5} />
                    <RatingEmoji type="radio" name="recommended" className="happy" id="happy3" value={4} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="recommended" className="neutral" id="neutral3" value={3} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="recommended" className="sad" id="sad3" value={2} onChange={handleFormChange} />
                    <RatingEmoji type="radio" name="recommended" className="super_sad" id="super-sad3" value={1} onChange={handleFormChange} />
                  </div>
                </div>
              </div>
            </fieldset>

            <legend className={style.feedback_legend}>Comments</legend>
            <fieldset className={style.feedback_fieldset}>
              <div className={style.feedback_row}>
                <div className={style.feedback_input}>
                  <label htmlFor="question1">{questionMapping[formData.fcategory as keyof typeof questionMapping]?.question1}</label>
                  <textarea id="question1" name="question1" value={formData.question1} onChange={handleFormChange} />
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input}>
                  <label htmlFor="question2">{questionMapping[formData.fcategory as keyof typeof questionMapping]?.question2}</label>
                  <textarea id="question2" name="question2" value={formData.question2} onChange={handleFormChange} />
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input}>
                  <label htmlFor="question3">{questionMapping[formData.fcategory as keyof typeof questionMapping]?.question3}</label>
                  <textarea id="question3" name="question3" value={formData.question3} onChange={handleFormChange} />
                </div>
              </div>

              <div className={style.feedback_row}>
                <div className={style.feedback_input}>
                  <label>Issues Faced Screenshot</label>
                  <ImageInput reset={resetImage} onReset={handleImageReset} />
                </div>
              </div>
            </fieldset>

            {/* Submit and Reset */}
            <div className={style.wrap}>
              <button type="reset" id="reset_button" className={style.cancel} onClick={handleFormReset}>Reset</button>
              <br /><button type="submit" id="submit_button" className={style.submit} name="submit_button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Feedback;