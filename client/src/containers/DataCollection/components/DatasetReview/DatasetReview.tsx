import React, { useState, useEffect } from "react";
import CollapsibleForm from "../CollapsibleForm/CollapsibleForm";
import StatusFilter from "../Filter/StatusFilter/StatusFilter";
import OrderFilter from "../Filter/OrderFilter/OrderFilter";
import "./DatasetReview.css";
import moment from "moment";
import {
  getAllFormsForSignExpert,
  getAllFormsForAdmin,
} from "../../../../services/dataset.service";

interface DatasetReviewProps {
  user: string;
}

const DatasetReview: React.FC<DatasetReviewProps> = ({ user }) => {
  const [formData, setFormData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (user === "signexpert") {
          const formsData = await getAllFormsForSignExpert();
          setFormData(formsData);
        } else if (user === "admin") {
          const formsData = await getAllFormsForAdmin();
          setFormData(formsData);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms(); // Call the function when the component mounts
  }, []);

  const filterForms = (form: any) => {
    if (user === "signexpert") {
      if (filterStatus === "All" || form.status_SE === filterStatus) {
        return true;
      }
      return false;
    } else if (user === "admin") {
      if (filterStatus === "All" || form.status_admin === filterStatus) {
        return true;
      }
      return false;
    }
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

  interface FormDataRendererProps {
    formData: FormData[];
    user: string;
  }
  // Create a new component called FormDataRenderer
  const FormDataRenderer: React.FC<FormDataRendererProps> = ({
    formData,
    user,
  }) => {
    // Define the logic for sorting and filtering formData based on user
    const filteredForms = sortForms(formData)
      .filter(filterForms)
      .map((form) => (
        <CollapsibleForm
          key={form.form_id}
          number={form.number}
          form_id={form.form_id}
          dateTime={
            // moment.isMoment(form.submitted_time)
            //   ? form.submitted_time.format("YYYY-MM-DD")
            //   : moment(form.submitted_time).format("YYYY-MM-DD")
            form.submitted_time
          }
          // Determine which status to use based on user
          status={user === "signexpert" ? form.status_SE : form.status_Admin}
          name={form.name}
          email={form.email}
          text={form.text_sentence}
          video_link={form.video_link}
          avatar_link={form.avatar_link}
          user={user}
          video_name={form.video_name}
        />
      ));

    return <div>{filteredForms}</div>;
  };

  // Now, in your main component, use FormDataRenderer instead of the mapped JSX
  return (
    <div className="dataCollection-bg">
      <div className="filter-container">
        <StatusFilter
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        <OrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>

      {/* Use FormDataRenderer component */}
      <div>
        {user ? <FormDataRenderer formData={formData} user={user} /> : null}
      </div>
    </div>
  );
};

export default DatasetReview;
