import React from 'react';

const CanvasControls = ({ onClearCanvas }) => {
  return (
    <div className="flex gap-4 mb-4 items-center">
      <button
        onClick={onClearCanvas}
        className="retroButton"
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default CanvasControls;
