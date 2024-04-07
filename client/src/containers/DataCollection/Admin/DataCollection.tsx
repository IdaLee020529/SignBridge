import React, { useState, useEffect } from "react";
import CollapsibleForm from "../Components/CollapsibleForm/CollapsibleForm";
import StatusFilter from "../../../components/StatusFilter/StatusFilter";
import OrderFilter from "../../../components/OrderFilter/OrderFilter";
import "./DataCollection.css";
import moment from "moment";

const DataCollection: React.FC = () => {
  const [formData, setFormData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    // Fetch data from backend here
    // Replace the following mock data with actual fetch request
    const mockData = [
      {
        number: "1",
        dateTime: "2023-11-11",
        status: "New",
        name: "John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John DoeJohn DoeJohn Doe John Doe John Doe John Doe ",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        text: "anak ku bodoh",
        videoLink: "testing123.mp4",
        avatarLink: "",
      },
      {
        number: "2",
        dateTime: "2023-10-11",
        status: "In Progress",
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        text: "burung aku sakit",
        videoLink: "testing234.mp4",
      },
    ];
    setFormData(mockData);
  }, []);

  const filterForms = (form: any) => {
    if (filterStatus === "All" || form.status === filterStatus) {
      return true;
    }
    return false;
  };

  const sortForms = (forms: any[]) => {
    const sortedForms = [...forms];
    sortedForms.sort((a, b) => {
      const dateTimeA = moment(a.dateTime);
      const dateTimeB = moment(b.dateTime);

      console.log("sortOrder:", sortOrder);
      console.log("dateTimeA:", dateTimeA.format("YYYY-MM-DD HH:mm:ss")); // Example format
      console.log("dateTimeB:", dateTimeB.format("YYYY-MM-DD HH:mm:ss"));

      if (sortOrder === "asc") {
        return dateTimeA.isBefore(dateTimeB) ? -1 : 1;
      } else if (sortOrder === "desc") {
        return dateTimeB.isBefore(dateTimeA) ? -1 : 1;
      }
      return 0;
    });
    return sortedForms;
  };

  return (
    <div className="dataCollection-bg">
      <div className="filter-container">
        <label htmlFor="status-filter" className="filter-label">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          className="filter-select"
          onChange={(e) => setFilterStatus(e.target.value)}
          value={filterStatus}
        >
          <option value="All">All</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Awaiting Verification">Awaiting Verification</option>
          <option value="Rejected">Rejected</option>
        </select>
        <label htmlFor="status-filter" className="filter-label">
          Filter by Order:
        </label>
        <select
          id="sort-order"
          className="filter-select"
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div>
        {sortForms(formData)
          .filter(filterForms)
          .map((form) => (
            <CollapsibleForm
              key={form.number}
              number={form.number}
              dateTime={
                moment.isMoment(form.dateTime)
                  ? form.dateTime.format("YYYY-MM-DD")
                  : moment(form.dateTime).format("YYYY-MM-DD") // Ensure proper formatting
              }
              status={form.status}
              name={form.name}
              email={form.email}
              phoneNumber={form.phoneNumber}
              text={form.text}
              videoLink={form.videoLink}
              avatar={form.avatarLink}
            />
          ))}
      </div>
    </div>
  );
};

export default DataCollection;
