// Simple auth service to work with our mock data
const authTokenKey = 'whataduudleAuthToken';
const userKey = 'whataduudleUser';

export const authService = {
  // Set auth data after successful login
  setAuth: (user) => {
    // In real app, this would be a JWT token
    const mockToken = btoa(JSON.stringify({ id: user.id, username: user.username }));
    localStorage.setItem(authTokenKey, mockToken);
    localStorage.setItem(userKey, JSON.stringify(user));
  },

  // Clear auth data on logout
  clearAuth: () => {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(userKey);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(authTokenKey);
  },

  // Get current user data
  getCurrentUser: () => {
    const userStr = localStorage.getItem(userKey);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem(authTokenKey);
  }
};
