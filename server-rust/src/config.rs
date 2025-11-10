use std::env;
use std::net::SocketAddr;
use std::path::{Path, PathBuf};

use once_cell::sync::Lazy;

const DEFAULT_PORT: u16 = 3002;
const DEFAULT_DATABASE_PATH: &str = "./db/tictactoe.db";

static CONFIG: Lazy<Config> = Lazy::new(|| {
    load_dotenv();
    Config::from_env()
});

#[derive(Debug, Clone)]
pub struct Config {
    port: u16,
    database_path: PathBuf,
    environment: String,
}

impl Config {
    fn from_env() -> Self {
        let port = env::var("PORT")
            .ok()
            .and_then(|value| value.parse::<u16>().ok())
            .unwrap_or(DEFAULT_PORT);

        let database_path = env::var("DATABASE_PATH")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from(DEFAULT_DATABASE_PATH));

        let environment = env::var("NODE_ENV").unwrap_or_else(|_| "development".to_string());

        Self {
            port,
            database_path,
            environment,
        }
    }

    pub fn port(&self) -> u16 {
        self.port
    }

    pub fn address(&self) -> SocketAddr {
        ([0, 0, 0, 0], self.port).into()
    }

    pub fn database_path(&self) -> &Path {
        &self.database_path
    }

    pub fn environment(&self) -> &str {
        &self.environment
    }
}

pub fn config() -> &'static Config {
    Lazy::force(&CONFIG)
}

fn load_dotenv() {
    let current_dir = env::current_dir().ok();
    let candidates = current_dir.iter().flat_map(|root| {
        [
            root.join("server-rust/.env"),
        ]
    });

    for path in candidates {
        if path.exists() {
            let _ = dotenvy::from_path(path);
            break;
        }
    }
}
