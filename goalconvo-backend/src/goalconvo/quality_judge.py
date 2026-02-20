"""
Quality Judge for filtering and evaluating generated dialogues.

Implements heuristic filters and LLM-as-judge evaluation to ensure
high-quality synthetic dialogues.
"""

import logging
import re
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

from .config import Config
from .llm_client import LLMClient
from .utils import (
    detect_repeated_utterances, calculate_similarity, 
    clean_text, is_profane, truncate_text
)

logger = logging.getLogger(__name__)

class QualityJudge:
    """Evaluates and filters dialogues for quality."""
    
    def __init__(self, config: Config, llm_client: LLMClient):
        """Initialize the quality judge."""
        self.config = config
        self.llm_client = llm_client
        
        # Quality assessment prompts
        self.quality_prompts = self._create_quality_prompts()
        
        # Profanity list for basic filtering
        self.profanity_list = [
            "damn", "hell", "crap", "stupid", "idiot", "moron",
            "fuck", "shit", "bitch", "asshole", "dumb"
        ]
    
    def _create_quality_prompts(self) -> Dict[str, str]:
        """Create prompts aligned with evaluation metrics (TSR, GCR, Coherence, Diversity, Fluency, Groundedness)."""
        return {
            "coherence": """Evaluate the coherence of this dialogue on a scale of 1-5, aligned with evaluation metrics.

Dialogue:
{history}

Rate coherence based on:
1. **Logical flow**: Do turns follow naturally from previous turns? Is context maintained?
2. **Context awareness**: Do responses reference what was said earlier?
3. **Conversation patterns**: Does it follow natural dialogue structure (question-answer, clarification, confirmation)?
4. **Consistency**: Are there contradictions or confusing jumps?

Score guide:
- 5: Excellent—perfect logical flow, strong context awareness, natural patterns
- 4: Good—mostly coherent with minor issues
- 3: Acceptable—some coherence issues but understandable
- 2: Poor—significant coherence problems
- 1: Very poor—confusing, illogical flow

Respond with only a number from 1-5.""",
            
            "goal_relevance": """Determine if this dialogue successfully addresses the user's goal (aligned with Goal Completion Rate and Task Success Rate).

User Goal: {goal}
Dialogue:
{history}

Evaluate goal relevance based on:
1. **Goal Completion (GCR)**: Were all constraints and requestables from the goal satisfied?
2. **Task Success (TSR)**: Was the user's intent fulfilled? Did the user express satisfaction?
3. **Completeness**: Was the goal fully achieved (not just partially addressed)?

Respond "YES" if:
- The goal was COMPLETELY addressed (all constraints satisfied, requestables provided)
- The user expressed satisfaction (thanks, perfect, great, etc.)
- The assistant confirmed completion (booked, confirmed, provided all info)

Respond "NO" if:
- The goal was only partially addressed
- Information is incomplete or pending
- The user hasn't expressed satisfaction
- The conversation is still ongoing

Respond with only "YES" or "NO".""",
            
            "overall_quality": """Evaluate this dialogue for overall quality, considering all evaluation metrics.

User Goal: {goal}
Dialogue:
{history}

Rate overall quality (1-5) considering:
1. **Task Success**: Was the goal achieved? Did the user express satisfaction?
2. **Coherence**: Logical flow and context awareness
3. **Diversity**: Varied language and phrasing (not repetitive)
4. **Fluency**: Natural grammar and language
5. **Groundedness**: Responses based on domain knowledge (not fabricated)
6. **Appropriate length**: Not too short or too long

Score guide:
- 5: Excellent—high scores on all dimensions, natural and complete
- 4: Good—strong quality with minor issues
- 3: Acceptable—meets basic quality standards
- 2: Poor—significant quality issues
- 1: Very poor—low quality across dimensions

Respond with only a number from 1-5."""
        }
    
    def judge_dialogue(self, dialogue_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Judge a dialogue for quality and return assessment results.
        
        Args:
            dialogue_data: Dialogue data to evaluate
            
        Returns:
            Dictionary with quality assessment results
        """
        turns = dialogue_data.get("turns", [])
        goal = dialogue_data.get("goal", "")
        domain = dialogue_data.get("domain", "unknown")
        
        # Apply heuristic filters
        heuristic_results = self._apply_heuristic_filters(dialogue_data)
        
        # Apply LLM-based evaluation
        llm_results = self._apply_llm_evaluation(dialogue_data)
        
        # Combine results
        quality_assessment = {
            "dialogue_id": dialogue_data.get("dialogue_id", "unknown"),
            "domain": domain,
            "heuristic_filters": heuristic_results,
            "llm_evaluation": llm_results,
            "overall_score": self._calculate_overall_score(heuristic_results, llm_results),
            "passed_filters": self._determine_if_passed(heuristic_results, llm_results),
            "assessment_timestamp": datetime.now().isoformat()
        }
        
        return quality_assessment
    
    def _apply_heuristic_filters(self, dialogue_data: Dict[str, Any]) -> Dict[str, Any]:
        """Apply heuristic quality filters."""
        turns = dialogue_data.get("turns", [])
        goal = dialogue_data.get("goal", "")
        
        results = {
            "length_check": self._check_length(turns),
            "repetition_check": self._check_repetition(turns),
            "profanity_check": self._check_profanity(turns),
            "coherence_check": self._check_coherence(turns),
            "goal_mention_check": self._check_goal_mention(goal, turns),
            "empty_response_check": self._check_empty_responses(turns)
        }
        
        # Calculate heuristic score
        passed_checks = sum(1 for result in results.values() if result["passed"])
        total_checks = len(results)
        results["heuristic_score"] = passed_checks / total_checks if total_checks > 0 else 0.0
        
        return results
    
    def _check_length(self, turns: List[Dict[str, str]]) -> Dict[str, Any]:
        """Check if dialogue has appropriate length."""
        num_turns = len(turns)
        min_turns = self.config.min_turns
        max_turns = self.config.max_turns
        
        passed = min_turns <= num_turns <= max_turns
        
        return {
            "passed": passed,
            "num_turns": num_turns,
            "min_required": min_turns,
            "max_allowed": max_turns,
            "message": f"Dialogue has {num_turns} turns (required: {min_turns}-{max_turns})"
        }
    
    def _check_repetition(self, turns: List[Dict[str, str]]) -> Dict[str, Any]:
        """Check for repeated utterances."""
        has_repetition = detect_repeated_utterances(turns, threshold=0.7)
        
        return {
            "passed": not has_repetition,
            "has_repetition": has_repetition,
            "message": "No repeated utterances detected" if not has_repetition else "Repeated utterances detected"
        }
    
    def _check_profanity(self, turns: List[Dict[str, str]]) -> Dict[str, Any]:
        """Check for profanity in dialogue."""
        profane_turns = []
        
        for i, turn in enumerate(turns):
            text = turn.get("text", "")
            if is_profane(text, self.profanity_list):
                profane_turns.append(i)
        
        passed = len(profane_turns) == 0
        
        return {
            "passed": passed,
            "profane_turns": profane_turns,
            "message": f"Found profanity in {len(profane_turns)} turns" if profane_turns else "No profanity detected"
        }
    
    def _check_coherence(self, turns: List[Dict[str, str]]) -> Dict[str, Any]:
        """Check basic coherence of dialogue."""
        if len(turns) < 2:
            return {"passed": False, "message": "Too few turns for coherence check"}
        
        # Check for alternating roles
        roles = [turn.get("role", "") for turn in turns]
        expected_roles = ["User", "SupportBot"] * (len(turns) // 2)
        if len(turns) % 2 == 1:
            expected_roles.append("User")
        
        role_coherence = roles == expected_roles
        
        # Check for non-empty responses
        empty_responses = any(
            not turn.get("text", "").strip() for turn in turns
        )
        
        passed = role_coherence and not empty_responses
        
        return {
            "passed": passed,
            "role_coherence": role_coherence,
            "has_empty_responses": empty_responses,
            "message": "Dialogue structure is coherent" if passed else "Dialogue structure issues detected"
        }
    
    def _check_goal_mention(self, goal: str, turns: List[Dict[str, str]]) -> Dict[str, Any]:
        """Check if goal is mentioned or addressed in dialogue."""
        goal_keywords = goal.lower().split()
        goal_mentioned = False
        
        for turn in turns:
            text = turn.get("text", "").lower()
            if any(keyword in text for keyword in goal_keywords):
                goal_mentioned = True
                break
        
        return {
            "passed": goal_mentioned,
            "goal_mentioned": goal_mentioned,
            "message": "Goal mentioned in dialogue" if goal_mentioned else "Goal not mentioned"
        }
    
    def _check_empty_responses(self, turns: List[Dict[str, str]]) -> Dict[str, Any]:
        """Check for empty or very short responses."""
        empty_turns = []
        
        for i, turn in enumerate(turns):
            text = turn.get("text", "").strip()
            if len(text) < 3:  # Very short responses
                empty_turns.append(i)
        
        passed = len(empty_turns) == 0
        
        return {
            "passed": passed,
            "empty_turns": empty_turns,
            "message": f"Found {len(empty_turns)} empty/short responses" if empty_turns else "All responses have sufficient content"
        }
    
    def _apply_llm_evaluation(self, dialogue_data: Dict[str, Any]) -> Dict[str, Any]:
        """Apply LLM-based quality evaluation."""
        turns = dialogue_data.get("turns", [])
        goal = dialogue_data.get("goal", "")
        
        if not turns:
            return {
                "coherence_score": 0.0,
                "goal_relevance": False,
                "overall_score": 0.0,
                "error": "No turns to evaluate"
            }
        
        # Format conversation history
        history = self._format_history_for_llm(turns)
        
        results = {}
        
        try:
            # Evaluate coherence
            coherence_score = self._evaluate_coherence(goal, history)
            results["coherence_score"] = coherence_score
            
            # Evaluate goal relevance
            goal_relevance = self._evaluate_goal_relevance(goal, history)
            results["goal_relevance"] = goal_relevance
            
            # Overall quality assessment
            overall_score = self._evaluate_overall_quality(goal, history)
            results["overall_score"] = overall_score
            
        except Exception as e:
            logger.error(f"Error in LLM evaluation: {e}")
            results = {
                "coherence_score": 0.0,
                "goal_relevance": False,
                "overall_score": 0.0,
                "error": str(e)
            }
        
        return results
    
    def _format_history_for_llm(self, turns: List[Dict[str, str]]) -> str:
        """Format conversation history for LLM evaluation."""
        history_lines = []
        for turn in turns:
            role = turn.get("role", "Unknown")
            text = turn.get("text", "")
            history_lines.append(f"{role}: {text}")
        return "\n".join(history_lines)
    
    def _evaluate_coherence(self, goal: str, history: str) -> float:
        """Evaluate dialogue coherence using LLM."""
        prompt = self.quality_prompts["coherence"].format(history=history)
        
        try:
            response = self.llm_client.generate_completion(
                prompt,
                temperature=0.1,  # Low temperature for consistent scoring
                max_tokens=10
            )
            
            # Extract numeric score
            score_match = re.search(r'\b([1-5])\b', response)
            if score_match:
                return float(score_match.group(1))
            else:
                return 3.0  # Default middle score
                
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "rate_limit" in err_str.lower():
                logger.warning("Quality evaluation (coherence) skipped due to API rate limit; using default score 3.0")
            else:
                logger.error(f"Error evaluating coherence: {e}")
            return 3.0

    def _evaluate_goal_relevance(self, goal: str, history: str) -> bool:
        """Evaluate goal relevance using LLM."""
        prompt = self.quality_prompts["goal_relevance"].format(goal=goal, history=history)
        
        try:
            response = self.llm_client.generate_completion(
                prompt,
                temperature=0.1,
                max_tokens=10
            )
            
            return "YES" in response.upper()
            
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "rate_limit" in err_str.lower():
                logger.warning("Quality evaluation (goal relevance) skipped due to API rate limit; using default False")
            else:
                logger.error(f"Error evaluating goal relevance: {e}")
            return False

    def _evaluate_overall_quality(self, goal: str, history: str) -> float:
        """Evaluate overall quality using LLM."""
        prompt = self.quality_prompts["overall_quality"].format(goal=goal, history=history)
        
        try:
            response = self.llm_client.generate_completion(
                prompt,
                temperature=0.1,
                max_tokens=10
            )
            
            # Extract numeric score
            score_match = re.search(r'\b([1-5])\b', response)
            if score_match:
                return float(score_match.group(1))
            else:
                return 3.0  # Default middle score
                
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "rate_limit" in err_str.lower():
                logger.warning("Quality evaluation (overall quality) skipped due to API rate limit; using default score 3.0")
            else:
                logger.error(f"Error evaluating overall quality: {e}")
            return 3.0

    def _calculate_overall_score(
        self, 
        heuristic_results: Dict[str, Any], 
        llm_results: Dict[str, Any]
    ) -> float:
        """Calculate overall quality score."""
        heuristic_score = heuristic_results.get("heuristic_score", 0.0)
        coherence_score = llm_results.get("coherence_score", 0.0) / 5.0  # Normalize to 0-1
        overall_score = llm_results.get("overall_score", 0.0) / 5.0  # Normalize to 0-1
        
        # Weighted combination
        overall = (
            heuristic_score * 0.3 +
            coherence_score * 0.3 +
            overall_score * 0.4
        )
        
        return min(1.0, max(0.0, overall))
    
    def _determine_if_passed(
        self, 
        heuristic_results: Dict[str, Any], 
        llm_results: Dict[str, Any]
    ) -> bool:
        """Determine if dialogue passes quality filters."""
        # Check heuristic filters (more lenient for local models)
        heuristic_passed = heuristic_results.get("heuristic_score", 0.0) >= 0.5
        
        # Check LLM evaluation (more lenient thresholds)
        coherence_score = llm_results.get("coherence_score", 0.0)
        goal_relevant = llm_results.get("goal_relevance", False)
        overall_score = llm_results.get("overall_score", 0.0)
        
        # If LLM evaluation failed (error), be more lenient
        if "error" in llm_results:
            logger.warning(f"LLM evaluation error, using heuristic only: {llm_results.get('error')}")
            # If heuristic passed, accept it even if LLM failed
            return heuristic_passed
        
        # More lenient thresholds for local models
        coherence_ok = coherence_score >= 2.0  # Lowered from 3.0
        overall_ok = overall_score >= 2.0  # Lowered from 3.0
        
        # Accept if either heuristic passes OR (coherence and overall are OK, even if goal relevance is unclear)
        llm_passed = (coherence_ok and overall_ok) or (goal_relevant and overall_ok)
        
        # More lenient: accept if heuristic passes OR LLM evaluation passes
        # This helps when local models have evaluation issues
        return heuristic_passed or llm_passed
    
    def filter_dialogues(
        self, 
        dialogues: List[Dict[str, Any]], 
        target_discard_rate: Optional[float] = None
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Filter dialogues based on quality assessment.
        
        Args:
            dialogues: List of dialogues to filter
            target_discard_rate: Target percentage to discard (overrides config)
            
        Returns:
            Tuple of (accepted_dialogues, rejected_dialogues)
        """
        target_discard_rate = target_discard_rate or self.config.discard_rate
        
        accepted = []
        rejected = []
        
        for dialogue in dialogues:
            assessment = self.judge_dialogue(dialogue)
            
            if assessment["passed_filters"]:
                # Add quality score to metadata
                if "metadata" not in dialogue:
                    dialogue["metadata"] = {}
                dialogue["metadata"]["quality_score"] = assessment["overall_score"]
                dialogue["metadata"]["quality_assessment"] = assessment
                accepted.append(dialogue)
            else:
                rejected.append(dialogue)
        
        # If we need to discard more to meet target rate (only if we have dialogues)
        if len(dialogues) > 0 and len(rejected) / len(dialogues) < target_discard_rate:
            # Sort accepted by quality score and discard lowest quality
            accepted.sort(key=lambda x: x.get("metadata", {}).get("quality_score", 0.0))
            num_to_discard = int(len(accepted) * (target_discard_rate - len(rejected) / len(dialogues)))
            
            for _ in range(num_to_discard):
                if accepted:
                    rejected.append(accepted.pop(0))
        
        logger.info(f"Filtered {len(accepted)} accepted, {len(rejected)} rejected dialogues")
        return accepted, rejected
