#!/usr/bin/env python3
"""
GoalConvo Demo Script

This script demonstrates the basic usage of GoalConvo framework.
"""

import sys
import os
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def main():
    print("🎯 GoalConvo Framework Demo")
    print("=" * 40)
    
    # Check if .env exists
    if not Path(".env").exists():
        print("❌ .env file not found")
        print("   Please copy .env.example to .env and set your API keys")
        return 1
    
    # Load environment variables manually
    env_vars = {}
    try:
        with open(".env", "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    env_vars[key] = value
                    os.environ[key] = value
    except FileNotFoundError:
        print("❌ .env file not found")
        return 1
    
    # Check if API key is set
    api_key = env_vars.get("MISTRAL_API_KEY", "")
    if not api_key or api_key == "your_mistral_api_key_here":
        print("❌ API key not set in .env file")
        print("   Please edit .env and set your MISTRAL_API_KEY")
        return 1
    
    print("✅ Environment configured")
    print(f"   API Key: {'*' * 20}...{api_key[-4:]}")
    
    # Import minimal modules
    try:
        from src.goalconvo.config_minimal import Config
        from src.goalconvo.llm_client_minimal import LLMClient
        from src.goalconvo.utils import generate_dialogue_id, save_json
        
        print("✅ Minimal modules imported successfully")
        
        # Initialize components
        config = Config()
        llm_client = LLMClient(config)
        
        print("✅ Components initialized")
        
        # Test API connection
        print("🔗 Testing API connection...")
        if llm_client.test_connection():
            print("✅ API connection successful")
        else:
            print("❌ API connection failed")
            print("   Please check your API key and network connection")
            return 1
        
        # Generate a simple dialogue
        print("🎭 Generating sample dialogue...")
        
        # Create a simple dialogue
        dialogue = {
            "dialogue_id": generate_dialogue_id(),
            "goal": "Book a hotel room for tonight",
            "domain": "hotel",
            "turns": [
                {"role": "User", "text": "Hi, I need to book a hotel room for tonight"},
                {"role": "SupportBot", "text": "I'd be happy to help you book a hotel room. What's your preferred location?"},
                {"role": "User", "text": "Something in the city center"},
                {"role": "SupportBot", "text": "Great! I have several options in the city center. What's your budget range?"},
                {"role": "User", "text": "Around $150 per night"},
                {"role": "SupportBot", "text": "Perfect! I found a great hotel for $145 per night. Would you like me to book it?"},
                {"role": "User", "text": "Yes, that sounds perfect! Thank you."}
            ],
            "metadata": {
                "generated_at": "2024-01-01T00:00:00",
                "model_version": "mistral-7b",
                "quality_score": 0.9
            }
        }
        
        # Save dialogue
        os.makedirs("data/synthetic/hotel", exist_ok=True)
        save_json(dialogue, f"data/synthetic/hotel/{dialogue['dialogue_id']}.json")
        
        print("✅ Sample dialogue generated and saved")
        print(f"   Dialogue ID: {dialogue['dialogue_id']}")
        print(f"   Goal: {dialogue['goal']}")
        print(f"   Turns: {len(dialogue['turns'])}")
        
        # Show dialogue
        print("\n📝 Generated Dialogue:")
        print("-" * 40)
        for turn in dialogue["turns"]:
            print(f"{turn['role']}: {turn['text']}")
        
        print("\n🎉 GoalConvo demo completed successfully!")
        print("\nNext steps:")
        print("1. Run: python3 scripts/download_multiwoz.py")
        print("2. Run: python3 scripts/generate_dialogues.py --num-dialogues 100")
        print("3. Run: python3 scripts/evaluate.py")
        
        return 0
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("   Please run: python3 minimal_setup.py")
        return 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
