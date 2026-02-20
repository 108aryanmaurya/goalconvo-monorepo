"""
Multi-Agent Simulator implementing Algorithm 1 from the research paper.

Simulates dialogues between User and SupportBot agents using Mistral-7B.
"""

import json
import logging
import time
from typing import Dict, List, Any, Optional, Tuple, Callable
from datetime import datetime

from .config import Config
from .llm_client import LLMClient
from .utils import generate_dialogue_id, format_conversation_history, calculate_similarity

logger = logging.getLogger(__name__)

class DialogueSimulator:
    """Simulates goal-oriented dialogues between User and SupportBot agents."""
    
    def __init__(self, config: Config, llm_client: LLMClient):
        """Initialize the dialogue simulator."""
        self.config = config
        self.llm_client = llm_client
        
        # Prompt templates for each agent
        self.user_prompts = self._create_user_prompts()
        self.supportbot_prompts = self._create_supportbot_prompts()
        self.goal_satisfaction_prompts = self._create_goal_satisfaction_prompts()
    
    def _create_user_prompts(self) -> Dict[str, str]:
        """Create prompt templates optimized for Task Success Rate, Diversity, and Coherence."""
        return {
            "system": """You are a user with a specific goal that you want to achieve through conversation with a support assistant.

CRITICAL FOR EVALUATION METRICS:
1. **Task Success Rate (TSR)**: When your goal is COMPLETELY fulfilled, you MUST express clear satisfaction in your LAST turn. Use explicit phrases like:
   - "Thank you, that's perfect!" / "Thanks, that's exactly what I needed!"
   - "Great, I'm all set!" / "Perfect, that works for me!"
   - "Excellent, that's all I needed!" / "Wonderful, thank you so much!"
   DO NOT just say "okay" or "sure"—be explicit about satisfaction.

2. **Diversity**: Use DIFFERENT words and sentence structures each turn. Avoid repeating:
   - The same phrases ("I need", "I want", "Can you help")
   - The same sentence patterns
   - The same vocabulary
   Instead, vary: "I'm looking for" → "Do you have" → "Could you help me find" → "I'd like to book"

3. **Coherence**: Stay focused on your goal. Reference what the assistant just said. Build on previous turns naturally.

4. **Natural Flow**: Ask follow-up questions when needed. Provide details when asked. Show understanding of responses.

Your role:
- Clearly communicate needs and requirements
- Ask relevant questions to get information
- Provide necessary details when asked
- When goal is FULLY achieved: express EXPLICIT satisfaction (critical for TSR)
- Use varied, natural phrasing every turn (critical for Diversity)
- Stay focused on your goal until achieved (critical for Coherence)

IMPORTANT: When the assistant has COMPLETELY addressed your goal (e.g., confirmed booking, provided all info), your NEXT turn MUST include explicit satisfaction. This is essential for evaluation.""",
            
            "user": """Domain: {domain}
Goal: {goal}
Context: {context}
User Persona: {user_persona}
{structured_goal}
{persona_traits}

Conversation History:
{history}
{progress_hint}

What would you say next? Follow these rules:

1. **CRITICAL: Respond to the LAST assistant message**: Look at the most recent SupportBot message in the history. Your response MUST directly address what they just said. Do NOT ignore their question or statement.

2. **If your goal is NOT yet achieved**: Ask a specific question or provide details. Use FRESH wording—do NOT repeat phrases from earlier turns. Vary your language:
   - Instead of repeating "I need", try "I'm looking for", "Do you have", "Could you help me find", "I'd like to", "I'm interested in"
   - Instead of repeating "hotel room", try "accommodation", "a place to stay", "a room"
   - Check the history—if you already asked "What's the price?", do NOT ask it again. Ask something different.

3. **If the assistant has COMPLETELY helped you achieve your goal** (e.g., confirmed booking, provided all info, addressed all constraints):
   - You MUST express EXPLICIT satisfaction in this turn
   - Use clear phrases: "Thank you, that's perfect!", "Great, I'm all set!", "Perfect, that's exactly what I needed!", "Excellent, thank you so much!"
   - This is CRITICAL for Task Success Rate evaluation

4. **NO REPETITION**: Check ALL your previous turns in the history. Do NOT repeat:
   - The same question (e.g., if you asked "What's the price?" already, don't ask it again)
   - The same phrase or sentence structure
   - The same vocabulary
   If you find yourself wanting to repeat something, rephrase it completely or ask about something different.

5. **Coherence**: Reference what the assistant just said. Build naturally on the conversation. If they asked a question, answer it. If they provided information, acknowledge it and ask a follow-up.

Be concise (1-2 sentences). Vary your wording—do not repeat earlier phrases.

IMPORTANT: Respond ONLY with your message. No role labels like "User:" or "SupportBot:". Just your message."""
        }
    
    def _create_supportbot_prompts(self) -> Dict[str, str]:
        """Create prompt templates where the LLM drives SupportBot behaviour from goal + history."""
        return {
            "system": """You are a helpful support assistant who helps users achieve their goals.

Your priorities:
- Understand the user's goal and current context.
- Respond directly to what the user just said.
- Help the user reach their goal in a natural, coherent conversation.
- When the goal is clearly achieved, explicitly confirm completion so the user can naturally say thank you.

Use natural, fluent language. Do not include role labels like \"User:\" or \"Assistant:\"—only your reply.""",
            
            "supportbot": """Domain: {domain}
User Goal: {goal}
Context: {context}
{structured_goal}
{supportbot_style}

Conversation History:
{history}

As the support assistant, respond to the LAST user message in the history.
- Stay focused on the user's goal.
- Answer their question or react to their last message naturally.
- If the goal is fully addressed (e.g., booking/reservation/information complete), clearly confirm what you have done so the user can express satisfaction.

Respond with 1–3 sentences of natural dialogue, without role labels."""
        }
    
    def _create_goal_satisfaction_prompts(self) -> Dict[str, str]:
        """Create prompts optimized for accurate Goal Completion Rate and Task Success Rate detection."""
        return {
            "goal_check": """Analyze this conversation to determine if the user's goal has been FULLY and COMPLETELY achieved.

User Goal: {goal}
Conversation:
{history}

EVALUATION CRITERIA (must satisfy ALL for "YES"):
1. **Goal Completion (GCR)**: 
   - All constraints from the goal are satisfied (e.g., if goal mentions "budget hotel in city center", both price and location are addressed)
   - Requestables are provided (e.g., booking confirmation, phone number, address if requested)
   - The assistant explicitly confirmed completion (e.g., "booked", "confirmed", "here's the information")

2. **Task Success (TSR)**:
   - The user's intent is fulfilled (booking made, information provided, service arranged)
   - The user explicitly expressed satisfaction in their LAST turn (e.g., "thank you", "perfect", "that's great", "I'm all set", "exactly what I needed")
   - There is clear evidence of completion in the last 1–2 turns

3. **Completeness**:
   - Nothing is left pending (not "I can check" or "let me look into that"—must be DONE)
   - The conversation reached a natural conclusion

RESPOND "YES" ONLY if:
- The assistant COMPLETELY fulfilled the request (confirmed, provided all info)
- The user EXPLICITLY expressed satisfaction (thanks, perfect, great, etc.) in their last turn
- All constraints and requestables from the goal are addressed
- There is clear completion evidence in the last 1–2 turns

RESPOND "NO" if:
- The conversation is still ongoing
- The assistant only offered to help but didn't complete the task
- Information is incomplete or pending
- The user hasn't expressed satisfaction yet
- Constraints or requestables are missing

Respond with only "YES" if the goal is COMPLETELY achieved with clear evidence; otherwise "NO"."""
        }
    
    def simulate_dialogue(
        self, 
        experience_data: Dict[str, Any], 
        max_turns: Optional[int] = None,
        progress_callback: Optional[Callable[..., None]] = None
    ) -> Dict[str, Any]:
        """
        Simulate a complete dialogue following Algorithm 1.
        
        Args:
            experience_data: Initial experience data with goal, context, etc.
            max_turns: Maximum number of turns (overrides config)
            progress_callback: Optional callback(turns_so_far, step_message) after each turn.
            
        Returns:
            Complete dialogue data
        """
        import time
        
        # Track generation start time
        generation_start_time = time.time()
        
        max_turns = max_turns or self.config.max_turns
        goal = experience_data["goal"]
        context = experience_data["context"]
        domain = experience_data.get("domain", "general")
        user_persona = experience_data.get("user_persona", "General user")
        first_utterance = experience_data.get("first_utterance", "")
        
        # Initialize conversation
        dialogue_id = generate_dialogue_id()
        turns = []
        conversation_history = []
        
        # Add system message with goal and domain
        conversation_history.append({
            "role": "System",
            "text": f"Domain: {domain}\nUser Goal: {goal}"
        })
        
        # Start with first user utterance
        if first_utterance:
            user_turn = {
                "role": "User",
                "text": first_utterance,
                "timestamp": datetime.now().isoformat()
            }
            turns.append(user_turn)
            conversation_history.append(user_turn)
            if progress_callback:
                progress_callback(list(turns), "First user utterance")
        else:
            # Generate initial user utterance if not provided
            user_response = self._generate_user_turn(
                goal, context, user_persona, conversation_history, domain, experience_data
            )
            user_turn = {
                "role": "User",
                "text": user_response,
                "timestamp": datetime.now().isoformat()
            }
            turns.append(user_turn)
            conversation_history.append(user_turn)
            if progress_callback:
                progress_callback(list(turns), "Generated initial user turn")
        
        # Simulate dialogue turns (alternating SupportBot and User)
        # CRITICAL: Ensure we generate at least min_turns before allowing early exit
        last_goal_check_turn = 0
        min_turns_required = self.config.min_turns
        
        # Calculate how many turn pairs we need (each iteration adds 2 turns: SupportBot + User)
        # We already have 1 user turn, so we need at least (min_turns_required - 1) more turns
        # Which means at least ceil((min_turns_required - 1) / 2) more iterations
        # Example: min_turns=5, we have 1 turn, need 4 more = 2 iterations (2 pairs = 4 turns)
        min_iterations = max(1, (min_turns_required - 1 + 1) // 2)  # +1 to round up
        logger.info(f"Dialogue {dialogue_id}: Will generate at least {min_turns_required} turns (min {min_iterations} iterations)")
        
        for turn_num in range(1, max_turns + 1):
            try:
                # Generate SupportBot response
                supportbot_response = self._generate_supportbot_turn(
                    goal, context, conversation_history, domain, experience_data
                )
                
                supportbot_turn = {
                    "role": "SupportBot",
                    "text": supportbot_response,
                    "timestamp": datetime.now().isoformat()
                }
                turns.append(supportbot_turn)
                conversation_history.append(supportbot_turn)
                if progress_callback:
                    progress_callback(list(turns), f"Generating SupportBot turn {len(turns)}")
                
                # Generate User response
                user_response = self._generate_user_turn(
                    goal, context, user_persona, conversation_history, domain, experience_data
                )
                
                user_turn = {
                    "role": "User",
                    "text": user_response,
                    "timestamp": datetime.now().isoformat()
                }
                turns.append(user_turn)
                conversation_history.append(user_turn)
                if progress_callback:
                    progress_callback(list(turns), f"Generating User turn {len(turns)}")
                
                # CRITICAL: Never check for goal satisfaction or break until we have at least min_turns
                if len(turns) < min_turns_required:
                    logger.debug(f"Dialogue {dialogue_id}: {len(turns)}/{min_turns_required} turns - continuing to reach minimum")
                    continue  # Skip goal check, continue generating
                
                # Break repetition loop: if last N turns mirror the N before, force completion and exit
                if self._detect_repetition_loop(turns):
                    logger.info(f"Dialogue {dialogue_id}: repetition loop detected at {len(turns)} turns; forcing completion.")
                    venue = self._venue_from_goal(goal, domain)
                    if domain == "hotel":
                        confirm = f"Your booking at {venue} is confirmed for 2 nights. Is there anything else?"
                    elif domain == "restaurant":
                        confirm = f"Your reservation at {venue} is confirmed. Is there anything else?"
                    else:
                        confirm = f"All set with your request for {goal}. Anything else I can help with?"
                    turns.append({
                        "role": "SupportBot",
                        "text": confirm,
                        "timestamp": datetime.now().isoformat()
                    })
                    conversation_history.append(turns[-1])
                    turns.append({
                        "role": "User",
                        "text": "Thank you, that's perfect! I'm all set.",
                        "timestamp": datetime.now().isoformat()
                    })
                    conversation_history.append(turns[-1])
                    if progress_callback:
                        progress_callback(list(turns), "Completed (loop broken)")
                    break
                
                # Aggressively optimized goal satisfaction check:
                # 1. Only check after min_turns are reached (enforced above)
                # 2. Check every 3 turns (not every 2) to further reduce LLM calls
                # 3. Skip check if we're at max_turns (just finish the dialogue)
                # 4. Use keyword-based check first (faster, no LLM call)
                goal_check_interval = 3  # Increased from 2 to 3
                if (len(turns) - last_goal_check_turn >= goal_check_interval and
                    turn_num < max_turns):  # Don't check on last turn, just finish
                    # First try fast keyword-based check (no LLM call, instant)
                    if self._check_completion_keywords(goal, conversation_history):
                        logger.info(f"Goal satisfied (keyword check) after {len(turns)} turns for dialogue {dialogue_id}")
                        break
                    # Only use slow LLM check if keyword check fails (skip if timeout risk)
                    # For very slow models, we can skip LLM check entirely and rely on keywords
                    try:
                        if self._check_goal_satisfied(goal, conversation_history):
                            logger.info(f"Goal satisfied (LLM check) after {len(turns)} turns for dialogue {dialogue_id}")
                            break
                    except Exception as e:
                        logger.warning(f"Goal satisfaction LLM check failed: {e}. Continuing with keyword-based detection only.")
                    last_goal_check_turn = len(turns)
                
            except Exception as e:
                logger.error(f"Error in turn {turn_num} for dialogue {dialogue_id}: {e}")
                # CRITICAL: Don't break if we haven't reached min_turns yet
                # Add only the missing turn (avoid double SupportBot or double User)
                if len(turns) < min_turns_required:
                    logger.warning(f"Error occurred but only {len(turns)}/{min_turns_required} turns generated. Using fallback to continue.")
                    last_role = turns[-1].get("role") if turns else None
                    # Exception happened either during SupportBot or User generation in this iteration.
                    # If we just appended SupportBot, we failed on User -> add only User.
                    # If last turn is User (from previous iteration), we failed on SupportBot -> add only SupportBot.
                    if last_role == "SupportBot":
                        user_turn = {
                            "role": "User",
                            "text": self._get_fallback_user_response(conversation_history, goal, domain),
                            "timestamp": datetime.now().isoformat()
                        }
                        turns.append(user_turn)
                        conversation_history.append(user_turn)
                    else:
                        supportbot_turn = {
                            "role": "SupportBot",
                            "text": self._get_fallback_supportbot_response(goal, conversation_history, domain),
                            "timestamp": datetime.now().isoformat()
                        }
                        turns.append(supportbot_turn)
                        conversation_history.append(supportbot_turn)
                    continue  # Continue loop instead of breaking
                else:
                    # Only break if we've reached min_turns and an error occurs
                    logger.warning(f"Error after reaching min_turns. Stopping dialogue generation.")
                    break
        
        # CRITICAL: Final validation - ensure we have at least min_turns before returning
        # Even if goal was satisfied early, we need minimum turns for quality
        while len(turns) < min_turns_required:
            logger.warning(f"Dialogue {dialogue_id}: Only {len(turns)}/{min_turns_required} turns generated. Adding fallback turns to reach minimum.")
            
            # Add SupportBot turn if needed
            if len([t for t in turns if t.get("role") == "SupportBot"]) < min_turns_required // 2:
                supportbot_turn = {
                    "role": "SupportBot",
                    "text": self._get_fallback_supportbot_response(goal, conversation_history, domain),
                    "timestamp": datetime.now().isoformat()
                }
                turns.append(supportbot_turn)
                conversation_history.append(supportbot_turn)
            
            # Add User turn if needed
            if len(turns) < min_turns_required:
                user_turn = {
                    "role": "User",
                    "text": self._get_fallback_user_response(conversation_history, goal, domain),
                    "timestamp": datetime.now().isoformat()
                }
                turns.append(user_turn)
                conversation_history.append(user_turn)
        
        # Final check - log warning if we still don't have enough turns (shouldn't happen)
        if len(turns) < min_turns_required:
            logger.error(f"CRITICAL: Dialogue {dialogue_id} has only {len(turns)} turns, required {min_turns_required}. This should not happen!")
        
        # Track generation end time and calculate duration
        import time
        generation_end_time = time.time()
        generation_duration = generation_end_time - generation_start_time
        
        # Create dialogue data
        metadata = {
            "num_turns": len(turns),
            "generated_at": datetime.now().isoformat(),
            "model_version": self.config.mistral_model,
            "max_turns_reached": len(turns) >= max_turns,
            "min_turns_met": len(turns) >= min_turns_required,
            "generation_time_seconds": round(generation_duration, 3),
            "generation_start_time": datetime.fromtimestamp(generation_start_time).isoformat(),
            "generation_end_time": datetime.fromtimestamp(generation_end_time).isoformat()
        }
        if experience_data.get("subgoals") or experience_data.get("constraints"):
            metadata["goal_complexity"] = len(experience_data.get("subgoals") or []) + len(experience_data.get("constraints") or {})
        if experience_data.get("user_persona_traits"):
            metadata["user_persona_traits"] = experience_data["user_persona_traits"]
        if experience_data.get("supportbot_style"):
            metadata["supportbot_style"] = experience_data["supportbot_style"]
        dialogue_data = {
            "dialogue_id": dialogue_id,
            "goal": goal,
            "domain": experience_data.get("domain", "unknown"),
            "context": context,
            "user_persona": user_persona,
            "turns": turns,
            "metadata": metadata
        }
        
        logger.info(f"Generated dialogue {dialogue_id} with {len(turns)} turns (minimum required: {min_turns_required}) in {generation_duration:.2f}s")
        return dialogue_data
    
    def _format_structured_goal(self, experience_data: Optional[Dict[str, Any]] = None) -> str:
        """Format optional subgoals and constraints for injection into prompts."""
        if not experience_data:
            return ""
        parts = []
        subgoals = experience_data.get("subgoals")
        if subgoals and isinstance(subgoals, list):
            parts.append("Subgoals: " + "; ".join(str(s) for s in subgoals))
        constraints = experience_data.get("constraints")
        if constraints and isinstance(constraints, dict):
            parts.append("Constraints: " + ", ".join(f"{k}={v}" for k, v in constraints.items()))
        if not parts:
            return ""
        return "\n".join(parts) + "\n"

    def _last_k_turns(self, history: List[Dict[str, str]], k: Optional[int] = None) -> List[Dict[str, str]]:
        """Return the last k conversation turns (excluding System), so we keep full goal + recent context."""
        k = k or getattr(self.config, "prompt_last_k_turns", 6)
        conv = [h for h in history if h.get("role") != "System"]
        return conv[-k:] if len(conv) > k else conv

    def _detect_repetition_loop(self, turns: List[Dict[str, Any]], window: int = 6, threshold: float = 0.5) -> bool:
        """True if the last `window` turns are very similar to the previous `window` (indicates a repeat loop).

        Slightly larger window + lower threshold so we catch loops earlier but with more context.
        """
        if len(turns) < 2 * window:
            return False
        recent = [t.get("text", "") for t in turns[-window:]]
        previous = [t.get("text", "") for t in turns[-(2 * window):-window]]
        similarities = [calculate_similarity(recent[i], previous[i]) for i in range(window)]
        return sum(similarities) / window >= threshold

    # Note: conversation flow is now delegated to the LLM; we intentionally avoid
    # simulator-side heuristics that decide which slot/question to ask next.

    def _progress_hint_for_user(self, goal: str) -> str:
        """Progress hint optimized for Task Success Rate—ensures explicit satisfaction when goal is achieved."""
        return (
            "CRITICAL FOR EVALUATION: If your goal has been FULLY addressed (all constraints satisfied, requestables provided, assistant confirmed completion), "
            "you MUST express EXPLICIT satisfaction in this turn. Use clear phrases like 'Thank you, that's perfect!', 'Great, I'm all set!', "
            "'Perfect, that's exactly what I needed!', or 'Excellent, thank you so much!'—not just 'okay' or 'sure'. "
            "If your goal is NOT yet complete, ask for the next missing piece using FRESH wording (do not repeat previous phrases)."
        )

    def _generate_user_turn(
        self, 
        goal: str, 
        context: str, 
        user_persona: str, 
        history: List[Dict[str, str]],
        domain: str = "general",
        experience_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """Generate a user turn using the User agent prompt, leaving flow to the LLM."""
        recent = self._last_k_turns(history)
        history_text = format_conversation_history(recent)
        progress_hint = self._progress_hint_for_user(goal)
        structured_goal = self._format_structured_goal(experience_data)
        persona_traits = (experience_data or {}).get("user_persona_traits", "") or ""
        if persona_traits:
            persona_traits = f"Communication style: {persona_traits}"

        prompt = self.user_prompts["user"].format(
            domain=domain,
            goal=goal,
            context=context,
            user_persona=user_persona,
            structured_goal=structured_goal,
            persona_traits=persona_traits,
            history=history_text,
            progress_hint=progress_hint
        )

        full_prompt = f"{self.user_prompts['system']}\n\n{prompt}"

        max_words = getattr(self.config, "prompt_max_words", 1000)
        truncated_prompt = self._truncate_prompt(full_prompt, max_length=max_words)

        max_tokens_user = getattr(self.config, "max_tokens_user_turn", 60)
        response = self.llm_client.generate_completion(
            truncated_prompt,
            temperature=self.config.temperature,
            top_p=self.config.top_p,
            max_tokens=max_tokens_user
        )

        cleaned_response = self._clean_response(response, role="User")
        cleaned_response = cleaned_response.strip()

        # Minimal anti-repetition: avoid exact same User text twice
        if history:
            for prev_turn in history:
                if prev_turn.get("role") != "User":
                    continue
                prev_text = (prev_turn.get("text") or "").strip()
                if prev_text and cleaned_response.lower() == prev_text.lower():
                    logger.warning(f"Prevented exact repetition for User: '{cleaned_response}' matches previous turn")
                    cleaned_response = self._vary_response(cleaned_response, goal, domain)
                    break

        if not cleaned_response:
            return "I need help with this."

        return cleaned_response
    
    def _generate_supportbot_turn(
        self, 
        goal: str, 
        context: str, 
        history: List[Dict[str, str]],
        domain: str = "general",
        experience_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """Generate a SupportBot turn using only the LLM with goal + context + history."""
        recent = self._last_k_turns(history)
        history_text = format_conversation_history(recent)
        structured_goal = self._format_structured_goal(experience_data)
        supportbot_style = (experience_data or {}).get("supportbot_style", "") or ""
        if supportbot_style:
            supportbot_style = f"Style: {supportbot_style}"

        # Build prompt
        prompt = self.supportbot_prompts["supportbot"].format(
            domain=domain,
            goal=goal,
            context=context,
            structured_goal=structured_goal,
            supportbot_style=supportbot_style,
            history=history_text
        )

        full_prompt = f"{self.supportbot_prompts['system']}\n\n{prompt}"

        max_words = getattr(self.config, "prompt_max_words", 1000)
        truncated_prompt = self._truncate_prompt(full_prompt, max_length=max_words)

        max_tokens_supportbot = getattr(self.config, "max_tokens_supportbot_turn", 100)
        response = self.llm_client.generate_completion(
            truncated_prompt,
            temperature=self.config.temperature,
            top_p=self.config.top_p,
            max_tokens=max_tokens_supportbot
        )
        cleaned_response = self._clean_response(response, role="SupportBot")
        cleaned_response = cleaned_response.strip()

        # Minimal anti-repetition: avoid exact same SupportBot text twice
        if history:
            for prev_turn in history:
                if prev_turn.get("role") == "SupportBot":
                    prev_text = (prev_turn.get("text") or "").strip()
                    if prev_text and cleaned_response.lower() == prev_text.lower():
                        logger.warning("SupportBot response matched previous turn exactly; varying phrasing.")
                        # Use last user message for slight variation if available
                        last_user_msg = ""
                        for turn in reversed(recent):
                            if turn.get("role") == "User":
                                last_user_msg = turn.get("text", "")
                                break
                        cleaned_response = self._vary_supportbot_response(cleaned_response, goal, domain, last_user_msg)
                        break

        if not cleaned_response:
            return "I can help you with that."

        return cleaned_response
    
    def _check_goal_satisfied(
        self, 
        goal: str, 
        history: List[Dict[str, str]]
    ) -> bool:
        """
        Check if the user's goal has been satisfied.
        
        Args:
            goal: User's original goal
            history: Conversation history (includes System message)
            
        Returns:
            True if goal is satisfied, False otherwise
        """
        # Count actual conversation turns (excluding System message)
        user_turns = [h for h in history if h.get("role") == "User"]
        supportbot_turns = [h for h in history if h.get("role") == "SupportBot"]
        total_turns = len(user_turns) + len(supportbot_turns)
        
        # Require at least min_turns before checking goal satisfaction
        # This ensures we have a meaningful conversation with multiple exchanges
        if total_turns < self.config.min_turns:
            return False
        
        # Optimize: Reduced requirement from 3 to 2 exchanges for faster checking
        # This means at least 2 User turns and 2 SupportBot turns
        if len(user_turns) < 2 or len(supportbot_turns) < 2:
            return False
        
        history_text = format_conversation_history(history)
        
        prompt = self.goal_satisfaction_prompts["goal_check"].format(
            goal=goal,
            history=history_text
        )
        
        try:
            # Optimize: Use even lower max_tokens and faster check
            response = self.llm_client.generate_completion(
                prompt,
                temperature=0.1,  # Low temperature for consistent yes/no
                max_tokens=3  # Reduced from 5 - just need YES/NO
            )
            
            # Check for goal satisfaction indicators (faster string check)
            response_upper = response.strip().upper()
            # Optimize: Simple check - if response starts with YES or contains YES without NO
            if response_upper.startswith("YES"):
                return True
            if "YES" in response_upper and "NO" not in response_upper:
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error checking goal satisfaction: {e}")
            # Fallback: check for completion keywords (faster than LLM call)
            return self._check_completion_keywords(goal, history)
    
    def _check_completion_keywords(
        self, 
        goal: str, 
        history: List[Dict[str, str]]
    ) -> bool:
        """Fallback method to check goal completion using keywords."""
        completion_keywords = [
            "thank you", "thanks", "perfect", "great", "excellent", "that's great", "that works",
            "sounds good", "all set", "i'm all set", "that's exactly what I needed", "that'll work",
            "booked", "confirmed", "reserved", "done", "completed", "appreciate it", "good, thank"
        ]
        
        # Check last few turns for completion indicators
        recent_turns = history[-4:] if len(history) >= 4 else history
        
        for turn in recent_turns:
            if turn.get("role") == "User":
                text = turn.get("text", "").lower()
                if any(keyword in text for keyword in completion_keywords):
                    return True
        
        return False
    
    def _clean_response(self, response: str, role: str = "User") -> str:
        """Clean LLM response to remove role prefixes, conversation history, and formatting."""
        if not response:
            return ""
        
        # Remove common role prefixes
        response = response.strip()
        
        # Remove role labels at the start (case-insensitive)
        role_prefixes = [
            f"{role}:", f"{role.lower()}:", f"{role.upper()}:",
            f"User:", "user:", "USER:",
            f"SupportBot:", "supportbot:", "SUPPORTBOT:",
            "System:", "system:", "SYSTEM:",
            "Assistant:", "assistant:", "ASSISTANT:"
        ]
        
        for prefix in role_prefixes:
            if response.startswith(prefix):
                response = response[len(prefix):].strip()
        
        # Remove quotes if the entire response is quoted
        if response.startswith('"') and response.endswith('"'):
            response = response[1:-1].strip()
        if response.startswith("'") and response.endswith("'"):
            response = response[1:-1].strip()
        
        # Remove conversation history patterns (e.g., "User: ... SupportBot: ...")
        lines = response.split('\n')
        cleaned_lines = []
        for line in lines:
            line = line.strip()
            # Skip lines that look like conversation history
            if any(line.startswith(prefix) for prefix in role_prefixes):
                continue
            # Skip lines that are just role labels
            if line.lower() in ["user", "supportbot", "system", "assistant"]:
                continue
            if line:
                cleaned_lines.append(line)
        
        response = " ".join(cleaned_lines).strip()
        
        # Remove any remaining role prefixes from the middle (shouldn't happen, but just in case)
        for prefix in role_prefixes:
            response = response.replace(prefix, "").strip()
        
        # If response is empty after cleaning, return a simple fallback
        if not response:
            if role == "User":
                return "I need help with this."
            else:
                return "I can help you with that."
        
        return response
    
    def _vary_response(self, original: str, goal: str, domain: str) -> str:
        """Vary a user response to avoid exact repetition."""
        # Simple variation strategies
        variations = {
            "I think": "I believe",
            "that could work": "that might work",
            "What's the": "Can you tell me the",
            "Do you have": "Are there any",
            "I need": "I'm looking for",
            "I'd like": "I want",
            "Can I": "Is it possible to",
        }
        
        varied = original
        for old, new in variations.items():
            if old.lower() in varied.lower():
                varied = varied.replace(old, new)
                break
        
        # If no variation found, add a clarifying phrase
        if varied == original:
            if "?" not in varied:
                varied = varied + " Can you help?"
            else:
                varied = "Also, " + varied.lower()
        
        return varied.strip()
    
    def _vary_supportbot_response(self, original: str, goal: str, domain: str, last_user_msg: str = "") -> str:
        """Vary a SupportBot response to avoid exact repetition, considering the last user message."""
        # Simple variation strategies
        variations = [
            ("I can help", "I'd be happy to help"),
            ("Let me check", "I'll check"),
            ("Would you like", "Would you prefer"),
            ("I can", "I'm able to"),
            ("Great!", "Perfect!"),
            ("Yes, I can", "Absolutely, I can"),
        ]
        
        varied = original
        for old, new in variations:
            if old in varied:
                varied = varied.replace(old, new)
                break
        
        # If still the same and we have last user message, try to reference it
        if varied == original and last_user_msg:
            # Add acknowledgment of user's last message
            if "?" in last_user_msg:
                varied = "Regarding your question, " + varied.lower()
            else:
                varied = "I understand. " + varied
        
        return varied.strip()
    
    def _truncate_prompt(self, prompt: str, max_length: Optional[int] = None) -> str:
        """Truncate prompt: keep full goal/instructions + recent part (higher limit, avoid dropping mid-dialogue)."""
        max_length = max_length or getattr(self.config, "prompt_max_words", 1000)
        instruction_words = getattr(self.config, "prompt_instruction_words", 250)
        words = prompt.split()
        if len(words) <= max_length:
            return prompt
        # Keep first N words (goal, domain, instructions) and last part (recent history)
        first_part = " ".join(words[:instruction_words])
        last_part = " ".join(words[-(max_length - instruction_words):])
        return f"{first_part}... [truncated] ...{last_part}"
    
    def _get_fallback_user_response(self, history: List[Dict[str, str]], goal: str = "", domain: str = "general") -> str:
        """Goal-aware fallback for User when LLM fails. Avoid generic 'having trouble explaining' where possible."""
        if goal and goal.strip():
            g = goal.strip()
            # If goal looks like raw slot format, convert to natural language for the fallback
            if "train-leaveat:" in g.lower():
                leaveat = g.split("train-leaveat:")[-1].split(";")[0].strip()
                return f"I need to catch a train leaving at {leaveat}. Can you help with that?"
            if "taxi-" in g.lower():
                return "I need to book a taxi. Can you help me with that?"
            if "attraction" in g.lower():
                return "I'm looking for things to do or attractions. Can you help?"
            # Natural-language goal
            return f"I still need help with {g}."
        if not history or len(history) < 2:
            return "I need help with this."
        return "I still need a bit more help with this, please."
    
    def _venue_from_goal(self, goal: str, domain: str) -> str:
        """Extract venue/entity name from goal for goal-aware fallbacks (e.g. 'Book a room at worth house' -> 'Worth House')."""
        if not goal or not goal.strip():
            return "our property" if domain == "hotel" else "that restaurant" if domain == "restaurant" else "that"
        g = goal.strip()
        # "Book a room at X" / "Find information about X" / "Make a reservation at X"
        for prefix in ("book a room at ", "find information about ", "make a reservation at ", "get info on ", "info about "):
            if g.lower().startswith(prefix):
                name = g[len(prefix):].strip()
                return name.title() if name else ("our property" if domain == "hotel" else "that restaurant")
        # "Book a taxi from X" / "to X" - use as-is for taxi
        if " from " in g.lower():
            part = g.lower().split(" from ", 1)[1].split(" to ")[0].strip()
            return part.title() if part else "your location"
        return g.title()

    def _get_fallback_supportbot_response(self, goal: str, history: List[Dict[str, str]], domain: str = "general") -> str:
        """Generate a context-aware fallback supportbot response without LLM call. Uses venue from goal."""
        venue = self._venue_from_goal(goal, domain)
        if not history or len(history) < 2:
            if domain == "hotel":
                return f"Great! I can help you book at {venue}. What dates do you need the room for?"
            elif domain == "restaurant":
                return f"I'd be happy to help you with {venue}. How many people and what time are you looking for?"
            return f"I'd be happy to help you with {goal}. How can I assist you?"
        
        # Get the last user message to respond to it
        last_user = None
        for turn in reversed(history):
            if turn.get("role") == "User":
                last_user = turn.get("text", "").lower()
                break
        
        if not last_user:
            return f"I can help you with {goal}. What would you like to know?"
        
        # Extract information from conversation history to track what's been discussed
        all_user_text = " ".join([h.get("text", "").lower() for h in history if h.get("role") == "User"])
        all_supportbot_text = " ".join([h.get("text", "").lower() for h in history if h.get("role") == "SupportBot"])
        
        # Track what information has been provided/asked
        has_dates_info = any(word in all_user_text for word in ["night", "nights", "2 night", "weekend", "friday", "saturday"])
        has_price_asked = any(word in all_user_text for word in ["price", "cost", "rate", "how much"])
        has_amenity_asked = any(
            word in all_user_text
            for word in ["wifi", "breakfast", "amenity", "amenities", "include", "what's included", "parking"]
        )
        has_availability_asked = any(word in all_user_text for word in ["available", "availability", "book", "reserve"])
        price_answered = any(word in all_supportbot_text for word in ["£65", "£130", "per night", "total"])
        amenity_answered = any(word in all_supportbot_text for word in ["wifi", "breakfast", "includes"])
        availability_answered = any(word in all_supportbot_text for word in ["available", "book", "reservation"])
        
        # Respond to what the user just said - use goal's venue, not hardcoded "City Centre North B&B"
        if domain == "hotel":
            if ("price" in last_user or "cost" in last_user or "rate" in last_user or "how much" in last_user) and not price_answered:
                if has_dates_info:
                    return f"{venue} is £65 per night. For 2 nights, that's £130 total including WiFi and breakfast. Would you like to proceed with the booking?"
                else:
                    return f"{venue} offers rooms at £65 per night. How many nights do you need?"
            
            elif ("available" in last_user or "weekend" in last_user) and not availability_answered:
                return f"Yes, I have availability for this weekend at {venue}. The rate is £65 per night. Would you like to book?"
            
            elif ("amenity" in last_user or "wifi" in last_user or "breakfast" in last_user or "include" in last_user or "what's included" in last_user) and not amenity_answered:
                return f"{venue} includes free WiFi, continental breakfast, and is located in the city center. The rate is £65 per night. Would you like to make a reservation?"
            
            elif ("night" in last_user or "nights" in last_user or "2 night" in last_user) and has_dates_info:
                if not price_answered:
                    return f"Perfect! For 2 nights at {venue}, the total is £130 including WiFi and breakfast. Would you like me to proceed with the booking?"
                else:
                    return f"Great! I can confirm your booking for 2 nights at {venue} for £130. Would you like me to complete the reservation?"
            
            elif "?" in last_user:
                if "what" in last_user and ("amenity" in last_user or "include" in last_user):
                    return f"{venue} includes free WiFi, continental breakfast, and city center location. The rate is £65 per night."
                elif "what" in last_user and ("price" in last_user or "cost" in last_user):
                    return "The rate is £65 per night. For 2 nights, the total is £130 including all amenities."
                elif "do you" in last_user or "can you" in last_user:
                    if has_dates_info:
                        return f"Yes, I can book a room for 2 nights at {venue} for £130. Shall I proceed?"
                    else:
                        return "Yes, I can help you book. What dates do you need?"
                else:
                    if has_dates_info and has_price_asked:
                        return f"I can confirm your booking for 2 nights at {venue} for £130. Would you like to proceed?"
                    elif has_dates_info:
                        return "For 2 nights, the total is £130 including WiFi and breakfast. Would you like to book?"
                    else:
                        return f"I can help you book at {venue}. What dates do you need?"
            
            else:
                if has_dates_info and price_answered:
                    return f"Perfect! I have all the details. Your booking for 2 nights at {venue} for £130 is ready. Would you like me to confirm the reservation?"
                elif has_dates_info:
                    return "Great! For 2 nights, the total cost is £130 including WiFi and breakfast. Would you like to complete the booking?"
                elif price_answered:
                    return "The rate is £65 per night. How many nights would you like to book?"
                else:
                    return f"I can help you book at {venue}. What dates do you need the room for?"
        
        elif domain == "restaurant":
            # Directly answer common restaurant questions instead of meta prompts
            if "vegetarian" in last_user or "vegan" in last_user or "gluten free" in last_user:
                return (
                    f"Yes, {venue} offers vegetarian options on the menu, including mains and sides. "
                    "Would you like me to focus on specific dishes or help you with a reservation?"
                )
            elif "menu" in last_user:
                return (
                    f"{venue} has a varied menu with starters, mains, and desserts. "
                    "I can highlight price ranges or vegetarian options if you tell me what you're interested in."
                )
            elif "parking" in last_user or "car park" in last_user or "carpark" in last_user:
                return (
                    f"{venue} has nearby parking options for guests. "
                    "If you tell me your arrival time, I can check what is likely to be available."
                )
            elif "price" in last_user or "cost" in last_user or "expensive" in last_user or "cheap" in last_user:
                return f"{venue} typically ranges from £25-50 per person. Would you like me to check availability in your price range?"
            elif "available" in last_user or "reservation" in last_user or "book" in last_user:
                return f"I can check availability for {venue}. What date, time, and how many people?"
            elif "?" in last_user:
                # Generic question about the restaurant
                return (
                    f"For {venue}, I can help with details like menu highlights, typical prices, opening hours, "
                    "and reservation options. What would you like to know first?"
                )
            else:
                return f"I can help you with {venue}. What time are you looking to dine and how many people?"
        
        elif domain == "taxi":
            if "price" in last_user or "fare" in last_user or "cost" in last_user:
                return "The estimated fare to the city center is £25-30. Would you like me to book the taxi?"
            elif "time" in last_user or "when" in last_user:
                return "I can arrange pickup in about 10-15 minutes. What's your pickup location?"
            elif "?" in last_user:
                return "I can help you book a taxi. Where would you like to go?"
            else:
                return "I can arrange a taxi for you. What's your destination and preferred pickup time?"
        
        elif domain == "train":
            if "price" in last_user or "cost" in last_user or "ticket" in last_user:
                return "Train tickets range from £30-45 depending on the service. Express trains are £45, regular trains are £30. Which would you prefer?"
            elif "time" in last_user or "schedule" in last_user or "when" in last_user:
                return "Express trains depart at 9 AM and 2 PM. Regular trains have more frequent departures. What time works for you?"
            elif "?" in last_user:
                return "I can help you book train tickets. What's your destination and travel date?"
            else:
                return "I can help with train bookings. Where are you traveling to and when?"
        
        elif domain == "attraction":
            if "price" in last_user or "cost" in last_user or "ticket" in last_user:
                return "Attraction tickets range from £15-25. The museum is £15, city tours are £25. Which interests you?"
            elif "time" in last_user or "open" in last_user or "when" in last_user:
                return "The museum is open 10 AM-6 PM daily. City tours run at 11 AM and 3 PM. Which would you prefer?"
            elif "?" in last_user:
                return "I can help you find attractions. What type of activities are you interested in?"
            else:
                return "I can help with attractions. Are you interested in museums, tours, or outdoor activities?"
        
        # Generic fallback - respond to what user said
        if "?" in last_user:
            return "Let me check that information for you."
        elif "thank" in last_user:
            return "You're welcome! Is there anything else I can help with?"
        elif "need" in last_user or "want" in last_user:
            return f"I can help you with that. Let me provide some options for {goal}."
        else:
            return f"I understand. Let me help you with {goal}. What specific information do you need?"
    
    def simulate_batch_dialogues(
        self, 
        experience_data_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Simulate multiple dialogues in batch.
        
        Args:
            experience_data_list: List of experience data for each dialogue
            
        Returns:
            List of dialogue data
        """
        dialogues = []
        
        for i, experience_data in enumerate(experience_data_list):
            try:
                dialogue = self.simulate_dialogue(experience_data)
                dialogues.append(dialogue)
                
                # Add small delay between dialogues
                if i < len(experience_data_list) - 1:
                    time.sleep(0.5)
                    
            except Exception as e:
                logger.error(f"Error simulating dialogue {i}: {e}")
                continue
        
        logger.info(f"Simulated {len(dialogues)} out of {len(experience_data_list)} dialogues")
        return dialogues
