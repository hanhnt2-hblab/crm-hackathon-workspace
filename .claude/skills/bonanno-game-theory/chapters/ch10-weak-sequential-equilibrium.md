# Chapter 10: A First Attempt — Weak Sequential Equilibrium

## Core Idea
Replace the strategy profile with an **assessment** `(σ, μ)` — behavioral strategies **plus** beliefs at every information set — and impose **sequential rationality** + **Bayesian updating at reached information sets**. This kills strictly dominated choices, but it **fails to refine subgame-perfect equilibrium**.

## Frameworks Introduced

- **Assessment** (Def 10.1): a pair `(σ, μ)` where `σ` is a profile of **behavioral strategies** and `μ` is a **system of beliefs** — a list of probability distributions, one for every information set, over the nodes **in** that information set.
  - Reading: `μ` says what the relevant player would believe **about past moves** if informed her information set had been reached.
  - Convention: trivial distributions over singleton information sets are usually omitted from `μ`.
  - Why the move is necessary: a subgame-perfect equilibrium can include a **strictly dominated choice at an unreached information set** (Ch 6 §6.3). Judging that choice requires an object richer than a strategy profile.

- **Notation you need to compute anything here**:
  - `σ(a)` — probability that `σ` assigns to choice `a`.
  - `μ(x)` — probability that `μ` assigns to node `x`.
  - `Z(x)` — terminal nodes reachable from `x`.
  - `P_{x,σ}(z)` — product of the probabilities of the choices leading from `x` to `z`.
  - `P_{root,σ}(x)` — product of the probabilities along the path from the root to `x`.
  - **Expected payoff from an information set `H`**:
    ```
    πᵢ(H | σ, μ) = Σ_{x∈H} μ(x) · Σ_{z∈Z(x)} P_{x,σ}(z) · πᵢ(z)
    ```

- **Sequential rationality** (Def 10.2): `σᵢ` is sequentially rational if for **every** information set `H` of Player `i`,
  ```
  πᵢ(H | (σᵢ, σ₋ᵢ), μ)  ≥  πᵢ(H | (σᵢ′, σ₋ᵢ), μ)     for every behavioral strategy σᵢ′
  ```
  `σ` is sequentially rational if this holds for every player.
  - **CRITICAL subtlety**: it is **not sufficient** (though necessary) that the choice *at* `H` be optimal given `σ₋ᵢ`. You must check whether Player `i` could improve by changing her choice at `H` **and possibly also at her own information sets that follow `H`**. Deviations are whole-strategy deviations, not one-node deviations.
  - (Footnote: one can restrict `μ` so that the weaker one-node condition becomes equivalent — see Hendon et al. 1996, Perea 2002. Not pursued in the book.)

- **Information set reached by `σ`** (Def 10.3): `H` is **reached** by `σ` if `P_{root,σ}(H) = Σ_{y∈H} P_{root,σ}(y) > 0`.

- **Bayesian updating at reached information sets** (Def 10.4): for every information set `H` and node `x ∈ H`, **if** `H` is reached by `σ`, then
  ```
  μ(x) = P_{root,σ}(x) / P_{root,σ}(H)
  ```
  - **Remark 10.1**: at an **unreached** information set (`P_{root,σ}(H) = 0`) the condition is **trivially satisfied** — the antecedent of the implication is false. So **any beliefs whatsoever are permitted off the equilibrium path.** This permissiveness is exactly what makes the notion "weak".

- **Weak sequential equilibrium** (Def 10.5): an assessment `(σ, μ)` satisfying **(1)** sequential rationality and **(2)** Bayesian updating at reached information sets.

- **Theorem 10.1**: if `(σ, μ)` is a weak sequential equilibrium then `σ` is a **Nash equilibrium**. And the inclusion is **strict** — some Nash equilibria are part of no weak sequential equilibrium.

- **Theorem 10.2**: every finite extensive-form game with cardinal payoffs has at least one weak sequential equilibrium (possibly in mixed strategies). A corollary of Ch 11's Remark 11.1 + Theorem 11.2.

- **The failure that names the chapter**: weak sequential equilibrium **does NOT refine subgame-perfect equilibrium**. The two sets merely overlap. Both directions fail:
  - A subgame-perfect equilibrium can be part of **no** weak sequential equilibrium (Fig 10.8 = Fig 6.12: `(b,f,d)`, since `d` is strictly dominated at Player 3's information set).
  - A weak sequential equilibrium's `σ` need **not** be subgame-perfect (Fig 10.9: `(b,(f,e),h)`, whose restriction `(e,h)` to the subgame at `t` is not a Nash equilibrium of that subgame — `h` is not a best reply to `e`).

## Key Concepts
- **System of beliefs `μ`** — beliefs about *past* moves, conditional on having reached the information set.
- **Reached vs. unreached information set** — the dividing line that decides whether `μ` is pinned down or free.
- **Strictly dominated as a choice** — the Ch 6 §6.3 notion that sequential rationality finally rules out.

## Reference Tables

The three concepts, and how they relate (Fig 10.10):

| Relation | Holds? | Witness when it fails |
|---|---|---|
| Subgame-perfect ⟹ Nash | **yes** | — |
| Weak sequential ⟹ Nash | **yes** (Thm 10.1) | — |
| Weak sequential ⟹ subgame-perfect | **NO** | Fig 10.9: `(b,(f,e),h)` |
| Subgame-perfect ⟹ part of some weak sequential | **NO** | Fig 10.8: `(b,f,d)` |
| Existence | **yes** (Thm 10.2) | — |

Requirements of an assessment:

| Requirement | What it constrains | Where it binds |
|---|---|---|
| Sequential rationality | `σ` given `μ` | **every** information set, reached or not |
| Bayesian updating | `μ` given `σ` | **only reached** information sets |

## Worked Example

**1 — Diagnosing a bad assessment (Fig 10.1).** Take
```
σ = (a:⅛, b:⅜, c:½ | f:1, g:0 ; d:¾, e:¼ | h:⅕, k:⅘)      μ = (x:⅔, y:⅓ ; w:½, z:½)
```

*Sequential rationality fails at Player 3's `{w,z}`.* Given `μ = (½,½)`, the planned mix `(h:⅕, k:⅘)` yields

```
½[⅕(3) + ⅘(1)] + ½[⅕(0) + ⅘(1)] = 11/10
```

but the **pure** strategy `h` yields `½(3) + ½(0) = 15/10`. Not optimal.

*Bayesian updating fails at Player 2's `{x,y}`.* Under `σ`, `P(x) = ⅛` and `P(y) = ⅜`, so

```
μ(x) must equal (⅛)/(⅛+⅜) = ¼        μ(y) must equal ¾
```

not `⅔, ⅓`. **The assessment fails both requirements independently** — always check them separately.

*A well-formed one*: with `σ = (a:⅑, b:5⁄9, c:⅓ | f:0, g:1 ; d:¾, e:¼ | h:1, k:0)`, Bayesian updating gives
```
P(x)=⅑, P(y)=5⁄9  ⟹  P({x,y})=6⁄9  ⟹  μ(x)=⅙, μ(y)=⅚
P(w)=(⅓)(¾)=9⁄36, P(z)=(⅓)(¼)=3⁄36  ⟹  P({w,z})=12⁄36  ⟹  μ(w)=¾, μ(z)=¼
```
so `μ = (x:⅙, y:⅚ ; w:¾, z:¼)` satisfies Bayesian updating at reached information sets.

**2 — Why one-node checking is not enough (Fig 10.2).** Player 2 has information sets `{s,t}` (choices `c`, `d`) and `{x,y}` (choices `e`, `f`). Take `σ = (a, (c,e))`, `μ = (s:1, t:0 ; x:0, y:1)`.

- At `{x,y}`: believing she is at `y`, `e` pays 1 and `f` pays 0 → **`e` is optimal**.
- At `{s,t}`: believing she is at `s`, and given her own planned `e` later, `c` pays 1 and `d` pays 0 → **`c` looks optimal**.

Yet `(c,e)` is **not sequentially rational at `{s,t}`**: switching to `(d,f)` pays **2**. She improves by changing her choice at `{s,t}` **and** her planned future choice at `{x,y}` together. (Consistently, `(a,(c,e))` isn't even a Nash equilibrium — Player 2's unique best reply to `a` is `(d,f)`.)

**3 — Enumerating all weak sequential equilibria of a small game (Fig 10.4).** Nature picks `a` (p = ¼) or `b` (p = ¾). Player 1 has nodes `s` (choices `A`/`B`) and `t` (choices `D`/`C`); `B` and `C` lead to Player 2's information set `{x,y}` with choices `E`/`F`. `S₁ = {(A,C), (B,D), (B,C), (A,D)}`. Work through Player 1's four pure strategies:

- **`(A,C)`**: `{x,y}` is reached, Bayesian updating forces `μ = (x:0, y:1)`, so Player 2 must play `E`. But against `E`, `A` is not sequentially rational at `s`. **No equilibrium.**
- **`(B,D)`**: `{x,y}` reached, updating forces `μ = (x:1, y:0)`, so Player 2 must play `F`. But against `F`, `B` is not sequentially rational at `s`. **No equilibrium.**
- **`(B,C)`**: `{x,y}` reached with probability 1, updating forces `μ = (x:¼, y:¾)`. Player 2's payoffs: `E` gives `¼(0)+¾(1) = ¾`; `F` gives `¼(3)+¾(0) = ¾`. **Indifferent**, so any `(E:p, F:1−p)` is sequentially rational. Now impose Player 1's conditions:
  ```
  at s:  B sequentially rational  ⟺  2p + 0(1−p) ≥ 1   ⟺   p ≥ ½
  at t:  C sequentially rational  ⟺  3p + 0(1−p) ≥ 2   ⟺   p ≥ ⅔
  ```
  → **an infinite family**: for every `p ∈ [⅔, 1]`, `σ = (A:0,B:1,C:1,D:0 | E:p,F:1−p)` with `μ = (x:¼, y:¾)`.
- **`(A,D)`**: `{x,y}` is **not reached** → by Remark 10.1 **any beliefs are allowed**. `A` and `D` are both sequentially rational iff `p ≤ ½`. Two sub-families:
  - `p = 0` (Player 2 plays `F`): `F` is sequentially rational iff `μ = (x:q, y:1−q)` satisfies `3q ≥ 1−q`, i.e. **`q ≥ ¼`**. → equilibria for every `q ∈ [¼, 1]`.
  - `0 < p ≤ ½` (Player 2 genuinely mixes): mixing requires indifference, which forces `μ = (x:¼, y:¾)`. → equilibria for every `p ∈ (0, ½]`.

Note the structure of the reasoning: **`σ` at reached information sets pins `μ` down; `μ` at unreached information sets is what you get to choose to support `σ`.**

**4 — The full search procedure on a large game (Figs 10.5 → 10.7).** Two moves worth copying:

*Step 1 — simplify by finding strictly dominant choices first.* At Player 2's `{w,z}`, `L` is strictly better than `R` at **both** nodes — `R` is strictly dominated **as a choice**. Since sequential rationality forces `L` regardless of beliefs, you may (1) remove the information set, (2) turn `w` and `z` into terminal nodes, (3) attach the payoffs from `L`. Repeat: Player 3's two singleton nodes collapse to the payoffs of `F` and `H`. The game shrinks from Fig 10.5 to Fig 10.7 with no loss.

*Step 2 — hypothesize and check for contradictions.* Nature moves `(r:⅕, s:⅕, t:⅗)`, so at any weak sequential equilibrium Bayesian updating gives Player 1 `μ = (r:⅕, s:⅕, t:⅗)`. Suppose Player 1 plays "play"; then `μ(x) = ¼, μ(y) = ¾`.

- *Hypothesis: Player 2 plays `e`.* Updating forces Player 3's `μ = (u:1, v:0)`, making `A` the only sequentially rational choice at `{u,v}`. But against `A`, Player 2 gets `¼(10) + ¾(2) = 16/4` from `d` versus `¼(3) + ¾(4) = 15/4` from `e`. So `e` is **not** sequentially rational — **contradiction**.
- *Hypothesis: Player 2 plays `d`.* Updating forces `μ = (u:½, v:½)`. Player 3: `A` gives `½(2)+½(4) = 3`, `B` gives `½(0)+½(5) = 2.5` → `A` is uniquely optimal. Then by the computation above `d` **is** sequentially rational for Player 2 ✓. Finally Player 1: "pass" pays 2, "play" pays `⅕(4) + ⅕(4) + ⅗(1) = 11/5 > 2` ✓.

Equilibrium found:
```
σ = (pass:0, play:1 | d:1, e:0 | A:1, B:0)      μ = (r:⅕, s:⅕, t:⅗ ; x:¼, y:¾ ; u:½, v:½)
```
Lift it back to the original game by re-adding the dominant choices and **arbitrary** beliefs at the unreached `{w,z}`:
```
σ = (pass:0, play:1, d:1, e:0, A:1, B:0, F:1, G:0, H:1, K:0, L:1, R:0)
μ = (r:⅕, s:⅕, t:⅗ ; x:¼, y:¾ ; u:½, v:½ ; w:p, z:1−p)      for any p ∈ [0,1]
```

**5 — The two failures, side by side.**

*Sequential rationality does real work (Fig 10.8 = Fig 6.12).* `(b, f, d)` is a Nash equilibrium and — since there are no proper subgames — **subgame-perfect**. But `d` is strictly dominated by `c` at both nodes of Player 3's information set, so **no** beliefs make `d` sequentially rational. `(b,f,d)` is part of no weak sequential equilibrium. **This is the Ch 6 pathology finally eliminated.**

*But subgame-perfection is not implied (Fig 10.9 = Fig 10.1).* The assessment `σ = (b, (f,e), h)` with `μ = (x:0, y:1 ; w:1, z:0)` **is** a weak sequential equilibrium — note `{w,z}` is not reached, so Bayesian updating permits `μ(w) = 1`. Yet `σ` is **not subgame-perfect**: restricted to the proper subgame starting at Player 2's node `t`, the profile is `(e, h)`, and `h` is not a best reply to `e`.

The culprit is precisely Remark 10.1's permissiveness: **unconstrained off-path beliefs let a player "justify" a choice that would be irrational inside a subgame.**

## Key Takeaways
1. **Move from strategy profiles to assessments.** You cannot evaluate a choice at an unreached information set without specifying beliefs there.
2. The two requirements are **independent and asymmetric**: sequential rationality binds at *every* information set; Bayesian updating binds only at *reached* ones.
3. **Off-path beliefs are completely free** in a weak sequential equilibrium (Remark 10.1). This is both the source of its tractability and the source of its failure.
4. Sequential rationality means **whole-strategy** optimality from `H` onward, not one-node optimality. Always test joint deviations at `H` and at your own later information sets.
5. To find weak sequential equilibria: **(a)** simplify by collapsing information sets with a strictly dominant choice; **(b)** enumerate candidate pure strategies; **(c)** for each, let Bayesian updating pin down beliefs at reached sets; **(d)** derive the opponents' sequentially rational responses; **(e)** look for a contradiction or a supporting inequality; **(f)** choose off-path beliefs freely to support what survives.
6. Indifference at an information set is what generates **infinite families** of equilibria — solve for the interval of mixing probabilities, don't stop at one.
7. **Weak sequential ⊆ Nash, strictly** (Thm 10.1). Existence is guaranteed (Thm 10.2).
8. **Weak sequential equilibrium neither implies nor is implied by subgame-perfect equilibrium.** Keep the Venn diagram in mind: three overlapping sets, both inclusions failing.
9. The diagnosis for the next chapter: what is missing is a **discipline on off-path beliefs**. That is exactly what sequential equilibrium (Ch 11) and perfect Bayesian equilibrium (Ch 12) supply.

## Connects To
- **Ch 6 §6.3**: the two pathologies that motivated this chapter; Fig 10.8 *is* Fig 6.12, and sequential rationality resolves the strictly-dominated-choice case.
- **Ch 8 §8.2**: Bayesian updating (Def 8.3) is imported verbatim, along with its `P(E) > 0` precondition — which is precisely why unreached information sets escape it.
- **Ch 8 §8.3**: AGM belief revision is the tool for the `P = 0` case, deployed in Ch 12.
- **Ch 11**: **sequential equilibrium** — constrains off-path beliefs via a topological limit condition; every sequential equilibrium is a weak sequential equilibrium (Remark 11.1) and existence is guaranteed (Thm 11.2), which is where Thm 10.2 comes from.
- **Ch 12**: **perfect Bayesian equilibrium** — the AGM-grounded alternative, free of topological conditions.
- **Kreps–Wilson (1982)**: the origin of assessments and sequential equilibrium.
