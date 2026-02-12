// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod focus_manager;
mod stats_tracker;
mod journal_manager;
mod gamification;
mod database;

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
