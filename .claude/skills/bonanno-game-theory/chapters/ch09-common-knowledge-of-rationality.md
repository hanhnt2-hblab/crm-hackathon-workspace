# Chapter 9: Common Knowledge of Rationality

## Core Idea
A game is only a **partial** description of an interactive situation. Add a knowledge-belief structure plus a strategy assignment and you get a **model**, in which "rational" becomes checkable state by state. The payoff: common knowledge of rationality ⟺ **survives IDSDS** — and, notably, **it does not imply Nash equilibrium**.

## Frameworks Introduced

- **The epistemic foundation program**: identify, for every game, the strategies that might be chosen by rational and intelligent players who know the structure of the game and their opponents' preferences and who **recognize each other's rationality**. Two questions: (1) when is a player rational? (2) what does mutual recognition of rationality mean? Answer to (2): **common knowledge of rationality**.
  - The author's caveat (footnote 17): **common *belief* of rationality is the more appealing notion**, because knowledge is veridical and belief allows mistakes. Knowledge is used only to simplify exposition.

- **Model of a game** (Def 9.1): an interactive knowledge-belief structure (states `W`, partitions `ℐᵢ`, a probability distribution `P_{i,w}` on each information set) **together with** functions `σᵢ: W → Sᵢ` assigning to each state a **pure** strategy of Player `i`.
  - Reading: `sᵢ = σᵢ(w)` means "at `w`, Player `i` plays `sᵢ`".
  - **Restriction**: a player always knows what strategy she has chosen — `σᵢ` is **constant on each information set of Player `i`**.
  - What the model adds: a game says who the players are, what they can do, and how they rank outcomes. A model adds **what each player actually does** and **what she believes others will do**. Only then can a choice be judged rational or irrational.

- **Rationality at a state** (Def 9.2): Player `i` is **rational at `w`** if no pure strategy yields a higher expected payoff than `σᵢ(w)`, given her beliefs:
  ```
  Σ_{w′∈ℐᵢ(w)} P_{i,w}(w′) · πᵢ(σᵢ(w), σ₋ᵢ(w′))  ≥  Σ_{w′∈ℐᵢ(w)} P_{i,w}(w′) · πᵢ(sᵢ, σ₋ᵢ(w′))    for all sᵢ ∈ Sᵢ
  ```
  - `σ₋ᵢ(w) = (σ₁(w),…,σ_{i−1}(w), σ_{i+1}(w),…,σₙ(w))` — what the others do at `w`.
  - **How to check**: at each state, read the opponents' strategies off the states in the information set, weight by the beliefs, and compare the chosen strategy's expected payoff against every alternative.

- **Rationality as an event**: `Rᵢ` = the set of states where Player `i` is rational; `R = R₁ ∩ … ∩ Rₙ`. Now apply `Kᵢ` and `CK` from Ch 7 to these events.

- **Remark 1 — two structural facts**:
  - `KᵢRᵢ = Rᵢ` — **every player is rational iff she knows it.** (Consequence of `σᵢ` and `P_{i,w}` being constant on her information sets: she knows her own choice and her own beliefs.)
  - `CKR ⊆ R` — if rationality is common knowledge, everyone really is rational (the Truth property of `CK`).
  - **The converse `R ⊆ CKR` is FALSE**: all players can be rational at a state without that being common knowledge.

- **Theorem 9.1** (soundness): for any model of a finite cardinal game `G` and any state `w`, if `w ∈ CKR` then the pure-strategy profile at `w` **survives the cardinal iterated deletion of strictly dominated strategies** (Def 5.6).

- **Theorem 9.2** (completeness): if `s ∈ S` survives cardinal IDSDS, then there **exists** a model of `G` and a state `w` with `w ∈ CKR` whose strategy profile is `s`.
  - Together, 9.1 + 9.2 are the exact characterization promised in Ch 1 §1.5 and Ch 5 Remark 5.5. A corresponding characterization holds for **ordinal** games (Bonanno 2015).

- **The headline consequence**: **common knowledge of rationality does NOT imply that players play a Nash equilibrium.** In the running example none of the four CKR-compatible profiles is a Nash equilibrium.
  - The one-way relation that *does* hold: a **pure-strategy Nash equilibrium always survives IDSDS**, so pure Nash equilibria (when they exist) are always *compatible* with CKR.

- **Why models of dynamic games are conceptually hard** (§9.3): in a simultaneous game, `σᵢ(w) = sᵢ` describes Player `i`'s **actual behavior**. In a dynamic game it cannot. If `σ₁(w) = (d₁, a₃)` and Player 1 in fact plays `d₁`, he knows he will never move again — so what does it mean to "choose" `a₃` at a node his own decision has made unreachable?
  - The honest paraphrase: *"Player 1 chooses `d₁` and if — contrary to this plan — he were to play `a₁` and Player 2 were to follow with `a₂`, then Player 1 would play `a₃`."* So the strategy describes **actual and counterfactual** behavior at once.
  - Methodological objection: if the counterfactual is necessary, **model it explicitly** rather than smuggling it into a strategy.
  - Reinterpretation: perhaps a strategy has **two components** — (1) a description of Player 1's behavior and (2) a **conjecture in Player 2's mind** about what Player 1 would do. Objection again: better to disentangle and model both explicitly.
  - **Three approaches in the literature**:
    1. Models of the associated **strategic form** (most common; suffers the above).
    2. **Dispense with strategies**: describe states by actual behavior, and model conjectures via structures that encode not only initial beliefs but **dispositions to revise** them under various hypotheses (Perea 2012).
    3. **Dynamic models with explicit time**: behavioral, no strategies, only the players' **actual beliefs at the time of choice** — beliefs are *temporal* rather than *conditional*, and rationality is defined over actual choices rather than hypothetical plans (Bonanno 2014).

## Key Concepts
- **Model** — game + knowledge-belief structure + strategy assignment; the object in which "rational" is evaluable.
- **`Rᵢ` / `R` / `CKR`** — rationality of `i`, of everyone, and common knowledge thereof, all as events.
- **Common belief of rationality** — the weaker, more appealing variant that tolerates mistaken beliefs (Battigalli–Bonanno 1999).
- **Temporal vs. conditional beliefs** — actual beliefs held at the moment of choice, vs. beliefs contingent on hypotheses.

## Reference Tables

The running game (Fig 9.1 / 9.2):

| P1 \ P2 | L | C | R |
|---|---|---|---|
| **T** | 4, 6 | 3, 2 | 8, 0 |
| **M** | 0, 9 | 0, 0 | 4, 12 |
| **B** | 8, 3 | 2, 4 | 0, 0 |

**No pure-strategy Nash equilibrium.** Cardinal IDSDS output: `{(T,L), (T,C), (B,L), (B,C)}`.

## Worked Example

**Building a model and auditing rationality state by state (Fig 9.1).** Four states `α, β, γ, δ`:

```
Player 1's partition:  {α, β} beliefs (½, ½)   |   {γ, δ} beliefs (0, 1)
Player 2's partition:  {α}                     |   {β, γ} beliefs (⅔, ⅓)   |   {δ}

σ₁:   α↦B    β↦B    γ↦M    δ↦M
σ₂:   α↦C    β↦L    γ↦L    δ↦R
```

**What state `β` says**: Player 1 plays `B`, Player 2 plays `L`. Player 1 cannot tell `α` from `β`, so he is unsure whether Player 2 chose `C` or `L`, at ½ each. Player 2 cannot tell `β` from `γ`, so she is unsure whether Player 1 chose `B` or `M`, at ⅔ / ⅓.

**Is Player 1 rational at `β`?** His beliefs put ½ on Player 2 playing `C` and ½ on `L`:

```
B:  ½·π₁(B,C) + ½·π₁(B,L) = ½(2) + ½(8) = 5      ← chosen
M:  ½·π₁(M,C) + ½·π₁(M,L) = ½(0) + ½(0) = 0
T:  ½·π₁(T,C) + ½·π₁(T,L) = ½(3) + ½(4) = 3.5
```

`B` is optimal → **Player 1 is rational at `β`**, and since his choice and beliefs are identical at `α`, also at `α`.

**Is Player 2 rational at `β`?** Her beliefs put ⅔ on `B`, ⅓ on `M`:

```
L:  ⅔·π₂(B,L) + ⅓·π₂(M,L) = ⅔(3) + ⅓(9) = 5      ← chosen
C:  ⅔·π₂(B,C) + ⅓·π₂(M,C) = ⅔(4) + ⅓(0) = 8/3 ≈ 2.67
R:  ⅔·π₂(B,R) + ⅓·π₂(M,R) = ⅔(0) + ⅓(12) = 4
```

`L` is optimal → rational. Checking `α` (singleton: certain of `B`, plays `C`; against `B`, `C` pays 4 vs. `L`'s 3 and `R`'s 0 ✓) and `δ` (singleton: certain of `M`, plays `R`; against `M`, `R` pays 12 vs. 9 and 0 ✓):

```
R₂ = {α, β, γ, δ} = W       — Player 2 is rational everywhere
```

**Where Player 1 fails.** At `γ` and `δ` his information set is `{γ, δ}` with beliefs `(0, 1)` — he is **certain** the state is `δ`, where Player 2 plays `R`. He plays `M`. Against `R`: `T` pays 8, `M` pays 4, `B` pays 0. The unique best response to `R` is `T`, so `M` is not optimal:

```
R₁ = {α, β}          R = R₁ ∩ R₂ = {α, β}
```

**Is rationality common knowledge at `β`?** Build the common knowledge partition by merging overlapping information sets across players: `{α,β}` meets `{β,γ}` at `β`; `{β,γ}` meets `{γ,δ}` at `γ`. So

```
ℐ_CK = { {α, β, γ, δ} } = {W}      ⟹      CKR = ∅   (since R = {α,β} ⊊ W)
```

**At `β` both players are rational, yet this is not common knowledge.** This is the concrete witness that `R ⊆ CKR` fails.

**Applying Theorem 9.1 to the same game.** Run cardinal IDSDS:

1. For Player 1, `M` is strictly dominated by any mixed strategy `(T: p, B: 1−p)` with `p > ½`. Check against each column: vs `L`, `4p + 8(1−p) = 8 − 4p > 0` ✓; vs `C`, `3p + 2(1−p) = 2 + p > 0` ✓; vs `R`, `8p > 4` **iff `p > ½`**. Delete `M`.
2. With `M` gone, `R` gives Player 2 `(0, 0)` against `(T, B)`, while `L` gives `(6, 3)` and `C` gives `(2, 4)`. `R` is strictly dominated by **either**. Delete `R`.
3. In the remaining `{T,B} × {L,C}` block nothing is dominated (`T`→(4,3) vs `B`→(8,2) for Player 1; `L`→(6,3) vs `C`→(2,4) for Player 2). **Stop.**

Output: `{(T,L), (T,C), (B,L), (B,C)}`. By Thm 9.1 these are the **only** profiles playable under common knowledge of rationality; by Thm 9.2 **each** of them actually is playable in some CKR model.

**And none of them is a Nash equilibrium.** Underline to confirm: column maxima for Player 1 are `B` (L), `T` (C), `T` (R); row maxima for Player 2 are `L` (T), `R` (M), `C` (B). No cell has both. So common knowledge of rationality is strictly weaker than Nash equilibrium — a fact easy to state and easy to forget.

**Why the same model won't work for a dynamic game (Fig 9.3).** In the perfect-information game where Player 1 chooses `a₁/d₁`, then Player 2 `a₂/d₂`, then Player 1 `a₃/d₃`, take a state with `σ₁(w) = (d₁, a₃)`. The `d₁` component describes what Player 1 *does*. The `a₃` component describes what he would do at a node his own choice of `d₁` guarantees is never reached. It is not a choice at all — it is either a **counterfactual** or **Player 2's conjecture**, and the methodological complaint is that a strategy silently conflates them.

## Key Takeaways
1. **A game underdetermines behavior.** You cannot call a choice rational until you have specified beliefs — that is what a model supplies.
2. Rationality is **state-relative and belief-relative**: the same strategy is rational at one state and irrational at another purely because the beliefs differ (Player 1 plays `M` at `γ`/`δ` and is irrational; the problem is his certainty, not his strategy set).
3. Treat rationality as an **event** and the whole Ch 7 apparatus applies unchanged.
4. `KᵢRᵢ = Rᵢ`: a player is rational iff she knows she is. There is no "accidentally rational".
5. `CKR ⊆ R` but `R ⊄ CKR`. **Everyone being rational is much weaker than everyone commonly knowing it** — build the CK partition to tell the two apart.
6. **CKR ⟺ surviving IDSDS** (Thms 9.1 + 9.2, both directions). This is the theorem the earlier chapters kept promising.
7. **Common knowledge of rationality does not imply Nash equilibrium.** The converse-ish fact is all you get: pure Nash equilibria always survive IDSDS, so they are always CKR-compatible.
8. Prefer **common belief** of rationality when you can afford it; knowledge is a simplification that forbids the mistakes real players make.
9. In **dynamic** games, "choosing a strategy" is not a coherent description of behavior. Any serious epistemic treatment must either model counterfactuals explicitly, model belief-revision dispositions, or drop strategies for explicit time.

## Connects To
- **Ch 1 §1.5**: the claim that IDSDS output = profiles compatible with common belief of rationality, asserted there and proved here.
- **Ch 5 §5.4**: cardinal IDSDS (Def 5.6), rationalizability, Remark 5.5's "belief = opponent's mixed strategy" identity, and Thm 5.3 (extended to `n` players in Appendix 9.A).
- **Ch 7**: partitions, `Kᵢ`, `CK`, the Truth property, and the reachability construction used to compute `CKR`.
- **Ch 8**: the probability distributions on information sets that make expected-payoff comparisons possible.
- **Ch 10–12**: §9.3's problem — what a strategy *means* at an unreached information set — is the same problem sequential rationality and perfect Bayesian equilibrium attack from the equilibrium side.
- **Battigalli–Bonanno (1999)**, **Perea (2012)**, **Bonanno (2014, 2015)**: the pointers the chapter gives for common belief, belief-revision models, and temporal models.
