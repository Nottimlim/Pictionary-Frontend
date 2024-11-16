import React from 'react';

const WordDisplay = ({ word, onStartDrawing }) => {
  return (
    <div className="retroContainer">
      <div className="retroHeader">
        <h2 className="text-lg font-bold">Your Word</h2>
      </div>
      <div className="bg-white p-6 text-center">
        <h2 className="text-xl text-eerie-black mb-4">Your Word to Draw:</h2>
        <p className="text-lg text-eerie-black-600 mb-4">{word}</p>
        <button
          onClick={onStartDrawing}
          className="retroButton"
        >
          Start Drawing
        </button>
      </div>
    </div>
  );
};

export default WordDisplay;
