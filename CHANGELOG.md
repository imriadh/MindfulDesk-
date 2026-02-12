# MindfulDesk Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Distraction blocking (website/app monitoring)
- Cloud sync integration
- AI-powered insights
- Calendar integration
- Mobile companion app

## [0.1.0] - 2026-02-12

### Added
- Initial release of MindfulDesk
- **Focus Timer**
  - Pomodoro-style timer with configurable durations
  - Focus sessions (default 25 minutes)
  - Short breaks (default 5 minutes)
  - Long breaks (default 15 minutes)
  - Pause/resume functionality
  - Session completion tracking
  - Motivational quotes during breaks
  
- **Statistics & Tracking**
  - Daily and weekly stats
  - Visual charts (Line and Bar charts)
  - Focus time tracking
  - Session completion counts
  - Streak tracking
  - CSV export functionality
  
- **Mood Journal**
  - Daily mood check-ins (1-5 scale with emojis)
  - Personal notes and reflections
  - Mood trends visualization
  - Correlation with screen time
  - Edit and delete entries
  
- **Gamification**
  - Daily streak system
  - 6 achievements to unlock
  - Level and points system
  - Achievement progress tracking
  
- **UI/UX**
  - Clean, modern interface
  - Dark/light theme toggle
  - Responsive design
  - Tab-based navigation
  - Native system notifications
  
- **Settings**
  - Customizable timer durations
  - Auto-start preferences
  - Notification controls
  - Sound alert controls
  
- **Data & Privacy**
  - Local SQLite storage
  - No cloud dependency
  - Privacy-first design
  - Manual data export

### Technical
- Built with Tauri 2.2
- React 18 + TypeScript frontend
- Rust backend with modular architecture
- Chart.js for data visualization
- Lucide React icons
- Cross-platform support (Windows, macOS, Linux)

### Known Issues
- Distraction blocking not yet implemented
- Cloud sync not available
- Some achievements may not trigger correctly (to be improved)

## [0.0.1] - 2026-02-01

### Added
- Project initialization
- Basic project structure
- Development environment setup

---

## Release Notes

### v0.1.0 Release Notes

**MindfulDesk** is a cross-platform desktop application designed to promote mindful productivity and wellness. This initial release includes core features for focus management, activity tracking, and mood journaling.

**Highlights:**
- ⏱️ Pomodoro timer with customizable intervals
- 📊 Beautiful charts showing your productivity trends
- 📔 Daily mood journal with visual trends
- 🏆 Gamification with streaks and achievements
- 🎨 Dark/light themes for comfortable viewing
- 🔒 100% local storage - your data stays with you

**Getting Started:**
1. Download the installer for your platform
2. Run MindfulDesk
3. Start your first focus session
4. Track your progress and maintain your streak!

**System Requirements:**
- Windows 10/11 (x64)
- macOS 10.15+ (Intel/Apple Silicon)
- Linux (Ubuntu 20.04+, Fedora 35+, or equivalent)

**Feedback:**
We'd love to hear from you! Report issues or suggest features on our GitHub repository.

---

[Unreleased]: https://github.com/yourusername/MindfulDesk/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/MindfulDesk/releases/tag/v0.1.0
