#!/bin/bash
# Quick setup script for GoalConvo-2 with virtual environment

set -e

cd "$(dirname "$0")"

echo "🚀 GoalConvo-2 Quick Setup"
echo "=========================="
echo ""

# Check if python3-venv is available
if ! python3 -m venv --help > /dev/null 2>&1; then
    echo "❌ Error: python3-venv is not installed"
    echo ""
    echo "Please install it first:"
    echo "  sudo apt install python3-venv"
    echo ""
    echo "Or for Python 3.13:"
    echo "  sudo apt install python3.13-venv"
    exit 1
fi

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate venv
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
python -m pip install --upgrade pip --quiet

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Create directories
echo "📁 Creating directories..."
mkdir -p data/{multiwoz,synthetic,few_shot_hub,results}
mkdir -p logs

echo ""
echo "✅ Setup complete!"
echo ""
echo "To use GoalConvo:"
echo "  1. Activate venv: source venv/bin/activate"
echo "  2. Start backend: ./start_backend.sh"
echo ""
echo "Or just run: ./start_backend.sh (it will auto-activate venv)"

