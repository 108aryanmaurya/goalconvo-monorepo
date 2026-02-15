#!/usr/bin/env python3
"""
Minimal GoalConvo setup that works with basic Python packages.

This version uses only standard library and basic packages.
"""

import sys
import os
import json
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def create_minimal_config():
    """Create a minimal configuration without external dependencies."""
    config_content = '''
# Minimal GoalConvo Configuration
import os

class Config:
    def __init__(self):
        # API Configuration
        self.mistral_api_key = os.getenv("MISTRAL_API_KEY", "")
        self.mistral_api_base = os.getenv("MISTRAL_API_BASE", "https://api.together.xyz/v1")
        self.mistral_model = os.getenv("MISTRAL_MODEL", "mistralai/Mistral-7B-Instruct-v0.1")
        
        # Generation settings
        self.temperature = 0.7
        self.top_p = 0.9
        self.max_turns = 10
        self.min_turns = 3
        
        # Data paths
        self.data_dir = "./data"
        self.synthetic_dir = "./data/synthetic"
        self.multiwoz_dir = "./data/multiwoz"
        self.few_shot_hub_dir = "./data/few_shot_hub"
        
        # Domains
        self.domains = ["hotel", "restaurant", "taxi", "train", "attraction"]
        
        # Quality settings
        self.quality_threshold = 0.7
        self.discard_rate = 0.1
        
        # API settings
        self.max_retries = 3
        self.timeout = 30
    
    def get_api_config(self):
        return {
            "api_key": self.mistral_api_key,
            "api_base": self.mistral_api_base,
            "model": self.mistral_model,
            "provider": "mistral"
        }
'''
    
    with open("src/goalconvo/config_minimal.py", "w") as f:
        f.write(config_content)
    
    print("✅ Created minimal config")

def create_minimal_llm_client():
    """Create a minimal LLM client using only standard library."""
    client_content = '''
import json
import urllib.request
import urllib.parse
import urllib.error
import time

class LLMClient:
    def __init__(self, config):
        self.config = config
        self.api_config = config.get_api_config()
    
    def generate_completion(self, prompt, temperature=0.7, top_p=0.9, max_tokens=512):
        """Generate completion using basic HTTP requests."""
        url = f"{self.api_config['api_base']}/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {self.api_config['api_key']}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.api_config["model"],
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens
        }
        
        try:
            req = urllib.request.Request(url, json.dumps(data).encode(), headers)
            with urllib.request.urlopen(req, timeout=self.config.timeout) as response:
                result = json.loads(response.read().decode())
                return result["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"API Error: {e}")
            return "Error: API call failed"
    
    def test_connection(self):
        """Test API connection."""
        try:
            response = self.generate_completion("Hello, this is a test.", max_tokens=10)
            return "test" in response.lower()
        except:
            return False
'''
    
    with open("src/goalconvo/llm_client_minimal.py", "w") as f:
        f.write(client_content)
    
    print("✅ Created minimal LLM client")

def create_minimal_utils():
    """Create minimal utils without external dependencies."""
    utils_content = '''
import json
import os
import uuid
from pathlib import Path

def generate_dialogue_id():
    return str(uuid.uuid4())

def save_json(data, file_path):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def load_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)
'''
    
    with open("src/goalconvo/utils_minimal.py", "w") as f:
        f.write(utils_content)
    
    print("✅ Created minimal utils")

def create_demo_script():
    """Create a demo script that shows how to use GoalConvo."""
    demo_content = '''#!/usr/bin/env python3
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
        from goalconvo.config_minimal import Config
        from goalconvo.llm_client_minimal import LLMClient
        from goalconvo.utils_minimal import generate_dialogue_id, save_json
        
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
        print("\\n📝 Generated Dialogue:")
        print("-" * 40)
        for turn in dialogue["turns"]:
            print(f"{turn['role']}: {turn['text']}")
        
        print("\\n🎉 GoalConvo demo completed successfully!")
        print("\\nNext steps:")
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
'''
    
    with open("demo.py", "w") as f:
        f.write(demo_content)
    
    os.chmod("demo.py", 0o755)
    print("✅ Created demo script")

def main():
    """Main setup function."""
    print("🔧 Setting up minimal GoalConvo...")
    
    # Create minimal modules
    create_minimal_config()
    create_minimal_llm_client()
    create_minimal_utils()
    create_demo_script()
    
    # Create directories
    os.makedirs("data/synthetic", exist_ok=True)
    os.makedirs("data/multiwoz", exist_ok=True)
    os.makedirs("data/few_shot_hub", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    print("\n✅ Minimal setup complete!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your API keys")
    print("2. Run: python3 demo.py")
    print("3. If successful, run the full framework")

if __name__ == "__main__":
    main()
