# Whataduudle

## Description
Whataduudle is an exciting web-based drawing game inspired by Google's QuickDraw. Players are given prompts to draw within a time limit, and an AI component attempts to recognize the drawing. Unlike QuickDraw's real-time recognition, Whataduudle uses a submit-based approach for AI image recognition.

## Team Members
- Timothy Lim - Frontend Development & Frontend Manager
- Norman - Frontend Development
- Mandy - Backend Manager and Backend Development
- Manny - Backend Development
- Nyunt - Fullstack Development

## Technologies Used
### Frontend
- React.js
- JavaScript
- HTML 
- Canvas
- Vite/Vite React
- TensorFlow.js
- TailwindCSS

### Backend
- Django
- PostgreSQL
- RESTful API

## User Stories (MVP)
As a user (AAU):
- I want to be able to sign-up for an account if wanted
- I want to be able to sign-in and out
- I want to be able to see a landing page
- When game is lost or won, I want to be able to replay
- I want to be able to draw my prompt
- I want to clear my drawing
- I want to see the prompt/word I'm drawing
- I want to see the time I have left and prompt while drawing
- I want a fast and exciting round (20-40 seconds)
- I want to be able to register and login in order to play

## Component Architecture
### Core Components
- `App.jsx` - Main application component
- `HomePage.jsx` - Landing page with how to play instructions
- `GameContainer.jsx` - Main game logic container

### Authentication Components
- `Register.jsx` - User registration form
- `Login.jsx` - User login form

### Game Components
- `WordDisplay.jsx` - Displays current word prompt and timer
- `CanvasDrawing.jsx` - Drawing canvas component
- `CanvasControls.jsx` - Drawing controls (clear, submit, etc.)
- `Timer.jsx` - Game countdown timer
- `Result.jsx` - Modal displaying win/lose results
- `PredictionHandler.jsx` - Handles AI prediction logic

## Data Models
### User
- id (Integer, PK)
- username (String)
- email (String)
- password (String, hashed)

### Game
- id (UUID, PK)
- user_id (FK)
- status (String)
- winner (Boolean)
- difficulty (enum: Easy, Normal, Hard)
- created_at (Timestamp)
- endtime (Timestamp)

### Word
- id (ObjectId, PK)
- prompt (String)
- difficulty (String)
- active (Boolean)

### Drawing
- id (Integer, PK)
- game_id (FK)
- art (JSON)

## API Routes
### Game Routes
- `GET/PUT/DELETE /games/<int:game_id>/` - Game details and management

### Word Routes
- `GET/POST /words` - Word list management
- `GET/PUT/DELETE /word/:id` - Single word management
- `POST /word/<int:word_id>/games` - Start game with selected word

### User Routes
- `POST /user/register/` - User registration
- `POST /user/sign-in` - User authentication
- `PUT /user/profile/edit` - Profile management

## Game Flow
1. User registers/logs in
2. Views landing page with instructions
3. Starts game and receives word prompt
4. Has 20-60 seconds to complete drawing dependent on difficulty
5. Submits drawing for AI recognition
6. Receives win/lose result
7. Option to play again

## Order of Implementation
1. Drawing Functionality: As discussed, this is central to the app's purpose.
2. Landing Page: This can be a simple component that explains the game and provides a start button to navigate to the drawing game.
3. Authentication: Implementing user registration and login will allow for a more complete user experience and testing of user-specific features like game history.
4. Game Loop and AI Integration: Once drawing is working, integrate the AI components and finalize the game loop, including submitting drawings and receiving results.

## Current Development Status
- Basic drawing functionality implemented
- Mock game setup and results handling in place
- Frontend development in progress (Timothy)
- AI component being handled by Norman
- Backend implementation planned
- User interface and game mechanics being prioritized

## Next Steps
- Finalize AI integration for drawing recognition
- Set up authentication flow
- Enhance game loop mechanics
- Develop results display
- Style user interface