import { apiService } from './api';
import { QUICKDRAW_WORDS, generateWord as generateLocalWord } from './wordGeneration';

export const generateWord = async (difficulty = 'EASY') => {
  try {
    // Try to get words from backend first
    const words = await apiService.getWordByDifficulty(difficulty);
    if (words && words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      return words[randomIndex];
    }
  } catch (error) {
    console.log('Falling back to local words due to:', error);
  }

  // Fallback to local words if backend fails
  return generateLocalWord(difficulty);
};

export const getDifficulties = () => ['EASY', 'MEDIUM', 'HARD'];