#!/usr/bin/env python3
"""
MultiWOZ Dataset Downloader and Parser

Downloads MultiWOZ 2.2 dataset and extracts seed goals for GoalConvo framework.
"""

import json
import logging
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional
import requests
import zipfile
import os
import subprocess

# Add src to path for imports
import sys
sys.path.append(str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.utils import save_json, load_json, ensure_dir

logger = logging.getLogger(__name__)

class MultiWOZDownloader:
    """Downloads and processes MultiWOZ dataset."""
    
    def __init__(self, config: Config):
        """Initialize the downloader."""
        self.config = config
        self.multiwoz_dir = Path(config.multiwoz_dir)
        ensure_dir(str(self.multiwoz_dir))
        
        # MultiWOZ URLs and info
        self.multiwoz_repo_url = "https://github.com/budzianowski/multiwoz.git"
        self.repo_dir = self.multiwoz_dir / "multiwoz"
        self.extracted_dir = self.repo_dir / "data" / "MultiWOZ_2.2"
    
    def download_dataset(self) -> bool:
        """Download MultiWOZ dataset by cloning the repository."""
        if self.extracted_dir.exists() and (self.extracted_dir / "train").exists():
            logger.info(f"Dataset already exists: {self.extracted_dir}")
            return True
        
        logger.info("Cloning MultiWOZ repository...")
        try:
            # Clone the repository if it doesn't exist
            if not self.repo_dir.exists():
                result = subprocess.run(
                    ["git", "clone", "--depth", "1", self.multiwoz_repo_url, str(self.repo_dir)],
                    capture_output=True,
                    text=True,
                    check=True
                )
                logger.info(f"Cloned repository to {self.repo_dir}")
            else:
                logger.info(f"Repository already exists: {self.repo_dir}")
            
            # Check if MultiWOZ_2.2 directory exists
            if not self.extracted_dir.exists():
                logger.error(f"MultiWOZ_2.2 directory not found in repository: {self.extracted_dir}")
                return False
            
            logger.info(f"Dataset available at {self.extracted_dir}")
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Error cloning repository: {e.stderr}")
            return False
        except Exception as e:
            logger.error(f"Error downloading dataset: {e}")
            return False
    
    def extract_dataset(self) -> bool:
        """Verify MultiWOZ dataset is available (no extraction needed for git clone)."""
        if self.extracted_dir.exists() and (self.extracted_dir / "train").exists():
            logger.info(f"Dataset already available: {self.extracted_dir}")
            return True
        
        if not self.extracted_dir.exists():
            logger.error("Dataset directory not found. Please download first.")
            return False
        
        logger.info(f"Dataset available at {self.extracted_dir}")
        return True
    
    def parse_dialogues(self) -> List[Dict[str, Any]]:
        """Parse MultiWOZ dialogues into standardized format."""
        logger.info("Parsing MultiWOZ dialogues...")
        
        dialogues = []
        
        # Process dialogues from train, test, and val directories
        for split in ["train", "test", "val"]:
            split_dir = self.extracted_dir / split
            if split_dir.exists():
                logger.info(f"Processing {split} split...")
                # Find all dialogue JSON files in this split
                dialogue_files = list(split_dir.glob("dialogues_*.json"))
                logger.info(f"Found {len(dialogue_files)} dialogue files in {split}")
                
                for dialogue_file in dialogue_files:
                    file_dialogues = self._parse_data_file(dialogue_file)
                    dialogues.extend(file_dialogues)
        
        logger.info(f"Parsed {len(dialogues)} dialogues from MultiWOZ")
        return dialogues
    
    def _parse_data_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """Parse a single MultiWOZ data file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            dialogues = []
            
            # Handle both list format (MultiWOZ 2.2) and dict format (older versions)
            if isinstance(data, list):
                for dialogue_data in data:
                    dialogue_id = dialogue_data.get("dialogue_id", "")
                    parsed_dialogue = self._parse_single_dialogue_v2(dialogue_id, dialogue_data)
                    if parsed_dialogue:
                        dialogues.append(parsed_dialogue)
            elif isinstance(data, dict):
                for dialogue_id, dialogue_data in data.items():
                    parsed_dialogue = self._parse_single_dialogue(dialogue_id, dialogue_data)
                    if parsed_dialogue:
                        dialogues.append(parsed_dialogue)
            
            return dialogues
            
        except Exception as e:
            logger.error(f"Error parsing {file_path}: {e}")
            return []
    
    def _parse_single_dialogue(self, dialogue_id: str, dialogue_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Parse a single MultiWOZ dialogue."""
        try:
            # Extract goal information
            goal_info = dialogue_data.get("goal", {})
            domain_goals = {}
            
            for domain, domain_data in goal_info.items():
                if isinstance(domain_data, dict) and "inform" in domain_data:
                    domain_goals[domain] = domain_data["inform"]
            
            # Determine primary domain
            primary_domain = self._determine_primary_domain(domain_goals)
            
            # Extract goal text
            goal_text = self._extract_goal_text(domain_goals, primary_domain)
            
            # Parse dialogue turns
            turns = []
            for turn_data in dialogue_data.get("log", []):
                if "text" in turn_data:
                    role = "User" if turn_data.get("metadata", {}).get("sys", False) else "SupportBot"
                    turns.append({
                        "role": role,
                        "text": turn_data["text"],
                        "timestamp": turn_data.get("timestamp", "")
                    })
            
            if not turns or not goal_text:
                return None
            
            return {
                "dialogue_id": dialogue_id,
                "goal": goal_text,
                "domain": primary_domain,
                "turns": turns,
                "metadata": {
                    "source": "MultiWOZ",
                    "domain_goals": domain_goals,
                    "num_turns": len(turns)
                }
            }
            
        except Exception as e:
            logger.error(f"Error parsing dialogue {dialogue_id}: {e}")
            return None
    
    def _parse_single_dialogue_v2(self, dialogue_id: str, dialogue_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Parse a single MultiWOZ 2.2 dialogue."""
        try:
            # Extract services (domains) from dialogue
            services = dialogue_data.get("services", [])
            primary_domain = services[0] if services else "unknown"
            
            # Extract goal information from frames in turns
            domain_goals = {}
            for turn in dialogue_data.get("turns", []):
                for frame in turn.get("frames", []):
                    domain = frame.get("service", "")
                    if domain and domain not in domain_goals:
                        # Extract slot values as goal information
                        slots = frame.get("slots", [])
                        if slots:
                            goal_info = {}
                            for slot in slots:
                                slot_name = slot.get("slot", "")
                                slot_value = slot.get("value", "")
                                if slot_name and slot_value:
                                    goal_info[slot_name] = slot_value
                            if goal_info:
                                domain_goals[domain] = goal_info
            
            # Extract goal text
            goal_text = self._extract_goal_text(domain_goals, primary_domain)
            if not goal_text:
                # Fallback: create goal from services
                goal_text = f"Complete task in {', '.join(services)} domain"
            
            # Parse dialogue turns
            turns = []
            for turn_data in dialogue_data.get("turns", []):
                speaker = turn_data.get("speaker", "")
                utterance = turn_data.get("utterance", "")
                
                if utterance:
                    # Map speaker to role
                    role = "User" if speaker == "USER" else "SupportBot"
                    turns.append({
                        "role": role,
                        "text": utterance,
                        "turn_id": turn_data.get("turn_id", len(turns))
                    })
            
            if not turns:
                return None
            
            return {
                "dialogue_id": dialogue_id,
                "goal": goal_text,
                "domain": primary_domain,
                "turns": turns,
                "metadata": {
                    "source": "MultiWOZ_2.2",
                    "services": services,
                    "domain_goals": domain_goals,
                    "num_turns": len(turns)
                }
            }
            
        except Exception as e:
            logger.error(f"Error parsing dialogue {dialogue_id}: {e}")
            return None
    
    def _determine_primary_domain(self, domain_goals: Dict[str, Any]) -> str:
        """Determine the primary domain from domain goals."""
        if not domain_goals:
            return "unknown"
        
        # Count non-empty goals per domain
        domain_counts = {}
        for domain, goals in domain_goals.items():
            if goals and len(str(goals).strip()) > 0:
                domain_counts[domain] = 1
        
        if not domain_counts:
            return "unknown"
        
        # Return the first domain with goals
        return list(domain_counts.keys())[0]
    
    def _extract_goal_text(self, domain_goals: Dict[str, Any], primary_domain: str) -> str:
        """Extract goal text from domain goals."""
        if primary_domain in domain_goals:
            goals = domain_goals[primary_domain]
            if isinstance(goals, dict):
                # Extract key information
                goal_parts = []
                for key, value in goals.items():
                    if value and str(value).strip():
                        goal_parts.append(f"{key}: {value}")
                return "; ".join(goal_parts)
            elif isinstance(goals, str):
                return goals
        
        # Fallback: create goal from available information
        if domain_goals:
            all_goals = []
            for domain, goals in domain_goals.items():
                if goals and str(goals).strip():
                    all_goals.append(f"{domain}: {goals}")
            return "; ".join(all_goals)
        
        return f"Complete task in {primary_domain} domain"
    
    def extract_seed_goals(self, dialogues: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """Extract seed goals from MultiWOZ dialogues."""
        logger.info("Extracting seed goals from MultiWOZ dialogues...")
        
        domain_goals = {}
        
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            goal = dialogue.get("goal", "")
            
            if domain not in domain_goals:
                domain_goals[domain] = []
            
            # Clean and add goal if not already present
            clean_goal = self._clean_goal_text(goal)
            if clean_goal and clean_goal not in domain_goals[domain]:
                domain_goals[domain].append(clean_goal)
        
        # Limit to reasonable number per domain
        for domain in domain_goals:
            domain_goals[domain] = domain_goals[domain][:100]  # Max 100 per domain
        
        logger.info(f"Extracted seed goals for {len(domain_goals)} domains")
        return domain_goals
    
    def _clean_goal_text(self, goal_text: str) -> str:
        """Clean goal text for use as seed."""
        if not goal_text:
            return ""
        
        # Remove extra whitespace and normalize
        cleaned = " ".join(goal_text.split())
        
        # Remove domain prefixes if present
        cleaned = cleaned.replace("hotel: ", "").replace("restaurant: ", "").replace("taxi: ", "")
        cleaned = cleaned.replace("train: ", "").replace("attraction: ", "")
        
        return cleaned
    
    def save_processed_data(self, dialogues: List[Dict[str, Any]], seed_goals: Dict[str, List[str]]) -> None:
        """Save processed MultiWOZ data."""
        # Save dialogues
        dialogues_file = self.multiwoz_dir / "processed_dialogues.json"
        save_json(dialogues, str(dialogues_file))
        logger.info(f"Saved {len(dialogues)} dialogues to {dialogues_file}")
        
        # Save seed goals
        seed_goals_file = Path(self.config.data_dir) / "seed_goals.json"
        save_json(seed_goals, str(seed_goals_file))
        logger.info(f"Saved seed goals to {seed_goals_file}")
        
        # Save statistics
        stats = {
            "total_dialogues": len(dialogues),
            "domains": list(seed_goals.keys()),
            "goals_per_domain": {domain: len(goals) for domain, goals in seed_goals.items()}
        }
        stats_file = self.multiwoz_dir / "processing_stats.json"
        save_json(stats, str(stats_file))
        logger.info(f"Saved processing statistics to {stats_file}")

def main():
    """Main function for MultiWOZ downloader."""
    parser = argparse.ArgumentParser(description="Download and process MultiWOZ dataset")
    parser.add_argument("--config", type=str, help="Path to config file")
    parser.add_argument("--skip-download", action="store_true", help="Skip download if file exists")
    parser.add_argument("--skip-extract", action="store_true", help="Skip extraction if directory exists")
    parser.add_argument("--output-dir", type=str, help="Output directory for processed data")
    
    args = parser.parse_args()
    
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Load configuration
    config = Config()
    if args.output_dir:
        config.multiwoz_dir = args.output_dir
    
    # Initialize downloader
    downloader = MultiWOZDownloader(config)
    
    try:
        # Download dataset
        if not args.skip_download:
            if not downloader.download_dataset():
                logger.error("Failed to download dataset")
                return 1
        
        # Extract dataset
        if not args.skip_extract:
            if not downloader.extract_dataset():
                logger.error("Failed to extract dataset")
                return 1
        
        # Parse dialogues
        dialogues = downloader.parse_dialogues()
        if not dialogues:
            logger.error("No dialogues parsed")
            return 1
        
        # Extract seed goals
        seed_goals = downloader.extract_seed_goals(dialogues)
        
        # Save processed data
        downloader.save_processed_data(dialogues, seed_goals)
        
        logger.info("MultiWOZ processing completed successfully!")
        return 0
        
    except Exception as e:
        logger.error(f"Error in MultiWOZ processing: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
