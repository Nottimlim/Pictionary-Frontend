// src/components/WordDisplay.jsx
import React from 'react';

const WordDisplay = ({ word, onStartDrawing }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">Your Word To Draw</h2>
        <div className="text-4xl text-center font-bold text-blue-600 mb-8">
          {word}
        </div>
        <div className="flex justify-center">
          <button
            onClick={onStartDrawing}
            className="px-6 py-3 bg-green-500 text-white rounded-lg 
                     hover:bg-green-600 transition-colors text-lg font-semibold"
          >
            Start Drawing!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;