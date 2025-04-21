# Interactive Pixel Paddle Game

This project is a gamified interactive animation for Chaitanya Projects Consultancy Limited, featuring a customizable pixel-based text display and a playable paddle game with a bouncing ball.

## Live Demo

Check out the live demo: [Name Bounce Game](https://namebounce.netlify.app/)

## Features

- Playable paddle game: keep the ball bouncing using your mouse to control the paddle
- Game states: Start, Playing, Game Over, and Restart
- Score counter: earn points for each successful paddle hit
- Customizable settings:
  - Text content (first and second line)
  - Colors (main text, hit text, ball, paddle, background)
  - Ball speed
- Responsive design for all screen sizes
- Settings are saved to localStorage for persistence
- Browser zoom support without resetting the game
- Real-time Netlify resource usage monitoring (CPU, RAM, Network)
- Event logger sidebar to track ball interactions

## Game Mode

### How to Play

- Click "Start Game" to begin.
- Move your mouse left/right over the game area to control the paddle at the bottom.
- Keep the ball from falling off the bottom edge by bouncing it with the paddle.
- Score increases by 1 for each successful paddle hit.
- If the ball falls below the paddle, the game ends and your final score is shown.
- Click "Restart" to play again, or "Back to Menu" to return to the start screen.

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- HTML5 Canvas API

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to http://localhost:3000

## Usage

- Click "Start Game" to play the paddle game
- Move your mouse to control the paddle
- Open the settings panel (gear icon) to customize text, colors, and ball speed
- All changes are applied in real-time
- Settings are automatically saved to localStorage
- Use browser zoom (Cmd/Ctrl + +/-) without resetting the game

## Deployment

This application is deployed on Netlify at [namebounce.netlify.app](https://namebounce.netlify.app/).

This application can be deployed on Vercel, Netlify, or any other platform that supports Next.js:

```bash
npm run build
npm run start
```

## License

[Your License Here]

## Credits

[Your Credits Here] 