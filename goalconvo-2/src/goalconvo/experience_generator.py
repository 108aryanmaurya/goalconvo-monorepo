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
        """Create prompt templates for different domains."""
        return {
            "system": """You are an expert at creating realistic user scenarios for task-oriented dialogues. 
Your task is to take a simple user goal and expand it into a rich, realistic scenario with context and a natural first utterance.

Given a user goal, you should:
1. Create a realistic context/situation for the user
2. Add relevant background information
3. Generate a natural first utterance that a real user would say
4. Make the scenario specific and detailed

The output should be in JSON format with fields: goal, context, first_utterance, user_persona""",
            
            "user": """Here are some examples of how to expand user goals:

Example 1:
Goal: "Book a hotel room for tonight"
Context: "I'm traveling for business and need a hotel room for tonight. I'll be arriving late and need something comfortable and convenient to the city center."
First utterance: "Hi, I need to book a hotel room for tonight. I'm arriving around 9 PM and would prefer something in the city center."

Example 2:
Goal: "Find a restaurant serving Italian food"
Context: "I'm celebrating my anniversary with my partner and want to find a nice Italian restaurant for dinner. We prefer authentic cuisine and a romantic atmosphere."
First utterance: "Hello, I'm looking for a good Italian restaurant for dinner tonight. It's our anniversary, so we'd like somewhere special with authentic Italian food."

Now expand this goal: {goal}"""
        }
    
    def generate_experience(self, goal: str, domain: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a rich experience setup for a given goal.
        
        Args:
            goal: User goal to expand
            domain: Optional domain hint
            
        Returns:
            Dictionary with goal, domain, context, first_utterance, and user_persona
        """
        # Determine domain if not provided
        if domain is None:
            domain = extract_domain_from_goal(goal)
        
        # Get few-shot examples for this domain
        few_shot_examples = self.dataset_store.load_few_shot_examples(
            domain=domain, 
            num_examples=self.config.few_shot_examples
        )
        
        # Create prompt with few-shot examples
        prompt = self._create_generation_prompt(goal, domain, few_shot_examples)
        
        try:
            # Generate response using LLM
            response = self.llm_client.generate_completion(
                prompt,
                temperature=self.config.temperature,
                top_p=self.config.top_p,
                max_tokens=self.config.max_tokens
            )
            
            # Parse JSON response
            experience_data = self._parse_response(response, goal, domain)
            
            logger.info(f"Generated experience for goal: {goal[:50]}...")
            return experience_data
            
        except Exception as e:
            logger.error(f"Error generating experience for goal '{goal}': {e}")
            # Return fallback experience
            return self._create_fallback_experience(goal, domain)
    
    def _create_generation_prompt(
        self, 
        goal: str, 
        domain: str, 
        few_shot_examples: List[Dict[str, Any]]
    ) -> str:
        """Create the generation prompt with few-shot examples."""
        prompt_parts = [self.prompt_templates["system"]]
        
        # Add few-shot examples if available
        if few_shot_examples:
            prompt_parts.append("\nHere are some examples:")
            for i, example in enumerate(few_shot_examples[:self.config.few_shot_examples]):
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
    
    def _parse_response(self, response: str, goal: str, domain: str) -> Dict[str, Any]:
        """Parse LLM response into structured data."""
        try:
            # Try to extract JSON from response
            if "{" in response and "}" in response:
                start_idx = response.find("{")
                end_idx = response.rfind("}") + 1
                json_str = response[start_idx:end_idx]
                
                parsed_data = json.loads(json_str)
                
                return {
                    "goal": parsed_data.get("goal", goal),
                    "domain": domain,
                    "context": parsed_data.get("context", ""),
                    "first_utterance": parsed_data.get("first_utterance", ""),
                    "user_persona": parsed_data.get("user_persona", "")
                }
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
        """Create a fallback experience when generation fails."""
        return {
            "goal": goal,
            "domain": domain,
            "context": f"User needs assistance with {goal.lower()}",
            "first_utterance": f"Hi, I need help with {goal.lower()}",
            "user_persona": "General user"
        }
    
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
