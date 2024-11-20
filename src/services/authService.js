const accessTokenKey = 'whataduudleAccessToken';
const refreshTokenKey = 'whataduudleRefreshToken';
const userKey = 'whataduudleUser';

export const authService = {
  setAuth: ({ user, token, refreshToken }) => {
    localStorage.setItem(accessTokenKey, token);
    localStorage.setItem(refreshTokenKey, refreshToken);
    localStorage.setItem(userKey, JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    localStorage.removeItem(userKey);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(accessTokenKey);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(userKey);
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem(accessTokenKey);
  },

  getRefreshToken: () => {
    return localStorage.getItem(refreshTokenKey);
  },

  needsRefresh: () => {
    const token = localStorage.getItem(accessTokenKey);
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();
      return expiresIn < 60000;
    } catch {
      return true;
    }
  }
};
