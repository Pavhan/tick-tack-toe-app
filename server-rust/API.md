# Rust Backend API Documentation

Base URL: `http://localhost:3002`

## API Documentation

Interactive OpenAPI documentation is available while the server is running:
`http://localhost:3002/api-docs`

The Swagger UI allows you to:
- Inspect schemas and validation rules
- Execute requests directly from the browser
- Review request/response examples

## Status Codes

- `200` – Success (request completed successfully)
- `201` – Created (new resource stored)
- `400` – Bad Request (validation failed)
- `404` – Not Found (referenced entity does not exist)
- `500` – Internal Server Error

## Endpoints

### Games

#### Get All Games

```
GET /api/games
```

Optional query parameter:

- `status`: `in_progress`, `completed`, `abandoned`

```bash
# Get all completed games
curl "http://localhost:3002/api/games?status=completed"
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "board_size": 3,
      "status": "in_progress",
      "winner": null,
      "current_player": "X",
      "created_at": "2025-11-05T10:00:00.000Z",
      "updated_at": "2025-11-05T10:00:00.000Z",
      "move_count": 3
    }
  ]
}
```

---

#### Create New Game

```
POST /api/games
```

Request body (optional):

```json
{
  "board_size": 3
}
```

```bash
curl -X POST http://localhost:3002/api/games \
  -H "Content-Type: application/json" \
  -d '{"board_size": 4}'
```

---

#### Get Game by ID

```
GET /api/games/:id
```

```bash
curl http://localhost:3002/api/games/1
```

---

#### Get Game with Moves

```
GET /api/games/:id/full
```

```bash
curl http://localhost:3002/api/games/1/full
```

---

#### Delete Game

```
DELETE /api/games/:id
```

```bash
curl -X DELETE http://localhost:3002/api/games/1
```

---

### Moves

#### List Moves for Game

```
GET /api/games/:id/moves
```

```bash
curl http://localhost:3002/api/games/1/moves
```

---

#### Add Move

```
POST /api/games/:id/moves
```

Request body:

```json
{
  "position": 4,
  "player": "X"
}
```

```bash
curl -X POST http://localhost:3002/api/games/1/moves \
  -H "Content-Type: application/json" \
  -d '{"position":4,"player":"X"}'
```

---

## Environment Variables

Rust backend reads the following keys from `server-rust/.env` (or `.env.local`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3002` | HTTP server port |
| `DATABASE_PATH` | `./db/tictactoe.db` | SQLite database file |
| `NODE_ENV` | `development` | Environment label |

## Running the Rust Backend

```bash
# Development (with hot reload)
yarn dev:server:rust

# Production build
yarn build:server
yarn start:server

# Test suite
cargo test --manifest-path server-rust/Cargo.toml
```

