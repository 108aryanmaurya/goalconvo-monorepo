#!/usr/bin/env python3
"""
Comprehensive Dialogue Evaluation Script

Implements multiple evaluation metrics for GoalConvo-generated dialogues:
1. Goal Completion Rate (GCR)
2. Task Success Rate (TSR)
3. BLEU Score
4. Dialogue Length / Turns
5. Repetition Rate
6. LLM-as-a-Judge (Task Success, Coherence, Diversity, Fluency, Groundedness)
"""

import json
import logging
import argparse
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from collections import Counter
from datetime import datetime

# Add src to path for imports
import sys
sys.path.append(str(Path(__file__).parent.parent / "src"))

import numpy as np

# NLTK imports with error handling
NLTK_AVAILABLE = True
NLTK_TOKENIZE_AVAILABLE = False

# Simple fallback tokenization function
def simple_word_tokenize(text):
    """Simple word tokenization using split."""
    return text.split()

# Try to import and use NLTK
try:
    from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
    import nltk
    
    # Try to download punkt_tab (newer version) or punkt (older version)
    try:
        nltk.data.find('tokenizers/punkt_tab')
        NLTK_TOKENIZE_AVAILABLE = True
    except (LookupError, OSError):
        try:
            nltk.data.find('tokenizers/punkt')
            NLTK_TOKENIZE_AVAILABLE = True
        except (LookupError, OSError):
            try:
                print("Downloading NLTK punkt_tab tokenizer...")
                nltk.download('punkt_tab', quiet=True)
                NLTK_TOKENIZE_AVAILABLE = True
            except Exception:
                try:
                    print("Downloading NLTK punkt tokenizer...")
                    nltk.download('punkt', quiet=True)
                    NLTK_TOKENIZE_AVAILABLE = True
                except Exception as download_error:
                    print(f"Warning: Could not download NLTK tokenizer: {download_error}")
                    NLTK_TOKENIZE_AVAILABLE = False
    
    # Import word_tokenize only if tokenizer is available
    if NLTK_TOKENIZE_AVAILABLE:
        try:
            from nltk.tokenize import word_tokenize
        except Exception:
            NLTK_TOKENIZE_AVAILABLE = False
            word_tokenize = simple_word_tokenize
    else:
        word_tokenize = simple_word_tokenize
        
except Exception as e:
    # If NLTK is not available, use fallback tokenization
    print(f"Warning: NLTK not available: {e}. Using fallback tokenization.")
    NLTK_AVAILABLE = False
    NLTK_TOKENIZE_AVAILABLE = False
    
    def sentence_bleu(reference, candidate, smoothing_function=None):
        """Fallback BLEU calculation (simplified)"""
        if not reference or not candidate:
            return 0.0
        # Simple word overlap ratio
        ref_words = set(reference)
        cand_words = set(candidate)
        if not ref_words or not cand_words:
            return 0.0
        overlap = len(ref_words & cand_words)
        return overlap / max(len(ref_words), len(cand_words))
    
    class SmoothingFunction:
        def method1(self):
            return None
    
    word_tokenize = simple_word_tokenize

from goalconvo.config import Config
from goalconvo.llm_client import LLMClient
from goalconvo.dataset_store import DatasetStore
from goalconvo.utils import load_json

logger = logging.getLogger(__name__)

class ComprehensiveDialogueEvaluator:
    """Comprehensive evaluator for generated dialogues with multiple metrics."""
    
    def __init__(self, config: Config):
        """Initialize the evaluator."""
        self.config = config
        self.llm_client = LLMClient(config)
        self.dataset_store = DatasetStore(config)
        self.results_dir = Path(config.data_dir) / "results"
        self.results_dir.mkdir(exist_ok=True)
        
        # Smoothing function for BLEU (only if NLTK is available)
        if NLTK_AVAILABLE:
            try:
                self.smoothing = SmoothingFunction().method1
            except Exception:
                self.smoothing = None
        else:
            self.smoothing = None
        
    def evaluate_dialogues(
        self,
        dialogues: List[Dict[str, Any]],
        reference_dialogues: Optional[List[Dict[str, Any]]] = None,
        use_llm_judge: bool = True
    ) -> Dict[str, Any]:
        """
        Evaluate a set of dialogues using all metrics.
        
        Args:
            dialogues: List of generated dialogues to evaluate
            reference_dialogues: Optional reference dialogues (e.g., MultiWOZ) for BLEU
            use_llm_judge: Whether to use LLM-as-a-Judge evaluation
            
        Returns:
            Dictionary with all evaluation metrics
        """
        logger.info(f"Evaluating {len(dialogues)} dialogues...")
        
        results = {
            "evaluation_timestamp": datetime.now().isoformat(),
            "total_dialogues": len(dialogues),
            "metrics": {}
        }
        
        # 1. Goal Completion Rate (GCR)
        logger.info("Computing Goal Completion Rate...")
        gcr_results = self._compute_goal_completion_rate(dialogues)
        results["metrics"]["goal_completion_rate"] = gcr_results
        
        # 2. Task Success Rate (TSR)
        logger.info("Computing Task Success Rate...")
        tsr_results = self._compute_task_success_rate(dialogues)
        results["metrics"]["task_success_rate"] = tsr_results
        
        # 3. BLEU Score (if reference dialogues provided)
        if reference_dialogues:
            logger.info("Computing BLEU Scores...")
            bleu_results = self._compute_bleu_scores(dialogues, reference_dialogues)
            results["metrics"]["bleu_score"] = bleu_results
        
        # 4. Dialogue Length / Turns
        logger.info("Computing dialogue length and turns...")
        length_results = self._compute_dialogue_length_metrics(dialogues)
        results["metrics"]["dialogue_length"] = length_results
        
        # 5. Repetition Rate
        logger.info("Computing repetition rate...")
        repetition_results = self._compute_repetition_rate(dialogues)
        results["metrics"]["repetition_rate"] = repetition_results
        
        # 6. LLM-as-a-Judge (if enabled)
        if use_llm_judge:
            logger.info("Running LLM-as-a-Judge evaluation...")
            llm_judge_results = self._compute_llm_judge_metrics(dialogues)
            results["metrics"]["llm_judge"] = llm_judge_results
        
        # Generate summary table
        results["summary_table"] = self._generate_summary_table(results["metrics"])
        
        return results
    
    def _compute_goal_completion_rate(self, dialogues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compute Goal Completion Rate (GCR).
        
        Checks if all constraints and requestables from the goal are fulfilled in the dialogue.
        """
        completed_count = 0
        domain_stats = {}
        
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            goal = dialogue.get("goal", "")
            goal_data = dialogue.get("goal_data", {})
            turns = dialogue.get("turns", [])
            
            # Extract goal constraints and requestables
            constraints = self._extract_goal_constraints(goal, goal_data)
            requestables = self._extract_goal_requestables(goal, goal_data)
            
            # Check if goal is completed
            is_completed = self._check_goal_completion(turns, constraints, requestables)
            
            if is_completed:
                completed_count += 1
            
            # Track by domain
            if domain not in domain_stats:
                domain_stats[domain] = {"completed": 0, "total": 0}
            domain_stats[domain]["total"] += 1
            if is_completed:
                domain_stats[domain]["completed"] += 1
        
        total = len(dialogues)
        gcr = (completed_count / total * 100) if total > 0 else 0.0
        
        domain_gcr = {}
        for domain, stats in domain_stats.items():
            domain_gcr[domain] = {
                "completed": stats["completed"],
                "total": stats["total"],
                "percentage": (stats["completed"] / stats["total"] * 100) if stats["total"] > 0 else 0.0
            }
        
        return {
            "overall_gcr": gcr,
            "completed_count": completed_count,
            "total_count": total,
            "domain_gcr": domain_gcr
        }
    
    def _extract_goal_constraints(self, goal: str, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract constraints from goal text or goal_data."""
        constraints = {}
        
        # Try to extract from goal_data first
        if goal_data:
            for domain, info in goal_data.items():
                if isinstance(info, dict):
                    constraints[domain] = info.get("constraints", {})
        
        # If not found, try to parse from goal text
        if not constraints:
            # Look for common constraint patterns
            constraint_patterns = {
                "area": r"(?:area|location|in|near)\s*(?:is|:|=)?\s*([a-z]+)",
                "price": r"(?:price|price range|budget)\s*(?:is|:|=)?\s*([a-z]+)",
                "type": r"(?:type|kind|style)\s*(?:is|:|=)?\s*([a-z]+)",
            }
            
            goal_lower = goal.lower()
            for key, pattern in constraint_patterns.items():
                match = re.search(pattern, goal_lower)
                if match:
                    if "domain" not in constraints:
                        constraints["domain"] = {}
                    constraints["domain"][key] = match.group(1)
        
        return constraints
    
    def _extract_goal_requestables(self, goal: str, goal_data: Dict[str, Any]) -> List[str]:
        """Extract requestables (information to request) from goal."""
        requestables = []
        
        # Try to extract from goal_data
        if goal_data:
            for domain, info in goal_data.items():
                if isinstance(info, dict):
                    requestables.extend(info.get("requestables", []))
        
        # If not found, look for common requestable patterns
        if not requestables:
            goal_lower = goal.lower()
            common_requestables = [
                "phone", "address", "postcode", "reference number",
                "price", "availability", "time", "date"
            ]
            for req in common_requestables:
                if req in goal_lower:
                    requestables.append(req)
        
        return requestables
    
    def _check_goal_completion(
        self,
        turns: List[Dict[str, str]],
        constraints: Dict[str, Any],
        requestables: List[str]
    ) -> bool:
        """Check if goal constraints and requestables are satisfied in dialogue."""
        if not turns:
            return False
        
        # Combine all dialogue text
        dialogue_text = " ".join([turn.get("text", "").lower() for turn in turns])
        
        # Check constraints
        constraints_satisfied = True
        for domain, domain_constraints in constraints.items():
            if isinstance(domain_constraints, dict):
                for key, value in domain_constraints.items():
                    # Check if constraint value appears in dialogue
                    if value and value.lower() not in dialogue_text:
                        # Also check for synonyms
                        if not self._check_synonym(value.lower(), dialogue_text):
                            constraints_satisfied = False
                            break
        
        # Check requestables (at least some should be mentioned)
        requestables_satisfied = len(requestables) == 0  # If no requestables, consider satisfied
        if requestables:
            satisfied_count = 0
            for req in requestables:
                if req.lower() in dialogue_text or self._check_synonym(req, dialogue_text):
                    satisfied_count += 1
            
            # Require at least 50% of requestables to be satisfied
            if requestables:
                requestables_satisfied = (satisfied_count / len(requestables)) >= 0.5
        
        # Check for completion indicators
        completion_keywords = [
            "thank you", "thanks", "perfect", "great", "excellent",
            "booked", "confirmed", "reserved", "done", "completed",
            "that's exactly what I needed", "sounds good", "that works"
        ]
        has_completion = any(keyword in dialogue_text for keyword in completion_keywords)
        
        return constraints_satisfied and requestables_satisfied and has_completion
    
    def _check_synonym(self, word: str, text: str) -> bool:
        """Check if word or its synonyms appear in text."""
        # Simple synonym mapping
        synonyms = {
            "centre": ["center", "central", "downtown"],
            "cheap": ["inexpensive", "affordable", "budget"],
            "expensive": ["pricey", "costly", "high-end"],
            "north": ["northern"],
            "south": ["southern"],
            "east": ["eastern"],
            "west": ["western"]
        }
        
        if word in text:
            return True
        
        for synonym_list in synonyms.values():
            if word in synonym_list:
                for syn in synonym_list:
                    if syn in text:
                        return True
        
        return False
    
    def _compute_task_success_rate(self, dialogues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compute Task Success Rate (TSR).
        
        Judges whether the dialogue successfully achieved the user's intent.
        """
        successful_count = 0
        domain_stats = {}
        
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            goal = dialogue.get("goal", "")
            turns = dialogue.get("turns", [])
            
            # Judge task success based on multiple factors
            is_successful = self._judge_task_success(goal, turns)
            
            if is_successful:
                successful_count += 1
            
            # Track by domain
            if domain not in domain_stats:
                domain_stats[domain] = {"successful": 0, "total": 0}
            domain_stats[domain]["total"] += 1
            if is_successful:
                domain_stats[domain]["successful"] += 1
        
        total = len(dialogues)
        tsr = (successful_count / total * 100) if total > 0 else 0.0
        
        domain_tsr = {}
        for domain, stats in domain_stats.items():
            domain_tsr[domain] = {
                "successful": stats["successful"],
                "total": stats["total"],
                "percentage": (stats["successful"] / stats["total"] * 100) if stats["total"] > 0 else 0.0
            }
        
        return {
            "overall_tsr": tsr,
            "successful_count": successful_count,
            "total_count": total,
            "domain_tsr": domain_tsr
        }
    
    def _judge_task_success(self, goal: str, turns: List[Dict[str, str]]) -> bool:
        """Judge if task was successful based on goal and dialogue turns."""
        if not turns or not goal:
            return False
        
        dialogue_text = " ".join([turn.get("text", "").lower() for turn in turns])
        goal_lower = goal.lower()
        
        # Extract key intent from goal
        intent_keywords = []
        if "book" in goal_lower or "reserve" in goal_lower:
            intent_keywords.extend(["book", "reserve", "booking", "reservation"])
        if "find" in goal_lower or "search" in goal_lower:
            intent_keywords.extend(["find", "search", "looking for"])
        if "information" in goal_lower or "details" in goal_lower:
            intent_keywords.extend(["information", "details", "tell me"])
        
        # Check if intent appears to be fulfilled
        intent_fulfilled = False
        if intent_keywords:
            # Check if any intent keyword appears and is followed by completion
            for keyword in intent_keywords:
                if keyword in dialogue_text:
                    # Look for confirmation after intent
                    idx = dialogue_text.find(keyword)
                    subsequent_text = dialogue_text[idx:idx+200]  # Next 200 chars
                    if any(word in subsequent_text for word in ["yes", "confirmed", "done", "booked", "found"]):
                        intent_fulfilled = True
                        break
        else:
            # If no specific intent, check for general completion
            intent_fulfilled = any(word in dialogue_text for word in ["thank", "perfect", "great", "excellent"])
        
        # Check for sufficient dialogue length (at least 4 turns)
        has_sufficient_length = len(turns) >= 4
        
        # Check for user satisfaction indicators
        user_turns = [t for t in turns if t.get("role", "").lower() == "user"]
        last_user_turn = user_turns[-1] if user_turns else {}
        last_user_text = last_user_turn.get("text", "").lower()
        
        has_satisfaction = any(word in last_user_text for word in [
            "thank", "thanks", "perfect", "great", "excellent", "good", "sounds good"
        ])
        
        return intent_fulfilled and has_sufficient_length and has_satisfaction
    
    def _compute_bleu_scores(
        self,
        dialogues: List[Dict[str, Any]],
        reference_dialogues: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compute BLEU scores by comparing generated dialogues to reference dialogues."""
        bleu_scores = []
        domain_scores = {}
        
        # Group reference dialogues by domain
        ref_by_domain = {}
        for ref_dialogue in reference_dialogues:
            domain = ref_dialogue.get("domain", "unknown")
            if domain not in ref_by_domain:
                ref_by_domain[domain] = []
            ref_by_domain[domain].append(ref_dialogue)
        
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            
            if domain not in ref_by_domain or not ref_by_domain[domain]:
                continue
            
            # Extract dialogue text
            gen_text = self._extract_dialogue_text(dialogue)
            
            # Tokenize with error handling
            try:
                gen_tokens = word_tokenize(gen_text.lower())
            except (LookupError, Exception) as token_error:
                # Fallback to simple tokenization if NLTK tokenizer fails
                logger.warning(f"Tokenization error, using fallback: {token_error}")
                gen_tokens = simple_word_tokenize(gen_text.lower())
            
            # Find best matching reference dialogue
            best_bleu = 0.0
            
            for ref_dialogue in ref_by_domain[domain][:10]:  # Limit to 10 references for speed
                ref_text = self._extract_dialogue_text(ref_dialogue)
                
                # Tokenize with error handling
                try:
                    ref_tokens = word_tokenize(ref_text.lower())
                except (LookupError, Exception) as token_error:
                    # Fallback to simple tokenization if NLTK tokenizer fails
                    ref_tokens = simple_word_tokenize(ref_text.lower())
                
                try:
                    # Compute BLEU score with smoothing
                    if NLTK_AVAILABLE and self.smoothing:
                        try:
                            bleu = sentence_bleu(
                                [ref_tokens],
                                gen_tokens,
                                smoothing_function=self.smoothing
                            )
                        except Exception:
                            # Fallback BLEU if smoothing fails
                            bleu = sentence_bleu(
                                ref_tokens,
                                gen_tokens,
                                smoothing_function=None
                            )
                    else:
                        # Use fallback BLEU
                        bleu = sentence_bleu(
                            ref_tokens,
                            gen_tokens,
                            smoothing_function=None
                        )
                    best_bleu = max(best_bleu, bleu)
                except Exception as e:
                    logger.warning(f"Error computing BLEU: {e}")
                    continue
            
            bleu_scores.append(best_bleu)
            
            # Track by domain
            if domain not in domain_scores:
                domain_scores[domain] = []
            domain_scores[domain].append(best_bleu)
        
        # Compute statistics
        avg_bleu = np.mean(bleu_scores) if bleu_scores else 0.0
        std_bleu = np.std(bleu_scores) if bleu_scores else 0.0
        
        domain_bleu = {}
        for domain, scores in domain_scores.items():
            domain_bleu[domain] = {
                "mean": np.mean(scores),
                "std": np.std(scores),
                "count": len(scores)
            }
        
        return {
            "average_bleu": avg_bleu,
            "std_bleu": std_bleu,
            "individual_scores": bleu_scores,
            "domain_bleu": domain_bleu
        }
    
    def _compute_dialogue_length_metrics(self, dialogues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compute dialogue length and turn count metrics."""
        turn_counts = []
        word_counts = []
        char_counts = []
        domain_stats = {}
        
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            turns = dialogue.get("turns", [])
            
            turn_count = len(turns)
            dialogue_text = self._extract_dialogue_text(dialogue)
            word_count = len(dialogue_text.split())
            char_count = len(dialogue_text)
            
            turn_counts.append(turn_count)
            word_counts.append(word_count)
            char_counts.append(char_count)
            
            # Track by domain
            if domain not in domain_stats:
                domain_stats[domain] = {"turns": [], "words": [], "chars": []}
            domain_stats[domain]["turns"].append(turn_count)
            domain_stats[domain]["words"].append(word_count)
            domain_stats[domain]["chars"].append(char_count)
        
        # Compute domain statistics
        domain_metrics = {}
        for domain, stats in domain_stats.items():
            domain_metrics[domain] = {
                "avg_turns": np.mean(stats["turns"]),
                "avg_words": np.mean(stats["words"]),
                "avg_chars": np.mean(stats["chars"])
            }
        
        # Calculate standard deviation using sample std dev (ddof=1) for better estimate
        # If only 1 sample, std dev is undefined (0.0)
        # If all values are identical, std dev is 0.0 (correct mathematically)
        std_turns = 0.0
        if turn_counts and len(turn_counts) > 1:
            std_turns = np.std(turn_counts, ddof=1)  # Sample standard deviation
        elif turn_counts and len(turn_counts) == 1:
            # With only 1 sample, std dev is undefined
            std_turns = 0.0
        
        std_words = 0.0
        if word_counts and len(word_counts) > 1:
            std_words = np.std(word_counts, ddof=1)
        
        std_chars = 0.0
        if char_counts and len(char_counts) > 1:
            std_chars = np.std(char_counts, ddof=1)
        
        return {
            "avg_turns": np.mean(turn_counts) if turn_counts else 0.0,
            "std_turns": std_turns,
            "avg_words": np.mean(word_counts) if word_counts else 0.0,
            "std_words": std_words,
            "avg_chars": np.mean(char_counts) if char_counts else 0.0,
            "std_chars": std_chars,
            "min_turns": min(turn_counts) if turn_counts else 0,
            "max_turns": max(turn_counts) if turn_counts else 0,
            "num_dialogues": len(turn_counts),
            "domain_metrics": domain_metrics,
            "note": "Std dev is 0.0 if all dialogues have identical turn counts, or if only 1 dialogue was evaluated"
        }
    
    def _compute_repetition_rate(self, dialogues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compute repetition rate across dialogues."""
        repetition_rates = []
        domain_rates = {}
        
        for dialogue in dialogues:
            domain = dialogue.get("domain", "unknown")
            turns = dialogue.get("turns", [])
            
            if not turns:
                continue
            
            # Extract turn texts
            turn_texts = [turn.get("text", "").strip() for turn in turns]
            turn_texts = [t for t in turn_texts if t]  # Remove empty
            
            if len(turn_texts) < 2:
                continue
            
            # Count unique turns
            unique_turns = set(turn_texts)
            repetition_rate = 1 - (len(unique_turns) / len(turn_texts))
            
            repetition_rates.append(repetition_rate)
            
            # Track by domain
            if domain not in domain_rates:
                domain_rates[domain] = []
            domain_rates[domain].append(repetition_rate)
        
        # Compute domain statistics
        domain_stats = {}
        for domain, rates in domain_rates.items():
            domain_stats[domain] = {
                "avg_repetition": np.mean(rates),
                "std_repetition": np.std(rates),
                "count": len(rates)
            }
        
        return {
            "overall_repetition_rate": np.mean(repetition_rates) if repetition_rates else 0.0,
            "std_repetition_rate": np.std(repetition_rates) if repetition_rates else 0.0,
            "domain_repetition": domain_stats
        }
    
    def _compute_llm_judge_metrics(self, dialogues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compute LLM-as-a-Judge metrics.
        
        Uses LLM to evaluate:
        - Task Success
        - Coherence
        - Diversity
        - Fluency
        - Groundedness
        """
        all_scores = {
            "task_success": [],
            "coherence": [],
            "diversity": [],
            "fluency": [],
            "groundedness": []
        }
        
        domain_scores = {}
        
        for i, dialogue in enumerate(dialogues):
            domain = dialogue.get("domain", "unknown")
            goal = dialogue.get("goal", "")
            turns = dialogue.get("turns", [])
            
            logger.info(f"Evaluating dialogue {i+1}/{len(dialogues)} with LLM judge...")
            
            # Get LLM evaluation
            scores = self._llm_judge_dialogue(goal, turns)
            
            if scores:
                for metric, score in scores.items():
                    if metric in all_scores:
                        all_scores[metric].append(score)
                
                # Track by domain
                if domain not in domain_scores:
                    domain_scores[domain] = {
                        "task_success": [],
                        "coherence": [],
                        "diversity": [],
                        "fluency": [],
                        "groundedness": []
                    }
                
                for metric, score in scores.items():
                    if metric in domain_scores[domain]:
                        domain_scores[domain][metric].append(score)
        
        # Compute averages
        avg_scores = {}
        for metric, scores_list in all_scores.items():
            avg_scores[metric] = {
                "mean": np.mean(scores_list) if scores_list else 0.0,
                "std": np.std(scores_list) if scores_list else 0.0,
                "count": len(scores_list)
            }
        
        # Compute domain averages
        domain_avg_scores = {}
        for domain, metrics in domain_scores.items():
            domain_avg_scores[domain] = {}
            for metric, scores_list in metrics.items():
                domain_avg_scores[domain][metric] = {
                    "mean": np.mean(scores_list) if scores_list else 0.0,
                    "std": np.std(scores_list) if scores_list else 0.0
                }
        
        return {
            "overall_scores": avg_scores,
            "domain_scores": domain_avg_scores
        }
    
    def _llm_judge_dialogue(
        self,
        goal: str,
        turns: List[Dict[str, str]]
    ) -> Optional[Dict[str, int]]:
        """Use LLM to judge a dialogue on multiple metrics."""
        # Format dialogue
        dialogue_text = "\n".join([
            f"{turn.get('role', 'Unknown')}: {turn.get('text', '')}"
            for turn in turns
        ])
        
        prompt = f"""You are an expert dialogue evaluator. Please score the following synthetic conversation on a scale of 0–100 for each metric:

1. **Task Success** – Did the system fulfill the user goal based on the initial goal?
2. **Coherence** – Are turns logically consistent and context-aware?
3. **Diversity** – Is the phrasing natural and non-repetitive?
4. **Fluency** – Are grammar, punctuation, and language natural?
5. **Groundedness** – Are the facts based on given input or hallucinated?

Goal: {goal}

Dialogue:
{dialogue_text}

Please return ONLY a valid JSON object with the scores, like this:
{{
  "task_success": 60,
  "coherence": 75,
  "diversity": 55,
  "fluency": 70,
  "groundedness": 50
}}

Do not include any other text, only the JSON object."""
        
        try:
            response = self.llm_client.generate_completion(
                prompt,
                temperature=0.1,  # Low temperature for consistent evaluation
                max_tokens=200
            )
            
            # Extract JSON from response
            json_match = re.search(r'\{[^}]+\}', response, re.DOTALL)
            if json_match:
                scores = json.loads(json_match.group())
                return scores
            else:
                logger.warning(f"Could not parse LLM response: {response}")
                return None
                
        except Exception as e:
            logger.error(f"Error in LLM judge evaluation: {e}")
            return None
    
    def _extract_dialogue_text(self, dialogue: Dict[str, Any]) -> str:
        """Extract text content from a dialogue."""
        turns = dialogue.get("turns", [])
        texts = []
        for turn in turns:
            texts.append(turn.get("text", ""))
        return " ".join(texts)
    
    def _generate_summary_table(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a summary table of all metrics."""
        table = {}
        
        # Goal Completion Rate
        if "goal_completion_rate" in metrics:
            gcr = metrics["goal_completion_rate"]
            table["Goal Completion Rate"] = f"{gcr['overall_gcr']:.1f}% ({gcr['completed_count']}/{gcr['total_count']})"
        
        # Task Success Rate
        if "task_success_rate" in metrics:
            tsr = metrics["task_success_rate"]
            table["Task Success Rate"] = f"{tsr['overall_tsr']:.1f}% ({tsr['successful_count']}/{tsr['total_count']})"
        
        # BLEU Score
        if "bleu_score" in metrics:
            bleu = metrics["bleu_score"]
            table["BLEU Score (avg)"] = f"{bleu['average_bleu']:.3f}"
        
        # Avg Turns
        if "dialogue_length" in metrics:
            length = metrics["dialogue_length"]
            table["Avg. Turns"] = f"{length['avg_turns']:.1f}"
        
        # Repetition Rate
        if "repetition_rate" in metrics:
            rep = metrics["repetition_rate"]
            table["Repetition Rate"] = f"{rep['overall_repetition_rate']*100:.1f}%"
        
        # LLM Judge Scores
        if "llm_judge" in metrics:
            judge = metrics["llm_judge"]["overall_scores"]
            table["LLM Judge - Task Success"] = f"{judge.get('task_success', {}).get('mean', 0):.1f}"
            table["LLM Judge - Coherence"] = f"{judge.get('coherence', {}).get('mean', 0):.1f}"
            table["LLM Judge - Diversity"] = f"{judge.get('diversity', {}).get('mean', 0):.1f}"
            table["LLM Judge - Fluency"] = f"{judge.get('fluency', {}).get('mean', 0):.1f}"
            table["LLM Judge - Groundedness"] = f"{judge.get('groundedness', {}).get('mean', 0):.1f}"
        
        return table
    
    def save_results(self, results: Dict[str, Any], output_file: Optional[str] = None) -> Path:
        """Save evaluation results to JSON file."""
        if output_file is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = self.results_dir / f"comprehensive_evaluation_{timestamp}.json"
        else:
            output_file = Path(output_file)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved evaluation results to {output_file}")
        return output_file
    
    def print_summary(self, results: Dict[str, Any]) -> None:
        """Print evaluation summary to console."""
        print("\n" + "="*70)
        print("COMPREHENSIVE DIALOGUE EVALUATION SUMMARY")
        print("="*70)
        
        summary = results.get("summary_table", {})
        
        print("\n📊 EVALUATION METRICS SUMMARY")
        print("-" * 70)
        for metric, value in summary.items():
            print(f"{metric:.<40} {value}")
        
        print("\n" + "="*70)


def main():
    """Main function for comprehensive evaluation."""
    parser = argparse.ArgumentParser(
        description="Comprehensive evaluation of generated dialogues with multiple metrics"
    )
    parser.add_argument(
        "--synthetic-limit",
        type=int,
        help="Limit number of synthetic dialogues to evaluate"
    )
    parser.add_argument(
        "--reference-limit",
        type=int,
        help="Limit number of reference (MultiWOZ) dialogues for BLEU"
    )
    parser.add_argument(
        "--skip-llm-judge",
        action="store_true",
        help="Skip LLM-as-a-Judge evaluation (faster)"
    )
    parser.add_argument(
        "--output-file",
        type=str,
        help="Output file path for results"
    )
    parser.add_argument(
        "--log-level",
        type=str,
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"]
    )
    
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
    evaluator = ComprehensiveDialogueEvaluator(config)
    
    try:
        # Load synthetic dialogues
        logger.info("Loading synthetic dialogues...")
        synthetic_dialogues = evaluator.dataset_store.load_dialogues(limit=args.synthetic_limit)
        
        if not synthetic_dialogues:
            logger.error("No synthetic dialogues found. Please generate dialogues first.")
            return 1
        
        logger.info(f"Loaded {len(synthetic_dialogues)} synthetic dialogues")
        
        # Load reference dialogues (for BLEU)
        reference_dialogues = None
        multiwoz_file = Path(config.data_dir) / "multiwoz" / "processed_dialogues.json"
        if multiwoz_file.exists():
            logger.info("Loading MultiWOZ reference dialogues...")
            reference_dialogues = load_json(str(multiwoz_file))
            if args.reference_limit:
                reference_dialogues = reference_dialogues[:args.reference_limit]
            logger.info(f"Loaded {len(reference_dialogues)} reference dialogues")
        else:
            logger.warning("MultiWOZ reference dialogues not found. BLEU scores will be skipped.")
        
        # Run evaluation
        results = evaluator.evaluate_dialogues(
            synthetic_dialogues,
            reference_dialogues=reference_dialogues,
            use_llm_judge=not args.skip_llm_judge
        )
        
        # Save results
        output_path = evaluator.save_results(results, args.output_file)
        
        # Print summary
        evaluator.print_summary(results)
        
        print(f"\n✅ Evaluation complete! Results saved to: {output_path}")
        
        return 0
        
    except Exception as e:
        logger.error(f"Error in evaluation pipeline: {e}", exc_info=True)
        return 1


if __name__ == "__main__":
    exit(main())

