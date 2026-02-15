#!/usr/bin/env python3
"""
Quick Start Script for GoalConvo Framework

This script demonstrates the basic usage of the GoalConvo framework
with a simple example that doesn't require API keys.
"""

import sys
import json
from pathlib import Path

# Add src to path for imports
sys.path.append(str(Path(__file__).parent / "src"))

from goalconvo.config import Config
from goalconvo.utils import save_json, load_json

def main():
    """Run a quick demonstration of GoalConvo capabilities."""
    print("🎯 GoalConvo Framework - Quick Start Demo")
    print("=" * 50)
    
    # Initialize configuration
    print("📋 Initializing configuration...")
    config = Config()
    print(f"✅ Configuration loaded")
    print(f"   - Domains: {config.domains}")
    print(f"   - Max turns: {config.max_turns}")
    print(f"   - Temperature: {config.temperature}")
    
    # Check if seed goals exist
    print("\n📚 Checking seed goals...")
    seed_goals_path = Path(config.data_dir) / "seed_goals.json"
    
    if seed_goals_path.exists():
        seed_goals = load_json(str(seed_goals_path))
        print(f"✅ Found seed goals for {len(seed_goals)} domains")
        
        for domain, goals in seed_goals.items():
            print(f"   - {domain}: {len(goals)} goals")
            if goals:
                print(f"     Example: '{goals[0]}'")
    else:
        print("❌ Seed goals not found. Please run setup first.")
        return 1
    
    # Check API configuration
    print("\n🔑 Checking API configuration...")
    try:
        api_config = config.get_api_config()
        print(f"✅ API configuration found")
        print(f"   - Provider: {api_config['provider']}")
        print(f"   - Model: {api_config['model']}")
        print(f"   - API Base: {api_config['api_base']}")
        
        # Check if API key is set
        if api_config['api_key']:
            print(f"   - API Key: {'*' * 20}...{api_config['api_key'][-4:]}")
        else:
            print("   - ⚠️  API Key not set")
            
    except ValueError as e:
        print(f"❌ API configuration error: {e}")
        print("   Please set your API keys in .env file")
        return 1
    
    # Check data directories
    print("\n📁 Checking data directories...")
    data_dir = Path(config.data_dir)
    synthetic_dir = Path(config.synthetic_dir)
    multiwoz_dir = Path(config.multiwoz_dir)
    
    directories = [
        ("Data directory", data_dir),
        ("Synthetic directory", synthetic_dir),
        ("MultiWOZ directory", multiwoz_dir)
    ]
    
    for name, path in directories:
        if path.exists():
            print(f"✅ {name}: {path}")
        else:
            print(f"❌ {name}: {path} (not found)")
    
    # Show example usage
    print("\n🚀 Example Usage Commands:")
    print("=" * 30)
    
    print("\n1. Download MultiWOZ dataset:")
    print("   python scripts/download_multiwoz.py")
    
    print("\n2. Test API connection:")
    print("   python scripts/generate_dialogues.py --test-connection")
    
    print("\n3. Generate small batch (100 dialogues):")
    print("   python scripts/generate_dialogues.py --num-dialogues 100")
    
    print("\n4. Generate for specific domain:")
    print("   python scripts/generate_dialogues.py --num-dialogues 50 --domains hotel")
    
    print("\n5. Evaluate results:")
    print("   python scripts/evaluate.py")
    
    print("\n6. Estimate costs:")
    print("   python scripts/generate_dialogues.py --estimate-cost --num-dialogues 1000")
    
    # Show configuration summary
    print("\n⚙️  Current Configuration:")
    print("=" * 30)
    print(f"Max Dialogues: {config.max_dialogues}")
    print(f"Batch Size: {config.batch_size}")
    print(f"Temperature: {config.temperature}")
    print(f"Top-p: {config.top_p}")
    print(f"Max Turns: {config.max_turns}")
    print(f"Quality Threshold: {config.quality_threshold}")
    print(f"Discard Rate: {config.discard_rate}")
    
    print("\n🎉 Quick start demo complete!")
    print("\nNext steps:")
    print("1. Set your API keys in .env file")
    print("2. Run: python scripts/download_multiwoz.py")
    print("3. Run: python scripts/generate_dialogues.py --test-connection")
    print("4. Run: python scripts/generate_dialogues.py --num-dialogues 100")
    
    return 0

if __name__ == "__main__":
    exit(main())
