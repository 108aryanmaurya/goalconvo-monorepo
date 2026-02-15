"""
Tests for Multi-Agent Simulator module.
"""

import pytest
import unittest.mock as mock
from unittest.mock import patch, MagicMock

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.multi_agent_simulator import DialogueSimulator
from goalconvo.llm_client import LLMClient

class TestDialogueSimulator:
    """Test cases for Dialogue Simulator."""
    
    def setup_method(self):
        """Setup test configuration."""
        self.config = Config()
        self.config.max_turns = 5
        self.config.temperature = 0.7
        self.config.top_p = 0.9
        
        # Mock LLM client
        self.mock_llm_client = MagicMock()
        
        self.simulator = DialogueSimulator(self.config, self.mock_llm_client)
    
    def test_simulate_dialogue_basic(self):
        """Test basic dialogue simulation."""
        experience_data = {
            "goal": "Book a hotel room",
            "domain": "hotel",
            "context": "Need accommodation for tonight",
            "first_utterance": "Hi, I need to book a hotel room",
            "user_persona": "Business traveler"
        }
        
        # Mock LLM responses
        self.mock_llm_client.generate_completion.side_effect = [
            "I'd be happy to help you book a hotel room. What's your preferred location?",
            "Great! What's your budget range?",
            "Perfect! I have a few options for you. Would you like to see them?"
        ]
        
        result = self.simulator.simulate_dialogue(experience_data)
        
        assert "dialogue_id" in result
        assert result["goal"] == "Book a hotel room"
        assert result["domain"] == "hotel"
        assert "turns" in result
        assert len(result["turns"]) > 0
        assert all("role" in turn for turn in result["turns"])
        assert all("text" in turn for turn in result["turns"])
    
    def test_simulate_dialogue_max_turns(self):
        """Test dialogue simulation with max turns reached."""
        experience_data = {
            "goal": "Test goal",
            "domain": "hotel",
            "context": "Test context",
            "first_utterance": "Test utterance"
        }
        
        # Mock LLM responses (will hit max turns)
        self.mock_llm_client.generate_completion.return_value = "Test response"
        
        result = self.simulator.simulate_dialogue(experience_data, max_turns=2)
        
        assert len(result["turns"]) <= 4  # 2 exchanges = 4 turns max
        assert result["metadata"]["max_turns_reached"] is True
    
    def test_check_goal_satisfied_yes(self):
        """Test goal satisfaction check with YES response."""
        goal = "Book a hotel room"
        history = [
            {"role": "User", "text": "I need a hotel room"},
            {"role": "SupportBot", "text": "I can help with that"},
            {"role": "User", "text": "Thank you, that's perfect!"}
        ]
        
        # Mock LLM response indicating goal satisfaction
        self.mock_llm_client.generate_completion.return_value = "YES"
        
        result = self.simulator._check_goal_satisfied(goal, history)
        
        assert result is True
    
    def test_check_goal_satisfied_no(self):
        """Test goal satisfaction check with NO response."""
        goal = "Book a hotel room"
        history = [
            {"role": "User", "text": "I need a hotel room"},
            {"role": "SupportBot", "text": "I can help with that"}
        ]
        
        # Mock LLM response indicating goal not satisfied
        self.mock_llm_client.generate_completion.return_value = "NO"
        
        result = self.simulator._check_goal_satisfied(goal, history)
        
        assert result is False
    
    def test_check_completion_keywords(self):
        """Test keyword-based goal completion check."""
        goal = "Book a hotel room"
        history = [
            {"role": "User", "text": "I need a hotel room"},
            {"role": "SupportBot", "text": "I can help with that"},
            {"role": "User", "text": "Thank you, that's perfect!"}
        ]
        
        result = self.simulator._check_completion_keywords(goal, history)
        
        assert result is True
    
    def test_simulate_batch_dialogues(self):
        """Test batch dialogue simulation."""
        experience_data_list = [
            {
                "goal": "Book a hotel room",
                "domain": "hotel",
                "context": "Test context 1",
                "first_utterance": "Test utterance 1"
            },
            {
                "goal": "Find a restaurant",
                "domain": "restaurant", 
                "context": "Test context 2",
                "first_utterance": "Test utterance 2"
            }
        ]
        
        # Mock LLM responses
        self.mock_llm_client.generate_completion.return_value = "Test response"
        
        results = self.simulator.simulate_batch_dialogues(experience_data_list)
        
        assert len(results) == 2
        assert all("dialogue_id" in result for result in results)
        assert all("turns" in result for result in results)

if __name__ == "__main__":
    pytest.main([__file__])
