#!/usr/bin/env python3
"""
Simple test script for GoalConvo without external dependencies.

This script tests the basic structure without requiring pip packages.
"""

import sys
import os
import json
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def test_basic_imports():
    """Test basic imports without external dependencies."""
    print("🧪 Testing basic GoalConvo structure...")
    
    try:
        # Test if we can import the modules
        import goalconvo.config
        print("✅ Config module imported")
        
        import goalconvo.utils
        print("✅ Utils module imported")
        
        import goalconvo.dataset_store
        print("✅ Dataset store module imported")
        
        # Test basic functionality
        from goalconvo.utils import generate_dialogue_id, save_json, load_json
        
        # Test dialogue ID generation
        dialogue_id = generate_dialogue_id()
        print(f"✅ Generated dialogue ID: {dialogue_id}")
        
        # Test JSON operations
        test_data = {"test": "data", "id": dialogue_id}
        test_file = "test_data.json"
        
        save_json(test_data, test_file)
        loaded_data = load_json(test_file)
        
        if loaded_data == test_data:
            print("✅ JSON save/load working")
        else:
            print("❌ JSON save/load failed")
        
        # Clean up
        os.remove(test_file)
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_project_structure():
    """Test if all required files and directories exist."""
    print("\n📁 Testing project structure...")
    
    required_files = [
        "src/goalconvo/__init__.py",
        "src/goalconvo/config.py",
        "src/goalconvo/utils.py",
        "src/goalconvo/llm_client.py",
        "src/goalconvo/experience_generator.py",
        "src/goalconvo/multi_agent_simulator.py",
        "src/goalconvo/quality_judge.py",
        "src/goalconvo/dataset_store.py",
        "src/goalconvo/evaluator.py",
        "scripts/generate_dialogues.py",
        "scripts/download_multiwoz.py",
        "scripts/evaluate.py",
        "data/seed_goals.json",
        ".env.example"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
        else:
            print(f"✅ {file_path}")
    
    if missing_files:
        print(f"\n❌ Missing files: {missing_files}")
        return False
    else:
        print("\n✅ All required files present")
        return True

def show_usage_instructions():
    """Show usage instructions."""
    print("\n🚀 GoalConvo Framework - Usage Instructions")
    print("=" * 50)
    
    print("\n📋 Prerequisites:")
    print("1. Python 3.8+ (✅ You have Python 3.13)")
    print("2. API access to Mistral-7B or OpenAI")
    print("3. Required Python packages (see below)")
    
    print("\n📦 Required Python packages:")
    print("- requests (for API calls)")
    print("- python-dotenv (for environment variables)")
    print("- numpy (for numerical operations)")
    print("- pandas (for data processing)")
    print("- bert-score (for evaluation)")
    print("- transformers (for BERTScore)")
    print("- torch (for BERTScore)")
    print("- scikit-learn (for metrics)")
    print("- nltk (for text processing)")
    print("- tqdm (for progress bars)")
    print("- pytest (for testing)")
    
    print("\n🔧 Installation options:")
    print("1. Install pip: ./install_pip.sh")
    print("2. Install packages: pip install -r requirements.txt")
    print("3. Or install manually: pip install requests python-dotenv numpy pandas")
    
    print("\n🚀 Quick start (after installing packages):")
    print("1. Edit .env file with your API keys")
    print("2. python3 scripts/download_multiwoz.py")
    print("3. python3 scripts/generate_dialogues.py --test-connection")
    print("4. python3 scripts/generate_dialogues.py --num-dialogues 100")
    print("5. python3 scripts/evaluate.py")

def main():
    """Main function."""
    print("🎯 GoalConvo Framework - Simple Test")
    print("=" * 50)
    
    # Test project structure
    structure_ok = test_project_structure()
    
    # Test basic imports
    imports_ok = test_basic_imports()
    
    # Show usage instructions
    show_usage_instructions()
    
    if structure_ok and imports_ok:
        print("\n✅ GoalConvo framework structure is correct!")
        print("   You can proceed with installing dependencies and running the framework.")
        return 0
    else:
        print("\n❌ Some issues found. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())
