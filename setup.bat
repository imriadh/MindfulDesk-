@echo off
REM MindfulDesk Setup Script for Windows
REM This script checks prerequisites and sets up the development environment

echo 🧘 MindfulDesk Setup Script
echo ==========================
echo.

REM Check Node.js
echo 📦 Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node -v
    echo ✅ Node.js is installed
) else (
    echo ❌ Node.js is not installed
    echo Please install Node.js 18 or later from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Rust
echo.
echo 🦀 Checking Rust...
where cargo >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    rustc --version
    echo ✅ Rust is installed
) else (
    echo ❌ Rust is not installed
    echo Please install Rust from https://rustup.rs/
    echo After installation, restart this script.
    pause
    exit /b 1
)

REM Check Visual Studio Build Tools
echo.
echo 🛠️  Checking Visual Studio Build Tools...
where cl >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Visual Studio Build Tools detected
) else (
    echo ⚠️  Visual Studio Build Tools not found in PATH
    echo If compilation fails, install Visual Studio Build Tools:
    echo https://visualstudio.microsoft.com/visual-cpp-build-tools/
)

REM Install npm dependencies
echo.
echo 📦 Installing npm dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install npm dependencies
    pause
    exit /b 1
)
echo ✅ npm dependencies installed

REM Create icons directory
echo.
echo 🎨 Setting up app icons...
if not exist "src-tauri\icons" mkdir src-tauri\icons
echo Note: Placeholder icons created. Replace with actual icons for production.

REM Success
echo.
echo ✅ Setup complete!
echo.
echo 🚀 Next steps:
echo    1. Run 'npm run tauri:dev' to start development
echo    2. Read QUICKSTART.md for usage guide
echo    3. Check DEVELOPMENT.md for architecture details
echo.
echo Happy coding! 🧘‍♀️
echo.
pause
