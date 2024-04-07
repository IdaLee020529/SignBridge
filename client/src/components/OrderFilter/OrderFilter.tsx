// OrderFilter.tsx
import React from "react";
import FilterGroup from "../FilterGroup/FilterGroup";

interface OrderFilterProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  sortOrder,
  setSortOrder,
}) => {
  const orderOptions = ["asc", "desc"];

  return (
    <FilterGroup
      label="Order"
      options={orderOptions.map((option) =>
        option === "asc" ? "Ascending" : "Descending"
      )}
      selectedOption={sortOrder === "asc" ? "Ascending" : "Descending"}
      onSelect={(option) => setSortOrder(option)}
    />
  );
};

export default OrderFilter;
