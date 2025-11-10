use std::fs;
use std::path::{Path, PathBuf};

use once_cell::sync::OnceCell;
use rusqlite::Connection;
use thiserror::Error;

use crate::config;

const SCHEMA_RELATIVE_PATH: &str = "../db/schema.sql";

static INITIALIZED: OnceCell<()> = OnceCell::new();

pub fn init() -> Result<(), DbError> {
    INITIALIZED.get_or_try_init(|| open_connection().map(|_| ()))?;

    Ok(())
}

pub fn with_connection<F, R, E>(operation: F) -> Result<R, E>
where
    F: FnOnce(&Connection) -> Result<R, E>,
    E: From<DbError>,
{
    let connection = open_connection().map_err(E::from)?;
    operation(&connection)
}

pub async fn with_connection_async<F, R, E>(operation: F) -> Result<R, E>
where
    F: FnOnce(&Connection) -> Result<R, E> + Send + 'static,
    R: Send + 'static,
    E: From<DbError> + Send + 'static,
{
    tokio::task::spawn_blocking(move || -> Result<R, E> {
        let connection = open_connection().map_err(E::from)?;
        operation(&connection)
    })
    .await
    .map_err(|err| E::from(DbError::Join(err)))?
}

fn open_connection() -> Result<Connection, DbError> {
    let db_path = config::config().database_path().to_path_buf();
    ensure_parent_directory(&db_path)?;

    let connection = Connection::open(&db_path)?;
    apply_pragmas(&connection)?;
    ensure_schema(&connection)?;
    Ok(connection)
}

fn ensure_parent_directory(path: &Path) -> Result<(), DbError> {
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent)?;
        }
    }
    Ok(())
}

fn apply_pragmas(connection: &Connection) -> Result<(), DbError> {
    connection.pragma_update(None, "foreign_keys", "ON")?;
    connection.pragma_update(None, "journal_mode", "WAL")?;
    Ok(())
}

fn ensure_schema(connection: &Connection) -> Result<(), DbError> {
    let schema_sql = load_schema_sql()?;
    connection.execute_batch(&schema_sql)?;
    Ok(())
}

fn load_schema_sql() -> Result<String, DbError> {
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    let schema_path = manifest_dir.join(SCHEMA_RELATIVE_PATH);

    if !schema_path.exists() {
        return Err(DbError::SchemaNotFound(schema_path));
    }

    let schema = fs::read_to_string(&schema_path)?;
    Ok(schema)
}

#[derive(Debug, Error)]
pub enum DbError {
    #[error("Chyba SQLite: {0}")]
    Sqlite(#[from] rusqlite::Error),
    #[error("Filesystem error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Schema file not found: {0}")]
    SchemaNotFound(PathBuf),
    #[error("Error while waiting for blocking task: {0}")]
    Join(tokio::task::JoinError),
}
