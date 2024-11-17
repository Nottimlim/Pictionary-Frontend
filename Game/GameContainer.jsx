import React, { useState, useCallback, useRef, useEffect } from "react";
import CanvasDrawing from "./Canvas/CanvasDrawing";
import CanvasControls from "./Canvas/CanvasControls";
// import PredictionHandler from './AIComponents/PredictionHandler'; greying out for mockdata purposes
// import Result from './AIComponents/Result'; greying out for mockdata purposes
import mockAPI from "../src/services/mockData";
import WordDisplay from "./WordDisplay";
import Timer from "./Timer";

const TIMER_DURATION = 20; // 20 seconds

const GameContainer = () => {
  // State for drawing settings
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#000000");

  // Game state
  const [selectedWord, setSelectedWord] = useState("");
  const [gameState, setGameState] = useState("initial"); // initial, playing, timeUp
  const [result, setResult] = useState(null);
  const [gameId, setGameId] = useState(null); // store game ID
  // const [imageData, setImageData] = useState(null); // store drawing data

  // ref to access the canvas methods - TL
  const canvasRef = useRef(null);

  // fetch a random word when the component mounts - TL
  useEffect(() => {
    const initializeGame = async () => {
      const word = await mockAPI.getRandomWord();
      setSelectedWord(word.prompt);

      const newGame = await mockAPI.createGame(1, "Easy"); // assuming user ID 1
      setGameId(newGame.game.id); // store game ID
    };
    initializeGame();
  }, []);

  // Game state handlers
  const handleStartDrawing = () => {
    setGameState("playing");
  };

  const handleTimeUp = useCallback(async () => {
    setGameState("timeUp");
    if (gameId) {
      const mockDrawingData = {}; // replace with actual drawing data once available
      try {
        const gameResult = await mockAPI.submitDrawing(gameId, mockDrawingData);
        setResult(gameResult.isCorrect ? { winner: true } : { winner: false });
      } catch (error) {
        console.error("Error submitting drawing:", error);
        // Simulate a random result for development purposes
        const randomResult = Math.random() > 0.5; // randomly win or lose
        setResult(randomResult ? { winner: true } : { winner: false });
      }
    }
  }, [gameId]);

  // const handleImageUpdate = useCallback((newImageData) => {
  //   setImageData(newImageData);
  // }, []);

  // const handlePredictionComplete = (predictionResult) => {
  //   setResult(predictionResult);
  // };

  const handlePlayAgain = async () => {
    try {
      // Get new word and create new game
      const newGame = await mockAPI.createGame(1, "Easy");

      setSelectedWord(newGame.game.prompt); // reset word
      setGameId(newGame.game.id); // reset game ID
      setGameState("initial");
      setResult(null);
      canvasRef.current.clearCanvas(); //clear the canvas
    } catch (error) {
      console.error("Error starting new game:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex h-screen">
      {/* Left Toolbar */}
      <div className="retroContainer w-16 flex flex-col h-full rounded-none">
      <div className="retroHeader text-center">
          <span className="text-xs font-bold">Tools</span>
        </div>

        <div className="flex flex-col gap-4 p-2">
          {/* Clear/Eraser Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => canvasRef.current.clearCanvas()}
              className="w-6 h-6 flex items-center justify-center hover:bg-atomic-tangerine-200 active:bg-atomic-tangerine-300 border border-eerie-black-300 p-0.5" 
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img
                  src="../src/image/clear.png"
                  alt="Clear Canvas"
                  className="max-w-full max-h-full w-auto h-auto"
                />
              </div>
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex flex-col items-center">
            <div className="relative w-6 h-6">
              {" "}
              {/* Container size */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <img
                  src="../src/image/color.png"
                  alt="Color"
                  className="max-w-full max-h-full w-auto h-auto"
                />
              </div>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Brush size */}
          <div className="space-y-1">
            <div className="text-xs text-center mb-2 text-eerie-black">
              Size: {strokeWidth}
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="retroRange"
            />
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-full p-4">
        {/* Timer Bar */}
        <div className="retroContainer mb-4 rounded-none">
          <div className="retroHeader">
            <div className="flex justify-between items-center">
              <span className="font-bold">Word: {selectedWord}</span>
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
        <div className="retroContainer flex-1 rounded-none">
          <div className="h-full w-full p-2">
            <CanvasDrawing
              ref={canvasRef}
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              disabled={gameState === "timeUp"}
            />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="retroContainer w-64 h-full rounded-none">
        <div className="retroHeader">
          <span className="font-bold">AI Guesses</span>
        </div>
        <div className="p-4">
          <p className="text-sm text-eerie-black-600">
            AI predictions will appear here...
          </p>
        </div>
      </div>

      {/* Word Prompt Modal*/}
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
                Draw: {selectedWord}
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
              <h3 className="text-3xl font-bold text-eerie-black mb-6">
                {result.winner ? "You Win!" : "Try Again!"}
              </h3>
              <button onClick={handlePlayAgain} className="retroButton text-lg">
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
