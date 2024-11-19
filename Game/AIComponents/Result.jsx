import React from 'react';

const Result = ({ 
  prediction,     // The main prediction from the model
  winner,         // boolean: true for match, false for no match
  confidence,     // Confidence score as percentage
  allPredictions, // Array of all top predictions
  message,        // Expert analysis message
  selectedWord    // The word that was supposed to be drawn
}) => {
  // Format expert message if not provided
  const expertMessage = message || (winner 
    ? `This appears to be a ${prediction}, drawn with ${confidence} clarity.`
    : `I see what appears to be a ${prediction}, though I was expecting a ${selectedWord}.`
  );

  return (
    <div className={`mt-6 p-6 rounded-lg shadow-md ${
      winner 
        ? 'bg-green-50 border border-green-200'
        : 'bg-yellow-50 border border-yellow-200'
    }`}>
      {/* Result Header */}
      <div className={`text-2xl font-bold mb-4 ${
        winner ? 'text-green-600' : 'text-yellow-600'
      }`}>
        {winner ? '🎉 Great Job!' : '😅 Nice Try!'}
      </div>

      {/* Expert Analysis */}
      <div className="text-lg mb-4 text-gray-700">
        {expertMessage}
      </div>

      {/* Results Content */}
      <div className="space-y-3">
        {/* Match Result Display */}
        <div className="flex items-center">
          <span className="font-semibold mr-2">Result:</span>
          <span className={`${
            winner ? 'text-green-600' : 'text-yellow-600'
          } font-bold`}>
            {winner ? 'MATCH' : 'NO MATCH'}
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
                  {pred.label}: {Math.round(pred.score * 100)}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;