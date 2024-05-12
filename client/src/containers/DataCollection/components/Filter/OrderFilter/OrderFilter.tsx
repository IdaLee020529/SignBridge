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
      <Select
        value={sortOrder}
        onChange={handleSelectChange}
        popupClassName="order-filter-dropdown"
        placeholder="Select order"
        style={{ width: 140, height: 40 }}
      >
        <Option value="asc">Ascending</Option>
        <Option value="desc">Descending</Option>
      </Select>
    </div>
  );
};

export default OrderFilter;
