import React, { useState, useEffect } from "react";
import CollapsibleForm from "../../components/CollapsibleForm/CollapsibleForm";
import StatusFilter from "../../components/Filter/StatusFilter/StatusFilter";
import OrderFilter from "../../components/Filter/OrderFilter/OrderFilter";
import "./DataFormReview.css";
import moment from "moment";

const DataFormReview: React.FC = () => {
  const [formData, setFormData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    // Fetch data from backend here
    // Replace the following mock data with actual fetch request
    const mockData = [
      {
        number: "1",
        dateTime: "2024-02-11",
        status: "New",
        name: "John Dave",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum reiciendis ut neque vero culpa omnis ratione ea earum, provident tenetur? Eveniet non a accusamus nisi blanditiis fuga pariatur quia maiores?",
        videoLink: "testing234.mp4",
      },
      {
        number: "2",
        dateTime: "2023-10-11",
        status: "In Progress",
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum reiciendis ut neque vero culpa omnis ratione ea earum, provident tenetur? Eveniet non a accusamus nisi blanditiis fuga pariatur quia maiores?",
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

  // const sortForms = (forms: any[]) => {
  //   const sortedForms = [...forms];
  //   sortedForms.sort((a, b) => {
  //     const dateTimeA = moment(a.dateTime);
  //     const dateTimeB = moment(b.dateTime);

  //     console.log("sortOrder:", sortOrder);
  //     console.log("dateTimeA:", dateTimeA.format("YYYY-MM-DD HH:mm:ss")); // Example format
  //     console.log("dateTimeB:", dateTimeB.format("YYYY-MM-DD HH:mm:ss"));

  //     if (sortOrder === "asc") {
  //       return dateTimeA.isBefore(dateTimeB) ? -1 : 1;
  //     } else if (sortOrder === "desc") {
  //       return dateTimeB.isBefore(dateTimeA) ? -1 : 1;
  //     }
  //     return 0;
  //   });
  //   return sortedForms;
  // };

  const sortForms = (forms: any[]) => {
    const sortedForms = [...forms];
    sortedForms.sort((a, b) => {
      const numberA = parseInt(a.number);
      const numberB = parseInt(b.number);

      console.log("sortOrder:", sortOrder);
      console.log("numberA:", numberA);
      console.log("numberB:", numberB);

      if (sortOrder === "asc") {
        return numberA - numberB;
      } else if (sortOrder === "desc") {
        return numberB - numberA;
      }
      return 0;
    });
    return sortedForms;
  };

  return (
    <div className="dataCollection-bg">
      <div className="filter-container">
        <StatusFilter
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        <OrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
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
              // phoneNumber={form.phoneNumber}
              text={form.text}
              videoLink={form.videoLink}
              avatarLink={form.avatarLink}
              user="signexpert"
            />
          ))}
      </div>
    </div>
  );
};

export default DataFormReview;
