import React, { useState, useEffect } from "react";
import CollapsibleForm from "../CollapsibleForm/CollapsibleForm";
import moment from "moment";
import "./DatasetReview.css";
import {
  getAllFormsForSignExpert,
  getAllFormsForAdmin,
  updateFormById,
  getFormById,
  updateFormWithVideoById,
  deleteFormById,
} from "../../../../services/dataset.service";
import DatasetFiltering from "../DatasetFiltering/DatasetFiltering";
import TablePagination from "@mui/material/TablePagination";

interface DatasetReviewProps {
  user: string;
}

const DatasetReview: React.FC<DatasetReviewProps> = ({ user }) => {
  const [formData, setFormData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterOption, setFilterOption] = useState("number");
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const formsData = await fetchForms();
      setFormData(formsData);
    };

    fetchData();
  }, []);

  const handleSubmit = async (
    formId: number,
    updateData?: Record<string, string>,
    video?: any
  ) => {
    try {
      let finishUpdate;
      if (updateData) {
        if (video) {
          finishUpdate = await updateFormWithVideoById(
            formId,
            updateData,
            video
          );
        } else {
          finishUpdate = await updateFormById(formId, updateData);
        }
      }

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

  const handleDelete = async (formId: number) => {
    try {
      await deleteFormById(formId);
      setFormData((prevFormData) =>
        prevFormData.filter((form) => form.form_id !== formId)
      );
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
    if (filterOption === "number") {
      sortedForms.sort((a, b) => {
        const numberA = parseInt(a.form_id);
        const numberB = parseInt(b.form_id);

        if (sortOrder === "asc") {
          return numberA - numberB;
        } else if (sortOrder === "desc") {
          return numberB - numberA;
        }
        return 0;
      });
    } else if (filterOption === "datetime") {
      sortedForms.sort((a, b) => {
        const datetimeA = moment(a.submitted_time);
        const datetimeB = moment(b.submitted_time);

        if (sortOrder === "asc") {
          return datetimeA.diff(datetimeB);
        } else if (sortOrder === "desc") {
          return datetimeB.diff(datetimeA);
        }
        return 0;
      });
    }

    return sortedForms;
  };
  const filterForms = (form: any) => {
    if (filterOption === "status") {
      if (user === "signexpert") {
        return filterStatus === "All" || form.status_SE === filterStatus;
      } else if (user === "admin") {
        return filterStatus === "All" || form.status_Admin === filterStatus;
      }
    }
    return true; // Return true by default if filterOption is not "status"
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginationCount = formData.length; // Use formData instead of store.modifiedData

  const FormDataRenderer: React.FC<{
    formData: any[];
    user: string;
    handleSubmit: (formId: number, updateData: Record<string, string>) => void;
  }> = ({ formData, user, handleSubmit }) => {
    return formData
      .filter(filterForms)
      .map((form, index) => (
        <CollapsibleForm
          key={form.form_id}
          number={form.form_id}
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
          avatar_name={form.avatar_name}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
        />
      ));
  };

  return (
    <div className="dataCollection-bg">
      <h1>Dataset Collection Review</h1>
      <div className="filter-container">
        <DatasetFiltering
          filterFunction={filterOption}
          setFilterFunction={setFilterOption}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          user={user}
        />
        {formData ? (
          <FormDataRenderer
            formData={sortForms(formData)} // Apply sorting to formData
            user={user}
            handleSubmit={handleSubmit}
          />
        ) : null}
        <TablePagination
          component="div"
          count={paginationCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default DatasetReview;
