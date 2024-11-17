import React, { useState, useCallback, useRef, useEffect } from "react";
import CanvasDrawing from "./Canvas/CanvasDrawing.jsx";
import CanvasControls from "./Canvas/CanvasControls.jsx";
import PredictionHandler from './AIComponents/PredictionHandler.jsx'; 
import Result from './AIComponents/Result.jsx'; 
// import WordDisplay from "./WordDisplay";
import Timer from "./Timer.jsx";
import { generateWord } from '../src/services/wordGeneration.js'; // Our Groq service for word generation
import mockAPI from "../src/services/mockData.js";

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
  const [imageData, setImageData] = useState(null); // store drawing data

  // ref to access the canvas methods - TL
  const canvasRef = useRef(null);

  // Initialize game with AI word and session
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Get AI-generated word
        const word = await generateWord('EASY');
        setSelectedWord(word);

        // Create game session
        const newGame = await mockAPI.createGame(1, "Easy", word);
        setGameId(newGame.game.id);
      } catch (err) {
        console.error('Error initializing game:', err);
        // Use fallback word if AI generation fails
        setSelectedWord('cat');
      }
    };

    initializeGame();
  }, []);

  // Game state handlers
  const handleStartDrawing = () => {
    setGameState("playing");
  };

  const handleTimeUp = useCallback(async () => {
    setGameState("timeUp");


    if (gameId && imageData) {
      try {
        await mockAPI.submitDrawing(gameId, imageData);
      } catch (err) {
        console.error('Error submitting drawing:', err);
      }
    }
  }, [gameId, imageData]);

  const handleImageUpdate = useCallback((newImageData) => {
    setImageData(newImageData);
  }, []);

  const handlePredictionComplete = (predictionResult) => {
    setResult(predictionResult);
  };

  const handlePlayAgain = async () => {
    try {
      // Generate new word 
      const word = await generateWord('EASY');
      setSelectedWord(word);

      // Create new game session
      const newGame = await mockAPI.createGame(1, "Easy", word);
      setGameId(newGame.game.id);

      // Reset game state
      setGameState("initial");
      setResult(null);
      setImageData(null);
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    } catch (err) {
      console.error('Error resetting game:', err);
      setSelectedWord('cat'); // Fallback
    }
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
          {gameState === "timeUp" && (
            <div className="retroContainer">
              <div className="retroHeader">
                <h2 className="text-lg font-bold">Results</h2>
              </div>
              <div className="bg-white p-6">
                <PredictionHandler
                  imageData={imageData}
                  selectedWord={selectedWord}
                  onPredictionComplete={handlePredictionComplete}
                />
                
                {result && (
                  <>
                    <Result {...result} />
                    <div className="text-center mt-6">
                      <button onClick={handlePlayAgain} className="retroButton">
                        Play Again
                      </button>
                    </div>
                  </>
                )}
            </div>
        </div>
      )}
    </div>
    )}
  </div>
  );
};

export default GameContainer;
