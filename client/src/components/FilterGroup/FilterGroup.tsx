// FilterGroup.tsx
import React from "react";
import FilterButton from "../FilterButton/FilterButton";

interface FilterGroupProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <div className="filter-group">
      <label htmlFor={label.toLowerCase()} className="filter-label">
        {label}:
      </label>
      <div className="filter-buttons">
        {options.map((option) => (
          <FilterButton
            key={option}
            label={option}
            isActive={selectedOption === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
