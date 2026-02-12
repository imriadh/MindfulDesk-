# 🧘 MindfulDesk

A cross-platform desktop application for mindful productivity and wellness. Built with Tauri (Rust + React).

![MindfulDesk](https://img.shields.io/badge/version-0.1.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)
![Tauri](https://img.shields.io/badge/Tauri-2.2-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Rust](https://img.shields.io/badge/Rust-stable-orange)

> **📚 Quick Links:** [Quickstart](QUICKSTART.md) | [Development Guide](DEVELOPMENT.md) | [Architecture](ARCHITECTURE.md) | [Contributing](CONTRIBUTING.md) | [Privacy Policy](PRIVACY.md)

## ✨ Features

### 🎯 Focus & Break Reminders
- **Pomodoro-style timers** with customizable work/break cycles
- Gentle notifications for hydration, stretching, and eye rest
- Fully configurable reminder intervals
- Auto-start options for seamless workflow

### 📊 Screen Time Tracking
- Track daily and weekly usage patterns
- Visual charts showing active vs. idle time
- Export usage reports as CSV/JSON for analysis
- Detailed statistics and trends

### 🚫 Distraction Blocking (Coming Soon)
- Create lists of distracting websites/apps
- Block or warn during focus mode
- Temporary override with confirmation
- Stay focused on what matters

### 📔 Mood & Reflection Journal
- Simple daily check-ins with mood ratings (1-5 scale)
- Add personal notes and reflections
- Data stored locally in SQLite
- Visual trends correlating mood with screen time

### 🎮 Gamification
- **Streak tracking** - Maintain daily focus habits
- **Achievements system** - Unlock rewards for consistency
- Level up with points and milestones
- Motivational quotes during breaks

### 🎨 Beautiful UI
- Clean, modern dashboard interface
- Dark/light theme toggle
- Responsive design
- Intuitive tab navigation (Focus, Stats, Journal, Settings)

### 🔒 Privacy First
- All data stored locally (SQLite)
- No telemetry or tracking
- Manual export/import for backups
- Optional cloud sync (premium feature)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **Rust** (latest stable)
- **npm** or **yarn**

### Installation

#### Quick Setup (All Platforms)
```bash
# Clone the repository
git clone https://github.com/yourusername/MindfulDesk.git
cd MindfulDesk

# Run setup script
# Linux/macOS:
./setup.sh

# Windows:
setup.bat

# Start development
npm run tauri:dev
```

#### Manual Setup
```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri:dev

# Build for production
npm run tauri:build
```

**See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.**

### Development

```bash
# Run frontend dev server
npm run dev

# Run Tauri dev (with hot reload)
npm run tauri:dev

# Build frontend
npm run build

# Build Tauri app
npm run tauri:build
```

## 📁 Project Structure

```
MindfulDesk/
├── .github/workflows/        # CI/CD pipelines
├── .devcontainer/            # Codespaces config
├── src/                      # React frontend
│   ├── components/           # UI components
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── FocusTab.tsx      # Focus timer interface
│   │   ├── StatsTab.tsx      # Statistics and charts
│   │   ├── JournalTab.tsx    # Mood journal
│   │   └── SettingsTab.tsx   # Settings & achievements
│   ├── context/              # React contexts
│   │   └── ThemeContext.tsx  # Theme management
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── src-tauri/                # Rust backend
│   ├── src/
│   │   ├── main.rs           # Tauri app entry
│   │   ├── database.rs       # SQLite setup
│   │   ├── focus_manager.rs  # Timer logic
│   │   ├── stats_tracker.rs  # Activity tracking
│   │   ├── journal_manager.rs # Journal CRUD
│   │   └── gamification.rs   # Achievements & streaks
│   ├── Cargo.toml            # Rust dependencies
│   └── tauri.conf.json       # Tauri configuration
├── setup.sh / setup.bat      # Setup scripts
├── package.json              # Node dependencies
└── vite.config.ts            # Vite configuration
```

**Full structure:** See [PROJECT_TREE.txt](PROJECT_TREE.txt) | **Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md)

## 🔧 Configuration

### Focus Settings

Customize your Pomodoro timers in the Settings tab:
- Work duration (default: 25 minutes)
- Short break (default: 5 minutes)
- Long break (default: 15 minutes)
- Sessions before long break (default: 4)
- Auto-start options
- Notification preferences

### Database

MindfulDesk uses SQLite for local storage:
- Location: `~/.local/share/com.mindfuldesk.app/mindfuldesk.db` (Linux)
- Location: `~/Library/Application Support/com.mindfuldesk.app/mindfuldesk.db` (macOS)
- Location: `%APPDATA%\com.mindfuldesk.app\mindfuldesk.db` (Windows)

## 📦 Building for Production

### Windows
```bash
npm run tauri:build
# Output: src-tauri/target/release/bundle/msi/
```

### macOS
```bash
npm run tauri:build
# Output: src-tauri/target/release/bundle/dmg/
```

### Linux
```bash
npm run tauri:build
# Output: src-tauri/target/release/bundle/deb/ or .appimage
```

## 🌟 Roadmap

### v0.2.0 (Planned)
- [ ] Distraction blocking implementation
- [ ] Website/app monitoring
- [ ] Focus mode with whitelist

### v0.3.0 (Planned)
- [ ] Cloud sync (OneDrive/Google Drive)
- [ ] Data backup automation
- [ ] Cross-device sync

### v1.0.0 (Future)
- [ ] AI-powered mood insights
- [ ] Smart break suggestions
- [ ] Calendar integration
- [ ] Microsoft Store / App Store release

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI components inspired by modern design principles
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Chart.js](https://www.chartjs.org/)

## 💰 Microsoft Store Publishing

### Setup Checklist
- [ ] Reserve "MindfulDesk" name ($19 Microsoft Partner Center account)
- [ ] Generate MSIX package: `npm run tauri:build -- --target x64-pc-windows-msvc`
- [ ] Create Privacy Policy (can host on GitHub Pages)
- [ ] Prepare screenshots (1440x900, minimum 3, recommended 8)
- [ ] Set pricing: Free core features, $4.99 for premium
- [ ] Submit for certification

### Requirements
- Valid code signing certificate
- Privacy policy URL
- App screenshots and description
- Age rating questionnaire
- Contact information

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@mindfuldesk.app (example)

---

**Made with ❤️ for mindful productivity**
