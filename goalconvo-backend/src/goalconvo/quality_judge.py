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
    clean_text, is_profane, truncate_text, validate_dialogue_format,
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
- The assistant claimed the task was done but did not provide any concrete detail (e.g. time, place, reference number, venue name)
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
5. **Groundedness**: When the assistant confirms a booking or recommendation, they must give at least one concrete detail (time, venue, reference, etc.). Vague confirmations like "I've arranged it" with no specifics are low quality (score 2 or lower).
6. **Appropriate length**: Not too short or too long

Score guide:
- 5: Excellent—high scores on all dimensions, natural and complete, concrete details when confirming
- 4: Good—strong quality with minor issues
- 3: Acceptable—meets basic quality standards
- 2: Poor—significant quality issues (e.g. assistant claimed done with no concrete detail, or repetitive thank-you loops)
- 1: Very poor—low quality across dimensions

Respond with only a number from 1-5.""",

            "improve_dialogue": """You are improving a task-oriented dialogue that failed quality checks.

User Goal: {goal}
Domain: {domain}

Current dialogue (one turn per line):
{history}

Issues identified:
{issues}

Improve the dialogue by fixing these issues. Keep the same number of turns and alternating User/SupportBot order. Preserve the goal and make the conversation coherent, grounded (assistant gives concrete details when confirming e.g. time, place, reference), and free of repetition. Do not add new turns; only fix or rewrite existing ones.

Output the improved dialogue in this exact format—one line per turn, no other text:
User: <first user message>
SupportBot: <first assistant reply>
User: <next user message>
SupportBot: <next assistant reply>
... continue for all turns ...

Output only the lines above, nothing else.""",

            "rejection_reason": """This task-oriented dialogue FAILED quality verification.

User Goal: {goal}
Domain: {domain}

Dialogue:
{history}

Assessment summary: coherence score {coherence_score}/5, goal_relevance={goal_relevant}, overall score {overall_score}/5. Heuristic checks: {heuristic_summary}.

In 2-4 short, specific sentences explain WHY this dialogue was rejected and WHAT must be fixed (e.g. repetition, lack of concrete details from assistant, goal not achieved, incoherent flow, vague confirmations). Be concrete so someone can correct the dialogue. Output only the explanation, no preamble."""
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
        has_repetition = detect_repeated_utterances(turns, threshold=0.6)
        
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
        
        strict = getattr(self.config, "strict_llm_verification", True)
        if strict:
            coherence_ok = coherence_score >= 3.0
            overall_ok = overall_score >= 3.0
            llm_passed = coherence_ok and overall_ok and goal_relevant
        else:
            coherence_ok = coherence_score >= 2.0
            overall_ok = overall_score >= 2.0
            llm_passed = (coherence_ok and overall_ok) or (goal_relevant and overall_ok)
        
        return heuristic_passed or llm_passed

    def _heuristic_summary_one_line(self, assessment: Dict[str, Any]) -> str:
        """One-line summary of heuristic results for rejection reason prompt."""
        heur = assessment.get("heuristic_filters", {})
        parts = []
        for key in ("length_check", "repetition_check", "coherence_check", "goal_mention_check"):
            r = heur.get(key, {})
            if r.get("passed") is False:
                parts.append(key.replace("_", " ") + " failed")
        return "; ".join(parts) if parts else "some checks failed"

    def _get_rejection_reason(self, dialogue: Dict[str, Any], assessment: Dict[str, Any]) -> Optional[str]:
        """Ask the LLM why this dialogue was rejected; return 2-4 sentences for use by the improvement step."""
        turns = dialogue.get("turns", [])
        goal = dialogue.get("goal", "")
        domain = dialogue.get("domain", "unknown")
        if not turns:
            return None
        history = self._format_history_for_llm(turns)
        llm = assessment.get("llm_evaluation", {})
        coherence_score = llm.get("coherence_score", 0)
        goal_relevant = llm.get("goal_relevance", False)
        overall_score = llm.get("overall_score", 0)
        heuristic_summary = self._heuristic_summary_one_line(assessment)
        prompt = self.quality_prompts["rejection_reason"].format(
            goal=goal,
            domain=domain,
            history=history,
            coherence_score=coherence_score,
            goal_relevant=goal_relevant,
            overall_score=overall_score,
            heuristic_summary=heuristic_summary,
        )
        try:
            response = self.llm_client.generate_completion(
                prompt,
                temperature=0.2,
                max_tokens=getattr(self.config, "max_tokens_rejection_reason", 150),
            )
            reason = (response or "").strip()
            if len(reason) < 20:
                return None
            return reason
        except Exception as e:
            logger.warning(f"Rejection reason LLM call failed: {e}")
            return None

    def _assessment_issues_summary(self, assessment: Dict[str, Any]) -> str:
        """Build a short summary of issues from the assessment for the improve prompt."""
        parts = []
        heur = assessment.get("heuristic_filters", {})
        llm = assessment.get("llm_evaluation", {})
        if heur.get("length_check", {}).get("passed") is False:
            parts.append("Turn count out of required range.")
        if heur.get("repetition_check", {}).get("passed") is False:
            parts.append("Repeated or very similar utterances; reduce repetition.")
        if heur.get("coherence_check", {}).get("passed") is False:
            parts.append("Coherence problems; improve logical flow and context.")
        if heur.get("goal_mention_check", {}).get("passed") is False:
            parts.append("Goal not clearly addressed; ensure the goal is achieved.")
        coh = llm.get("coherence_score", 0)
        if coh < 3.0:
            parts.append("Dialogue coherence is low; make turns follow naturally.")
        if llm.get("goal_relevance") is False:
            parts.append("Goal not fully achieved or not grounded; assistant should provide concrete details (time, place, reference) when confirming.")
        ov = llm.get("overall_score", 0)
        if ov < 3.0:
            parts.append("Overall quality is low; improve task success, grounding, and naturalness.")
        if not parts:
            parts.append("Some quality checks failed; improve coherence, goal completion, and grounding.")
        return " ".join(parts)

    def improve_dialogue(
        self,
        dialogue: Dict[str, Any],
        assessment: Dict[str, Any],
        rejection_reason: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Use the LLM to improve a dialogue that failed quality checks. When rejection_reason
        is provided (from _get_rejection_reason), it is used as the issues text for the
        improvement prompt; otherwise a summary from the assessment is used.
        Returns an improved dialogue dict or None if improvement fails.
        """
        turns = dialogue.get("turns", [])
        goal = dialogue.get("goal", "")
        domain = dialogue.get("domain", "unknown")
        if not turns:
            return None
        history = self._format_history_for_llm(turns)
        issues = rejection_reason if rejection_reason else self._assessment_issues_summary(assessment)
        prompt = self.quality_prompts["improve_dialogue"].format(
            goal=goal,
            domain=domain,
            history=history,
            issues=issues,
        )
        try:
            max_tokens_improve = getattr(self.config, "max_tokens_improve_dialogue", 800)
            response = self.llm_client.generate_completion(
                prompt,
                temperature=0.3,
                max_tokens=max_tokens_improve,
            )
        except Exception as e:
            logger.warning(f"Dialogue improvement LLM call failed: {e}")
            return None
        # Parse "User: ..." / "SupportBot: ..." lines
        new_turns: List[Dict[str, Any]] = []
        for line in response.strip().split("\n"):
            line = line.strip()
            if not line:
                continue
            if line.lower().startswith("user:"):
                text = line[5:].strip()
                new_turns.append({"role": "User", "text": text})
            elif line.lower().startswith("supportbot:"):
                text = line[11:].strip()
                new_turns.append({"role": "SupportBot", "text": text})
        if len(new_turns) < 2:
            logger.warning("Improve dialogue produced too few turns; skipping.")
            return None
        # Build improved dialogue preserving original metadata and ids
        improved = dict(dialogue)
        improved["turns"] = new_turns
        if "metadata" not in improved:
            improved["metadata"] = {}
        improved["metadata"]["improved_by_quality_judge"] = True
        improved["metadata"]["improvement_timestamp"] = datetime.now().isoformat()
        if not validate_dialogue_format(improved):
            logger.warning("Improved dialogue failed format validation; skipping.")
            return None
        return improved

    def filter_dialogues(
        self,
        dialogues: List[Dict[str, Any]],
        target_discard_rate: Optional[float] = None,
        improve_on_fail: Optional[bool] = None,
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Filter dialogues based on quality assessment. When a dialogue fails and
        improve_on_fail is True, the LLM is used to improve it; the improved
        version is re-judged and accepted if it passes.
        
        Args:
            dialogues: List of dialogues to filter
            target_discard_rate: Target percentage to discard (overrides config)
            improve_on_fail: If True, try to improve failed dialogues via LLM and re-judge (default: config.quality_improve_on_fail)
            
        Returns:
            Tuple of (accepted_dialogues, rejected_dialogues)
        """
        target_discard_rate = target_discard_rate or self.config.discard_rate
        do_improve = improve_on_fail if improve_on_fail is not None else getattr(
            self.config, "quality_improve_on_fail", True
        )
        
        accepted = []
        rejected = []
        
        for dialogue in dialogues:
            assessment = self.judge_dialogue(dialogue)
            
            if assessment["passed_filters"]:
                if "metadata" not in dialogue:
                    dialogue["metadata"] = {}
                dialogue["metadata"]["quality_score"] = assessment["overall_score"]
                dialogue["metadata"]["quality_assessment"] = assessment
                accepted.append(dialogue)
            else:
                rejection_reason = self._get_rejection_reason(dialogue, assessment)
                if "metadata" not in dialogue:
                    dialogue["metadata"] = {}
                dialogue["metadata"]["rejection_reason"] = rejection_reason
                dialogue["metadata"]["quality_assessment"] = assessment
                if do_improve:
                    improved = self.improve_dialogue(dialogue, assessment, rejection_reason=rejection_reason)
                    if improved is not None:
                        re_assessment = self.judge_dialogue(improved)
                        if re_assessment["passed_filters"]:
                            if "metadata" not in improved:
                                improved["metadata"] = {}
                            improved["metadata"]["quality_score"] = re_assessment["overall_score"]
                            improved["metadata"]["quality_assessment"] = re_assessment
                            accepted.append(improved)
                            logger.info(f"Dialogue {dialogue.get('dialogue_id', '?')} accepted after improvement")
                            continue
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
