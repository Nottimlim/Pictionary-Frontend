import React from "react";
import GameContainer from "../Game/GameContainer";
import './index.css'

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            AI Pictionary
          </h1>
          <p className="text-gray-600 mt-2">
            Draw the word and let AI guess what it is!
          </p>
        </div>
        <GameContainer />
      </div>
    </div>
  );
};

export default App;
