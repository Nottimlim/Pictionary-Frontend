import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { authService } from '../services/authService';

const Login = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiService.login(formData);
      
      // Store tokens and user data
      authService.setAuth({
        user: response.user,
        token: response.access,
        refreshToken: response.refresh
      });
      
      // Navigate to intended destination or game page
      const destinationPath = location.state?.from?.pathname || '/game';
      navigate(destinationPath, { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md" id="login">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  type="submit" 
                  className="retroButton"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="text-eerie-black-600 hover:text-indian-red"
                  disabled={isLoading}
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
