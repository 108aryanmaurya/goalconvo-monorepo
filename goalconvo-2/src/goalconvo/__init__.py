"""
GoalConvo: A framework for generating goal-oriented dialogue data via multi-agent simulation.

This package provides tools for:
- Multi-agent dialogue simulation using Mistral-7B
- Few-shot experience generation with dynamic hub
- Quality filtering and evaluation
- Comprehensive metrics computation
"""

__version__ = "0.1.0"
__author__ = "GoalConvo Team"

from .llm_client import LLMClient
from .config import Config
from .experience_generator import ExperienceGenerator
from .multi_agent_simulator import DialogueSimulator
from .quality_judge import QualityJudge
from .dataset_store import DatasetStore
from .evaluator import Evaluator

__all__ = [
    "LLMClient",
    "Config", 
    "ExperienceGenerator",
    "DialogueSimulator",
    "QualityJudge",
    "DatasetStore",
    "Evaluator"
]
