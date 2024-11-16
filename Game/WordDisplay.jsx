import React from 'react';

const WordDisplay = ({ word, onStartDrawing }) => {
  return (
    <div className="text-center p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Word to Draw:</h2>
      <p className="text-lg text-gray-700 mb-4">{word}</p>
      <button
        onClick={onStartDrawing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Start Drawing
      </button>
    </div>
  );
};

export default WordDisplay;
