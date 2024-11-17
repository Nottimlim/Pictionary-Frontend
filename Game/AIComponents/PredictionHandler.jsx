// Game/AIComponents/PredictionHandler.jsx
import React, { useState } from 'react';

const PredictionHandler = ({ 
  imageData, 
  selectedWord, 
  onPredictionComplete 
}) => {
  // =============== State Management ===============
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://api-inference.huggingface.co/models/Xenova/quickdraw-mobilevit-small';
  const API_KEY = import.meta.env.VITE_HUGGING_FACE_TOKEN;


   //Handles the prediction process when the user clicks "Check Drawing"
  const handlePredict = async () => {
    // -------- Input Validation --------
    if (!imageData) {
      setError('No drawing to analyze');
      return;
    }

    if (!API_KEY) {
      setError('API key not configured');
      return;
    }

    // -------- Start Prediction Process --------
    setIsLoading(true);
    setError(null);

    try {
      // Convert base64 image string to blob for API
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Make API call to HuggingFace
      const result = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: blob
      });

      // Check for API errors
      if (!result.ok) {
        throw new Error('Failed to analyze image');
      }

      // Parse prediction results
      const predictions = await result.json();
      console.log('Raw predictions:', predictions); // For debugging

      // Check if any prediction matches the selected word
      // Using a default 0.3 threshold for sketch recognition as drawings can be abstract
      const matchResult = predictions.some(pred => 
        pred.score > 0.3 && // Confidence threshold
        pred.label.toLowerCase().includes(selectedWord.toLowerCase())
      ) ? 'PASS' : 'FAIL';

      // Get the highest confidence prediction
      const topPrediction = predictions[0];

      // Send results back to parent component
      onPredictionComplete({ 
        prediction: topPrediction.label,
        matchResult,
        confidence: `${Math.round(topPrediction.score * 100)}%`,
        allPredictions: predictions // Include all predictions for debugging
      });

    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to analyze the drawing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // =============== Render UI ===============
  return (
    <div className="space-y-4">
      {/* Prediction Button */}
      <button
        onClick={handlePredict}
        disabled={isLoading}
        className="retroButton w-full" 
        type="button"
      >
        {isLoading ? (
          // Loading Spinner and Text
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
              />
            </svg>
            Analyzing Drawing...
          </div>
        ) : (
          'Check Drawing'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default PredictionHandler;

/**
 * Example prediction response format:
 * {
 *   prediction: "cat",
 *   matchResult: "PASS",
 *   confidence: "85%",
 *   allPredictions: [
 *     { label: "cat", score: 0.85 },
 *     { label: "dog", score: 0.10 },
 *     ...
 *   ]
 * }
 */