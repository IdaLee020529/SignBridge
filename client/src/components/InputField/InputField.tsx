import React, { CSSProperties, ChangeEvent, useState } from "react";
import "./InputField.css";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  style?: CSSProperties;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder = " ",
  type = "text",
  value = "",
  onChange,
  style = {},
}) => {
  const [labelClicked, setLabelClicked] = useState(false);

  const handleLabelClick = () => {
    setLabelClicked(true);
  };
  return (
    <div className="form-group">
      <input
        className="form-control"
        placeholder=" "
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      <label className="input-label">{label}:</label>
    </div>
  );
};

export default InputField;
