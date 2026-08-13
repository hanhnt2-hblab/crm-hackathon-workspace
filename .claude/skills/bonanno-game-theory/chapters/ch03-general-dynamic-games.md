# Chapter 3: General dynamic games

## Core Idea
Replace single decision nodes with **information sets** — collections of nodes a player cannot distinguish — and backward induction generalizes to **subgame-perfect equilibrium**: a Nash equilibrium that stays a Nash equilibrium in every proper subgame.

## Frameworks Introduced

- **Information set**: a collection of decision nodes of one player, meaning *the player does not know at which of these nodes he is making his decision*. Drawn as a rounded rectangle (by convention only when it contains ≥ 2 nodes).
  - When to use: whenever a player must act with partial information about earlier moves.

- **Finite extensive form (frame) with perfect recall** (Def 3.1): the four items of Def 2.1 **plus**, for every player `i`, a **partition** `𝒟ᵢ` of her decision nodes `Dᵢ`. Each element of `𝒟ᵢ` is an information set, subject to three restrictions:
  1. **Same actions**: any two nodes in the same information set must have equal outdegree and the identical set of action labels. (Otherwise the player could infer where she is from the menu of options.)
  2. **No self-precedence**: if `x, y` are in the same information set, neither is a predecessor of the other.
  3. **Perfect recall**: if `x ∈ D ∈ 𝒟ᵢ` precedes `y ∈ D′ ∈ 𝒟ᵢ` via action `a` taken at `x`, then **every** node `z ∈ D′` has a predecessor `w ∈ D` reached by that same action `a`.
  - Reading of (3): *if a player takes action `a` at an information set and later moves again, she remembers taking `a`.* Equivalently, a player always remembers **what she knew** and **what she herself did**.
  - Two ways to violate it (Fig 3.2): (i) the player forgets her own earlier choice; (ii) the player is uncertain **whether she has moved at all** before.

- **Perfect vs. imperfect information**: if every information set of every player is a **singleton**, restriction ▷ is trivially satisfied and Def 3.1 collapses to Def 2.1 — a perfect-information frame. If at least one information set has ≥ 2 nodes, the frame has **imperfect information**.

- **Strategy in an extensive-form game** (Def 3.2): a list of choices, **one for every information set** of that player.
  - Key consequence: a player **cannot condition on information she does not have**. In Example 3.2, Yvonne cannot plan "Yes if called first, No if called second" — she has one information set, so she has exactly two strategies.

- **Proper subgame** (Def 3.3), a two-condition test:
  1. Start from a decision node `x` ≠ root **whose information set is the singleton `{x}`**, and enclose `x` and all its successors in an oval.
  2. If the oval does **not cut any information set** (no information set `S` with `y, z ∈ S` where `y` is a successor of `x` and `z` is not), the enclosed portion is a proper subgame; otherwise it is not.
  - "Proper" because starting at the root would return the whole game — the trivial subgame (analogous to a proper subset).

- **Minimal proper subgame** (Def 3.4): a proper subgame that does not **strictly** contain another proper subgame. This is where the algorithm must start.

- **Subgame-perfect equilibrium** (Def 3.5): a strategy profile `s` such that
  1. `s` is a Nash equilibrium of the entire game, **and**
  2. for **every** proper subgame `G`, the restriction `s|G` is a Nash equilibrium of `G`.
  - `s|G` = the part of `s` prescribing choices at the information sets of `G` and only those.

- **Subgame-perfect equilibrium algorithm** (Def 3.6) — the generalization of backward induction:
  1. Start with a **minimal** proper subgame and select a Nash equilibrium of it.
  2. **Delete** that subgame and replace it with the payoff vector of the selected equilibrium, noting the strategies used. This yields a smaller extensive-form game.
  3. Repeat on the smaller game.
  - Then **patch together** the choices selected across all steps to read off the subgame-perfect equilibrium.
  - Why not the naive method: finding all Nash equilibria first and filtering by condition (2) "is not a practical way to proceed".

- **Chance moves and Nature**: represent a random event by a fictitious player **Nature** (or Chance) with an assigned probability distribution over its "choices". **Nature gets no payoffs** and is not a real player. The notion of strategy is unaffected.
  - Consequence: a strategy profile now induces a **lottery** over outcomes, not a single outcome — which is exactly why Part II is needed.

- **Expected value of a money lottery** (Def 3.7): for `($x₁ w.p. p₁, …, $xₙ w.p. pₙ)` with `pᵢ ≥ 0` and `Σpᵢ = 1`, the expected value is `$(x₁p₁ + … + xₙpₙ)`.

- **Risk neutrality** (Def 3.8): a player is **risk neutral** if she considers a money lottery **just as good as its expected value** — hence ranks money lotteries by expected value.
  - When to use: as the cheap stopgap that lets you write a strategic form for a game with chance moves *before* you have expected-utility theory (Ch 4).

## Key Concepts
- **Successor / predecessor** — `y` is a successor of `x` if a sequence of directed edges leads from `x` to `y`; *immediate* if the sequence is a single edge.
- **Partition** of `H` — a collection of non-empty, pairwise-disjoint subsets whose union is `H`.
- **Restriction `s|G`** — the sub-profile of `s` covering exactly the information sets inside subgame `G`.
- **Money lottery** — a lottery whose outcomes are sums of money.
- **Lottery** — a probabilistic outcome; introduced here, formalized in Ch 4.

## Reference Tables

Four remarks that define exactly what subgame-perfect equilibrium buys you:

| Remark | Content |
|---|---|
| **3.1** | A subgame or reduced game may have **several** Nash equilibria. Select one to continue; repeat with a different selection to enumerate all subgame-perfect equilibria. (Same as backward induction's tie handling.) |
| **3.2** | A subgame or reduced game may have **no** Nash equilibrium — in which case the game has **no** subgame-perfect equilibrium at all. (Part II fixes this: with cardinal payoffs and mixed strategies, every finite game has at least one.) |
| **3.3** | On perfect-information games, subgame-perfect equilibrium **coincides with** backward-induction solution. It is a strict generalization. |
| **3.4** | If a game has **no proper subgames** (e.g. Fig 3.3), Nash equilibria = subgame-perfect equilibria. In general, subgame-perfection is a **refinement** of Nash. |

Adele–Ben card game (Fig 3.17/3.18), strategic form under selfish + greedy + **risk neutral**. Adele's strategy = (what she says on black, on red); Ben's = (guess if Adele says "Red", guess if Adele says "Black"):

| Adele \ Ben | BB | BR | RB | RR |
|---|---|---|---|---|
| **BB** | 3, −3 | −3, 3 | 3, −3 | −3, 3 |
| **BR** | 3, −3 | 9, −9 | −9, 9 | −3, 3 |
| **RB** | 3, −3 | −9, 9 | 9, −9 | −3, 3 |
| **RR** | 3, −3 | 3, −3 | −3, 3 | −3, 3 |

## Worked Example

**Locating subgames — the two-condition test (Fig 3.8).** Only nodes `x`, `y`, `z` satisfy condition (1) (singleton information set, not the root):

- **From `x`**: oval cuts nothing → **proper subgame**.
- **From `y`**: the oval cuts Player 3's top information set (one of its nodes is a successor of `y`, another is not) → **not a subgame**.
- **From `z`**: oval cuts nothing → **proper subgame**.

So the game has exactly **two** proper subgames. Condition (2) is the one people skip — always check whether the oval slices an information set.

**Running the algorithm end to end (Fig 3.9).** Three proper subgames start at `x`, `y`, `z`; those at `x` and `z` are **minimal** (the one at `y` contains `z`'s).

1. **Minimal subgame at `x`** (Players 2 and 3 only):

   | P2 \ P3 | g | h |
   |---|---|---|
   | **c** | 2, 3 | 0, 2 |
   | **d** | 3, 1 | **1, 2** |

   Unique Nash equilibrium **(d, h)**. Delete and replace `x` with the *full* payoff vector of history `adh` = **(2, 1, 2)**.

2. **Minimal subgame at `z`** in the reduced game:

   | P2 \ P3 | E | F |
   |---|---|---|
   | **C** | 3, 0 | **1, 1** |
   | **D** | 1, 1 | 1, 0 |

   Unique Nash equilibrium **(C, F)**. Replace with the payoff vector of `beACF` = **(1, 1, 1)**.

3. The next reduced game has a unique proper subgame with unique Nash equilibrium **(f, A)**; replace with the vector of `bfA`.
4. The final reduced game's unique Nash equilibrium is **b**.

**Patch the pieces together**: `((b, C), (d, f, F), (h, A))`.

Contrast with `s = ((a,C), (d,f,E), (h,B))`, which **is** a Nash equilibrium of the whole game — Player 1 gets 2 and deviating to `b` gives 0; Player 2 gets 1 and `c` gives 0; Player 3 gets 2 and `g` gives 0. But it is **not** subgame-perfect: its restriction to the subgame at `z` is `(C, E)`, and there Player 2's unique best reply to `C` is `F`. **Nash at the top can hide irrationality inside a subgame.**

**Multiple subgame-perfect equilibria (Fig 3.15).** After solving the subgames at `x` (→ `(3,1,2)`) and `z` (→ `(3,2,1)` from equilibrium `(e,h)`), the reduced game has **two** Nash equilibria `(L,D,a)` and `(R,U,b)`, giving two subgame-perfect equilibria:

```
((L, c), (D, e), (a, h))    and    ((R, c), (U, e), (b, h))
  P1      P2      P3                 P1      P2      P3
```

**Why the three-envelope game ends in no trade (Example 3.3).** Envelopes of $100/$200/$300 are shuffled; Player 1 sees hers and either passes or proposes a trade; Player 2, who cannot see his, says Yes or No. All players selfish, greedy, risk neutral. Nature has 6 equally likely choices (p = 1/6). Player 1 has **8** strategies (one action per possible amount, e.g. `PTP` = pass on $100, trade on $200, pass on $300); Player 2 has **2**.

Payoffs come from expected values: under `(PPP, Y)` nothing ever trades, so Player 1 faces `$100, $100, $200, $200, $300, $300` each with p = 1/6 → **$200**; likewise Player 2.

The game has **no proper subgames**, so by Remark 3.4 all Nash equilibria are subgame-perfect. To discriminate further, use dominance: for Player 1 **every** strategy except `TPP` and `TTP` is weakly dominated; deleting those makes `Y` **strictly dominated** for Player 2. The most plausible equilibria are therefore **(TPP, N)** and **(TTP, N)** — *Player 2 refuses to trade.* Intuition: an offer to trade is itself information about what Player 1 holds.

## Key Takeaways
1. **Information sets encode ignorance, and strategies are indexed by them** — so a player literally cannot write a plan that conditions on what she doesn't know.
2. Check the **perfect recall** conditions when you draw a frame. The two classic violations are forgetting your own action and being unsure whether you have moved.
3. Subgame identification is a **two-condition** test. The singleton requirement is easy; the "does the oval cut an information set?" check is where errors happen.
4. Always start the algorithm at a **minimal** proper subgame, replace with the **full** payoff vector of the corresponding terminal history (including players not in the subgame), and patch the choices at the end.
5. Nash equilibrium of the whole game does **not** imply Nash equilibrium in every subgame — that gap is exactly what subgame-perfection closes.
6. Ties → multiple subgame-perfect equilibria (Remark 3.1). No Nash equilibrium in some subgame → **no** subgame-perfect equilibrium at all (Remark 3.2).
7. **No proper subgames ⟹ subgame-perfection has no bite** (Remark 3.4). Games like Fig 3.3 and Example 3.3 need a genuinely different refinement — this is the motivation for Part IV.
8. Nature is a bookkeeping device: probability distribution, no payoffs, no strategies. Its presence turns outcomes into **lotteries**, which forces the cardinal-payoff machinery of Ch 4.
9. **Risk neutrality is an assumption, not a definition of rationality.** It is used here only as a convenient stopgap for writing strategic forms.

## Connects To
- **Ch 2**: subgame-perfect equilibrium reduces exactly to backward-induction solution when all information sets are singletons (Remark 3.3).
- **Ch 4**: supplies expected utility, replacing the ad-hoc risk-neutrality assumption of §3.5.
- **Ch 6**: revisits subgame-perfect equilibrium with cardinal payoffs and behavioral strategies, and shows its remaining problems.
- **Ch 10–12**: weak sequential, sequential and perfect Bayesian equilibrium — refinements built precisely because subgame-perfection is empty in games with few or no proper subgames.
- **Ch 13–14**: Nature's chance moves become the modeling device for incomplete information.
