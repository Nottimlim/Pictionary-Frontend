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
      <main className="pt-10"> {/* Changed from pt-8 and removed nested div */}
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
      </main>
    </div>
  );
};

export default App;
