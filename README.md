# Tic-Tac-Toe Game

A feature-rich, modern Tic-Tac-Toe game built with React, TypeScript, and Tailwind CSS. This project was created as an onboarding app for Foxmedia company.

## ✨ Features

### 🎮 Game Modes

- **Classic 3x3 board** - Traditional tic-tac-toe
- **Extended boards** - Play on boards from 3x3 up to 10x10
- **Dynamic win conditions** - Win requirements adapt to board size:
  - 3x3 board: 3 in a row
  - 4x4 board: 4 in a row
  - 5x5+ boards: 5 in a row

### 📜 Game History

- **Move history tracking** - Review every move made during the game
- **Time travel** - Jump back to any previous move to see the board state
- **Visual indicators** - Highlighted cells show the selected move in history

### 💾 Save & Load

- **Auto-save completed games** - Winning games are automatically saved to local storage
- **Browse saved games** - View all previously played games with timestamps
- **Load saved games** - Continue from where you left off or review past matches
- **Delete saved games** - Remove individual games or clear all at once

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe code for better development experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework

### Backend

- **Node.js** with **Express.js** - RESTful API server
- **SQLite** (better-sqlite3) - Lightweight database
- **TypeScript** - Type-safe backend code

### Data Persistence

- **Backend API** - Game state and move history
- **LocalStorage** - Legacy support for saved games

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Pavhan/tick-tack-toe-app.git

# Navigate to the project directory
cd tick-tack-toe-app

# Install dependencies
yarn install
```

## 🚀 Usage

### Development Mode

```bash
# Start both frontend and backend
yarn dev

# Or start them separately:
yarn dev:client    # Frontend only (http://localhost:5173)
yarn dev:server    # Backend only (http://localhost:3001)
```

### Production Build

```bash
# Build frontend
yarn build

# Build backend
yarn build:server

# Start production server
yarn start:server
```

### Other Commands

```bash
# Run linter
yarn lint

# Preview production build
yarn preview
```

## 🔌 API Documentation

The backend API provides RESTful endpoints for game management. See [server/API.md](./server/API.md) for complete documentation.

**Base URL:** `http://localhost:3001/api`

**Key Endpoints:**

- `GET /games` - List all games
- `POST /games` - Create new game
- `GET /games/:id/full` - Get game with moves
- `POST /games/:id/moves` - Add move to game
- `PATCH /games/:id` - Update game status

**Note:** The SQLite database is created automatically on first server start at `server/data/tictactoe.db`.

## 🎯 How to Play

1. **Choose your board size** - Select from 3x3 to 10x10 in the right panel
2. **Make your move** - Click on any empty square to place your mark (X or O)
3. **Win the game** - Get the required number of marks in a row (horizontally, vertically, or diagonally)
4. **Review history** - Click on any move in the history panel to see that game state
5. **Continue playing** - Click "Continue Game" to return to the current game state
6. **Start fresh** - Use the "Reset Game" button to begin a new game
7. **Load saved games** - Access your previously won games from the "Saved Games" dialog

```

## 📝 License

This is a private project.

## 👤 Author

Pavel Hanys (@Pavhan)
```
