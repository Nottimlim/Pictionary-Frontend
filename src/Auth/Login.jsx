import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mockAPI from "../services/mockData";

const Login = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await mockAPI.login(formData);
      if (response.success) {
        navigate("/game");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="retroContainer">
          <div className="retroHeader">
            <h2 className="text-lg font-bold">Login</h2>
          </div>
          <div className="bg-white p-6 h-90">
            {error && (
              <div className="bg-indian-red-100 border border-indian-red-500 text-indian-red-700 px-4 py-2 mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="formGroup">
              <div>
                <label className="retroLabel">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="retroInput"
                  required
                />
              </div>
              <div>
                <label className="retroLabel">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="retroInput"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <button type="submit" className="retroButton">
                  Login
                </button>
                <button
                  type="button"
                  // onClick={() => navigate('/register')}
                  onClick={() => setShowLogin(false)}
                  className="text-eerie-black-600 hover:text-indian-red"
                >
                  Need an account? Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
