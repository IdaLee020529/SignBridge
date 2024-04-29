import React, { useEffect, useState } from "react";
import CollapsibleContainer from "../components/CollapsibleContainer/CollapsibleContainer";
import FeedbackOrderFilter from "../components/Filter/FeedbackOrderSorting/FeedbackOrderSorting";
import FeedbackFieldsFilter from "../components/Filter/FeedbackFieldsFilter/FeedbackFieldsFilter";
import TablePagination from '@mui/material/TablePagination';
import style from "./FeedbackAdmin.module.css";
import { GetFeedback } from "../../../services/feedback.service";

const FeedbackAdmin: React.FC = () => {
  const [filterFields, setFilterFields] = useState("ID");
  const [sortOrder, setSortOrder] = useState("asc");

  const [collapsibleData, setCollapsibleData] = useState<any[]>([]);
  const [modifiedCollapsibleData, setModifiedCollapsibleData] = useState<any[]>([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch data from server
  useEffect(() => {
    GetFeedback()
      .then((res) => {
        setCollapsibleData(res.data);
        setModifiedCollapsibleData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // a function to format the date to yyyy-mm-dd
  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  // write a function to filter the data based on the filterFields
  const filterData = (data: any) => {
    if (filterFields === "ID") {
      return data.feedback_id;
    } else if (filterFields === "Name") {
      return data.firstName + " " + data.lastName;
    } else if (filterFields === "Age") {
      return data.age;
    } else if (filterFields === "Category") {
      return data.fcategory;
    } else if (filterFields === "Status") {
      return data.status;
    }
  };

  // write a function to sort the data based on the sortOrder
  const sortData = (data: any) => {
    setSortOrder(data);
    console.log("sortData", data);
    console.log("sortOrder", sortOrder);
    console.log("filterFields", filterFields);

    if (filterFields === "Category") {
      console.log("asdasd");
      setSortOrder("whole website");
    } else if (filterFields === "Status") {
      setSortOrder("new");
    } else {
      setSortOrder("asc");
    }

    if (data === "asc") {
      if (filterFields === "ID") { 
        setModifiedCollapsibleData(collapsibleData.sort((a: any, b: any) => a.feedback_id - b.feedback_id));
      } else if (filterFields === "Name") {
        setModifiedCollapsibleData(collapsibleData.sort((a: any, b: any) => a.firstName.localeCompare(b.firstName)));
      } else if (filterFields === "Age") { 
        setModifiedCollapsibleData(collapsibleData.sort((a: any, b: any) => parseInt(a.age) - parseInt(b.age)));
      }
    } else if (data === "desc") {
      if (filterFields === "ID") {
        setModifiedCollapsibleData(collapsibleData.sort((a: any, b: any) => b.feedback_id - a.feedback_id));
      } else if (filterFields === "Name") {
        setModifiedCollapsibleData(collapsibleData.sort((a: any, b: any) =>b.firstName.localeCompare(a.firstName)));
      } else if (filterFields === "Age") {
        setModifiedCollapsibleData(collapsibleData.sort((a: any, b: any) => parseInt(b.age) - parseInt(a.age)));
      }
    } else if (data === "whole website") {
      console.log(collapsibleData);
      console.log(collapsibleData.filter((data: any) => data.fcategory === "Whole Website"));
      setModifiedCollapsibleData(collapsibleData.filter((data: any) => data.fcategory === "Whole Website"));
    } else if (data === "game1") {
      setModifiedCollapsibleData(collapsibleData.filter((data: any) => data.fcategory === "Game 1"));
    } else if (data === "game2") {
      setModifiedCollapsibleData(collapsibleData.filter((data: any) => data.fcategory === "Game 2"));
    } else if (data === "new") {
      setModifiedCollapsibleData(collapsibleData.filter((data: any) => data.status === "new"));
    } else if (data === "viewed") {
      setModifiedCollapsibleData(collapsibleData.filter((data: any) => data.status === "viewed"));
    }
  };

  useEffect(() => {
    // Update modifiedCollapsibleData when collapsibleData changes
    setModifiedCollapsibleData(collapsibleData);
  }, [collapsibleData]);

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
    setPage(0); // Reset page when changing rows per page
  };

  const paginationCount =modifiedCollapsibleData.length;
  console.log("paginationCount", paginationCount);

  return (
    <div className={style.feedbackAdmin_container}>
      <h1>Feedback Review</h1>
      <div className={style.feedbackAdmin_containerbox}>
        <div className={style.feedbackAdmin_filterbox}>
          <FeedbackFieldsFilter filterFields={filterFields} setFilterFields={setFilterFields} sortData={sortData} setSortOrder={setSortOrder} />
          <FeedbackOrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} selectedField={filterFields} sortData={sortData} />
        </div>
        {/* Render only the data for the current page */}
        {modifiedCollapsibleData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((data) => (
          <CollapsibleContainer
            key={data.id}
            id={data.feedback_id}
            name={data.firstName + " " + data.lastName}
            age={data.age}
            gender={data.gender}
            phone={data.phoneNo}
            email={data.email}
            fcategory={data.fcategory}
            experience={data.experience}
            friendliness={data.friendliness}
            quality={data.quality}
            recommended={data.recommended}
            q1={data.question1}
            q2={data.question2}
            q3={data.question3}
            image={data.screenshot}
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
    </div>
  );
};

export default FeedbackAdmin;