import React, { useState, useEffect } from 'react';

const Timer = ({ duration, onTimeUp, gameState }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer when game state changes
  useEffect(() => {
    if (gameState === 'playing') {
      setTimeLeft(duration);
    }
  }, [gameState, duration]);

  // Handle countdown and time up
  useEffect(() => {
    let intervalId = null;

    if (gameState === 'playing' && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Clear interval immediately
            clearInterval(intervalId);
            // Call onTimeUp in a setTimeout to avoid state updates during render
            setTimeout(() => {
              if (gameState === 'playing') {
                onTimeUp();
              }
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameState, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const progressWidth = `${Math.max((timeLeft / duration) * 100, 0)}%`;

  return (
    <div className="flex-1 px-4">
      <div className="flex items-center gap-4">
        <div className="text-xl font-mono text-eerie-black">
          Time Remaining: {timeString}
        </div>
        <div className="flex-1 bg-vanilla-300 h-4 border border-eerie-black-600">
          <div
            className="bg-indian-red h-full transition-all duration-1000"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
      {timeLeft <= 0 && (
        <div className="text-indian-red-500 font-semibold mt-2 ml-1">
          Time's up!
        </div>
      )}
    </div>
  );
};

export default Timer;
