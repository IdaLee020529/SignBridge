import React, { useEffect } from "react";
import { Select } from "antd";
import style from "./FeedbackOrderSorting.module.css";
import { useFeedbackSortFilterStore } from "../../../../../store/feedbackSortFilter";

const { Option } = Select;

interface OrderFilterProps {
  sortData: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ sortData }) => {
  const store = useFeedbackSortFilterStore();

  const handleSelectChange = (value: string) => {
    if (store.field === "Category" || store.field === "Status") {
      // console.log("Filter by", value);
      store.setFilterBy(value);
      store.setSortBy("");
    } else {
      // console.log("Sort by", value);
      store.setSortBy(value);
      store.setFilterBy("");
    }
    
    // sortData();
  };

  useEffect(() => {
    sortData();
  }, [store.field,store.sortBy, store.filterBy]);

  // useEffect(() => {
  //   if (selectedField === "Category") {
  //     setSortOrder("whole website");
  //   }
  //   else if (selectedField === "Status") {
  //     setSortOrder("new");
  //   } else {
  //     setSortOrder("asc");
  //   }
  // }, [selectedField]); // Run effect when selectedField changes

  return (
    <div className={style.order_filter}>
      <Select
        value={store.sortBy !== "" ? store.sortBy : store.filterBy}
        onChange={handleSelectChange}
        style={{ width: 140, height: 40 }}
        popupClassName={style.order_filter_dropdown}
        placeholder="Select order"
      >
        {/* Options based on selected field */}
        {store.field === "Category" ? (
          <>
            <Option value="whole website">Whole Website</Option>
            <Option value="game1">Game1</Option>
            <Option value="game2">Game2</Option>
          </>
        ) : store.field === "Status" ? (
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
