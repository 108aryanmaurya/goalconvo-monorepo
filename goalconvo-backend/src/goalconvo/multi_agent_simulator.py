"""
Multi-Agent Simulator implementing Algorithm 1 from the research paper.

Simulates dialogues between User and SupportBot agents using Mistral-7B.
"""

import json
import logging
import time
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

from .config import Config
from .llm_client import LLMClient
from .utils import generate_dialogue_id, format_conversation_history

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
        """Create prompt templates for the User agent."""
        return {
            "system": """You are a user with a specific goal that you want to achieve through conversation with a support assistant. 
Your role is to:
1. Clearly communicate your needs and requirements
2. Ask relevant questions to get the information you need
3. Provide necessary details when asked
4. Express satisfaction or dissatisfaction with responses
5. Work towards achieving your stated goal

Remember: You have a specific goal in mind and should stay focused on achieving it. Be specific about your needs and ask for concrete information.""",
            
            "user": """Domain: {domain}
Goal: {goal}
Context: {context}
User Persona: {user_persona}

Conversation History:
{history}

Based on your goal related to {domain} and the conversation so far, what would you say next to the support assistant? Be natural, conversational, and specific about your {domain}-related needs. Ask for concrete details (prices, availability, options, requirements). Be concise (1-2 sentences). Stay focused on your goal.

IMPORTANT: Respond ONLY with your message to the support assistant. Do NOT include role labels like "User:" or "SupportBot:". Do NOT repeat the conversation history. Just write your message directly."""
        }
    
    def _create_supportbot_prompts(self) -> Dict[str, str]:
        """Create prompt templates for the SupportBot agent."""
        return {
            "system": """You are a helpful support assistant who aims to assist users in achieving their goals. 
Your role is to:
1. Understand the user's needs and goals
2. Provide helpful, accurate information
3. Ask clarifying questions when needed
4. Offer solutions and alternatives
5. Be professional, friendly, and efficient
6. Work towards helping the user achieve their stated goal

IMPORTANT: Keep your responses concise and to the point (2-3 sentences maximum). Avoid lengthy explanations unless absolutely necessary.""",
            
            "supportbot": """Domain: {domain}
User Goal: {goal}
Context: {context}

Conversation History:
{history}

As a helpful support assistant specializing in {domain}, how would you respond to help the user achieve their goal? Be specific, actionable, and domain-appropriate. Provide concrete information relevant to {domain} (e.g., specific options, prices, availability, requirements). Be concise (2-3 sentences maximum).

IMPORTANT: 
- Your response should be specific to {domain} and include relevant details
- Respond ONLY with your message to the user. Do NOT include role labels like "User:" or "SupportBot:". 
- Do NOT repeat the conversation history. Just write your message directly."""
        }
    
    def _create_goal_satisfaction_prompts(self) -> Dict[str, str]:
        """Create prompts for checking goal satisfaction."""
        return {
            "goal_check": """Analyze the following conversation to determine if the user's goal has been FULLY and COMPLETELY achieved.

User Goal: {goal}
Conversation:
{history}

Has the user's goal been successfully achieved? You must be STRICT in your assessment. Consider:
1. Has the user received ALL the information or service they needed?
2. Has their request been COMPLETELY fulfilled (not just partially)?
3. Has the user explicitly expressed satisfaction or completion?
4. Is there clear evidence that the goal is COMPLETE (e.g., booking confirmed, order placed, information fully provided)?

IMPORTANT: Only respond "YES" if the goal is COMPLETELY achieved with clear evidence. If the conversation is still ongoing, information is incomplete, or the user hasn't confirmed completion, respond "NO".

Respond with only "YES" if the goal has been FULLY achieved, or "NO" if it hasn't."""
        }
    
    def simulate_dialogue(
        self, 
        experience_data: Dict[str, Any], 
        max_turns: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Simulate a complete dialogue following Algorithm 1.
        
        Args:
            experience_data: Initial experience data with goal, context, etc.
            max_turns: Maximum number of turns (overrides config)
            
        Returns:
            Complete dialogue data
        """
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
        else:
            # Generate initial user utterance if not provided
            user_response = self._generate_user_turn(
                goal, context, user_persona, conversation_history, domain
            )
            user_turn = {
                "role": "User",
                "text": user_response,
                "timestamp": datetime.now().isoformat()
            }
            turns.append(user_turn)
            conversation_history.append(user_turn)
        
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
                    goal, context, conversation_history, domain
                )
                
                supportbot_turn = {
                    "role": "SupportBot",
                    "text": supportbot_response,
                    "timestamp": datetime.now().isoformat()
                }
                turns.append(supportbot_turn)
                conversation_history.append(supportbot_turn)
                
                # Generate User response
                user_response = self._generate_user_turn(
                    goal, context, user_persona, conversation_history, domain
                )
                
                user_turn = {
                    "role": "User",
                    "text": user_response,
                    "timestamp": datetime.now().isoformat()
                }
                turns.append(user_turn)
                conversation_history.append(user_turn)
                
                # CRITICAL: Never check for goal satisfaction or break until we have at least min_turns
                if len(turns) < min_turns_required:
                    logger.debug(f"Dialogue {dialogue_id}: {len(turns)}/{min_turns_required} turns - continuing to reach minimum")
                    continue  # Skip goal check, continue generating
                
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
                # Use fallback responses to continue the dialogue
                if len(turns) < min_turns_required:
                    logger.warning(f"Error occurred but only {len(turns)}/{min_turns_required} turns generated. Using fallback to continue.")
                    # Add fallback turns to reach minimum
                    if len([t for t in turns if t.get("role") == "SupportBot"]) < min_iterations:
                        supportbot_turn = {
                            "role": "SupportBot",
                            "text": self._get_fallback_supportbot_response(goal, conversation_history, domain),
                            "timestamp": datetime.now().isoformat()
                        }
                        turns.append(supportbot_turn)
                        conversation_history.append(supportbot_turn)
                    
                    if len([t for t in turns if t.get("role") == "User"]) < min_turns_required // 2 + 1:
                        user_turn = {
                            "role": "User",
                            "text": self._get_fallback_user_response(conversation_history, goal, domain),
                            "timestamp": datetime.now().isoformat()
                        }
                        turns.append(user_turn)
                        conversation_history.append(user_turn)
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
        
        # Create dialogue data
        dialogue_data = {
            "dialogue_id": dialogue_id,
            "goal": goal,
            "domain": experience_data.get("domain", "unknown"),
            "context": context,
            "user_persona": user_persona,
            "turns": turns,
            "metadata": {
                "num_turns": len(turns),
                "generated_at": datetime.now().isoformat(),
                "model_version": self.config.mistral_model,
                "max_turns_reached": len(turns) >= max_turns,
                "min_turns_met": len(turns) >= min_turns_required
            }
        }
        
        logger.info(f"Generated dialogue {dialogue_id} with {len(turns)} turns (minimum required: {min_turns_required})")
        return dialogue_data
    
    def _generate_user_turn(
        self, 
        goal: str, 
        context: str, 
        user_persona: str, 
        history: List[Dict[str, str]],
        domain: str = "general"
    ) -> str:
        """Generate a user turn using the User agent prompt."""
        history_text = format_conversation_history(history)
        
        prompt = self.user_prompts["user"].format(
            domain=domain,
            goal=goal,
            context=context,
            user_persona=user_persona,
            history=history_text
        )
        
        # Add system message
        full_prompt = f"{self.user_prompts['system']}\n\n{prompt}"
        
        try:
            # Truncate prompt if too long, but keep more context for domain-specific responses
            truncated_prompt = self._truncate_prompt(full_prompt, max_length=500)
            
            response = self.llm_client.generate_completion(
                truncated_prompt,
                temperature=self.config.temperature,
                top_p=self.config.top_p,
                max_tokens=100  # Increased for better response quality
            )
            # Clean response: remove role prefixes, conversation history, and extra formatting
            cleaned_response = self._clean_response(response, role="User")
            return cleaned_response[:200]  # Increased limit to accommodate longer responses
        except Exception as e:
            logger.warning(f"Error generating user turn: {e}. Using fallback response.")
            logger.debug(f"Prompt that failed: {full_prompt[:200]}...")
            # Smart fallback based on conversation context
            fallback = self._get_fallback_user_response(history, goal, domain)
            # Ensure we don't repeat the last user response
            if history:
                last_user = next((h for h in reversed(history) if h.get("role") == "User"), None)
                if last_user and last_user.get("text") == fallback:
                    # Modify slightly to avoid exact repetition
                    fallback = fallback.replace("I think", "I believe").replace("that could work", "that might work")
            return fallback
    
    def _generate_supportbot_turn(
        self, 
        goal: str, 
        context: str, 
        history: List[Dict[str, str]],
        domain: str = "general"
    ) -> str:
        """Generate a SupportBot turn using the SupportBot agent prompt."""
        history_text = format_conversation_history(history)
        
        prompt = self.supportbot_prompts["supportbot"].format(
            domain=domain,
            goal=goal,
            context=context,
            history=history_text
        )
        
        # Add system message
        full_prompt = f"{self.supportbot_prompts['system']}\n\n{prompt}"
        
        try:
            # Truncate prompt if too long, but keep more context for domain-specific responses
            truncated_prompt = self._truncate_prompt(full_prompt, max_length=500)
            
            response = self.llm_client.generate_completion(
                truncated_prompt,
                temperature=self.config.temperature,
                top_p=self.config.top_p,
                max_tokens=300  # Increased for better response quality
            )
            # Clean response: remove role prefixes, conversation history, and extra formatting
            cleaned_response = self._clean_response(response, role="SupportBot")
            return cleaned_response[:300]  # Increased limit to accommodate longer responses
        except Exception as e:
            logger.warning(f"Error generating SupportBot turn: {e}. Using fallback response.")
            logger.debug(f"Prompt that failed: {full_prompt[:200]}...")
            # Smart fallback based on conversation context
            fallback = self._get_fallback_supportbot_response(goal, history, domain)
            # Ensure we don't repeat the last supportbot response
            if history:
                last_supportbot = next((h for h in reversed(history) if h.get("role") == "SupportBot"), None)
                if last_supportbot and last_supportbot.get("text") == fallback:
                    # Modify slightly to avoid exact repetition
                    fallback = fallback.replace("I can help", "I'd be happy to help").replace("Let me check", "I'll check")
            return fallback
    
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
            "thank you", "thanks", "perfect", "great", "excellent",
            "that's exactly what I needed", "that works", "sounds good",
            "booked", "confirmed", "reserved", "done", "completed"
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
    
    def _truncate_prompt(self, prompt: str, max_length: int = 500) -> str:
        """Truncate prompt to reduce processing time for slow models."""
        words = prompt.split()
        if len(words) <= max_length:
            return prompt
        
        # Keep first part (system/instructions with domain info) and last part (recent history)
        first_part = " ".join(words[:150])  # Keep first 150 words (includes domain context)
        last_part = " ".join(words[-max_length+150:])  # Keep last part
        return f"{first_part}... [truncated] ...{last_part}"
    
    def _get_fallback_user_response(self, history: List[Dict[str, str]], goal: str = "", domain: str = "general") -> str:
        """Generate a context-aware fallback user response without LLM call."""
        # Check for repetition - if last 2 user responses are the same, change strategy
        if len(history) >= 4:
            user_turns = [h for h in history if h.get("role") == "User"]
            if len(user_turns) >= 2:
                last_two = [t.get("text", "") for t in user_turns[-2:]]
                if last_two[0] == last_two[1]:
                    # Break repetition by asking a specific question
                    if domain == "restaurant":
                        return "What are the prices and availability for Italian restaurants?"
                    elif domain == "hotel":
                        return "What are the room rates and amenities available?"
                    elif domain == "taxi":
                        return "What's the estimated fare and pickup time?"
                    elif domain == "train":
                        return "What are the departure times and ticket prices?"
                    elif domain == "attraction":
                        return "What are the opening hours and ticket prices?"
        
        # Simple pattern matching for common responses
        if not history or len(history) < 2:
            if domain == "restaurant":
                return "I'm looking for a good Italian restaurant for dinner tonight."
            elif domain == "hotel":
                return "I need to book a hotel room for this weekend."
            return "I need help with this."
        
        # Count turns to provide varied responses
        turn_count = len(history)
        user_turn_count = len([h for h in history if h.get("role") == "User"])
        
        last_supportbot = None
        for turn in reversed(history):
            if turn.get("role") == "SupportBot":
                last_supportbot = turn.get("text", "").lower()
                break
        
        # Domain-specific responses
        if domain == "restaurant":
            if "?" in last_supportbot or "available" in last_supportbot:
                responses = [
                    "I'd like a table for 2 people around 7 PM.",
                    "Do you have any vegetarian options?",
                    "What's the price range?",
                    "Can I see the menu?",
                    "Is there parking available?"
                ]
                return responses[user_turn_count % len(responses)]
            elif "help" in last_supportbot or "assist" in last_supportbot:
                return "I'm looking for Italian cuisine, preferably in the city center."
            else:
                return "That sounds good. Can you tell me more about the restaurant?"
        
        elif domain == "hotel":
            if "?" in last_supportbot:
                responses = [
                    "I need a room for 2 nights, preferably with WiFi.",
                    "What's the price per night?",
                    "Do you have rooms available this weekend?",
                    "What amenities are included?",
                    "Is breakfast included?"
                ]
                return responses[user_turn_count % len(responses)]
            else:
                return "I'd like to know more about the room options and pricing."
        
        # Generic fallback with variation
        if last_supportbot:
            if "?" in last_supportbot:
                responses = ["Yes, that would work.", "That sounds good.", "I'm interested in that.", "Can you provide more details?"]
                return responses[user_turn_count % len(responses)]
            elif "information" in last_supportbot or "details" in last_supportbot:
                return "I'd like to know more about that."
            elif "help" in last_supportbot or "assist" in last_supportbot:
                if turn_count <= 3:
                    return "I appreciate that. Can you tell me more?"
                else:
                    return "Thank you, that's helpful."
            elif "option" in last_supportbot or "choice" in last_supportbot:
                return "I'd like to explore that option."
        
        # Default varied responses based on turn count
        responses = [
            "I'd like to know more about that.",
            "Can you provide more details?",
            "That's helpful, thank you.",
            "I'm interested in learning more.",
            "What else can you tell me?"
        ]
        return responses[user_turn_count % len(responses)]
    
    def _get_fallback_supportbot_response(self, goal: str, history: List[Dict[str, str]], domain: str = "general") -> str:
        """Generate a context-aware fallback supportbot response without LLM call."""
        if not history or len(history) < 2:
            if domain == "hotel":
                return f"Great! I can help you with {goal}. What dates do you need the room for?"
            elif domain == "restaurant":
                return f"I'd be happy to help you find a restaurant. How many people and what time are you looking for?"
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
        has_amenity_asked = any(word in all_user_text for word in ["wifi", "breakfast", "amenity", "amenities", "include", "what's included"])
        has_availability_asked = any(word in all_user_text for word in ["available", "availability", "book", "reserve"])
        price_answered = any(word in all_supportbot_text for word in ["£65", "£130", "per night", "total"])
        amenity_answered = any(word in all_supportbot_text for word in ["wifi", "breakfast", "includes"])
        availability_answered = any(word in all_supportbot_text for word in ["available", "book", "reservation"])
        
        # Respond to what the user just said - actually answer their question
        if domain == "hotel":
            # If user asks about price, give them the price
            if ("price" in last_user or "cost" in last_user or "rate" in last_user or "how much" in last_user) and not price_answered:
                if has_dates_info:
                    return "The City Centre North B&B is £65 per night. For 2 nights, that's £130 total including WiFi and breakfast. Would you like to proceed with the booking?"
                else:
                    return "The City Centre North B&B offers rooms at £65 per night. How many nights do you need?"
            
            # If user asks about availability, confirm availability
            elif ("available" in last_user or "weekend" in last_user) and not availability_answered:
                return "Yes, I have availability for this weekend at City Centre North B&B. The rate is £65 per night. Would you like to book?"
            
            # If user asks about amenities, tell them what's included
            elif ("amenity" in last_user or "wifi" in last_user or "breakfast" in last_user or "include" in last_user or "what's included" in last_user) and not amenity_answered:
                return "The City Centre North B&B includes free WiFi, continental breakfast, and is located in the city center. The rate is £65 per night. Would you like to make a reservation?"
            
            # If user provides dates/nights, acknowledge and provide pricing
            elif ("night" in last_user or "nights" in last_user or "2 night" in last_user) and has_dates_info:
                if not price_answered:
                    return "Perfect! For 2 nights at City Centre North B&B, the total is £130 including WiFi and breakfast. Would you like me to proceed with the booking?"
                else:
                    return "Great! I can confirm your booking for 2 nights at City Centre North B&B for £130. Would you like me to complete the reservation?"
            
            # If user asks a question, answer it based on what we know
            elif "?" in last_user:
                if "what" in last_user and ("amenity" in last_user or "include" in last_user):
                    return "The City Centre North B&B includes free WiFi, continental breakfast, and city center location. The rate is £65 per night."
                elif "what" in last_user and ("price" in last_user or "cost" in last_user):
                    return "The rate is £65 per night. For 2 nights, the total is £130 including all amenities."
                elif "do you" in last_user or "can you" in last_user:
                    if has_dates_info:
                        return "Yes, I can book a room for 2 nights at City Centre North B&B for £130. Shall I proceed?"
                    else:
                        return "Yes, I can help you book. What dates do you need?"
                else:
                    # Generic question - provide helpful answer
                    if has_dates_info and has_price_asked:
                        return "I can confirm your booking for 2 nights at City Centre North B&B for £130. Would you like to proceed?"
                    elif has_dates_info:
                        return "For 2 nights, the total is £130 including WiFi and breakfast. Would you like to book?"
                    else:
                        return "I can help you book at City Centre North B&B. What dates do you need?"
            
            # User provides information - acknowledge and move forward
            else:
                # If we have dates and price info, move toward completion
                if has_dates_info and price_answered:
                    return "Perfect! I have all the details. Your booking for 2 nights at City Centre North B&B for £130 is ready. Would you like me to confirm the reservation?"
                elif has_dates_info:
                    return "Great! For 2 nights, the total cost is £130 including WiFi and breakfast. Would you like to complete the booking?"
                elif price_answered:
                    return "The rate is £65 per night. How many nights would you like to book?"
                else:
                    return "I can help you book at City Centre North B&B. What dates do you need the room for?"
        
        elif domain == "restaurant":
            if "price" in last_user or "cost" in last_user:
                return "Italian restaurants typically range from £25-50 per person. Would you like me to find options in your price range?"
            elif "available" in last_user or "reservation" in last_user:
                return "I can check availability for Italian restaurants. What time and how many people?"
            elif "?" in last_user:
                return "I found several Italian restaurants available. Would you like fine dining or a more casual option?"
            else:
                return "I can help you find an Italian restaurant. What time are you looking to dine and how many people?"
        
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
