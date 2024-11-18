// GameContainer.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import CanvasDrawing from "./Canvas/CanvasDrawing.jsx";
import CanvasControls from "./Canvas/CanvasControls.jsx";
import PredictionHandler from './AIComponents/PredictionHandler.jsx'; 
import Result from './AIComponents/Result.jsx'; 
import Timer from "./Timer.jsx";
import { generateWord } from '../src/services/wordGeneration.js'; 
import mockAPI from "../src/services/mockData.js";

const TIMER_DURATION = 20; // 20 seconds

const GameContainer = () => { 
  const [isLoading, setIsLoading] = useState(true);
  // State for drawing settings
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Game state
  const [selectedWord, setSelectedWord] = useState(null);
  const [gameState, setGameState] = useState("initial");
  const [result, setResult] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);

  const canvasRef = useRef(null);

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const selectedWord = generateWord('EASY');
        setSelectedWord(selectedWord);
  
        const gameSession = await mockAPI.createGame(1, "EASY", selectedWord?.prompt);
        if (gameSession && gameSession.game) {
          setGameId(gameSession.game.id);
          console.log('Game initialized:', { word: selectedWord?.prompt, gameId: gameSession.game.id });
        } else {
          throw new Error('Failed to initialize game session');
        }
      } catch (err) {
        console.error('Error initializing game:', err);
        setError('Failed to initialize game. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeGame();
  }, []);

  const handleStartDrawing = () => {
    setGameState("playing");
  };

  const handleTimeUp = useCallback(async () => {
    setGameState("timeUp");

    if (gameId && imageData) {
      try {
        await mockAPI.submitDrawing(gameId, {
          game_id: gameId,
          art: imageData 
        });
        console.log('Drawing submitted for game:', gameId);
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
      setIsLoading(true);
      setError(null);
      
      const newSelectedWord = generateWord('EASY');
      setSelectedWord(newSelectedWord);
  
      const gameSession = await mockAPI.createGame(1, "EASY", newSelectedWord?.prompt);
      setGameId(gameSession.game.id);
  
      setGameState("initial");
      setResult(null);
      setImageData(null);
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
      
      console.log('New game started:', { word: newSelectedWord?.prompt, gameId: gameSession.game.id });
    } catch (err) {
      console.error('Error starting new game:', err);
      setError('Failed to start new game');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-gray-600">Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={handlePlayAgain}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!selectedWord) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {gameState === "initial" && (
        <div className="retroContainer">
          <div className="retroHeader">
            <h2 className="text-lg font-bold">Your Word</h2>
          </div>
          <div className="bg-white p-6 text-center">
            <h2 className="text-2xl font-bold text-eerie-black mb-4">
              Draw: {selectedWord?.prompt}
            </h2>
            <button onClick={handleStartDrawing} className="retroButton">
              Start Drawing
            </button>
          </div>
        </div>
      )}

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
                  Draw: {selectedWord?.prompt}
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
                onClearCanvas={() => canvasRef.current?.clearCanvas()}
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
                onImageUpdate={handleImageUpdate}
              />
              <div className="mt-4">
                <PredictionHandler
                  imageData={imageData}
                  selectedWord={selectedWord}
                  onPredictionComplete={handlePredictionComplete}
                />
                {result && (
                  <div className="mt-4">
                    <Result {...result} />
                    <div className="text-center mt-6">
                      <button onClick={handlePlayAgain} className="retroButton">
                        Play Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {gameState === "timeUp" && !result && (
            <div className="retroContainer">
              <div className="retroHeader">
                <h2 className="text-lg font-bold">Time's Up!</h2>
              </div>
              <div className="bg-white p-6 text-center">
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
