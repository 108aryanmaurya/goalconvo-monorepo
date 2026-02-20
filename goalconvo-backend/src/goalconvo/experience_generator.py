"""
Experience Generator for creating initial dialogue setups with few-shot prompting.

Generates rich user goals, context, and first utterances using Mistral-7B with
dynamic few-shot hub management.
"""

import json
import logging
import random
from typing import Dict, List, Any, Optional
from pathlib import Path

from .config import Config
from .llm_client import LLMClient
from .dataset_store import DatasetStore
from .utils import load_json, save_json, ensure_dir, extract_domain_from_goal

logger = logging.getLogger(__name__)

class ExperienceGenerator:
    """Generates initial dialogue setups using few-shot prompting."""
    
    def __init__(self, config: Config, llm_client: LLMClient, dataset_store: DatasetStore):
        """Initialize the experience generator."""
        self.config = config
        self.llm_client = llm_client
        self.dataset_store = dataset_store
        self.seed_goals_path = Path(config.data_dir) / "seed_goals.json"
        
        # Load or create seed goals
        self.seed_goals = self._load_seed_goals()
        
        # Few-shot prompt templates
        self.prompt_templates = self._create_prompt_templates()
    
    def _load_seed_goals(self) -> Dict[str, List[str]]:
        """Load seed goals from file or create default ones."""
        if self.seed_goals_path.exists():
            return load_json(str(self.seed_goals_path))
        else:
            # Create default seed goals
            default_goals = self._create_default_seed_goals()
            save_json(default_goals, str(self.seed_goals_path))
            return default_goals
    
    def _create_default_seed_goals(self) -> Dict[str, List[str]]:
        """Create default seed goals for each domain."""
        return {
            "hotel": [
                "Book a hotel room for tonight",
                "Find accommodation near the city center",
                "Reserve a hotel room for 2 nights",
                "Book a hotel with a swimming pool",
                "Find a budget hotel for the weekend"
            ],
            "restaurant": [
                "Find a restaurant serving Italian food",
                "Book a table for dinner tonight",
                "Find a restaurant with vegetarian options",
                "Reserve a table for 4 people",
                "Find a restaurant near the hotel"
            ],
            "taxi": [
                "Book a taxi to the airport",
                "Find transportation to the city center",
                "Order a taxi for 3 PM",
                "Get a ride to the train station",
                "Book a taxi for tomorrow morning"
            ],
            "train": [
                "Book a train ticket to London",
                "Find train schedules for tomorrow",
                "Reserve a seat on the express train",
                "Buy a train ticket for the weekend",
                "Check train connections to Manchester"
            ],
            "attraction": [
                "Find tourist attractions in the city",
                "Book tickets for the museum",
                "Get information about local tours",
                "Find things to do this weekend",
                "Book a guided tour of the castle"
            ]
        }
    
    def _create_prompt_templates(self) -> Dict[str, str]:
        """Create prompt templates optimized for evaluation metrics (TSR, GCR, coherence, diversity)."""
        return {
            "system": """You are an expert at creating realistic, evaluable user scenarios for task-oriented dialogues. 
Your task is to expand a simple user goal into a rich scenario that will produce high-quality dialogues with:
- Clear, achievable goals with explicit constraints and requestables (for Goal Completion Rate)
- Natural context that enables coherent conversations (for Coherence)
- Varied, natural first utterances (for Diversity and Fluency)

CRITICAL REQUIREMENTS FOR EVALUATION:
1. **Goal must be specific and measurable**: Include explicit constraints (area, price_range, type, etc.) and requestables (phone, address, reference number) that can be verified.
2. **Context should be realistic and detailed**: Provide background that explains why the user needs this, enabling natural conversation flow.
3. **First utterance should be natural and varied**: Use different phrasing patterns across examples—avoid templates.
4. **Include structured fields when helpful**: Use subgoals (steps to achieve goal) and constraints (specific requirements) to make goals evaluable.

The output should be in JSON format with fields: goal, context, first_utterance, user_persona.
OPTIONAL but RECOMMENDED for better evaluation:
- subgoals: array of steps (e.g. ["find options", "compare prices", "confirm booking"])
- constraints: object with specific requirements (e.g. {"price_range": "budget", "area": "centre", "type": "hotel"})
- user_persona_traits: communication style (e.g. "formal and concise" or "friendly and detailed")
- supportbot_style: desired assistant style (e.g. "formal and brief" or "friendly and detailed")

IMPORTANT: Make goals specific enough that completion can be clearly detected (e.g., "book a hotel" → "book a budget hotel in the city center for tonight").""",
            
            "user": """Here are examples of well-structured goals that lead to high evaluation scores:

Example 1 (Hotel - explicit constraints):
Goal: "Book a budget hotel room in the city center for tonight"
Context: "I'm traveling for business and arriving late tonight. I need a comfortable hotel in the city center that's budget-friendly and close to public transport."
First utterance: "Hi, I'm looking for a hotel room for tonight. I'd prefer something in the city center that's not too expensive—budget range if possible."
Constraints (for the goal above): price_range=budget, area=city center, date=tonight
Requestables (information the user may want): phone, address, reference_number

Example 2 (Restaurant - specific requirements):
Goal: "Find an Italian restaurant for dinner tonight with vegetarian options"
Context: "I'm celebrating my anniversary with my partner tonight. We want authentic Italian food, but one of us is vegetarian, so we need a place with good vegetarian options."
First utterance: "Hello, I'm looking for an Italian restaurant for dinner tonight. We'd like authentic Italian cuisine, and it's important that they have good vegetarian options."
Constraints (for the goal above): cuisine=Italian, meal=dinner, dietary=vegetarian
Requestables (information the user may want): phone, address, reservation_confirmation

IMPORTANT: If the goal below is in MultiWOZ format (e.g., "hotel-name: Alpha-Milton guest house" or "taxi-leaveat: 10:00; taxi-departure: Jesus College"), you MUST convert it to natural language FIRST, then expand it.

For example:
- "hotel-name: Alpha-Milton guest house" → "Book a room at Alpha-Milton guest house"
- "restaurant-name: City Stop Restaurant" → "Find information about City Stop Restaurant" or "Make a reservation at City Stop Restaurant"
- "taxi-leaveat: 10:00; taxi-departure: Jesus College" → "Book a taxi leaving at 10:00 from Jesus College"

Now expand this goal with explicit constraints and requestables: {goal}"""
        }
    
    def _normalize_goal(self, goal: str) -> str:
        """Convert MultiWOZ format goals to natural language."""
        goal = goal.strip()
        # Strip outer braces if present (e.g. "{train-leaveat: 11:30}" -> "train-leaveat: 11:30")
        if goal.startswith("{") and goal.endswith("}"):
            goal = goal[1:-1].strip()

        # Check if it's MultiWOZ format (contains ":" or ";" separators)
        if ":" not in goal and ";" not in goal:
            return goal  # Already natural language

        # Handle train format (e.g. "train-leaveat: 11:30" or "train-leaveat: 13:45")
        if "train-leaveat:" in goal.lower():
            leaveat = goal.split("train-leaveat:")[-1].split(";")[0].strip()
            return f"Catch a train leaving at {leaveat}"
        if "train-" in goal.lower():
            return "Book or find information about a train journey"

        # Handle attraction (generic)
        if "attraction" in goal.lower() or "attraction-" in goal.lower():
            return "Find information about attractions or things to do"

        # Handle hotel-name format
        if goal.startswith("hotel-name:"):
            hotel_name = goal.replace("hotel-name:", "").strip()
            return f"Book a room at {hotel_name}" or f"Find information about {hotel_name}"
        
        # Handle restaurant-name format
        if goal.startswith("restaurant-name:"):
            restaurant_name = goal.replace("restaurant-name:", "").strip()
            return f"Find information about {restaurant_name}" or f"Make a reservation at {restaurant_name}"
        
        # Handle taxi format (e.g., "taxi-leaveat: 10:00; taxi-departure: Jesus College")
        if "taxi-" in goal:
            parts = []
            if "taxi-leaveat:" in goal:
                leaveat = goal.split("taxi-leaveat:")[1].split(";")[0].strip()
                parts.append(f"leaving at {leaveat}")
            if "taxi-departure:" in goal:
                departure = goal.split("taxi-departure:")[1].split(";")[0].strip()
                # Remove list brackets if present
                departure = departure.replace("[", "").replace("]", "").replace("'", "").replace('"', "").strip()
                parts.append(f"from {departure}")
            if "taxi-destination:" in goal:
                destination = goal.split("taxi-destination:")[1].split(";")[0].strip()
                destination = destination.replace("[", "").replace("]", "").replace("'", "").replace('"', "").strip()
                parts.append(f"to {destination}")
            
            if parts:
                return f"Book a taxi {' '.join(parts)}"
        
        # Generic conversion: try to extract meaningful parts
        # Replace common patterns
        goal = goal.replace("hotel-name:", "book a room at")
        goal = goal.replace("restaurant-name:", "find information about")
        goal = goal.replace("taxi-leaveat:", "taxi leaving at")
        goal = goal.replace("taxi-departure:", "from")
        goal = goal.replace("taxi-destination:", "to")
        goal = goal.replace(";", " and")
        
        # Clean up extra spaces and brackets
        goal = " ".join(goal.split())
        goal = goal.replace("[", "").replace("]", "").replace("'", "").replace('"', "")
        
        return goal.strip()
    
    def generate_experience(self, goal: str, domain: Optional[str] = None, few_shot_override: Optional[int] = None) -> Dict[str, Any]:
        """
        Generate a rich experience setup for a given goal.
        
        Args:
            goal: User goal to expand (may be in MultiWOZ format)
            domain: Optional domain hint
            few_shot_override: Optional override for number of few-shot examples (e.g. 0 for ablation)
            
        Returns:
            Dictionary with goal, domain, context, first_utterance, and user_persona
        """
        # Normalize MultiWOZ format goals to natural language
        normalized_goal = self._normalize_goal(goal)
        
        # Determine domain if not provided
        if domain is None:
            domain = extract_domain_from_goal(normalized_goal)
        
        num_examples = few_shot_override if few_shot_override is not None else self.config.few_shot_examples
        # Get few-shot examples for this domain
        few_shot_examples = self.dataset_store.load_few_shot_examples(
            domain=domain, 
            num_examples=num_examples
        )
        
        # Create prompt with few-shot examples (use override for slicing in _create_generation_prompt via instance attr or pass)
        prompt = self._create_generation_prompt(normalized_goal, domain, few_shot_examples, num_examples=num_examples)
        
        try:
            # Generate response using LLM
            response = self.llm_client.generate_completion(
                prompt,
                temperature=self.config.temperature,
                top_p=self.config.top_p,
                max_tokens=self.config.max_tokens
            )
            
            # Parse JSON response (use normalized goal)
            experience_data = self._parse_response(response, normalized_goal, domain)
            
            logger.info(f"Generated experience for goal: {goal[:50]}...")
            return experience_data
            
        except Exception as e:
            logger.error(f"Error generating experience for goal '{goal}': {e}")
            # Return fallback experience (use normalized goal)
            return self._create_fallback_experience(normalized_goal, domain)
    
    def _create_generation_prompt(
        self, 
        goal: str, 
        domain: str, 
        few_shot_examples: List[Dict[str, Any]],
        num_examples: Optional[int] = None
    ) -> str:
        """Create the generation prompt with few-shot examples."""
        prompt_parts = [self.prompt_templates["system"]]
        n = num_examples if num_examples is not None else self.config.few_shot_examples
        # Add few-shot examples if available
        if few_shot_examples and n > 0:
            prompt_parts.append("\nHere are some examples:")
            for i, example in enumerate(few_shot_examples[:n]):
                turns = example.get("turns", [])
                if turns:
                    first_turn = turns[0]
                    goal_text = example.get("goal", "Unknown goal")
                    context = f"Context: {example.get('context', 'No context provided')}"
                    first_utterance = first_turn.get("text", "No utterance")
                    
                    prompt_parts.append(f"\nExample {i+1}:")
                    prompt_parts.append(f"Goal: {goal_text}")
                    prompt_parts.append(f"{context}")
                    prompt_parts.append(f"First utterance: {first_utterance}")
        
        # Add the main task
        prompt_parts.append(f"\n{self.prompt_templates['user'].format(goal=goal)}")
        
        return "\n".join(prompt_parts)

    @staticmethod
    def _user_persona_to_string(value: Any) -> str:
        """Normalize user_persona to a string; LLM may return a dict e.g. {'name': 'Emily', 'user_persona_traits': '...'}."""
        if isinstance(value, str):
            return value.strip() or "General user"
        if isinstance(value, dict):
            name = value.get("name") or value.get("user_persona") or ""
            traits = value.get("user_persona_traits") or value.get("traits")
            if isinstance(traits, list):
                traits = ", ".join(str(t) for t in traits) if traits else ""
            elif not isinstance(traits, str):
                traits = ""
            name = str(name).strip() if name else "General user"
            return f"{name} ({traits})" if traits else name
        return "General user"

    def _parse_response(self, response: str, goal: str, domain: str) -> Dict[str, Any]:
        """Parse LLM response into structured data."""
        try:
            # Try to extract JSON from response
            if "{" in response and "}" in response:
                start_idx = response.find("{")
                end_idx = response.rfind("}") + 1
                json_str = response[start_idx:end_idx]
                
                parsed_data = json.loads(json_str)
                raw_persona = parsed_data.get("user_persona", "")
                user_persona_str = self._user_persona_to_string(raw_persona)
                raw_goal = parsed_data.get("goal", goal)
                # Normalize only when goal looks like slot format (e.g. train-leaveat: 11:30 or {train-leaveat: 11:30})
                looks_like_slot = raw_goal and (str(raw_goal).strip().startswith("{") or "train-leaveat:" in str(raw_goal).lower() or "taxi-" in str(raw_goal).lower() or "hotel-name:" in str(raw_goal).lower() or "restaurant-name:" in str(raw_goal).lower())
                natural_goal = self._normalize_goal(raw_goal) if looks_like_slot else raw_goal
                out = {
                    "goal": natural_goal or raw_goal or goal,
                    "domain": domain,
                    "context": parsed_data.get("context", ""),
                    "first_utterance": parsed_data.get("first_utterance", ""),
                    "user_persona": user_persona_str
                }
                if "subgoals" in parsed_data and isinstance(parsed_data["subgoals"], list):
                    out["subgoals"] = parsed_data["subgoals"]
                if "constraints" in parsed_data and isinstance(parsed_data["constraints"], dict):
                    out["constraints"] = parsed_data["constraints"]
                if parsed_data.get("user_persona_traits"):
                    out["user_persona_traits"] = parsed_data.get("user_persona_traits", "")
                if parsed_data.get("supportbot_style"):
                    out["supportbot_style"] = parsed_data.get("supportbot_style", "")
                return out
        except (json.JSONDecodeError, KeyError) as e:
            logger.warning(f"Failed to parse JSON response: {e}")
        
        # Fallback: extract information using simple parsing
        return self._extract_info_from_text(response, goal, domain)
    
    def _extract_info_from_text(self, text: str, goal: str, domain: str) -> Dict[str, Any]:
        """Extract information from unstructured text response."""
        lines = text.split('\n')
        context = ""
        first_utterance = ""
        user_persona = ""
        
        for line in lines:
            line = line.strip()
            if line.startswith("Context:") or line.startswith("context:"):
                context = line.split(":", 1)[1].strip()
            elif line.startswith("First utterance:") or line.startswith("first_utterance:"):
                first_utterance = line.split(":", 1)[1].strip()
            elif line.startswith("User persona:") or line.startswith("user_persona:"):
                user_persona = line.split(":", 1)[1].strip()
        
        return {
            "goal": goal,
            "domain": domain,
            "context": context or f"User wants to {goal.lower()}",
            "first_utterance": first_utterance or f"I need help with {goal.lower()}",
            "user_persona": user_persona or "General user"
        }
    
    def _create_fallback_experience(self, goal: str, domain: str) -> Dict[str, Any]:
        """Create a fallback experience when generation fails. Use natural-language goal."""
        natural_goal = self._normalize_goal(goal)
        return {
            "goal": natural_goal,
            "domain": domain,
            "context": f"User needs assistance with {natural_goal.lower()}",
            "first_utterance": f"Hi, I need help with {natural_goal.lower()}",
            "user_persona": "General user"
        }
    
    @staticmethod
    def goal_complexity(experience_data: Dict[str, Any]) -> float:
        """Compute a simple goal complexity score (0+). Used for optional filtering or analytics."""
        score = 0.0
        if experience_data.get("subgoals"):
            score += len(experience_data["subgoals"])
        if experience_data.get("constraints"):
            score += len(experience_data["constraints"])
        return score
    
    def generate_batch_experiences(
        self, 
        goals: List[str], 
        domains: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate experiences for a batch of goals.
        
        Args:
            goals: List of user goals
            domains: Optional list of domains (must match goals length)
            
        Returns:
            List of experience data
        """
        experiences = []
        
        for i, goal in enumerate(goals):
            domain = domains[i] if domains and i < len(domains) else None
            experience = self.generate_experience(goal, domain)
            experiences.append(experience)
        
        return experiences
    
    def get_random_goal(self, domain: Optional[str] = None) -> str:
        """
        Get a random goal from the seed goals.
        
        Args:
            domain: Optional domain to sample from
            
        Returns:
            Random goal string
        """
        if domain and domain in self.seed_goals:
            return random.choice(self.seed_goals[domain])
        else:
            # Sample from all domains
            all_goals = []
            for domain_goals in self.seed_goals.values():
                all_goals.extend(domain_goals)
            return random.choice(all_goals)
    
    def add_goal(self, goal: str, domain: str) -> None:
        """
        Add a new goal to the seed goals.
        
        Args:
            goal: New goal to add
            domain: Domain for the goal
        """
        if domain not in self.seed_goals:
            self.seed_goals[domain] = []
        
        if goal not in self.seed_goals[domain]:
            self.seed_goals[domain].append(goal)
            save_json(self.seed_goals, str(self.seed_goals_path))
            logger.info(f"Added goal '{goal}' to domain '{domain}'")
    
    def get_domain_goals(self, domain: str) -> List[str]:
        """
        Get all goals for a specific domain.
        
        Args:
            domain: Target domain
            
        Returns:
            List of goals for the domain
        """
        return self.seed_goals.get(domain, [])
    
    def update_few_shot_hub(self) -> int:
        """
        Update the few-shot hub with high-quality examples.
        
        Returns:
            Number of examples added to hub
        """
        return self.dataset_store.update_few_shot_hub()
