use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthReminder {
    pub id: String,
    pub reminder_type: ReminderType,
    pub interval_minutes: u32,
    pub message: String,
    pub enabled: bool,
    pub last_triggered: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ReminderType {
    Hydration,
    Stretching,
    EyeRest,
    Posture,
    Custom,
}

impl ToString for ReminderType {
    fn to_string(&self) -> String {
        match self {
            ReminderType::Hydration => "Hydration".to_string(),
            ReminderType::Stretching => "Stretching".to_string(),
            ReminderType::EyeRest => "EyeRest".to_string(),
            ReminderType::Posture => "Posture".to_string(),
            ReminderType::Custom => "Custom".to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderSettings {
    pub reminders: Vec<HealthReminder>,
    pub enabled: bool,
    pub only_during_focus: bool,
}

impl Default for ReminderSettings {
    fn default() -> Self {
        ReminderSettings {
            reminders: vec![
                HealthReminder {
                    id: uuid::Uuid::new_v4().to_string(),
                    reminder_type: ReminderType::Hydration,
                    interval_minutes: 30,
                    message: "💧 Time to hydrate! Drink some water.".to_string(),
                    enabled: true,
                    last_triggered: None,
                },
                HealthReminder {
                    id: uuid::Uuid::new_v4().to_string(),
                    reminder_type: ReminderType::Stretching,
                    interval_minutes: 60,
                    message: "🧘 Take a moment to stretch your body!".to_string(),
                    enabled: true,
                    last_triggered: None,
                },
                HealthReminder {
                    id: uuid::Uuid::new_v4().to_string(),
                    reminder_type: ReminderType::EyeRest,
                    interval_minutes: 20,
                    message: "👁️ Follow the 20-20-20 rule: Look 20 feet away for 20 seconds.".to_string(),
                    enabled: true,
                    last_triggered: None,
                },
                HealthReminder {
                    id: uuid::Uuid::new_v4().to_string(),
                    reminder_type: ReminderType::Posture,
                    interval_minutes: 45,
                    message: "🪑 Check your posture! Sit up straight.".to_string(),
                    enabled: true,
                    last_triggered: None,
                },
            ],
            enabled: true,
            only_during_focus: false,
        }
    }
}

pub struct ReminderManager {
    settings: Mutex<ReminderSettings>,
}

impl Default for ReminderManager {
    fn default() -> Self {
        ReminderManager {
            settings: Mutex::new(ReminderSettings::default()),
        }
    }
}

#[tauri::command]
pub async fn get_reminder_settings(
    state: State<'_, ReminderManager>,
) -> Result<ReminderSettings, String> {
    let settings = state.settings.lock().unwrap();
    Ok(settings.clone())
}

#[tauri::command]
pub async fn update_reminder_settings(
    settings: ReminderSettings,
    state: State<'_, ReminderManager>,
) -> Result<(), String> {
    let mut current_settings = state.settings.lock().unwrap();
    *current_settings = settings;
    Ok(())
}

#[tauri::command]
pub async fn add_custom_reminder(
    interval_minutes: u32,
    message: String,
    state: State<'_, ReminderManager>,
) -> Result<HealthReminder, String> {
    let mut settings = state.settings.lock().unwrap();
    
    let reminder = HealthReminder {
        id: uuid::Uuid::new_v4().to_string(),
        reminder_type: ReminderType::Custom,
        interval_minutes,
        message,
        enabled: true,
        last_triggered: None,
    };
    
    settings.reminders.push(reminder.clone());
    Ok(reminder)
}

#[tauri::command]
pub async fn update_reminder(
    id: String,
    interval_minutes: Option<u32>,
    message: Option<String>,
    enabled: Option<bool>,
    state: State<'_, ReminderManager>,
) -> Result<(), String> {
    let mut settings = state.settings.lock().unwrap();
    
    if let Some(reminder) = settings.reminders.iter_mut().find(|r| r.id == id) {
        if let Some(interval) = interval_minutes {
            reminder.interval_minutes = interval;
        }
        if let Some(msg) = message {
            reminder.message = msg;
        }
        if let Some(en) = enabled {
            reminder.enabled = en;
        }
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn delete_reminder(
    id: String,
    state: State<'_, ReminderManager>,
) -> Result<(), String> {
    let mut settings = state.settings.lock().unwrap();
    settings.reminders.retain(|r| r.id != id);
    Ok(())
}

#[tauri::command]
pub async fn toggle_reminder(
    id: String,
    state: State<'_, ReminderManager>,
) -> Result<(), String> {
    let mut settings = state.settings.lock().unwrap();
    
    if let Some(reminder) = settings.reminders.iter_mut().find(|r| r.id == id) {
        reminder.enabled = !reminder.enabled;
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn get_due_reminders(
    state: State<'_, ReminderManager>,
) -> Result<Vec<HealthReminder>, String> {
    let settings = state.settings.lock().unwrap();
    
    if !settings.enabled {
        return Ok(vec![]);
    }
    
    // In a real implementation, check timestamps and return due reminders
    // For now, return empty vec (frontend will handle timing)
    Ok(vec![])
}
