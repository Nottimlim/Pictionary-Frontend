import axios from 'axios';
import { authService } from './authService.js';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.clearAuth();
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  register: async (userData) => {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login/', credentials);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/users/token/refresh/');
    return response.data;
  },

  // Games
  getGames: async () => {
    const response = await api.get('/games/');
    return response.data;
  },

  getGame: async (id) => {
    const response = await api.get(`/games/${id}/`);
    return response.data;
  },

  updateGame: async (id, gameData) => {
    const response = await api.patch(`/games/${id}/`, gameData);
    return response.data;
  },

  // Words
  getWords: async () => {
    const response = await api.get('/words/');
    return response.data;
  },

  getWord: async (id) => {
    const response = await api.get(`/words/${id}/`);
    return response.data;
  },

  getWordByDifficulty: async (difficulty) => {
    const response = await api.get(`/words/?difficulty=${difficulty}`);
    return response.data;
  },

  createWord: async (wordData) => {
    const response = await api.post('/words/', wordData);
    return response.data;
  },

  // Game Creation with Word
  startGameWithWord: async (wordId) => {
    const response = await api.post(`/words/${wordId}/games/`);
    return response.data;
  },

  // Drawings
  getGameDrawings: async (gameId) => {
    const response = await api.get(`/games/${gameId}/drawings/`);
    return response.data;
  },

  createDrawing: async (gameId, drawingData) => {
    const response = await api.post(`/games/${gameId}/drawings/`, drawingData);
    return response.data;
  },

  getDrawing: async (gameId, drawingId) => {
    const response = await api.get(`/games/${gameId}/drawings/${drawingId}/`);
    return response.data;
  },

  updateDrawing: async (gameId, drawingId, drawingData) => {
    const response = await api.patch(`/games/${gameId}/drawings/${drawingId}/`, drawingData);
    return response.data;
  },

  deleteDrawing: async (gameId, drawingId) => {
    const response = await api.delete(`/games/${gameId}/drawings/${drawingId}/`);
    return response.data;
  }
};

// http://127.0.0.1:8000/games/42/