// src/services/wordGeneration.js
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Categories by difficulty
const DIFFICULTY_PROMPTS = {
  EASY: `You are a word generator for a Pictionary-like drawing game. Generate ONE simple, easy-to-draw word or short phrase.
    Choose from these categories:
    - Simple animals (cat, dog, bird)
    - Basic objects (chair, book, cup)
    - Nature items (tree, sun, flower)
    - Common vehicles (car, bike, boat)
    - Food items (apple, pizza, cake)
    
    Requirements:
    - Must be easy to draw within 20 seconds
    - Must be recognizable from a simple sketch
    - Return ONLY the word/phrase, nothing else
    - Keep it to 1-3 words maximum`,

  MEDIUM: `You are a word generator for a Pictionary-like drawing game. Generate ONE moderately challenging word or phrase.
    Choose from these categories:
    - Activities (running, dancing, cooking)
    - Complex objects (computer, guitar, telescope)
    - Scenes (beach, park, classroom)
    - Sports (basketball game, tennis match)
    
    Requirements:
    - Should be drawable within 20 seconds
    - Must be recognizable from a sketch
    - Return ONLY the word/phrase, nothing else
    - Keep it to 1-3 words maximum`,

  HARD: `You are a word generator for a Pictionary-like drawing game. Generate ONE challenging word or phrase.
    Choose from these categories:
    - Abstract concepts (happiness, time, freedom)
    - Complex scenes (city skyline, space station)
    - Detailed activities (playing volleyball, cooking dinner)
    - Specific scenarios (birthday party, road trip)
    
    Requirements:
    - Should be drawable within 20 seconds
    - Must be recognizable from a sketch
    - Return ONLY the word/phrase, nothing else
    - Keep it to 1-3 words maximum`
};

// Fallback words in case API fails
const FALLBACK_WORDS = {
  EASY: ['cat', 'dog', 'tree', 'sun', 'house', 'car', 'bird', 'fish', 'book', 'cup'],
  MEDIUM: ['playing guitar', 'riding bike', 'cooking food', 'reading book', 'playing tennis'],
  HARD: ['birthday party', 'city skyline', 'space station', 'beach vacation', 'rock concert']
};

export const generateWord = async (difficulty = 'EASY') => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama2-70b-4096',
        messages: [{
          role: 'system',
          content: 'You are a word generator for a Pictionary-like drawing game. You only respond with single words or short phrases, no additional text.'
        }, {
          role: 'user',
          content: DIFFICULTY_PROMPTS[difficulty]
        }],
        temperature: 0.7,
        max_tokens: 50,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate word');
    }

    const data = await response.json();
    const word = data.choices[0].message.content.trim();

    // Validate the response
    if (word.split(' ').length > 3) {
      // If response is too long, use fallback
      return getRandomFallbackWord(difficulty);
    }

    return word;
  } catch (error) {
    console.error('Error generating word:', error);
    return getRandomFallbackWord(difficulty);
  }
};

const getRandomFallbackWord = (difficulty) => {
  const words = FALLBACK_WORDS[difficulty];
  return words[Math.floor(Math.random() * words.length)];
};