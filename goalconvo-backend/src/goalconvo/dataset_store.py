"""
Dataset Store for managing synthetic dialogues and metadata.

Handles JSON storage, loading, and few-shot hub management.
"""

import json
import os
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from pathlib import Path

from .config import Config
from .utils import (
    generate_dialogue_id, save_json, load_json, ensure_dir,
    validate_dialogue_format, create_metadata, update_metadata_turns
)
from .seed_few_shot_hub import get_seed_dialogues_by_domain

logger = logging.getLogger(__name__)

MIN_HUB_EXAMPLES_BEFORE_SEED = 5  # Seed hub if a domain has fewer than this many examples

class DatasetStore:
    """Manages storage and retrieval of synthetic dialogues."""
    
    def __init__(self, config: Config):
        """Initialize the dataset store with configuration."""
        self.config = config
        self.synthetic_dir = Path(config.synthetic_dir)
        self.few_shot_hub_dir = Path(config.few_shot_hub_dir)
        
        # Ensure directories exist
        ensure_dir(str(self.synthetic_dir))
        ensure_dir(str(self.few_shot_hub_dir))
        
        # Create domain-specific subdirectories
        for domain in config.domains:
            ensure_dir(str(self.synthetic_dir / domain))
            ensure_dir(str(self.few_shot_hub_dir / domain))
    
    def save_dialogue(self, dialogue_data: Dict[str, Any]) -> str:
        """
        Save a dialogue to the dataset store.
        
        Args:
            dialogue_data: Dialogue data with required fields
            
        Returns:
            Dialogue ID of the saved dialogue
            
        Raises:
            ValueError: If dialogue format is invalid
        """
        if not validate_dialogue_format(dialogue_data):
            raise ValueError("Invalid dialogue format")
        
        # Generate a dialogue_id if not already present
        dialogue_id = dialogue_data.get("dialogue_id", generate_dialogue_id())
        domain = dialogue_data.get("domain", "unknown")
        
        # Update metadata with turn count
        if "metadata" in dialogue_data:
            dialogue_data["metadata"] = update_metadata_turns(
                dialogue_data["metadata"], 
                len(dialogue_data["turns"])
            )
        
        # Save to domain-specific file
        domain_dir = self.synthetic_dir / domain
        file_path = domain_dir / f"{dialogue_id}.json"
        
        save_json(dialogue_data, str(file_path))
        
        logger.info(f"Saved dialogue {dialogue_id} to {file_path}")
        return dialogue_id
    
    def load_dialogue(self, dialogue_id: str, domain: str) -> Optional[Dict[str, Any]]:
        """
        Load a specific dialogue by ID and domain.
        
        Args:
            dialogue_id: Unique dialogue identifier
            domain: Domain of the dialogue
            
        Returns:
            Dialogue data or None if not found
        """
        file_path = self.synthetic_dir / domain / f"{dialogue_id}.json"
        
        if not file_path.exists():
            logger.warning(f"Dialogue {dialogue_id} not found in domain {domain}")
            return None
        
        return load_json(str(file_path))
    
    def load_dialogues(
        self, 
        domain: Optional[str] = None, 
        limit: Optional[int] = None,
        quality_threshold: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Load dialogues from the dataset store.
        
        Args:
            domain: Filter by domain (None for all domains)
            limit: Maximum number of dialogues to return
            quality_threshold: Minimum quality score threshold
            
        Returns:
            List of dialogue data
        """
        dialogues = []
        
        if domain:
            domains_to_search = [domain]
        else:
            domains_to_search = self.config.domains
        
        for search_domain in domains_to_search:
            domain_dir = self.synthetic_dir / search_domain
            
            if not domain_dir.exists():
                continue
            
            for file_path in domain_dir.glob("*.json"):
                try:
                    dialogue_data = load_json(str(file_path))
                    
                    # Apply quality filter if specified
                    if quality_threshold is not None:
                        metadata = dialogue_data.get("metadata", {})
                        quality_score = metadata.get("quality_score", 0.0)
                        if quality_score < quality_threshold:
                            continue
                    
                    dialogues.append(dialogue_data)
                    
                    # Apply limit if specified
                    if limit and len(dialogues) >= limit:
                        break
                        
                except Exception as e:
                    logger.error(f"Error loading dialogue from {file_path}: {e}")
                    continue
            
            if limit and len(dialogues) >= limit:
                break
        
        logger.info(f"Loaded {len(dialogues)} dialogues")
        return dialogues
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about the stored dialogues.
        
        Returns:
            Dictionary with statistics
        """
        stats = {
            "total_dialogues": 0,
            "by_domain": {},
            "avg_turns": 0.0,
            "quality_scores": [],
            "creation_dates": []
        }
        
        total_turns = 0
        
        for domain in self.config.domains:
            domain_dir = self.synthetic_dir / domain
            domain_count = 0
            domain_turns = 0
            
            if domain_dir.exists():
                for file_path in domain_dir.glob("*.json"):
                    try:
                        dialogue_data = load_json(str(file_path))
                        domain_count += 1
                        domain_turns += len(dialogue_data.get("turns", []))
                        
                        # Collect quality scores
                        metadata = dialogue_data.get("metadata", {})
                        quality_score = metadata.get("quality_score")
                        if quality_score is not None:
                            stats["quality_scores"].append(quality_score)
                        
                        # Collect creation dates
                        created_at = metadata.get("created_at")
                        if created_at:
                            stats["creation_dates"].append(created_at)
                            
                    except Exception as e:
                        logger.error(f"Error processing {file_path}: {e}")
                        continue
            
            stats["by_domain"][domain] = domain_count
            total_turns += domain_turns
        
        stats["total_dialogues"] = sum(stats["by_domain"].values())
        stats["avg_turns"] = total_turns / stats["total_dialogues"] if stats["total_dialogues"] > 0 else 0.0
        
        return stats
    
    def update_few_shot_hub(self, top_percentage: float = 0.1) -> int:
        """
        Update the few-shot hub with high-quality dialogues.
        
        Args:
            top_percentage: Percentage of top-quality dialogues to add to hub
            
        Returns:
            Number of dialogues added to hub
        """
        # Load all dialogues with quality scores
        all_dialogues = []
        for domain in self.config.domains:
            domain_dialogues = self.load_dialogues(domain=domain)
            for dialogue in domain_dialogues:
                metadata = dialogue.get("metadata", {})
                quality_score = metadata.get("quality_score", 0.0)
                if quality_score > 0:
                    all_dialogues.append((dialogue, quality_score))
        
        if not all_dialogues:
            logger.warning("No dialogues with quality scores found")
            return 0
        
        # Sort by quality score and select top percentage
        all_dialogues.sort(key=lambda x: x[1], reverse=True)
        num_to_select = max(1, int(len(all_dialogues) * top_percentage))
        top_dialogues = all_dialogues[:num_to_select]
        
        added_count = 0
        
        for dialogue_data, quality_score in top_dialogues:
            domain = dialogue_data.get("domain", "unknown")
            dialogue_id = dialogue_data.get("dialogue_id", generate_dialogue_id())
            
            # Save to few-shot hub
            hub_file_path = self.few_shot_hub_dir / domain / f"{dialogue_id}.json"
            
            # Add hub metadata
            hub_dialogue = dialogue_data.copy()
            hub_dialogue["hub_metadata"] = {
                "added_to_hub_at": datetime.now().isoformat(),
                "quality_score": quality_score,
                "source": "synthetic"
            }
            
            save_json(hub_dialogue, str(hub_file_path))
            added_count += 1
        
        logger.info(f"Added {added_count} dialogues to few-shot hub")
        return added_count
    
    def ensure_seed_few_shot_hub(self, domain: str) -> None:
        """
        If the hub has fewer than MIN_HUB_EXAMPLES_BEFORE_SEED examples for this domain,
        write seed dialogues so both experience generation and simulation see good patterns.
        """
        hub_domain_dir = self.few_shot_hub_dir / domain
        ensure_dir(str(hub_domain_dir))
        existing = list(hub_domain_dir.glob("*.json"))
        if len(existing) >= MIN_HUB_EXAMPLES_BEFORE_SEED:
            return
        seed_dialogues = get_seed_dialogues_by_domain(domain)
        if not seed_dialogues:
            return
        written = 0
        for i, dialogue in enumerate(seed_dialogues):
            if written >= MIN_HUB_EXAMPLES_BEFORE_SEED:
                break
            dialogue_id = dialogue.get("dialogue_id") or generate_dialogue_id()
            dialogue["dialogue_id"] = dialogue_id
            file_path = hub_domain_dir / f"seed_{i}_{dialogue_id}.json"
            try:
                save_json(dialogue, str(file_path))
                written += 1
            except Exception as e:
                logger.warning(f"Failed to write seed example for {domain}: {e}")
        if written:
            logger.info(f"Seeded {written} few-shot examples for domain {domain}")

    def load_few_shot_examples(
        self, 
        domain: str, 
        num_examples: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Load few-shot examples from the hub for a specific domain.
        Seeds the hub with strong examples if the domain has fewer than 5.
        
        Args:
            domain: Target domain
            num_examples: Number of examples to retrieve
            
        Returns:
            List of example dialogues
        """
        self.ensure_seed_few_shot_hub(domain)
        hub_domain_dir = self.few_shot_hub_dir / domain
        
        if not hub_domain_dir.exists():
            logger.warning(f"No few-shot examples found for domain {domain}")
            return []
        
        examples = []
        for file_path in hub_domain_dir.glob("*.json"):
            try:
                example_data = load_json(str(file_path))
                examples.append(example_data)
                
                if len(examples) >= num_examples:
                    break
                    
            except Exception as e:
                logger.error(f"Error loading example from {file_path}: {e}")
                continue
        
        logger.info(f"Loaded {len(examples)} few-shot examples for domain {domain}")
        return examples
    
    def clear_domain(self, domain: str) -> int:
        """
        Clear all dialogues for a specific domain.
        
        Args:
            domain: Domain to clear
            
        Returns:
            Number of dialogues removed
        """
        domain_dir = self.synthetic_dir / domain
        removed_count = 0
        
        if domain_dir.exists():
            for file_path in domain_dir.glob("*.json"):
                try:
                    file_path.unlink()
                    removed_count += 1
                except Exception as e:
                    logger.error(f"Error removing {file_path}: {e}")
        
        logger.info(f"Removed {removed_count} dialogues from domain {domain}")
        return removed_count
    
    def export_domain(self, domain: str, output_path: str) -> bool:
        """
        Export all dialogues for a domain to a single JSON file.
        
        Args:
            domain: Domain to export
            output_path: Output file path
            
        Returns:
            True if successful, False otherwise
        """
        try:
            dialogues = self.load_dialogues(domain=domain)
            
            export_data = {
                "domain": domain,
                "total_dialogues": len(dialogues),
                "exported_at": datetime.now().isoformat(),
                "dialogues": dialogues
            }
            
            save_json(export_data, output_path)
            logger.info(f"Exported {len(dialogues)} dialogues from domain {domain} to {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error exporting domain {domain}: {e}")
            return False
