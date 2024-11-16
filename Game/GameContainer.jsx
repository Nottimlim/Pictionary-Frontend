import React, { useState, useCallback, useRef, useEffect } from 'react';
import CanvasDrawing from './Canvas/CanvasDrawing';
import CanvasControls from './Canvas/CanvasControls';
// import PredictionHandler from './AIComponents/PredictionHandler'; greying out for mockdata purposes
// import Result from './AIComponents/Result'; greying out for mockdata purposes
import mockAPI from '../src/services/mockData';
import WordDisplay from './WordDisplay';
import Timer from './Timer';

const TIMER_DURATION = 20; // 20 seconds

const GameContainer = () => {
  // State for drawing settings
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Game state
  const [selectedWord, setSelectedWord] = useState('');
  const [gameState, setGameState] = useState('initial'); // initial, playing, timeUp
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

      const newGame = await mockAPI.createGame(1, 'Easy'); // assuming user ID 1
      setGameId(newGame.game.id); // store game ID
    };
    initializeGame();
  }, []);

  // Game state handlers
  const handleStartDrawing = () => {
    setGameState('playing');
  };

  const handleTimeUp = useCallback(async () => {
    setGameState('timeUp');
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
    setGameState('initial');
    setResult(null);
    setSelectedWord(''); // reset word
    canvasRef.current.clearCanvas(); //clear the canvas
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* word display */}
      {gameState === 'initial' && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Draw: {selectedWord}</h2>
          <button onClick={handleStartDrawing} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Start Drawing
          </button>
        </div>
      )}

      {/* main game interface */}
      {gameState !== 'initial' && (
        <div className="max-w-4xl mx-auto">
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

          <CanvasControls onClearCanvas={() => canvasRef.current.clearCanvas()} />

          <div className="flex gap-4 mb-4 items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Brush Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm w-8">{strokeWidth}px</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Color:</span>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-8 h-8 rounded"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Background:</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded"
              />
            </div>
          </div>

          <CanvasDrawing
            ref={canvasRef}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            bgColor={bgColor}
            disabled={gameState === 'timeUp'}
          />

          {/* results modal */}
          {gameState === 'timeUp' && result && (
            <div className="mt-4 p-4 bg-white shadow-md rounded-lg text-center">
              <h3 className="text-xl font-bold">{result.winner ? "You Win!" : "Try Again!"}</h3>
              <button
                onClick={handlePlayAgain}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameContainer;
