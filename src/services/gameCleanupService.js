import { apiService } from './api';
import config from '../config/environment';

export const gameCleanupService = {
  cleanupGame: async (gameId) => {
    if (!gameId) return;
    
    try {
      await apiService.deleteGame(gameId);
      console.log('Game cleaned up successfully:', gameId);
    } catch (error) {
      console.error('Failed to cleanup game:', {
        gameId,
        error: error.response?.data || error.message
      });
    }
  },

  setupUnloadCleanup: (gameId) => {
    const handleUnload = async (event) => {
      if (gameId) {
        // Keep the page from immediately closing
        event.preventDefault();
        event.returnValue = '';

        try {
          // Synchronous request to logout and cleanup
          const xhr = new XMLHttpRequest();
          const url = `${config.API_URL}/users/logout/`;
          
          console.log('Cleaning up on tab close, game:', gameId);
          
          xhr.open('POST', url, false); // Synchronous request
          
          const token = localStorage.getItem('whataduudleAccessToken');
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          xhr.send();
          
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Cleanup successful');
            // Clear local storage
            localStorage.clear();
          } else {
            console.error('Cleanup failed:', xhr.status, xhr.responseText);
          }
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }
};
