# Quick Start: Evaluation Setup

## Overview

This guide shows you how to:
1. Use MultiWOZ dataset for comparison
2. Use few-shot hub data
3. Run comprehensive evaluation after generation

## Step 1: Ensure MultiWOZ is Downloaded

```bash
# Check if MultiWOZ is already processed
ls data/multiwoz/processed_dialogues.json

# If not found, download and process MultiWOZ
python scripts/download_multiwoz.py
```

## Step 2: Generate Dialogues with Auto-Evaluation

```bash
# Generate 100 dialogues and automatically run evaluation
python scripts/generate_dialogues.py --num-dialogues 100 --run-evaluation
```

This will:
1. Generate synthetic dialogues
2. Update few-shot hub with top-quality examples
3. Automatically run comprehensive evaluation
4. Save results to `data/results/`

## Step 3: Manual Evaluation (Alternative)

If you prefer to run evaluation separately:

```bash
# Run comprehensive evaluation
python scripts/comprehensive_evaluate.py

# Or run standard evaluation (synthetic vs MultiWOZ only)
python scripts/evaluate.py
```

## Step 4: View Results

```bash
# View latest comprehensive report
cat data/results/comprehensive_evaluation_report_latest.txt

# View latest comprehensive results (JSON)
cat data/results/comprehensive_evaluation_latest.json
```

## Using Few-Shot Hub in Code

```python
from goalconvo.config import Config
from goalconvo.dataset_store import DatasetStore

config = Config()
dataset_store = DatasetStore(config)

# Load few-shot examples for a domain
examples = dataset_store.load_few_shot_examples("hotel", num_examples=5)

for example in examples:
    print(f"Goal: {example['goal']}")
    print(f"Quality Score: {example['metadata']['quality_score']}")
    print(f"Turns: {len(example['turns'])}")
```

## What Gets Compared?

The comprehensive evaluation compares:

1. **Synthetic Dialogues** (all generated)
   - Location: `data/synthetic/`
   - All dialogues that passed quality filters

2. **Few-Shot Hub** (top 10% by quality)
   - Location: `data/few_shot_hub/`
   - Curated high-quality examples

3. **MultiWOZ** (real human dialogues)
   - Location: `data/multiwoz/processed_dialogues.json`
   - Ground truth reference dataset

## Evaluation Metrics

- **BERTScore**: Semantic similarity (target: 0.71)
- **Diversity**: Lexical diversity (target: 0.46)
- **Goal Relevance**: Goal completion rate (target: 0.85)
- **Statistics**: Turn counts, lengths, domain breakdown

## Next Steps

- See `EVALUATION_GUIDE.md` for detailed evaluation information
- See `FEW_SHOT_HUB_USAGE.md` for few-shot hub usage
- Check `data/results/` for all evaluation outputs


