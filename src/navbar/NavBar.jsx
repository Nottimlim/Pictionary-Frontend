import React from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { authService } from "../services/authService";

const Navbar = ({ brandName, containerClassName, userName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiService.logout();
      authService.clearAuth();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`${containerClassName} fixed top-0 left-0 right-0 z-50`}>
      <div className="flex justify-between items-center px-4 relative">
        <div className="font-normal text-sm text-black">{brandName}</div>
        {userName && (
          <div className="font-normal text-sm text-black absolute left-1/2 transform -translate-x-1/2">
            Player: {userName}
          </div>
        )}
        {userName && (
          <button
            onClick={handleLogout}
            className="font-normal text-sm text-black hover:text-indian-red-500 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
