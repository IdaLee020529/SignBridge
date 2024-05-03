import React from "react";
import DataCollection from "../../components/DataCollection/DataCollection";
// import DataSubmissionForm from "../../components/DataSubmissionForm/DataSubmissionForm";
// import "./DatasetSubmission.css";

// const DatasetSubmission = () => {
//   return (
//     <div className="dataForm-bg2">
//       <div className="dataSubmissionForm2">
//         <DataSubmissionForm user="signexpert" />
//       </div>
//       <div>
//         {/* <PopupModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
//       </div>
//     </div>
//   );
// };

// export default DatasetSubmission;

const DatasetCollectionSE = () => {
  return (
    <div>
      <DataCollection user="signexpert" />
    </div>
  );
};

export default DatasetCollectionSE;
