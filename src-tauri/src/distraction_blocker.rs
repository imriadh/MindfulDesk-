use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockedItem {
    pub id: String,
    pub name: String,
    pub url_pattern: String,
    pub item_type: BlockItemType,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BlockItemType {
    Website,
    Application,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockerSettings {
    pub enabled: bool,
    pub block_mode: BlockMode,
    pub blocked_items: Vec<BlockedItem>,
    pub allow_override: bool,
    pub override_timeout: u32, // seconds
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BlockMode {
    Warn,    // Show warning but allow access
    Block,   // Completely block access
}

impl Default for BlockerSettings {
    fn default() -> Self {
        BlockerSettings {
            enabled: false,
            block_mode: BlockMode::Warn,
            blocked_items: vec![],
            allow_override: true,
            override_timeout: 300, // 5 minutes
        }
    }
}

pub struct BlockerManager {
    settings: Mutex<BlockerSettings>,
    override_active: Mutex<bool>,
}

impl Default for BlockerManager {
    fn default() -> Self {
        BlockerManager {
            settings: Mutex::new(BlockerSettings::default()),
            override_active: Mutex::new(false),
        }
    }
}

#[tauri::command]
pub async fn get_blocker_settings(
    state: State<'_, BlockerManager>,
) -> Result<BlockerSettings, String> {
    let settings = state.settings.lock().unwrap();
    Ok(settings.clone())
}

#[tauri::command]
pub async fn update_blocker_settings(
    settings: BlockerSettings,
    state: State<'_, BlockerManager>,
) -> Result<(), String> {
    let mut current_settings = state.settings.lock().unwrap();
    *current_settings = settings;
    Ok(())
}

#[tauri::command]
pub async fn add_blocked_item(
    name: String,
    url_pattern: String,
    item_type: String,
    state: State<'_, BlockerManager>,
) -> Result<BlockedItem, String> {
    let mut settings = state.settings.lock().unwrap();
    
    let item = BlockedItem {
        id: uuid::Uuid::new_v4().to_string(),
        name,
        url_pattern,
        item_type: match item_type.as_str() {
            "application" => BlockItemType::Application,
            _ => BlockItemType::Website,
        },
        is_active: true,
    };
    
    settings.blocked_items.push(item.clone());
    Ok(item)
}

#[tauri::command]
pub async fn remove_blocked_item(
    id: String,
    state: State<'_, BlockerManager>,
) -> Result<(), String> {
    let mut settings = state.settings.lock().unwrap();
    settings.blocked_items.retain(|item| item.id != id);
    Ok(())
}

#[tauri::command]
pub async fn toggle_blocked_item(
    id: String,
    state: State<'_, BlockerManager>,
) -> Result<(), String> {
    let mut settings = state.settings.lock().unwrap();
    if let Some(item) = settings.blocked_items.iter_mut().find(|i| i.id == id) {
        item.is_active = !item.is_active;
    }
    Ok(())
}

#[tauri::command]
pub async fn check_url_blocked(
    url: String,
    state: State<'_, BlockerManager>,
) -> Result<bool, String> {
    let settings = state.settings.lock().unwrap();
    let override_active = state.override_active.lock().unwrap();
    
    if !settings.enabled || *override_active {
        return Ok(false);
    }
    
    for item in &settings.blocked_items {
        if item.is_active && url.contains(&item.url_pattern) {
            return Ok(true);
        }
    }
    
    Ok(false)
}

#[tauri::command]
pub async fn request_override(
    duration: u32,
    state: State<'_, BlockerManager>,
) -> Result<bool, String> {
    let settings = state.settings.lock().unwrap();
    
    if !settings.allow_override {
        return Ok(false);
    }
    
    let mut override_active = state.override_active.lock().unwrap();
    *override_active = true;
    
    // In a real implementation, you'd spawn a timer to reset this
    // For now, we'll rely on the frontend to call end_override
    
    Ok(true)
}

#[tauri::command]
pub async fn end_override(
    state: State<'_, BlockerManager>,
) -> Result<(), String> {
    let mut override_active = state.override_active.lock().unwrap();
    *override_active = false;
    Ok(())
}

#[tauri::command]
pub async fn get_popular_distractions() -> Result<Vec<String>, String> {
    Ok(vec![
        "youtube.com".to_string(),
        "facebook.com".to_string(),
        "twitter.com".to_string(),
        "x.com".to_string(),
        "instagram.com".to_string(),
        "reddit.com".to_string(),
        "tiktok.com".to_string(),
        "netflix.com".to_string(),
        "twitch.tv".to_string(),
        "discord.com".to_string(),
    ])
}
