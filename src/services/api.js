// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper function to handle fetch calls
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Auth endpoints
export const authAPI = {
  register: async (userData) => {
    return fetchWithAuth('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (credentials) => {
    const response = await fetchWithAuth('/users/login/', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  refreshToken: async () => {
    return fetchWithAuth('/users/token/refresh/', {
      method: 'POST'
    });
  }
};

// Game endpoints
export const gameAPI = {
  getDetails: async (gameId) => {
    return fetchWithAuth(`/games/${gameId}/`);
  },

  // Get word list
  getWords: async () => {
    return fetchWithAuth('/words/');
  },

  // Get specific word details
  getWordDetails: async (wordId) => {
    return fetchWithAuth(`/words/${wordId}/`);
  },

  // Start a new game with a specific word
  startGame: async (wordId) => {
    return fetchWithAuth(`/words/${wordId}/game`, {
      method: 'POST'
    });
  }
};

// Mock version for development
export const mockAPI = {
  auth: {
    register: async (userData) => {
      console.log('Mock Register:', userData);
      return {
        id: 1,
        username: userData.username,
        email: userData.email
      };
    },

    login: async (credentials) => {
      console.log('Mock Login:', credentials);
      return {
        token: 'mock_token_123',
        user: {
          id: 1,
          username: credentials.username
        }
      };
    },

    refreshToken: async () => {
      return {
        token: 'mock_refreshed_token_123'
      };
    }
  },

  game: {
    getDetails: async (gameId) => {
      return {
        id: gameId,
        status: 'active',
        word: {
          id: 1,
          text: 'cat',
          category: 'animals',
          difficulty: 'easy'
        },
        created_at: new Date().toISOString()
      };
    },

    getWords: async () => {
      return {
        results: [
          { id: 1, text: 'cat', category: 'animals', difficulty: 'easy' },
          { id: 2, text: 'dog', category: 'animals', difficulty: 'easy' },
          // ... more words
        ]
      };
    },

    getWordDetails: async (wordId) => {
      return {
        id: wordId,
        text: 'cat',
        category: 'animals',
        difficulty: 'easy',
        games_played: 10,
        success_rate: 75
      };
    },

    startGame: async (wordId) => {
      return {
        game_id: Date.now(),
        word_id: wordId,
        status: 'active',
        started_at: new Date().toISOString()
      };
    },

    submitDrawing: async (gameId, drawingData) => {
      return {
        game_id: gameId,
        status: 'completed',
        prediction: 'cat',
        success: true,
        completed_at: new Date().toISOString()
      };
    }
  }
};