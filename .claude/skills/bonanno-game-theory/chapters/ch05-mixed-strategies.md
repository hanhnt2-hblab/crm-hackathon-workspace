# Chapter 5: Mixed Strategies in Strategic-Form Games

## Core Idea
Allow players to randomize and **every finite game has a Nash equilibrium** (Nash, 1951). But the logic inverts: at a mixed-strategy equilibrium a player is **indifferent** among the strategies she randomizes over — *the only purpose of randomizing is to make the other player indifferent.*

## Frameworks Introduced

- **Game-frame in strategic form, generalized** (Def 5.1): `⟨I, (Sᵢ)ᵢ∈I, O, f⟩` where now `f: S → ℒ(O)` maps each strategy profile to a **lottery** over basic outcomes. If every `f(s)` is degenerate you are back to Def 1.1.

- **Game in strategic form with cardinal payoffs** (Def 5.2): a Def-5.1 frame plus, for each player, a **von Neumann-Morgenstern ranking** `≽ᵢ` of `ℒ(O)`. Representing each by `Uᵢ` and setting `πᵢ(s) = E[Uᵢ(f(s))]` gives the **reduced-form game with cardinal payoffs**; `πᵢ` is the **vNM payoff function**.

- **Mixed strategy** (Def 5.3): a probability distribution over the (finite) set of **pure** strategies `Sᵢ`. The set is `Δᵢ`.
  - **Traditional interpretation**: objective randomization — the player delegates the choice to a random device. `($100: ⅓, $200: ⅔)` = roll a die, bid $100 on 1–2 and $200 on 3–6.
  - **Alternative interpretation** (deferred to Ch 9): a mixed strategy of Player 2 is a **belief in Player 1's mind** about what Player 2 will do.
  - **Remark 5.1**: degenerate mixed strategies are pure strategies, so `Sᵢ ⊆ Δᵢ`.

- **Mixed-strategy extension** (Def 5.4): the game `⟨I, (Δ₁,…,Δₙ), (Π₁,…,Πₙ)⟩` with `Πᵢ(σ) = Σ_{s∈S} σ(s)·πᵢ(s)`, where `σ(s) = ∏ᵢ σᵢ(sᵢ)` — the product, because players use **independent** random devices.

- **Nash equilibrium in mixed strategies** (Def 5.5): a Nash equilibrium of the mixed-strategy extension.
  - **Remark 5.2**: every pure-strategy Nash equilibrium is also a mixed-strategy Nash equilibrium; the mixed set **includes** the pure set.

- **Theorem 5.1 [Nash, 1951]**: every finite reduced-form strategic-form game with cardinal payoffs has **at least one** Nash equilibrium in mixed strategies. (Proof omitted — requires fixed-point theorems.)
  - This is what repairs the Ch 1 gap (Matching Pennies) and the Ch 3 gap (Remark 3.2: games with no subgame-perfect equilibrium).

- **Theorem 5.2 (the equalization / indifference theorem)** — the workhorse for computation. If `σ*` is a mixed-strategy Nash equilibrium and `sᵢʲ, sᵢᵏ` are two pure strategies with `σᵢ*(sᵢʲ) > 0` and `σᵢ*(sᵢᵏ) > 0`, then
  ```
  πᵢ(sᵢʲ, σ*₋ᵢ) = πᵢ(sᵢᵏ, σ*₋ᵢ) = πᵢ*
  ```
  - **How to use it**: set the payoffs of the pure strategies in the support equal to each other and solve for the opponent's probabilities.
  - **Proof idea**: if one gave strictly more, shift all of the other's probability onto it and the payoff strictly rises — contradicting equilibrium.
  - **Status: necessary but NOT sufficient.** See the worked example below.

- **Remark 5.4 (the counter-intuitive core)**: at a mixed-strategy equilibrium a player has **no incentive** to use her mixed strategy — she would get the same payoff playing any pure strategy in her **support** with probability 1. *"The only purpose of randomizing is to make the other player indifferent among two or more of his own pure strategies."*

- **The best-reply-function method** — what to use when equalization is not enough:
  1. Plot each of Player 1's pure-strategy payoffs as a function of `q` (the opponent's mixing probability) on `[0,1]`.
  2. The **upper envelope** of those lines gives the best reply; the intervals and the intersection points define the **best reply function** (a correspondence: at an intersection, any mixture of the tied strategies is a best reply).
  3. Read off which supports are candidates, then impose the opponent's indifference to pin the remaining probability.

- **Theorem 5.3 [Pearce, 1984]**: in a **two-player** cardinal game, a pure strategy `sᵢ` is a best response to **no** mixed strategy of the opponent **if and only if** `sᵢ` is strictly dominated by a **mixed** strategy of Player `i`.
  - Why it matters: a strategy can survive pure-strategy dominance and still be unplayable. Strict dominance by a pure strategy is the sub-case (since pure ⊆ mixed).
  - For 3+ players the generalization "raises some subtle issues" (Exercise 5.14) — see Remark 5.5.

- **Cardinal IDSDS and rationalizability** (Def 5.6): iteratively delete, for every player, the pure strategies strictly dominated **by some mixed strategy** of that player, until nothing is deletable. The surviving pure strategies of Player `i` are her **rationalizable strategies**.
  - **Remark 5.3**: to find mixed-strategy Nash equilibria, run the deletion first, solve the smaller game, then assign probability 0 to everything deleted. Cardinal IDSDS permits **more** deletions than ordinal IDSDS.

- **Remark 5.5 (the epistemic reading)**: define a player as **rational** if her chosen pure strategy is a best reply to her belief about the opponent. In a **two-player** game a belief about Player 2 *is the same object* as a mixed strategy of Player 2 — so by Thm 5.3 a rational player never plays a mixed-dominated strategy. Iterating gives **common belief of rationality**, whose output is exactly the rationalizable profiles (proved in Ch 9).
  - **With 3+ players this breaks**: a belief can allow **correlation** among the opponents' behavior, while a mixed-strategy *profile* rules correlation out.

- **Remark 5.6 (the assumption to always surface)**: this iterated reasoning requires the players' **vNM preferences to be common knowledge**. If Player 2 knows only Player 1's *ordinal* ranking, he cannot deduce that a mixed-dominated strategy is irrational for her. The author's verdict: *"Expecting a player to know the von Neumann-Morgenstern preferences of another player is often (almost always?) very unrealistic!"*

## Key Concepts
- **Pure strategy** — the `Sᵢ` of Ch 1, renamed once mixing is allowed.
- **Support** of a mixed strategy — the set of pure strategies assigned **positive** probability.
- **`σᵢ(sᵢ)`** — the probability `σᵢ` assigns to `sᵢ`. **`σ(s) = ∏ᵢ σᵢ(sᵢ)`**.
- **Rationalizable strategy** — a pure strategy surviving cardinal IDSDS.
- **First-price auction** — high bidder wins and pays **her own** bid (contrast the second-price auction of Ch 1.3).

## Reference Tables

The first-price auction (Example 5.1 → Table 5.3, payoffs ×10). `U₁: o₁=4, o₂=1, o₃=1, o₄=2` (prefers winning, prefers paying less, indifferent about how much the other pays); `U₂: o₁=1, o₂=6, o₃=4, o₄=5` (somewhat spiteful):

| P1 \ P2 | bid $100 | bid $200 |
|---|---|---|
| **bid $100** | 25, 35 | 10, 40 |
| **bid $200** | 20, 50 | 15, 45 |

**No pure-strategy Nash equilibrium** — yet `σ* = ((½,½), (½,½))` is a mixed-strategy equilibrium.

## Worked Example

**1 — Verifying a mixed equilibrium, and seeing the indifference (Table 5.3).** Take `σ₂* = ($100: ½, $200: ½)` and let Player 1 play `($100: p, $200: 1−p)` for arbitrary `p`:

```
Π₁ = p[½(25) + ½(10)] + (1−p)[½(20) + ½(15)]
   = p(17.5) + (1−p)(17.5) = 17.5      for every p
```

Player 1's payoff is `17.5` **regardless of `p`** — so *every* mixed strategy, including `(½,½)`, is a best reply. The same holds for Player 2. Hence `σ*` is a Nash equilibrium.

Contrast a wrong guess: `σ₁ = (⅓, ⅔)`, `σ₂ = (⅗, ⅖)`. Then `Π₁(σ) = (³⁄₁₅)(25) + (²⁄₁₅)(10) + (⁶⁄₁₅)(20) + (⁴⁄₁₅)(15) = 55/3 ≈ 18.33`, but switching to the **pure** strategy $100 gives `(⅗)(25) + (⅖)(10) = 19 > 18.33`. **Not** an equilibrium.

**2 — Deletion, then equalization (Tables 5.4 → 5.5).** The 4×3 game of Table 5.4 has **no** pure-strategy equilibrium. Run cardinal IDSDS: `D` is strictly dominated by `B` → delete; then `G` is strictly dominated by `F` → delete; then `A` is strictly dominated by `C` → delete. What remains:

| P1 \ P2 | E | F |
|---|---|---|
| **B** | 4, 0 | 2, 4 |
| **C** | 3, 3 | 4, 2 |

Now apply Theorem 5.2. Let Player 2 play `(E: q, F: 1−q)`. Player 1 must be **indifferent** between `B` and `C`:

```
4q + 2(1−q) = 3q + 4(1−q)
2q + 2      = 4 − q
q = 2/3        → both give Player 1 a payoff of 10/3
```

Let Player 1 play `(B: p, C: 1−p)`. Player 2 must be indifferent between `E` and `F`:

```
0p + 3(1−p) = 4p + 2(1−p)
3 − 3p      = 2p + 2
p = 1/5        → both give Player 2 a payoff of 12/5
```

Equilibrium of the reduced game: `((B: ⅕, C: ⅘), (E: ⅔, F: ⅓))`. Lift it back to the original game by assigning **0** to every deleted strategy:

```
σ* = ((A:0, B:⅕, C:⅘, D:0), (E:⅔, F:⅓, G:0))
```

Note the direction of each equation: **Player 2's probabilities are solved from Player 1's indifference**, and vice versa. This is Remark 5.4 in action.

**3 — Why equalization alone is not enough (Table 5.6).**

| P1 \ P2 | D | E |
|---|---|---|
| **A** | 3, 0 | 0, 2 |
| **B** | 0, 2 | 3, 0 |
| **C** | 2, 0 | 2, 1 |

Consider `σ = ((A:½, B:½, C:0), (D:½, E:½))`. Player 1's indifference condition **holds**: `A` gives `1.5`, `B` gives `1.5`, and so does the mixture. Yet this is **not** an equilibrium — Player 1 gets `2` by switching to the pure strategy `C`, which is *outside her support* and therefore invisible to Theorem 5.2.

Use the best-reply function instead. Against `(D: q, E: 1−q)`, Player 1's payoffs are `A(q) = 3q`, `B(q) = 3 − 3q`, `C(q) = 2`. The lines cross at `q = ⅓` (B∩C) and `q = ⅔` (A∩C):

```
                      B                          if 0 ≤ q < 1/3
                      any mix of B and C         if q = 1/3
Player 1's best reply = C                        if 1/3 < q < 2/3
                      any mix of A and C         if q = 2/3
                      A                          if 2/3 < q ≤ 1
```

So a mixed equilibrium must have support `{B, C}` with `q = ⅓`, or support `{A, C}` with `q = ⅔`. The second is impossible: with `B` at probability 0, `E` **strictly dominates** `D` for Player 2, so `(D: ⅔, E: ⅓)` is not a best reply. That leaves support `{B, C}`; impose Player 2's indifference between `D` and `E`:

```
2p = 1 − p   →   p = 1/3
```

```
σ* = ((A:0, B:⅓, C:⅔), (D:⅓, E:⅔))
```

**4 — A strategy dominated only by a mixture (Table 5.8, Pearce).**

| P1 \ P2 | D | E |
|---|---|---|
| **A** | 0, 1 | 4, 0 |
| **B** | 1, 2 | 1, 4 |
| **C** | 2, 0 | 0, 1 |

`B` is **not** strictly dominated by any pure strategy of Player 1 — yet it is a best reply to **nothing**. Against any `(D: q, E: 1−q)`, `B` yields exactly `1`, while the mixed strategy `(A: ⅓, B: 0, C: ⅔)` yields

```
(⅓)·4(1−q) + (⅔)·2q = (4/3)(1−q) + (4/3)q = 4/3 > 1     for every q
```

So `B` is strictly dominated by a **mixed** strategy and must be deleted — a deletion ordinal IDSDS would have missed.

**5 — Cardinal IDSDS run to a unique rationalizable profile (Fig 5.9).** A 3×3 game reduces in four steps:

1. `C` (P1) deleted — strictly dominated by `(A: ½, B: ½)`.
2. `F` (P2) deleted — strictly dominated by `(D: ½, E: ½)`.
3. What is left is

   | P1 \ P2 | D | E |
   |---|---|---|
   | **A** | 3, 4 | 2, 1 |
   | **B** | 0, 0 | 1, 3 |

   `B` deleted — now strictly dominated by the **pure** strategy `A` (3 > 0 and 2 > 1).
4. `E` deleted — with only `A` left, `D` gives Player 2 `4` vs. `1`.

Output `(A, D)` with payoffs `(3, 4)`. The only rationalizable strategies are `A` and `D`, so `(A, D)` is also the **unique** Nash equilibrium. Steps 1–2 needed mixed dominance; steps 3–4 only pure — the mixed deletions **unlocked** the pure ones.

## Key Takeaways
1. **Nash's theorem is an existence guarantee, purchased with cardinal payoffs.** Randomizing is meaningless without the expected-utility machinery of Ch 4.
2. Compute in this order: **cardinal IDSDS → guess the support → equalization → verify against strategies outside the support.**
3. Theorem 5.2 is **necessary, not sufficient**. Verifying indifference within a support proves nothing until you check every pure strategy *outside* it.
4. **Solve for the opponent's probabilities from your own indifference.** The mnemonic is Remark 5.4: you randomize to keep *them* indifferent, not to help yourself.
5. When equalization is ambiguous, plot the pure-strategy payoff lines and read the **upper envelope**; ties in the envelope are exactly where mixed best replies live.
6. Check dominance **by mixed strategies** (Thm 5.3), not just by pure ones — mixed dominance often cascades into further pure deletions.
7. The two-player identity *belief = opponent's mixed strategy* is what makes rationalizability epistemically meaningful. With 3+ players it fails, because beliefs admit correlation that mixed-strategy profiles cannot express.
8. **Surface the common-knowledge-of-vNM-preferences assumption** (Remark 5.6). It is what rationalizability quietly requires and it is almost always unrealistic. The author's instruction: be aware of your own implicit assumptions, and question others'.
9. Pure Nash ⊆ mixed Nash, always (Remark 5.2). Finding a pure equilibrium does not mean you have found them all.

## Connects To
- **Ch 1**: Matching Pennies had no Nash equilibrium; §1.5's ordinal IDSDS is strengthened here into cardinal IDSDS.
- **Ch 3 Remark 3.2**: games with no subgame-perfect equilibrium — the footnote there promises exactly Theorem 5.1.
- **Ch 4**: supplies vNM utility; the Compound Lottery reduction is what turns a mixed-strategy profile into a single lottery over outcomes.
- **Ch 6**: extends mixing to dynamic games via **behavioral strategies**.
- **Ch 9**: proves the Remark 5.5 claim — common belief of rationality ⟺ rationalizable profiles — and develops the belief interpretation of mixed strategies.
- **Correlated equilibrium (Aumann)**: the natural home for the correlation that Remark 5.5 says mixed-strategy profiles cannot represent.
