// FilterButton.tsx
import React from "react";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button className={isActive ? "active" : ""} onClick={onClick}>
      {label}
    </button>
  );
};

export default FilterButton;
