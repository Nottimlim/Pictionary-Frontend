import React, { useState } from 'react';

const PredictionHandler = ({ 
  imageData, 
  selectedWord, 
  onPredictionComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!imageData) {
      setError('No image data available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Implement LLM API call
      // const response = await llm.invoke({ image: imageData });
      // const prediction = response.content;
      
      // Simulated LLM response for now
      const prediction = 'A cat on a wooden table';
      const matchResult = prediction.toLowerCase().includes(selectedWord.toLowerCase()) 
        ? 'PASS' 
        : 'FAIL';

      onPredictionComplete({ prediction, matchResult });
    } catch (err) {
      setError('An error occurred while analyzing the image');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePredict}
        disabled={isLoading || !imageData}
        className={`px-4 py-2 rounded ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
      >
        {isLoading ? 'Analyzing...' : 'Check Drawing'}
      </button>

      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default PredictionHandler;