import React from 'react';

const Result = ({ prediction, matchResult }) => {
  const isPass = matchResult === 'PASS';

  return (
    <div className={`mt-6 p-6 rounded-lg shadow-md ${
      isPass 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-yellow-50 border border-yellow-200'
    }`}>
      <div className={`text-2xl font-bold mb-4 ${
        isPass ? 'text-green-600' : 'text-yellow-600'
      }`}>
        {isPass ? '🎉 Great Job!' : '😅 Nice Try!'}
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Result:</span>
          <span className={`${
            isPass ? 'text-green-600' : 'text-yellow-600'
          } font-bold`}>
            {matchResult}
          </span>
        </div>

        <div className="flex items-start">
          <span className="font-semibold mr-2">AI Saw:</span>
          <span className="text-gray-700">{prediction}</span>
        </div>
      </div>

      {!isPass && (
        <div className="mt-4 text-sm text-gray-600">
          Keep practicing! Try to make your drawing clearer and more detailed.
        </div>
      )}
    </div>
  );
};

export default Result;