import React, { useState, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';

const PredictionHandler = ({ 
  imageData, 
  selectedWord, 
  onPredictionComplete 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classifier, setClassifier] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      setIsModelLoading(true);
      const pipe = await pipeline(
        'image-classification',
        'Xenova/quickdraw-mobilevit-small',
        {
          progress_callback: (progress) => {
            console.log(`Loading model: ${Math.round(progress.progress)}%`);
          }
        }
      );
      setClassifier(pipe);
      setError(null);
    } catch (err) {
      console.error('Error loading model:', err);
      setError('Failed to load the recognition model. Please refresh the page.');
    } finally {
      setIsModelLoading(false);
    }
  };

  const createImageFromBase64 = (base64String) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64String;
    });
  };

  const handlePredict = async () => {
    if (!imageData) {
      setError('No drawing to analyze');
      return;
    }

    if (!classifier) {
      setError('Model not ready. Please wait or refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting prediction with image:', {
        dataLength: imageData.length,
        isBase64: imageData.startsWith('data:image/png;base64,'),
      });

      // Convert base64 to Image object
      const img = await createImageFromBase64(imageData);
      
      console.log('Processing image:', {
        width: img.width,
        height: img.height,
        type: 'HTMLImageElement'
      });

      // Run prediction using the pipeline's built-in normalization
      const predictions = await classifier(img);
      console.log('Raw predictions:', predictions);

      const formattedPredictions = predictions.map(pred => ({
        label: pred.label.replace(/_/g, ' ').toLowerCase(),
        score: pred.score
      }));

      const matchResult = formattedPredictions.some(pred => 
        pred.score > 0.3 && 
        pred.label.includes(selectedWord.toLowerCase())
      );

      const topPrediction = formattedPredictions[0];

      const result = {
        prediction: topPrediction.label,
        winner: matchResult,
        confidence: `${Math.round(topPrediction.score * 100)}`,
        allPredictions: formattedPredictions,
        selectedWord: selectedWord,
        message: matchResult 
          ? `This appears to be a ${topPrediction.label}, drawn with ${Math.round(topPrediction.score * 100)}% clarity.`
          : `I see what appears to be a ${topPrediction.label}, though I was expecting a ${selectedWord}.`
      };

      console.log('Final result:', result);
      onPredictionComplete(result);

    } catch (err) {
      console.error('Prediction error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setError('Failed to analyze the drawing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isModelLoading ? (
        <div className="text-center p-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
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
            <span>Loading recognition model...</span>
          </div>
        </div>
      ) : (
        <button
          onClick={handlePredict}
          disabled={isLoading || !classifier}
          className={`retroButton w-full ${!classifier || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
        >
          {isLoading ? (
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
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )} 
    </div>
  );
};

export default PredictionHandler;