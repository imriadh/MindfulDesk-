use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FocusSettings {
    pub work_duration: u32,      // minutes
    pub short_break: u32,         // minutes
    pub long_break: u32,          // minutes
    pub sessions_before_long_break: u32,
    pub auto_start_breaks: bool,
    pub auto_start_focus: bool,
    pub notifications_enabled: bool,
    pub sound_enabled: bool,
}

impl Default for FocusSettings {
    fn default() -> Self {
        FocusSettings {
            work_duration: 25,
            short_break: 5,
            long_break: 15,
            sessions_before_long_break: 4,
            auto_start_breaks: false,
            auto_start_focus: false,
            notifications_enabled: true,
            sound_enabled: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SessionType {
    Focus,
    ShortBreak,
    LongBreak,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FocusState {
    pub is_active: bool,
    pub is_paused: bool,
    pub session_type: SessionType,
    pub remaining_seconds: u32,
    pub total_seconds: u32,
    pub completed_sessions: u32,
}

impl Default for FocusState {
    fn default() -> Self {
        FocusState {
            is_active: false,
            is_paused: false,
            session_type: SessionType::Focus,
            remaining_seconds: 0,
            total_seconds: 0,
            completed_sessions: 0,
        }
    }
}

pub struct FocusManager {
    pub state: Mutex<FocusState>,
    pub settings: Mutex<FocusSettings>,
}

impl Default for FocusManager {
    fn default() -> Self {
        FocusManager {
            state: Mutex::new(FocusState::default()),
            settings: Mutex::new(FocusSettings::default()),
        }
    }
}

#[tauri::command]
pub fn start_focus_session(
    session_type: String,
    manager: State<FocusManager>,
) -> Result<FocusState, String> {
    let mut state = manager.state.lock().unwrap();
    let settings = manager.settings.lock().unwrap();

    let duration = match session_type.as_str() {
        "focus" => settings.work_duration,
        "short_break" => settings.short_break,
        "long_break" => settings.long_break,
        _ => return Err("Invalid session type".to_string()),
    };

    let session_enum = match session_type.as_str() {
        "focus" => SessionType::Focus,
        "short_break" => SessionType::ShortBreak,
        "long_break" => SessionType::LongBreak,
        _ => SessionType::Focus,
    };

    state.is_active = true;
    state.is_paused = false;
    state.session_type = session_enum;
    state.remaining_seconds = duration * 60;
    state.total_seconds = duration * 60;

    Ok(state.clone())
}

#[tauri::command]
pub fn pause_focus_session(manager: State<FocusManager>) -> Result<FocusState, String> {
    let mut state = manager.state.lock().unwrap();
    
    if !state.is_active {
        return Err("No active session".to_string());
    }

    state.is_paused = !state.is_paused;
    Ok(state.clone())
}

#[tauri::command]
pub fn stop_focus_session(manager: State<FocusManager>) -> Result<FocusState, String> {
    let mut state = manager.state.lock().unwrap();
    
    if matches!(state.session_type, SessionType::Focus) && state.remaining_seconds == 0 {
        state.completed_sessions += 1;
    }

    *state = FocusState::default();
    Ok(state.clone())
}

#[tauri::command]
pub fn get_focus_state(manager: State<FocusManager>) -> Result<FocusState, String> {
    let state = manager.state.lock().unwrap();
    Ok(state.clone())
}

#[tauri::command]
pub fn update_focus_settings(
    settings: FocusSettings,
    manager: State<FocusManager>,
) -> Result<FocusSettings, String> {
    let mut current_settings = manager.settings.lock().unwrap();
    *current_settings = settings.clone();
    Ok(settings)
}

#[tauri::command]
pub fn get_focus_settings(manager: State<FocusManager>) -> Result<FocusSettings, String> {
    let settings = manager.settings.lock().unwrap();
    Ok(settings.clone())
}
