"""
Human Evaluation Framework for GoalConvo

Enables structured human evaluation of generated dialogues with annotation
and inter-annotator agreement analysis.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger(__name__)

class EvaluationDimension(Enum):
    """Evaluation dimensions for human annotation."""
    COHERENCE = "coherence"
    NATURALNESS = "naturalness"
    TASK_SUCCESS = "task_success"
    FLUENCY = "fluency"
    RELEVANCE = "relevance"
    OVERALL_QUALITY = "overall_quality"


@dataclass
class HumanAnnotation:
    """Single human annotation for a dialogue."""
    annotation_id: str
    dialogue_id: str
    annotator_id: str
    timestamp: str
    dimensions: Dict[str, float]  # dimension -> score (1-5 scale)
    comments: Optional[str] = None
    task_completed: Optional[bool] = None
    issues: List[str] = None
    
    def __post_init__(self):
        if self.issues is None:
            self.issues = []


@dataclass
class EvaluationTask:
    """Evaluation task assigned to an annotator."""
    task_id: str
    dialogue_id: str
    dialogue_data: Dict[str, Any]
    assigned_to: str
    created_at: str
    completed_at: Optional[str] = None
    status: str = "pending"  # pending, in_progress, completed


class HumanEvaluator:
    """Manages human evaluation tasks and annotations."""
    
    def __init__(self, data_dir: str):
        """Initialize human evaluator."""
        self.data_dir = Path(data_dir)
        self.evaluations_dir = self.data_dir / "human_evaluations"
        self.evaluations_dir.mkdir(parents=True, exist_ok=True)
        
        self.annotations_file = self.evaluations_dir / "annotations.json"
        self.tasks_file = self.evaluations_dir / "tasks.json"
        
        self.annotations: Dict[str, HumanAnnotation] = {}
        self.tasks: Dict[str, EvaluationTask] = {}
        
        self._load_data()
    
    def _load_data(self):
        """Load annotations and tasks from disk."""
        # Load annotations
        if self.annotations_file.exists():
            try:
                with open(self.annotations_file, 'r') as f:
                    data = json.load(f)
                    self.annotations = {
                        aid: HumanAnnotation(**ann_data)
                        for aid, ann_data in data.items()
                    }
                logger.info(f"Loaded {len(self.annotations)} annotations")
            except Exception as e:
                logger.error(f"Error loading annotations: {e}")
        
        # Load tasks
        if self.tasks_file.exists():
            try:
                with open(self.tasks_file, 'r') as f:
                    data = json.load(f)
                    self.tasks = {
                        tid: EvaluationTask(**task_data)
                        for tid, task_data in data.items()
                    }
                logger.info(f"Loaded {len(self.tasks)} evaluation tasks")
            except Exception as e:
                logger.error(f"Error loading tasks: {e}")
    
    def _save_annotations(self):
        """Save annotations to disk."""
        try:
            data = {
                aid: asdict(ann)
                for aid, ann in self.annotations.items()
            }
            with open(self.annotations_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving annotations: {e}")
    
    def _save_tasks(self):
        """Save tasks to disk."""
        try:
            data = {
                tid: asdict(task)
                for tid, task in self.tasks.items()
            }
            with open(self.tasks_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving tasks: {e}")
    
    def create_evaluation_task(
        self,
        dialogue_id: str,
        dialogue_data: Dict[str, Any],
        assigned_to: str
    ) -> str:
        """Create a new evaluation task."""
        task_id = f"task_{dialogue_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        task = EvaluationTask(
            task_id=task_id,
            dialogue_id=dialogue_id,
            dialogue_data=dialogue_data,
            assigned_to=assigned_to,
            created_at=datetime.now().isoformat(),
            status="pending"
        )
        
        self.tasks[task_id] = task
        self._save_tasks()
        
        logger.info(f"Created evaluation task {task_id} for dialogue {dialogue_id}")
        return task_id
    
    def create_evaluation_tasks_batch(
        self,
        dialogues: List[Dict[str, Any]],  # list of {"dialogue_id": str, "dialogue_data": dict}
        assigned_to: str
    ) -> List[str]:
        """Create evaluation tasks for multiple dialogues. Returns list of task_ids."""
        task_ids = []
        for item in dialogues:
            dialogue_id = item.get("dialogue_id")
            dialogue_data = item.get("dialogue_data")
            if not dialogue_id or not dialogue_data:
                continue
            task_id = self.create_evaluation_task(
                dialogue_id=dialogue_id,
                dialogue_data=dialogue_data,
                assigned_to=assigned_to
            )
            task_ids.append(task_id)
        return task_ids
    
    def list_tasks(self, assigned_to: Optional[str] = None) -> List[Dict[str, Any]]:
        """List evaluation tasks, optionally filtered by assigned_to."""
        result = []
        for task in self.tasks.values():
            if assigned_to is not None and task.assigned_to != assigned_to:
                continue
            result.append({
                "task_id": task.task_id,
                "dialogue_id": task.dialogue_id,
                "assigned_to": task.assigned_to,
                "status": task.status,
                "created_at": task.created_at,
                "completed_at": task.completed_at,
            })
        result.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return result
    
    def submit_annotation(
        self,
        task_id: str,
        annotator_id: str,
        dimensions: Dict[str, float],
        comments: Optional[str] = None,
        task_completed: Optional[bool] = None,
        issues: Optional[List[str]] = None
    ) -> str:
        """Submit a human annotation."""
        task = self.tasks.get(task_id)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        if task.assigned_to != annotator_id:
            raise ValueError(f"Task assigned to {task.assigned_to}, not {annotator_id}")
        
        # Validate dimensions
        valid_dimensions = [d.value for d in EvaluationDimension]
        for dim in dimensions.keys():
            if dim not in valid_dimensions:
                raise ValueError(f"Invalid dimension: {dim}")
        
        # Validate scores (1-5 scale)
        for dim, score in dimensions.items():
            if not (1.0 <= score <= 5.0):
                raise ValueError(f"Score for {dim} must be between 1 and 5")
        
        annotation_id = f"ann_{task.dialogue_id}_{annotator_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        annotation = HumanAnnotation(
            annotation_id=annotation_id,
            dialogue_id=task.dialogue_id,
            annotator_id=annotator_id,
            timestamp=datetime.now().isoformat(),
            dimensions=dimensions,
            comments=comments,
            task_completed=task_completed,
            issues=issues or []
        )
        
        self.annotations[annotation_id] = annotation
        
        # Update task status
        task.status = "completed"
        task.completed_at = datetime.now().isoformat()
        
        self._save_annotations()
        self._save_tasks()
        
        logger.info(f"Submitted annotation {annotation_id} for dialogue {task.dialogue_id}")
        return annotation_id
    
    def get_annotations_for_dialogue(self, dialogue_id: str) -> List[HumanAnnotation]:
        """Get all annotations for a dialogue."""
        return [
            ann for ann in self.annotations.values()
            if ann.dialogue_id == dialogue_id
        ]
    
    def get_annotator_annotations(self, annotator_id: str) -> List[HumanAnnotation]:
        """Get all annotations by an annotator."""
        return [
            ann for ann in self.annotations.values()
            if ann.annotator_id == annotator_id
        ]
    
    def compute_inter_annotator_agreement(
        self,
        dialogue_id: str,
        dimension: str
    ) -> Dict[str, Any]:
        """
        Compute inter-annotator agreement for a dialogue.
        
        Returns:
            Dictionary with agreement metrics (agreement rate, kappa if applicable)
        """
        annotations = self.get_annotations_for_dialogue(dialogue_id)
        
        if len(annotations) < 2:
            return {
                "error": "Need at least 2 annotations for agreement analysis",
                "annotation_count": len(annotations)
            }
        
        scores = [ann.dimensions.get(dimension) for ann in annotations]
        scores = [s for s in scores if s is not None]
        
        if not scores:
            return {"error": f"No scores found for dimension {dimension}"}
        
        # Simple agreement: percentage of scores within 1 point
        import numpy as np
        scores_array = np.array(scores)
        mean_score = np.mean(scores_array)
        std_score = np.std(scores_array)
        
        # Agreement rate: percentage within 1 point of mean
        within_one = np.sum(np.abs(scores_array - mean_score) <= 1.0)
        agreement_rate = within_one / len(scores)
        
        return {
            "dimension": dimension,
            "annotation_count": len(annotations),
            "scores": scores,
            "mean": float(mean_score),
            "std": float(std_score),
            "agreement_rate": float(agreement_rate),
            "min": float(np.min(scores_array)),
            "max": float(np.max(scores_array))
        }
    
    def compute_statistics(self) -> Dict[str, Any]:
        """Compute overall evaluation statistics."""
        if not self.annotations:
            return {"error": "No annotations available"}
        
        import numpy as np
        
        # Aggregate scores by dimension
        dimension_scores = {dim.value: [] for dim in EvaluationDimension}
        
        for ann in self.annotations.values():
            for dim, score in ann.dimensions.items():
                if dim in dimension_scores:
                    dimension_scores[dim].append(score)
        
        stats = {}
        for dim, scores in dimension_scores.items():
            if scores:
                stats[dim] = {
                    "mean": float(np.mean(scores)),
                    "std": float(np.std(scores)),
                    "min": float(np.min(scores)),
                    "max": float(np.max(scores)),
                    "count": len(scores)
                }
        
        # Task completion rate
        task_completed_count = sum(
            1 for ann in self.annotations.values()
            if ann.task_completed is True
        )
        total_with_completion = sum(
            1 for ann in self.annotations.values()
            if ann.task_completed is not None
        )
        
        stats["task_completion"] = {
            "completed": task_completed_count,
            "total": total_with_completion,
            "rate": task_completed_count / total_with_completion if total_with_completion > 0 else 0.0
        }
        
        # Annotator statistics
        annotator_counts = {}
        for ann in self.annotations.values():
            annotator_counts[ann.annotator_id] = annotator_counts.get(ann.annotator_id, 0) + 1
        
        stats["annotators"] = {
            "total": len(annotator_counts),
            "annotations_per_annotator": {
                aid: count for aid, count in annotator_counts.items()
            }
        }
        
        return stats
    
    def export_evaluations(self, output_path: str):
        """Export all evaluations to a file."""
        export_data = {
            "annotations": [asdict(ann) for ann in self.annotations.values()],
            "tasks": [asdict(task) for task in self.tasks.values()],
            "statistics": self.compute_statistics(),
            "exported_at": datetime.now().isoformat()
        }
        
        with open(output_path, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        logger.info(f"Exported evaluations to {output_path}")
