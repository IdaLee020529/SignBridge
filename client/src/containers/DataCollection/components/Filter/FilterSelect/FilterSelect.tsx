// FilterSelect.tsx
import React from "react";
import FilterOption from "../FilterOption/FilterOption";
import "./FilterSelect.css";

interface FilterSelectProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  onSelectChange: (value: string) => void;
  selectedValue: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  id,
  label,
  options,
  onSelectChange,
  selectedValue,
}) => {
  return (
    <div className="filter">
      <label htmlFor={id} className="filter-label">
        {label}:
      </label>
      <div className="filter-group">
        <select
          id={id}
          className="filter-select"
          onChange={(e) => onSelectChange(e.target.value)}
          value={selectedValue}
        >
          {options.map((option) => (
            <FilterOption
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSelect;

// FilterSelect.tsx
// import React from "react";
// import FilterOption from "../FilterOption/FilterOption";
// import "./FilterSelect.css";

// interface FilterSelectProps {
//   options: { text: string }[];
// }

// const FilterSelect: React.FC<FilterSelectProps> = ({ options }) => {
//   return (
//     <ul className="options">
//       {options.map((option, index) => (
//         <FilterOption key={index} text={option.text} />
//       ))}
//     </ul>
//   );
// };

// export default FilterSelect;
