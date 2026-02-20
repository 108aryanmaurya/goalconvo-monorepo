# GoalConvo Methodology and Reproducibility

This document describes the GoalConvo pipeline, how paper metrics map to the implementation, and a reproducibility checklist.

---

## 1. Pipeline Overview

The generation pipeline has four main stages:

```
Experience Generator → Multi-Agent Simulator → Quality Judge → Dataset Store
```

1. **Experience Generator**  
   Takes a user goal (and optional domain) and produces a rich setup: expanded goal, context, first user utterance, and user persona. It uses few-shot examples from the few-shot hub (seeded with strong examples per domain) and the configured LLM.

2. **Multi-Agent Simulator**  
   Runs a turn-by-turn dialogue between two agents (User and SupportBot), both driven by the same LLM with role-specific prompts. Each turn is generated with:
   - Last-K-turns context (configurable) to avoid dropping mid-dialogue context
   - Domain schema grounding for SupportBot (slots and “do not invent” instructions)
   - Progress hint for the User agent to stay on goal and close naturally  
   Goal satisfaction is checked with a strict LLM-based criterion; the dialogue can end when the goal is fully achieved (with minimum turn count enforced).

3. **Quality Judge**  
   Post-processes each dialogue: heuristic filters (length, repetition, profanity, coherence, goal mention) and optional LLM-as-judge scores (coherence, goal relevance, overall quality). Dialogues that pass are stored; others can be discarded to meet a target discard rate.

4. **Dataset Store**  
   Saves accepted dialogues to domain-specific directories. Dataset versioning can create a snapshot (with optional config and tags) after each run for comparison and reproducibility.

---

## 2. Paper Metrics vs Implementation

| Paper (research_paper.md) | Implementation | Where |
|---------------------------|----------------|------|
| **Semantic Similarity (BERTScore)** | `bertscore_similarity` / `overall_bertscore` | Comprehensive evaluator; compared to MultiWOZ reference. Target ~0.71. |
| **Lexical Diversity (Distinct-1/2)** | `lexical_diversity` with `distinct_1`, `distinct_2`, `combined` | Comprehensive evaluator. Target ~0.46 for combined. |
| **Goal Relevance (%)** | **GCR** (Goal Completion Rate) and **TSR** (Task Success Rate) | Comprehensive evaluator: `goal_completion_rate`, `task_success_rate`. |
| **Coherence (Human /5)** | **LLM-as-Judge** coherence (0–100) and human eval dimensions | Comprehensive evaluator: `llm_judge.overall_scores.coherence`; Human Evaluation UI: coherence 1–5. |
| **Response Fluency (/5)** | **LLM-as-Judge** fluency (0–100) | Comprehensive evaluator: `llm_judge.overall_scores.fluency`. |
| **Dialogue Length (avg turns)** | `dialogue_length.avg_turns` | Comprehensive evaluator. |
| **Response Time (sec/gen)** | `response_time` (avg, per turn, min, max) | Comprehensive evaluator when timing is recorded. |

Additional implementation metrics not in the paper:

- **BLEU** (synthetic vs reference): `bleu_score` in comprehensive evaluation.
- **Repetition rate**: `repetition_rate` (lower is better).
- **Groundedness**: LLM-judge dimension in comprehensive evaluation.
- **Human evaluation**: Coherence, naturalness, task success, fluency, relevance, overall (1–5) and inter-annotator agreement via the Human Evaluation UI and APIs.

---

## 3. Reproducibility Checklist

To reproduce a run and get comparable metrics:

1. **Environment**
   - Set `DATA_DIR` (or use default `goalconvo-backend/data`).
   - Set the LLM provider and model (e.g. `GEMINI_API_KEY` and `GEMINI_MODEL`, or `OPENAI_API_KEY`, etc.).
   - Optional: set `TEMPERATURE`, `TOP_P`, `MAX_TURNS`, `MIN_TURNS`, `FEW_SHOT_EXAMPLES`, `PROMPT_MAX_WORDS`, `PROMPT_LAST_K_TURNS`.

2. **Seed**
   - The few-shot hub is seeded automatically with built-in examples when a domain has fewer than 5 examples. For strict reproducibility, avoid adding or changing hub files between runs, or document the hub state.

3. **Run pipeline**
   - From the UI: Pipeline tab → set number of dialogues and domains → Run Pipeline.
   - Or via API: `POST /api/run-pipeline` with `{ "num_dialogues": N, "domains": ["hotel", ...] }`.
   - A dataset version is created after the run (if versioning is enabled), with a unique version ID and optional config snapshot.

4. **Run evaluation**
   - Comprehensive evaluation runs automatically after the pipeline (when the comprehensive evaluator is available). It uses the last generated dialogues and, if present, MultiWOZ reference data under `data/multiwoz/` (e.g. `processed_dialogues.json`) for BERTScore and diversity comparison.

5. **Record**
   - Version ID is returned in the pipeline completion payload (e.g. `evaluation.version_id`).
   - Use the Versions tab to compare two versions (metrics, counts) or export a version to JSON/JSONL.
   - For human evaluation, use the Human Evaluation tab to create tasks from a version, annotate, and export annotations.

6. **Config snapshot**
   - For full reproducibility, note or store the config used (temperature, few_shot_examples, domains, model). The versioning system can store a generation_config snapshot when creating a version (see Dataset Versioning and pipeline integration).

---

## 4. File and Component References

- **Pipeline**: `goalconvo-backend/scripts/generate_dialogues.py` (GoalConvoGenerator), `goalconvo-backend/backend_server.py` (run_pipeline).
- **Experience generation**: `goalconvo-backend/src/goalconvo/experience_generator.py`.
- **Dialogue simulation**: `goalconvo-backend/src/goalconvo/multi_agent_simulator.py`.
- **Quality judge**: `goalconvo-backend/src/goalconvo/quality_judge.py`.
- **Comprehensive evaluation**: `goalconvo-backend/scripts/comprehensive_dialogue_evaluation.py`.
- **Evaluator (paper metrics)**: `goalconvo-backend/src/goalconvo/evaluator.py` (BERTScore, diversity, goal relevance).
- **Dataset versioning**: `goalconvo-backend/src/goalconvo/dataset_versioning.py`.
- **Frontend**: Dashboard (Pipeline, Versions, Human Evaluation), Evaluator component (displays BERTScore, Distinct-1/2, GCR, TSR, LLM-judge, etc.).
