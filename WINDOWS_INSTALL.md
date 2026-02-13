# 🪟 Building MindfulDesk for Windows

## Option 1: Download Pre-Built Installer (Recommended)

### Once GitHub Actions Completes:

1. **Go to GitHub Actions**
   - Visit: `https://github.com/imriadh/MindfulDesk-/actions`
   - Look for the latest "Build and Release" or "Nightly Build" workflow run
   - Wait for the build to complete (may take 10-15 minutes)

2. **Download Windows Installer**
   - Click on the completed workflow run
   - Scroll to "Artifacts" section
   - Download `windows-artifacts` or `nightly-windows-xxxxx`
   - Extract the ZIP file

3. **Install**
   - Find the `.msi` or `.exe` file
   - Double-click to install
   - Follow the installation wizard
   - Launch MindfulDesk from Start Menu

---

## Option 2: Build from Source on Windows

### Prerequisites

1. **Install Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Choose "LTS" version
   - Run installer with default settings

2. **Install Rust**
   - Download: https://www.rust-lang.org/tools/install
   - Run `rustup-init.exe`
   - Choose option 1 (default installation)
   - Restart terminal after installation

3. **Install Visual Studio Build Tools**
   - Download: https://visualstudio.microsoft.com/downloads/
   - Install "Desktop development with C++" workload
   - OR install just "MSVC v143 - VS 2022 C++ x64/x86 build tools"

4. **Install WebView2** (Usually pre-installed on Windows 10/11)
   - If needed: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### Build Steps

1. **Clone Repository**
   ```powershell
   git clone https://github.com/imriadh/MindfulDesk-.git
   cd MindfulDesk-
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Build the App**
   ```powershell
   npm run tauri:build
   ```
   
   This will take 5-15 minutes on first build.

4. **Find the Installer**
   - Location: `src-tauri\target\release\bundle\`
   - Installers:
     - `msi\MindfulDesk_0.1.0_x64_en-US.msi` (Windows Installer)
     - `nsis\MindfulDesk_0.1.0_x64-setup.exe` (Setup executable)

5. **Install**
   - Run the `.msi` or `.exe` installer
   - Follow installation prompts
   - App will be installed to `C:\Program Files\MindfulDesk`

### Quick Development Run (No Install)

If you just want to test it without installing:

```powershell
npm run tauri:dev
```

This launches the app in development mode (no installation needed).

---

## Option 3: Manual Release Build

If the automated builds haven't completed yet, you can create a release tag to trigger them:

### Using Git Bash or PowerShell:

```bash
# Create and push a release tag
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

This will trigger the "Build and Release" workflow which creates:
- Windows installers (.msi, .exe)
- macOS installers (.dmg)
- Linux packages (.deb, .AppImage)

Wait 15-20 minutes, then check the Releases page:
- `https://github.com/imriadh/MindfulDesk-/releases`

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10 (version 1809+) or Windows 11
- **RAM**: 4 GB
- **Storage**: 150 MB free space
- **Display**: 1280x720 minimum resolution

### Recommended
- **OS**: Windows 11
- **RAM**: 8 GB
- **Storage**: 500 MB free space
- **Display**: 1920x1080 or higher

---

## Installation Location

By default, MindfulDesk installs to:
- **Program Files**: `C:\Program Files\MindfulDesk\`
- **Data**: `C:\Users\{YourName}\AppData\Local\com.mindfuldesk.app\`
- **Database**: `C:\Users\{YourName}\AppData\Local\com.mindfuldesk.app\mindfuldesk.db`

---

## Troubleshooting

### Build Errors

**"cargo: command not found"**
- Rust not installed or not in PATH
- Restart terminal after installing Rust
- Run: `rustup default stable`

**"MSVC not found"**
- Install Visual Studio Build Tools
- Include "Desktop development with C++" workload

**"WebView2 not found"**
- Install WebView2 Runtime: https://go.microsoft.com/fwlink/p/?LinkId=2124703

**Build takes too long**
- First build can take 10-20 minutes
- Subsequent builds are much faster (~2 minutes)
- Close other applications while building

### Installation Errors

**"Windows protected your PC"**
- Click "More info" → "Run anyway"
- This appears because the app isn't digitally signed yet

**"Another version is already installed"**
- Uninstall old version first:
  - Settings → Apps → MindfulDesk → Uninstall
  - Or use Control Panel

**"Access denied"**
- Run installer as Administrator:
  - Right-click installer → "Run as administrator"

### Runtime Issues

**App won't launch**
- Check Windows Event Viewer for errors
- Ensure WebView2 is installed
- Try reinstalling the app

**Notifications not working**
- Check Windows Settings → Notifications
- Enable notifications for MindfulDesk
- Grant notification permission when prompted

**Database errors**
- Delete database file:
  - `C:\Users\{YourName}\AppData\Local\com.mindfuldesk.app\mindfuldesk.db`
- Restart the app (will create fresh database)

---

## Updating the App

### Automatic Updates (Future)
- Auto-updater will be enabled in future releases
- App will notify when updates are available

### Manual Update
1. Download new installer
2. Run installer (will update existing installation)
3. Your data is preserved during updates

---

## Uninstalling

### Via Settings
1. Open Settings → Apps
2. Find "MindfulDesk"
3. Click Uninstall

### Via Control Panel
1. Open Control Panel → Programs
2. Find "MindfulDesk"
3. Click Uninstall

### Clean Uninstall
To remove all data:
1. Uninstall the app
2. Delete data folder:
   - `C:\Users\{YourName}\AppData\Local\com.mindfuldesk.app\`

---

## Building for Development

### Watch Mode
```powershell
# Terminal 1: Frontend dev server
npm run dev

# Terminal 2: Tauri app (auto-reloads on changes)
npm run tauri:dev
```

### Production Test Build
```powershell
# Build but don't create installer
cd src-tauri
cargo build --release
```

---

## Quick Start After Installation

1. **Launch MindfulDesk** from Start Menu
2. **Grant notification permission** when prompted
3. **Set your preferences**:
   - Go to Settings tab
   - Configure work/break durations
   - Enable health reminders
   - Set up distraction blocker (optional)
4. **Start your first focus session**!
   - Click "Focus" tab
   - Click "Start Focus (25m)"
   - Stay productive! 🎯

---

## Getting Help

- **Documentation**: See [QUICKSTART.md](QUICKSTART.md)
- **Issues**: https://github.com/imriadh/MindfulDesk-/issues
- **Testing Guide**: See [TESTING.md](TESTING.md)

---

## Building for Distribution

If you want to create an installer to share with others:

1. **Code Sign the App** (Optional but recommended)
   - Requires Windows code signing certificate
   - Prevents "Windows protected your PC" warning
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for details

2. **Build Release**
   ```powershell
   npm run tauri:build
   ```

3. **Test Installer**
   - Test on clean Windows VM
   - Verify all features work
   - Check for any missing dependencies

4. **Distribute**
   - Upload to GitHub Releases
   - Share download link
   - Consider Microsoft Store submission

---

## Performance Tips

- **First Launch**: May take a few seconds to initialize database
- **Startup**: Add to Windows Startup if you want it to auto-start
- **Memory**: App uses ~100-150 MB RAM (very light)
- **CPU**: < 1% when idle, minimal impact on battery

---

**Enjoy MindfulDesk! 🧘✨**
