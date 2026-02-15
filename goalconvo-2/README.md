# GoalConvo: Scalable Generation of Goal-Oriented Dialogue Data

A framework for generating large-scale goal-oriented conversational data via multi-agent simulation using Mistral-7B language model.

## Overview

GoalConvo implements the methodology described in the research paper for generating synthetic task-oriented dialogues. The framework uses multi-agent simulation where a User agent and SupportBot agent alternate turns to create goal-focused conversations.

## Features

- **Multi-Agent Simulation**: User and SupportBot agents with role-specific prompting
- **Few-Shot Experience Generator**: Dynamic hub of high-quality examples for better generation
- **Quality Filtering**: Heuristic and LLM-based quality assessment
- **Comprehensive Evaluation**: BERTScore, diversity metrics, and goal relevance analysis
- **MultiWOZ Integration**: Comparison with real task-oriented dialogue data

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd goalconvo-2
```

2. Install dependencies:
```bash
pip install -r requirements.txt
pip install -e .
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

## Quick Start

### Option 1: Automated Setup
```bash
# Run the setup script
./setup.sh

# Edit your API keys
nano .env

# Run quick start demo
python quick_start.py
```

### Option 2: Backend Server (For Frontend Integration)
```bash
# Start the backend server
./start_backend.sh

# Or manually:
python backend_server.py

# Server will run on http://localhost:5000
# See BACKEND_SERVER_SETUP.md for detailed setup
```

### Option 2: Manual Setup
```bash
# Install the package
pip install -e .
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Download MultiWOZ dataset
python scripts/download_multiwoz.py

# Test connection
python scripts/generate_dialogues.py --test-connection

# Generate dialogues
python scripts/generate_dialogues.py --num-dialogues 100

# Evaluate results
python scripts/evaluate.py
```

### Option 3: Command Line Tools
```bash
# After installation, use the command line tools
goalconvo-download-multiwoz
goalconvo-generate --num-dialogues 1000 --domains hotel restaurant
goalconvo-evaluate --output results/
```

## Architecture

```
src/goalconvo/
├── llm_client.py          # API wrapper for Mistral-7B
├── config.py              # Configuration and hyperparameters
├── experience_generator.py # Few-shot experience generation
├── multi_agent_simulator.py # User/SupportBot dialogue simulation
├── quality_judge.py       # Quality filtering and assessment
├── dataset_store.py       # Dialogue storage and management
├── evaluator.py          # Metrics computation
└── utils.py              # Helper functions

scripts/
├── generate_dialogues.py  # Main generation pipeline
├── evaluate.py          # Evaluation pipeline
└── download_multiwoz.py # MultiWOZ data downloader

data/
├── multiwoz/            # MultiWOZ dataset
├── synthetic/          # Generated dialogues
├── few_shot_hub/       # Dynamic exemplar storage
└── seed_goals.json     # Initial goal templates
```

## Configuration

Key hyperparameters (from research paper):
- Temperature: 0.7
- Top-p: 0.9
- Max turns: 10
- Few-shot examples: 3 per prompt
- Quality discard rate: ~10%

## Evaluation Metrics

- **Semantic Similarity**: BERTScore comparison with MultiWOZ (~0.71 target)
- **Lexical Diversity**: Distinct n-gram ratios (~0.46 target)
- **Goal Relevance**: Percentage of dialogues achieving their goal (~85% target)

## Usage Examples

### Generate Dialogues for Specific Domain
```python
from goalconvo import DialogueGenerator

generator = DialogueGenerator()
dialogues = generator.generate_domain_dialogues(
    domain="hotel", 
    num_dialogues=100,
    max_turns=8
)
```

### Evaluate Generated Data
```python
from goalconvo import Evaluator

evaluator = Evaluator()
results = evaluator.evaluate_synthetic_vs_real(
    synthetic_path="data/synthetic/",
    real_path="data/multiwoz/"
)
print(f"BERTScore: {results['bertscore']:.3f}")
```

## API Requirements

The framework requires access to Mistral-7B via API. Supported providers:
- Together AI (recommended)
- Replicate
- OpenAI (as fallback)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Citation

If you use this framework in your research, please cite the original paper:

```bibtex
@article{goalconvo2024,
  title={GoalConvo: Scalable Generation of Goal-Oriented Dialogue Data Using Mistral},
  author={[Authors]},
  journal={[Journal/Conference]},
  year={2024}
}
```
