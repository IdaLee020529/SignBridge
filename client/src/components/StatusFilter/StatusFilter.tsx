// StatusFilter.tsx
import React from "react";
import FilterGroup from "../FilterGroup/FilterGroup";

interface StatusFilterProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  filterStatus,
  setFilterStatus,
}) => {
  const statusOptions = [
    "All",
    "New",
    "In Progress",
    "Awaiting Verification",
    "Rejected",
  ];

  return (
    <FilterGroup
      label="Status"
      options={statusOptions}
      selectedOption={filterStatus}
      onSelect={setFilterStatus}
    />
  );
};

export default StatusFilter;
