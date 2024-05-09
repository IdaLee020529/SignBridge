import React, { useState, useEffect } from "react";
import CollapsibleForm from "../CollapsibleForm/CollapsibleForm";
import StatusFilter from "../Filter/StatusFilter/StatusFilter";
import OrderFilter from "../Filter/OrderFilter/OrderFilter";
import "./DatasetReview.css";
import {
  getAllFormsForSignExpert,
  getAllFormsForAdmin,
  updateFormById,
  getFormById,
} from "../../../../services/dataset.service";
interface DatasetReviewProps {
  user: string;
}

const DatasetReview: React.FC<DatasetReviewProps> = ({ user }) => {
  const [formData, setFormData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      const formsData = await fetchForms();
      setFormData(formsData);
    };

    fetchData();
  }, []);

  const handleSubmit = async (
    formId: number,
    updateData: Record<string, string>
  ) => {
    try {
      const finishUpdate = await updateFormById(formId, updateData);
      // Fetch only the updated form data
      if (finishUpdate) {
        const updatedFormData = await getFormById(formId);
        // Update the state with the updated form data
        setFormData((prevFormData) =>
          prevFormData.map((form) =>
            form.form_id === formId ? { ...form, ...updatedFormData } : form
          )
        );
      }
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const fetchForms = async () => {
    try {
      let formsData;
      if (user === "signexpert") {
        formsData = await getAllFormsForSignExpert();
      } else if (user === "admin") {
        formsData = await getAllFormsForAdmin();
      }
      return formsData;
    } catch (error) {
      console.error("Error fetching forms:", error);
      return []; // Return an empty array in case of error
    }
  };

  const sortForms = (forms: any[]) => {
    const sortedForms = [...forms];
    sortedForms.sort((a, b) => {
      const numberA = parseInt(a.number);
      const numberB = parseInt(b.number);

      if (sortOrder === "asc") {
        return numberA - numberB;
      } else if (sortOrder === "desc") {
        return numberB - numberA;
      }
      return 0;
    });
    return sortedForms;
  };

  const filterForms = (form: any) => {
    if (user === "signexpert") {
      if (filterStatus === "All" || form.status_SE === filterStatus) {
        return true;
      }
    } else if (user === "admin") {
      if (filterStatus === "All" || form.status_Admin === filterStatus) {
        return true;
      }
    }
    return false;
  };

  const FormDataRenderer: React.FC<{
    formData: any[];
    user: string;
    handleSubmit: (formId: number, updateData: Record<string, string>) => void;
  }> = ({ formData, user, handleSubmit }) => {
    const filteredForms = sortForms(formData)
      .filter(filterForms)
      .map((form) => (
        <CollapsibleForm
          key={form.form_id}
          number={form.number}
          form_id={form.form_id}
          dateTime={form.submitted_time}
          status={user === "signexpert" ? form.status_SE : form.status_Admin}
          name={form.name}
          email={form.email}
          text={form.text_sentence}
          video_link={form.video_link}
          avatar_link={form.avatar_link}
          user={user}
          user_id={form.user_id}
          video_name={form.video_name}
          handleSubmit={handleSubmit}
        />
      ));

    return <div>{filteredForms}</div>;
  };

  return (
    <div className="dataCollection-bg">
      <div className="filter-container">
        <StatusFilter
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          user={user}
        />
        <OrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>

      <div>
        {formData ? (
          <FormDataRenderer
            formData={formData}
            user={user}
            handleSubmit={handleSubmit}
          />
        ) : null}
      </div>
    </div>
  );
};

export default DatasetReview;
