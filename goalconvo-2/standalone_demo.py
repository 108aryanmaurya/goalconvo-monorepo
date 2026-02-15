#!/usr/bin/env python3
"""
Standalone GoalConvo Demo - No external dependencies required.

This script demonstrates GoalConvo functionality using only Python standard library.
"""

import json
import os
import uuid
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path
from datetime import datetime

def load_env_file():
    """Load environment variables from .env file."""
    env_vars = {}
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    env_vars[key] = value
                    os.environ[key] = value
    return env_vars

def generate_dialogue_id():
    """Generate a unique dialogue ID."""
    return str(uuid.uuid4())

def save_json(data, file_path):
    """Save data as JSON."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def load_json(file_path):
    """Load JSON data."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def test_api_connection(api_key, api_base, model):
    """Test API connection using basic HTTP requests."""
    url = f"{api_base}/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": [{"role": "user", "content": "Hello, this is a test. Please respond with 'Connection successful.'"}],
        "temperature": 0.1,
        "max_tokens": 20
    }
    
    try:
        req = urllib.request.Request(url, json.dumps(data).encode(), headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode())
            response_text = result["choices"][0]["message"]["content"].strip()
            return "successful" in response_text.lower()
    except Exception as e:
        print(f"API Error: {e}")
        return False

def generate_simple_dialogue(goal, domain):
    """Generate a simple dialogue without API calls."""
    dialogue_id = generate_dialogue_id()
    
    # Create a realistic dialogue based on the goal
    if domain == "hotel":
        turns = [
            {"role": "User", "text": f"Hi, I need to {goal.lower()}"},
            {"role": "SupportBot", "text": "I'd be happy to help you with that. What's your preferred location?"},
            {"role": "User", "text": "Something in the city center would be great"},
            {"role": "SupportBot", "text": "Perfect! I have several options in the city center. What's your budget range?"},
            {"role": "User", "text": "Around $150 per night"},
            {"role": "SupportBot", "text": "Great! I found a wonderful hotel for $145 per night. Would you like me to book it?"},
            {"role": "User", "text": "Yes, that sounds perfect! Thank you so much."}
        ]
    elif domain == "restaurant":
        turns = [
            {"role": "User", "text": f"Hi, I need to {goal.lower()}"},
            {"role": "SupportBot", "text": "I'd be happy to help you find a restaurant. What type of cuisine are you interested in?"},
            {"role": "User", "text": "I'm looking for Italian food"},
            {"role": "SupportBot", "text": "Excellent choice! I have several Italian restaurants. What's your preferred time for dinner?"},
            {"role": "User", "text": "Around 7 PM tonight"},
            {"role": "SupportBot", "text": "Perfect! I found a great Italian restaurant with availability at 7 PM. Shall I make the reservation?"},
            {"role": "User", "text": "Yes, please book it for me. Thank you!"}
        ]
    else:
        turns = [
            {"role": "User", "text": f"Hi, I need to {goal.lower()}"},
            {"role": "SupportBot", "text": "I'd be happy to help you with that. Let me get some details."},
            {"role": "User", "text": "I need it for tomorrow"},
            {"role": "SupportBot", "text": "Perfect! I can arrange that for you. Is there anything specific you need?"},
            {"role": "User", "text": "That sounds great, thank you!"}
        ]
    
    return {
        "dialogue_id": dialogue_id,
        "goal": goal,
        "domain": domain,
        "turns": turns,
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "model_version": "standalone-demo",
            "quality_score": 0.9,
            "num_turns": len(turns)
        }
    }

def main():
    """Main demo function."""
    print("🎯 GoalConvo Framework - Standalone Demo")
    print("=" * 50)
    
    # Load environment variables
    env_vars = load_env_file()
    
    # Check if .env exists
    if not os.path.exists(".env"):
        print("❌ .env file not found")
        print("   Please copy .env.example to .env and set your API keys")
        return 1
    
    # Check API key
    api_key = env_vars.get("MISTRAL_API_KEY", "")
    if not api_key or api_key == "your_mistral_api_key_here":
        print("❌ API key not set in .env file")
        print("   Please edit .env and set your MISTRAL_API_KEY")
        return 1
    
    print("✅ Environment configured")
    print(f"   API Key: {'*' * 20}...{api_key[-4:]}")
    
    # Test API connection
    print("\n🔗 Testing API connection...")
    api_base = env_vars.get("MISTRAL_API_BASE", "https://api.together.xyz/v1")
    model = env_vars.get("MISTRAL_MODEL", "mistralai/Mistral-7B-Instruct-v0.1")
    
    if test_api_connection(api_key, api_base, model):
        print("✅ API connection successful")
    else:
        print("❌ API connection failed")
        print("   Continuing with demo using pre-generated dialogues...")
    
    # Generate sample dialogues
    print("\n🎭 Generating sample dialogues...")
    
    # Create directories
    os.makedirs("data/synthetic/hotel", exist_ok=True)
    os.makedirs("data/synthetic/restaurant", exist_ok=True)
    os.makedirs("data/synthetic/taxi", exist_ok=True)
    
    # Generate dialogues for different domains
    domains_goals = [
        ("hotel", "Book a hotel room for tonight"),
        ("restaurant", "Find a restaurant serving Italian food"),
        ("taxi", "Book a taxi to the airport")
    ]
    
    generated_dialogues = []
    
    for domain, goal in domains_goals:
        dialogue = generate_simple_dialogue(goal, domain)
        generated_dialogues.append(dialogue)
        
        # Save dialogue
        save_json(dialogue, f"data/synthetic/{domain}/{dialogue['dialogue_id']}.json")
        
        print(f"✅ Generated {domain} dialogue: {dialogue['dialogue_id']}")
    
    # Show statistics
    print(f"\n📊 Generated {len(generated_dialogues)} dialogues")
    
    total_turns = sum(len(d["turns"]) for d in generated_dialogues)
    avg_turns = total_turns / len(generated_dialogues)
    
    print(f"   - Total turns: {total_turns}")
    print(f"   - Average turns per dialogue: {avg_turns:.1f}")
    print(f"   - Domains: {', '.join(set(d['domain'] for d in generated_dialogues))}")
    
    # Show sample dialogue
    print("\n📝 Sample Dialogue (Hotel):")
    print("-" * 40)
    sample_dialogue = generated_dialogues[0]
    for turn in sample_dialogue["turns"]:
        print(f"{turn['role']}: {turn['text']}")
    
    # Create evaluation summary
    evaluation_summary = {
        "total_dialogues": len(generated_dialogues),
        "domains": list(set(d["domain"] for d in generated_dialogues)),
        "avg_turns": avg_turns,
        "total_turns": total_turns,
        "generated_at": datetime.now().isoformat(),
        "framework_version": "standalone-demo"
    }
    
    save_json(evaluation_summary, "data/results/demo_evaluation.json")
    
    print("\n🎉 GoalConvo standalone demo completed successfully!")
    print("\n📁 Files created:")
    print("   - data/synthetic/hotel/*.json")
    print("   - data/synthetic/restaurant/*.json") 
    print("   - data/synthetic/taxi/*.json")
    print("   - data/results/demo_evaluation.json")
    
    print("\n🚀 Next steps:")
    print("1. To use the full framework, install dependencies:")
    print("   sudo apt install python3-pip python3-venv")
    print("   ./setup_venv.sh")
    print("2. Or continue with the standalone version for basic testing")
    print("3. Edit .env file with your API keys for real API calls")
    
    return 0

if __name__ == "__main__":
    exit(main())
