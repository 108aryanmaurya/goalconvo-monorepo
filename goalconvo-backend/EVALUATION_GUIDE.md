# Evaluation Guide

This guide explains how to evaluate your generated synthetic dialogues against MultiWOZ and few-shot hub data.

## Quick Start

### 1. Generate Dialogues with Automatic Evaluation

```bash
# Generate dialogues and automatically run evaluation
python scripts/generate_dialogues.py --num-dialogues 100 --run-evaluation
```

### 2. Run Evaluation Separately

```bash
# Run comprehensive evaluation (compares all three datasets)
python scripts/comprehensive_evaluate.py

# Run standard evaluation (synthetic vs MultiWOZ only)
python scripts/evaluate.py
```

## Evaluation Types

### Comprehensive Evaluation

The comprehensive evaluation compares three datasets:
1. **Synthetic Dialogues**: All generated dialogues
2. **Few-Shot Hub**: Top-quality synthetic dialogues (top 10%)
3. **MultiWOZ**: Real human dialogues from MultiWOZ dataset

**Usage:**
```bash
python scripts/comprehensive_evaluate.py [options]
```

**Options:**
- `--synthetic-limit N`: Limit number of synthetic dialogues to evaluate
- `--few-shot-limit N`: Limit number of few-shot hub dialogues
- `--multiwoz-limit N`: Limit number of MultiWOZ dialogues
- `--skip-few-shot`: Skip few-shot hub evaluation
- `--log-level LEVEL`: Set logging level (DEBUG, INFO, WARNING, ERROR)

**Output:**
- JSON results: `data/results/comprehensive_evaluation_latest.json`
- Text report: `data/results/comprehensive_evaluation_report_latest.txt`

### Standard Evaluation

The standard evaluation compares synthetic dialogues against MultiWOZ only.

**Usage:**
```bash
python scripts/evaluate.py [options]
```

**Options:**
- `--synthetic-limit N`: Limit synthetic dialogues
- `--real-limit N`: Limit MultiWOZ dialogues
- `--log-level LEVEL`: Set logging level

**Output:**
- JSON results: `data/results/evaluation_results.json`
- Text report: `data/results/evaluation_report.txt`

## Evaluation Metrics

### 1. Semantic Similarity (BERTScore)

Measures how semantically similar synthetic dialogues are to real MultiWOZ dialogues.

- **Target Score**: 0.71
- **Range**: 0.0 - 1.0 (higher is better)
- **Method**: BERTScore F1 score

### 2. Diversity Metrics

Measures lexical diversity using distinct-1 and distinct-2 metrics.

- **Target Diversity**: 0.46
- **Metrics**:
  - Distinct-1: Unique unigrams / total unigrams
  - Distinct-2: Unique bigrams / total bigrams
  - Combined: Average of distinct-1 and distinct-2

### 3. Goal Relevance

Measures how well dialogues achieve their stated goals.

- **Target Score**: 0.85 (85% of dialogues should satisfy their goals)
- **Method**: Keyword-based detection of completion indicators

### 4. Statistical Analysis

Compares basic statistics between datasets:
- Average number of turns
- Average dialogue length
- Turn distribution
- Domain-wise breakdown

## Understanding Results

### Example Report Output

```
================================================================================
GOALCONVO COMPREHENSIVE EVALUATION REPORT
================================================================================
Evaluation Date: 2025-11-30T14:00:00

DATASET SIZES
--------------------------------------------------------------------------------
Synthetic Dialogues: 1000
Few-Shot Hub Dialogues: 100
MultiWOZ Dialogues: 8434

THREE-WAY COMPARISON
--------------------------------------------------------------------------------

Turn Statistics:
  Synthetic:
    Count: 1000
    Avg Turns: 6.5 ± 2.1
    Turn Range: 6 - 10
    Avg Length: 450 ± 120 chars

  Few-Shot Hub:
    Count: 100
    Avg Turns: 7.2 ± 1.8
    Turn Range: 6 - 10
    Avg Length: 520 ± 95 chars

  MultiWOZ:
    Count: 8434
    Avg Turns: 8.3 ± 3.2
    Turn Range: 2 - 20
    Avg Length: 680 ± 250 chars

SYNTHETIC vs MULTIWOZ
--------------------------------------------------------------------------------
BERTScore: 0.723 (Target: 0.710)
Diversity - Synthetic: 0.451, Real: 0.463
Goal Relevance: 0.870 (Target: 0.850)
```

### Interpreting Scores

**BERTScore > 0.71**: ✅ Good semantic similarity to real dialogues
**BERTScore < 0.71**: ⚠️ Dialogues may be too different from real data

**Diversity ≈ 0.46**: ✅ Good lexical diversity
**Diversity < 0.40**: ⚠️ Dialogues may be repetitive

**Goal Relevance > 0.85**: ✅ Most dialogues achieve their goals
**Goal Relevance < 0.85**: ⚠️ Many dialogues may not complete goals

## Using MultiWOZ Data

### Prerequisites

1. **Download MultiWOZ** (if not already done):
   ```bash
   python scripts/download_multiwoz.py
   ```

2. **Verify MultiWOZ data exists**:
   ```bash
   ls data/multiwoz/processed_dialogues.json
   ```

### MultiWOZ Data Format

The processed MultiWOZ dialogues are stored in a standardized format:

```json
{
  "dialogue_id": "...",
  "goal": "...",
  "domain": "hotel",
  "turns": [
    {"role": "User", "text": "..."},
    {"role": "SupportBot", "text": "..."}
  ]
}
```

## Using Few-Shot Hub Data

The few-shot hub contains the top 10% of generated dialogues by quality score.

### Loading Few-Shot Hub Data

```python
from goalconvo.config import Config
from goalconvo.dataset_store import DatasetStore

config = Config()
dataset_store = DatasetStore(config)

# Load few-shot examples
few_shot_dialogues = []
for domain in ["hotel", "restaurant", "taxi", "train", "attraction"]:
    examples = dataset_store.load_few_shot_examples(domain, num_examples=100)
    few_shot_dialogues.extend(examples)
```

### Updating Few-Shot Hub

The hub is automatically updated during generation. You can also update manually:

```python
dataset_store = DatasetStore(config)
added_count = dataset_store.update_few_shot_hub(top_percentage=0.1)
print(f"Added {added_count} dialogues to few-shot hub")
```

See `FEW_SHOT_HUB_USAGE.md` for more details.

## Troubleshooting

### "No MultiWOZ dialogues found"

**Solution**: Run the download script:
```bash
python scripts/download_multiwoz.py
```

### "No synthetic dialogues found"

**Solution**: Generate dialogues first:
```bash
python scripts/generate_dialogues.py --num-dialogues 100
```

### "No few-shot hub dialogues found"

**Solution**: 
1. Ensure dialogues have been generated and quality-judged
2. Update the few-shot hub:
   ```python
   dataset_store.update_few_shot_hub()
   ```

### Evaluation takes too long

**Solutions**:
1. Use `--synthetic-limit` and `--multiwoz-limit` to reduce dataset sizes
2. BERTScore computation is the slowest part - consider skipping it for quick checks
3. Use smaller sample sizes for initial evaluation

### Low BERTScore

**Possible causes**:
- Dialogues are too different from MultiWOZ style
- Domain mismatch
- Quality issues in generated dialogues

**Solutions**:
- Review prompt templates
- Check quality scores of generated dialogues
- Ensure proper domain matching

## Best Practices

1. **Run evaluation regularly**: After generating batches of dialogues
2. **Compare trends**: Track metrics over time to see improvements
3. **Domain-specific analysis**: Check domain-wise metrics for imbalances
4. **Use few-shot hub**: Compare against high-quality examples
5. **Monitor goal relevance**: Ensure dialogues actually achieve their goals

## Advanced Usage

### Custom Evaluation

You can create custom evaluation scripts:

```python
from goalconvo.evaluator import Evaluator
from goalconvo.config import Config

config = Config()
evaluator = Evaluator(config)

# Your custom evaluation logic
results = evaluator.evaluate_synthetic_vs_real(
    synthetic_dialogues, 
    real_dialogues
)
```

### Domain-Specific Evaluation

```python
# Filter by domain before evaluation
synthetic_hotel = [d for d in synthetic_dialogues if d['domain'] == 'hotel']
multiwoz_hotel = [d for d in multiwoz_dialogues if d['domain'] == 'hotel']

results = evaluator.evaluate_synthetic_vs_real(synthetic_hotel, multiwoz_hotel)
```

## Output Files

All evaluation results are saved to `data/results/`:

- `comprehensive_evaluation_latest.json`: Latest comprehensive results (JSON)
- `comprehensive_evaluation_report_latest.txt`: Latest comprehensive report (text)
- `evaluation_results.json`: Standard evaluation results (JSON)
- `evaluation_report.txt`: Standard evaluation report (text)
- `comprehensive_evaluation_YYYYMMDD_HHMMSS.json`: Timestamped results
- `comprehensive_evaluation_report_YYYYMMDD_HHMMSS.txt`: Timestamped reports


