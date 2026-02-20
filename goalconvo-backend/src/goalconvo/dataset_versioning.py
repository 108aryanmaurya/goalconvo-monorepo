"""
Dataset Versioning System for GoalConvo

Enables version control, rollback, and comparison of generated datasets.
"""

import json
import logging
import hashlib
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)

@dataclass
class DatasetVersion:
    """Represents a versioned dataset snapshot."""
    version_id: str
    timestamp: str
    description: str
    metadata: Dict[str, Any]
    dialogue_count: int
    domain_distribution: Dict[str, int]
    generation_config: Dict[str, Any]
    checksum: str
    parent_version: Optional[str] = None
    tags: List[str] = None

    def __post_init__(self):
        if self.tags is None:
            self.tags = []


class DatasetVersionManager:
    """Manages dataset versions, snapshots, and comparisons."""
    
    def __init__(self, data_dir: str):
        """Initialize version manager."""
        self.data_dir = Path(data_dir)
        self.versions_dir = self.data_dir / "versions"
        self.versions_dir.mkdir(parents=True, exist_ok=True)
        self.metadata_file = self.versions_dir / "version_metadata.json"
        self.versions: Dict[str, DatasetVersion] = {}
        self._load_versions()
    
    def _load_versions(self):
        """Load version metadata from disk."""
        if self.metadata_file.exists():
            try:
                with open(self.metadata_file, 'r') as f:
                    data = json.load(f)
                    for version_id, version_data in data.items():
                        self.versions[version_id] = DatasetVersion(**version_data)
                logger.info(f"Loaded {len(self.versions)} dataset versions")
            except Exception as e:
                logger.error(f"Error loading versions: {e}")
    
    def _save_versions(self):
        """Save version metadata to disk."""
        try:
            data = {
                vid: asdict(version) 
                for vid, version in self.versions.items()
            }
            with open(self.metadata_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving versions: {e}")
    
    def create_version(
        self,
        dialogues: List[Dict[str, Any]],
        description: str = "",
        generation_config: Optional[Dict[str, Any]] = None,
        parent_version: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> str:
        """
        Create a new dataset version snapshot.
        
        Args:
            dialogues: List of dialogue dictionaries
            description: Human-readable description
            generation_config: Configuration used for generation
            parent_version: Parent version ID (for branching)
            tags: Optional tags for categorization
            
        Returns:
            Version ID string
        """
        # Generate version ID (timestamp-based)
        version_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Calculate checksum
        dialogue_json = json.dumps(dialogues, sort_keys=True)
        checksum = hashlib.sha256(dialogue_json.encode()).hexdigest()[:16]
        
        # Calculate statistics
        domain_distribution = {}
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            domain_distribution[domain] = domain_distribution.get(domain, 0) + 1
        
        # Create version metadata
        version = DatasetVersion(
            version_id=version_id,
            timestamp=datetime.now().isoformat(),
            description=description,
            metadata={
                "total_dialogues": len(dialogues),
                "avg_turns": sum(len(d.get("turns", [])) for d in dialogues) / len(dialogues) if dialogues else 0,
                "domains": list(domain_distribution.keys())
            },
            dialogue_count=len(dialogues),
            domain_distribution=domain_distribution,
            generation_config=generation_config or {},
            checksum=checksum,
            parent_version=parent_version,
            tags=tags or []
        )
        
        # Save dialogues to version directory
        version_dir = self.versions_dir / version_id
        version_dir.mkdir(exist_ok=True)
        
        dialogues_file = version_dir / "dialogues.json"
        with open(dialogues_file, 'w') as f:
            json.dump(dialogues, f, indent=2)
        
        # Save version metadata
        self.versions[version_id] = version
        self._save_versions()
        
        logger.info(f"Created dataset version {version_id} with {len(dialogues)} dialogues")
        return version_id
    
    def get_version(self, version_id: str) -> Optional[DatasetVersion]:
        """Get version metadata by ID."""
        return self.versions.get(version_id)
    
    def load_version_dialogues(self, version_id: str) -> List[Dict[str, Any]]:
        """Load dialogues for a specific version."""
        version_dir = self.versions_dir / version_id
        dialogues_file = version_dir / "dialogues.json"
        
        if not dialogues_file.exists():
            logger.error(f"Version {version_id} not found")
            return []
        
        try:
            with open(dialogues_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading version {version_id}: {e}")
            return []
    
    def list_versions(self, tags: Optional[List[str]] = None) -> List[DatasetVersion]:
        """List all versions, optionally filtered by tags."""
        versions = list(self.versions.values())
        
        if tags:
            versions = [
                v for v in versions
                if any(tag in v.tags for tag in tags)
            ]
        
        # Sort by timestamp (newest first)
        versions.sort(key=lambda v: v.timestamp, reverse=True)
        return versions
    
    def compare_versions(
        self,
        version_id_1: str,
        version_id_2: str
    ) -> Dict[str, Any]:
        """
        Compare two dataset versions.
        
        Returns:
            Dictionary with comparison metrics
        """
        v1 = self.get_version(version_id_1)
        v2 = self.get_version(version_id_2)
        
        if not v1 or not v2:
            return {"error": "One or both versions not found"}
        
        dialogues_1 = self.load_version_dialogues(version_id_1)
        dialogues_2 = self.load_version_dialogues(version_id_2)
        
        comparison = {
            "version_1": version_id_1,
            "version_2": version_id_2,
            "dialogue_count": {
                "v1": len(dialogues_1),
                "v2": len(dialogues_2),
                "difference": len(dialogues_2) - len(dialogues_1)
            },
            "domain_distribution": {
                "v1": v1.domain_distribution,
                "v2": v2.domain_distribution
            },
            "avg_turns": {
                "v1": v1.metadata.get("avg_turns", 0),
                "v2": v2.metadata.get("avg_turns", 0)
            },
            "checksum_match": v1.checksum == v2.checksum,
            "generation_config_diff": self._diff_configs(
                v1.generation_config,
                v2.generation_config
            )
        }
        
        return comparison
    
    def _diff_configs(self, config1: Dict, config2: Dict) -> Dict[str, Any]:
        """Compare two configuration dictionaries."""
        all_keys = set(config1.keys()) | set(config2.keys())
        diff = {}
        
        for key in all_keys:
            val1 = config1.get(key)
            val2 = config2.get(key)
            
            if val1 != val2:
                diff[key] = {
                    "v1": val1,
                    "v2": val2
                }
        
        return diff
    
    def tag_version(self, version_id: str, tags: List[str]):
        """Add tags to a version."""
        version = self.versions.get(version_id)
        if version:
            version.tags.extend(tags)
            version.tags = list(set(version.tags))  # Remove duplicates
            self._save_versions()
    
    def delete_version(self, version_id: str):
        """Delete a version (with confirmation)."""
        if version_id in self.versions:
            version_dir = self.versions_dir / version_id
            if version_dir.exists():
                import shutil
                shutil.rmtree(version_dir)
            del self.versions[version_id]
            self._save_versions()
            logger.info(f"Deleted version {version_id}")
    
    def export_version(
        self,
        version_id: str,
        output_path: str,
        format: str = "json"
    ):
        """Export a version to external format.

        Supported formats:
            - json   : Single JSON file with metadata + dialogues
            - jsonl  : JSON Lines (one dialogue per line)
            - hf     : HuggingFace-style dataset (directory: train.jsonl + dataset_info.json)
            - rasa   : Rasa-style stories YAML (one story per dialogue, user/bot steps)
        """
        dialogues = self.load_version_dialogues(version_id)
        version = self.get_version(version_id)

        if format == "json":
            output_data = {
                "version_id": version_id,
                "metadata": asdict(version) if version else {},
                "dialogues": dialogues
            }
            with open(output_path, 'w') as f:
                json.dump(output_data, f, indent=2)
        elif format == "jsonl":
            # JSON Lines format (one dialogue per line)
            with open(output_path, 'w') as f:
                for dialogue in dialogues:
                    f.write(json.dumps(dialogue) + '\n')
        elif format == "hf":
            # HuggingFace-style export: directory containing train.jsonl + dataset_info.json
            output_dir = Path(output_path)
            output_dir.mkdir(parents=True, exist_ok=True)

            train_file = output_dir / "train.jsonl"
            with open(train_file, 'w') as f:
                for dialogue in dialogues:
                    f.write(json.dumps(dialogue) + '\n')

            info = {
                "version_id": version_id,
                "description": (version.description if version else ""),
                "created_at": datetime.now().isoformat(),
                "num_dialogues": len(dialogues),
                "domain_distribution": (version.domain_distribution if version else {}),
                "config": (version.generation_config if version else {}),
            }
            info_file = output_dir / "dataset_info.json"
            with open(info_file, 'w') as f:
                json.dump(info, f, indent=2)
        elif format == "rasa":
            # Rasa-style export: directory with stories.yml (user/bot turns per dialogue)
            output_dir = Path(output_path)
            output_dir.mkdir(parents=True, exist_ok=True)
            stories_file = output_dir / "stories.yml"
            self._write_rasa_stories(dialogues, stories_file)
            info = {
                "version_id": version_id,
                "description": (version.description if version else ""),
                "num_dialogues": len(dialogues),
                "config": (version.generation_config if version else {}),
            }
            info_file = output_dir / "dataset_info.json"
            with open(info_file, 'w') as f:
                json.dump(info, f, indent=2)
        else:
            raise ValueError(f"Unsupported format: {format}. Use json, jsonl, hf, or rasa.")

        logger.info(f"Exported version {version_id} to {output_path} (format={format})")

    def _write_rasa_stories(self, dialogues: List[Dict[str, Any]], output_path: Path) -> None:
        """Write dialogues to a Rasa-style stories YAML file (user/bot steps per story)."""
        def escape(s: str) -> str:
            if not s:
                return '""'
            s = s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
            return f'"{s}"'

        lines = ["version: \"3.0\"", "stories:"]
        for i, dialogue in enumerate(dialogues):
            did = dialogue.get("dialogue_id", f"dialogue_{i}")
            # Use safe story id (Rasa story names are identifiers)
            story_name = did.replace(" ", "_") if isinstance(did, str) else f"dialogue_{i}"
            lines.append(f"- story: {story_name}")
            lines.append("  steps:")
            for turn in dialogue.get("turns", []):
                role = turn.get("role", "").strip()
                text = (turn.get("text") or "").strip()
                if not text:
                    continue
                if role.lower() == "user":
                    lines.append(f"  - user: {escape(text)}")
                else:
                    lines.append(f"  - bot: {escape(text)}")
        with open(output_path, 'w') as f:
            f.write("\n".join(lines))
            f.write("\n")
