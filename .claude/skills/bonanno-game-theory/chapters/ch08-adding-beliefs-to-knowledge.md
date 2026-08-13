# Chapter 8: Adding Beliefs to Knowledge

## Core Idea
Put a **probability distribution on each information set**: the partition says what you *know*, the distribution says what you consider *likely*. Knowledge is always true; **certainty can be false**. And two like-minded individuals **cannot agree to disagree** once their disagreement becomes common knowledge (Aumann).

## Frameworks Introduced

- **Probabilistic beliefs on an information set**: `P: W → [0,1]` with `Σ_w P(w) = 1`; for an event `E`, `P(E) = Σ_{w∈E} P(w)`.
  - Why: an information set lists what you cannot rule out, but you may consider some of those states far more likely than others — even dismiss some as "extremely unlikely" with probability 0.

- **Certainty** (Def 8.1): the individual is **certain** of `E` if `P(E) = 1`.

- **Remark 8.1 — knowledge vs. certainty, the distinction the whole chapter turns on**:
  - `w ∈ KE ⟹ w ∈ E` (Ch 7: `KE ⊆ E`). **You never know something false.**
  - You **can** be certain of something false: `P(E) = 1` while the true state is outside `E`.

- **Conditional probability on states** (Def 8.2): for `P(E) > 0`,
  ```
  P(w | E) = 0            if w ∉ E
           = P(w)/P(E)    if w ∈ E
  ```

- **Bayesian / belief updating** (Def 8.3): modify initial beliefs `P` by the conditional probability rule. **Requires `P(E) > 0`** — the new information must not be surprising. When `P(E) = 0`, `P(w|E)` is undefined (division by zero).
  - Note what does *not* work: you cannot merely delete the excluded states from the table. The remaining probabilities would not sum to 1.

- **Conditional probability on events** (Def 8.4): for `P(B) > 0`,
  ```
  P(A | B) = P(A ∩ B) / P(B)      equivalently   P(A|B) = Σ_{w ∈ A∩B} P(w|B)
  ```

- **Bayes' rule** (Def 8.5): from `P(A|B) = P(A∩B)/P(B)` and `P(A∩B) = P(B|A)P(A)`,
  ```
  P(E | F) = P(F | E) · P(E) / P(F)
  ```

- **AGM belief revision** (§8.3) — how to revise on **surprising** information (`P(E) = 0`), where updating is undefined. Named for **Alchourrón** (legal scholar), **Gärdenfors** (philosopher), **Makinson** (computer scientist), 1985. Like expected utility, an **axiomatic** theory with representation theorems.
  - **Belief revision function** (Def 8.6): `f: 𝓔 → 2^W` on a collection of possible items of information `𝓔` (with `W ∈ 𝓔`, `∅ ∉ 𝓔`), satisfying for every `E ∈ 𝓔`: **(1)** `f(E) ⊆ E` and **(2)** `f(E) ≠ ∅`.
    - `f(W)` = the initial beliefs. `f(E)` = the states considered possible after learning `E`. Condition (1) means the individual is certain of the information received (she trusts the source).
  - **Arrow's Axiom** (necessary but **not sufficient**): if `E ⊆ F` and `E ∩ f(F) ≠ ∅`, then `f(E) = E ∩ f(F)`.
  - **Plausibility order** (Def 8.7): a **complete** and **transitive** binary relation `⪯` on `W`; `w ⪯ w′` reads "`w` is at least as plausible as `w′`". Note the **reversed** notation vs. Ch 1's `≽` — lower values mean more plausible.
  - **Theorem 8.1 [Grove 1988; Bonanno 2009]** — the representation theorem: `f` is compatible with the AGM axioms **iff** there is a plausibility order `⪯` that rationalizes it, i.e. for every `E`,
    ```
    f(E) = { w ∈ E : w ⪯ w′ for every w′ ∈ E }        (the most plausible states in E)
    ```
  - **AGM belief revision function** (Def 8.8): one rationalized by a plausibility order.
  - **Remark 8.2**: AGM ⟹ Arrow's Axiom, but **not** conversely.
  - **Qualitative belief updating rule**: if `E ∩ Supp(P) ≠ ∅` then `Supp(P_E) = E ∩ Supp(P)`. It is implied by Arrow's Axiom, hence **belief updating is contained in AGM belief revision** — revision goes strictly beyond it by also covering `P(E) = 0`.
  - **Probabilistic belief revision policy** (Def 8.9): a collection `{P_E}_{E∈𝓔}` with `Supp(P_E) ⊆ E`. It is an **AGM** policy iff (1) a plausibility order makes each `Supp(P_E)` the most plausible states in `E`, and (2) there is a **full-support** `P₀` on `W` such that each `P_E` is `P₀` conditioned on `Supp(P_E)`.
    - *The construction in one line*: pick any full-support `P₀`, and for each `E` condition `P₀` on `f(E)`.

- **Harsanyi consistency / like-mindedness** (Def 8.10): `P` over `W` is a **common prior** if for every individual `i` and state `w`, (1) `P(ℐᵢ(w)) > 0` and (2) `P(w′ | ℐᵢ(w)) = P_{i,w}(w′)` for every `w′`. When a common prior exists, the individuals are **like-minded** / their beliefs are **Harsanyi consistent**.
  - Informal target: *they would have the same beliefs if they had the same information.*
  - **How to test for existence**: write one equation per information set expressing the required conditional ratios in the unknowns `p_w`, add `Σ p_w = 1`, and solve the linear system. A common prior exists iff the system has a solution.
  - **Why the naive definition fails**: "whenever two individuals both consider `x` and `y` possible they agree on the relative likelihood of `x` vs. `y`" is **too weak**. In Fig 8.5 no two individuals ever share two possible states, so *any* beliefs would qualify — yet chaining Individuals 1 and 2 makes `a` three times as likely as `c` while Individual 3 says the opposite.
  - **Asymmetry of the counterfactual**: "what would 1 believe if he knew as much as 2?" is easy (give him information, let him update). "What would 2 believe if she knew as little as 1?" requires **taking information away**, which is *not* the same as updating on something she already knows (that changes nothing).

- **Theorem (Agreement Theorem; Aumann, 1976)** — the book numbers this 8.1 as well: if at some state it is **common knowledge** that Individual 1 assigns probability `p` to `E` and Individual 2 assigns `q` to `E`, and their beliefs are Harsanyi consistent, then **`p = q`**. Formally: if a common prior exists and `w ∈ CK(P₁(E)=p ∩ P₂(E)=q)` then `p = q`.
  - **Dynamic reading**: hearing that the other person disagrees is *itself* valuable information that must be updated on. Sequential communication changes beliefs; if the beliefs ever become common knowledge, they must be identical.

## Key Concepts
- **Support** — `Supp(P) = {w : P(w) > 0}`; the smallest event of which the individual is certain.
- **Full-support probability distribution** — `P₀(w) > 0` for every `w ∈ W`.
- **Not-surprising information** — an event `E` with `P(E) > 0`; the precondition for updating.
- **Experiment** — in §8.5, an experiment *is* a partition of the set of states: performing it tells you which cell you are in.
- **Common prior** — the single distribution from which all individuals' beliefs arise by conditioning on their own information.

## Reference Tables

| | Knowledge (`K`) | Certainty (`P = 1`) |
|---|---|---|
| Can it be false? | **No** — `KE ⊆ E` | **Yes** |
| Structure | partition | probability distribution |
| Zero probability means | — | *belief* it won't happen, **not** impossibility |

| | Belief **updating** | Belief **revision** (AGM) |
|---|---|---|
| Applies when | `P(E) > 0` | any `E`, including `P(E) = 0` |
| Mechanism | conditional probability | plausibility order → most plausible states in `E`, then condition `P₀` |
| Relationship | **contained in** AGM revision | strictly more general |
| Needed for | Ch 10 (Bayesian updating at reached information sets) | Ch 12 (perfect Bayesian equilibrium) |

## Worked Example

**1 — Bayes' rule, twice (the kidney example).** A middle-aged man reports lower-back pain. Known: `P(I) = 4%` (chronic kidney inflammation in this age group), `P(L) = 25%` (lower-back pain), `P(L|I) = 85%`. What is `P(I|L)`?

```
P(I|L) = P(L|I)·P(I) / P(L) = (0.85)(0.04) / 0.25 = 0.136 = 13.6%
```

The same answer by counting, over 2,500 men — worth doing once because it makes the base-rate effect visible:

| | Lower-back pain | No lower-back pain | Total |
|---|---|---|---|
| **Inflammation** | 85 | 15 | **100** (4%) |
| **No inflammation** | 540 | 1,860 | **2,400** |
| **Total** | **625** (25%) | 1,875 | 2,500 |

Fill order: `100` and `2,400` from `P(I)`; `625` and `1,875` from `P(L)`; `85` and `15` from `P(L|I)`; then the remaining two cells by subtraction. Answer: `85/625 = 13.6%`. Despite 85% of sufferers-of-the-disease having the symptom, only 13.6% of symptom-havers have the disease — the disease is rare and the symptom is common.

**2 — Updating a belief table (Table 8.2 → 8.3).** `W = {a,…,g}` with `P = (3/20, 0, 7/20, 1/20, 0, 4/20, 5/20)`. Condition on `E = {a,d,e,g}`, `P(E) = 9/20`:

| state | a | b | c | d | e | f | g |
|---|---|---|---|---|---|---|---|
| `P` | 3/20 | 0 | 7/20 | 1/20 | 0 | 4/20 | 5/20 |
| `P(·\|E)` | **3/9** | 0 | 0 | **1/9** | 0 | 0 | **5/9** |

Then for `D = {a,b,c,f,g}`: `P(D) = 19/20 = 95%`, while `P(D|E) = P(D∩E)/P(E) = (8/20)/(9/20) = 8/9 ≈ 89%`. Information `E` **lowered** confidence in `D`.

**3 — Testing for a common prior by solving a linear system (Fig 8.4).** Two individuals over `W = {a,b,c,d,e}`:

```
Individual 1: {a,b,c} with (½, ¼, ¼)   |  {d,e} with (½, ½)
Individual 2: {a,b}   with (⅔, ⅓)      |  {c,d} with (⅓, ⅔)   |  {e} with (1)
```

Seek `(p_a,…,p_e)`. Write the required conditional ratios:

```
1's {a,b,c}:  p_b/(p_a+p_b+p_c) = ¼   and  p_c/(p_a+p_b+p_c) = ¼   ⟹  p_b = p_c
1's {d,e}:    p_d/(p_d+p_e) = ½                                    ⟹  p_d = p_e
2's {a,b}:    p_a/(p_a+p_b) = ⅔                                    ⟹  p_a = 2p_b
2's {c,d}:    p_c/(p_c+p_d) = ⅓                                    ⟹  p_d = 2p_c
```

With `Σ p_w = 1` this is five equations in five unknowns, with the **unique** solution

```
P = (a: 2/8, b: 1/8, c: 1/8, d: 2/8, e: 2/8)
```

So the two are **like-minded**, even though they disagree at every state — the disagreement is purely informational. Sanity-check by conditioning `P` on each information set and recovering the numbers inside it.

*And a case with no common prior* (Fig 8.5 + 8.6): three individuals with partitions `{{b,c},…}`, `{{a,b},…}`, `{{a,c},…}` and beliefs giving `p_a = p_b` (from 1), `p_b = p_c` (from 2), hence `p_a = p_c`; but Individual 3's beliefs require `p_a = 3p_c`. **Contradiction — not Harsanyi consistent.**

**4 — Knowing you disagree is not the same as commonly knowing it (Fig 8.7).** Same structure as above, `E = {b,c}`, true state `a`. Individual 1's information set is `{a,b,c}` so `P₁(E) = ¼ + ¼ = ½`; Individual 2's is `{a,b}` so `P₂(E) = ⅓`. Treat each assessment as an **event**:

```
[P₁(E) = ½] = {a,b,c}          [P₂(E) = ⅓] = {a,b,c,d}
K₁[P₂(E) = ⅓] = {a,b,c}        K₂[P₁(E) = ½] = {a,b}
```

So at `a` they disagree **and each knows they disagree**. But

```
K₁K₂[P₁(E) = ½] = ∅
```

— Individual 1 does not know that Individual 2 knows that he assigns ½. **The disagreement is not common knowledge**, which is exactly why the Agreement Theorem is not violated.

**5 — Two scientists e-mailing until they agree (§8.5).** Seven states `a,…,g` with a **shared** prior `(4, 2, 8, 5, 7, 2, 4)/32`. `E = {a,c,d,e}`, so initially both agree `P(E) = 24/32 = 75%`. Experiments = partitions:

```
Experiment 1 (S1):  {a,b,c}  {d,e,f}  {g}
Experiment 2 (S2):  {a,b,d}  {c,e,f,g}
```

Posteriors per cell:

| | cell | `P(E \| cell)` |
|---|---|---|
| S1 | `{a,b,c}` | 12/14 |
| S1 | `{d,e,f}` | 12/14 |
| S1 | `{g}` | 0 |
| S2 | `{a,b,d}` | 9/11 |
| S2 | `{c,e,f,g}` | 15/21 |

**True state: `f`.** (Note in passing: at `b`, experiment 1 raises `P(E)` from 75% to 86% even though `E` is *false* — informative experiments can move you away from the truth.)

*Round 1.* S1 sends "12/14", S2 sends "15/21".
- S1 learns from "15/21" that the state is **not `d`** (from `d` S2 would have said 9/11). His cell `{d,e,f}` refines to `{e,f}` → new `P(E) = 7/9`.
- S2 learns from "12/14" that the state is **not `g`** (from `g` S1 would have said 0). Her cell `{c,e,f,g}` refines to `{c,e,f}` → new `P(E) = 15/17`. Her cell `{a,b,d}` learns nothing (all three would send 12/14).

*Round 2.* S1 sends "7/9", S2 sends "15/17".
- S1 learns nothing new.
- S2 learns the state is **not `c`** (from `c` S1's second message would have been `P(E) = 1`). Her cell refines to `{e,f}`.

Now **both** partitions agree on `{e,f}`, and both report

```
P(E) = 7/9 ≈ 78%
```

Further exchanges convey nothing. At state `f` it has become **common knowledge** that both assign 7/9 — and, as the theorem requires, the two numbers are **equal**. (Note again they have moved *away* from the truth: `f ∉ E`, and their estimate rose from 75% to 78%.)

The mechanism to internalize: **before the last step it was never common knowledge what probability each attached to `E`.** Each announcement was informative precisely because of that; the process stops exactly when announcements stop being informative — which is when the estimates coincide.

## Key Takeaways
1. **Knowledge is veridical; certainty is not.** `KE ⊆ E`, but `P(E) = 1` is compatible with `E` being false. Never treat probability-1 as knowledge.
2. Never revise by deleting rows from a probability table — the result isn't a distribution. **Condition.**
3. Updating requires `P(E) > 0`. That precondition is not a technicality: it is the entire reason Part IV needs AGM revision, since dynamic games routinely reach information sets the initial beliefs gave probability 0.
4. Bayes' rule fights base rates. Compute it twice — algebraically and by counting a concrete population — when the answer feels wrong.
5. **AGM revision = a plausibility order + a full-support prior.** Take the most plausible states inside the information received, then condition `P₀` on them. Arrow's Axiom is necessary but insufficient; the plausibility order is the real content.
6. Belief updating is a **special case** of AGM revision, not a separate theory.
7. To test **like-mindedness**, don't reason informally — write the conditional-ratio equations plus `Σ p = 1` and solve. Existence of a solution *is* Harsanyi consistency.
8. Rational, like-minded people **can** disagree, and can even **know** they disagree. What they cannot do is disagree while it is **common knowledge** that they disagree (Aumann).
9. **A disagreement is information.** In any protocol where estimates are announced, each announcement must be conditioned on — which is why iterated announcement converges to agreement.
10. Informative experiments can increase confidence in a falsehood, and communication can move a group farther from the truth. Agreement is not accuracy.

## Connects To
- **Ch 7**: supplies the information partitions, knowledge operators and the `CK` operator that the Agreement Theorem's hypothesis is stated in.
- **Ch 4**: probability foundations and the objective/subjective distinction; AGM is axiomatic in the same style as expected utility.
- **Ch 9**: uses knowledge-belief structures to model rationality in games.
- **Ch 10**: "Bayesian updating at reached information sets" — the updating half of this chapter applied to dynamic games.
- **Ch 12**: **AGM consistency** is the conceptual anchor of perfect Bayesian equilibrium; §8.3 exists specifically to serve it.
- **Ch 13–15**: Harsanyi consistency is the crux of incomplete-information games; §8.4 exists specifically to serve Ch 13.
- **Aumann (1976)**, **Grove (1988)**, **Alchourrón–Gärdenfors–Makinson (1985)**: the source results.
