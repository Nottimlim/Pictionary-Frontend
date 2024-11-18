import React, { useState, useCallback, useRef, useEffect } from "react";
import CanvasDrawing from "./Canvas/CanvasDrawing.jsx";
import CanvasControls from "./Canvas/CanvasControls.jsx";
import PredictionHandler from "./AIComponents/PredictionHandler.jsx";
import Result from "./AIComponents/Result.jsx";
import Timer from "./Timer.jsx";
import { generateWord } from "../src/services/wordGeneration.js";
import mockAPI from "../src/services/mockData.js";

const TIMER_DURATION = 20;

const GameContainer = () => {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for drawing settings
  const [strokeWidth, setStrokeWidth] = useState(20);
  const [strokeColor, setStrokeColor] = useState("#000000");

  // Game state
  const [selectedWord, setSelectedWord] = useState("");
  const [gameState, setGameState] = useState("initial");
  const [result, setResult] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [imageData, setImageData] = useState(null);

  const canvasRef = useRef(null);

  // Initialize game with word and session
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get word
        const word = await generateWord("EASY");
        setSelectedWord(word); // word is an object with prompt and difficulty

        // Create game session
        const newGame = await mockAPI.createGame(1, "EASY", word?.prompt);
        setGameId(newGame.game.id);
      } catch (err) {
        console.error("Error initializing game:", err);
        // Use fallback word if AI generation fails
        const word = await mockAPI.getRandomWord();
        setSelectedWord(word);
        const newGame = await mockAPI.createGame(1, "EASY");
        setGameId(newGame.game.id);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  const handleStartDrawing = () => {
    setGameState("playing");
  };

  const handleTimeUp = useCallback(() => {
    console.log("Time up called"); // Debug log
    setGameState((prevState) => {
      if (prevState === "playing") {
        // // Simulate a mock result immediately for testing
        // // You can remove this later when AI prediction is working
        // setTimeout(() => {
        //   const mockResult = {
        //     winner: Math.random() > 0.5,
        //     // Add other properties as needed
        //   };
        //   setResult(mockResult);
        // }, 1000);
        return "timeUp";
      }
      return prevState;
    });
  }, []);

  const handleImageUpdate = useCallback((newImageData) => {
    console.log("Handle Image Data: ", newImageData)
    setImageData(newImageData);
  }, []);

  const handlePredictionComplete = (predictionResult) => {
    console.log("Prediction complete:", predictionResult); // Debug log
    setResult(predictionResult);
  };

  const handlePlayAgain = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);  // Clear result first
      setGameState("initial");  // Reset game state
      setImageData(null);  // Clear image data
  
      // Get new word and create new game
      const word = await generateWord("EASY");
      const newGame = await mockAPI.createGame(1, "EASY", word?.prompt);
  
      setSelectedWord(word);
      setGameId(newGame.game.id);
  
      // Clear canvas after all states are reset and new game is created
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
  
    } catch (error) {
      console.error("Error starting new game:", error);
      setError("Failed to start new game. Please try again.");
      
      // Fallback to mock data if AI fails
      try {
        const word = await mockAPI.getRandomWord();
        const newGame = await mockAPI.createGame(1, "EASY");
        setSelectedWord(word);
        setGameId(newGame.game.id);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        setError("Unable to start game. Please refresh the page.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indian-red-500 border-r-transparent"></div>
          <p className="mt-4 text-eerie-black-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="retroContainer w-96 text-center">
          <div className="retroHeader">
            <h2 className="text-lg font-bold">Error</h2>
          </div>
          <div className="bg-white p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={handlePlayAgain} className="retroButton">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex h-screen overflow-hidden">
      {/* Left Toolbar */}
      <div className="retroContainer w-8 flex flex-col h-full rounded-none min-w-[2rem] max-w-[2rem] flex-shrink-0">
        <div className="retroHeader text-center">
          <span className="text-[8px] font-bold">Tools</span>
        </div>
        <div className="flex flex-col gap-1 p-0.5">
          {/* Clear/Eraser Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => canvasRef.current.clearCanvas()}
              className="w-3 h-3 flex items-center justify-center hover:bg-atomic-tangerine-200 active:bg-atomic-tangerine-300 border border-eerie-black-300"
            >
              <img
                src="../src/image/clear.png"
                alt="Clear Canvas"
                className="w-1.5 h-1.5"
              />
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex flex-col items-center">
            <div className="relative w-3 h-3 overflow-hidden">
              <img
                src="../src/image/color.png"
                alt="Color"
                className="w-1.5 h-1.5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer absolute top-0 left-0"
              />
            </div>
          </div>

          {/* Brush size */}
          <div className="space-y-0.5">
            <div className="text-[6px] text-center mb-0.5 text-eerie-black">
              Size: {strokeWidth}
            </div>
            <div className="w-6 mx-auto">
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="retroRange h-1 appearance-none"
                style={{
                  width: "2rem",
                  transform: "scale(0.8)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-full p-4 overflow-hidden">
        {/* Timer Bar */}
        <div className="retroContainer mb-4 rounded-none">
          <div className="retroHeader">
            <div className="flex justify-between items-center">
              <span className="font-bold">Word: {selectedWord?.prompt}</span>
            </div>
          </div>
          <div className="p-2">
            <Timer
              duration={TIMER_DURATION}
              onTimeUp={handleTimeUp}
              gameState={gameState}
            />
          </div>
        </div>
        {/* Canvas Container */}
        <div className="retroContainer flex-1 rounded-none overflow-hidden">
          <div className="h-full w-full p-2 overflow-hidden">
            <CanvasDrawing
              ref={canvasRef}
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              disabled={gameState === "timeUp"}
              onImageUpdate={handleImageUpdate}
            />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="retroContainer w-64 h-full rounded-none min-w-[16rem] max-w-[16rem] flex-shrink-0 overflow-hidden">
        <div className="retroHeader">
          <span className="font-bold">AI Guesses</span>
        </div>
        <div className="p-4 overflow-hidden h-[calc(100%-2rem)]">
          <div className="w-full h-full overflow-y-auto flex flex-col">
            {gameState === "playing" ? (
              <>
                <p className="text-sm text-eerie-black-600 break-words mb-4">
                  Draw your word and the AI will try to guess it...
                </p>
                <button
                  onClick={() => setGameState("timeUp")} // Direct state change
                  className="retroButton mt-auto hover:bg-indian-red-400"
                >
                  Check Drawing
                </button>
              </>
            ) : gameState === "timeUp" ? (
              <>
                <PredictionHandler
                  imageData={imageData}
                  selectedWord={selectedWord?.prompt}
                  onPredictionComplete={handlePredictionComplete}
                />
                {/* Optional loading state while waiting for prediction */}
                {!result && (
                  <div className="text-center mt-4">
                    <p>Analyzing your drawing...</p>
                  </div>
                )}
              </>
            ) : (            
              <p className="text-sm text-eerie-black-600 break-words">
                Draw your word and the AI will try to guess it...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Word Prompt Modal */}
      {gameState === "initial" && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-eerie-black-500 bg-opacity-50 z-50 overflow-hidden"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="retroContainer w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="retroHeader">
              <h2 className="text-lg font-bold">Your Word</h2>
            </div>
            <div className="bg-white p-8 text-center">
              <h2 className="text-3xl font-bold text-eerie-black mb-6">
                Draw: {selectedWord?.prompt}
              </h2>
              <button
                onClick={handleStartDrawing}
                className="retroButton text-lg"
              >
                Start Drawing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {gameState === "timeUp" && result && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-eerie-black-500 bg-opacity-50 z-50 overflow-hidden"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="retroContainer w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="retroHeader">
              <h2 className="text-lg font-bold">Results</h2>
            </div>
            <div className="bg-white p-8 text-center">
              <Result {...result} selectedWord={selectedWord?.prompt} />
              <button onClick={handlePlayAgain} className="retroButton text-lg mt-6">
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameContainer;
