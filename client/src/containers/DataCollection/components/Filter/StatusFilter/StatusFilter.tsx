import React from "react";
import { Select } from "antd";
import "./StatusFilter.css";

const { Option } = Select;

interface StatusFilterProps {
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  user: string;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  filterStatus,
  setFilterStatus,
  user,
}) => {
  const handleSelectChange = (value: string) => {
    setFilterStatus(value);
  };

  // Declare options variable
  let options: { value: string; label: string }[] = [];

  // Assign options based on user
  if (user === "signexpert") {
    options = [
      { value: "All", label: "All" },
      { value: "New", label: "New" },
      { value: "Awaiting Accept", label: "Awaiting Accept" },
      { value: "In Progress", label: "In Progress" },
      { value: "Awaiting Verification", label: "Awaiting Verification" },
      { value: "Rejected", label: "Rejected" },
      { value: "Verified", label: "Verified" },
    ];
  } else if (user === "admin") {
    options = [
      { value: "All", label: "All" },
      { value: "New", label: "New" },
      { value: "In Progress", label: "In Progress" },
      { value: "Awaiting Verification", label: "Awaiting Verification" },
      { value: "Rejected", label: "Rejected" },
      { value: "Verified", label: "Verified" },
    ];
  }

  return (
    <div className="status-filter">
      <Select
        value={filterStatus}
        onChange={handleSelectChange}
        style={{ width: 140, height: 40 }}
        popupClassName="status-filter-dropdown"
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

export default StatusFilter;
