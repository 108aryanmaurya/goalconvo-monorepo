"""
Configuration module for GoalConvo framework.

Contains all hyperparameters and settings from the research paper.
"""

import os
from dataclasses import dataclass, field
from typing import List, Dict, Any
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class Config:
    """Configuration class containing all hyperparameters and settings."""
    
    # API Configuration
    mistral_api_key: str = os.getenv("MISTRAL_API_KEY", "")
    mistral_api_base: str = os.getenv("MISTRAL_API_BASE", "https://api.together.xyz/v1")
    mistral_model: str = os.getenv("MISTRAL_MODEL", "mistralai/Mistral-7B-Instruct-v0.1")
    
    # Alternative API providers
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_api_base: str = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    # Google Gemini API configuration
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "AIzaSyDt84I_5N921Rcp82uoIXjqJUW6rtd6Ca8")
    gemini_api_base: str = os.getenv("GEMINI_API_BASE", "https://generativelanguage.googleapis.com/v1beta")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-pro")
    
    # Ollama (local) configuration
    ollama_enabled: bool = os.getenv("OLLAMA_ENABLED", "false").lower() == "true"
    ollama_api_base: str = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "mistral")
    # Keep local models responsive by default; can be increased via env
    ollama_timeout: int = int(os.getenv("OLLAMA_TIMEOUT", "240"))  # 60 seconds for local models (phi2:mini can be slow)
    
    # Generation hyperparameters (from paper)
    temperature: float = float(os.getenv("TEMPERATURE", "0.7"))
    top_p: float = float(os.getenv("TOP_P", "0.9"))
    # Use smaller defaults for faster responses; can be overridden via env
    max_tokens: int = int(os.getenv("MAX_TOKENS", "100"))
    max_turns: int = int(os.getenv("MAX_TURNS", "15"))  # Maximum turns per dialogue
    min_turns: int = int(os.getenv("MIN_TURNS", "7"))  # Minimum turns per dialogue (enforced)
    
    # Few-shot settings
    few_shot_examples: int = int(os.getenv("FEW_SHOT_EXAMPLES", "1"))
    
    # Quality filtering
    quality_threshold: float = float(os.getenv("QUALITY_THRESHOLD", "0.7"))
    discard_rate: float = float(os.getenv("DISCARD_RATE", "0.1"))
    
    # Generation settings
    max_dialogues: int = int(os.getenv("MAX_DIALOGUES", "20000"))
    batch_size: int = int(os.getenv("BATCH_SIZE", "10"))
    
    # Data paths - will be set in __post_init__ to use absolute paths
    data_dir: str = field(default="")
    synthetic_dir: str = field(default="")
    multiwoz_dir: str = field(default="")
    few_shot_hub_dir: str = field(default="")
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    log_file: str = os.getenv("LOG_FILE", "./logs/goalconvo.log")
    
    # Domains (from MultiWOZ)
    domains: List[str] = field(default_factory=lambda: ["hotel",
    #  "restaurant", "taxi", "train", "attraction"
     ])
    
    # API retry settings
    max_retries: int = 3
    retry_delay: float = 1.0
    # Overall API timeout (seconds) for upstream LLM calls
    timeout: int = int(os.getenv("API_TIMEOUT", "60"))
    
    # Evaluation settings
    bertscore_model: str = "microsoft/deberta-xlarge-mnli"
    diversity_metrics: List[str] = field(default_factory=lambda: ["distinct-1", "distinct-2", "self-bleu"])
    
    def __post_init__(self):
        """Validate configuration after initialization and set data paths."""
        # Set data paths relative to goalconvo-2 directory (where config.py is located)
        # Use resolve() to get absolute paths regardless of current working directory
        base_dir = Path(__file__).parent.parent.parent.resolve()  # Go up from src/goalconvo/config.py to goalconvo-2/
        
        if not self.data_dir or self.data_dir == "":
            self.data_dir = os.getenv("DATA_DIR", str(base_dir / "data"))
        if not self.synthetic_dir or self.synthetic_dir == "":
            self.synthetic_dir = os.getenv("SYNTHETIC_DIR", str(base_dir / "data" / "synthetic"))
        if not self.multiwoz_dir or self.multiwoz_dir == "":
            self.multiwoz_dir = os.getenv("MULTIWOZ_DIR", str(base_dir / "data" / "multiwoz"))
        if not self.few_shot_hub_dir or self.few_shot_hub_dir == "":
            self.few_shot_hub_dir = os.getenv("FEW_SHOT_HUB_DIR", str(base_dir / "data" / "few_shot_hub"))
        
        if not self.ollama_enabled and not self.mistral_api_key and not self.openai_api_key:
            raise ValueError("Either OLLAMA_ENABLED=true, MISTRAL_API_KEY, or OPENAI_API_KEY must be set")
        
        if self.temperature < 0 or self.temperature > 2:
            raise ValueError("Temperature must be between 0 and 2")
        
        if self.top_p < 0 or self.top_p > 1:
            raise ValueError("Top-p must be between 0 and 1")
    
    def get_api_config(self) -> Dict[str, Any]:
        """Get API configuration for the selected provider.
        
        Priority order:
        1. Gemini (if API key available) - fastest and most reliable
        2. Ollama (if enabled) - local model
        3. Mistral (if API key available)
        4. OpenAI (if API key available)
        """
        # Priority 1: Gemini (if API key is available)
        if self.gemini_api_key:
            return {
                "api_key": self.gemini_api_key,
                "api_base": self.gemini_api_base,
                "model": self.gemini_model,
                "provider": "gemini"
            }
        # Priority 2: Ollama (local, if enabled)
        elif self.ollama_enabled:
            return {
                "api_key": "",  # Ollama doesn't require API key
                "api_base": self.ollama_api_base,
                "model": self.ollama_model,
                "provider": "ollama"
            }
        # Priority 3: Mistral
        elif self.mistral_api_key:
            return {
                "api_key": self.mistral_api_key,
                "api_base": self.mistral_api_base,
                "model": self.mistral_model,
                "provider": "mistral"
            }
        # Priority 4: OpenAI
        elif self.openai_api_key:
            return {
                "api_key": self.openai_api_key,
                "api_base": self.openai_api_base,
                "model": self.openai_model,
                "provider": "openai"
            }
        else:
            raise ValueError("No valid API configuration found. Please set GEMINI_API_KEY, OLLAMA_ENABLED=true, MISTRAL_API_KEY, or OPENAI_API_KEY")
    
    def get_generation_params(self) -> Dict[str, Any]:
        """Get parameters for text generation."""
        return {
            "temperature": self.temperature,
            "top_p": self.top_p,
            "max_tokens": self.max_tokens,
            "max_turns": self.max_turns,
            "min_turns": self.min_turns
        }
    
    def get_quality_params(self) -> Dict[str, Any]:
        """Get parameters for quality filtering."""
        return {
            "threshold": self.quality_threshold,
            "discard_rate": self.discard_rate,
            "min_turns": self.min_turns,
            "max_turns": self.max_turns
        }
