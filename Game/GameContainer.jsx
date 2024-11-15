import React, { useState, useCallback } from "react";
// import CanvasDrawing from "./Canvas/CanvasDrawing";
import PredictionHandler from "./AIcomponents/PredictionHandler";
import Result from "./AIcomponents/Result";
import WordDisplay from "./WordDisplay";
import Timer from "./Timer";

// Constants
const TIMER_DURATION = 20; // Game duration in seconds

const GameContainer = () => {
  // =============== State Management ===============
  // Drawing-related state
  const [drawingMode] = useState("freedraw"); // Currently only using freedraw mode
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#eeeeee");

  // Game state management
  const [selectedWord, setSelectedWord] = useState(""); // Word to be drawn
  const [imageData, setImageData] = useState(null); // Canvas drawing data
  const [gameState, setGameState] = useState("initial"); // Game states: 'initial', 'playing', 'timeUp'
  const [result, setResult] = useState(null); // AI prediction result

  // =============== Game Logic Functions ===============

  // Generates a new word for the player to draw
  const generateNewWord = async () => {
    // TODO: Integrate with LLM API
    setSelectedWord("Cat standing on a table");
  };

  // Handles the start of the drawing phase
  const handleStartDrawing = () => {
    setGameState("playing");
  };

  // Callback for when timer reaches zero
  const handleTimeUp = () => {
    setGameState("timeUp");
  };

  // Updates image data when canvas content changes
  // useCallback prevents unnecessary re-renders
  const handleImageUpdate = useCallback((newImageData) => {
    setImageData(newImageData);
  }, []);

  // Handles the AI prediction result
  const handlePredictionComplete = (predictionResult) => {
    setResult(predictionResult);
  };

  // Resets the game state for a new round
  const handlePlayAgain = () => {
    setGameState("initial");
    setResult(null);
    setImageData(null);
    generateNewWord();
  };

  // =============== Render Logic ===============
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Initial word display modal */}
      {gameState === "initial" && (
        <WordDisplay word={selectedWord} onStartDrawing={handleStartDrawing} />
      )}

      {/* Main game interface */}
      {gameState !== "initial" && (
        <div className="max-w-4xl mx-auto">
          {/* Timer and Word Display Section */}
          <div className="flex items-center justify-between mb-4">
            <Timer
              duration={TIMER_DURATION}
              onTimeUp={handleTimeUp}
              gameState={gameState}
            />
            <div className="text-lg font-semibold text-blue-600">
              Draw: {selectedWord}
            </div>
          </div>

          {/* Drawing Controls Section */}
          <div className="flex gap-4 mb-4 items-center">
            {/* Stroke Width Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-32"
              />
            </div>

            {/* Stroke Color Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Color:</span>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-8 h-8"
              />
            </div>

            {/* Background Color Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Background:</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Drawing Canvas */}
          <CanvasDrawing
            drawingMode={drawingMode}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            bgColor={bgColor}
            onImageUpdate={handleImageUpdate}
            disabled={gameState === "timeUp"}
          />

          {/* Results Section */}
          {gameState === "timeUp" && (
            <div className="mt-4">
              {/* AI Prediction Handler */}
              <PredictionHandler
                imageData={imageData}
                selectedWord={selectedWord}
                onPredictionComplete={handlePredictionComplete}
              />

              {/* Display Results and Play Again Button */}
              {result && (
                <>
                  <Result {...result} />
                  <button
                    onClick={handlePlayAgain}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded
                             hover:bg-green-600 transition-colors"
                  >
                    Play Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameContainer;
