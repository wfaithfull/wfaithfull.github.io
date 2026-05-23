# Blog Post Design: "The Bandwidth of Intent"

**Author:** Will Faithfull
**Target file:** `src/content/blog/2026-05-23-bandwidth-of-intent/index.mdx`
**Date:** 2026-05-23
**Tags:** ai, software-engineering, information-theory
**Rigor:** Semi-formal — light math (H, I, R(D), DPI), no heavy proofs.

---

## Thesis

Agent autonomy is bounded by the **mutual information between operator intent and trajectory**. The context window is a bandwidth-limited channel. Specification cost grows faster than context can absorb. Intent itself is non-stationary. And — the central claim — **you cannot compensate for lack of information with more agents**: by the data processing inequality, no downstream computation can recover bits that were never in the prompt. Expert steering remains load-bearing, mathematically, not nostalgically.

This is the formal grounding of the conclusion reached intuitively in [Do We Still Need Experts?](/blog/do-we-still-need-experts).

## Why this post, why now

- Direct sequel to *Do We Still Need Experts?* (March 2026), which asserted expertise still matters without explaining *why* in formal terms.
- "Throw more agents at it" is a culturally dominant pattern in 2026 — swarm/team/multi-agent frameworks proliferate. The post pushes back with information theory rather than vibes.
- Will's existing voice is well-suited: comfortable with light technical depth, SVG figures, named citations, plain-prose links.

## Audience

Engineering leaders, senior engineers, technical founders who are already running coding agents and are weighing how far to push autonomy / parallelism. Not researchers — the math is illustrative, not derivational.

## Structure (semi-formal, ~1800–2400 words)

### 1. Hook (~150 words)
Open with sequel framing. Last post said "yes, we still need experts." This post explains *why* through information theory. Anchor the abstraction with a concrete recent moment — e.g. someone asking "build me an AI SaaS with Stripe billing, four tiers, MCP-this, OAuth-that" and watching the agent drift. The argument is going to be: that drift is mathematically inevitable below a threshold of operator-supplied information, and you cannot escape it by adding more agents.

### 2. The cone (~250 words)
Visual + light formalism. Picture a starting point, then a fan of trajectories the agent might take, widening over time. This is the trajectory-distribution entropy H(τ), where τ = (a₁, a₂, …, a_T). For an autoregressive policy:

```
H(τ) = Σ_t H(a_t | s_t)
```

The cone grows monotonically with horizon. MaxEnt RL framing (Ziebart, Levine 2018) makes this exact, but the picture is the point.

**Inline SVG:** cone diagram — starting point → widening fan of trajectories → red zone "where things go off the rails."

### 3. Steering = mutual information (~250 words)
The operator's intent is a latent variable Y. The prompt P is the operator's compressed signal. The agent's trajectory τ is what we get. We care about I(Y; τ) — how much of operator intent is recoverable from the agent's behaviour. Precise prompting, technical vocabulary, lived experience all raise I(Y; P), and a model with good priors propagates that through to I(Y; τ).

This is why generalists with broad vocabulary outperform — they have a higher-bandwidth encoder for intent (the "compounding experience" point from the previous post). Cite Jeon et al. (2024) — error decays at a rate governed by I(prompt; task), with diminishing returns per bit.

### 4. Specification cost (rate-distortion) (~250 words)
Rate-distortion theory: to keep expected deviation ≤ ε, you need R(ε) bits of specification. R is non-linear in task complexity — small ε, complex task → R blows up. Sketch the curve.

This is the operator's experience of "the more I want, the more I have to say up front." Spec cost grows superlinearly. Will's brain-dump example — "build me a todo app" (small R) vs. "build me an AI SaaS with four billing tiers, Google Ads integration, MCP, …" (large R).

Cite LLMLingua / Tishby — prompts have a compressibility floor; below that, distortion is forced.

### 5. Context budget = channel capacity (~200 words)
Channel capacity C is finite. If R(ε) > C, the cone never narrows below ε — no matter how clever you are. Practical examples: trying to fully specify enterprise-tier billing logic up front consumes the entire window before the agent has done anything. You hit the wall.

This is also why prompt engineering hits diminishing returns past a certain density.

### 6. **You cannot fix it with more agents** (~400 words — central section)
The thesis the user wants centred. Frame around the **data processing inequality**:

> For any function f (deterministic or stochastic), I(f(P); Y) ≤ I(P; Y).

In plain English: no chain of agents, no swarm, no orchestrator built on top of a prompt can have *more* mutual information with operator intent than the prompt itself does. You cannot compute your way out of an underspecified objective.

What more agents *can* do:
- **Variance reduction.** Multiple samples from the same conditional distribution. Useful when your bottleneck is stochasticity, not bias.
- **Genuine new observations.** If each agent queries the world (runs code, reads docs, asks the user), they each pull in new information from outside the original prompt. This *does* add bits — but it's the queries that add bits, not the parallelism.
- **Active learning back to the operator.** Sadigh et al. (2017) — the agent can query the operator with maximally-informative comparisons. Again: the bits come from the operator's responses, not the parallelism.

What more agents *cannot* do, even in principle:
- Recover intent that was never specified.
- Distinguish between competent pursuit of the wrong proxy and competent pursuit of the right one (goal misgeneralisation: Langosco, Shah).
- Reduce bias below the mutual-information floor set by the prompt.

Condorcet jury caveat: the "wisdom of crowds" result requires independent errors. Agents drawn from the same base model and the same prompt have heavily correlated errors. They are not n independent jurors; they are one juror sampled n times. The variance shrinks, the bias doesn't move.

**Practical implication:** if your swarm of agents is producing impressive-looking work that keeps subtly diverging from what you actually wanted, the bottleneck is not throughput. It is the bits of intent you have transmitted into the system. Adding more agents is, mathematically, the wrong intervention.

### 7. Memory doesn't close it either (~250 words)
The natural rejoinder: "what about agentic memory? Won't perfect recall of all past intent fix this?"

Answer: memory captures *past* intent. The cone problem stems partly from intent being **non-stationary** — humans don't know what they want until they see it. Inverse Reward Design (Hadfield-Menell 2017) makes this formal: the written spec is *evidence about* the latent reward, not the reward itself. CIRL (Hadfield-Menell 2016) treats alignment as a cooperative game where the agent must continuously infer evolving reward.

So even an oracle with infinite memory still cannot close the cone, because the operator-side distribution itself is moving. The iterative loop — prompt, observe, correct, prompt again — is not a workaround for a primitive tool. It is the only way to add bits at the rate at which operator intent resolves.

### 8. Empirical confirmation (~250 words)
The information-theoretic argument predicts: reliability should decay with horizon, even as capability rises. Compounding error in long chains. Goal misgeneralisation on underspecified tasks. All of which we observe:

- **METR (Kwa, West et al. 2025)** — 50%-success task horizon doubles every ~7 months. But the **80%-reliability horizon is ~5× shorter than the 50% horizon for the same model**. Reliability collapses long before capability does.
- **Dziri "Faith and Fate" (NeurIPS 2023)** — exponential accuracy decay with reasoning depth on compositional tasks.
- **Goal misgeneralisation** (Langosco 2022, Shah 2022) — agents pursue competent but wrong proxies under distribution shift.
- **Specification gaming catalogue** (Krakovna, DeepMind) — 90+ documented cases of agents satisfying the spec while violating intent.

These are the empirical signature of the cone widening faster than bits can be supplied.

### 9. The controller view (~250 words)
This is what an expert operator is actually doing: acting as a **controller on a stochastic process**. LLMPC (Maher 2025) makes this explicit — LLM planning as model-predictive control. The operator observes the agent's emerging trajectory, identifies divergence, and injects high-bandwidth corrections at the moments where they compress the most bits-per-token. KL-regularised RL framings (Korbak, Perez, Buckley 2022) treat the prior as the model and the reward as evidence updating it — which is exactly the operator's role at each correction.

Experience compresses corrections. A senior engineer can say "use a VPC with public/private subnets" — three words that carry maybe twenty bits of architectural intent. A junior would either not know to say it, or would spend hundreds of bits saying it less precisely. **Experience is bandwidth.**

### 10. Closing (~150 words)
Tie back to the previous post. "Do we still need experts?" was the right question. The answer is yes, and it's not nostalgia. It is the data processing inequality, the channel capacity of a context window, and the non-stationarity of human intent. You can have a hundred agents and they will still need a human at the controls — not because the agents are bad, but because no amount of downstream compute creates information that was never present in the input.

If your team feels like it is spinning up more agents and getting subtly worse outcomes, that is not a tooling problem. That is the data processing inequality, billing you for the bits you never sent.

---

## Figures

- **One inline SVG:** cone diagram. Starting point at left, two overlaid cones — wide red (no steering), narrow blue (precise prompting + expert corrections at intervals). Time on x-axis, "trajectory space" on y. Style consistent with the SVG in *Do We Still Need Experts?* — same colour palette (#38bdf8, #ef4444), same Inter font.
- **Maybe a second SVG:** rate-distortion curve R(ε) with context-capacity line C drawn horizontally. Region where R(ε) > C shaded — "no spec budget can reach here." Optional; add only if the section needs it.

## Citations (inline, plain-prose links)

- Korbak, Perez, Buckley (2022) — [arxiv 2205.11275](https://arxiv.org/abs/2205.11275)
- Jeon, Lee, Lei, Van Roy (ICML 2024) — [arxiv 2401.15530](https://arxiv.org/abs/2401.15530)
- Kwa, West et al. / METR (2025) — [arxiv 2503.14499](https://arxiv.org/abs/2503.14499) and [metr.org blog](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- Dziri et al. (NeurIPS 2023) — [arxiv 2305.18654](https://arxiv.org/abs/2305.18654)
- Langosco et al. (ICML 2022) — [arxiv 2105.14111](https://arxiv.org/abs/2105.14111)
- Shah et al. (DeepMind 2022) — [arxiv 2210.01790](https://arxiv.org/abs/2210.01790)
- Hadfield-Menell et al. — IRD ([arxiv 1711.02827](https://arxiv.org/abs/1711.02827)), CIRL ([arxiv 1606.03137](https://arxiv.org/abs/1606.03137))
- Sadigh et al. (RSS 2017) — active preference learning
- Krakovna et al. (DeepMind 2020) — [spec gaming catalogue](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)
- Maher (2025) — LLMPC, [arxiv 2501.02486](https://arxiv.org/abs/2501.02486)
- Zhou et al. — LLMLingua, [arxiv 2310.05736](https://arxiv.org/abs/2310.05736)
- Joel Spolsky's NetScape rewrite article (existing link from prior post — for thematic continuity)

Aim for maybe 6-8 citations actually surfaced inline; the rest as supporting reading in a footer block.

## Voice & style notes

Match the existing blog voice (see `2026-03-01-do-we-still-need-experts`, `2025-09-05-ai-thesis-software-engineering`):

- First person, direct, opinionated.
- Short paragraphs. No academic stuffiness.
- Inline citations as plain-prose links, not formal `(Author, Year)`.
- Light formulas inline. Maximum two display equations. Math should be illustrative — a senior engineer reader should grok it without a stats background.
- Concrete anchors: reference real recent agent setups (swarms, multi-agent teams) and the user's own work (the 7-week startup build).
- One or two memorable lines. Candidates already drafted:
  - *"Experience is bandwidth."*
  - *"The data processing inequality, billing you for the bits you never sent."*
  - *"You are not building a juror panel; you are sampling one juror n times."*

## Frontmatter

```yaml
---
title: "The Bandwidth of Intent"
date: 2026-05-23
draft: false
tags:
  - ai
  - software-engineering
  - information-theory
description: "Why you cannot compensate for lack of information with more agents — the information-theoretic case for expert steering."
---
```

## Out of scope

- Heavy proofs or derivations. This is a blog post, not a paper.
- Tooling-specific arguments (Claude Code vs Cursor vs others).
- Forecasting whether or when this barrier will fall. The post argues it is a structural limit of the current paradigm; future paradigms are outside scope.
- Multi-agent benchmarking / empirical study. Cited where relevant, not reproduced.

## Risks

- **Risk of being mathy-but-superficial.** Mitigation: every formal claim grounded by a concrete operator experience. No formula without a phenomenology paragraph.
- **Risk of overclaiming on DPI.** Mitigation: explicitly carve out the two cases where more agents *do* add bits (genuine new observation; active queries to the operator).
- **Risk of feeling like a re-tread of *Do We Still Need Experts?***. Mitigation: the central thesis (no compensation via parallelism, by DPI) was not in the previous post and reframes the whole question.

## Success criteria

- Reader who runs swarm/team setups should recognise their own frustration in section 6 and walk away with a formal explanation of why throughput-scaling stalled them.
- Reader from the prior post should see this as the formal grounding that was implicit.
- The phrase "you cannot compensate for lack of information with more agents" should be the load-bearing takeaway.
