#!/bin/bash

# Setup GoalConvo with virtual environment

set -e

echo "🚀 Setting up GoalConvo Framework with Virtual Environment..."

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Error: Python 3.8 or higher is required. Found: $python_version"
    exit 1
fi
echo "✅ Python version OK: $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "📦 Installing requirements..."
pip install -r requirements.txt

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

# Test installation
echo "🧪 Testing installation..."
python -c "from goalconvo import Config; print('✅ GoalConvo package imported successfully')"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 To use GoalConvo:"
echo "1. Activate virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "2. Edit .env file with your API keys:"
echo "   nano .env"
echo ""
echo "3. Download MultiWOZ dataset:"
echo "   python scripts/download_multiwoz.py"
echo ""
echo "4. Test connection:"
echo "   python scripts/generate_dialogues.py --test-connection"
echo ""
echo "5. Generate dialogues:"
echo "   python scripts/generate_dialogues.py --num-dialogues 100"
echo ""
echo "6. Evaluate results:"
echo "   python scripts/evaluate.py"
echo ""
echo "📖 For detailed usage, see USAGE.md"
