import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import HomePage from "./HomePage";
import GameContainer from "../Game/GameContainer";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const location = useLocation();

  // Check if the current path is the homepage
  const isHomePage = location.pathname === "/";
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-vanilla-500">
      <div className="px-4 py-8">
        {/* Only show header on game page */}
        {!isHomePage && !isAuthPage && (
          <div className="retroContainer mb-8">
            <div className="retroHeader">
              <h1 className="text-2xl font-bold">WHATADUUDLE!!</h1>
            </div>
            <div className="bg-white p-4">
              <p className="text-eerie-black">
                Draw the word and let AI guess what it is!
              </p>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GameContainer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
