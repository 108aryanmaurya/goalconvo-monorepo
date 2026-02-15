"""
Tests for Dataset Store module.
"""

import pytest
import unittest.mock as mock
from unittest.mock import patch, MagicMock
import tempfile
import shutil
from pathlib import Path

import sys
sys.path.append(str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.dataset_store import DatasetStore

class TestDatasetStore:
    """Test cases for Dataset Store."""
    
    def setup_method(self):
        """Setup test configuration."""
        # Create temporary directory for testing
        self.temp_dir = tempfile.mkdtemp()
        
        self.config = Config()
        self.config.data_dir = self.temp_dir
        self.config.synthetic_dir = f"{self.temp_dir}/synthetic"
        self.config.few_shot_hub_dir = f"{self.temp_dir}/few_shot_hub"
        self.config.domains = ["hotel", "restaurant"]
        
        self.store = DatasetStore(self.config)
    
    def teardown_method(self):
        """Clean up temporary directory."""
        shutil.rmtree(self.temp_dir)
    
    def test_save_dialogue(self):
        """Test saving a dialogue."""
        dialogue_data = {
            "dialogue_id": "test_123",
            "goal": "book a hotel room",
            "domain": "hotel",
            "turns": [
                {"role": "User", "text": "I need a hotel room"},
                {"role": "SupportBot", "text": "I can help with that"}
            ],
            "metadata": {"quality_score": 0.8}
        }
        
        dialogue_id = self.store.save_dialogue(dialogue_data)
        
        assert dialogue_id == "test_123"
        
        # Check if file was created
        file_path = Path(self.config.synthetic_dir) / "hotel" / "test_123.json"
        assert file_path.exists()
    
    def test_load_dialogue(self):
        """Test loading a dialogue."""
        # First save a dialogue
        dialogue_data = {
            "dialogue_id": "test_456",
            "goal": "find a restaurant",
            "domain": "restaurant",
            "turns": [
                {"role": "User", "text": "I need a restaurant"},
                {"role": "SupportBot", "text": "I can help with that"}
            ]
        }
        
        self.store.save_dialogue(dialogue_data)
        
        # Now load it
        loaded = self.store.load_dialogue("test_456", "restaurant")
        
        assert loaded is not None
        assert loaded["dialogue_id"] == "test_456"
        assert loaded["goal"] == "find a restaurant"
        assert len(loaded["turns"]) == 2
    
    def test_load_dialogues_with_filters(self):
        """Test loading dialogues with filters."""
        # Save multiple dialogues
        dialogues = [
            {
                "dialogue_id": "test_1",
                "goal": "book a hotel room",
                "domain": "hotel",
                "turns": [{"role": "User", "text": "Test"}],
                "metadata": {"quality_score": 0.9}
            },
            {
                "dialogue_id": "test_2",
                "goal": "find a restaurant",
                "domain": "restaurant",
                "turns": [{"role": "User", "text": "Test"}],
                "metadata": {"quality_score": 0.7}
            },
            {
                "dialogue_id": "test_3",
                "goal": "book another hotel room",
                "domain": "hotel",
                "turns": [{"role": "User", "text": "Test"}],
                "metadata": {"quality_score": 0.5}
            }
        ]
        
        for dialogue in dialogues:
            self.store.save_dialogue(dialogue)
        
        # Test loading all dialogues
        all_dialogues = self.store.load_dialogues()
        assert len(all_dialogues) == 3
        
        # Test loading by domain
        hotel_dialogues = self.store.load_dialogues(domain="hotel")
        assert len(hotel_dialogues) == 2
        
        # Test loading with limit
        limited_dialogues = self.store.load_dialogues(limit=2)
        assert len(limited_dialogues) == 2
        
        # Test loading with quality threshold
        high_quality = self.store.load_dialogues(quality_threshold=0.8)
        assert len(high_quality) == 1
        assert high_quality[0]["dialogue_id"] == "test_1"
    
    def test_get_statistics(self):
        """Test getting dataset statistics."""
        # Save some dialogues
        dialogues = [
            {
                "dialogue_id": "test_1",
                "goal": "book a hotel room",
                "domain": "hotel",
                "turns": [{"role": "User", "text": "Test"}] * 3,
                "metadata": {"quality_score": 0.8, "created_at": "2024-01-01"}
            },
            {
                "dialogue_id": "test_2",
                "goal": "find a restaurant",
                "domain": "restaurant",
                "turns": [{"role": "User", "text": "Test"}] * 2,
                "metadata": {"quality_score": 0.6, "created_at": "2024-01-02"}
            }
        ]
        
        for dialogue in dialogues:
            self.store.save_dialogue(dialogue)
        
        stats = self.store.get_statistics()
        
        assert stats["total_dialogues"] == 2
        assert stats["by_domain"]["hotel"] == 1
        assert stats["by_domain"]["restaurant"] == 1
        assert stats["avg_turns"] == 2.5  # (3 + 2) / 2
        assert len(stats["quality_scores"]) == 2
    
    def test_update_few_shot_hub(self):
        """Test updating few-shot hub."""
        # Save dialogues with quality scores
        dialogues = [
            {
                "dialogue_id": "test_1",
                "goal": "book a hotel room",
                "domain": "hotel",
                "turns": [{"role": "User", "text": "Test"}],
                "metadata": {"quality_score": 0.9}
            },
            {
                "dialogue_id": "test_2",
                "goal": "find a restaurant",
                "domain": "restaurant",
                "turns": [{"role": "User", "text": "Test"}],
                "metadata": {"quality_score": 0.7}
            },
            {
                "dialogue_id": "test_3",
                "goal": "book another hotel room",
                "domain": "hotel",
                "turns": [{"role": "User", "text": "Test"}],
                "metadata": {"quality_score": 0.5}
            }
        ]
        
        for dialogue in dialogues:
            self.store.save_dialogue(dialogue)
        
        # Update few-shot hub
        added_count = self.store.update_few_shot_hub(top_percentage=0.5)
        
        assert added_count == 1  # Only the highest quality dialogue should be added
        
        # Check if hub files were created
        hub_hotel_dir = Path(self.config.few_shot_hub_dir) / "hotel"
        assert hub_hotel_dir.exists()
        assert len(list(hub_hotel_dir.glob("*.json"))) == 1
    
    def test_load_few_shot_examples(self):
        """Test loading few-shot examples."""
        # First update the hub with some examples
        dialogue_data = {
            "dialogue_id": "example_1",
            "goal": "book a hotel room",
            "domain": "hotel",
            "turns": [{"role": "User", "text": "I need a hotel room"}],
            "metadata": {"quality_score": 0.9}
        }
        self.store.save_dialogue(dialogue_data)
        self.store.update_few_shot_hub()
        
        # Load few-shot examples
        examples = self.store.load_few_shot_examples("hotel", num_examples=3)
        
        assert len(examples) == 1
        assert examples[0]["dialogue_id"] == "example_1"
    
    def test_clear_domain(self):
        """Test clearing dialogues for a domain."""
        # Save dialogues for multiple domains
        for domain in ["hotel", "restaurant"]:
            dialogue_data = {
                "dialogue_id": f"test_{domain}",
                "goal": f"test goal for {domain}",
                "domain": domain,
                "turns": [{"role": "User", "text": "Test"}]
            }
            self.store.save_dialogue(dialogue_data)
        
        # Clear hotel domain
        removed_count = self.store.clear_domain("hotel")
        
        assert removed_count == 1
        
        # Check that hotel dialogues are gone but restaurant ones remain
        all_dialogues = self.store.load_dialogues()
        assert len(all_dialogues) == 1
        assert all_dialogues[0]["domain"] == "restaurant"
    
    def test_export_domain(self):
        """Test exporting dialogues for a domain."""
        # Save some dialogues
        dialogue_data = {
            "dialogue_id": "test_export",
            "goal": "book a hotel room",
            "domain": "hotel",
            "turns": [{"role": "User", "text": "Test"}]
        }
        self.store.save_dialogue(dialogue_data)
        
        # Export domain
        export_path = f"{self.temp_dir}/hotel_export.json"
        success = self.store.export_domain("hotel", export_path)
        
        assert success is True
        assert Path(export_path).exists()
        
        # Check exported content
        with open(export_path, 'r') as f:
            exported_data = json.load(f)
        
        assert exported_data["domain"] == "hotel"
        assert exported_data["total_dialogues"] == 1
        assert len(exported_data["dialogues"]) == 1

if __name__ == "__main__":
    pytest.main([__file__])
