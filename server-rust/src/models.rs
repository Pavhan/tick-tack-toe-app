use std::fmt;
use std::str::FromStr;

use rusqlite::ToSql;
use rusqlite::types::{FromSql, FromSqlError, FromSqlResult, ValueRef};
use serde::{Deserialize, Serialize, Serializer};

fn serialize_str<S: Serializer>(value: &str, serializer: S) -> Result<S::Ok, S::Error> {
    serializer.serialize_str(value)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Player {
    X,
    O,
}

impl Player {
    pub fn as_str(&self) -> &'static str {
        match self {
            Player::X => "X",
            Player::O => "O",
        }
    }
}

impl fmt::Display for Player {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

impl Serialize for Player {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serialize_str(self.as_str(), serializer)
    }
}

impl<'de> Deserialize<'de> for Player {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::from_str(&value).map_err(|err| serde::de::Error::custom(err.to_string()))
    }
}

impl FromStr for Player {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "X" | "x" => Ok(Player::X),
            "O" | "o" => Ok(Player::O),
            _ => Err("Invalid player value"),
        }
    }
}

impl ToSql for Player {
    fn to_sql(&self) -> rusqlite::Result<rusqlite::types::ToSqlOutput<'_>> {
        Ok(self.as_str().into())
    }
}

impl FromSql for Player {
    fn column_result(value: ValueRef<'_>) -> FromSqlResult<Self> {
        match value.as_str()? {
            "X" | "x" => Ok(Player::X),
            "O" | "o" => Ok(Player::O),
            _ => Err(FromSqlError::Other("Invalid player".into())),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum GameWinner {
    X,
    O,
    Draw,
}

impl GameWinner {
    pub fn as_str(&self) -> &'static str {
        match self {
            GameWinner::X => "X",
            GameWinner::O => "O",
            GameWinner::Draw => "draw",
        }
    }
}

impl fmt::Display for GameWinner {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

impl Serialize for GameWinner {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serialize_str(self.as_str(), serializer)
    }
}

impl<'de> Deserialize<'de> for GameWinner {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::from_str(&value).map_err(|err| serde::de::Error::custom(err.to_string()))
    }
}

impl FromStr for GameWinner {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "X" | "x" => Ok(GameWinner::X),
            "O" | "o" => Ok(GameWinner::O),
            "draw" | "DRAW" => Ok(GameWinner::Draw),
            _ => Err("Invalid winner value"),
        }
    }
}

impl ToSql for GameWinner {
    fn to_sql(&self) -> rusqlite::Result<rusqlite::types::ToSqlOutput<'_>> {
        Ok(self.as_str().into())
    }
}

impl FromSql for GameWinner {
    fn column_result(value: ValueRef<'_>) -> FromSqlResult<Self> {
        match value.as_str()? {
            "X" | "x" => Ok(GameWinner::X),
            "O" | "o" => Ok(GameWinner::O),
            "draw" | "DRAW" => Ok(GameWinner::Draw),
            _ => Err(FromSqlError::Other("Invalid winner".into())),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum GameStatus {
    InProgress,
    Completed,
    Abandoned,
}

impl GameStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            GameStatus::InProgress => "in_progress",
            GameStatus::Completed => "completed",
            GameStatus::Abandoned => "abandoned",
        }
    }
}

impl fmt::Display for GameStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

impl Serialize for GameStatus {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serialize_str(self.as_str(), serializer)
    }
}

impl<'de> Deserialize<'de> for GameStatus {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::from_str(&value).map_err(|err| serde::de::Error::custom(err.to_string()))
    }
}

impl FromStr for GameStatus {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "in_progress" | "IN_PROGRESS" | "in-progress" => Ok(GameStatus::InProgress),
            "completed" | "COMPLETED" => Ok(GameStatus::Completed),
            "abandoned" | "ABANDONED" => Ok(GameStatus::Abandoned),
            _ => Err("Invalid game status"),
        }
    }
}

impl ToSql for GameStatus {
    fn to_sql(&self) -> rusqlite::Result<rusqlite::types::ToSqlOutput<'_>> {
        Ok(self.as_str().into())
    }
}

impl FromSql for GameStatus {
    fn column_result(value: ValueRef<'_>) -> FromSqlResult<Self> {
        match value.as_str()? {
            "in_progress" | "IN_PROGRESS" => Ok(GameStatus::InProgress),
            "completed" | "COMPLETED" => Ok(GameStatus::Completed),
            "abandoned" | "ABANDONED" => Ok(GameStatus::Abandoned),
            _ => Err(FromSqlError::Other("Invalid game status".into())),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Game {
    pub id: i64,
    pub board_size: i64,
    pub status: GameStatus,
    pub winner: Option<GameWinner>,
    pub current_player: Player,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GameMove {
    pub id: i64,
    pub game_id: i64,
    pub move_number: i64,
    pub position: i64,
    pub player: Player,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GameWithMoves {
    #[serde(flatten)]
    pub game: Game,
    pub moves: Vec<GameMove>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GameListItem {
    #[serde(flatten)]
    pub game: Game,
    pub move_count: i64,
}
