import React, { useEffect } from "react";
import { Select } from "antd";
import style from "./FeedbackOrderSorting.module.css";

const { Option } = Select;

interface OrderFilterProps {
  sortOrder: string;
  setSortOrder: (value: string) => void;
  selectedField: string;
  sortData: (data: any) => any;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  sortOrder,
  setSortOrder,
  selectedField,
  sortData,
}) => {
  const handleSelectChange = (value: string) => {
    setSortOrder(value);
    sortData(value);
  };

  useEffect(() => {
    if (selectedField === "Category") {
      setSortOrder("whole website");
    }
    else if (selectedField === "Status") {
      setSortOrder("new");
    } else {
      setSortOrder("asc");
    }
  }, [selectedField]); // Run effect when selectedField changes

  return (
    <div className={style.order_filter}>
      <Select
        value={sortOrder}
        onChange={handleSelectChange}
        style={{ width: 140, height: 40 }}
        popupClassName={style.order_filter_dropdown}
        placeholder="Select order"
      >
        {/* Options based on selected field */}
        {selectedField === "Category" ? (
          <>
            <Option value="whole website">Whole Website</Option>
            <Option value="game1">Game1</Option>
            <Option value="game2">Game2</Option>
          </>
        ) : selectedField === "Status" ? (
          <>
            <Option value="new">New</Option>
            <Option value="viewed">Viewed</Option>
          </>
        ) : (
          <>
            <Option value="asc">Ascending</Option>
            <Option value="desc">Descending</Option>
          </>
        )}
      </Select>
    </div>
  );
};

export default OrderFilter;
