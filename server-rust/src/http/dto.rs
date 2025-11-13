use serde::Deserialize;

use crate::models::{GameStatus, GameWinner, Player};

#[derive(Debug, Deserialize)]
pub struct CreateGameRequest {
    pub board_size: Option<i64>,
}

#[derive(Debug, Deserialize, Default)]
pub struct GameListQuery {
    pub status: Option<GameStatus>,
}

#[derive(Debug, Deserialize, Default)]
pub struct UpdateGameRequest {
    #[serde(default)]
    pub status: Option<GameStatus>,
    #[serde(default)]
    pub winner: Option<Option<GameWinner>>,
    #[serde(default)]
    pub current_player: Option<Player>,
}

#[derive(Debug, Deserialize)]
pub struct MakeMoveRequest {
    pub position: i64,
    pub player: Player,
}
