# Comprehensive Dialogue Evaluation Guide

This guide explains how to use the comprehensive dialogue evaluation script that implements multiple evaluation metrics for GoalConvo-generated dialogues.

## Overview

The comprehensive evaluation script evaluates generated dialogues using the following metrics:

### 1. **Goal Completion Rate (GCR)**
- Percentage of dialogues where all constraints and requestables are fulfilled
- Checks if user constraints (e.g., `area=centre`, `price=cheap`) were satisfied
- Verifies that system responses include correct booking details or confirmations

### 2. **Task Success Rate (TSR)**
- Percentage of dialogues judged as successful in achieving user intent
- Evaluates whether the dialogue successfully completed the user's goal

### 3. **BLEU Score**
- Measures fluency by comparing LLM-generated dialogue to real (MultiWOZ) dialogue
- Uses NLTK's sentence_bleu with smoothing function

### 4. **Dialogue Length / Turns**
- Average number of turns per conversation
- Should be realistic (e.g., 8–12 turns)
- Also tracks word count and character count

### 5. **Repetition Rate**
- Measures redundancy across turns
- Calculates percentage of repeated turns (ideally low)

### 6. **LLM-as-a-Judge** (Optional)
Uses a powerful LLM (GPT-4, Claude, Gemini, or Mistral) to evaluate:
- **Task Success** (0-100): Did the system fulfill the user goal?
- **Coherence** (0-100): Are turns logically consistent and context-aware?
- **Diversity** (0-100): Is the phrasing natural and non-repetitive?
- **Fluency** (0-100): Are grammar, punctuation, and language natural?
- **Groundedness** (0-100): Are the facts based on given input or hallucinated?

## Quick Start

### Basic Usage

```bash
cd goalconvo-2
python scripts/comprehensive_dialogue_evaluation.py
```

This will:
- Load all synthetic dialogues from the dataset store
- Load MultiWOZ reference dialogues for BLEU comparison
- Run all evaluation metrics (including LLM-as-a-Judge)
- Save results to `data/results/comprehensive_evaluation_<timestamp>.json`

### Limit Number of Dialogues

```bash
# Evaluate only 50 synthetic dialogues
python scripts/comprehensive_dialogue_evaluation.py --synthetic-limit 50

# Use only 100 reference dialogues for BLEU
python scripts/comprehensive_dialogue_evaluation.py --reference-limit 100
```

### Skip LLM-as-a-Judge (Faster)

```bash
# Skip LLM evaluation for faster results
python scripts/comprehensive_dialogue_evaluation.py --skip-llm-judge
```

### Custom Output File

```bash
python scripts/comprehensive_dialogue_evaluation.py --output-file data/results/my_evaluation.json
```

## Output Format

The evaluation script generates a JSON file with the following structure:

```json
{
  "evaluation_timestamp": "2025-12-02T14:30:00",
  "total_dialogues": 50,
  "metrics": {
    "goal_completion_rate": {
      "overall_gcr": 88.0,
      "completed_count": 44,
      "total_count": 50,
      "domain_gcr": {
        "hotel": {"completed": 20, "total": 25, "percentage": 80.0},
        "restaurant": {"completed": 24, "total": 25, "percentage": 96.0}
      }
    },
    "task_success_rate": {
      "overall_tsr": 82.0,
      "successful_count": 41,
      "total_count": 50,
      "domain_tsr": {...}
    },
    "bleu_score": {
      "average_bleu": 0.45,
      "std_bleu": 0.12,
      "domain_bleu": {...}
    },
    "dialogue_length": {
      "avg_turns": 9.6,
      "std_turns": 2.1,
      "avg_words": 245,
      "domain_metrics": {...}
    },
    "repetition_rate": {
      "overall_repetition_rate": 0.08,
      "domain_repetition": {...}
    },
    "llm_judge": {
      "overall_scores": {
        "task_success": {"mean": 75.5, "std": 12.3},
        "coherence": {"mean": 82.1, "std": 8.7},
        "diversity": {"mean": 68.3, "std": 15.2},
        "fluency": {"mean": 79.4, "std": 10.1},
        "groundedness": {"mean": 71.2, "std": 13.5}
      },
      "domain_scores": {...}
    }
  },
  "summary_table": {
    "Goal Completion Rate": "88.0% (44/50)",
    "Task Success Rate": "82.0% (41/50)",
    "BLEU Score (avg)": "0.450",
    "Avg. Turns": "9.6",
    "Repetition Rate": "8.0%",
    "LLM Judge - Task Success": "75.5",
    "LLM Judge - Coherence": "82.1",
    "LLM Judge - Diversity": "68.3",
    "LLM Judge - Fluency": "79.4",
    "LLM Judge - Groundedness": "71.2"
  }
}
```

## Summary Table

The script automatically generates a summary table that you can use in presentations or reports:

| **Metric**           | **Value**   |
| -------------------- | ----------- |
| Goal Completion Rate | 88% (44/50) |
| Task Success Rate    | 82% (41/50) |
| BLEU Score (avg)     | 0.45        |
| Avg. Turns           | 9.6         |
| Repetition Rate      | 8%          |
| LLM Judge - Task Success | 75.5     |
| LLM Judge - Coherence    | 82.1     |
| LLM Judge - Diversity    | 68.3     |
| LLM Judge - Fluency      | 79.4     |
| LLM Judge - Groundedness | 71.2     |

## How Metrics Work

### Goal Completion Rate (GCR)

The script checks if:
1. **Constraints** from the goal are satisfied (e.g., area, price, type)
2. **Requestables** are mentioned in the dialogue (e.g., phone, address, reference)
3. **Completion indicators** are present (e.g., "thank you", "booked", "confirmed")

### Task Success Rate (TSR)

The script judges success based on:
1. **Intent fulfillment**: The user's intent (book, find, search) is fulfilled
2. **Sufficient length**: Dialogue has at least 4 turns
3. **User satisfaction**: Last user turn contains satisfaction indicators

### BLEU Score

- Compares generated dialogue text to reference MultiWOZ dialogues
- Uses sentence-level BLEU with smoothing
- Matches dialogues by domain for fair comparison

### Repetition Rate

- Calculates the percentage of repeated turns
- Formula: `1 - (unique_turns / total_turns)`
- Lower is better (indicates more diverse dialogue)

### LLM-as-a-Judge

Uses the configured LLM (from `Config`) to evaluate each dialogue with this prompt:

```
You are an expert dialogue evaluator. Please score the following synthetic 
conversation on a scale of 0–100 for each metric:

1. Task Success – Did the system fulfill the user goal?
2. Coherence – Are turns logically consistent and context-aware?
3. Diversity – Is the phrasing natural and non-repetitive?
4. Fluency – Are grammar, punctuation, and language natural?
5. Groundedness – Are the facts based on given input or hallucinated?
```

The LLM returns JSON scores for each metric.

## Configuration

The evaluation uses your existing `Config` settings:
- LLM provider (Ollama, Mistral, OpenAI, Gemini)
- API keys and endpoints
- Data directories

Make sure your `.env` file or environment variables are configured correctly for LLM-as-a-Judge evaluation.

## Performance Tips

1. **For quick testing**: Use `--skip-llm-judge` to skip LLM evaluation
2. **For large datasets**: Use `--synthetic-limit` to evaluate a subset first
3. **For faster BLEU**: Use `--reference-limit` to limit reference dialogues

## Troubleshooting

### NLTK Data Missing

If you see errors about missing NLTK data:
```bash
python -c "import nltk; nltk.download('punkt')"
```

### LLM Evaluation Failing

- Check your API keys in `.env` file
- Verify LLM provider is configured correctly
- Check API connectivity (for remote APIs)
- Try `--skip-llm-judge` to test other metrics first

### No Dialogues Found

- Make sure you've generated dialogues first using `generate_dialogues.py`
- Check that dialogues are in the correct directory (`data/synthetic/`)

## Example Usage

```bash
# Full evaluation with all metrics
python scripts/comprehensive_dialogue_evaluation.py

# Quick evaluation without LLM judge (faster)
python scripts/comprehensive_dialogue_evaluation.py --skip-llm-judge --synthetic-limit 20

# Evaluation with custom output
python scripts/comprehensive_dialogue_evaluation.py \
  --synthetic-limit 100 \
  --reference-limit 200 \
  --output-file data/results/final_evaluation.json
```

## Integration with Existing Evaluation

This comprehensive evaluation script complements the existing evaluation tools:
- `scripts/evaluate.py` - Standard evaluation (BERTScore, diversity, goal relevance)
- `scripts/comprehensive_evaluate.py` - Compares synthetic, few-shot hub, and MultiWOZ

The new script focuses on goal-oriented dialogue metrics (GCR, TSR) and LLM-as-a-Judge evaluation.

