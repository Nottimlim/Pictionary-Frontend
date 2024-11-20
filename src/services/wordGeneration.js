// src/services/wordGeneration.js

export const QUICKDRAW_WORDS = [
    //ANIMALS
    { prompt: 'cat', difficulty: 'EASY' },
    { prompt: 'dog', difficulty: 'EASY' },
    { prompt: 'fish', difficulty: 'EASY' },
    { prompt: 'bird', difficulty: 'EASY' },
    { prompt: 'rabbit', difficulty: 'EASY' },
    { prompt: 'bear', difficulty: 'MEDIUM' },
    { prompt: 'chicken', difficulty: 'EASY' },
    { prompt: 'monkey', difficulty: 'HARD' },
    { prompt: 'leopard', difficulty: 'MEDIUM' },
    { prompt: 'lion', difficulty: 'MEDIUM' },
    { prompt: 'tiger', difficulty: 'MEDIUM' },
    { prompt: 'elephant', difficulty: 'HARD' },
    { prompt: 'giraffe', difficulty: 'HARD' },
    { prompt: 'zebra', difficulty: 'HARD' },
    { prompt: 'horse', difficulty: 'MEDIUM' },
    { prompt: 'pig', difficulty: 'MEDIUM' },
    { prompt: 'sheep', difficulty: 'MEDIUM' },
    { prompt: 'cow', difficulty: 'MEDIUM' },
    { prompt: 'deer', difficulty: 'MEDIUM' },
    { prompt: 'wolf', difficulty: 'HARD' },
  
    //FOOD 
    { prompt: 'pizza', difficulty: 'EASY' },
    { prompt: 'donut', difficulty: 'EASY' },
    { prompt: 'burger', difficulty: 'EASY' },
    { prompt: 'sandwich', difficulty: 'EASY' },
    { prompt: 'cake', difficulty: 'EASY' },
    { prompt: 'apple', difficulty: 'EASY' },
    { prompt: 'banana', difficulty: 'EASY' },
    { prompt: 'carrot', difficulty: 'EASY' },
    { prompt: 'orange', difficulty: 'EASY' },
    { prompt: 'pear', difficulty: 'EASY' },
    { prompt: 'potato', difficulty: 'EASY' },
    { prompt: 'grape', difficulty: 'EASY' },
    { prompt: 'strawberry', difficulty: 'EASY' },
    { prompt: 'watermelon', difficulty: 'MEDIUM' },
    { prompt: 'chocolate', difficulty: 'EASY' },
    { prompt: 'ice cream', difficulty: 'MEDIUM' },
    { prompt: 'cookie', difficulty: 'EASY' },
    { prompt: 'brownie', difficulty: 'MEDIUM' },
    { prompt: 'noodle', difficulty: 'HARD' },
  
    //INSTRUMENTS
    { prompt: 'guitar', difficulty: 'EASY' },
    { prompt: 'piano', difficulty: 'EASY' },
    { prompt: 'drums', difficulty: 'EASY' },
    { prompt: 'violin', difficulty: 'MEDIUM' },
    { prompt: 'trumpet', difficulty: 'MEDIUM' },
    { prompt: 'saxophone', difficulty: 'HARD' },
    { prompt: 'flute', difficulty: 'EASY' },
    { prompt: 'ukulele', difficulty: 'EASY' },
    { prompt: 'harmonica', difficulty: 'EASY' },
    { prompt: 'xylophone', difficulty: 'HARD' },
  
    //OBJECTS
    { prompt: 'lamp', difficulty: 'EASY' },
    { prompt: 'chair', difficulty: 'EASY' },
    { prompt: 'phone', difficulty: 'EASY' },
    { prompt: 'tv', difficulty: 'EASY' },
    { prompt: 'computer', difficulty: 'EASY' },
    { prompt: 'book', difficulty: 'EASY' },
    { prompt: 'pen', difficulty: 'EASY' },
    { prompt: 'paper', difficulty: 'EASY' },
    { prompt: 'desk', difficulty: 'EASY' },
    { prompt: 'table', difficulty: 'EASY' },
    { prompt: 'bed', difficulty: 'EASY' },
    { prompt: 'door', difficulty: 'EASY' },
    { prompt: 'window', difficulty: 'EASY' },
    { prompt: 'key', difficulty: 'EASY' },
    { prompt: 'lock', difficulty: 'EASY' },
  
    //TRANSPORTATION
    { prompt: 'car', difficulty: 'EASY' },
    { prompt: 'bus', difficulty: 'EASY' },
    { prompt: 'bike', difficulty: 'EASY' },
    { prompt: 'boat', difficulty: 'EASY' },
    { prompt: 'train', difficulty: 'EASY' },
    { prompt: 'plane', difficulty: 'EASY' },
    { prompt: 'ship', difficulty: 'EASY' },
    { prompt: 'motorcycle', difficulty: 'MEDIUM' },
    { prompt: 'van', difficulty: 'EASY' },
    { prompt: 'truck', difficulty: 'EASY' },
    { prompt: 'taxi', difficulty: 'EASY' },
    { prompt: 'helicopter', difficulty: 'HARD' },
    { prompt: 'spaceship', difficulty: 'EASY' },
    { prompt: 'rocket', difficulty: 'EASY' },
  
    //MISCELLANEOUS
    { prompt: 'face', difficulty: 'EASY' },
    { prompt: 'smile', difficulty: 'EASY' },
    { prompt: 'eyes', difficulty: 'EASY' },
    { prompt: 'nose', difficulty: 'EASY' },
    { prompt: 'mouth', difficulty: 'EASY' },
    { prompt: 'hair', difficulty: 'EASY' },
    { prompt: 'watch', difficulty: 'EASY' },
    { prompt: 'camera', difficulty: 'EASY' },
    { prompt: 'keyboard', difficulty: 'EASY' },
    { prompt: 'robot', difficulty: 'HARD' },
  ];
  
  
// Generate a word based on difficulty
export const generateWord = (difficulty = 'EASY') => {
    // Filter words by difficulty
    const wordsForDifficulty = QUICKDRAW_WORDS.filter(word => word.difficulty === difficulty);
    
    // Pick a random word
    const randomIndex = Math.floor(Math.random() * wordsForDifficulty.length);
    const selectedWord = wordsForDifficulty[randomIndex];
    
    console.log('Generated word:', selectedWord.prompt); // For debugging
    return selectedWord;
};
  // Get available difficulties 
  export const getDifficulties = () => ['EASY', 'MEDIUM', 'HARD'];