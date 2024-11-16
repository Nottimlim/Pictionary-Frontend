import React, { useState, useCallback } from 'react';
import CanvasDrawing from './Canvas/CanvasDrawing';
import CanvasControls from './Canvas/CanvasControls';
import PredictionHandler from './AIComponents/PredictionHandler';
import Result from './AIComponents/Result';
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
  const [imageData, setImageData] = useState(null);
  const [gameState, setGameState] = useState('initial'); // initial, playing, timeUp
  const [result, setResult] = useState(null);

  // ref to access the canvas methods - TL 
  const canvasRef = useRef(null);

  // Generate a new word for the game
  const generateNewWord = async () => {
    // TODO: Replace with actual word generation logic
    setSelectedWord('Cat standing on a table');
  };

  // Game state handlers
  const handleStartDrawing = () => {
    setGameState('playing');
  };

  const handleTimeUp = () => {
    setGameState('timeUp');
  };

  const handleImageUpdate = useCallback((newImageData) => {
    setImageData(newImageData);
  }, []);

  const handlePredictionComplete = (predictionResult) => {
    setResult(predictionResult);
  };

  const handlePlayAgain = () => {
    setGameState('initial');
    setResult(null);
    setImageData(null);
    generateNewWord();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Word Display Modal */}
      {gameState === 'initial' && (
        <WordDisplay 
          word={selectedWord}
          onStartDrawing={handleStartDrawing}
        />
      )}

      {/* Main Game Interface */}
      {gameState !== 'initial' && (
        <div className="max-w-4xl mx-auto">
          {/* Timer and Current Word */}
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

          {/* canvas controls - TL */}
          <CanvasControls onClearCanvas={() => canvasRef.current.clearCanvas()} />

          {/* Drawing Controls */}
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

          {/* Canvas */}
          <CanvasDrawing
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            bgColor={bgColor}
            onImageUpdate={handleImageUpdate}
            disabled={gameState === 'timeUp'}
          />

          {/* Results Section */}
          {gameState === 'timeUp' && (
            <div className="mt-4 space-y-4">
              <PredictionHandler
                imageData={imageData}
                selectedWord={selectedWord}
                onPredictionComplete={handlePredictionComplete}
              />
              
              {result && (
                <>
                  <Result {...result} />
                  <button
                    onClick={handlePlayAgain}
                    className="px-4 py-2 bg-green-500 text-white rounded
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
