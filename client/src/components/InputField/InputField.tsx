import React, { useState, ChangeEvent } from "react";
import "./InputField.css";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
  multipleLines?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder = " ",
  type = "text",
  value = "",
  onChange,
  style = {},
  multipleLines = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleValidation = () => {
    if (name === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValidEmail) {
        setError("Please enter a valid email address");
        return false;
      }
    }
    // Add more validation checks for other fields if needed
    return true;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e);
    setError(null); // Clear error message on change
  };

  const inputElement = multipleLines ? (
    <textarea
      className={`form-control ${error ? "is-invalid" : ""} multipleLines`}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={handleChange}
      style={style}
    />
  ) : (
    <input
      className={`form-control ${error ? "is-invalid" : ""}`}
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      style={style}
    />
  );

  return (
    <div className="form-group">
      {inputElement}
      <label className={`input-label ${multipleLines ? "multiple_label" : ""}`}>
        {label}:
      </label>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;
