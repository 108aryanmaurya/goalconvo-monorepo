#!/bin/bash

# Manual setup script for GoalConvo (without pip)

set -e

echo "🚀 Setting up GoalConvo Framework (Manual Mode)..."

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Error: Python 3.8 or higher is required. Found: $python_version"
    exit 1
fi
echo "✅ Python version OK: $python_version"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/{multiwoz,synthetic,few_shot_hub,results}
mkdir -p logs

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys before running the framework"
else
    echo "✅ .env file already exists"
fi

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.py
chmod +x run_direct.py
chmod +x quick_start.py

# Test direct import
echo "🧪 Testing direct import..."
python3 run_direct.py

echo ""
echo "🎉 Manual setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys:"
echo "   nano .env"
echo ""
echo "2. Test the framework:"
echo "   python3 run_direct.py"
echo ""
echo "3. Download MultiWOZ dataset:"
echo "   python3 scripts/download_multiwoz.py"
echo ""
echo "4. Generate dialogues:"
echo "   python3 scripts/generate_dialogues.py --num-dialogues 100"
echo ""
echo "📖 For detailed usage, see USAGE.md"
