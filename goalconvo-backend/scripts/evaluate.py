#!/usr/bin/env python3
"""
Evaluation Pipeline for GoalConvo Framework

Evaluates synthetic dialogues against MultiWOZ data using metrics from the research paper.
"""

import json
import logging
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional

# Add src to path for imports
import sys
sys.path.append(str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.evaluator import Evaluator
from goalconvo.dataset_store import DatasetStore
from goalconvo.utils import load_json

logger = logging.getLogger(__name__)

class GoalConvoEvaluator:
    """Main evaluator class that orchestrates evaluation pipeline."""
    
    def __init__(self, config: Config):
        """Initialize the evaluator."""
        self.config = config
        self.evaluator = Evaluator(config)
        self.dataset_store = DatasetStore(config)
        
        # Results storage
        self.results = {}
    
    def load_synthetic_dialogues(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Load synthetic dialogues from dataset store."""
        logger.info("Loading synthetic dialogues...")
        
        dialogues = self.dataset_store.load_dialogues(limit=limit)
        logger.info(f"Loaded {len(dialogues)} synthetic dialogues")
        
        return dialogues
    
    def load_multiwoz_dialogues(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Load MultiWOZ dialogues from processed data."""
        logger.info("Loading MultiWOZ dialogues...")
        
        multiwoz_file = Path(self.config.multiwoz_dir) / "processed_dialogues.json"
        
        if not multiwoz_file.exists():
            logger.error(f"MultiWOZ processed data not found: {multiwoz_file}")
            logger.error("Please run download_multiwoz.py first")
            return []
        
        try:
            dialogues = load_json(str(multiwoz_file))
            if limit:
                dialogues = dialogues[:limit]
            
            logger.info(f"Loaded {len(dialogues)} MultiWOZ dialogues")
            return dialogues
            
        except Exception as e:
            logger.error(f"Error loading MultiWOZ dialogues: {e}")
            return []
    
    def run_evaluation(
        self, 
        synthetic_dialogues: List[Dict[str, Any]], 
        real_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Run complete evaluation pipeline.
        
        Args:
            synthetic_dialogues: List of synthetic dialogue data
            real_dialogues: List of real MultiWOZ dialogue data
            
        Returns:
            Complete evaluation results
        """
        logger.info("Starting evaluation pipeline...")
        
        if not synthetic_dialogues:
            logger.error("No synthetic dialogues provided")
            return {}
        
        if not real_dialogues:
            logger.error("No real dialogues provided")
            return {}
        
        # Run evaluation
        results = self.evaluator.evaluate_synthetic_vs_real(synthetic_dialogues, real_dialogues)
        
        # Generate report
        report_text = self.evaluator.generate_evaluation_report(results)
        
        # Save results
        self._save_evaluation_results(results, report_text)
        
        logger.info("Evaluation completed successfully!")
        return results
    
    def _save_evaluation_results(self, results: Dict[str, Any], report_text: str) -> None:
        """Save evaluation results to files."""
        results_dir = Path(self.config.data_dir) / "results"
        results_dir.mkdir(exist_ok=True)
        
        # Save JSON results
        results_file = results_dir / "evaluation_results.json"
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # Save text report
        report_file = results_dir / "evaluation_report.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        logger.info(f"Saved evaluation results to {results_file}")
        logger.info(f"Saved evaluation report to {report_file}")
    
    def print_summary(self, results: Dict[str, Any]) -> None:
        """Print evaluation summary to console."""
        print("\n" + "="*60)
        print("GOALCONVO EVALUATION SUMMARY")
        print("="*60)
        
        # Semantic Similarity
        semantic = results.get("semantic_similarity", {})
        print(f"\nSEMANTIC SIMILARITY (BERTScore)")
        print(f"Overall BERTScore: {semantic.get('overall_bertscore', 0.0):.3f}")
        print(f"Target Score: {semantic.get('target_score', 0.71):.3f}")
        
        # Diversity Metrics
        diversity = results.get("diversity_metrics", {})
        synth_div = diversity.get("synthetic_diversity", {})
        real_div = diversity.get("real_diversity", {})
        print(f"\nDIVERSITY METRICS")
        print(f"Synthetic Diversity: {synth_div.get('combined', 0.0):.3f}")
        print(f"Real Diversity: {real_div.get('combined', 0.0):.3f}")
        print(f"Target Diversity: {diversity.get('target_diversity', 0.46):.3f}")
        
        # Goal Relevance
        goal_rel = results.get("goal_relevance", {})
        print(f"\nGOAL RELEVANCE")
        print(f"Overall Goal Relevance: {goal_rel.get('overall_goal_relevance', 0.0):.3f}")
        print(f"Target Goal Relevance: {goal_rel.get('target_goal_relevance', 0.85):.3f}")
        
        # Domain Analysis
        domain_analysis = results.get("domain_analysis", {})
        print(f"\nDOMAIN ANALYSIS")
        for domain, stats in domain_analysis.items():
            print(f"{domain}: {stats.get('synthetic_count', 0)} synthetic, {stats.get('real_count', 0)} real")
        
        # Statistical Analysis
        stats = results.get("statistical_analysis", {})
        synth_stats = stats.get("synthetic", {})
        real_stats = stats.get("real", {})
        print(f"\nSTATISTICAL ANALYSIS")
        print(f"Synthetic Dialogues: {synth_stats.get('total_dialogues', 0)}")
        print(f"Real Dialogues: {real_stats.get('total_dialogues', 0)}")
        print(f"Avg Turns (Synthetic): {synth_stats.get('avg_turns', 0.0):.1f}")
        print(f"Avg Turns (Real): {real_stats.get('avg_turns', 0.0):.1f}")
        
        print("\n" + "="*60)

def main():
    """Main function for evaluation pipeline."""
    parser = argparse.ArgumentParser(description="Evaluate synthetic dialogues against MultiWOZ")
    parser.add_argument("--synthetic-limit", type=int, help="Limit number of synthetic dialogues to evaluate")
    parser.add_argument("--real-limit", type=int, help="Limit number of real dialogues to evaluate")
    parser.add_argument("--output-dir", type=str, help="Output directory for results")
    parser.add_argument("--config", type=str, help="Path to config file")
    parser.add_argument("--log-level", type=str, default="INFO", 
                       choices=["DEBUG", "INFO", "WARNING", "ERROR"])
    
    args = parser.parse_args()
    
    # Setup logging
    logging.basicConfig(
        level=getattr(logging, args.log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('evaluation.log'),
            logging.StreamHandler()
        ]
    )
    
    # Load configuration
    config = Config()
    if args.output_dir:
        config.data_dir = args.output_dir
    
    # Initialize evaluator
    evaluator = GoalConvoEvaluator(config)
    
    try:
        # Load dialogues
        synthetic_dialogues = evaluator.load_synthetic_dialogues(limit=args.synthetic_limit)
        real_dialogues = evaluator.load_multiwoz_dialogues(limit=args.real_limit)
        
        if not synthetic_dialogues:
            logger.error("No synthetic dialogues found. Please generate dialogues first.")
            return 1
        
        if not real_dialogues:
            logger.error("No MultiWOZ dialogues found. Please run download_multiwoz.py first.")
            return 1
        
        # Run evaluation
        results = evaluator.run_evaluation(synthetic_dialogues, real_dialogues)
        
        # Print summary
        evaluator.print_summary(results)
        
        return 0
        
    except Exception as e:
        logger.error(f"Error in evaluation pipeline: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
