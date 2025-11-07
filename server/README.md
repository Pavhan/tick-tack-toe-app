# Tic-Tac-Toe Server

Backend API server for the Tic-Tac-Toe game application.

## Features

- RESTful API for game and move management
- SQLite database for persistence
- OpenAPI 3.0 specification
- Interactive Swagger UI documentation
- TypeScript support

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Build

```bash
npm run build
npm start
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:

**Swagger UI**: http://localhost:3001/api-docs

The Swagger UI provides:

- 📖 Complete API documentation
- 🧪 Interactive request testing
- 📝 Request/response examples
- ✅ Schema validation

You can also view the raw OpenAPI specification in `openapi.yaml`.

## API Endpoints

### Games

- `GET /api/games` - Get all games
- `POST /api/games` - Create a new game
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/:id/full` - Get game with all moves
- `PATCH /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

### Moves

- `GET /api/games/:id/moves` - Get game moves
- `POST /api/games/:id/moves` - Add move to game

For detailed API documentation with examples, see [API.md](./API.md) or visit the Swagger UI when the server is running.

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
NODE_ENV=development
```

## Database

The application uses SQLite for data persistence. The database file is created automatically in the `data` directory on first run.

## Tech Stack

- **Node.js** with **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **TypeScript** - Type safety
- **dotenv** - Environment configuration

## Setup

1. Install dependencies (from root):

   ```bash
   yarn install
   ```

2. Configure environment variables:

   ```bash
   cp server/.env.example server/.env
   ```

3. Start the development server:
   ```bash
   yarn dev:server
   ```

## Available Scripts

Run these scripts from the project root:

- `yarn dev:server` - Start development server with hot reload
- `yarn build:server` - Build TypeScript to JavaScript
- `yarn start:server` - Start production server

Or from the `server/` directory:

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build TypeScript to JavaScript
- `yarn start` - Start production server

## API Endpoints

See [API.md](./API.md) for complete API documentation.

### Quick Reference

**Games:**

- `GET /api/games` - Get all games
- `POST /api/games` - Create new game
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/:id/full` - Get game with all moves
- `PATCH /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

**Moves:**

- `GET /api/games/:id/moves` - Get all moves for a game
- `POST /api/games/:id/moves` - Add a move to a game

## Database

The SQLite database is automatically created at `server/data/tictactoe.db` on first server start. The database schema is initialized automatically using the SQL script in `src/db/schema.sql`.

### Database Schema

**games** table:

- `id` - Primary key
- `board_size` - Size of the game board (3, 4, 5, etc.)
- `status` - Game status (in_progress, completed, abandoned)
- `winner` - Winner of the game (X, O, draw, or NULL)
- `current_player` - Current player's turn (X or O)
- `created_at` - Timestamp when game was created
- `updated_at` - Timestamp when game was last updated

**game_moves** table:

- `id` - Primary key
- `game_id` - Foreign key to games table
- `move_number` - Sequential move number
- `position` - Board position (0-8 for 3x3, 0-24 for 5x5, etc.)
- `player` - Player who made the move (X or O)
- `created_at` - Timestamp when move was made
