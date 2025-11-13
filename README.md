# Tic-Tac-Toe Game

A feature-rich, modern Tic-Tac-Toe game built with React, TypeScript, and Tailwind CSS. This project was created as an onboarding app for Foxmedia company.

## ✨ Features

### 🎮 Game Modes

- **Classic 3x3 board** - Traditional tic-tac-toe
- **Extended boards** - Play on boards from 3x3 up to 10x10
- **Adaptive win conditions** - Win requirements adapt to board size:
  - 3x3 board: 3 in a row
  - 4x4 board: 4 in a row
  - 5x5+ boards: 5 in a row
- **Real-time move validation** - Ensures valid moves and game rules
- **Error handling & recovery** - Graceful error handling with user feedback
- **API Documentation** - Interactive Swagger UI documentation
- **Database persistence** - Complete game history and state management

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

- **React 19.1.1** - Latest React with modern hooks
- **TypeScript 5.9.3** - Type-safe code for better development experience
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.16** - Utility-first CSS framework

### Backend

- **Rust (Axum 0.7)** - RESTful API server located in `server-rust`
- **Tokio 1.x** - Asynchronous runtime with graceful shutdown
- **rusqlite 0.31** - SQLite driver with WAL mode and foreign keys

### Data Persistence

- **Backend API** - Game state and move history
- **LocalStorage** - Legacy support for saved games
- **Shared schema** - SQL schema stored in the root `db/schema.sql`

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
# Start frontend + backend together
yarn dev:rust     # Frontend + Rust backend (http://localhost:5173 + http://localhost:3002)
yarn dev:node     # Frontend + Node backend (http://localhost:5173 + http://localhost:3002)

# Individual pieces
yarn dev:client        # Frontend only (http://localhost:5173) - default backend type
yarn dev:client:rust   # Frontend only with Rust backend type (http://localhost:5173)
yarn dev:client:node   # Frontend only with Node backend type (http://localhost:5173)
yarn dev:server:rust   # Rust backend only (http://localhost:3002)
yarn dev:server:node   # Node backend only (http://localhost:3002)
```

### Production Build

```bash
# Build frontend + backend
yarn build

# Build individual pieces
yarn build:client  # Frontend only
yarn build:server  # Rust backend only

# Start production Rust server
yarn start:server
```

### Other Commands

```bash
# Run linter
yarn lint

# Preview production build
yarn preview

# Run Rust backend tests
cargo test --manifest-path server-rust/Cargo.toml
```

## 🔌 API Documentation

Both backends expose the same REST API. Pick the documentation that matches the stack you are using:

- Node backend: [server/API.md](./server/API.md)
- Rust backend: [server-rust/API.md](./server-rust/API.md)

**Base URL:** `http://localhost:3002/api`

**Key Endpoints:**

- `GET /games` - List all games
- `POST /games` - Create new game
- `GET /games/:id/full` - Get game with moves
- `POST /games/:id/moves` - Add move to game
- `PATCH /games/:id` - Update game status

**Note:** The SQLite database is shared and created automatically at `db/tictactoe.db`.  
Set `DATABASE_PATH=../db/tictactoe.db` in `server/.env` (Node) and `DATABASE_PATH=./db/tictactoe.db` in `server-rust/.env` when running the respective backends.
Both backends load configuration from their respective `.env` files (`server/.env`, `server-rust/.env`). The Node backend uses `NODE_ENV` while the Rust backend uses `ENVIRONMENT` for environment configuration. Both use `PORT` and `DATABASE_PATH`.

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
