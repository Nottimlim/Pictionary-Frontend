import React, { useState, useEffect, useCallback } from 'react';

const Timer = ({ duration, onTimeUp, gameState }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Memoize the time's up handler
  const handleTimeUp = useCallback(() => {
    if (gameState === 'playing') {
      onTimeUp();
    }
  }, [onTimeUp, gameState]);

  useEffect(() => {
    // Reset timer when game state changes to playing
    if (gameState === 'playing') {
      setTimeLeft(duration);
    }
  }, [gameState, duration]);

  // Handle countdown
  useEffect(() => {
    let intervalId = null;

    if (gameState === 'playing' && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameState, timeLeft, handleTimeUp]);

  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const progressWidth = `${Math.max((timeLeft / duration) * 100, 0)}%`;


  return (
    <div className="flex-1">
      <div className="flex items-center gap-4">
        <div className="text-xl font-mono text-eerie-black">
          {timeString}
        </div>
        <div className="flex-1 bg-vanilla-300 h-4 border border-eerie-black-600">
          <div
            className="bg-indian-red h-full transition-all duration-1000"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
      {timeLeft <= 0 && (
        <div className="text-indian-red-500 font-semibold mt-2">
          Time's up!
        </div>
      )}
    </div>
  );
};

export default Timer;
