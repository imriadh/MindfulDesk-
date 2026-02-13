// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod focus_manager;
mod stats_tracker;
mod journal_manager;
mod gamification;
mod database;
mod distraction_blocker;
mod health_reminders;
mod idle_detector;

use tauri::Manager;

#[tauri::command]
async fn init_database(app: tauri::AppHandle) -> Result<(), String> {
    database::init_db(&app).await.map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .manage(focus_manager::FocusManager::default())
        .manage(distraction_blocker::BlockerManager::default())
        .manage(health_reminders::ReminderManager::default())
        .manage(idle_detector::IdleDetector::default())
        .setup(|app| {
            // Initialize database on startup
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = database::init_db(&handle).await {
                    eprintln!("Failed to initialize database: {}", e);
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            init_database,
            // Focus Manager
            focus_manager::start_focus_session,
            focus_manager::pause_focus_session,
            focus_manager::stop_focus_session,
            focus_manager::get_focus_state,
            focus_manager::update_focus_settings,
            focus_manager::get_focus_settings,
            // Stats Tracker
            stats_tracker::log_activity,
            stats_tracker::get_daily_stats,
            stats_tracker::get_weekly_stats,
            stats_tracker::export_stats,
            // Journal Manager
            journal_manager::add_journal_entry,
            journal_manager::get_journal_entries,
            journal_manager::get_mood_trends,
            journal_manager::update_journal_entry,
            journal_manager::delete_journal_entry,
            // Gamification
            gamification::update_streak,
            gamification::get_achievements,
            gamification::get_user_stats,
            gamification::check_new_achievements,
            // Distraction Blocker
            distraction_blocker::get_blocker_settings,
            distraction_blocker::update_blocker_settings,
            distraction_blocker::add_blocked_item,
            distraction_blocker::remove_blocked_item,
            distraction_blocker::toggle_blocked_item,
            distraction_blocker::check_url_blocked,
            distraction_blocker::request_override,
            distraction_blocker::end_override,
            distraction_blocker::get_popular_distractions,
            // Health Reminders
            health_reminders::get_reminder_settings,
            health_reminders::update_reminder_settings,
            health_reminders::add_custom_reminder,
            health_reminders::update_reminder,
            health_reminders::delete_reminder,
            health_reminders::toggle_reminder,
            health_reminders::get_due_reminders,
            // Idle Detector
            idle_detector::get_activity_state,
            idle_detector::update_idle_threshold,
            idle_detector::record_activity,
            idle_detector::check_idle_status,
            idle_detector::get_idle_duration,
            idle_detector::reset_activity_counters,
            idle_detector::get_today_active_time,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
