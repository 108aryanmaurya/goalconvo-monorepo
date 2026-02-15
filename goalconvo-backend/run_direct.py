#!/usr/bin/env python3
"""
Direct runner for GoalConvo without pip installation.

This script allows you to run GoalConvo directly without installing it as a package.
"""

import sys
import os
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Set up environment variables
os.environ.setdefault('PYTHONPATH', str(Path(__file__).parent / "src"))

def main():
    """Main entry point for direct execution."""
    print("🎯 GoalConvo Framework - Direct Runner")
    print("=" * 50)
    
    # Check if we can import the modules
    try:
        from goalconvo.config import Config
        print("✅ GoalConvo modules imported successfully")
        
        # Initialize config
        config = Config()
        print(f"✅ Configuration loaded")
        print(f"   - Domains: {config.domains}")
        print(f"   - Data directory: {config.data_dir}")
        
        # Check if .env exists
        env_file = Path(".env")
        if env_file.exists():
            print("✅ Environment file found")
        else:
            print("❌ Environment file not found")
            print("   Please copy .env.example to .env and set your API keys")
            return 1
        
        print("\n🚀 Ready to run GoalConvo!")
        print("\nAvailable commands:")
        print("1. Download MultiWOZ: python3 scripts/download_multiwoz.py")
        print("2. Test connection: python3 scripts/generate_dialogues.py --test-connection")
        print("3. Generate dialogues: python3 scripts/generate_dialogues.py --num-dialogues 100")
        print("4. Evaluate results: python3 scripts/evaluate.py")
        
        return 0
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("   Make sure you're in the goalconvo-2 directory")
        return 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
