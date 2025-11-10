use axum::{
    Json,
    extract::{Path, Query},
};
use serde_json::Value;

use crate::errors::ServiceError;
use crate::http::{
    dto::{CreateGameRequest, GameListQuery, MakeMoveRequest, UpdateGameRequest},
    responses::ApiSuccess,
    validators,
};
use crate::models::{Game, GameListItem, GameMove, GameWithMoves};
use crate::services::game;

type ApiResponse<T> = Result<Json<ApiSuccess<T>>, ServiceError>;

pub async fn create_game(Json(payload): Json<CreateGameRequest>) -> ApiResponse<Game> {
    let board_size = validators::validate_create_game_request(&payload)?;
    let game = game::create_game(board_size).await?;
    Ok(Json(ApiSuccess::with_message(
        game,
        "Game created successfully",
    )))
}

pub async fn list_games(Query(query): Query<GameListQuery>) -> ApiResponse<Vec<GameListItem>> {
    let filters = validators::validate_game_list_query(&query)?;
    let games = game::get_games(filters).await?;
    Ok(Json(ApiSuccess::new(games)))
}

pub async fn get_game(Path(game_id): Path<i64>) -> ApiResponse<Game> {
    let game_id = validators::validate_game_id(game_id)?;
    let game = game::get_game_by_id(game_id).await?;
    Ok(Json(ApiSuccess::new(game)))
}

pub async fn get_game_with_moves(Path(game_id): Path<i64>) -> ApiResponse<GameWithMoves> {
    let game_id = validators::validate_game_id(game_id)?;
    let game = game::get_game_with_moves(game_id).await?;
    Ok(Json(ApiSuccess::new(game)))
}

pub async fn update_game(
    Path(game_id): Path<i64>,
    Json(payload): Json<UpdateGameRequest>,
) -> ApiResponse<Game> {
    let (game_id, updates) = validators::validate_update_game_request(game_id, &payload)?;
    let game = game::update_game(game_id, updates).await?;
    Ok(Json(ApiSuccess::with_message(
        game,
        "Game updated successfully",
    )))
}

pub async fn delete_game(Path(game_id): Path<i64>) -> ApiResponse<Value> {
    let game_id = validators::validate_game_id(game_id)?;
    game::delete_game(game_id).await?;
    Ok(Json(ApiSuccess::with_message(
        Value::Null,
        "Game deleted successfully",
    )))
}

pub async fn add_move(
    Path(game_id): Path<i64>,
    Json(payload): Json<MakeMoveRequest>,
) -> ApiResponse<GameMove> {
    let (game_id, position, player) = validators::validate_make_move_request(game_id, &payload)?;
    let move_entry = game::add_move(game_id, position, player).await?;
    Ok(Json(ApiSuccess::with_message(
        move_entry,
        "Move added successfully",
    )))
}

pub async fn list_moves(Path(game_id): Path<i64>) -> ApiResponse<Vec<GameMove>> {
    let game_id = validators::validate_game_id(game_id)?;
    let moves = game::get_game_moves(game_id).await?;
    Ok(Json(ApiSuccess::new(moves)))
}
