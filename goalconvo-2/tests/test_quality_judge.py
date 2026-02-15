"""
Tests for Quality Judge module.
"""

import pytest
import unittest.mock as mock
from unittest.mock import patch, MagicMock

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.quality_judge import QualityJudge
from goalconvo.llm_client import LLMClient

class TestQualityJudge:
    """Test cases for Quality Judge."""
    
    def setup_method(self):
        """Setup test configuration."""
        self.config = Config()
        self.config.min_turns = 3
        self.config.max_turns = 10
        self.config.quality_threshold = 0.7
        self.config.discard_rate = 0.1
        
        # Mock LLM client
        self.mock_llm_client = MagicMock()
        
        self.judge = QualityJudge(self.config, self.mock_llm_client)
    
    def test_check_length_pass(self):
        """Test length check passing."""
        turns = [{"role": "User", "text": "Test"}] * 5  # 5 turns
        
        result = self.judge._check_length(turns)
        
        assert result["passed"] is True
        assert result["num_turns"] == 5
    
    def test_check_length_fail(self):
        """Test length check failing."""
        turns = [{"role": "User", "text": "Test"}] * 2  # 2 turns (below min)
        
        result = self.judge._check_length(turns)
        
        assert result["passed"] is False
        assert result["num_turns"] == 2
    
    def test_check_repetition_no_repetition(self):
        """Test repetition check with no repetition."""
        turns = [
            {"role": "User", "text": "Hello"},
            {"role": "SupportBot", "text": "Hi there"},
            {"role": "User", "text": "I need help"}
        ]
        
        result = self.judge._check_repetition(turns)
        
        assert result["passed"] is True
        assert result["has_repetition"] is False
    
    def test_check_repetition_with_repetition(self):
        """Test repetition check with repetition."""
        turns = [
            {"role": "User", "text": "Hello"},
            {"role": "SupportBot", "text": "Hi there"},
            {"role": "User", "text": "Hello"}  # Repetition
        ]
        
        result = self.judge._check_repetition(turns)
        
        assert result["passed"] is False
        assert result["has_repetition"] is True
    
    def test_check_profanity_clean(self):
        """Test profanity check with clean text."""
        turns = [
            {"role": "User", "text": "Hello, I need help"},
            {"role": "SupportBot", "text": "I'd be happy to assist you"}
        ]
        
        result = self.judge._check_profanity(turns)
        
        assert result["passed"] is True
        assert result["profane_turns"] == []
    
    def test_check_profanity_profane(self):
        """Test profanity check with profane text."""
        turns = [
            {"role": "User", "text": "Hello, I need help"},
            {"role": "SupportBot", "text": "This is stupid"}  # Profane
        ]
        
        result = self.judge._check_profanity(turns)
        
        assert result["passed"] is False
        assert len(result["profane_turns"]) > 0
    
    def test_check_coherence_good(self):
        """Test coherence check with good dialogue."""
        turns = [
            {"role": "User", "text": "Hello"},
            {"role": "SupportBot", "text": "Hi there"},
            {"role": "User", "text": "I need help"}
        ]
        
        result = self.judge._check_coherence(turns)
        
        assert result["passed"] is True
        assert result["role_coherence"] is True
        assert result["has_empty_responses"] is False
    
    def test_check_coherence_bad_roles(self):
        """Test coherence check with bad role sequence."""
        turns = [
            {"role": "User", "text": "Hello"},
            {"role": "User", "text": "Hi there"},  # Wrong role
            {"role": "SupportBot", "text": "I need help"}
        ]
        
        result = self.judge._check_coherence(turns)
        
        assert result["passed"] is False
        assert result["role_coherence"] is False
    
    def test_check_goal_mention_found(self):
        """Test goal mention check with goal mentioned."""
        goal = "book a hotel room"
        turns = [
            {"role": "User", "text": "I need to book a hotel room"},
            {"role": "SupportBot", "text": "I can help with that"}
        ]
        
        result = self.judge._check_goal_mention(goal, turns)
        
        assert result["passed"] is True
        assert result["goal_mentioned"] is True
    
    def test_check_goal_mention_not_found(self):
        """Test goal mention check with goal not mentioned."""
        goal = "book a hotel room"
        turns = [
            {"role": "User", "text": "Hello"},
            {"role": "SupportBot", "text": "Hi there"}
        ]
        
        result = self.judge._check_goal_mention(goal, turns)
        
        assert result["passed"] is False
        assert result["goal_mentioned"] is False
    
    def test_judge_dialogue_complete(self):
        """Test complete dialogue judgment."""
        dialogue_data = {
            "dialogue_id": "test_123",
            "goal": "book a hotel room",
            "domain": "hotel",
            "turns": [
                {"role": "User", "text": "I need to book a hotel room"},
                {"role": "SupportBot", "text": "I can help with that"},
                {"role": "User", "text": "Thank you, that's perfect!"}
            ]
        }
        
        # Mock LLM responses
        self.mock_llm_client.generate_completion.side_effect = [
            "4",  # Coherence score
            "YES",  # Goal relevance
            "4"  # Overall quality
        ]
        
        result = self.judge.judge_dialogue(dialogue_data)
        
        assert "dialogue_id" in result
        assert "heuristic_filters" in result
        assert "llm_evaluation" in result
        assert "overall_score" in result
        assert "passed_filters" in result
    
    def test_filter_dialogues(self):
        """Test dialogue filtering."""
        dialogues = [
            {
                "dialogue_id": "test_1",
                "goal": "book a hotel room",
                "domain": "hotel",
                "turns": [
                    {"role": "User", "text": "I need to book a hotel room"},
                    {"role": "SupportBot", "text": "I can help with that"},
                    {"role": "User", "text": "Thank you!"}
                ]
            },
            {
                "dialogue_id": "test_2", 
                "goal": "find a restaurant",
                "domain": "restaurant",
                "turns": [
                    {"role": "User", "text": "Hello"},
                    {"role": "SupportBot", "text": "Hi"}
                ]
            }
        ]
        
        # Mock judgment results
        with patch.object(self.judge, 'judge_dialogue') as mock_judge:
            mock_judge.side_effect = [
                {"passed_filters": True, "overall_score": 0.8},
                {"passed_filters": False, "overall_score": 0.3}
            ]
            
            accepted, rejected = self.judge.filter_dialogues(dialogues)
            
            assert len(accepted) == 1
            assert len(rejected) == 1
            assert accepted[0]["dialogue_id"] == "test_1"
            assert rejected[0]["dialogue_id"] == "test_2"

if __name__ == "__main__":
    pytest.main([__file__])
