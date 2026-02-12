use serde::{Deserialize, Serialize};
use chrono::Utc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Achievement {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub unlocked: bool,
    pub unlocked_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserStats {
    pub total_focus_sessions: i64,
    pub current_streak: i64,
    pub longest_streak: i64,
    pub total_focus_minutes: i64,
    pub achievements_unlocked: i64,
    pub level: i64,
    pub points: i64,
}

impl Default for UserStats {
    fn default() -> Self {
        UserStats {
            total_focus_sessions: 0,
            current_streak: 0,
            longest_streak: 0,
            total_focus_minutes: 0,
            achievements_unlocked: 0,
            level: 1,
            points: 0,
        }
    }
}

#[tauri::command]
pub async fn update_streak(
    _app: tauri::AppHandle,
) -> Result<UserStats, String> {
    // Mock implementation - in production, calculate streak from database
    Ok(UserStats {
        total_focus_sessions: 10,
        current_streak: 3,
        longest_streak: 5,
        total_focus_minutes: 250,
        achievements_unlocked: 2,
        level: 2,
        points: 150,
    })
}

#[tauri::command]
pub async fn get_achievements(
    _app: tauri::AppHandle,
) -> Result<Vec<Achievement>, String> {
    // Predefined achievements
    let achievements = vec![
        Achievement {
            id: "first_session".to_string(),
            title: "Getting Started".to_string(),
            description: "Complete your first focus session".to_string(),
            icon: "🎯".to_string(),
            unlocked: true,
            unlocked_at: Some(Utc::now().to_rfc3339()),
        },
        Achievement {
            id: "five_day_streak".to_string(),
            title: "Consistent Focus".to_string(),
            description: "Maintain a 5-day streak".to_string(),
            icon: "🔥".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "break_master".to_string(),
            title: "Break Master".to_string(),
            description: "Take 20 breaks on time".to_string(),
            icon: "☕".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "deep_work".to_string(),
            title: "Deep Work".to_string(),
            description: "Focus for 100+ hours total".to_string(),
            icon: "🧠".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "journal_habit".to_string(),
            title: "Reflective Mind".to_string(),
            description: "Journal for 7 consecutive days".to_string(),
            icon: "📔".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "mindful_week".to_string(),
            title: "Mindful Week".to_string(),
            description: "Complete all reminders for a week".to_string(),
            icon: "🌟".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
    ];

    Ok(achievements)
}

#[tauri::command]
pub async fn get_user_stats(
    _app: tauri::AppHandle,
) -> Result<UserStats, String> {
    // Mock implementation
    Ok(UserStats {
        total_focus_sessions: 10,
        current_streak: 3,
        longest_streak: 5,
        total_focus_minutes: 250,
        achievements_unlocked: 2,
        level: 2,
        points: 150,
    })
}

#[tauri::command]
pub async fn check_new_achievements(
    _app: tauri::AppHandle,
) -> Result<Vec<Achievement>, String> {
    // Check if any new achievements were unlocked
    // Returns list of newly unlocked achievements
    Ok(vec![])
}
