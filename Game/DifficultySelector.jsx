import React from 'react';
import { getDifficulties } from '../src/services/wordGeneration';

const DifficultySelector = ({ currentDifficulty, onSelectDifficulty, onClose }) => {
  const difficulties = getDifficulties();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-eerie-black-500 bg-opacity-50 z-50 overflow-hidden"
      onClick={handleBackdropClick}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="retroContainer w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="retroHeader">
          <h2 className="text-lg font-bold">Select Difficulty</h2>
        </div>
        <div className="bg-white p-8 text-center">
          <div className="flex justify-center gap-6">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => {
                  onSelectDifficulty(difficulty);
                  onClose();
                }}
                className={`retroButton text-sm w-24
                  ${currentDifficulty === difficulty 
                    ? 'bg-indian-red-400' 
                    : 'hover:bg-indian-red-200'
                  }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
