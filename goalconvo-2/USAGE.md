# GoalConvo Framework - Usage Guide

This guide will walk you through setting up and running the GoalConvo framework step by step.

## Prerequisites

- Python 3.8 or higher
- pip package manager
- API access to Mistral-7B (via Together AI, Replicate, or OpenAI)

## Quick Start

### 1. Installation

```bash
# Clone or navigate to the project directory
cd /home/aryan/Desktop/goalconvo-2

# Install the package in development mode
pip install -e .

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your API keys
nano .env
```

**Required Environment Variables:**
```bash
# Choose ONE of the following API configurations:

# Option 1: Mistral via Together AI (Recommended)
MISTRAL_API_KEY=your_together_ai_api_key_here
MISTRAL_API_BASE=https://api.together.xyz/v1
MISTRAL_MODEL=mistralai/Mistral-7B-Instruct-v0.1

# Option 2: OpenAI API (Fallback)
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_API_BASE=https://api.openai.com/v1
# OPENAI_MODEL=gpt-3.5-turbo
```

### 3. Download MultiWOZ Dataset

```bash
# Download and process MultiWOZ dataset
python scripts/download_multiwoz.py

# This will:
# - Download MultiWOZ 2.2 dataset
# - Extract and parse dialogues
# - Create seed goals for each domain
# - Save processed data to data/multiwoz/
```

### 4. Test Connection

```bash
# Test your API connection
python scripts/generate_dialogues.py --test-connection
```

### 5. Generate Synthetic Dialogues

```bash
# Generate a small batch for testing (100 dialogues)
python scripts/generate_dialogues.py --num-dialogues 100

# Generate larger batch (1000 dialogues)
python scripts/generate_dialogues.py --num-dialogues 1000

# Generate for specific domains only
python scripts/generate_dialogues.py --num-dialogues 500 --domains hotel restaurant

# Estimate costs before large generation
python scripts/generate_dialogues.py --estimate-cost --num-dialogues 10000
```

### 6. Evaluate Results

```bash
# Run evaluation against MultiWOZ data
python scripts/evaluate.py

# Run evaluation with specific limits
python scripts/evaluate.py --synthetic-limit 1000 --real-limit 1000
```

## Detailed Usage

### Generation Pipeline Options

```bash
# Basic generation
python scripts/generate_dialogues.py --num-dialogues 1000

# Domain-specific generation
python scripts/generate_dialogues.py --num-dialogues 200 --domains hotel

# Resume from previous run
python scripts/generate_dialogues.py --num-dialogues 1000 --resume

# Test connection only
python scripts/generate_dialogues.py --test-connection

# Estimate API costs
python scripts/generate_dialogues.py --estimate-cost --num-dialogues 5000

# Verbose logging
python scripts/generate_dialogues.py --num-dialogues 100 --log-level DEBUG
```

### Evaluation Pipeline Options

```bash
# Basic evaluation
python scripts/evaluate.py

# Limit datasets for faster evaluation
python scripts/evaluate.py --synthetic-limit 500 --real-limit 500

# Custom output directory
python scripts/evaluate.py --output-dir ./custom_results

# Verbose logging
python scripts/evaluate.py --log-level DEBUG
```

### MultiWOZ Download Options

```bash
# Basic download
python scripts/download_multiwoz.py

# Skip download if file exists
python scripts/download_multiwoz.py --skip-download

# Skip extraction if directory exists
python scripts/download_multiwoz.py --skip-extract

# Custom output directory
python scripts/download_multiwoz.py --output-dir ./custom_multiwoz
```

## Programmatic Usage

### Using the Framework in Python

```python
from goalconvo import Config, LLMClient, ExperienceGenerator, DialogueSimulator, QualityJudge, DatasetStore

# Initialize components
config = Config()
llm_client = LLMClient(config)
dataset_store = DatasetStore(config)
experience_generator = ExperienceGenerator(config, llm_client, dataset_store)
dialogue_simulator = DialogueSimulator(config, llm_client)
quality_judge = QualityJudge(config, llm_client)

# Generate a single dialogue
goal = "Book a hotel room for tonight"
experience_data = experience_generator.generate_experience(goal, "hotel")
dialogue = dialogue_simulator.simulate_dialogue(experience_data)

# Judge quality
quality_assessment = quality_judge.judge_dialogue(dialogue)
print(f"Quality score: {quality_assessment['overall_score']}")

# Save dialogue
dialogue_id = dataset_store.save_dialogue(dialogue)
print(f"Saved dialogue: {dialogue_id}")
```

### Batch Generation

```python
from goalconvo import Config, GoalConvoGenerator

# Initialize generator
config = Config()
generator = GoalConvoGenerator(config)

# Generate multiple dialogues
stats = generator.generate_dialogues(
    num_dialogues=100,
    domains=["hotel", "restaurant"],
    resume=False
)

print(f"Generated: {stats['total_generated']}")
print(f"Accepted: {stats['total_accepted']}")
print(f"Rejected: {stats['total_rejected']}")
```

## File Structure

After running the framework, your directory structure will look like:

```
goalconvo-2/
├── data/
│   ├── multiwoz/                 # MultiWOZ dataset
│   │   ├── processed_dialogues.json
│   │   └── processing_stats.json
│   ├── synthetic/                # Generated dialogues
│   │   ├── hotel/
│   │   ├── restaurant/
│   │   ├── taxi/
│   │   ├── train/
│   │   └── attraction/
│   ├── few_shot_hub/            # Dynamic examples
│   │   ├── hotel/
│   │   ├── restaurant/
│   │   └── ...
│   ├── results/                 # Evaluation results
│   │   ├── evaluation_results.json
│   │   └── evaluation_report.txt
│   └── seed_goals.json          # Initial goal templates
├── logs/
│   ├── generation.log
│   └── evaluation.log
└── generation_progress.json     # Progress tracking
```

## Monitoring Progress

### Generation Progress

```bash
# Check generation progress
cat generation_progress.json

# Monitor logs
tail -f generation.log

# Check dataset statistics
python -c "
from goalconvo import Config, DatasetStore
config = Config()
store = DatasetStore(config)
stats = store.get_statistics()
print(f'Total dialogues: {stats[\"total_dialogues\"]}')
for domain, count in stats['by_domain'].items():
    print(f'{domain}: {count}')
"
```

### Evaluation Results

```bash
# View evaluation report
cat data/results/evaluation_report.txt

# Check JSON results
python -c "
import json
with open('data/results/evaluation_results.json', 'r') as f:
    results = json.load(f)
print(f'BERTScore: {results[\"semantic_similarity\"][\"overall_bertscore\"]:.3f}')
print(f'Diversity: {results[\"diversity_metrics\"][\"synthetic_diversity\"][\"combined\"]:.3f}')
print(f'Goal Relevance: {results[\"goal_relevance\"][\"overall_goal_relevance\"]:.3f}')
"
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   ```bash
   # Test connection
   python scripts/generate_dialogues.py --test-connection
   
   # Check API key in .env file
   cat .env | grep API_KEY
   ```

2. **Out of Memory Errors**
   ```bash
   # Reduce batch size in config
   # Edit .env file:
   BATCH_SIZE=5
   MAX_DIALOGUES=100
   ```

3. **Missing MultiWOZ Data**
   ```bash
   # Re-download MultiWOZ
   python scripts/download_multiwoz.py
   
   # Check if data exists
   ls -la data/multiwoz/
   ```

4. **Quality Issues**
   ```bash
   # Check quality thresholds
   # Edit .env file:
   QUALITY_THRESHOLD=0.6
   DISCARD_RATE=0.2
   ```

### Performance Optimization

1. **Reduce API Calls**
   ```bash
   # Use smaller batches
   BATCH_SIZE=5
   
   # Reduce max turns
   MAX_TURNS=6
   ```

2. **Cost Management**
   ```bash
   # Estimate costs first
   python scripts/generate_dialogues.py --estimate-cost --num-dialogues 1000
   
   # Use cheaper models if available
   MISTRAL_MODEL=mistralai/Mistral-7B-Instruct-v0.1
   ```

## Expected Results

Based on the research paper, you should achieve:

- **BERTScore**: ~0.71 (semantic similarity to real dialogues)
- **Diversity**: ~0.46 (lexical diversity)
- **Goal Relevance**: ~85% (dialogues achieving their goals)

## Next Steps

1. **Scale Up**: Start with small batches, then scale to 20,000+ dialogues
2. **Custom Domains**: Add your own domains by editing `data/seed_goals.json`
3. **Fine-tuning**: Adjust prompts and parameters for your specific use case
4. **Integration**: Use generated dialogues to train your own models

## Support

For issues and questions:
1. Check the logs in `logs/` directory
2. Review the configuration in `.env`
3. Test individual components with the test suite: `pytest tests/`
4. Check the evaluation results for quality metrics
