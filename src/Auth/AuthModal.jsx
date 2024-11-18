import React from "react";
import Login from "./Login";

const Modal = ({ showModal, onClose, LoginComponent, RegisterComponent }) => {
  if (!showModal) return null; // Don't render the modal if it's not supposed to be visible

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] h-[800px]  shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-2 cursor-pointer hover:bg-red-600"
        >
          Close
        </button>

        {/* Modal Body */}
        <div className="modal-body">
          {LoginComponent}
          {RegisterComponent}
        </div>
      </div>
    </div>
  );
};

export default Modal;
