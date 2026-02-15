"""
Tests for LLM Client module.
"""

import pytest
import unittest.mock as mock
from unittest.mock import patch, MagicMock

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.llm_client import LLMClient

class TestLLMClient:
    """Test cases for LLM Client."""
    
    def setup_method(self):
        """Setup test configuration."""
        self.config = Config()
        self.config.mistral_api_key = "test_key"
        self.config.mistral_api_base = "https://api.test.com/v1"
        self.config.mistral_model = "test-model"
        
        self.client = LLMClient(self.config)
    
    @patch('requests.Session.post')
    def test_generate_completion_success(self, mock_post):
        """Test successful completion generation."""
        # Mock successful response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Test response"}}]
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        result = self.client.generate_completion("Test prompt")
        
        assert result == "Test response"
        mock_post.assert_called_once()
    
    @patch('requests.Session.post')
    def test_generate_completion_failure(self, mock_post):
        """Test completion generation failure."""
        # Mock failed response
        mock_post.side_effect = Exception("API Error")
        
        with pytest.raises(Exception, match="API call failed"):
            self.client.generate_completion("Test prompt")
    
    @patch('requests.Session.post')
    def test_generate_batch(self, mock_post):
        """Test batch generation."""
        # Mock successful responses
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Test response"}}]
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        prompts = ["Prompt 1", "Prompt 2", "Prompt 3"]
        results = self.client.generate_batch(prompts)
        
        assert len(results) == 3
        assert all(result == "Test response" for result in results)
        assert mock_post.call_count == 3
    
    @patch('requests.Session.post')
    def test_test_connection_success(self, mock_post):
        """Test successful connection test."""
        # Mock successful response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Connection successful."}}]
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        result = self.client.test_connection()
        
        assert result is True
    
    @patch('requests.Session.post')
    def test_test_connection_failure(self, mock_post):
        """Test connection test failure."""
        # Mock failed response
        mock_post.side_effect = Exception("Connection failed")
        
        result = self.client.test_connection()
        
        assert result is False

if __name__ == "__main__":
    pytest.main([__file__])
