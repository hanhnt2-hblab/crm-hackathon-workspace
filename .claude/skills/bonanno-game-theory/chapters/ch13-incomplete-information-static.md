# Chapter 13: Incomplete Information — Static Games

## Core Idea
Incomplete information = at least one player **doesn't know what game she is playing**. Encode it as a knowledge-belief structure with a **different game at each state**, then apply the **Harsanyi transformation** — a chance move by Nature — to convert the situation into an ordinary imperfect-information game whose Nash equilibria are called **Bayesian Nash equilibria**.

## Frameworks Introduced

- **Complete vs. incomplete information ≠ perfect vs. imperfect information** — the distinction to get right first:
  - **Imperfect information**: some player may have to choose without knowing what others chose previously.
  - **Incomplete information**: some player **does not quite know what game she is playing** — the actions available, the possible outcomes, or (usually) the opponents' preferences are not common knowledge.
  - Illustration: in chess it is plausible that both players' preferences are common knowledge. In a contractual dispute, whether your opponent is the **"tough" type** (will sue) or the **"soft" type** (will drop it) may be unknown — that is incomplete information.

- **Reduction to uncertainty about preferences** (Harsanyi's argument): every situation can be reduced to the case where the uncertainty concerns only **payoffs**, everything else being common knowledge.
  - How: if Player 1 doesn't know whether Player 2 has only `{a,b}` or also `c`, model **two states in both of which Player 2 has all three choices**, but in one state `c` gives Player 2 an extremely low payoff — so she would never choose it.

- **The state-space representation**: reuse the Ch 8 interactive knowledge-belief structures, but **interpret the states as games** — assign a different game to each state. (Contrast Ch 9, where the game was fixed and the *choices* varied across states.)
  - **Designate the true state.** The book notes this "is something that is almost never done in the literature, but it is an important element of a description of a situation of incomplete information: what is the actual state of affairs?"
  - **Reading off common knowledge**: **anything that is constant across states is common knowledge.** Same payoffs everywhere → those payoffs are common knowledge; same belief numbers everywhere → those beliefs are common knowledge.

- **Remark 13.1 — knowing your preferences vs. knowing your payoff**: a rational player **must** know her ranking of outcomes; she need **not** know her payoff.
  - The example: you know you prefer a thoughtful gift (payoff 1) to an insulting gift (payoff −1) — your *preferences* are known. But you may be uncertain about the gift-giver's intentions, hence uncertain **which payoff will result** from accepting. *You know your payoff function but not your payoff.*

- **The Harsanyi transformation**: convert an incomplete-information situation into an extensive game with imperfect information:
  1. Start with a **chance move where Nature chooses the state**.
  2. Inform the **informed** player(s) of Nature's choice.
  3. The uninformed player chooses **without** being informed of Nature's choice (capturing uncertainty about the game) **and without** being informed of the other's choice (capturing simultaneity).
  - **Nature's probabilities**: for **one-sided** incomplete information, use the **uninformed player's beliefs**. For **two-sided / multi-sided**, you must use a **common prior** (Ch 8 Def 8.10) — neither player's own beliefs will do.
  - **Loss of information**: the resulting game **can no longer tell you what the true state is** — i.e. what game is actually being played.
  - **Existence caveat**: if no common prior exists (Exercise 13.6), **the Harsanyi transformation cannot be carried out at all.**

- **Bayesian Nash equilibrium**: a Nash equilibrium of the game produced by the Harsanyi transformation. *"These are nothing more than Nash equilibria: the extra term `Bayesian' is merely a hint that the game being solved is meant to represent a situation of incomplete information."*
  - **Two warnings about interpretation**:
    1. A Bayesian Nash equilibrium **does not imply that the players play a Nash equilibrium in the actual (true) game.**
    2. The informed player's strategy is a *pair* of choices, one per type — but she **knows** her type. So the strategy is best understood not as her contingent plan but as a **complex object combining (1) her actual choice in the game she knows she is playing and (2) a belief in the uninformed player's mind about what she would do in each possible game.** (Compare Ch 9 §9.3.)

- **The practical solution method — use weak sequential equilibrium.** *"An alternative (and easier) way to find the Bayesian Nash equilibria."* Recipe:
  1. Posit the informed player's strategy.
  2. Use **Bayesian updating** to pin the uninformed player's beliefs at her information set.
  3. Check **sequential rationality** for the uninformed player given those beliefs.
  4. Check sequential rationality for the informed player at each of her nodes.
  5. By Theorem 10.1, a weak sequential equilibrium's `σ` is a Nash equilibrium.
  - This scales to **infinite strategy sets**, where you cannot even draw the tree — take first-order conditions instead.

- **Pooling vs. separating equilibrium** (Def 13.1): in a game of one-sided incomplete information, a pure-strategy Bayesian Nash equilibrium is
  - **pooling** if the informed player makes the **same** choice at every singleton node;
  - **separating** if she makes **different** choices at different nodes.

- **Remark 13.2**: one-sided incomplete information can involve **any** number of players, as long as **exactly one** is uncertain about the game.

- **Remark 13.3 — the open conceptual problem**: beyond the usual worries about Nash equilibrium, Bayesian Nash equilibrium raises the further question of **how one should understand or justify the notion of a common prior**. Not trivial, and debated in the literature (Bonanno–Nehring 1999, Gul 1998, Morris 1995).

## Key Concepts
- **One-sided / two-sided / multi-sided incomplete information** — exactly one uncertain player / both uncertain / two or more uncertain among `n ≥ 3`.
- **Type** — a label for which game (which payoff function) the informed player has.
- **Two-sided without objective uncertainty** — a player may be uncertain **only about the other player's beliefs**, not about any objective feature of the game. That still counts as two-sided.
- **Common prior** — a distribution over states that reproduces every player's beliefs upon conditioning on their own information cell (Ch 8 Def 8.10).

## Reference Tables

The two "in-" distinctions:

| | What is unknown | Machinery |
|---|---|---|
| **Imperfect** information | earlier **moves** | information sets (Ch 3) |
| **Incomplete** information | the **game itself** | states carrying different games (this chapter) |

Nature's probabilities in the Harsanyi transformation:

| Situation | Use |
|---|---|
| One-sided | the **uninformed player's beliefs** |
| Two-sided / multi-sided | a **common prior** — required; the transformation fails without one |

## Worked Example

**1 — One-sided incomplete information, from verbal description to equilibrium (Figs 13.1–13.5).** The "true" game (Player 1 is **type b**):

| P1 \ P2 | L | R |
|---|---|---|
| **T** | 6, 3 | 0, 9 |
| **B** | 3, 3 | 3, 0 |

The alternative game Player 2 also considers possible (Player 1 is **type a**):

| P1 \ P2 | L | R |
|---|---|---|
| **T** | 0, 3 | 3, 9 |
| **B** | 3, 3 | 0, 0 |

Player 2 assigns `⅔` to type `a` and `⅓` to type `b`; Player 2's beliefs are common knowledge; it is common knowledge that Player 1 knows the game. The structure:

```
state:          α  (type a game)          β  (type b game)  ← TRUE STATE
Player 1:       {α}                       {β}
Player 2:       {α, β}  with (⅔, ⅓)
```

Everything constant across states is common knowledge: **Player 2's payoffs**, **Player 2's beliefs `(⅔, ⅓)`**, and **the fact that Player 1 knows which game is being played**. At the true state `β`, Player 1 knows strictly more than Player 2.

*Harsanyi transformation*: Nature picks `α` (⅔) or `β` (⅓); Player 1 is informed and chooses `T`/`B`; Player 2 chooses `L`/`R` uninformed of both. Strategic form (expected payoffs):

| Player 1's strategy (type a, type b) | L | R |
|---|---|---|
| **(T, T)** | 2, 3 | 2, 9 |
| **(T, B)** | 1, 3 | **3, 6** |
| **(B, T)** | **4, 3** | 0, 3 |
| **(B, B)** | 3, 3 | 1, 0 |

Two pure-strategy Bayesian Nash equilibria: **`((T,B), R)`** and **`((B,T), L)`**. Both are **separating** — there are **no pooling equilibria** here.

*Verifying `((B,T), L)` the easy way (weak sequential equilibrium).* If Player 1 plays `(B,T)`, Bayesian updating gives Player 2 probability `⅔` on the second node from the left and `⅓` on the third. Then

```
L:  ⅔(3) + ⅓(3) = 3          R:  ⅔(0) + ⅓(9) = 3
```

Player 2 is **indifferent**, so any strategy — in particular `L` — is sequentially rational. Given `L`: at her left node Player 1 gets 0 from `T` and 3 from `B` → `B` ✓; at her right node she gets 6 from `T` and 3 from `B` → `T` ✓. Weak sequential equilibrium, hence Nash (Thm 10.1).

*The interpretive sting.* At the true state `β` under `((T,B), R)`, the **actual** play is `(B, R)` — which is **not** a Nash equilibrium of the true game (`B` is a best reply to `R`, but `R` is not a best reply to `B`). Unsurprising: Player 1 knows she's in that game, Player 2 gives it only probability `⅓`.

**2 — Cournot with incomplete information about the rival's cost (Figs 13.6–13.7).** Inverse demand `P(Q) = 34 − Q`. `C₁(q₁) = 6q₁` is common knowledge. Firm 2's true cost is `C₂(q₂) = 9q₂` (high), but **Firm 1** believes `9q₂` with probability `⅓` and `3q₂` (low) with probability `⅔`.

*Complete-information benchmark* (Firm 2's cost `9q₂` common knowledge):

```
∂π₁/∂q₁ = 34 − 2q₁ − q₂ − 6 = 0
∂π₂/∂q₂ = 34 − q₁ − 2q₂ − 9 = 0
→  q₁ = 31/3 ≈ 10.33,   q₂ = 22/3 ≈ 7.33
```

*Incomplete information.* The tree cannot be drawn (infinite strategy sets), so use weak sequential equilibrium directly. `q̂₂ᴴ` maximizes `(34 − q̂₁ − q₂ᴴ)q₂ᴴ − 9q₂ᴴ`; `q̂₂ᴸ` maximizes `(34 − q̂₁ − q₂ᴸ)q₂ᴸ − 3q₂ᴸ`; and — by Bayesian updating giving Firm 1 probability `⅓` on the high-cost node and `⅔` on the low-cost node — `q̂₁` maximizes

```
⅓[(34 − q₁ − q̂₂ᴴ)q₁ − 6q₁] + ⅔[(34 − q₁ − q̂₂ᴸ)q₁ − 6q₁]
```

The three first-order conditions have a **unique** solution:

```
q̂₁ = 9,     q̂₂ᴴ = 8,     q̂₂ᴸ = 11
```

Since the true state is high cost, the **actual** outputs are `q₁ = 9` and `q₂ = 8`. Compared with complete information: **Firm 2 produces more (8 > 7.33) and Firm 1 produces less (9 < 10.33).** Firm 1's mistaken belief that the rival is probably low-cost makes it retreat.

**3 — Two-sided incomplete information: constructing the common prior (Figs 13.8–13.9).** Three states `α, β, γ`, with game `G` at `β` and `γ` and game `G′` at `α`. True state `γ`. Partitions:

```
Player 1:  {α, β} with (½, ½)   |   {γ}
Player 2:  {β, γ} with (⅓ on β, ⅔ on γ)?  — see below   |   {α}
```

At `γ` **both** players know they're playing `G`, Player 1 knows Player 2 knows it, but **Player 2 is uncertain whether Player 1 knows** — she puts `⅔` on Player 1 knowing (state `γ`) and `⅓` on Player 1 being uncertain (state `β`). *Neither player is uncertain about any objective feature of the game; Player 2 is uncertain only about Player 1's beliefs.* That is still two-sided.

The two players assign **different** probabilities to `β` (`½` by Player 1, `⅓` by Player 2), so neither can supply Nature's probabilities. Solve for a common prior `ν` on `{α, β, γ}`:

```
ν(β) / (ν(α) + ν(β)) = ½            [Player 1's cell {α,β}]
ν(γ) / (ν(β) + ν(γ)) = ⅔            [Player 2's cell {β,γ}]
ν(α) + ν(β) + ν(γ) = 1
→   ν(γ) = 2/4,   ν(α) = ν(β) = ¼
```

Now the Harsanyi transformation is legitimate. Verify the pure-strategy profile — Player 1 plays `A` if the state is `α` and `B` if the state is `β` or `γ`; Player 2 plays `C` at her left information set and `D` at her right — as a weak sequential equilibrium with beliefs from Bayesian updating (every information set is reached):

```
μ = (s:½, t:½ ; u:⅔, v:0, w:⅓, x:0, y:0, z:1)
```

- **Player 1**, left singleton: given `C`, `A` pays 1 and `B` pays 0 → `A` ✓.
- **Player 1**, right information set: given `(½,½)` and `CD`, `A` pays `½(1)+½(0) = ½`, `B` pays `½(0)+½(3) = 3⁄2` → `B` ✓.
- **Player 2**, left information set: given `(⅔,⅓)`, `C` pays `⅔(3)+⅓(0) = 2`, `D` pays `⅔(1)+⅓(1) = 1` → `C` ✓.
- **Player 2**, right information set: `C` pays 0, `D` pays 1 → `D` ✓.

**Bayesian Nash equilibrium confirmed.**

**4 — Multi-sided, three players (Figs 13.10–13.12).** Four states carrying games `G₁`/`G₂`, true state `α`. At `α`: all three know the game is `G₁`; Player 1 knows that 2 and 3 know it; **Player 2 knows 3 knows it but is uncertain whether 1 knows** (probability `⅔` that 1 is uncertain); **Player 3 knows 1 knows it but is uncertain whether 2 knows** (probability `⅖` that 2 is uncertain); Players 1's and 3's payoffs are common knowledge.

The beliefs are mutually compatible — a common prior exists:

```
ν = (3/17, 6/17, 6/17, 2/17)
```

so the Harsanyi transformation goes through, giving a four-branch imperfect-information game. (Finding its Bayesian Nash equilibria is Exercise 13.7.)

## Key Takeaways
1. **Incomplete ≠ imperfect.** Imperfect = you don't know past moves; incomplete = you don't know the game.
2. Reduce all incomplete information to **uncertainty about payoffs** (Harsanyi): a missing action becomes an available action with a terrible payoff.
3. **States carry games.** Then read common knowledge off the structure: whatever is constant across all states is common knowledge, for free.
4. **Always designate the true state.** Otherwise your model does not say what is actually the case — and the Harsanyi transformation destroys that information.
5. **Know your preferences, not your payoff** (Remark 13.1). Uncertainty about your own payoff is fully rational; uncertainty about your own ranking of outcomes is not.
6. Nature's probabilities are the **uninformed player's beliefs** in the one-sided case and a **common prior** otherwise. **No common prior ⟹ no Harsanyi transformation.** Check for existence by solving the conditional-ratio system (Ch 8 §8.4).
7. **Solve via weak sequential equilibrium, not by building the strategic form.** Posit the informed player's strategy → Bayesian-update the uninformed player's beliefs → check sequential rationality both ways. It is faster, and it is the only route when strategy sets are infinite.
8. **A Bayesian Nash equilibrium need not induce a Nash equilibrium in the true game.** Do not read equilibrium play in the actual game off the Bayesian Nash equilibrium.
9. The informed player's "strategy" is **her actual choice plus the uninformed player's conjecture** about what she'd do otherwise — not a plan she formulates. Same interpretive problem as Ch 9 §9.3.
10. Classify pure-strategy equilibria as **pooling** or **separating**; it is the first question to ask about any one-sided model.
11. **The common prior assumption is a genuine open problem**, not a technical convenience (Remark 13.3).

## Connects To
- **Ch 8 §8.4**: Harsanyi consistency and common priors — written specifically for this chapter; the equation-solving method for finding a common prior is used verbatim.
- **Ch 7**: the knowledge partitions and the "constant across states ⟹ common knowledge" reading.
- **Ch 9**: the same states-and-partitions apparatus, but with states interpreted as *choices* rather than *games*; and §9.3's problem with what a strategy means recurs here.
- **Ch 5 / Ch 6**: cardinal payoffs and expected payoffs in the strategic form of a game with chance moves.
- **Ch 10**: weak sequential equilibrium and Theorem 10.1 — the practical solution tool of this chapter.
- **Ch 14**: incomplete information in **dynamic** games, where perfect Bayesian equilibrium replaces Bayesian Nash equilibrium, and where Selten's chain-store reputation argument finally works.
- **Ch 15**: the **type-space** approach, and the equivalence with this state-space treatment.
- **Ch 1 §1.7**: the complete-information Cournot model that §13.2's example perturbs.
