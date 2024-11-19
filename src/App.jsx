import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import HomePage from "./HomePage";
import GameContainer from "../Game/GameContainer";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./navbar/NavBar";
import { authService } from './services/authService';

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const currentUser = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-vanilla-500">
      <Navbar 
        containerClassName="bg-atomic-tangerine-500 text-white py-1"
        brandName="WHATADUUDLE GAME!"
        userName={!isHomePage ? currentUser?.username : null}
      />
      <div className="pt-8">
        <div className="px-4 py-8">
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
    </div>
  );
};

export default App;
