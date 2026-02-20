# Suggestions to Significantly Improve Dialogue Generation Quality

Based on the current pipeline (Experience Generator → Multi-Agent Simulator → Quality Judge), these changes can yield the largest gains in coherence, goal completion, and naturalness.

---

## 1. **Reduce prompt truncation and preserve full context** (High impact)

**Current:** `_truncate_prompt()` in `multi_agent_simulator.py` limits prompts to **500 words**, dropping the middle of the conversation.

**Problem:** Mid-dialogue context (earlier constraints, what was already offered) is lost, so the model repeats, contradicts, or drifts.

**Suggestions:**
- Increase `max_length` (e.g. 800–1200 words) or make it configurable via `Config`.
- Prefer **token-based truncation** (e.g. keep last N turns + full system/goal) instead of raw word count so you always keep the most recent exchange intact.
- For long dialogues, keep: (1) full system + goal + context, (2) first user utterance, (3) last K turn pairs (e.g. K=5).

---

## 2. **Use more and better few-shot examples** (High impact)

**Current:** `FEW_SHOT_EXAMPLES` defaults to **1**; experience generator uses at most 1–2 examples.

**Problem:** The model has little concrete guidance on style, structure, and domain behavior.

**Suggestions:**
- Set **FEW_SHOT_EXAMPLES=3–5** (or higher) and ensure the experience generator actually uses them in the prompt (it already loads from the hub).
- **Seed the few-shot hub** with 5–10 hand-written or MultiWOZ-derived examples per domain (goal, context, first_utterance, and optionally a full dialogue) so early runs have strong examples.
- In **dialogue simulation**, add optional **in-context examples**: 1–2 short turn-by-turn snippets (User/SupportBot) per domain in the system or user prompt so both agents see desired behavior (e.g. “Example exchange: User: … SupportBot: …”).

---

## 3. **Ground SupportBot in domain schema / constraints** (High impact)

**Current:** SupportBot is only guided by free-form prompts; no slots, DB, or schema.

**Problem:** The bot can “hallucinate” options, prices, or availability, and dialogues feel generic or inconsistent.

**Suggestions:**
- Introduce **per-domain “knowledge”**: a small JSON (or schema) per domain with allowed slot names (e.g. hotel: area, price_range, stars, parking), sample values, and 1–2 example phrases. Add to the SupportBot system prompt: “Only use these slots/options when giving information.”
- **Optional DB stub:** For hotel/restaurant, maintain a tiny in-memory “DB” (e.g. 3–5 options per slot) and inject “Available options: …” into the SupportBot prompt so responses are constrained and consistent.
- In the prompt, add: “Do not invent specific prices, addresses, or names; use placeholders like ‘a mid-range option’ or ‘one of our central hotels’ unless given in context.”

---

## 4. **Tighten generation parameters for task focus** (Medium impact)

**Current:** `temperature=0.75`, `top_p=0.92` for both agents; goal satisfaction uses `temperature=0.1`.

**Problem:** Higher temperature increases diversity but also repetition, drift, and off-goal replies.

**Suggestions:**
- Use **lower temperature for simulation** (e.g. 0.5–0.6) for more consistent, on-goal turns; keep slightly higher (e.g. 0.65) only for the experience generator if you want more varied goals/contexts.
- **SupportBot:** consider `temperature=0.5–0.6` and `max_tokens=200–250` so replies stay focused; User can stay at 0.6 or 0.65.
- Make these **configurable per “phase”** (experience vs. user turn vs. supportbot turn) in `Config` so you can tune without code changes.

---

## 5. **Stronger goal-completion and turn-level guidance** (High impact)

**Current:** Goal satisfaction is checked once per turn with one LLM call (YES/NO); prompts ask for “natural” completion but don’t enforce structure.

**Suggestions:**
- **Stricter goal-check prompt:** Require explicit evidence (e.g. “User confirmed; specific need mentioned in goal was addressed”). Optionally ask for 1–2 short reasons before YES/NO to reduce false YES.
- **Per-turn “progress” hint (optional):** When generating the next User turn, append a short line: “Goal so far: [one line]. Has [specific subgoal] been addressed? If yes, say thanks/confirm; if not, ask for the next missing piece.” This keeps the user agent on track.
- **Completion keywords:** Expand `_check_completion_keywords` with domain-specific phrases (e.g. “booked”, “confirmed”, “that’s perfect”) and use them as a fast pre-check before the LLM goal check.

---

## 6. **Improve quality judge and use it to feed the hub** (Medium–High impact)

**Current:** Quality Judge runs after the full dialogue; heuristic + LLM scores; hub is updated with top N% by quality.

**Suggestions:**
- **Raise the bar for the few-shot hub:** Only add dialogues that pass both heuristic filters and a **higher LLM quality threshold** (e.g. overall_score ≥ 0.85) and optionally “goal_relevance = YES”. This keeps the hub strictly high-quality.
- **Domain-specific thresholds:** In `QualityJudge`, allow per-domain `quality_threshold` and/or `discard_rate` (e.g. stricter for restaurant/hotel, looser for attraction if needed).
- **LLM judge prompt:** Add 1–2 negative examples in the judge prompt (“Example of poor: … Example of good: …”) so the model has a clearer notion of “excellent” vs “acceptable.”

---

## 7. **Richer experience generator output** (Medium impact)

**Current:** Experience generator produces goal, context, first_utterance, user_persona; few-shot is minimal.

**Suggestions:**
- **Structured goal:** Extend the experience schema with optional fields, e.g. `subgoals` (list of steps) or `constraints` (e.g. “price: budget”, “area: center”). Pass these into both User and SupportBot prompts so both agents “see” the same structure.
- **Domain-specific prompt:** Use different experience prompts per domain (e.g. hotel: dates, room type, area; restaurant: cuisine, party size, time) so the generated context and first utterance match real user behavior.
- **Validation:** Check that `first_utterance` actually mentions the goal or a clear subgoal; if not, retry once or fall back to a template.

---

## 8. **Per-turn diversity and repetition control** (Medium impact)

**Current:** Prompts say “vary your wording”; some fallbacks and cleaning; `detect_repeated_utterances` in Quality Judge.

**Suggestions:**
- **Explicit “do not repeat” in prompt:** For both agents, add: “Do not repeat or paraphrase your previous message or the user’s last message. Say something new.”
- **Lightweight post-step check:** After generating a turn, if the new utterance is very similar to the previous one by the same role (e.g. simple embedding or Jaccard similarity), either retry with “Say something different; avoid repeating.” or discard and use a fallback.
- **User turn:** Add “If the assistant just confirmed or summarized, respond with a short thanks or confirmation (one short sentence).” to reduce long, redundant closing turns.

---

## 9. **Model and API upgrades** (High impact if feasible)

**Current:** Config supports Gemini, Ollama, OpenAI, Mistral; default/model choice affects quality a lot.

**Suggestions:**
- Prefer a **stronger model** for simulation (e.g. GPT-4o-mini, Claude Haiku, or a larger local model) at least for SupportBot and goal-check, to reduce hallucination and improve coherence.
- **Dedicated model for goal check:** Use a small, fast model for YES/NO goal satisfaction to save cost and latency, and a better model for User/SupportBot turns.
- **Caching:** You already cache LLM responses; ensure cache keys include `domain` and perhaps `step` (user vs supportbot) so you don’t reuse a response from a different context.

---

## 10. **Optional: rollback and retry** (Medium impact)

**Current:** One shot per turn; fallbacks are generic.

**Suggestions:**
- If **goal_check** returns YES too early (e.g. before `min_turns`), ignore it and continue for another 1–2 turns so the dialogue doesn’t end abruptly.
- **Retry once on low-quality turn:** If a generated turn is very short (< 5 words), or is a known “sorry, I can’t help” style reply, retry the generation once with an added instruction: “Provide a concrete, helpful response.”
- **SupportBot fallbacks:** Make fallbacks **domain-aware** (e.g. hotel: “I can look up availability and options for you. Do you have a preferred area or budget?”) instead of a single generic line.

---

## Summary: quick wins vs larger effort

| Change | Impact | Effort |
|--------|--------|--------|
| Increase few-shot examples (3–5) + seed hub | High | Low |
| Lower temperature (0.5–0.6) for simulation | Medium–High | Low |
| Reduce/redesign prompt truncation | High | Medium |
| Domain schema + “do not invent” in SupportBot | High | Medium |
| Stricter goal-check + progress hint for User | High | Medium |
| Stronger model for agents / goal check | High | Low (config) / Medium (cost) |
| Richer experience (subgoals, validation) | Medium | Medium |
| Per-turn repetition check + retry | Medium | Medium |
| Quality Judge bar for hub + per-domain thresholds | Medium–High | Low–Medium |

Implementing **§2 (few-shot)**, **§4 (temperature)**, **§3 (domain constraints in prompt)**, and **§5 (goal-completion guidance)** together should already yield a clear improvement in dialogue quality with limited code changes.
