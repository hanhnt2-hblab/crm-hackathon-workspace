# Chapter 6: Dynamic games with cardinal payoffs

## Core Idea
With cardinal payoffs, **behavioral strategies** replace mixed strategies (Kuhn: they are equivalent under perfect recall) and a **subgame-perfect equilibrium always exists**. But subgame-perfection is still too weak — it cannot rule out choices that are strictly dominated *conditional on reaching an information set*.

## Frameworks Introduced

- **Behavioral strategy** (Def 6.1): a list of **probability distributions, one for every information set** of that player, each over the choices available at that information set.
  - Why prefer it: it is a **simpler object** than a mixed strategy. In Fig 6.2, Player 1's behavioral strategy needs **2** parameters (`p` for `a` vs. `b`, `q` for `e` vs. `f`); her mixed strategy over `S₁ = {(a,e),(a,f),(b,e),(b,f)}` needs **3**.
  - Mixed strategy = a distribution over *complete plans*. Behavioral strategy = independent randomization *at each decision point*.

- **Theorem 6.1 [Kuhn, 1953]**: in extensive forms **with perfect recall**, behavioral and mixed strategies are **equivalent** — for every mixed strategy there is a behavioral strategy inducing the **same probability distribution over terminal nodes**.
  - Precise form (the book's footnote): fix any profile `x₋ᵢ` of the others' strategies (mixed *or* behavioral). For every mixed `σᵢ` there is a behavioral `bᵢ` such that `(σᵢ, x₋ᵢ)` and `(bᵢ, x₋ᵢ)` induce the same distribution over terminal nodes.
  - **Consequence**: since the book studies only perfect-recall games, one can restrict attention to behavioral strategies from here on.
  - **Perfect recall is essential** — see the counterexample below.

- **Two equivalent ways to represent probabilistic outcomes in extensive forms**:
  1. Attach a **lottery over basic outcomes** to each terminal node (Fig 6.1).
  2. Insert explicit **chance moves / moves of Nature** (Fig 6.2).
  - The book keeps the Ch 3 definition of extensive form and simply allows chance moves.

- **Extensive-form game with cardinal payoffs** (Def 6.2): an extensive frame (possibly with chance moves) plus a **vNM ranking** `≽ᵢ` of `ℒ(O)` for every player. Identical to Def 3.1 except vNM preferences replace merely ordinal ones.

- **Simplifying a game by folding in Nature**: replace each chance move with the **payoff vector of expected utilities** it induces. In Fig 6.5 → 6.6, `(o₁: ⅔, o₂: ⅓)` has expected utility 4 for both players → replace with `(4, 4)`; `(o₁: ⅕, o₃: ⅗, o₄: ⅕)` gives 1.2 to Player 1 and 4 to Player 2 → replace with `(1.2, 4)`.
  - Why it is legitimate: vNM utility is linear in probabilities, so folding preserves all rankings.

- **Theorem 6.2**: every finite extensive-form game with cardinal payoffs has **at least one subgame-perfect equilibrium**.
  - Why: a corollary of Nash's theorem (Thm 5.1). Every subgame and reduced game has a mixed-strategy Nash equilibrium, so the subgame-perfect equilibrium algorithm (Def 3.6) **never halts**. This closes the gap of Ch 3 Remark 3.2.

- **The two failure modes of subgame-perfect equilibrium** (§6.3) — the motivation for all of Part IV. In a game with **no proper subgames**, SPE = Nash, and Nash admits:
  1. **Irrelevant-plan equilibria**: a player's plan at an unreached information set is "rational only in the very limited sense" that it cannot affect any payoff. Take it as a *serious* plan about what she would actually do and it is strictly worse.
  2. **Conditionally strictly dominated choices**: a choice can be part of a Nash equilibrium while being strictly dominated *at* the information set. The distinction the author draws: **`d` is strictly dominated as a choice but not as a strategy** — dominated conditional on the information set being reached, but not as a plan formed before play begins.

## Key Concepts
- **Perfect recall** — Def 3.1's third restriction; the hypothesis Kuhn's theorem needs.
- **Support / probability of a terminal node** — `P(z)` = product of the probabilities of the choices along the path to `z` (including Nature's).
- **Behavioral strategy profile → lottery over basic outcomes** → (via `Uᵢ`) a payoff for each player. Two equally valid computation routes: through basic outcomes, or through terminal nodes of the simplified game.

## Reference Tables

Behavioral vs. mixed strategies:

| | Mixed strategy | Behavioral strategy |
|---|---|---|
| Object | one distribution over **complete strategies** | one distribution **per information set** |
| Parameters (Fig 6.2, Player 1) | 3 | 2 |
| Randomization | once, before play | independently at each information set |
| Equivalent? | **yes, iff perfect recall** (Thm 6.1) | |

Subgame strategic forms from Fig 6.7 — **neither has a pure-strategy Nash equilibrium**:

| P2 \ P3 | C | D |
|---|---|---|
| **A** | 3, 1 | 0, 2 |
| **B** | 0, 3 | 1, 2 |

| P2 \ P3 | G | H |
|---|---|---|
| **E** | 0, 3 | 1, 2 |
| **F** | 2, 1 | 0, 3 |

## Worked Example

**1 — A mixed strategy and its equivalent behavioral strategy (Fig 6.3).** Player 1 uses

```
σ₁ = ((a,e): 1/12, (a,f): 4/12, (b,e): 2/12, (b,f): 5/12)     σ₂ = (c: ⅓, d: ⅔)
```

Compute terminal-node probabilities by summing over the strategies that reach each node:

```
P(z₁) = σ₁((a,e))·σ₂(c) + σ₁((a,f))·σ₂(c) = (1/12)(⅓) + (4/12)(⅓)  = 5/36
P(z₂) = σ₁((a,e))·σ₂(d) + σ₁((a,f))·σ₂(d) = (1/12)(⅔) + (4/12)(⅔)  = 10/36
P(z₃) = σ₁((b,e))·σ₂(c) + σ₁((b,f))·σ₂(c) = (2/12)(⅓) + (5/12)(⅓)  = 7/36
P(z₄) = σ₁((b,e))·σ₂(d)                    = (2/12)(⅔)              = 4/36
P(z₅) = σ₁((b,f))·σ₂(d)                    = (5/12)(⅔)              = 10/36
```

Now take the **behavioral** strategy `b₁ = (a: 5/12, b: 7/12 ; e: 2/7, f: 5/7)`:

```
P(z₁) = P(a)·σ₂(c)               = (5/12)(⅓)         = 5/36
P(z₂) = P(a)·σ₂(d)               = (5/12)(⅔)         = 10/36
P(z₃) = P(b)·σ₂(c)               = (7/12)(⅓)         = 7/36
P(z₄) = P(b)·σ₂(d)·P(e)          = (7/12)(⅔)(2/7)    = 4/36
P(z₅) = P(b)·σ₂(d)·P(f)          = (7/12)(⅔)(5/7)    = 10/36
```

**Identical distribution** — with one fewer parameter. Note how `b₁` was constructed: `P(a) = 1/12 + 4/12 = 5/12` (total probability `σ₁` gives to plans starting with `a`), and `P(e) = (2/12)/(7/12) = 2/7` (the *conditional* probability of `e` given `b`).

**2 — Where Kuhn's theorem fails without perfect recall (Fig 6.4).** A one-player game: choose `a` or `b`, then — at a **single information set spanning both branches** (so the player has forgotten her own first move) — choose `c` or `d`. The mixed strategy

```
σ = ((a,c): ½, (a,d): 0, (b,c): 0, (b,d): ½)     →     (z₁: ½, z₂: 0, z₃: 0, z₄: ½)
```

correlates the two decisions. Any behavioral strategy `(a: p, b: 1−p ; c: q, d: 1−q)` induces

```
(z₁: pq,  z₂: p(1−q),  z₃: (1−p)q,  z₄: (1−p)(1−q))
```

To get `P(z₂) = 0` you need `p = 0` or `q = 1`. But `p = 0` forces `P(z₁) = 0`, and `q = 1` forces `P(z₄) = 0`. **The distribution `(½, 0, 0, ½)` is unreachable.** Behavioral strategies randomize independently at each information set; without perfect recall, mixed strategies can buy correlation across your own decisions that they cannot.

**3 — Running the SPE algorithm when no subgame has a pure equilibrium (Fig 6.7).**

*Left subgame.* Let `p = P(A)`, `q = P(C)`. Equalize (Thm 5.2):
```
Player 2 indifferent A vs B:  3q = 1 − q          →  q = ¼
Player 3 indifferent C vs D:  p + 3(1−p) = 2      →  p = ½
```
Equilibrium `((A: ½, B: ½), (C: ¼, D: ¾))`. Payoffs, computed over the four cells:
```
Player 1: ½·¼·1 + ½·¾·2 + ½·¼·2 + ½·¾·0 = 1.125
Player 2: ½·¼·3 + ½·¾·0 + ½·¼·0 + ½·¾·1 = 0.75
Player 3: ½·¼·1 + ½·¾·2 + ½·¼·3 + ½·¾·2 = 2
```
**Shortcut** (the book's footnote): by Thm 5.2 read Player 2's payoff off the *pure* strategy `A` (= ¾) and Player 3's off the pure strategy `D` (= 2). Much faster than the four-term sum.

Replace the subgame with `(1.125, 0.75, 2)`.

*Right subgame.* Let `p = P(E)`, `q = P(G)`:
```
Player 2 indifferent E vs F:  1 − q = 2q                  →  q = ⅓
Player 3 indifferent G vs H:  3p + 1 − p = 2p + 3(1−p)    →  p = ⅔
```
Equilibrium `((E: ⅔, F: ⅓), (G: ⅓, H: ⅔))`, payoffs `(1, 0.67, 2.33)`.

*Root.* Player 1 compares `L` → 1.125 against `R` → 1. **`L`.** The subgame-perfect equilibrium, in behavioral strategies:

```
((L:1, R:0),  (A:½, B:½ ; E:⅔, F:⅓),  (C:¼, D:¾ ; G:⅓, H:⅔))
```

Had payoffs been merely **ordinal**, the algorithm would have halted at the very first subgame (no pure-strategy Nash equilibrium) and we would have concluded no SPE exists. Cardinal payoffs are what make the algorithm total.

**4 — Two subgame-perfect equilibria that are not rational solutions (Fig 6.12).** The game has **no proper subgames**, so SPE = Nash. The pure-strategy Nash equilibria are `(a,f,c)`, `(a,e,c)`, `(b,e,c)`, `(b,f,d)`.

*Why `(a, f, c)` is unreasonable.* Player 1 plays `a`, so Player 2 never moves and `f` is "as good as" `e` — it cannot affect anybody's payoff. But read Player 2's strategy as a **serious plan** about what she *would* do: given Player 3 plays `c`, `e` gives her **2** and `f` gives her **1**. If she takes the contingency seriously, `e` beats `f`.

*Why `(b, f, d)` is worse.* Player 3's information set is never reached, so `d` is "as good as" `c`. But `d` is **strictly dominated at that information set** — whether he is at the left node or the right node, `c` pays more. How can a strictly dominated choice sit inside a Nash equilibrium? Because

> **`d` is strictly dominated as a *choice* but not as a *strategy*** — dominated conditional on the information set being reached, not as a plan formulated before play starts.

Subgame-perfection cannot touch either equilibrium. **This is precisely the gap Part IV fills**: sequential rationality requires optimal behavior *at every information set*, reached or not.

## Key Takeaways
1. Use **behavioral strategies** in dynamic games: fewer parameters, and Kuhn's theorem says you lose nothing under perfect recall.
2. **Perfect recall is the hypothesis, not decoration.** Without it, mixed strategies can correlate a player's own successive choices in ways no behavioral strategy can replicate.
3. Cardinal payoffs make **existence** unconditional: every finite extensive-form game with vNM payoffs has an SPE (Thm 6.2), because the algorithm can always find a mixed equilibrium in each subgame.
4. Fold chance moves into **expected-utility payoff vectors** before running the algorithm — it shrinks the tree and changes nothing.
5. Use the Thm 5.2 shortcut inside subgames: an equilibrium payoff equals the payoff of **any single pure strategy in the support**. Never sum over all cells if you can read one row.
6. Compute payoffs from a behavioral profile either through basic outcomes or through terminal nodes — the two routes must agree, so use the cheaper one as a check.
7. **Subgame-perfection is not sequential rationality.** In games with no proper subgames it has *zero* bite, and it tolerates choices that are strictly dominated conditional on being reached.
8. The choice/strategy distinction is the conceptual key to Part IV: Nash equilibrium evaluates *strategies* ex ante; a satisfactory refinement must evaluate *choices* at each information set.

## Connects To
- **Ch 3**: supplies the extensive form, information sets, subgames and the SPE algorithm (Def 3.6) applied here unchanged; Remark 3.2's existence gap is closed by Thm 6.2.
- **Ch 4**: vNM utility is what makes folding Nature into payoff vectors valid.
- **Ch 5**: Thm 5.1 (existence) underwrites Thm 6.2; Thm 5.2 (equalization) is the computational engine used in every subgame here.
- **Ch 10**: takes up §6.3's problem directly with **sequential rationality** and weak sequential equilibrium.
- **Ch 11–12**: sequential and perfect Bayesian equilibrium — the refinements that finally handle the Fig 6.12 pathology.
- **Kuhn's theorem**: the classical result licensing behavioral strategies throughout applied game theory.
