# Changelog

All notable changes to the GoalConvo framework will be documented in this file.

## [0.1.0] - 2024-01-XX

### Added
- Initial release of GoalConvo framework
- Multi-agent dialogue simulation using Mistral-7B
- Few-shot experience generator with dynamic hub
- Quality filtering with heuristic and LLM-based evaluation
- Comprehensive evaluation metrics (BERTScore, diversity, goal relevance)
- MultiWOZ dataset integration and comparison
- Complete pipeline scripts for generation and evaluation
- Comprehensive test suite
- Documentation and usage examples

### Features
- **Experience Generator**: Creates rich user scenarios with few-shot prompting
- **Multi-Agent Simulator**: Implements Algorithm 1 from research paper
- **Quality Judge**: Filters dialogues using heuristics and LLM-as-judge
- **Dataset Store**: Manages synthetic dialogues and few-shot hub
- **Evaluator**: Computes metrics matching research paper targets
- **Scripts**: Command-line tools for generation and evaluation

### Metrics Targets
- BERTScore: ~0.71 (semantic similarity)
- Diversity: ~0.46 (lexical diversity)
- Goal Relevance: ~85% (goal satisfaction rate)

### Supported Domains
- Hotel booking
- Restaurant reservations
- Taxi/transportation
- Train tickets
- Tourist attractions

### API Support
- Mistral-7B via Together AI, Replicate, or similar
- OpenAI API as fallback
- Configurable retry logic and error handling
