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
  const [bgColor, setBgColor] = useState("#ffffff");

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

  const handlePlayAgain = () => {
    setGameState("initial");
    setResult(null);
    setSelectedWord(""); // reset word
    canvasRef.current.clearCanvas(); //clear the canvas
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* word display */}
      {gameState === "initial" && (
        <div className="retroContainer">
          <div className="retroHeader">
            <h2 className="text-lg font-bold">Your Word</h2>
          </div>
          <div className="bg-white p-6 text-center">
            <h2 className="text-2xl font-bold text-eerie-black mb-4">
              Draw: {selectedWord}
            </h2>
            <button onClick={handleStartDrawing} className="retroButton">
              Start Drawing
            </button>
          </div>
        </div>
      )}

      {/* main game interface */}
      {gameState !== "initial" && (
        <div className="max-w-4xl mx-auto">
          <div className="retroContainer mb-4">
            <div className="retroHeader">
              <h2 className="text-lg font-bold">Game Status</h2>
            </div>
            <div className="bg-white p-4">
              <div className="flex flex-col space-y-4">
                <Timer
                  duration={TIMER_DURATION}
                  onTimeUp={handleTimeUp}
                  gameState={gameState}
                />
                <div className="text-lg font-semibold text-eerie-black text-center border-t border-eerie-black-300 pt-4">
                  Draw: {selectedWord}
                </div>
              </div>
            </div>
          </div>

          <div className="retroContainer mb-4">
            <div className="retroHeader">
              <h2 className="text-lg font-bold">Drawing Tools</h2>
            </div>
            <div className="bg-white p-4">
              <CanvasControls
                onClearCanvas={() => canvasRef.current.clearCanvas()}
              />

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-eerie-black">
                    Brush Size:
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm w-8 text-eerie-black">
                    {strokeWidth}px
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-eerie-black">
                    Color:
                  </span>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-8 h-8"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-eerie-black">
                    Background:
                  </span>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="retroContainer mb-4">
            <div className="retroHeader">
              <h2 className="text-lg font-bold">Canvas</h2>
            </div>
            <div className="bg-white p-4 w-full">
              <CanvasDrawing
                ref={canvasRef}
                strokeWidth={strokeWidth}
                strokeColor={strokeColor}
                bgColor={bgColor}
                disabled={gameState === "timeUp"}
              />
            </div>
          </div>

          {/* results modal */}
          {gameState === "timeUp" && result && (
            <div className="retroContainer">
              <div className="retroHeader">
                <h2 className="text-lg font-bold">Results</h2>
              </div>
              <div className="bg-white p-6 text-center">
                <h3 className="text-xl font-bold text-eerie-black mb-4">
                  {result.winner ? "You Win!" : "Try Again!"}
                </h3>
                <button onClick={handlePlayAgain} className="retroButton">
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameContainer;
