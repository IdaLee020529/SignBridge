import React from "react";
import { Select } from "antd";
import style from "./FeedbackFieldsFilter.module.css"

const { Option } = Select;

interface FieldsFilterProps {
  filterFields: string;
  setFilterFields: (value: string) => void;
  sortData: (data: any) => any;
  setSortOrder: (value: string) => void;
}

const FieldsFilterProps: React.FC<FieldsFilterProps> = ({
    filterFields,
    setFilterFields,
    sortData,
    setSortOrder,
}) => {
  const handleSelectChange = (value: string) => {
    setFilterFields(value);
    // sortData(value);
  };

  const options = [
    { value: "ID", label: "ID" },
    { value: "Name", label: "Name" },
    { value: "Age", label: "Age" },
    { value: "Category", label: "Category" },
    { value: "Status", label: "Status" },
  ];

  return (
    <div className={style.fields_filter}>
      <Select
        value={filterFields}
        onChange={handleSelectChange}
        style={{ width: 140, height: 40 }}
        popupClassName={style.fields_filter_dropdown} // Added custom class
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FieldsFilterProps;