use axum::Router;

use crate::http;

pub fn create_router() -> Router {
    http::routes::build_router()
}
