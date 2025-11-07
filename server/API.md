# Game API Documentation

Base URL: `http://localhost:3001`

## API Documentation

Interactive API documentation is available at:
http://localhost:3001/api-docs

Features:

- Try endpoints directly in browser
- Request/response examples
- Schema definitions

## Status Codes

- `200` - Success (Request completed successfully)
- `201` - Created (New game/move added successfully)
- `400` - Bad Request (Invalid input or validation error)
- `404` - Not Found (Game or move not found)
- `500` - Server Error (Internal server error)

## Endpoints

### Games

#### Get All Games

```
GET /api/games
```

**Query Parameters:**

- `status` (optional): Filter by game status
  - `in_progress` - Games currently being played
  - `completed` - Games that have been won
  - `abandoned` - Games that were left unfinished

Example:

```bash
# Get all completed games
curl "http://localhost:3001/api/games?status=completed"

# Get games in progress
curl "http://localhost:3001/api/games?status=in_progress"
```

**Example:**

```bash
curl "http://localhost:3001/api/games?status=in_progress"
```

**Response:**

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

**Request Body:**

```json
{
  "board_size": 3 // Optional, default: 3, range: 3-10
}
```

**Example:**

```bash
curl -X POST http://localhost:3001/api/games \
  -H "Content-Type: application/json" \
  -d '{"board_size": 3}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "board_size": 3,
    "status": "in_progress",
    "winner": null,
    "current_player": "X",
    "created_at": "2025-11-05T10:00:00.000Z",
    "updated_at": "2025-11-05T10:00:00.000Z"
  },
  "message": "Game created successfully"
}
```

---

#### Get Game by ID

```
GET /api/games/:id
```

**Example:**

```bash
curl http://localhost:3001/api/games/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "board_size": 3,
    "status": "in_progress",
    "winner": null,
    "current_player": "O",
    "created_at": "2025-11-05T10:00:00.000Z",
    "updated_at": "2025-11-05T10:05:00.000Z"
  }
}
```

---

#### Get Game with All Moves

```
GET /api/games/:id/full
```

**Example:**

```bash
curl http://localhost:3001/api/games/1/full
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "board_size": 3,
    "status": "in_progress",
    "winner": null,
    "current_player": "O",
    "created_at": "2025-11-05T10:00:00.000Z",
    "updated_at": "2025-11-05T10:05:00.000Z",
    "moves": [
      {
        "id": 1,
        "game_id": 1,
        "move_number": 1,
        "position": 4,
        "player": "X",
        "created_at": "2025-11-05T10:01:00.000Z"
      },
      {
        "id": 2,
        "game_id": 1,
        "move_number": 2,
        "position": 0,
        "player": "O",
        "created_at": "2025-11-05T10:02:00.000Z"
      }
    ]
  }
}
```

---

#### Update Game

```
PATCH /api/games/:id
```

**Request Body:**

```json
{
  "status": "completed",
  "winner": "X",
  "current_player": "O"
}
```

**Example:**

```bash
curl -X PATCH http://localhost:3001/api/games/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed", "winner": "X"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "board_size": 3,
    "status": "completed",
    "winner": "X",
    "current_player": "O",
    "created_at": "2025-11-05T10:00:00.000Z",
    "updated_at": "2025-11-05T10:10:00.000Z"
  },
  "message": "Game updated successfully"
}
```

---

#### Delete Game

```
DELETE /api/games/:id
```

**Example:**

```bash
curl -X DELETE http://localhost:3001/api/games/1
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Game deleted successfully"
}
```

---

### Moves

#### Get Game Moves

```
GET /games/:id/moves
```

**Example:**

```bash
curl http://localhost:3001/api/games/1/moves
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "game_id": 1,
      "move_number": 1,
      "position": 4,
      "player": "X",
      "created_at": "2025-11-05T10:01:00.000Z"
    },
    {
      "id": 2,
      "game_id": 1,
      "move_number": 2,
      "position": 0,
      "player": "O",
      "created_at": "2025-11-05T10:02:00.000Z"
    }
  ]
}
```

---

#### Add Move to Game

```
POST /api/games/:id/moves
```

**Request Body:**

```json
{
  "position": 4,
  "player": "X"
}
```

**Example:**

```bash
curl -X POST http://localhost:3001/api/games/1/moves \
  -H "Content-Type: application/json" \
  -d '{"position": 4, "player": "X"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "game_id": 1,
    "move_number": 3,
    "position": 4,
    "player": "X",
    "created_at": "2025-11-05T10:03:00.000Z"
  },
  "message": "Move added successfully"
}
```

**Validations:**

- Game must be in "in_progress" status
- Must be the correct player's turn
- Position must not be already taken
- Position must be valid for the board size

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Example Error Responses

**Bad Request Error (400):**

```json
{
  "success": false,
  "error": {
    "message": "Invalid game ID",
    "statusCode": 400
  }
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "error": {
    "message": "Game with ID 999 not found",
    "statusCode": 404
  }
}
```

**Business Logic Error (400):**

```json
{
  "success": false,
  "error": {
    "message": "Cannot add move to a game that is not in progress",
    "statusCode": 400
  }
}
```
