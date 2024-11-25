import React from "react";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Modal = ({ showModal, onClose }) => {
  if (!showModal) return null; // Don't render the modal if it's not supposed to be visible

  const [showLogin, setShowLogin] = useState(true);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      id="overlay1"
      onClick={(e) => {
        console.log(
          e.target.closest("#login") || e.target.closest("#register")
        );
        if (!(e.target.closest("#login") || e.target.closest("#register")))
          onClose();
      }}
    >
      <div
        className="rounded-lg w-[800px] h-[600px] flex justify-center items-center relative flex-grow-1"
        id="overlay2"
      >
        <div className="modal-body w-[800px]">
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
