import React, { useState } from "react";
import { Groq } from 'groq-sdk';

const PredictionHandler = ({ imageData, selectedWord, onPredictionComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const convertImageToBase64 = async (imageBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
  };

  const preprocessImage = async (base64String) => {
    console.log("In preprocessImage function", base64String)
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 224;
          canvas.height = 224;
          const ctx = canvas.getContext('2d');

          // White background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Center and scale image
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          ) * 0.8;

          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (canvas.width - scaledWidth) / 2;
          const y = (canvas.height - scaledHeight) / 2;
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.95);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = base64String;
    });
  };

  const predictWithGroq = async (base64Image) => {
    try {
      console.log("Initializing Groq client...");
      const groq = new Groq({ 
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true  // Add this flag for browser usage
      });

      console.log("Sending request to Groq API...");
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You are an expert in identifying doodle images. What does this doodle represent? Return a single word."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        model: "llama-3.2-11b-vision-preview",
        temperature: 0.1,
        // max_tokens: 250,
        top_p: 1,
        stream: false,
        stop: null
      });

      console.log("Groq API Response:", chatCompletion);
      
      // Extract the prediction
      const prediction = chatCompletion.choices[0].message.content
        .toLowerCase()
        .trim()
        .split(/\s+/)[0]; // Take first word only
        
      return prediction;
    } catch (error) {
      console.error('Groq API Error:', {
        name: error.name,
        message: error.message,
        details: error.response?.data
      });
      throw error;
    }
  };

  const handlePredict = async () => {
    // if (!imageData) {
    //   setError("No drawing to analyze");
    //   return;
    // }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting prediction process...");
      
      // Preprocess image
      const processedImageBlob = await preprocessImage(imageData);
      console.log("Image preprocessed successfully");

      // Convert to base64
      const base64Image = await convertImageToBase64(processedImageBlob);
      console.log("Image converted to base64");
      
      // Get prediction
      const prediction = await predictWithGroq(base64Image);
      console.log("Received prediction:", prediction);

      // Check for match
      const matchResult = prediction.includes(selectedWord.toLowerCase());

      // Set confidence
      const confidence = matchResult ? 85 : 60;

      const result = {
        prediction: prediction,
        winner: matchResult,
        confidence: confidence.toString(),
        allPredictions: [{ label: prediction, score: confidence / 100 }],
        selectedWord: selectedWord,
        message: matchResult
          ? `This appears to be a ${prediction}, drawn clearly.`
          : `I see what appears to be a ${prediction}, though I was expecting a ${selectedWord}.`
      };

      console.log("Final result:", result);
      onPredictionComplete(result);
    } catch (err) {
      console.error("Prediction error:", err);
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
        response: err.response?.data
      });
      setError("Failed to analyze the drawing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePredict}
        disabled={isLoading}
        className={`retroButton w-full ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
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
          "Check Drawing"
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default PredictionHandler;