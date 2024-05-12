// Form.tsx
import React from "react";
import "./DataCollection.css";
import DataSubmissionForm from "../DataSubmissionForm/DataSubmissionForm";

interface DataCollectionProps {
  user: string;
}

const DataCollection: React.FC<DataCollectionProps> = ({ user }) => {
  return (
    <div className="dataForm-bg">
      <DataSubmissionForm user={user} />
    </div>
  );
};

export default DataCollection;
