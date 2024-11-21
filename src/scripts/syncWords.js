import axios from 'axios';
import { QUICKDRAW_WORDS } from '../services/wordGeneration.js';

// Create a Node-specific axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

const syncWords = async () => {
  console.log('Starting word sync...');
  let succeeded = 0;
  let failed = 0;

  try {
    // First, log in as admin to get token
    const loginResponse = await api.post('/users/login/', {
      username: 'duudle',
      password: '1234'
    });

    // Add token to subsequent requests
    api.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.access}`;

    // Now sync words
    for (const word of QUICKDRAW_WORDS) {
      try {
        await api.post('/words/', word);
        succeeded++;
        console.log(`✓ Synced: ${word.prompt}`);
      } catch (error) {
        failed++;
        console.error(`✗ Failed to sync ${word.prompt}:`, 
          error.response?.data?.detail || error.message);
      }
    }
  } catch (error) {
    console.error('Failed to authenticate:', 
      error.response?.data?.detail || error.message);
    process.exit(1);
  }

  console.log('\nSync complete!');
  console.log(`Successfully synced: ${succeeded} words`);
  console.log(`Failed to sync: ${failed} words`);
};

// Run the sync
syncWords().catch(console.error);