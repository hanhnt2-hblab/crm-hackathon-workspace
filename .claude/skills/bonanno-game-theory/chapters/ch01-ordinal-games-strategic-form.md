# Chapter 1: Ordinal games in strategic form

## Core Idea
A table of outcomes is **not** a game — it is a *game-frame*. You cannot ask "what is the rational choice?" until you add each player's ranking of the outcomes; and once you do, the same frame can yield opposite rational choices.

## Frameworks Introduced

- **Game-frame in strategic form** (Def 1.1): the quadruple `⟨I, (S₁,…,Sₙ), O, f⟩` — players, strategy sets, outcomes, and `f: S → O` mapping each strategy profile to an outcome.
  - When to use: to describe *the situation* before any claim about behavior.
  - How: `S = S₁ × … × Sₙ` is the set of **strategy profiles**. Rows = Player 1's strategies, columns = Player 2's; each cell holds the *outcome*, not a number.

- **Ordinal game in strategic form** (Def 1.3): the quintuple `⟨I, (S₁,…,Sₙ), O, f, (≽₁,…,≽ₙ)⟩` — a game-frame plus, for each player, a **complete and transitive** ranking `≽ᵢ` of `O`.
  - When to use: the moment you want to say what a rational player *should* do.
  - How: replace each `≽ᵢ` with an ordinal utility function `Uᵢ` representing it, then define the **payoff function** `πᵢ(s) = Uᵢ(f(s))`. Dropping `O` and `f` leaves the **reduced-form game** `⟨I, (S₁,…,Sₙ), (π₁,…,πₙ)⟩`.

- **Ordinal utility function** (Def 1.2): `U: O → ℝ` with `U(o) > U(o′) ⟺ o ≻ o′` and `U(o) = U(o′) ⟺ o ~ o′`.
  - How: the numbers are **completely arbitrary** beyond their order. `{5,2,10,2}`, `{0.8,0.7,1,0.7}` and `{27,1,100,1}` all represent `o₃ ≻ o₁ ≻ o₂ ~ o₄`. Infinitely many utility functions represent the same ranking.

- **Strict / weak dominance and equivalence** (Def 1.4): for Player *i* and strategies *a*, *b*:
  - *a* **strictly dominates** *b*: `πᵢ(a, s₋ᵢ) > πᵢ(b, s₋ᵢ)` for **every** `s₋ᵢ ∈ S₋ᵢ`.
  - *a* **weakly dominates** *b*: `πᵢ(a, s₋ᵢ) ≥ πᵢ(b, s₋ᵢ)` for every `s₋ᵢ`, **and** strict inequality for at least one `s₋ᵢ`.
  - *a* is **equivalent** to *b*: equality for every `s₋ᵢ`.
  - Convention (Remark 1.3): strict implies weak formally, but "weakly dominates" is read throughout as "weakly **but not** strictly".

- **Dominant strategy and dominant-strategy equilibrium** (Def 1.5, 1.6):
  - *a* is **strictly dominant** if it strictly dominates every other strategy. At most one can exist.
  - *a* is **weakly dominant** if for every other `x`, either *a* weakly dominates `x` or *a* is equivalent to `x`. Several can exist — and any two must be equivalent.
  - `s` is a **strict dominant-strategy equilibrium** if every `sᵢ` is strictly dominant; **weak** if all are weakly dominant and at least one is not strictly dominant. Unqualified "dominant-strategy equilibrium" defaults to **weak**.

- **Pareto superiority** (Def 1.7): `o` is **strictly Pareto superior** to `o′` if every player prefers `o`; **weakly Pareto superior** if all consider `o` at least as good and at least one strictly prefers it.

- **IDSDS — Iterated Deletion of Strictly Dominated Strategies**:
  - When to use: no player has a dominant strategy, but some strategies are strictly dominated.
  - How: from `G` delete every strictly dominated strategy of every player → `G¹`; repeat on `G¹` → `G²`; … until nothing more is deletable, giving `G^∞`. Finite games terminate in finitely many steps. If `G^∞` is a single profile, it is the **iterated strict dominant-strategy equilibrium**; otherwise it is just "the output of IDSDS".
  - Why it works: order-independent (Remark 1.5) — any deletion sequence gives the same output. Its meaning is epistemic: exactly the profiles compatible with rationality + **common belief of rationality** survive (proved in Ch 9).

- **IDWDS — Iterated Deletion of Weakly Dominated Strategies** (Def 1.8):
  - When to use: sparingly — only when you accept its extra assumption.
  - How: **at every step identify, for every player, all** weakly-or-strictly dominated strategies and delete them **all in that step**. The simultaneity is not a convenience, it is what makes the procedure well defined.
  - Failure mode: order **does** matter for weak dominance. Its justification needs rationality *plus* **caution** (never fully rule out an opponent's strategy) — and caution directly conflicts with deleting strategies. The book declines to justify IDWDS.

- **Nash equilibrium** (Def 1.9, 1.10): `s*` such that for every Player *i* and every `sᵢ ∈ Sᵢ`, `πᵢ(s*) ≥ πᵢ(s₁*,…,sᵢ,…,sₙ*)`.
  - When to use: the general fallback — most games are solved by neither IDSDS nor IDWDS.
  - How: equivalently (Remark 1.6), every `sᵢ*` is a **best reply** to `s₋ᵢ*`. A **best reply** (Def 1.11) to `s₋ᵢ` is any `sᵢ` maximizing `πᵢ(·, s₋ᵢ)`.
  - Hierarchy: a (weak or strict, plain or iterated) dominant-strategy equilibrium **is** a Nash equilibrium.

- **The underlining method** — the fast way to find all Nash equilibria of a small game:
  - How: in each **column** underline Player 1's largest payoff (all ties); in each **row** underline Player 2's largest payoff. A cell with **both** payoffs underlined is a Nash equilibrium. Three players: add a third table per Player-3 strategy and underline Player 3's payoff iff it is her largest **across tables** for the same cell.
  - Limit: works only when the game fits in tables. With many players or infinite strategy sets, apply the definition directly.

## Key Concepts
- **Strategy profile** — `s = (s₁,…,sₙ)`, one strategy per player; an element of `S`.
- **`s₋ᵢ` / `S₋ᵢ`** — the sub-profile (and its set) of the strategies of everyone *other than* `i`; lets you write `s = (sᵢ, s₋ᵢ)`.
- **Reduced-form game** — the payoff-only representation; "reduced" because `O` and `f` are lost.
- **Selfish and greedy** — cares only about own material payoff and prefers more to less. An *assumption*, stated explicitly each time it is used.
- **Second-price (Vickrey) auction** — sealed bids; highest bidder wins but pays the **second-highest** bid. Tie-breaking must be specified (the winner then pays her own bid).
- **Pivotal mechanism (Clarke mechanism)** — a game designed to elicit truthful willingness-to-pay for a public project.
- **Pivotal individual** — one whose removal from the society would flip the project decision. Non-pivotal individuals pay nothing; a pivotal *i* pays `|Σ_{j≠i} wⱼ − Σ_{j≠i} cⱼ|`.
- **Socially efficient decision** — carry out the project iff `Σᵢ vᵢ > C`.
- **Cournot competition** — quantities `qᵢ`, inverse demand `P = a − bQ`, cost `cqᵢ`. Cournot invented what we now call Nash equilibrium, for this restricted class.
- **Matching Pennies** — the standard example of an ordinal game with **no** Nash equilibrium.

## Reference Tables

Preference notation (Table 1.3):

| Symbol | Meaning |
|---|---|
| `o ≻ᵢ o′` | Player *i* considers `o` **better than** `o′` |
| `o ~ᵢ o′` | Player *i* is **indifferent** between `o` and `o′` |
| `o ≽ᵢ o′` | Player *i* considers `o` **at least as good as** `o′` |

`≽` alone suffices (Remark 1.1): `o ≻ o′ ⟺ o ≽ o′ and not o′ ≽ o`; `o ~ o′ ⟺ o ≽ o′ and o′ ≽ o`. Throughout the book `≽ᵢ` is assumed **complete** and **transitive**.

Dominance relations in Table 1.6 (Player 1's payoffs only: A = 3,2,1 / B = 2,1,0 / C = 3,2,1 / D = 2,0,0 against E,F,G):

| Claim | Holds? |
|---|---|
| A strictly dominates B | yes |
| A and C are equivalent | yes |
| A strictly dominates D | yes |
| C strictly dominates D | yes |
| B strictly dominates D | **no** — B and D tie against E |
| B weakly dominates D | yes |
| A, C are weakly dominant for Player 1 | yes |

## Worked Example

**The same frame, two different games (§1.1).** Sarah and Steven each pick *Split* or *Steal* (Golden Balls). The frame:

| | Steven: Split | Steven: Steal |
|---|---|---|
| **Sarah: Split** | each gets $50,000 (`o₁`) | Sarah 0, Steven $100,000 (`o₂`) |
| **Sarah: Steal** | Sarah $100,000, Steven 0 (`o₃`) | both nothing (`o₄`) |

The tempting argument — "if Steven steals, Sarah gets nothing either way; if he splits, Steal pays $100,000 > $50,000; therefore Steal" — is **invalid**, because it smuggles in the premise that Sarah is selfish and greedy.

*Case A — both selfish and greedy.* Sarah: `o₃ ≻ o₁ ≻ o₂ ~ o₄`; Steven: `o₂ ≻ o₁ ≻ o₃ ~ o₄`. With utilities from `{2,3,4}`:

| | Split | Steal |
|---|---|---|
| **Split** | 3, 3 | 2, 4 |
| **Steal** | 4, 2 | 2, 2 |

*Steal* weakly dominates *Split* for each player → **(Steal, Steal)** is a weak dominant-strategy equilibrium.

*Case B — Sarah fair-minded and benevolent.* Her ranking becomes `o₁ ≻ o₃ ≻ o₂ ≻ o₄` (she values fairness, and among the two outcomes where she gets nothing prefers Steven to get something):

| | Split | Steal |
|---|---|---|
| **Split** | 4, 3 | 2, 4 |
| **Steal** | 3, 2 | 1, 2 |

Now *Split* is **strictly** dominant for Sarah → **(Split, Steal)** is the equilibrium. **Same frame, opposite rational choice for Sarah.**

**The Prisoner's Dilemma, built the same way (§1.2).** Doug and Ed choose Normal or Extra effort for a best-worker prize; both would sacrifice family time to win, otherwise value it, and are *envious* (prefer nobody winning to the other winning). Rankings `o₃ ≻ o₁ ≻ o₄ ≻ o₂` (Doug) and `o₂ ≻ o₁ ≻ o₄ ≻ o₃` (Ed) give:

| | Normal | Extra |
|---|---|---|
| **Normal** | 2, 2 | 0, 3 |
| **Extra** | 3, 0 | 1, 1 |

Extra effort is **strictly** dominant for both → (Extra, Extra), a *strict* dominant-strategy equilibrium — even though (Normal, Normal) is **strictly Pareto superior**. Note what generated the dilemma: not greed, but **envy**. Any non-binding agreement to play Normal fails on both branches: if you expect the other to comply you gain by cheating; if you expect them to cheat you gain by cheating too.

**Cournot via calculus (§1.7).** Two firms, `π₁ = (a−c)q₁ − b q₁² − b q₁q₂`. Set `∂π₁/∂q₁ = 0` and `∂π₂/∂q₂ = 0` (sufficient, since `∂²πᵢ/∂qᵢ² = −2b < 0`):

```
a − c − 2b q₁ − b q₂ = 0
a − c − 2b q₂ − b q₁ = 0
→ q₁* = q₂* = (a − c) / 3b      P = (a + 2c)/3      πᵢ = (a − c)²/9b
```
With `a=25, b=2, c=1`: equilibrium `(4, 4)`, profit `32` each.

**A pathological Nash equilibrium (Example 1.2).** `S₁ = S₂ = [1,∞)`; `π₁ = x−1` if `x < y`, else `0`; `π₂ = y−1` if `y < x`, else `0`. The **unique** Nash equilibrium is `(1,1)` with payoffs `(0,0)` — yet `x = 1` is **weakly dominated** for both players. A unique Nash equilibrium can consist entirely of weakly dominated strategies.

## Key Takeaways
1. **Never answer "what is rational?" from a frame.** Add preferences first — the same frame supports contradictory answers.
2. Ordinal utility numbers carry **only** order. "Alice's utility for Mexican food is 10" is meaningless in isolation; never infer ratios.
3. Say *what* dominates *what*. "x is dominated" is like saying "x is worse" — worse than what? By contrast "y is dominant" is meaningful: it means best.
4. Prefer IDSDS to IDWDS. IDSDS is order-independent and epistemically grounded in common belief of rationality; IDWDS needs simultaneous deletion to be well defined at all, and requires a notion of caution that conflicts with the procedure itself.
5. Use the underlining method for any game small enough to tabulate; fall back to the definition otherwise (Example 1.1's 50-player benefactor game has Nash equilibria that no table would reveal).
6. **Ordinal games need not have a Nash equilibrium** (Matching Pennies). This gap is precisely what motivates cardinal payoffs and mixed strategies in Part II.
7. Truth-telling can be made a weakly dominant strategy by design: **Vickrey (Thm 1.1)** for auctions, **Clarke (Thm 1.2)** for public goods. Both depend on the assumed preferences — a spiteful or generous bidder breaks Thm 1.1.
8. In the pivotal mechanism you can always guarantee non-pivotality by reporting `wᵢ = cᵢ` — but avoiding the tax is **not** optimal; truthful reporting can leave you strictly better off even while paying it.

## Connects To
- **Ch 2**: same solution ideas transplanted to dynamic games with perfect information; backward induction.
- **Ch 5**: mixed strategies rescue the existence of equilibrium that fails here for Matching Pennies.
- **Ch 9**: proves the epistemic claim asserted here — IDSDS output ⟺ common belief of rationality.
- **Mechanism design / VCG**: §1.3 and §1.4 are the Vickrey and Clarke components of what is now called the VCG mechanism.
- **Industrial organization**: §1.7's Cournot model is the standard entry point.
