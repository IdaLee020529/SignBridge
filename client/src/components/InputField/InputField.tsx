import React, { ChangeEvent } from "react";
import "./InputField.css";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value: string;
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multipleLines?: boolean;
  error: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder = " ",
  type = "text",
  value = "",
  onChange,
  error,
  id,
  multipleLines = false,
}) => {
  // const [error, setError] = useState<string | undefined>(undefined);

  // const handleChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { value } = e.target;
  //   const validationError = validate ? validate(value) : undefined;
  //   setError(validationError);
  //   onChange(e);
  // };

  const inputElement = multipleLines ? (
    <textarea
      className={`form-control ${error ? "is-invalid" : ""} multipleLines`}
      placeholder={placeholder}
      name={name}
      value={value}
      id={id}
      onChange={onChange}
    />
  ) : (
    <input
      className={`form-control ${error ? "is-invalid" : ""}`}
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      id={id}
      onChange={onChange}
    />
  );

  return (
    <div className={`form-group ${error ? "is-invalid" : ""}`}>
      {inputElement}
      <label className={`input-label ${multipleLines ? "multiple_label" : ""}`}>
        {label}:
      </label>
      <div className={`form-error ${error ? "is-invalid" : ""}`}>{error}</div>
    </div>
  );
};

export default InputField;
