// yo this is our fake backend stuff while we wait for the real one
// feel free to add more stuff as needed

// dummy users - add more if u want to test different scenarios
const mockUsers = [
    {
      id: 1,
      username: "timlim",
      email: "timlim@gmail.com",
      password: "hashed_hashedPassword123", // obvs gonna be actually hashed in real backend
    },
    {
      id: 2,
      username: "norman",
      email: "norman@gmail.com",
      password: "hashed_123456",
    },
  ];
  
  // stuff we can draw - keeping it simple for now
  // add more when we got time to test different difficulty levels
  const mockDataset = [
    {
      id: 1,
      prompt: "cat",
      difficulty: "EASY",
      active: true,
    },
    {
      id: 2,
      prompt: "helicopter",
      difficulty: "HARD", // this one's tough fr
      active: true,
    },
    {
      id: 3,
      prompt: "house",
      difficulty: "EASY",
      active: true,
    },
  ];
  
  // keeping track of games played - might need this for stats later
  const mockGames = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: 1,
      status: "completed",
      winner: true,
      difficulty: "EASY",
      created_at: "2024-03-15T10:00:00Z",
      endtime: "2024-03-15T10:00:30Z",
      prompt: "cat",
      timeSpent: 25, // seconds yo
    },
  ];
  
  // where we store the masterpieces
  const mockDrawings = [
    {
      id: 1,
      game_id: "123e4567-e89b-12d3-a456-426614174000",
      art: JSON.stringify({}), // canvas data goes here when we actually draw
      predictions: [{ label: "cat", confidence: 0.82 }],
      submittedAt: "2024-03-15T10:00:25Z",
    },
  ];
  
  // all our fake API stuff - gonna replace this with real endpoints later
  const mockAPI = {
    // login/signup stuff
    register: async (userData) => {
      try {
        // check if someone yoinked that username already
        const existingUser = mockUsers.find(
          (user) => user.username === userData.username
        );
        if (existingUser) {
          throw new Error("username already taken fam");
        }
  
        // make a new user - password gets "hashed" (not really but pretend it is)
        const newUser = {
          ...userData,
          id: Date.now(),
          password: `hashed_${userData.password}`,
        };
        mockUsers.push(newUser);
  
        // don't send the password back lol that would be bad
        const { password, ...userWithoutPassword } = newUser;
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true, user: userWithoutPassword };
      } catch (error) {
        throw error;
      }
    },
  
    login: async ({ username, password }) => {
      try {
        // checking if user exists and password matches
        const user = mockUsers.find(
          (user) =>
            user.username === username && user.password === `hashed_${password}`
        );
  
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        if (!user) {
          throw new Error("nah fam, wrong username or password");
        }
  
        // yeet the password before sending
        const { password: pwd, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
      } catch (error) {
        throw error;
      }
    },
  
    // grabbing a random word for the game
    getRandomWord: async (difficulty = "EASY") => {
      const filteredWords = mockDataset.filter(
        (word) => word.difficulty === difficulty && word.active
      );
      const randomWord =
        filteredWords[Math.floor(Math.random() * filteredWords.length)];
      await new Promise((resolve) => setTimeout(resolve, 300));
      return randomWord;
    },
  
// setting up a new game
createGame: async (userId, difficulty, wordPrompt) => {
    try {
      // If no wordPrompt provided, get a random one
      const word = wordPrompt ? { prompt: wordPrompt } : await mockAPI.getRandomWord(difficulty);
      
      if (!word) {
        throw new Error("Failed to get word for game");
      }
  
      const newGame = {
        id: crypto.randomUUID(),
        user_id: userId,
        status: "active",
        winner: null,
        difficulty,
        prompt: word.prompt,
        created_at: new Date().toISOString(),
        endtime: null,
        timeSpent: 0,
      };
  
      mockGames.push(newGame);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { game: newGame, word };
    } catch (error) {
      console.error("Error in createGame:", error);
      throw error;
    }
  },
  
  
    // the main event - checking if the drawing matches the prompt
    submitDrawing: async (gameId, drawingData) => {
      try {
        // find the game we're playing
        const game = mockGames.find((g) => g.id === gameId);
        if (!game) throw new Error("game not found fam");
  
        // simulate AI thinking about the drawing
        // random 50/50 chance of winning for development testing
        const simulatePrediction = () => {
          const confidence = Math.random(); // gives us 0 to 1
          return {
            label: game.prompt,
            confidence: confidence, // we can tweak this if we want different win rates
          };
        };
  
        const prediction = simulatePrediction();
        const newDrawing = {
          id: Date.now(),
          game_id: gameId,
          art: JSON.stringify(drawingData),
          predictions: [prediction],
          submittedAt: new Date().toISOString(),
        };
  
        mockDrawings.push(newDrawing);
  
        // pretend we're doing some heavy AI stuff here
        await new Promise((resolve) => setTimeout(resolve, 1500));
  
        // did they draw it right? for now it's random
        const isCorrect = prediction.label === game.prompt;
  
        // wrap up the game - works for both timer and check drawing button
        game.status = "completed";
        game.winner = isCorrect;
        game.endtime = newDrawing.submittedAt;
  
        return {
          success: true,
          drawing: newDrawing,
          prediction,
          isCorrect,
          game,
        };
      } catch (error) {
        throw error;
      }
    },
  
    // grab game history for stats n stuff
    getGameHistory: async (userId) => {
      const userGames = mockGames
        .filter((game) => game.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      await new Promise((resolve) => setTimeout(resolve, 300));
      return userGames;
    },
  };
  
  export default mockAPI;
  