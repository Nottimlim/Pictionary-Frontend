import React from 'react';

const CanvasControls = ({ onClearCanvas }) => {
  return (
    <div className="flex gap-4 mb-4 items-center p-4 bg-gray-50 rounded-lg">
      <button
        onClick={onClearCanvas}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default CanvasControls;
