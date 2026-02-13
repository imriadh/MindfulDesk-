use serde::{Deserialize, Serialize};
use chrono::Utc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JournalEntry {
    pub id: Option<i64>,
    pub date: String,
    pub mood: i32,  // 1-5 scale
    pub notes: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MoodTrend {
    pub date: String,
    pub average_mood: f64,
    pub screen_time_minutes: i64,
}

#[tauri::command]
pub async fn add_journal_entry(
    date: String,
    mood: i32,
    notes: String,
    _app: tauri::AppHandle,
) -> Result<JournalEntry, String> {
    if mood < 1 || mood > 5 {
        return Err("Mood must be between 1 and 5".to_string());
    }

    let created_at = Utc::now().to_rfc3339();

    // Mock implementation - in production, insert into database
    Ok(JournalEntry {
        id: Some(1),
        date,
        mood,
        notes,
        created_at,
    })
}

#[tauri::command]
pub async fn get_journal_entries(
    _start_date: String,
    _end_date: String,
    _app: tauri::AppHandle,
) -> Result<Vec<JournalEntry>, String> {
    // Mock implementation
    Ok(vec![
        JournalEntry {
            id: Some(1),
            date: "2026-02-12".to_string(),
            mood: 4,
            notes: "Productive day! Completed 4 focus sessions.".to_string(),
            created_at: Utc::now().to_rfc3339(),
        },
    ])
}

#[tauri::command]
pub async fn update_journal_entry(
    _id: i64,
    mood: i32,
    notes: String,
    _app: tauri::AppHandle,
) -> Result<JournalEntry, String> {
    if mood < 1 || mood > 5 {
        return Err("Mood must be between 1 and 5".to_string());
    }

    // Mock implementation
    Ok(JournalEntry {
        id: Some(1),
        date: "2026-02-12".to_string(),
        mood,
        notes,
        created_at: Utc::now().to_rfc3339(),
    })
}

#[tauri::command]
pub async fn delete_journal_entry(
    _id: i64,
    _app: tauri::AppHandle,
) -> Result<bool, String> {
    // Mock implementation
    Ok(true)
}

#[tauri::command]
pub async fn get_mood_trends(
    _days: i32,
    _app: tauri::AppHandle,
) -> Result<Vec<MoodTrend>, String> {
    // Mock implementation - in production, aggregate from database
    Ok(vec![
        MoodTrend {
            date: "2026-02-12".to_string(),
            average_mood: 4.0,
            screen_time_minutes: 120,
        },
        MoodTrend {
            date: "2026-02-11".to_string(),
            average_mood: 3.5,
            screen_time_minutes: 180,
        },
    ])
}
