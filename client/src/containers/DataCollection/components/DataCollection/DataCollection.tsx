// Form.tsx
import React, { useState } from "react";
import "./DataCollection.css";
import DataSubmissionForm from "../DataSubmissionForm/DataSubmissionForm";
import PopupModal from "../PopupModal/PopupModal";

interface DataCollectionProps {
  user: string;
}

const DataCollection: React.FC<DataCollectionProps> = ({ user }) => {
  //Modal Control (Onsubmit popup)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsSubmitModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSubmitModalOpen(false);
  };
  return (
    <>
      <div className={`dataForm-bg ${isSubmitModalOpen ? "dimmed" : ""}`}>
        <DataSubmissionForm user={user} onOpenModal={handleOpenModal} />
      </div>
      <PopupModal isOpen={isSubmitModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default DataCollection;
