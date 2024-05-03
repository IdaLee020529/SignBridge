import React from "react";
import { Select } from "antd";
import "./StatusFilter.css";

const { Option } = Select;

interface StatusFilterProps {
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  filterStatus,
  setFilterStatus,
}) => {
  const handleSelectChange = (value: string) => {
    setFilterStatus(value);
  };

  const options = [
    { value: "All", label: "All" },
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Awaiting Verification", label: "Awaiting Verification" },
    { value: "Rejected", label: "Rejected" },
  ];

  return (
    <div className="status-filter">
      <h3 style={{ marginLeft: 5 }}>Status:</h3>
      <Select
        value={filterStatus}
        onChange={handleSelectChange}
        style={{ width: 200, height: 50 }}
        dropdownClassName="status-filter-dropdown" // Added custom class
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

// StatusFilter.tsx
// import React, { useState } from "react";
// import FilterSelect from "../FilterSelect/FilterSelect";
// import "./StatusFilter.css";

// const StatusFilter: React.FC = () => {
//   const [isActive, setIsActive] = useState(false);

//   const toggleMenu = () => {
//     setIsActive(!isActive);
//   };

//   const options = [
//     { text: "All" },
//     {
//       text: "New",
//     },
//     {
//       text: "In Progress",
//     },
//     {
//       text: "Awaiting Verification",
//     },
//     { text: "Rejected" },
//   ];

//   return (
//     <div className={`select-menu ${isActive ? "active" : ""}`}>
//       <div className="select-btn" onClick={toggleMenu}>
//         <span className="sBtn-text">Filter by Status</span>
//         <i className="bx bx-chevron-down"></i>
//       </div>
//       <FilterSelect options={options} />
//     </div>
//   );
// };

// export default StatusFilter;
