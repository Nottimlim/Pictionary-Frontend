import React, { useState, useCallback, useRef, useEffect } from "react";
import CanvasDrawing from "./Canvas/CanvasDrawing.jsx";
import PredictionHandler from "./AIComponents/PredictionHandler.jsx";
import Result from "./AIComponents/Result.jsx";
import Timer from "./Timer.jsx";
import { generateWord } from "../src/services/wordService.js";
import { apiService } from "../src/services/api.js";
import DifficultySelector from "./DifficultySelector";

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
  const [difficulty, setDifficulty] = useState("EASY");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const canvasRef = useRef(null);

  // Initialize game with word and session
  const initializeGame = async (newDifficulty = difficulty) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get word with new difficulty
      const word = await generateWord(newDifficulty);
      console.log("Generated word:", word); // Debug log

      if (!word || !word.id) {
        throw new Error("Invalid word received from server");
      }

      setSelectedWord(word);

      // Create game session with the selected word
      console.log("Creating game with word:", word.id); // Debug log
      const gameResponse = await apiService.startGameWithWord(word.id);
      console.log("Game response:", gameResponse); // Debug log

      setGameId(gameResponse.id);
      setGameState("initial");
      setResult(null);
      setImageData(null);

      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    } catch (err) {
      console.error("Error initializing game:", err);
      console.error("Error details:", err.response?.data); // Log backend error details
      setError(
        err.response?.data?.detail || "Failed to start game. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleStartDrawing = () => {
    setGameState("playing");
  };

  const handleTimeUp = useCallback(() => {
    setGameState((prevState) => {
      if (prevState === "playing") {
        return "timeUp";
      }
      return prevState;
    });
  }, []);

  const handleDifficultyChange = async (newDifficulty) => {
    setDifficulty(newDifficulty);
    await initializeGame(newDifficulty);
  };

  const handleImageUpdate = useCallback(
    async (newImageData) => {
      console.log("New Image: ", newImageData)
      setImageData(newImageData);
      
      if (gameId && newImageData) {
        try {
          console.log('Attempting to save drawing for game:', gameId);
          
          let artData;
          if (typeof newImageData === 'object' && newImageData.preview) {
            artData = newImageData.preview.split(',')[1];
          } else if (typeof newImageData === 'string') {
            artData = newImageData.split(',')[1];
          }
  
          if (!artData) {
            console.error('Invalid image data format:', newImageData);
            return;
          }
  
          try {
            const drawings = await apiService.getGameDrawings(gameId);
            console.log('Existing drawings:', drawings);
  
            if (drawings && drawings.length > 0) {
              const latestDrawing = drawings[drawings.length - 1];
              await apiService.updateDrawing(gameId, latestDrawing.id, {
                art: artData
              });
            } else {
              // Explicitly include game ID in the creation request
              await apiService.createDrawing(gameId, {
                game: gameId,
                art: artData
              });
            }
          } catch (error) {
            if (error.response?.status === 404) {
              // Explicitly include game ID in the creation request
              await apiService.createDrawing(gameId, {
                game: gameId,
                art: artData
              });
            } else {
              throw error;
            }
          }
        } catch (error) {
          console.error("Drawing save failed:", {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            details: JSON.stringify(error.response?.data),
            error: error.message
          });
        }
      }
    },
    [gameId]
  );
  
  

  const handlePredictionComplete = async (predictionResult) => {
    setResult(predictionResult);

    // Update game result in backend
    if (gameId) {
      try {
        await apiService.updateGame(gameId, {
          result: predictionResult.success,
        });
      } catch (error) {
        console.error("Error updating game result:", error);
      }
    }
  };

  const handlePlayAgain = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setGameState("initial");
      setImageData(null);

      const word = await generateWord(difficulty);
      const gameResponse = await apiService.startGameWithWord(word.id);

      setSelectedWord(word);
      setGameId(gameResponse.id);

      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    } catch (error) {
      console.error("Error starting new game:", error);
      setError("Failed to start new game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-[40px] bottom-0 left-0 right-0 flex overflow-hidden">
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
    <div className="fixed inset-x-0 top-10 bottom-0 flex overflow-hidden">
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
                src="/src/image/clear.png"
                alt="Clear Canvas"
                className="w-1.5 h-1.5"
              />
            </button>
          </div>
          {/* Difficulty */}
          <div className="flex flex-col items-center mb-1">
            <button
              onClick={() => setShowDifficultyModal(true)}
              className="w-3 h-3 flex items-center justify-center hover:bg-atomic-tangerine-200 active:bg-atomic-tangerine-300 border border-eerie-black-300"
            >
              <img
                src="/src/image/difficulty.png"
                alt="Difficulty"
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
                  onClick={handleTimeUp}
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
              <button
                onClick={handlePlayAgain}
                className="retroButton text-lg mt-6"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Selector Modal */}
      {showDifficultyModal && (
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelectDifficulty={handleDifficultyChange}
          onClose={() => setShowDifficultyModal(false)}
        />
      )}
    </div>
  );
};

export default GameContainer;
