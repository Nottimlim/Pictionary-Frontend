const Timer = ({ duration, onTimeUp, gameState }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-4">
        <div className="text-xl font-mono">
          {`${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`}
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / duration) * 100}%` }}
          />
        </div>
      </div>
      {timeLeft <= 0 && (
        <div className="text-yellow-600 font-semibold mt-2">Time's up!</div>
      )}
    </div>
  );
};

export default Timer;
