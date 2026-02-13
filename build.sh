#!/bin/bash
# MindfulDesk Quick Build Script
# Builds the app and opens the installer location

set -e

echo "================================"
echo "  MindfulDesk Build Script"
echo "================================"
echo ""

# Check for required tools
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ ERROR: $1 is not installed!"
        echo "Please install $1 and try again."
        exit 1
    else
        echo "✅ $1 found"
    fi
}

echo "Checking prerequisites..."
check_command node
check_command cargo
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building frontend..."
npm run build

echo ""
echo "🚀 Building Tauri app (this may take 5-15 minutes on first build)..."
npm run tauri:build

echo ""
echo "================================"
echo "  ✅ Build completed!"
echo "================================"
echo ""
echo "Installers can be found at:"
echo "  src-tauri/target/release/bundle/"
echo ""
