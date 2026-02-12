# Development Guide

## Setup Development Environment

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Install Node.js
Download from [nodejs.org](https://nodejs.org/) or use nvm:
```bash
nvm install 18
nvm use 18
```

### 3. Install Tauri CLI
```bash
npm install -g @tauri-apps/cli
```

### 4. Platform-Specific Dependencies

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

#### macOS
```bash
xcode-select --install
```

#### Windows
Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

## Running the App

```bash
# Development mode with hot reload
npm run tauri:dev

# Frontend only (for UI development)
npm run dev

# Build for production
npm run tauri:build
```

## Architecture

### Backend (Rust)

#### FocusManager
Manages Pomodoro timer state and settings:
- `start_focus_session()` - Start a focus/break session
- `pause_focus_session()` - Pause/resume current session
- `stop_focus_session()` - Stop and reset session
- `get_focus_state()` - Get current timer state
- `update_focus_settings()` - Update user preferences

#### StatsTracker
Tracks and aggregates user activity:
- `log_activity()` - Record activity events
- `get_daily_stats()` - Daily summary
- `get_weekly_stats()` - Weekly aggregation
- `export_stats()` - Generate CSV/JSON exports

#### JournalManager
Handles mood tracking and journaling:
- `add_journal_entry()` - Create new entry
- `get_journal_entries()` - Fetch entries by date range
- `update_journal_entry()` - Edit existing entry
- `delete_journal_entry()` - Remove entry
- `get_mood_trends()` - Aggregate mood over time

#### Gamification
Manages achievements and streaks:
- `update_streak()` - Calculate daily streaks
- `get_achievements()` - List all achievements
- `get_user_stats()` - User progress summary
- `check_new_achievements()` - Detect newly unlocked

### Frontend (React + TypeScript)

#### Components
- **Dashboard** - Main app shell with tab navigation
- **FocusTab** - Timer interface with controls
- **StatsTab** - Charts and statistics display
- **JournalTab** - Mood tracking and entries
- **SettingsTab** - Configuration and achievements

#### Context
- **ThemeContext** - Light/dark theme management

## Database Schema

### Tables

#### focus_sessions
```sql
CREATE TABLE focus_sessions (
    id INTEGER PRIMARY KEY,
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration INTEGER,
    session_type TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### journal_entries
```sql
CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    mood INTEGER NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### activity_logs
```sql
CREATE TABLE activity_logs (
    id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    duration INTEGER,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### achievements
```sql
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY,
    achievement_type TEXT NOT NULL,
    unlocked_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### user_stats
```sql
CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY,
    stat_key TEXT NOT NULL UNIQUE,
    stat_value INTEGER NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

```bash
# Run Rust tests
cd src-tauri
cargo test

# Run frontend tests (add test framework as needed)
npm test
```

## Debugging

### Frontend
Use browser DevTools in the Tauri window:
- Right-click → Inspect Element
- Or set `devtools: true` in tauri.conf.json

### Backend
Use Rust debugging:
```rust
println!("Debug: {:?}", variable);
```

Or use a debugger:
```bash
RUST_BACKTRACE=1 npm run tauri:dev
```

## Code Style

### Rust
Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/):
```bash
cargo fmt  # Format code
cargo clippy  # Lint
```

### TypeScript/React
Use consistent formatting:
```bash
npm run format  # If using Prettier (add to package.json)
```

## Performance Optimization

### Frontend
- Use React.memo() for expensive components
- Lazy load charts on tab switch
- Debounce user inputs

### Backend
- Use connection pooling for SQLite
- Cache frequently accessed data
- Async operations for I/O

## Security

- Never store sensitive data unencrypted
- Validate all user inputs
- Use parameterized SQL queries (prevent injection)
- Keep dependencies updated

## Releasing

1. Update version in `package.json` and `Cargo.toml`
2. Update CHANGELOG.md
3. Build for all platforms
4. Test installers
5. Create GitHub release
6. Upload binaries

```bash
npm version patch  # or minor, major
npm run tauri:build
```
