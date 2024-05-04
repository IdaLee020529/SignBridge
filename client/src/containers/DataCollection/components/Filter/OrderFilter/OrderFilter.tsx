import React from "react";
import { Select } from "antd";
import "./OrderFilter.css";

const { Option } = Select;

interface OrderFilterProps {
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  sortOrder,
  setSortOrder,
}) => {
  const handleSelectChange = (value: string) => {
    setSortOrder(value);
  };

  return (
    <div className="order-filter">
      <h3 style={{ marginLeft: 5 }}>Order:</h3>
      <Select
        value={sortOrder}
        onChange={handleSelectChange}
        style={{ width: 200, height: 50 }}
        popupClassName="order-filter-dropdown"
        placeholder="Select order"
      >
        <Option value="asc">Ascending</Option>
        <Option value="desc">Descending</Option>
      </Select>
    </div>
  );
};

export default OrderFilter;
