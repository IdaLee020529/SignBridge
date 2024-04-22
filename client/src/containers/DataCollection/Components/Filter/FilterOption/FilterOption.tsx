// import React from "react";
// import "./FilterOption.css";
// interface FilterOptionProps {
//   text: string;
// }

// const FilterOption: React.FC<FilterOptionProps> = ({ text }) => {
//   return (
//     <li className="option">
//       <i className="bx bxl-github"></i>
//       <span className="option-text">{text}</span>
//     </li>
//   );
// };

// export default FilterOption;
// // FilterOption.tsx

import React from "react";
import "./FilterOption.css";
interface FilterOptionProps {
  value: string;
  label: string;
}

const FilterOption: React.FC<FilterOptionProps> = ({ value, label }) => {
  return (
    <option className="filter-option" value={value}>
      {label}
    </option>
  );
};

export default FilterOption;

// FilterOption.tsx
// import React from "react";
// import "./FilterOption.css";

// interface FilterOptionProps {
//   text: string;
// }

// const FilterOption: React.FC<FilterOptionProps> = ({ text }) => {
//   return (
//     <li className="option">
//       <span className="option-text">{text}</span>
//     </li>
//   );
// };

// export default FilterOption;
