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
  ```json
  {
    "imageData": "data:image/png;base64,...",
    "metadata": {
      "format": "png",
      "size": "129682",
      "word": "computer",
      "difficulty": "EASY"
    }
  }

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
- Basic drawing functionality implemented and optimized
- Canvas drawing controls with enhanced resolution (4x scaling)
- Retro UI styling with improved responsive behavior
- Mock game setup and results handling in place
- Authentication components created (Login/Register)
- Game interface organized into distinct sections:
  - Game Status (timer and word display with error handling)
  - Drawing Tools (compact retro-styled toolbar with optimized controls)
  - Canvas with improved scaling and coordinate mapping
  - Results Display with consistent modal behavior
  - AI Predictions panel with overflow handling
- Implemented retro-inspired toolbar design with fixed sizing
- Enhanced canvas drawing experience with proper cursor alignment
- Added robust game state management system
- Improved modal system for game flow with proper transitions
- Fixed panel sizing inconsistencies and overflow issues
- Frontend development in progress (Timothy)
- AI component being handled by Norman
- Backend implementation planned
- User interface and game mechanics optimized

## Recent Updates

Latest Changes (March 18, 2024):
- Added Difficulty System:
  - Implemented difficulty selector with EASY, MEDIUM, HARD options
  - Added dynamic word generation based on difficulty level
  - Integrated difficulty changes with game reset
  - Enhanced game flow to handle difficulty changes
  - Added seamless difficulty switching during gameplay
- Enhanced Canvas System:
  - Optimized canvas resolution with 4x scaling for better image quality
  - Fixed cursor-to-drawing alignment issues for accurate drawing experience
  - Implemented proper coordinate scaling for high-resolution drawing
  - Added window resize handling with canvas state preservation

- Improved Game Flow:
  - Enhanced timer and game state management
  - Added loading and error states for better user feedback
  - Implemented fallback word generation system
  - Fixed modal behavior for consistent user experience

- Auth:
  - Registeration redirect to game

- Drawing Tools Improvements:
  - Changed default brush size to start at maximum (20)
  - Added brush size slider with reverse direction for intuitive control
  - Optimized drawing tool controls for better responsiveness
  - Enhanced clear canvas functionality

- Bug Fixes and Optimizations:
  - Fixed results modal timing and display issues
  - Improved state management during game transitions
  - Enhanced error handling for game initialization
  - Fixed play again functionality and canvas reset
  - Resolved timer state update conflicts
  - Implemented Authentication System:
  - Added protected route functionality for game access
  - Integrated mock authentication service
  - Set up localStorage token management
  - Added auth state persistence
  - Enhanced login flow with proper redirects

- Improved Route Management:
  - Fixed router configuration
  - Added path memory for better UX
  - Streamlined app component structure
  - Enhanced navigation flow and component organization

Previous Updates:
- Fixed toolbar sizing consistency across all game states
- Improved right panel structure with proper overflow handling
- Added static dimensions to prevent content-based resizing
- Optimized toolbar and icon sizes to match classic software design
- Enhanced modal positioning and overlay behavior
- Implemented proper scroll handling for AI predictions
- Added fixed-width constraints for consistent panel sizing
- Improved responsive layout stability
- Enhanced game interface organization
- Fixed modal centering and overlay behavior
- Added proper text overflow handling in AI panel
- Implemented consistent sizing across all game states
- Enhanced canvas drawing system:
  - Implemented high-resolution drawing (2.05x scaling)
  - Added proper coordinate mapping for accurate cursor tracking
  - Fixed canvas scaling issues for better drawing experience
  - Optimized canvas performance with proper scaling
  - Added proper handling for window resizing
- Improved game mechanics:
  - Added manual drawing submission option
  - Enhanced timer integration with game states
  - Improved state management for game flow
  - Added proper modal transitions
  - Enhanced result display system
- Implemented authentication flow with Login and Register components
- Added route protection and navigation
- Created custom form styling for authentication
- Implemented retro-style UI components
- Added responsive canvas container
- Created game status display with timer and current word
- Implemented retro-style toolbar with iconic 90s design
- Added classic-style drawing tools (eraser and color picker)
- Integrated retro-styled slider for brush size control
- Enhanced canvas sizing for better drawing experience
- Improved modal positioning and overlay behavior
- Updated timer display with integrated time remaining
- Added clean game reset functionality
- Implemented proper game state management
- Enhanced UI responsiveness for drawing tools
- Updated game flow with proper word cycling
- Styled components to match 90s software aesthetic
- Organized game interface into logical sections
- Added proper spacing and layout for game elements
- Established consistent styling patterns using Tailwind CSS

Current Focus:
- Fine-tuning AI prediction integration
- Enhancing game state management
- Improving error handling and recovery
- Optimizing canvas performance

## Design System
### UI Components
- Retro-style containers with headers and fixed dimensions
- Classic button styling
- Progress bar for timer
- Compact tool panels with consistent sizing
- Modal-style results display with proper centering
- Form inputs with retro styling
- Authentication forms with consistent design
- Fixed-width panels with overflow handling
### Color Palette
- Using custom theme colors:
  - Vanilla (background and containers)
  - Flax (headers and accents)
  - Indian Red (buttons and interactive elements)
  - Atomic Tangerine (borders and highlights)
  - Eerie Black (text and borders)

### CSS Architecture
- Utilizing Tailwind CSS with custom components
- Established reusable classes for:
  - Retro containers
  - Form inputs
  - Buttons
  - Headers
  - Layout components

## Next Steps
- Complete authentication integration with backend
- Add user session management
- Finalize AI integration for drawing recognition
- Enhance game loop mechanics
- Add user account features
- Implement backend integration
- Add difficulty levels
- Expand word database
- Add game history tracking
- Implement user statistics
- Add error handling and loading states
- Implement protected routes