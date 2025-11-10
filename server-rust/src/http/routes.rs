use axum::{
    Router,
    http::{HeaderValue, Method, header},
    routing::get,
};
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::http::handlers::games;

pub fn build_router() -> Router {
    Router::new()
        .nest("/api/games", games_router())
        .layer(cors_layer())
        .layer(TraceLayer::new_for_http())
}

fn games_router() -> Router {
    Router::new()
        .route("/", get(games::list_games).post(games::create_game))
        .route(
            "/:id",
            get(games::get_game)
                .patch(games::update_game)
                .delete(games::delete_game),
        )
        .route("/:id/full", get(games::get_game_with_moves))
        .route("/:id/moves", get(games::list_moves).post(games::add_move))
}

fn cors_layer() -> CorsLayer {
    let origin = HeaderValue::from_static("http://localhost:5173");

    CorsLayer::new()
        .allow_origin(origin)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::PATCH,
            Method::OPTIONS,
        ])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
}
