use rusqlite::{OptionalExtension, Row, params};

use crate::db;
use crate::errors::{ServiceError, ServiceResult};
use crate::models::{Game, GameListItem, GameMove, GameStatus, GameWinner, GameWithMoves, Player};

const MAX_RETURNED_GAMES: i64 = 100;

pub struct GameFilters {
    pub status: Option<GameStatus>,
}

#[derive(Debug, Default)]
pub struct GameUpdate {
    pub status: Option<GameStatus>,
    pub winner: Option<Option<GameWinner>>,
}

pub async fn create_game(board_size: i64) -> ServiceResult<Game> {
    db::with_connection_async(move |conn| -> ServiceResult<Game> {
        conn.execute(
            "INSERT INTO games (board_size, status, current_player) VALUES (?1, 'in_progress', 'X')",
            params![board_size],
        )?;

        let game_id = conn.last_insert_rowid();
        fetch_game(conn, game_id)?.ok_or_else(|| {
            ServiceError::Internal("Failed to load newly created game".into())
        })
    })
    .await
}

pub async fn get_game_by_id(game_id: i64) -> ServiceResult<Game> {
    db::with_connection_async(move |conn| -> ServiceResult<Game> {
        fetch_game(conn, game_id)?
            .ok_or_else(|| ServiceError::NotFound(format!("Hra s ID {game_id} nebyla nalezena")))
    })
    .await
}

pub async fn get_game_with_moves(game_id: i64) -> ServiceResult<GameWithMoves> {
    db::with_connection_async(move |conn| -> ServiceResult<GameWithMoves> {
        let game = fetch_game(conn, game_id)?
            .ok_or_else(|| ServiceError::NotFound(format!("Hra s ID {game_id} nebyla nalezena")))?;

        let moves = fetch_game_moves(conn, game_id)?;
        Ok(GameWithMoves { game, moves })
    })
    .await
}

pub async fn get_games(filters: GameFilters) -> ServiceResult<Vec<GameListItem>> {
    db::with_connection_async(move |conn| -> ServiceResult<Vec<GameListItem>> {
        if let Some(status) = filters.status {
            let mut statement = conn.prepare(
                "
                SELECT 
                    g.id,
                    g.board_size,
                    g.status,
                    g.winner,
                    g.current_player,
                    g.created_at,
                    g.updated_at,
                    COUNT(gm.id) AS move_count
                FROM games g
                LEFT JOIN game_moves gm ON g.id = gm.game_id
                WHERE g.status = ?1
                GROUP BY g.id
                ORDER BY g.created_at DESC
                LIMIT ?2
            ",
            )?;

            let games = statement
                .query_map(params![status, MAX_RETURNED_GAMES], map_game_list_item)?
                .collect::<Result<Vec<_>, _>>()?;

            Ok(games)
        } else {
            let mut statement = conn.prepare(
                "
                SELECT 
                    g.id,
                    g.board_size,
                    g.status,
                    g.winner,
                    g.current_player,
                    g.created_at,
                    g.updated_at,
                    COUNT(gm.id) AS move_count
                FROM games g
                LEFT JOIN game_moves gm ON g.id = gm.game_id
                GROUP BY g.id
                ORDER BY g.created_at DESC
                LIMIT ?1
            ",
            )?;

            let games = statement
                .query_map(params![MAX_RETURNED_GAMES], map_game_list_item)?
                .collect::<Result<Vec<_>, _>>()?;

            Ok(games)
        }
    })
    .await
}

pub async fn update_game(game_id: i64, updates: GameUpdate) -> ServiceResult<Game> {
    db::with_connection_async(move |conn| -> ServiceResult<Game> {
        let existing = fetch_game(conn, game_id)?
            .ok_or_else(|| ServiceError::NotFound(format!("Hra s ID {game_id} nebyla nalezena")))?;

        match (updates.status, updates.winner) {
            (None, None) => return Ok(existing),
            (Some(status), Some(winner)) => {
                conn.execute(
                    "UPDATE games SET status = ?1, winner = ?2 WHERE id = ?3",
                    params![status, winner, game_id],
                )?;
            }
            (Some(status), None) => {
                conn.execute(
                    "UPDATE games SET status = ?1 WHERE id = ?2",
                    params![status, game_id],
                )?;
            }
            (None, Some(winner)) => {
                conn.execute(
                    "UPDATE games SET winner = ?1 WHERE id = ?2",
                    params![winner, game_id],
                )?;
            }
        }

        fetch_game(conn, game_id)?
            .ok_or_else(|| ServiceError::Internal("Hra po aktualizaci nebyla nalezena".into()))
    })
    .await
}

pub async fn delete_game(game_id: i64) -> ServiceResult<()> {
    db::with_connection_async(move |conn| -> ServiceResult<()> {
        let rows = conn.execute("DELETE FROM games WHERE id = ?1", params![game_id])?;
        if rows == 0 {
            return Err(ServiceError::NotFound(format!(
                "Hra s ID {game_id} nebyla nalezena"
            )));
        }
        Ok(())
    })
    .await
}

pub async fn add_move(game_id: i64, position: i64, player: Player) -> ServiceResult<GameMove> {
    db::with_connection_async(move |conn| -> ServiceResult<GameMove> {
        let game = fetch_game(conn, game_id)?
            .ok_or_else(|| ServiceError::NotFound(format!("Hra s ID {game_id} nebyla nalezena")))?;

        if game.status != GameStatus::InProgress {
            return Err(ServiceError::InvalidInput(
                "Cannot add a move to a finished game".into(),
            ));
        }

        if game.current_player != player {
            return Err(ServiceError::InvalidInput(format!(
                "It's {}'s turn, not {}'s",
                game.current_player, player
            )));
        }

        if move_exists(conn, game_id, position)? {
            return Err(ServiceError::InvalidInput(format!(
                "Position {position} is already taken"
            )));
        }

        let move_number = next_move_number(conn, game_id)?;

        conn.execute(
            "
            INSERT INTO game_moves (game_id, move_number, position, player)
            VALUES (?1, ?2, ?3, ?4)
        ",
            params![game_id, move_number, position, player],
        )?;

        let move_id = conn.last_insert_rowid();

        let next_player = match player {
            Player::X => Player::O,
            Player::O => Player::X,
        };

        conn.execute(
            "UPDATE games SET current_player = ?1 WHERE id = ?2",
            params![next_player, game_id],
        )?;

        let inserted_move = conn
            .query_row(
                "
                SELECT id, game_id, move_number, position, player, created_at
                FROM game_moves
                WHERE id = ?1
            ",
                params![move_id],
                map_game_move,
            )
            .map_err(ServiceError::from)?;

        Ok(inserted_move)
    })
    .await
}

pub async fn get_game_moves(game_id: i64) -> ServiceResult<Vec<GameMove>> {
    db::with_connection_async(move |conn| -> ServiceResult<Vec<GameMove>> {
        fetch_game(conn, game_id)?
            .ok_or_else(|| ServiceError::NotFound(format!("Hra s ID {game_id} nebyla nalezena")))?;

        fetch_game_moves(conn, game_id)
    })
    .await
}

fn fetch_game(conn: &rusqlite::Connection, game_id: i64) -> ServiceResult<Option<Game>> {
    let game = conn
        .query_row(
            "
            SELECT id, board_size, status, winner, current_player, created_at, updated_at
            FROM games
            WHERE id = ?1
        ",
            params![game_id],
            map_game,
        )
        .optional()?;

    Ok(game)
}

fn fetch_game_moves(conn: &rusqlite::Connection, game_id: i64) -> ServiceResult<Vec<GameMove>> {
    let mut stmt = conn.prepare(
        "
        SELECT id, game_id, move_number, position, player, created_at
        FROM game_moves
        WHERE game_id = ?1
        ORDER BY move_number ASC
    ",
    )?;

    let moves = stmt
        .query_map(params![game_id], map_game_move)?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(moves)
}

fn move_exists(conn: &rusqlite::Connection, game_id: i64, position: i64) -> ServiceResult<bool> {
    let exists: Option<i64> = conn
        .query_row(
            "
            SELECT id
            FROM game_moves
            WHERE game_id = ?1 AND position = ?2
        ",
            params![game_id, position],
            |row| row.get(0),
        )
        .optional()?;

    Ok(exists.is_some())
}

fn next_move_number(conn: &rusqlite::Connection, game_id: i64) -> ServiceResult<i64> {
    let next = conn.query_row(
        "
        SELECT COALESCE(MAX(move_number), 0) + 1
        FROM game_moves
        WHERE game_id = ?1
    ",
        params![game_id],
        |row| row.get(0),
    )?;

    Ok(next)
}

fn map_game(row: &Row<'_>) -> rusqlite::Result<Game> {
    Ok(Game {
        id: row.get("id")?,
        board_size: row.get("board_size")?,
        status: row.get("status")?,
        winner: row.get("winner")?,
        current_player: row.get("current_player")?,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

fn map_game_move(row: &Row<'_>) -> rusqlite::Result<GameMove> {
    Ok(GameMove {
        id: row.get("id")?,
        game_id: row.get("game_id")?,
        move_number: row.get("move_number")?,
        position: row.get("position")?,
        player: row.get("player")?,
        created_at: row.get("created_at")?,
    })
}

fn map_game_list_item(row: &Row<'_>) -> rusqlite::Result<GameListItem> {
    Ok(GameListItem {
        game: Game {
            id: row.get("id")?,
            board_size: row.get("board_size")?,
            status: row.get("status")?,
            winner: row.get("winner")?,
            current_player: row.get("current_player")?,
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
        },
        move_count: row.get("move_count")?,
    })
}
