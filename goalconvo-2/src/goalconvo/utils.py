"""
Utility functions for GoalConvo framework.
"""

import json
import os
import uuid
import hashlib
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

def generate_dialogue_id() -> str:
    """Generate a unique dialogue ID."""
    return str(uuid.uuid4())

def generate_goal_hash(goal: str) -> str:
    """Generate a hash for a goal string."""
    return hashlib.md5(goal.encode()).hexdigest()[:8]

def ensure_dir(path: str) -> None:
    """Ensure directory exists, create if it doesn't."""
    os.makedirs(path, exist_ok=True)

def load_json(file_path: str) -> Dict[str, Any]:
    """Load JSON data from file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {file_path}: {e}")
        return {}

def save_json(data: Dict[str, Any], file_path: str) -> None:
    """Save data as JSON to file."""
    ensure_dir(os.path.dirname(file_path))
    
    # Custom JSON encoder to handle datetime objects
    class DateTimeEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            return super().default(obj)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False, cls=DateTimeEncoder)

def format_conversation_history(turns: List[Dict[str, str]]) -> str:
    """Format conversation turns into a readable string."""
    history = []
    for turn in turns:
        role = turn.get("role", "Unknown")
        text = turn.get("text", "")
        history.append(f"{role}: {text}")
    return "\n".join(history)

def extract_domain_from_goal(goal: str) -> str:
    """Extract domain from goal text using keyword matching."""
    goal_lower = goal.lower()
    
    domain_keywords = {
        "hotel": ["hotel", "accommodation", "room", "booking", "reservation"],
        "restaurant": ["restaurant", "food", "dining", "meal", "cuisine", "eat"],
        "taxi": ["taxi", "cab", "ride", "transport", "pickup"],
        "train": ["train", "railway", "station", "ticket", "journey"],
        "attraction": ["attraction", "sightseeing", "museum", "tour", "visit", "place"]
    }
    
    for domain, keywords in domain_keywords.items():
        if any(keyword in goal_lower for keyword in keywords):
            return domain
    
    return "unknown"

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate simple text similarity using Jaccard similarity."""
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    if not words1 and not words2:
        return 1.0
    if not words1 or not words2:
        return 0.0
    
    intersection = len(words1.intersection(words2))
    union = len(words1.union(words2))
    
    return intersection / union if union > 0 else 0.0

def detect_repeated_utterances(turns: List[Dict[str, str]], threshold: float = 0.7) -> bool:
    """Detect if there are repeated utterances in the conversation."""
    if len(turns) < 2:
        return False
    
    for i in range(1, len(turns)):
        current_text = turns[i].get("text", "")
        previous_text = turns[i-1].get("text", "")
        
        if calculate_similarity(current_text, previous_text) > threshold:
            return True
    
    return False

def validate_dialogue_format(dialogue: Dict[str, Any]) -> bool:
    """Validate that dialogue has the required format."""
    required_fields = ["dialogue_id", "goal", "domain", "turns"]
    
    for field in required_fields:
        if field not in dialogue:
            logger.error(f"Missing required field: {field}")
            return False
    
    if not isinstance(dialogue["turns"], list):
        logger.error("Turns must be a list")
        return False
    
    for i, turn in enumerate(dialogue["turns"]):
        if not isinstance(turn, dict):
            logger.error(f"Turn {i} must be a dictionary")
            return False
        
        if "role" not in turn or "text" not in turn:
            logger.error(f"Turn {i} missing role or text")
            return False
        
        if turn["role"] not in ["User", "SupportBot"]:
            logger.error(f"Turn {i} has invalid role: {turn['role']}")
            return False
    
    return True

def create_metadata(
    dialogue_id: str,
    goal: str,
    domain: str,
    quality_score: Optional[float] = None,
    generation_time: Optional[float] = None,
    model_version: str = "mistral-7b"
) -> Dict[str, Any]:
    """Create metadata dictionary for a dialogue."""
    return {
        "dialogue_id": dialogue_id,
        "goal": goal,
        "domain": domain,
        "quality_score": quality_score,
        "generation_time": generation_time,
        "model_version": model_version,
        "created_at": datetime.now().isoformat(),
        "num_turns": 0  # Will be updated when turns are added
    }

def update_metadata_turns(metadata: Dict[str, Any], num_turns: int) -> Dict[str, Any]:
    """Update metadata with turn count."""
    metadata["num_turns"] = num_turns
    return metadata

def get_timestamp() -> str:
    """Get current timestamp as ISO string."""
    return datetime.now().isoformat()

def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to maximum length."""
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def clean_text(text: str) -> str:
    """Clean text by removing extra whitespace and normalizing."""
    return " ".join(text.split())

def is_profane(text: str, profanity_list: Optional[List[str]] = None) -> bool:
    """Check if text contains profanity."""
    if profanity_list is None:
        # Basic profanity list - in production, use a proper library
        profanity_list = ["damn", "hell", "crap", "stupid", "idiot"]
    
    text_lower = text.lower()
    return any(word in text_lower for word in profanity_list)
