// Form.tsx
import React, { useState } from "react";
import "./DataCollection.css";
import image from "/images/avatar-hi.png";
// import PopupModal from "../../../components/PopupModal/PopupModal";
import DataSubmissionForm from "../components/DataSubmissionForm/DataSubmissionForm";

const DataCollection: React.FC = () => {
  return (
    <div className="dataForm-bg">
      <div className="dataSubmissionForm">
        <DataSubmissionForm user="public" />
      </div>
      <div>
        {/* <PopupModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
      </div>
    </div>
  );
};

export default DataCollection;
