import React, { useEffect } from "react";
import { Select } from "antd";
import style from "./FeedbackFieldsFilter.module.css"
import { useFeedbackSortFilterStore } from "../../../../../store/feedbackSortFilter";


const { Option } = Select;

interface FieldsFilterProps {
  sortData: () => void;
}

const FieldsFilterProps: React.FC<FieldsFilterProps> = ({ sortData }) => {
  const store = useFeedbackSortFilterStore();

  const handleSelectChange = (value: string) => {
    store.setFields(value);

		if (value === "Category") {
			store.setFilterBy("whole website");
			store.setSortBy("");
		} else if (value === "Status") {
			store.setFilterBy("new");
			store.setSortBy("");
		} else {
      store.setFilterBy("");
      store.setSortBy("asc");
    }

    // sortData();
  };

  useEffect(() => {
    sortData();
  }, [store.field,store.sortBy, store.filterBy]);

  const options = [
    { value: "ID", label: "ID" },
    { value: "Name", label: "Name" },
    { value: "Age", label: "Age" },
    { value: "Category", label: "Category" },
    { value: "Status", label: "Status" },
  ];

  return (
    <div className={style.fields_filter}>
      <Select
        value={store.field}
        onChange={handleSelectChange}
        style={{ width: 140, height: 40 }}
        popupClassName={style.fields_filter_dropdown} // Added custom class
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FieldsFilterProps;