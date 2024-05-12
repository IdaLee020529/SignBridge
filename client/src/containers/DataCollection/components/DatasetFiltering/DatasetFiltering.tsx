// DatasetFiltering.tsx
import React from "react";
import { Select } from "antd";
import StatusFilter from "../Filter/StatusFilter/StatusFilter"; // Importing StatusFilter component
import OrderFilter from "../Filter/OrderFilter/OrderFilter";

const { Option } = Select;

interface DatasetFilteringProps {
  filterFunction: string;
  setFilterFunction: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  user: string;
}

const DatasetFiltering: React.FC<DatasetFilteringProps> = ({
  filterFunction,
  setFilterFunction,
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
  user,
}) => {
  const handleFilterFunctionChange = (value: string) => {
    setFilterFunction(value);
  };

  return (
    <div>
      <label htmlFor="filterFunction"></label>
      <Select
        id="filterFunction"
        value={filterFunction}
        onChange={handleFilterFunctionChange}
        style={{ width: 200 }}
      >
        <Option value="status">Status</Option>
        <Option value="number">Number</Option>
        <Option value="datetime">Date & Time</Option>
      </Select>
      {filterFunction === "status" ? (
        // Render StatusFilter if filterFunction is "status"
        <StatusFilter
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          user={user}
        />
      ) : filterFunction === "number" ? (
        // Render OrderFilter if filterFunction is "number"
        <OrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
      ) : filterFunction === "datetime" ? (
        // Render a JSX element for datetime
        <OrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
      ) : null}
    </div>
  );
};

export default DatasetFiltering;
