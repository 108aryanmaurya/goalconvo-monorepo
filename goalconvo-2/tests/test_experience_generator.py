"""
Tests for Experience Generator module.
"""

import pytest
import unittest.mock as mock
from unittest.mock import patch, MagicMock

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.experience_generator import ExperienceGenerator
from goalconvo.llm_client import LLMClient
from goalconvo.dataset_store import DatasetStore

class TestExperienceGenerator:
    """Test cases for Experience Generator."""
    
    def setup_method(self):
        """Setup test configuration."""
        self.config = Config()
        self.config.data_dir = "./test_data"
        
        # Mock dependencies
        self.mock_llm_client = MagicMock()
        self.mock_dataset_store = MagicMock()
        
        self.generator = ExperienceGenerator(
            self.config, 
            self.mock_llm_client, 
            self.mock_dataset_store
        )
    
    def test_get_random_goal(self):
        """Test getting random goal."""
        # Test with specific domain
        goal = self.generator.get_random_goal("hotel")
        assert isinstance(goal, str)
        assert len(goal) > 0
        
        # Test with no domain
        goal = self.generator.get_random_goal()
        assert isinstance(goal, str)
        assert len(goal) > 0
    
    def test_get_domain_goals(self):
        """Test getting goals for a domain."""
        goals = self.generator.get_domain_goals("hotel")
        assert isinstance(goals, list)
        assert len(goals) > 0
        assert all(isinstance(goal, str) for goal in goals)
    
    def test_add_goal(self):
        """Test adding a new goal."""
        initial_count = len(self.generator.get_domain_goals("hotel"))
        
        self.generator.add_goal("Test hotel goal", "hotel")
        
        new_count = len(self.generator.get_domain_goals("hotel"))
        assert new_count == initial_count + 1
    
    @patch('goalconvo.experience_generator.save_json')
    def test_generate_experience_success(self, mock_save_json):
        """Test successful experience generation."""
        # Mock LLM response
        mock_response = {
            "goal": "Test goal",
            "context": "Test context",
            "first_utterance": "Test utterance",
            "user_persona": "Test persona"
        }
        self.mock_llm_client.generate_completion.return_value = str(mock_response)
        
        # Mock few-shot examples
        self.mock_dataset_store.load_few_shot_examples.return_value = []
        
        result = self.generator.generate_experience("Test goal", "hotel")
        
        assert result["goal"] == "Test goal"
        assert result["domain"] == "hotel"
        assert "context" in result
        assert "first_utterance" in result
    
    @patch('goalconvo.experience_generator.save_json')
    def test_generate_experience_fallback(self, mock_save_json):
        """Test experience generation with fallback."""
        # Mock LLM failure
        self.mock_llm_client.generate_completion.side_effect = Exception("API Error")
        self.mock_dataset_store.load_few_shot_examples.return_value = []
        
        result = self.generator.generate_experience("Test goal", "hotel")
        
        # Should return fallback experience
        assert result["goal"] == "Test goal"
        assert result["domain"] == "hotel"
        assert "context" in result
        assert "first_utterance" in result
    
    def test_generate_batch_experiences(self):
        """Test batch experience generation."""
        goals = ["Goal 1", "Goal 2", "Goal 3"]
        domains = ["hotel", "restaurant", "taxi"]
        
        # Mock individual generation
        with patch.object(self.generator, 'generate_experience') as mock_generate:
            mock_generate.return_value = {
                "goal": "Test goal",
                "domain": "hotel",
                "context": "Test context",
                "first_utterance": "Test utterance"
            }
            
            results = self.generator.generate_batch_experiences(goals, domains)
            
            assert len(results) == 3
            assert all("goal" in result for result in results)
            assert mock_generate.call_count == 3

if __name__ == "__main__":
    pytest.main([__file__])
