use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivityState {
    pub is_active: bool,
    pub last_activity_time: u64,
    pub idle_threshold_seconds: u64,
    pub total_active_seconds: u64,
    pub total_idle_seconds: u64,
}

impl Default for ActivityState {
    fn default() -> Self {
        ActivityState {
            is_active: true,
            last_activity_time: current_timestamp(),
            idle_threshold_seconds: 300, // 5 minutes
            total_active_seconds: 0,
            total_idle_seconds: 0,
        }
    }
}

pub struct IdleDetector {
    state: Mutex<ActivityState>,
}

impl Default for IdleDetector {
    fn default() -> Self {
        IdleDetector {
            state: Mutex::new(ActivityState::default()),
        }
    }
}

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

#[tauri::command]
pub async fn get_activity_state(
    state: State<'_, IdleDetector>,
) -> Result<ActivityState, String> {
    let activity_state = state.state.lock().unwrap();
    Ok(activity_state.clone())
}

#[tauri::command]
pub async fn update_idle_threshold(
    threshold_seconds: u64,
    state: State<'_, IdleDetector>,
) -> Result<(), String> {
    let mut activity_state = state.state.lock().unwrap();
    activity_state.idle_threshold_seconds = threshold_seconds;
    Ok(())
}

#[tauri::command]
pub async fn record_activity(
    state: State<'_, IdleDetector>,
) -> Result<ActivityState, String> {
    let mut activity_state = state.state.lock().unwrap();
    let current_time = current_timestamp();
    let elapsed = current_time - activity_state.last_activity_time;
    
    // If we were idle, track idle time
    if !activity_state.is_active && elapsed < activity_state.idle_threshold_seconds {
        activity_state.total_idle_seconds += elapsed;
    } else if activity_state.is_active {
        activity_state.total_active_seconds += elapsed;
    }
    
    activity_state.is_active = true;
    activity_state.last_activity_time = current_time;
    
    Ok(activity_state.clone())
}

#[tauri::command]
pub async fn check_idle_status(
    state: State<'_, IdleDetector>,
) -> Result<bool, String> {
    let mut activity_state = state.state.lock().unwrap();
    let current_time = current_timestamp();
    let idle_duration = current_time - activity_state.last_activity_time;
    
    let is_now_idle = idle_duration >= activity_state.idle_threshold_seconds;
    
    // Update state if changed
    if is_now_idle && activity_state.is_active {
        activity_state.is_active = false;
        activity_state.total_active_seconds += idle_duration;
    } else if !is_now_idle && !activity_state.is_active {
        activity_state.is_active = true;
        activity_state.total_idle_seconds += idle_duration;
    }
    
    Ok(is_now_idle)
}

#[tauri::command]
pub async fn get_idle_duration(
    state: State<'_, IdleDetector>,
) -> Result<u64, String> {
    let activity_state = state.state.lock().unwrap();
    let current_time = current_timestamp();
    let idle_duration = current_time - activity_state.last_activity_time;
    
    if idle_duration >= activity_state.idle_threshold_seconds {
        Ok(idle_duration)
    } else {
        Ok(0)
    }
}

#[tauri::command]
pub async fn reset_activity_counters(
    state: State<'_, IdleDetector>,
) -> Result<(), String> {
    let mut activity_state = state.state.lock().unwrap();
    activity_state.total_active_seconds = 0;
    activity_state.total_idle_seconds = 0;
    activity_state.last_activity_time = current_timestamp();
    Ok(())
}

#[tauri::command]
pub async fn get_today_active_time(
    state: State<'_, IdleDetector>,
) -> Result<u64, String> {
    let activity_state = state.state.lock().unwrap();
    Ok(activity_state.total_active_seconds)
}
