#!/usr/bin/env python3
"""
Quick test script to verify Ollama/Mistral integration.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from goalconvo.config import Config
from goalconvo.llm_client import LLMClient

def main():
    print("🧪 Testing Ollama/Mistral Integration")
    print("=" * 50)
    
    # Load config
    try:
        config = Config()
        print(f"✅ Configuration loaded")
        print(f"   Provider: {config.get_api_config()['provider']}")
        print(f"   Model: {config.get_api_config()['model']}")
        print(f"   API Base: {config.get_api_config()['api_base']}")
    except Exception as e:
        print(f"❌ Config error: {e}")
        return 1
    
    # Test connection
    print("\n🔗 Testing connection...")
    try:
        llm_client = LLMClient(config)
        if llm_client.test_connection():
            print("✅ Connection test passed!")
        else:
            print("❌ Connection test failed")
            return 1
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return 1
    
    # Test simple generation
    print("\n💬 Testing simple generation...")
    try:
        test_prompt = "Say 'Hello, GoalConvo!' in one sentence."
        print(f"   Prompt: {test_prompt}")
        response = llm_client.generate_completion(test_prompt, max_tokens=50)
        print(f"   Response: {response}")
        print("✅ Generation test passed!")
    except Exception as e:
        print(f"❌ Generation error: {e}")
        return 1
    
    print("\n🎉 All tests passed! Ollama/Mistral is working correctly.")
    return 0

if __name__ == "__main__":
    exit(main())


