# Chapter 4: Expected Utility

## Core Idea
Four axioms on a ranking of lotteries guarantee a **von Neumann-Morgenstern utility function** whose *expected value* represents that ranking — and it is unique up to a positive affine transformation. Rationality does **not** dictate an attitude to risk; it only dictates consistency.

## Frameworks Introduced

- **Attitudes to risk** (Def 4.1): compare lottery `L` against the degenerate lottery `$E[L]` (its expected value for certain).
  - **Risk averse** — prefers `$E[L]` to `L`.
  - **Risk neutral** — indifferent between them.
  - **Risk loving** — prefers `L` to `$E[L]`.
  - Critical asymmetry: **risk neutrality pins down the entire ranking** of money lotteries (given transitivity + more-money-is-better); risk aversion and risk loving do **not**. Two risk-averse people with those same properties can rank the same pair oppositely (Exercise 4.11: `L₃ = $28` certain, `E = 28`, vs. `L₄ = ($10 w.p. ½, $50 w.p. ½)`, `E = 27` — one prefers `L₃`, another `L₄`).

- **Von Neumann-Morgenstern ranking** (Def 4.2): a ranking `≽` of `ℒ(O)` satisfying the four Expected Utility Axioms.

- **Theorem 4.1 [von Neumann-Morgenstern, 1944]** — the representation theorem. If `≽` is a vNM ranking of `ℒ(O)`, there **exists** `U: O → ℝ` (a **vNM utility function**) such that for any two lotteries:
  ```
  L ≻ L′   ⟺   E[U(L)] > E[U(L′)]
  L ~ L′   ⟺   E[U(L)] = E[U(L′)]
  where  E[U(L)] = p₁U(o₁) + p₂U(o₂) + … + p_m U(o_m)
  ```
  - When to use: whenever you want to compare lotteries, or to **infer** an unobserved choice from an observed one.
  - What it does *not* say: it does not tell you the values. Asking someone "what is your vNM utility function?" is meaningless — the function is a tool *we* use to represent *her* ranking. (Before 1944 the question could not even be conceived.)

- **Theorem 4.2 [von Neumann-Morgenstern, 1944]** — the uniqueness theorem, in two halves:
  - **(A)** If `U` represents `≽`, then `V(oᵢ) = aU(oᵢ) + b` with `a > 0` also represents `≽`.
  - **(B)** If `U` and `V` both represent `≽`, then `V(oᵢ) = aU(oᵢ) + b` for some `a > 0, b`.
  - Reading (Remark 4.2): a vNM utility function is **unique up to a positive affine transformation** — which is why it is called a **cardinal** utility function, as opposed to the ordinal utility of Ch 1.
  - Proof of (A): multiply both sides of the representing inequality by `a > 0` and add `(Σpᵢ)b` to both sides. Proof of (B): normalize both functions and show the normalizations must be identical (otherwise construct `L = (o_best w.p. p̂, o_worst w.p. 1−p̂)` with `p̂ = U(ô)` and derive that `U` and `V` rank `ô` vs. `L` oppositely).

- **Normalized utility function** (Def 4.3): the unique representative with `U(o_worst) = 0` and `U(o_best) = 1`.
  - How to build one from any `F`: first `G(o) = F(o) − F(o_worst)` (so `G(o_worst) = 0`), then `U(o) = G(o)/G(o_best)` (so `U(o_best) = 1`). Both steps are positive affine transformations, so Theorem 4.2 guarantees `U` still represents `≽`.

- **Eliciting a vNM utility function in at most `(m − 1)` questions** — the constructive procedure:
  1. Ask "**what is your ranking of the basic outcomes?**" — assign `1` to the best outcome(s) and `0` to the worst.
  2. For each remaining outcome `oᵢ`, invoke the **Continuity Axiom** and ask for the `pᵢ` making her indifferent between `oᵢ` for certain and `(o_best w.p. pᵢ, o_worst w.p. 1−pᵢ)`.
  3. Set `U(oᵢ) = pᵢ`. This is valid because the lottery's expected utility is `pᵢ(1) + (1−pᵢ)(0) = pᵢ`.
  - Crucially, none of the questions uses the word "utility".

- **The four Expected Utility Axioms** (§4.3):
  - **Axiom 1 [Completeness and transitivity]**: `≽` is complete and transitive. Implies a complete, transitive ranking of the basic outcomes (via the degenerate lotteries).
  - **Axiom 2 [Monotonicity]**: `(o_best w.p. p, o_worst w.p. 1−p) ≽ (o_best w.p. q, o_worst w.p. 1−q)` **iff** `p ≥ q`.
  - **Axiom 3 [Continuity]**: for every basic outcome `oᵢ` there is a `pᵢ ∈ [0,1]` with `oᵢ ~ (o_best w.p. pᵢ, o_worst w.p. 1−pᵢ)`. *This is the axiom that makes elicitation possible.*
  - **Axiom 4 [Independence / substitutability]**: if `ô ~ L̂`, then replacing `oᵢ` in a lottery `L` with `L̂` yields a lottery indifferent to `L`. *This is the axiom that does the work in the proof of Thm 4.1.*

- **Compound lottery and its reduction** (Def 4.1 for compound lotteries — note the book reuses the number 4.1): a lottery `(x₁ w.p. p₁, …, x_r w.p. p_r)` where each `xᵢ` is either a basic outcome **or** itself a lottery.
  - How to reduce it to a simple lottery: **multiply probabilities along each path** of the tree, then **add up**, for each outcome, the probabilities of all paths leading to it. Formally `qᵢ = Σⱼ pⱼ · λ_{oᵢ}(xⱼ)`.

## Key Concepts
- **Basic outcome** — need not be money: a state of health, receiving an award, whether it rains on the day of your party.
- **Simple lottery** — a probability distribution over `O`; `ℒ(O)` is the set of them. `O` is assumed finite throughout.
- **Degenerate lottery** — assigns probability 1 to one basic outcome; written simply as that outcome. Zero-probability outcomes are usually omitted from the notation.
- **Zero probability ≠ impossibility** — assigning probability 0 "is taken to be an expression of **belief** not of impossibility": the DM is confident it won't happen but cannot rule it out on logical grounds or by laws of nature.
- **DM (Decision-Maker)** — the individual under consideration.
- **`o_best` / `o_worst`** — a best / worst basic outcome. There may be several of each; the DM is then indifferent among them. Assumed throughout: `o_best ≻ o_worst` (the DM is not indifferent among all outcomes).
- **Objective vs. subjective probabilities** — either is admissible. A cyclist may use area theft statistics, or lower them because she knows she always locks her bike.
- **Affine transformation** — `f(x) = ax + b`; **positive** if `a > 0`.
- **Cardinal utility function** — synonym for vNM utility function, so called because of Thm 4.2.

## Reference Tables

Normalizing a utility function (`o₃ ~ o₆ ≻ o₁ ~ o₄ ≻ o₂ ~ o₅`; `o_best ∈ {o₃,o₆}`, `o_worst ∈ {o₂,o₅}`):

| | `o₁` | `o₂` | `o₃` | `o₄` | `o₅` | `o₆` |
|---|---|---|---|---|---|---|
| `F` (arbitrary) | 2 | −2 | 8 | 0 | −2 | 8 |
| `G = F − F(o_worst)` | 4 | 0 | 10 | 2 | 0 | 10 |
| `U = G / G(o_best)` | 0.4 | 0 | 1 | 0.2 | 0 | 1 |

What each risk attitude lets you conclude:

| Given: transitive, prefers more money, and… | Can you rank **any** two money lotteries? |
|---|---|
| risk **neutral** | **Yes** — compare expected values |
| risk **averse** | **No** — needs the actual utility function |
| risk **loving** | **No** — needs the actual utility function |

## Worked Example

**Predicting an unobserved choice from an observed one (§4.2).** We observe Susan prefer `A` to `B`:

```
A = (o₁: 0,   o₂: 0.25, o₃: 0.75)
B = (o₁: 0.2, o₂: 0,    o₃: 0.8)
```

Predict her choice between:

```
C = (o₁: 0.8, o₂: 0,    o₃: 0.2)
D = (o₁: 0,   o₂: 1,    o₃: 0)   = o₂
```

Let `U(o₁) = a`, `U(o₂) = b`, `U(o₃) = c` for the function Theorem 4.1 guarantees exists. `A ≻ B` gives

```
0.25b + 0.75c > 0.2a + 0.8c
0.25b > 0.2a + 0.05c
b > 0.8a + 0.2c            (divide by 0.25)
```

But `E[U(D)] = b` and `E[U(C)] = 0.8a + 0.2c`. So **Susan prefers `D` to `C`**.

Note what was used: **only the existence** of a vNM utility function. We never learned `a`, `b`, or `c`. This is the practical payoff of Theorem 4.1 — one observed preference constrains others.

**Eliciting a full utility function in one question (Example 4.1).** Five basic outcomes; the DM reports the ranking

```
o₂ ≻ o₁ ~ o₅ ≻ o₃ ~ o₄
```

Assign `U(o₂) = 1` (best) and `U(o₃) = U(o₄) = 0` (worst):

| | `o₁` | `o₂` | `o₃` | `o₄` | `o₅` |
|---|---|---|---|---|---|
| utility | ? | 1 | 0 | 0 | ? |

Only **one** value is left, since `o₁ ~ o₅` forces `U(o₁) = U(o₅)`. Ask: *what `p` makes you indifferent between `o₁` for certain and the lottery `(o₂ w.p. p, o₃ w.p. 1−p)`?* She answers **0.4**. Done:

| | `o₁` | `o₂` | `o₃` | `o₄` | `o₅` |
|---|---|---|---|---|---|
| utility | 0.4 | 1 | 0 | 0 | 0.4 |

Her choice among **any** set of lotteries over these five outcomes is now predictable. With `m = 5` outcomes the bound is `m − 1 = 4` questions; indifferences reduced it to one.

**Reducing a compound lottery (§4.3).** With `m = 4`, take the compound lottery `C` with `r = 3`: branch 1 (prob ½) leads to the sub-lottery `(o₁: ⅓, o₂: ⅙, o₃: ⅙, o₄: ⅙…)`, branch 2 (prob ¼) leads to `o₁` for certain, branch 3 (prob ¼) leads to `(o₁: ⅕, o₃: ⅕, o₄: ⅗)`.

Compute `q₁` (probability of `o₁`) by multiplying along paths and summing:

```
q₁ = (½)(⅓) + (¼)(1) + (¼)(⅕) = ⅙ + ¼ + ¹⁄₂₀ = 28/60
```

Doing the same for the rest gives `q₂ = 5/60`, `q₃ = 13/60`, `q₄ = 14/60`, so

```
L(C) = (o₁: 28/60, o₂: 5/60, o₃: 13/60, o₄: 14/60)
```

The two-step picture is worth internalizing: **(a)** condense each path into a single edge labeled with the product of its probabilities; **(b)** for each outcome, add the probabilities of all edges reaching it.

**Why risk neutrality is special.** Rank `L₁ = ($30: ⅓, $45: 5⁄9, $90: ⅑)` against `L₂ = ($5: ⅗, $100: ⅖)` for someone risk neutral, transitive, and money-loving. `E[L₁] = 45`, so `L₁ ~ $45`. `E[L₂] = 43`, so `L₂ ~ $43`. Since `$45 ≻ $43`, transitivity gives `L₁ ≻ L₂` — **no utility function needed**. Replace "risk neutral" with "risk averse" and the argument collapses.

## Key Takeaways
1. **Rationality is silent on risk attitude** (Remark 4.1). *De gustibus non est disputandum* — there is no irrational preference, hence no irrational attitude to risk. Most people reveal risk aversion when stakes are high (they buy insurance).
2. Risk neutrality alone determines the whole ranking of money lotteries; risk aversion and risk loving do not. Never assume a risk-averse agent's choice is pinned down by "risk averse".
3. Theorem 4.1's power is often in the **existence** claim alone — you can derive unobserved preferences from observed ones without knowing a single utility number.
4. **Cardinal ≠ meaningful magnitudes.** Uniqueness is only up to `aU + b` with `a > 0`, so differences of utility have no absolute meaning, but *ratios of utility differences* survive the transformation.
5. Never ask a person for her utility function. Ask for her ranking, then for indifference probabilities against the best/worst lottery — the Continuity Axiom converts those answers into utilities.
6. Normalize to `[0,1]` (`U(o_worst)=0, U(o_best)=1`) whenever you need a canonical representative — it is always available and always legitimate.
7. **Probability 0 encodes belief, not impossibility.** This distinction becomes structurally essential in Ch 10–12, where updating at zero-probability information sets is the central problem.
8. To reduce a compound lottery: multiply along paths, then add across paths per outcome.
9. Axiom 3 (Continuity) is what makes utilities *measurable*; Axiom 4 (Independence) is what makes them *expected-value-additive*. These are the two axioms that empirical work (Allais, Ellsberg) attacks.

## Connects To
- **Ch 3 §3.5**: chance moves created the lotteries this chapter learns to rank; risk neutrality was the ad-hoc stopgap now properly generalized.
- **Ch 1**: contrast ordinal utility (order only, arbitrary numbers) with cardinal utility here (order **and** affine structure). Part I's games only ever needed the former.
- **Ch 5**: mixed strategies **are** lotteries over strategies, so mixed-strategy Nash equilibrium is unintelligible without this chapter.
- **Ch 6**: behavioral strategies in dynamic games, same dependency.
- **Ch 8**: probabilistic beliefs, conditional probability and Bayes' rule extend the probability machinery introduced here.
- **Allais paradox / prospect theory**: the standard empirical challenges to Axiom 4.
