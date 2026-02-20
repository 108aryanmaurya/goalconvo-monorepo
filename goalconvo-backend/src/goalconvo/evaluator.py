"""
Evaluator for computing metrics on generated dialogues.

Implements BERTScore, diversity metrics, goal relevance, and domain-wise analysis
as described in the research paper.
"""

import json
import logging
import math
import re
from typing import Dict, List, Any, Optional, Tuple
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
from bert_score import score as bert_score
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

from .config import Config
from .utils import load_json, save_json, ensure_dir

logger = logging.getLogger(__name__)

class Evaluator:
    """Evaluates synthetic dialogues using metrics from the research paper."""
    
    def __init__(self, config: Config):
        """Initialize the evaluator."""
        self.config = config
        self.results_dir = Path(config.data_dir) / "results"
        ensure_dir(str(self.results_dir))
        
        # Initialize BERTScore model
        self.bertscore_model = config.bertscore_model
        
        # Cache for computed metrics
        self.metrics_cache = {}
    
    def evaluate_synthetic_vs_real(
        self, 
        synthetic_dialogues: List[Dict[str, Any]], 
        real_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Evaluate synthetic dialogues against real MultiWOZ dialogues.
        
        Args:
            synthetic_dialogues: List of synthetic dialogue data
            real_dialogues: List of real MultiWOZ dialogue data
            
        Returns:
            Dictionary with evaluation results
        """
        logger.info(f"Evaluating {len(synthetic_dialogues)} synthetic vs {len(real_dialogues)} real dialogues")
        
        results = {
            "semantic_similarity": self._compute_semantic_similarity(synthetic_dialogues, real_dialogues),
            "diversity_metrics": self._compute_diversity_metrics(synthetic_dialogues, real_dialogues),
            "goal_relevance": self._compute_goal_relevance(synthetic_dialogues),
            "domain_analysis": self._compute_domain_analysis(synthetic_dialogues, real_dialogues),
            "statistical_analysis": self._compute_statistical_analysis(synthetic_dialogues, real_dialogues)
        }
        
        # Save results
        self._save_evaluation_results(results)
        
        return results
    
    BERTSCORE_FALLBACK_MODEL = "bert-base-uncased"

    def _bertscore_one_pair(self, cand_text: str, ref_text: str, max_chars: int = 1000) -> Optional[float]:
        """Compute BERTScore for one pair; retry with shorter text, then fallback model on overflow."""
        def run_bertscore(cand: str, ref: str, model: str):
            P, R, F1 = bert_score([cand], [ref], model_type=model, verbose=False)
            return float(F1.item())

        try:
            return run_bertscore(cand_text, ref_text, self.bertscore_model)
        except (OverflowError, ValueError, Exception) as e:
            err_str = str(e).lower()
            if "int too big to convert" not in err_str and "overflow" not in err_str:
                logger.warning("Error computing BERTScore: %s", e)
                return None
        for cap in [400, 200]:
            c = cand_text[:cap] if len(cand_text) > cap else cand_text
            r = ref_text[:cap] if len(ref_text) > cap else ref_text
            try:
                return run_bertscore(c, r, self.bertscore_model)
            except (OverflowError, ValueError, Exception):
                continue
        try:
            c = cand_text[:512] if len(cand_text) > 512 else cand_text
            r = ref_text[:512] if len(ref_text) > 512 else ref_text
            return run_bertscore(c, r, self.BERTSCORE_FALLBACK_MODEL)
        except Exception as e:
            logger.warning("Error computing BERTScore (fallback model): %s", e)
            return None

    def _compute_semantic_similarity(
        self, 
        synthetic_dialogues: List[Dict[str, Any]], 
        real_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compute BERTScore semantic similarity between synthetic and real dialogues."""
        logger.info("Computing semantic similarity (BERTScore)...")
        
        # Group real dialogues by domain for matching
        real_by_domain = {}
        for dialogue in real_dialogues:
            domain = dialogue.get("domain", "unknown")
            if domain not in real_by_domain:
                real_by_domain[domain] = []
            real_by_domain[domain].append(dialogue)
        
        bert_scores = []
        domain_scores = {}
        
        for synthetic_dialogue in synthetic_dialogues:
            domain = synthetic_dialogue.get("domain", "unknown")
            
            if domain not in real_by_domain or not real_by_domain[domain]:
                continue
            
            # Find closest real dialogue in same domain
            synthetic_text = self._extract_dialogue_text(synthetic_dialogue)
            best_score = 0.0
            # Truncate to avoid "int too big to convert" / overflow (DeBERTa max 512 tokens)
            max_chars = 1000
            syn_trunc = synthetic_text[:max_chars] if len(synthetic_text) > max_chars else synthetic_text
            
            for real_dialogue in real_by_domain[domain]:
                real_text = self._extract_dialogue_text(real_dialogue)
                ref_trunc = real_text[:max_chars] if len(real_text) > max_chars else real_text
                
                score = self._bertscore_one_pair(syn_trunc, ref_trunc, max_chars)
                if score is not None:
                    best_score = max(best_score, score)
            
            bert_scores.append(best_score)
            
            # Track by domain
            if domain not in domain_scores:
                domain_scores[domain] = []
            domain_scores[domain].append(best_score)
        
        # Compute statistics
        overall_bertscore = np.mean(bert_scores) if bert_scores else 0.0
        
        domain_bertscores = {}
        for domain, scores in domain_scores.items():
            domain_bertscores[domain] = {
                "mean": np.mean(scores),
                "std": np.std(scores),
                "count": len(scores)
            }
        
        return {
            "overall_bertscore": overall_bertscore,
            "domain_bertscores": domain_bertscores,
            "individual_scores": bert_scores,
            "target_score": 0.71  # From research paper
        }
    
    def _compute_diversity_metrics(
        self, 
        synthetic_dialogues: List[Dict[str, Any]], 
        real_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compute lexical diversity metrics."""
        logger.info("Computing diversity metrics...")
        
        # Extract all text from dialogues
        synthetic_texts = [self._extract_dialogue_text(d) for d in synthetic_dialogues]
        real_texts = [self._extract_dialogue_text(d) for d in real_dialogues]
        
        # Compute diversity metrics
        synthetic_diversity = self._compute_dialogue_diversity(synthetic_texts)
        real_diversity = self._compute_dialogue_diversity(real_texts)
        
        return {
            "synthetic_diversity": synthetic_diversity,
            "real_diversity": real_diversity,
            "diversity_ratio": synthetic_diversity["combined"] / real_diversity["combined"] if real_diversity["combined"] > 0 else 0.0,
            "target_diversity": 0.46  # From research paper
        }
    
    def _compute_dialogue_diversity(self, texts: List[str]) -> Dict[str, float]:
        """Compute diversity (Distinct-1, Distinct-2). Per-dialogue average + word-level tokenization (matches comprehensive eval)."""
        if not texts:
            return {"distinct_1": 0.0, "distinct_2": 0.0, "combined": 0.0}

        def tokenize(text: str) -> List[str]:
            return re.findall(r'\b\w+\b', text.lower())

        def distinct_for_tokens(tokens: List[str]) -> Tuple[float, float]:
            if not tokens:
                return 0.0, 0.0
            uniq_1 = len(set(tokens)) / len(tokens)
            bigrams = [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]
            uniq_2 = len(set(bigrams)) / len(bigrams) if bigrams else 0.0
            return uniq_1, uniq_2

        per_d1, per_d2 = [], []
        for text in texts:
            tokens = tokenize(text)
            d1, d2 = distinct_for_tokens(tokens)
            if tokens:
                per_d1.append(d1)
                per_d2.append(d2)

        if not per_d1:
            return {"distinct_1": 0.0, "distinct_2": 0.0, "combined": 0.0}

        distinct_1 = float(np.mean(per_d1))
        distinct_2 = float(np.mean(per_d2))
        combined = (distinct_1 + distinct_2) / 2
        return {
            "distinct_1": distinct_1,
            "distinct_2": distinct_2,
            "combined": combined
        }
    
    def _compute_goal_relevance(self, synthetic_dialogues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compute goal relevance metrics."""
        logger.info("Computing goal relevance...")
        
        goal_satisfied_count = 0
        domain_goal_satisfaction = {}
        
        for dialogue in synthetic_dialogues:
            domain = dialogue.get("domain", "unknown")
            goal = dialogue.get("goal", "")
            turns = dialogue.get("turns", [])
            
            # Check if goal is satisfied (simple keyword-based approach)
            is_satisfied = self._check_goal_satisfaction(goal, turns)
            
            if is_satisfied:
                goal_satisfied_count += 1
            
            # Track by domain
            if domain not in domain_goal_satisfaction:
                domain_goal_satisfaction[domain] = {"satisfied": 0, "total": 0}
            
            domain_goal_satisfaction[domain]["total"] += 1
            if is_satisfied:
                domain_goal_satisfaction[domain]["satisfied"] += 1
        
        # Compute percentages
        total_dialogues = len(synthetic_dialogues)
        overall_goal_relevance = goal_satisfied_count / total_dialogues if total_dialogues > 0 else 0.0
        
        domain_goal_relevance = {}
        for domain, stats in domain_goal_satisfaction.items():
            domain_goal_relevance[domain] = {
                "satisfied": stats["satisfied"],
                "total": stats["total"],
                "percentage": stats["satisfied"] / stats["total"] if stats["total"] > 0 else 0.0
            }
        
        return {
            "overall_goal_relevance": overall_goal_relevance,
            "domain_goal_relevance": domain_goal_relevance,
            "target_goal_relevance": 0.85  # From research paper
        }
    
    def _check_goal_satisfaction(self, goal: str, turns: List[Dict[str, str]]) -> bool:
        """Check if a goal is satisfied based on dialogue turns."""
        if not turns:
            return False
        
        # Look for completion indicators in the last few turns
        recent_turns = turns[-3:] if len(turns) >= 3 else turns
        
        completion_keywords = [
            "thank you", "thanks", "perfect", "great", "excellent", "that's great", "that works",
            "sounds good", "all set", "i'm all set", "that's exactly what I needed", "that'll work",
            "booked", "confirmed", "reserved", "done", "completed", "appreciate it", "good, thank"
        ]
        
        for turn in recent_turns:
            if turn.get("role") == "User":
                text = turn.get("text", "").lower()
                if any(keyword in text for keyword in completion_keywords):
                    return True
        
        return False
    
    def _compute_domain_analysis(
        self, 
        synthetic_dialogues: List[Dict[str, Any]], 
        real_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compute domain-wise analysis."""
        logger.info("Computing domain-wise analysis...")
        
        # Group dialogues by domain
        synthetic_by_domain = self._group_dialogues_by_domain(synthetic_dialogues)
        real_by_domain = self._group_dialogues_by_domain(real_dialogues)
        
        domain_analysis = {}
        
        for domain in self.config.domains:
            synth_domain = synthetic_by_domain.get(domain, [])
            real_domain = real_by_domain.get(domain, [])
            
            if not synth_domain or not real_domain:
                continue
            
            # Compute metrics for this domain
            domain_metrics = {
                "synthetic_count": len(synth_domain),
                "real_count": len(real_domain),
                "avg_turns_synthetic": np.mean([len(d.get("turns", [])) for d in synth_domain]),
                "avg_turns_real": np.mean([len(d.get("turns", [])) for d in real_domain]),
                "avg_length_synthetic": np.mean([len(self._extract_dialogue_text(d)) for d in synth_domain]),
                "avg_length_real": np.mean([len(self._extract_dialogue_text(d)) for d in real_domain])
            }
            
            domain_analysis[domain] = domain_metrics
        
        return domain_analysis
    
    def _compute_statistical_analysis(
        self, 
        synthetic_dialogues: List[Dict[str, Any]], 
        real_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compute statistical analysis of dialogues."""
        logger.info("Computing statistical analysis...")
        
        # Extract statistics
        synth_stats = self._compute_dialogue_statistics(synthetic_dialogues)
        real_stats = self._compute_dialogue_statistics(real_dialogues)
        
        return {
            "synthetic": synth_stats,
            "real": real_stats,
            "comparison": {
                "turn_ratio": synth_stats["avg_turns"] / real_stats["avg_turns"] if real_stats["avg_turns"] > 0 else 0.0,
                "length_ratio": synth_stats["avg_length"] / real_stats["avg_length"] if real_stats["avg_length"] > 0 else 0.0
            }
        }
    
    def _compute_dialogue_statistics(self, dialogues: List[Dict[str, Any]]) -> Dict[str, float]:
        """Compute basic statistics for a set of dialogues."""
        if not dialogues:
            return {"avg_turns": 0.0, "avg_length": 0.0, "total_dialogues": 0}
        
        turn_counts = [len(d.get("turns", [])) for d in dialogues]
        lengths = [len(self._extract_dialogue_text(d)) for d in dialogues]
        
        return {
            "avg_turns": np.mean(turn_counts),
            "std_turns": np.std(turn_counts),
            "avg_length": np.mean(lengths),
            "std_length": np.std(lengths),
            "total_dialogues": len(dialogues)
        }
    
    def _group_dialogues_by_domain(self, dialogues: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Group dialogues by domain."""
        grouped = {}
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            if domain not in grouped:
                grouped[domain] = []
            grouped[domain].append(dialogue)
        return grouped
    
    def _extract_dialogue_text(self, dialogue: Dict[str, Any]) -> str:
        """Extract text content from a dialogue."""
        turns = dialogue.get("turns", [])
        texts = []
        for turn in turns:
            texts.append(turn.get("text", ""))
        return " ".join(texts)
    
    def _save_evaluation_results(self, results: Dict[str, Any]) -> None:
        """Save evaluation results to file."""
        timestamp = pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")
        results_file = self.results_dir / f"evaluation_results_{timestamp}.json"
        
        save_json(results, str(results_file))
        logger.info(f"Saved evaluation results to {results_file}")
    
    def generate_evaluation_report(
        self, 
        results: Dict[str, Any], 
        output_path: Optional[str] = None
    ) -> str:
        """Generate a human-readable evaluation report."""
        if output_path is None:
            output_path = str(self.results_dir / "evaluation_report.txt")
        
        report_lines = [
            "GoalConvo Evaluation Report",
            "=" * 50,
            "",
            "SEMANTIC SIMILARITY (BERTScore)",
            f"Overall BERTScore: {results['semantic_similarity']['overall_bertscore']:.3f}",
            f"Target Score: {results['semantic_similarity']['target_score']:.3f}",
            "",
            "Domain-wise BERTScore:",
        ]
        
        for domain, scores in results['semantic_similarity']['domain_bertscores'].items():
            report_lines.append(f"  {domain}: {scores['mean']:.3f} ± {scores['std']:.3f} (n={scores['count']})")
        
        report_lines.extend([
            "",
            "DIVERSITY METRICS",
            f"Synthetic Diversity: {results['diversity_metrics']['synthetic_diversity']['combined']:.3f}",
            f"Real Diversity: {results['diversity_metrics']['real_diversity']['combined']:.3f}",
            f"Target Diversity: {results['diversity_metrics']['target_diversity']:.3f}",
            "",
            "GOAL RELEVANCE",
            f"Overall Goal Relevance: {results['goal_relevance']['overall_goal_relevance']:.3f}",
            f"Target Goal Relevance: {results['goal_relevance']['target_goal_relevance']:.3f}",
            "",
            "Domain-wise Goal Relevance:",
        ])
        
        for domain, stats in results['goal_relevance']['domain_goal_relevance'].items():
            report_lines.append(f"  {domain}: {stats['percentage']:.3f} ({stats['satisfied']}/{stats['total']})")
        
        report_lines.extend([
            "",
            "STATISTICAL ANALYSIS",
            f"Synthetic Dialogues: {results['statistical_analysis']['synthetic']['total_dialogues']}",
            f"Real Dialogues: {results['statistical_analysis']['real']['total_dialogues']}",
            f"Avg Turns (Synthetic): {results['statistical_analysis']['synthetic']['avg_turns']:.1f}",
            f"Avg Turns (Real): {results['statistical_analysis']['real']['avg_turns']:.1f}",
            f"Avg Length (Synthetic): {results['statistical_analysis']['synthetic']['avg_length']:.1f}",
            f"Avg Length (Real): {results['statistical_analysis']['real']['avg_length']:.1f}",
        ])
        
        report_text = "\n".join(report_lines)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        logger.info(f"Generated evaluation report: {output_path}")
        return report_text
