#!/bin/bash

# MindfulDesk Setup Script
# This script installs all prerequisites and sets up the development environment

set -e  # Exit on error

echo "🧘 MindfulDesk Setup Script"
echo "=========================="
echo ""

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
fi

echo "Detected OS: $OS"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18 or later from https://nodejs.org/"
    exit 1
fi

# Check Rust
echo ""
echo "🦀 Checking Rust..."
if command -v cargo &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    echo "✅ Rust is installed: $RUST_VERSION"
else
    echo "❌ Rust is not installed"
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    echo "✅ Rust installed successfully"
fi

# Ensure cargo is in PATH
if [ -f "$HOME/.cargo/env" ]; then
    source "$HOME/.cargo/env"
fi

# Install system dependencies
echo ""
echo "📚 Installing system dependencies..."
if [[ "$OS" == "linux" ]]; then
    echo "Installing Linux dependencies..."
    sudo apt-get update
    # Use libwebkit2gtk-4.1-dev for Ubuntu 24.04+, fallback to 4.0 for older versions
    if apt-cache search libwebkit2gtk-4.1-dev | grep -q libwebkit2gtk-4.1-dev; then
        WEBKIT_PKG="libwebkit2gtk-4.1-dev"
    else
        WEBKIT_PKG="libwebkit2gtk-4.0-dev"
    fi
    sudo apt-get install -y \
        $WEBKIT_PKG \
        build-essential \
        curl \
        wget \
        file \
        libssl-dev \
        libgtk-3-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev
    echo "✅ Linux dependencies installed"
elif [[ "$OS" == "macos" ]]; then
    echo "Checking Xcode Command Line Tools..."
    if xcode-select -p &> /dev/null; then
        echo "✅ Xcode Command Line Tools are installed"
    else
        echo "Installing Xcode Command Line Tools..."
        xcode-select --install
        echo "✅ Xcode Command Line Tools installed"
    fi
fi

# Install npm dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install
echo "✅ npm dependencies installed"

# Create icons if they don't exist
echo ""
echo "🎨 Setting up app icons..."
mkdir -p src-tauri/icons
if [ ! -f "src-tauri/icons/32x32.png" ]; then
    echo "Note: Placeholder icons created. Replace with actual icons for production."
fi

# Success
echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Run 'npm run tauri:dev' to start development"
echo "   2. Read QUICKSTART.md for usage guide"
echo "   3. Check DEVELOPMENT.md for architecture details"
echo ""
echo "Happy coding! 🧘‍♀️"
