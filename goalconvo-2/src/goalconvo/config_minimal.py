
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
