use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ApiSuccess<T>
where
    T: Serialize,
{
    pub success: bool,
    pub data: T,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
}

impl<T> ApiSuccess<T>
where
    T: Serialize,
{
    pub fn new(data: T) -> Self {
        Self {
            success: true,
            data,
            message: None,
        }
    }

    pub fn with_message<M: Into<String>>(data: T, message: M) -> Self {
        Self {
            success: true,
            data,
            message: Some(message.into()),
        }
    }
}
