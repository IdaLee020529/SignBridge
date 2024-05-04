// Form.tsx
import React from "react";
import "./DataCollection.css";
// import PopupModal from "../../../components/PopupModal/PopupModal";
import DataSubmissionForm from "../DataSubmissionForm/DataSubmissionForm";

interface DataCollectionProps {
  user: string;
}

const DataCollection: React.FC<DataCollectionProps> = ({ user }) => {
  return (
    <div className="dataForm-bg">
      <div className="dataSubmissionForm">
        <DataSubmissionForm user={user} />
      </div>
      <div>
        {/* <PopupModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
      </div>
    </div>
  );
};

export default DataCollection;
