#!/usr/bin/env python3
"""
Comprehensive Evaluation Pipeline for GoalConvo Framework

Evaluates synthetic dialogues, few-shot hub data, and MultiWOZ data using metrics from the research paper.
Compares all three datasets to show quality and diversity metrics.
"""

import json
import logging
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# Add src to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from goalconvo.config import Config
from goalconvo.evaluator import Evaluator
from goalconvo.dataset_store import DatasetStore
from goalconvo.utils import load_json

logger = logging.getLogger(__name__)

class ComprehensiveEvaluator:
    """Comprehensive evaluator that compares MultiWOZ, few-shot hub, and synthetic data."""
    
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
    
    def load_few_shot_hub_dialogues(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Load few-shot hub dialogues (high-quality synthetic examples)."""
        logger.info("Loading few-shot hub dialogues...")
        
        all_hub_dialogues = []
        for domain in self.config.domains:
            hub_dialogues = self.dataset_store.load_few_shot_examples(domain, num_examples=1000)
            all_hub_dialogues.extend(hub_dialogues)
        
        if limit:
            all_hub_dialogues = all_hub_dialogues[:limit]
        
        logger.info(f"Loaded {len(all_hub_dialogues)} few-shot hub dialogues")
        return all_hub_dialogues
    
    def load_multiwoz_dialogues(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Load MultiWOZ dialogues from processed data."""
        logger.info("Loading MultiWOZ dialogues...")
        
        multiwoz_file = Path(self.config.multiwoz_dir) / "processed_dialogues.json"
        
        if not multiwoz_file.exists():
            logger.error(f"MultiWOZ processed data not found: {multiwoz_file}")
            logger.error("Please run scripts/download_multiwoz.py first")
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
    
    def run_comprehensive_evaluation(
        self,
        synthetic_dialogues: List[Dict[str, Any]],
        few_shot_dialogues: List[Dict[str, Any]],
        multiwoz_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Run comprehensive evaluation comparing all three datasets.
        
        Args:
            synthetic_dialogues: List of all synthetic dialogue data
            few_shot_dialogues: List of few-shot hub dialogue data
            multiwoz_dialogues: List of real MultiWOZ dialogue data
            
        Returns:
            Complete evaluation results
        """
        logger.info("Starting comprehensive evaluation pipeline...")
        
        results = {
            "evaluation_timestamp": datetime.now().isoformat(),
            "dataset_sizes": {
                "synthetic": len(synthetic_dialogues),
                "few_shot_hub": len(few_shot_dialogues),
                "multiwoz": len(multiwoz_dialogues)
            },
            "synthetic_vs_multiwoz": {},
            "few_shot_vs_multiwoz": {},
            "synthetic_vs_few_shot": {},
            "three_way_comparison": {}
        }
        
        # Evaluate synthetic vs MultiWOZ
        if synthetic_dialogues and multiwoz_dialogues:
            logger.info("Evaluating synthetic dialogues vs MultiWOZ...")
            results["synthetic_vs_multiwoz"] = self.evaluator.evaluate_synthetic_vs_real(
                synthetic_dialogues, multiwoz_dialogues
            )
        
        # Evaluate few-shot hub vs MultiWOZ
        if few_shot_dialogues and multiwoz_dialogues:
            logger.info("Evaluating few-shot hub dialogues vs MultiWOZ...")
            results["few_shot_vs_multiwoz"] = self.evaluator.evaluate_synthetic_vs_real(
                few_shot_dialogues, multiwoz_dialogues
            )
        
        # Evaluate synthetic vs few-shot hub
        if synthetic_dialogues and few_shot_dialogues:
            logger.info("Evaluating synthetic dialogues vs few-shot hub...")
            results["synthetic_vs_few_shot"] = self.evaluator.evaluate_synthetic_vs_real(
                synthetic_dialogues, few_shot_dialogues
            )
        
        # Three-way comparison statistics
        results["three_way_comparison"] = self._compute_three_way_comparison(
            synthetic_dialogues, few_shot_dialogues, multiwoz_dialogues
        )
        
        # Generate comprehensive report
        report_text = self._generate_comprehensive_report(results)
        
        # Save results
        self._save_evaluation_results(results, report_text)
        
        logger.info("Comprehensive evaluation completed successfully!")
        return results
    
    def _compute_three_way_comparison(
        self,
        synthetic: List[Dict[str, Any]],
        few_shot: List[Dict[str, Any]],
        multiwoz: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compute three-way comparison statistics."""
        logger.info("Computing three-way comparison statistics...")
        
        def get_stats(dialogues: List[Dict[str, Any]], name: str) -> Dict[str, Any]:
            if not dialogues:
                return {"name": name, "count": 0}
            
            turn_counts = [len(d.get("turns", [])) for d in dialogues]
            lengths = [len(self.evaluator._extract_dialogue_text(d)) for d in dialogues]
            
            return {
                "name": name,
                "count": len(dialogues),
                "avg_turns": float(sum(turn_counts) / len(turn_counts)) if turn_counts else 0.0,
                "std_turns": float((sum((x - sum(turn_counts)/len(turn_counts))**2 for x in turn_counts) / len(turn_counts))**0.5) if turn_counts else 0.0,
                "avg_length": float(sum(lengths) / len(lengths)) if lengths else 0.0,
                "std_length": float((sum((x - sum(lengths)/len(lengths))**2 for x in lengths) / len(lengths))**0.5) if lengths else 0.0,
                "min_turns": min(turn_counts) if turn_counts else 0,
                "max_turns": max(turn_counts) if turn_counts else 0
            }
        
        return {
            "synthetic": get_stats(synthetic, "Synthetic"),
            "few_shot_hub": get_stats(few_shot, "Few-Shot Hub"),
            "multiwoz": get_stats(multiwoz, "MultiWOZ")
        }
    
    def _generate_comprehensive_report(self, results: Dict[str, Any]) -> str:
        """Generate comprehensive evaluation report."""
        report_lines = [
            "=" * 80,
            "GOALCONVO COMPREHENSIVE EVALUATION REPORT",
            "=" * 80,
            f"Evaluation Date: {results.get('evaluation_timestamp', 'N/A')}",
            "",
            "DATASET SIZES",
            "-" * 80,
            f"Synthetic Dialogues: {results['dataset_sizes']['synthetic']}",
            f"Few-Shot Hub Dialogues: {results['dataset_sizes']['few_shot_hub']}",
            f"MultiWOZ Dialogues: {results['dataset_sizes']['multiwoz']}",
            "",
        ]
        
        # Three-way comparison
        comparison = results.get("three_way_comparison", {})
        report_lines.extend([
            "THREE-WAY COMPARISON",
            "-" * 80,
            "",
            "Turn Statistics:",
        ])
        
        for dataset_name in ["synthetic", "few_shot_hub", "multiwoz"]:
            stats = comparison.get(dataset_name, {})
            if stats.get("count", 0) > 0:
                report_lines.append(f"  {stats['name']}:")
                report_lines.append(f"    Count: {stats['count']}")
                report_lines.append(f"    Avg Turns: {stats['avg_turns']:.2f} ± {stats['std_turns']:.2f}")
                report_lines.append(f"    Turn Range: {stats['min_turns']} - {stats['max_turns']}")
                report_lines.append(f"    Avg Length: {stats['avg_length']:.0f} ± {stats['std_length']:.0f} chars")
                report_lines.append("")
        
        # Synthetic vs MultiWOZ
        if results.get("synthetic_vs_multiwoz"):
            report_lines.extend([
                "SYNTHETIC vs MULTIWOZ",
                "-" * 80,
            ])
            report_lines.append(self._format_evaluation_section(results["synthetic_vs_multiwoz"]))
            report_lines.append("")
        
        # Few-Shot Hub vs MultiWOZ
        if results.get("few_shot_vs_multiwoz"):
            report_lines.extend([
                "FEW-SHOT HUB vs MULTIWOZ",
                "-" * 80,
            ])
            report_lines.append(self._format_evaluation_section(results["few_shot_vs_multiwoz"]))
            report_lines.append("")
        
        # Synthetic vs Few-Shot Hub
        if results.get("synthetic_vs_few_shot"):
            report_lines.extend([
                "SYNTHETIC vs FEW-SHOT HUB",
                "-" * 80,
            ])
            report_lines.append(self._format_evaluation_section(results["synthetic_vs_few_shot"]))
            report_lines.append("")
        
        report_lines.append("=" * 80)
        
        return "\n".join(report_lines)
    
    def _format_evaluation_section(self, eval_results: Dict[str, Any]) -> str:
        """Format an evaluation section for the report."""
        lines = []
        
        # Semantic Similarity
        semantic = eval_results.get("semantic_similarity", {})
        lines.append(f"BERTScore: {semantic.get('overall_bertscore', 0.0):.3f} (Target: {semantic.get('target_score', 0.71):.3f})")
        
        # Diversity
        diversity = eval_results.get("diversity_metrics", {})
        synth_div = diversity.get("synthetic_diversity", {})
        real_div = diversity.get("real_diversity", {})
        lines.append(f"Diversity - Synthetic: {synth_div.get('combined', 0.0):.3f}, Real: {real_div.get('combined', 0.0):.3f}")
        
        # Goal Relevance
        goal_rel = eval_results.get("goal_relevance", {})
        lines.append(f"Goal Relevance: {goal_rel.get('overall_goal_relevance', 0.0):.3f} (Target: {goal_rel.get('target_goal_relevance', 0.85):.3f})")
        
        return "\n".join(lines)
    
    def _save_evaluation_results(self, results: Dict[str, Any], report_text: str) -> None:
        """Save evaluation results to files."""
        results_dir = Path(self.config.data_dir) / "results"
        results_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save JSON results
        results_file = results_dir / f"comprehensive_evaluation_{timestamp}.json"
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # Save text report
        report_file = results_dir / f"comprehensive_evaluation_report_{timestamp}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        # Also save as latest
        latest_results = results_dir / "comprehensive_evaluation_latest.json"
        latest_report = results_dir / "comprehensive_evaluation_report_latest.txt"
        
        with open(latest_results, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        with open(latest_report, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        logger.info(f"Saved evaluation results to {results_file}")
        logger.info(f"Saved evaluation report to {report_file}")
    
    def print_summary(self, results: Dict[str, Any]) -> None:
        """Print evaluation summary to console."""
        print("\n" + "="*80)
        print("GOALCONVO COMPREHENSIVE EVALUATION SUMMARY")
        print("="*80)
        
        # Dataset sizes
        sizes = results.get("dataset_sizes", {})
        print(f"\nDataset Sizes:")
        print(f"  Synthetic: {sizes.get('synthetic', 0)}")
        print(f"  Few-Shot Hub: {sizes.get('few_shot_hub', 0)}")
        print(f"  MultiWOZ: {sizes.get('multiwoz', 0)}")
        
        # Three-way comparison
        comparison = results.get("three_way_comparison", {})
        print(f"\nAverage Turns:")
        for dataset_name in ["synthetic", "few_shot_hub", "multiwoz"]:
            stats = comparison.get(dataset_name, {})
            if stats.get("count", 0) > 0:
                print(f"  {stats['name']}: {stats['avg_turns']:.2f} ± {stats['std_turns']:.2f}")
        
        # Synthetic vs MultiWOZ
        if results.get("synthetic_vs_multiwoz"):
            print(f"\nSynthetic vs MultiWOZ:")
            semantic = results["synthetic_vs_multiwoz"].get("semantic_similarity", {})
            print(f"  BERTScore: {semantic.get('overall_bertscore', 0.0):.3f}")
        
        # Few-Shot Hub vs MultiWOZ
        if results.get("few_shot_vs_multiwoz"):
            print(f"\nFew-Shot Hub vs MultiWOZ:")
            semantic = results["few_shot_vs_multiwoz"].get("semantic_similarity", {})
            print(f"  BERTScore: {semantic.get('overall_bertscore', 0.0):.3f}")
        
        print("\n" + "="*80)
        print(f"\nDetailed report saved to: data/results/comprehensive_evaluation_report_latest.txt")

def main():
    """Main function for comprehensive evaluation pipeline."""
    parser = argparse.ArgumentParser(
        description="Comprehensive evaluation of synthetic, few-shot hub, and MultiWOZ dialogues"
    )
    parser.add_argument("--synthetic-limit", type=int, help="Limit number of synthetic dialogues")
    parser.add_argument("--few-shot-limit", type=int, help="Limit number of few-shot hub dialogues")
    parser.add_argument("--multiwoz-limit", type=int, help="Limit number of MultiWOZ dialogues")
    parser.add_argument("--skip-few-shot", action="store_true", help="Skip few-shot hub evaluation")
    parser.add_argument("--config", type=str, help="Path to config file")
    parser.add_argument("--log-level", type=str, default="INFO", 
                       choices=["DEBUG", "INFO", "WARNING", "ERROR"])
    
    args = parser.parse_args()
    
    # Setup logging
    logging.basicConfig(
        level=getattr(logging, args.log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('comprehensive_evaluation.log'),
            logging.StreamHandler()
        ]
    )
    
    # Load configuration
    config = Config()
    
    # Initialize evaluator
    evaluator = ComprehensiveEvaluator(config)
    
    try:
        # Load dialogues
        synthetic_dialogues = evaluator.load_synthetic_dialogues(limit=args.synthetic_limit)
        multiwoz_dialogues = evaluator.load_multiwoz_dialogues(limit=args.multiwoz_limit)
        
        few_shot_dialogues = []
        if not args.skip_few_shot:
            few_shot_dialogues = evaluator.load_few_shot_hub_dialogues(limit=args.few_shot_limit)
        
        if not synthetic_dialogues:
            logger.error("No synthetic dialogues found. Please generate dialogues first.")
            return 1
        
        if not multiwoz_dialogues:
            logger.error("No MultiWOZ dialogues found. Please run scripts/download_multiwoz.py first.")
            return 1
        
        # Run comprehensive evaluation
        results = evaluator.run_comprehensive_evaluation(
            synthetic_dialogues, few_shot_dialogues, multiwoz_dialogues
        )
        
        # Print summary
        evaluator.print_summary(results)
        
        return 0
        
    except Exception as e:
        logger.error(f"Error in comprehensive evaluation pipeline: {e}", exc_info=True)
        return 1

if __name__ == "__main__":
    exit(main())

