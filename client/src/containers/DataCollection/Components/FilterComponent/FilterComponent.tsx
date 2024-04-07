// FilterComponent.tsx
import React from "react";
import FilterGroup from "../../../../components/FilterGroup/FilterGroup";

interface FilterComponentProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
}) => {
  const statusOptions = [
    "All",
    "New",
    "In Progress",
    "Awaiting Verification",
    "Rejected",
  ];
  const orderOptions = ["asc", "desc"];

  return (
    <div className="horizontal-filters">
      <FilterGroup
        label="Status"
        options={statusOptions}
        selectedOption={filterStatus}
        onSelect={setFilterStatus}
      />
      <FilterGroup
        label="Order"
        options={orderOptions.map((option) =>
          option === "asc" ? "Ascending" : "Descending"
        )} // Updated to match the expected label format
        selectedOption={sortOrder === "asc" ? "Ascending" : "Descending"}
        onSelect={(option) => setSortOrder(option)}
      />
    </div>
  );
};

export default FilterComponent;
