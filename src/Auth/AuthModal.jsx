import React from "react";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
// import Login from "./Login";

const Modal = ({ showModal, onClose, LoginComponent, RegisterComponent }) => {
  if (!showModal) return null; // Don't render the modal if it's not supposed to be visible

  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg w-[600px] h-[600px] relative">
        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className="absolute top-2  right-1 rounded-md p-2 cursor-pointer"
        >
          &times;
        </button> */}

        {/* Modal Body */}
        <div className="modal-body">
          {showLogin ? (
            <Login setShowLogin={setShowLogin} />
          ) : (
            <Register setShowLogin={setShowLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
