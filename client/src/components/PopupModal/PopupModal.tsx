import React from "react";
import "./PopupModal.css";
import image from "../../assets/tick2.png";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose }) => {
  const handleConfirmClick = () => {
    console.log("Confirmed:");
    onClose();
  };

  return (
    <div
      className={`popup-modal ${
        isOpen ? "open" : ""
      } modal-dialog-centered modal-lg`}
    >
      <img src={image} alt="" className="popup-tick img-fluid" />
      <div className="modal-content">
        <h2 className="modal-title">Thank you for your submission</h2>
        <p className="modal-body">An email will be sent to you</p>
        <button className="btn btn-success" onClick={handleConfirmClick}>
          OK
        </button>
      </div>
    </div>
  );
};

export default PopupModal;
