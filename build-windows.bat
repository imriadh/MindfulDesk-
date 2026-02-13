@echo off
REM MindfulDesk Build Script for Windows
REM This script builds the MindfulDesk app for Windows

echo ================================
echo   MindfulDesk Build Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if Rust is installed
where cargo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Rust is not installed!
    echo Please install Rust from https://www.rust-lang.org/tools/install
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

echo [OK] Rust found:
cargo --version
echo.

echo Step 1/3: Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Step 2/3: Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build frontend!
    pause
    exit /b 1
)

echo.
echo Step 3/3: Building Tauri app (this may take 5-15 minutes on first build)...
call npm run tauri:build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build Tauri app!
    pause
    exit /b 1
)

echo.
echo ================================
echo   Build completed successfully!
echo ================================
echo.
echo Installers can be found at:
echo   - src-tauri\target\release\bundle\msi\
echo   - src-tauri\target\release\bundle\nsis\
echo.
echo Opening build folder...
explorer src-tauri\target\release\bundle

pause
