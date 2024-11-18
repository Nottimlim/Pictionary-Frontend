import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mockAPI from "../services/mockData";

const Register = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match fam!");
      return;
    }

    try {
      const response = await mockAPI.register(formData);
      if (response.success) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md" id="register">
        <div className="retroContainer">
          <div className="retroHeader">
            <h2 className="text-lg font-bold">Register</h2>
          </div>
          <div className="bg-white p-6">
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
                <label className="retroLabel">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
              <div>
                <label className="retroLabel">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="retroInput"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <button type="submit" className="retroButton">
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="text-eerie-black-600 hover:text-indian-red"
                >
                  Already have an account? Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
