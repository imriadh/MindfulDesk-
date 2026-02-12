# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MindfulDesk App                      │
│                  (Tauri Desktop App)                    │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼────────┐                    ┌────────▼────────┐
│   Frontend     │                    │    Backend      │
│   (React)      │◄──────IPC─────────►│    (Rust)       │
└───────┬────────┘                    └────────┬────────┘
        │                                      │
        │                                      │
┌───────▼────────────────────┐    ┌───────────▼─────────────┐
│  UI Components             │    │  Backend Modules        │
│  • Dashboard               │    │  • FocusManager         │
│  • FocusTab                │    │  • StatsTracker         │
│  • StatsTab                │    │  • JournalManager       │
│  • JournalTab              │    │  • Gamification         │
│  • SettingsTab             │    │  • Database             │
└───────┬────────────────────┘    └───────────┬─────────────┘
        │                                      │
┌───────▼────────────────────┐    ┌───────────▼─────────────┐
│  State Management          │    │  Data Layer             │
│  • ThemeContext            │    │  • SQLite Database      │
│  • Local State (useState)  │    │  • Migrations           │
└────────────────────────────┘    └─────────────────────────┘
```

## Component Interaction Flow

### 1. Focus Session Flow
```
User Action (Click "Start Focus")
    │
    ▼
FocusTab.tsx
    │
    │ invoke("start_focus_session")
    ▼
focus_manager.rs
    │
    │ Update FocusState
    ▼
Return new state
    │
    ▼
FocusTab updates UI
    │
    ▼
Timer countdown (useEffect)
    │
    │ Every second
    ▼
Update remaining_seconds
    │
    │ When countdown = 0
    ▼
Send notification
    │
    ▼
Show motivational quote
```

### 2. Statistics Flow
```
StatsTab mounts
    │
    ▼
invoke("get_weekly_stats")
    │
    ▼
stats_tracker.rs
    │
    │ Query database
    ▼
database.rs (activity_logs table)
    │
    │ Aggregate data
    ▼
Return WeeklyStats
    │
    ▼
StatsTab receives data
    │
    ▼
Chart.js renders visualization
```

### 3. Journal Flow
```
User writes entry
    │
    ▼
JournalTab.tsx
    │
    │ invoke("add_journal_entry")
    ▼
journal_manager.rs
    │
    │ Validate mood (1-5)
    ▼
database.rs (journal_entries table)
    │
    │ INSERT INTO journal_entries
    ▼
Return JournalEntry
    │
    ▼
Reload entries
    │
    ▼
Update mood trends chart
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│                   User Interface                      │
│  (React Components with State Management)            │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ Tauri Commands (IPC)
                   │
┌──────────────────▼───────────────────────────────────┐
│                  Tauri Core                          │
│         (Command Handlers & Routing)                 │
└──────────────────┬───────────────────────────────────┘
                   │
      ┌────────────┼────────────┬──────────────┐
      │            │            │              │
┌─────▼────┐  ┌───▼────┐  ┌───▼────┐  ┌─────▼────┐
│  Focus   │  │ Stats  │  │Journal │  │Gamifica- │
│ Manager  │  │Tracker │  │Manager │  │   tion   │
└─────┬────┘  └───┬────┘  └───┬────┘  └─────┬────┘
      │           │            │              │
      └───────────┴────────────┴──────────────┘
                   │
                   │ SQL Queries
                   │
┌──────────────────▼───────────────────────────────────┐
│              SQLite Database                         │
│  • focus_sessions  • journal_entries                 │
│  • activity_logs   • achievements                    │
│  • user_stats      • settings                        │
└──────────────────────────────────────────────────────┘
```

## Module Responsibilities

### Frontend Modules

#### Dashboard.tsx
- Main app shell
- Tab navigation
- Theme toggle button
- App-wide layout

#### FocusTab.tsx
- Timer display and controls
- Session type selection (Focus/Break)
- Pause/Resume/Stop functionality
- Motivational quotes display
- Quick reminders section

#### StatsTab.tsx
- Streak visualization
- Statistics cards (4 metrics)
- Weekly charts (Line & Bar)
- CSV export functionality

#### JournalTab.tsx
- Mood entry form
- Emoji mood selector (1-5)
- Notes input
- Entry list with CRUD
- Mood vs Screen Time chart

#### SettingsTab.tsx
- Timer configuration
- Notification preferences
- Achievement gallery
- Progress visualization

#### ThemeContext.tsx
- Theme state management
- Light/dark mode toggle
- localStorage persistence
- CSS variable updates

### Backend Modules

#### focus_manager.rs
**Responsibilities:**
- Manage timer state
- Handle session types (Focus/ShortBreak/LongBreak)
- Track completed sessions
- Store and retrieve settings

**State:**
```rust
FocusState {
    is_active: bool,
    is_paused: bool,
    session_type: SessionType,
    remaining_seconds: u32,
    total_seconds: u32,
    completed_sessions: u32,
}
```

**Commands:**
- `start_focus_session(session_type)`
- `pause_focus_session()`
- `stop_focus_session()`
- `get_focus_state()`
- `update_focus_settings(settings)`
- `get_focus_settings()`

#### stats_tracker.rs
**Responsibilities:**
- Log activity events
- Aggregate statistics by day/week
- Calculate trends
- Export data to CSV/JSON

**Data Structures:**
```rust
DailyStats {
    date: String,
    total_focus_minutes: i64,
    total_break_minutes: i64,
    completed_sessions: i64,
    active_hours: f64,
}
```

**Commands:**
- `log_activity(type, duration, metadata)`
- `get_daily_stats(date)`
- `get_weekly_stats(week_start)`
- `export_stats(start_date, end_date, format)`

#### journal_manager.rs
**Responsibilities:**
- CRUD operations for journal entries
- Mood validation (1-5 range)
- Trend calculation
- Date-range queries

**Data Structures:**
```rust
JournalEntry {
    id: Option<i64>,
    date: String,
    mood: i32,  // 1-5
    notes: String,
    created_at: String,
}
```

**Commands:**
- `add_journal_entry(date, mood, notes)`
- `get_journal_entries(start_date, end_date)`
- `update_journal_entry(id, mood, notes)`
- `delete_journal_entry(id)`
- `get_mood_trends(days)`

#### gamification.rs
**Responsibilities:**
- Track daily streaks
- Manage achievements
- Calculate points and levels
- Detect newly unlocked achievements

**Data Structures:**
```rust
Achievement {
    id: String,
    title: String,
    description: String,
    icon: String,
    unlocked: bool,
    unlocked_at: Option<String>,
}

UserStats {
    total_focus_sessions: i64,
    current_streak: i64,
    longest_streak: i64,
    total_focus_minutes: i64,
    achievements_unlocked: i64,
    level: i64,
    points: i64,
}
```

**Commands:**
- `update_streak()`
- `get_achievements()`
- `get_user_stats()`
- `check_new_achievements()`

#### database.rs
**Responsibilities:**
- SQLite initialization
- Schema migrations
- Connection management
- Query utilities

**Schema Version:** 1
**Tables:** 6 (see DEVELOPMENT.md for full schema)

## Technology Stack Details

### Frontend
- **React 18.2.0** - UI library
- **TypeScript 5.3.3** - Type safety
- **Vite 5.1.0** - Build tool & dev server
- **Chart.js 4.4.1** - Data visualization
- **react-chartjs-2 5.2.0** - React wrapper for Chart.js
- **Lucide React 0.344.0** - Icon library

### Backend
- **Tauri 2.2.0** - Desktop framework
- **Rust stable** - Backend language
- **SQLite** - Embedded database
- **tauri-plugin-sql 2.0** - Database plugin
- **tauri-plugin-notification 2.0** - Notifications
- **Serde 1.x** - Serialization
- **Chrono 0.4** - Date/time handling

## Security Considerations

### Data Privacy
- All data stored locally (no network calls)
- No telemetry or analytics
- No external dependencies at runtime
- User has full control over data

### Database Security
- SQLite file permissions (user-only read/write)
- Input validation on all commands
- Parameterized queries (SQL injection prevention)
- No sensitive data stored (mood/notes only)

### Application Security
- Sandboxed runtime (Tauri)
- No eval() or dynamic code execution
- CSP headers configured
- Code signing for distribution

## Performance Optimization

### Frontend
- React.memo() for expensive components
- Chart lazy loading
- Debounced inputs
- Efficient re-renders with useState

### Backend
- Connection pooling for SQLite
- Async operations for I/O
- Indexed database queries
- Minimal data copying

## Deployment Architecture

```
┌─────────────────────────────────────┐
│      GitHub Repository              │
│  (Source Code + CI/CD)              │
└──────────────┬──────────────────────┘
               │
               │ Push / Tag
               │
┌──────────────▼──────────────────────┐
│     GitHub Actions                  │
│  (Build for Win/Mac/Linux)          │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┬───────────┐
       │               │           │
┌──────▼─────┐  ┌─────▼────┐  ┌──▼──────┐
│ Windows    │  │  macOS   │  │ Linux   │
│  .msi      │  │  .dmg    │  │ .deb    │
│  .exe      │  │  .app    │  │ .AppImage│
└──────┬─────┘  └─────┬────┘  └──┬──────┘
       │               │           │
       └───────┬───────┴───────────┘
               │
       ┌───────▼───────────────────────┐
       │    Distribution Channels      │
       │  • GitHub Releases            │
       │  • Microsoft Store            │
       │  • Direct Downloads           │
       └───────────────────────────────┘
```

## Future Architecture Enhancements

### Cloud Sync (Premium)
```
MindfulDesk App
    │
    │ Encrypted Upload
    ▼
Cloud Storage API
    │
    ├─► OneDrive API
    ├─► Google Drive API
    └─► Custom Backend
```

### AI Insights (Premium)
```
Local Data
    │
    │ Send to ML Service
    ▼
AI Analysis
    │
    ├─► Pattern Detection
    ├─► Mood Prediction
    └─► Break Suggestions
    │
    ▼
Return Insights
```

## Development Workflow

```
Developer
    │
    │ Edit Code
    ▼
Hot Reload (Vite)
    │
    ▼
Test Locally
    │
    │ Commit
    ▼
GitHub
    │
    │ CI/CD (GitHub Actions)
    ▼
Build Artifacts
    │
    │ Create Release
    ▼
Distribution
```
