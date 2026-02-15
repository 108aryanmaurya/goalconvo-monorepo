# Few-Shot Hub Usage Guide

The Few-Shot Hub is a curated collection of high-quality synthetic dialogues that can be used as examples for few-shot learning or as a reference dataset for evaluation.

## What is the Few-Shot Hub?

The Few-Shot Hub automatically collects the top 10% (by default) of generated synthetic dialogues based on quality scores. These dialogues are stored separately from the main synthetic dataset and can be used for:

1. **Few-shot learning**: Providing examples to LLMs during dialogue generation
2. **Quality reference**: Comparing new synthetic dialogues against proven high-quality examples
3. **Evaluation**: Using as a benchmark dataset alongside MultiWOZ

## How Few-Shot Hub is Populated

The few-shot hub is automatically updated:

1. **During generation**: Every 100 dialogues generated, the hub is updated with top-quality examples
2. **After generation**: At the end of dialogue generation, a final update is performed
3. **Manual update**: You can manually update the hub using the dataset store API

### Quality Criteria

Dialogues are selected for the few-shot hub based on:
- **Quality score**: Overall quality assessment from the quality judge
- **Heuristic filters**: Passes length, coherence, and other checks
- **LLM evaluation**: High coherence and goal relevance scores

## Using Few-Shot Hub Data

### 1. Loading Few-Shot Examples

```python
from goalconvo.config import Config
from goalconvo.dataset_store import DatasetStore

config = Config()
dataset_store = DatasetStore(config)

# Load few-shot examples for a specific domain
hotel_examples = dataset_store.load_few_shot_examples(
    domain="hotel",
    num_examples=3  # Number of examples to retrieve
)

# Use in your prompts
for example in hotel_examples:
    print(f"Goal: {example['goal']}")
    print(f"Turns: {len(example['turns'])}")
    print(f"Quality Score: {example['metadata']['quality_score']}")
```

### 2. Using in Experience Generation

The experience generator can automatically use few-shot examples:

```python
from goalconvo.experience_generator import ExperienceGenerator

generator = ExperienceGenerator(config, llm_client, dataset_store)

# Generate experience with few-shot examples
experience = generator.generate_experience(
    goal="hotel-name: Holiday Inn",
    domain="hotel"
)
# The generator automatically loads and uses few-shot examples from the hub
```

### 3. Comparing with Other Datasets

Use the comprehensive evaluation script to compare few-shot hub with other datasets:

```bash
python scripts/comprehensive_evaluate.py
```

This will generate a comparison between:
- Synthetic dialogues
- Few-shot hub dialogues
- MultiWOZ dialogues

### 4. Manual Hub Update

You can manually update the few-shot hub:

```python
from goalconvo.dataset_store import DatasetStore

dataset_store = DatasetStore(config)

# Update hub with top 10% of dialogues
added_count = dataset_store.update_few_shot_hub(top_percentage=0.1)
print(f"Added {added_count} dialogues to few-shot hub")
```

## Few-Shot Hub Structure

The few-shot hub is organized by domain:

```
data/few_shot_hub/
├── hotel/
│   ├── dialogue_id_1.json
│   ├── dialogue_id_2.json
│   └── ...
├── restaurant/
│   └── ...
├── taxi/
│   └── ...
├── train/
│   └── ...
└── attraction/
    └── ...
```

Each dialogue in the hub includes additional metadata:

```json
{
  "dialogue_id": "...",
  "goal": "...",
  "domain": "hotel",
  "turns": [...],
  "metadata": {
    "quality_score": 0.95,
    ...
  },
  "hub_metadata": {
    "added_to_hub_at": "2025-11-30T...",
    "quality_score": 0.95,
    "source": "synthetic"
  }
}
```

## Best Practices

1. **Regular Updates**: Let the system automatically update the hub during generation
2. **Quality Threshold**: Adjust `top_percentage` based on your quality requirements
3. **Domain Balance**: Ensure examples are available for all domains you're working with
4. **Evaluation**: Regularly compare hub examples against MultiWOZ to ensure quality

## Example: Using Few-Shot Hub in Custom Generation

```python
from goalconvo.config import Config
from goalconvo.dataset_store import DatasetStore
from goalconvo.llm_client import LLMClient
from goalconvo.experience_generator import ExperienceGenerator

# Initialize components
config = Config()
llm_client = LLMClient(config)
dataset_store = DatasetStore(config)

# Load few-shot examples
few_shot_examples = dataset_store.load_few_shot_examples("hotel", num_examples=5)

# Format examples for prompt
example_text = ""
for i, example in enumerate(few_shot_examples, 1):
    example_text += f"\nExample {i}:\n"
    example_text += f"Goal: {example['goal']}\n"
    for turn in example['turns']:
        example_text += f"{turn['role']}: {turn['text']}\n"

# Use in your custom prompt
custom_prompt = f"""
Generate a new dialogue based on these examples:
{example_text}

New goal: hotel-name: Grand Hotel
"""
```

## Troubleshooting

**No few-shot examples found:**
- Ensure dialogues have been generated and quality-judged
- Check that quality scores are being computed
- Verify the few-shot hub directory exists

**Low quality in hub:**
- Adjust quality threshold in quality judge
- Increase `top_percentage` to get more examples
- Review quality assessment criteria

**Missing domains:**
- Generate more dialogues for that domain
- Check domain-specific quality scores
- Ensure domain is in config.domains


