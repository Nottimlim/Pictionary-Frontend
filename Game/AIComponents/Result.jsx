import React from 'react';

const Result = ({ 
  prediction,     // The main prediction from the model
  matchResult,    // 'PASS' or 'FAIL'
  confidence,     // Confidence score as percentage
  allPredictions  // Array of all top predictions (optional)
}) => {
  // Determine if the drawing matched the word
  const isPass = matchResult === 'PASS';

  return (
    // Main container with conditional styling based on result
    <div className={`mt-6 p-6 rounded-lg shadow-md ${
      isPass 
        ? 'bg-green-50 border border-green-200' // Success styling
        : 'bg-yellow-50 border border-yellow-200' // Try again styling
    }`}>
      {/* Result Header */}
      <div className={`text-2xl font-bold mb-4 ${
        isPass ? 'text-green-600' : 'text-yellow-600'
      }`}>
        {isPass ? '🎉 Great Job!' : '😅 Nice Try!'}
      </div>

      {/* Results Content */}
      <div className="space-y-3">
        {/* Match Result Display */}
        <div className="flex items-center">
          <span className="font-semibold mr-2">Result:</span>
          <span className={`${
            isPass ? 'text-green-600' : 'text-yellow-600'
          } font-bold`}>
            {matchResult}
          </span>
          {/* Confidence Score */}
          <span className="ml-2 text-gray-500">({confidence})</span>
        </div>

        {/* Main Prediction Display */}
        <div className="flex items-start">
          <span className="font-semibold mr-2">AI Saw:</span>
          <span className="text-gray-700">{prediction}</span>
        </div>

        {/* Debug Information: All Predictions */}
        {allPredictions && (
          <div className="mt-4 text-sm text-gray-600">
            <div className="font-semibold mb-2">All Predictions:</div>
            <ul className="space-y-1">
              {allPredictions.map((pred, index) => (
                <li key={index}>
                  {/* Display each prediction with its confidence score */}
                  {pred.label}: {Math.round(pred.score * 100)}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Encouragement Message for Failed Attempts */}
      {!isPass && (
        <div className="mt-4 text-sm text-gray-600">
          Keep practicing! Try to make your drawing clearer and more detailed.
        </div>
      )}
    </div>
  );
};

export default Result;