use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize)]
pub struct DbError {
    message: String,
}

pub async fn init_db(_app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // Database initialization will be handled by the SQL plugin
    // Tables will be created on first access through Tauri commands
    Ok(())
}
