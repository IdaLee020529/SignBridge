import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CollapsibleContainer from "../components/CollapsibleContainer/CollapsibleContainer";
import FeedbackOrderFilter from "../components/Filter/FeedbackOrderSorting/FeedbackOrderSorting";
import FeedbackFieldsFilter from "../components/Filter/FeedbackFieldsFilter/FeedbackFieldsFilter";
import TablePagination from '@mui/material/TablePagination';
import style from "./FeedbackAdmin.module.css";
import { GetFeedback, UpdateFeedback } from "../../../services/feedback.service";
import { useFeedbackSortFilterStore } from "../../../store/feedbackSortFilter";

const FeedbackAdmin: React.FC = () => {
  const store = useFeedbackSortFilterStore();

  const [collapsibleData, setCollapsibleData] = useState<any[]>([]);
  const [modifiedCollapsibleData, setModifiedCollapsibleData] = useState<any[]>([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch data from server
  useEffect(() => {
    setLoading(true);
    GetFeedback()
      .then((res) => {
        setCollapsibleData(res.data);
        setModifiedCollapsibleData(res.data);
        store.setData(res.data);
        store.setModifiedData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // a function to format the date to yyyy-mm-dd
  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  // write a function to sort the data based on the sortOrder
  const sortData = () => {
    // console.log("field", store.field);
    // console.log("sort", store.sortBy);
    // console.log("filter", store.filterBy);

    if (store.sortBy === "asc") {
      if (store.field === "ID") { 
        store.setModifiedData(collapsibleData.sort((a: any, b: any) => a.feedback_id - b.feedback_id));
      } else if (store.field === "Name") {
        store.setModifiedData(collapsibleData.sort((a: any, b: any) => a.firstName.localeCompare(b.firstName)));
      } else if (store.field === "Age") { 
        store.setModifiedData(collapsibleData.sort((a: any, b: any) => parseInt(a.age) - parseInt(b.age)));
      }
    } else if (store.sortBy === "desc") {
      // console.log("This is desc");
      if (store.field === "ID") {
        store.setModifiedData(collapsibleData.sort((a: any, b: any) => b.feedback_id - a.feedback_id));
      // console.log(modifiedCollapsibleData)
      } else if (store.field === "Name") {
        store.setModifiedData(collapsibleData.sort((a: any, b: any) =>b.firstName.localeCompare(a.firstName)));
      } else if (store.field === "Age") {
        store.setModifiedData(collapsibleData.sort((a: any, b: any) => parseInt(b.age) - parseInt(a.age)));
      }
    }
    
    else if (store.field === "Category") {
      if (store.filterBy === "whole website") {
        store.setModifiedData(collapsibleData.filter((data: any) => data.fcategory === "Whole Website"));
      } else if (store.filterBy === "game1") {
        store.setModifiedData(collapsibleData.filter((data: any) => data.fcategory === "Game 1"));
      } else if (store.filterBy === "game2") {
        store.setModifiedData(collapsibleData.filter((data: any) => data.fcategory === "Game 2"));
      }
    }
    
    else if (store.field === "Status") {
      if (store.filterBy === "new") {
        store.setModifiedData(collapsibleData.filter((data: any) => data.status === "new"));
      } else if (store.filterBy === "viewed") {
        store.setModifiedData(collapsibleData.filter((data: any) => data.status === "viewed"));
      }
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const paginationCount =store.modifiedData.length;

  return (
    <div className={style.feedbackAdmin_container}>
      
      {loading ? ( 
        <p>Loading Feedback...</p>
      ) : (
        <>
          <h1>Feedback Review</h1>
          <div className={style.feedbackAdmin_containerbox}>
            <div className={style.feedbackAdmin_filterbox}>
              <FeedbackFieldsFilter sortData={sortData} />
              <FeedbackOrderFilter sortData={sortData} />
            </div>
            {/* Render only the data for the current page */}
            {store.modifiedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((data: any) => (
              <CollapsibleContainer
                key={data.feedback_id}
                updateStatus={() => UpdateFeedback(data.feedback_id)}
                id={data.feedback_id}
                name={data.firstName + " " + data.lastName}
                age={data.age}
                gender={data.gender}
                race={data.race}
                email={data.email}
                fcategory={data.fcategory}
                experience={data.experience}
                friendliness={data.friendliness}
                quality={data.quality}
                recommended={data.recommended}
                q1={data.question1}
                q2={data.question2}
                q3={data.question3}
                image={data.imageURL}
                created_at={formatDate(data.createdAt)}
                status={data.status}
              />
            ))}

            <TablePagination
              component="div"
              count={paginationCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </>
      )}
      </div>
  );
};

export default FeedbackAdmin;