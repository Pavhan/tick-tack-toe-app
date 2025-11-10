use crate::errors::ServiceError;
use crate::http::dto::{CreateGameRequest, GameListQuery, MakeMoveRequest, UpdateGameRequest};
use crate::models::Player;
use crate::services::game::{GameFilters, GameUpdate};

const MIN_BOARD_SIZE: i64 = 3;
const MAX_BOARD_SIZE: i64 = 10;

pub fn validate_create_game_request(payload: &CreateGameRequest) -> Result<i64, ServiceError> {
    let board_size = payload.board_size.unwrap_or(MIN_BOARD_SIZE);

    if board_size < MIN_BOARD_SIZE || board_size > MAX_BOARD_SIZE {
        return Err(ServiceError::InvalidInput(format!(
            "Invalid board_size! Expected a number between {MIN_BOARD_SIZE} and {MAX_BOARD_SIZE}."
        )));
    }

    Ok(board_size)
}

pub fn validate_game_list_query(query: &GameListQuery) -> Result<GameFilters, ServiceError> {
    Ok(GameFilters {
        status: query.status,
    })
}

pub fn validate_game_id(game_id: i64) -> Result<i64, ServiceError> {
    if game_id < 0 {
        return Err(ServiceError::InvalidInput(
            "Invalid game ID! Expected a non-negative integer.".into(),
        ));
    }

    Ok(game_id)
}

pub fn validate_update_game_request(
    game_id: i64,
    payload: &UpdateGameRequest,
) -> Result<(i64, GameUpdate), ServiceError> {
    let game_id = validate_game_id(game_id)?;

    if payload.status.is_none() && payload.winner.is_none() {
        return Err(ServiceError::InvalidInput(
            "No valid fields to update".into(),
        ));
    }

    if let Some(player) = payload.current_player {
        if !matches!(player, Player::X | Player::O) {
            return Err(ServiceError::InvalidInput(
                "Invalid current_player value! Expected \"X\" or \"O\".".into(),
            ));
        }
    }

    let updates = GameUpdate {
        status: payload.status,
        winner: payload.winner,
    };

    Ok((game_id, updates))
}

pub fn validate_make_move_request(
    game_id: i64,
    payload: &MakeMoveRequest,
) -> Result<(i64, i64, Player), ServiceError> {
    let game_id = validate_game_id(game_id)?;

    if payload.position < 0 {
        return Err(ServiceError::InvalidInput(
            "Invalid position! Expected a non-negative number.".into(),
        ));
    }

    Ok((game_id, payload.position, payload.player))
}
