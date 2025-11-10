use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use thiserror::Error;

use crate::db::DbError;

pub type ServiceResult<T> = Result<T, ServiceError>;

#[derive(Debug, Error)]
pub enum ServiceError {
    #[error("{0}")]
    InvalidInput(String),
    #[error("{0}")]
    NotFound(String),
    #[error("{0}")]
    Conflict(String),
    #[error("Database error: {0}")]
    Database(#[from] DbError),
    #[error("{0}")]
    Internal(String),
}

impl From<rusqlite::Error> for ServiceError {
    fn from(error: rusqlite::Error) -> Self {
        ServiceError::Database(DbError::from(error))
    }
}

impl IntoResponse for ServiceError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ServiceError::InvalidInput(message) => (StatusCode::BAD_REQUEST, message),
            ServiceError::NotFound(message) => (StatusCode::NOT_FOUND, message),
            ServiceError::Conflict(message) => (StatusCode::CONFLICT, message),
            ServiceError::Database(error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database error: {error}"),
            ),
            ServiceError::Internal(message) => (StatusCode::INTERNAL_SERVER_ERROR, message),
        };

        let body = ApiErrorResponse::new(message, status.as_u16());
        (status, Json(body)).into_response()
    }
}

#[derive(Debug, Serialize)]
pub struct ApiErrorResponse {
    pub success: bool,
    pub error: ApiErrorDetails,
}

impl ApiErrorResponse {
    pub fn new(message: impl Into<String>, status_code: u16) -> Self {
        Self {
            success: false,
            error: ApiErrorDetails {
                message: message.into(),
                status_code,
            },
        }
    }
}

#[derive(Debug, Serialize)]
pub struct ApiErrorDetails {
    pub message: String,
    pub status_code: u16,
}
