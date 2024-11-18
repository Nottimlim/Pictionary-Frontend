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

  const processImage = async (dataUrl) => {
    // Remove the data URL prefix to get just the base64 data
    const base64Data = dataUrl.split(',')[1];
    
    // Convert base64 to binary
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create blob from binary data
    const blob = new Blob([bytes], { type: 'image/png' });

    // Convert blob to image
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Create a canvas to potentially resize/normalize the image
        const canvas = document.createElement('canvas');
        canvas.width = 224;  // Standard input size for many vision models
        canvas.height = 224;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob with specific format
        canvas.toBlob((processedBlob) => {
          resolve(processedBlob);
        }, 'image/png');
        
        // Clean up
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
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
      // Process the image
      const processedBlob = await processImage(imageData);
      console.log('Processed image blob:', {
        type: processedBlob.type,
        size: processedBlob.size
      });

      // Convert blob to array buffer
      const arrayBuffer = await processedBlob.arrayBuffer();
      
      // Create a fresh Uint8Array from the array buffer
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Run prediction
      const predictions = await classifier(uint8Array.buffer);
      console.log('Raw predictions:', predictions);

      // Format predictions and check for match
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