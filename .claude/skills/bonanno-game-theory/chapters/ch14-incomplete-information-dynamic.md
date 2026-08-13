# Chapter 14: Incomplete Information — Dynamic Games

## Core Idea
Conceptually identical to Ch 13 — just associate a **dynamic** game with each state — but **Bayesian Nash equilibrium is no longer an appropriate solution concept**. Use subgame-perfect or **weak sequential equilibrium**. The payoff: reputation, strikes and truthful disclosure all become explicable, because off-path beliefs now do real work.

## Frameworks Introduced

- **The representational change is trivial; the solution concept change is not.** Associate a dynamic game with each state, apply the Harsanyi transformation as before. But Bayesian Nash equilibrium (= Nash equilibrium) **allows a player to "choose" a strictly dominated action at an unreached information set** (Ch 3, Ch 6 §6.3). So:
  > **From now on use either subgame-perfect equilibrium or weak sequential equilibrium.**
  - As in Ch 13, a solution of the transformed game **need not** induce the backward-induction solution of the **true** game.

- **The signalling/reputation mechanism** — why incomplete information succeeds where perfect information failed:
  - In Ch 2, Selten's chain-store paradox showed backward induction **cannot** capture the reputation argument, and the diagnosis was: *reputation needs uncertainty in some player's mind, and perfect information rules uncertainty out by definition.*
  - Add a small probability that the incumbent is a **different type**, and fighting becomes a **credible** way to influence a *third party's* beliefs — even when it is common knowledge between the incumbent and the first entrant that the incumbent is rational.
  - **The general shape**: a costly action that a "strong" type would take anyway becomes a **signal**; the "weak" type's decision not to imitate it is what makes the signal informative.

- **Pooling vs. separating in dynamic settings** (Def 13.1 carried over): a **separating** equilibrium is one where the informed player's action differs by type — i.e. the action **reveals** the type. The design question is always: *does the other type want to imitate?*

- **The skeptical-interpretation result (Milgrom–Roberts, 1986)** on truth-in-advertising:
  - Setup: Nature picks quality `x` from a finite set `X` (probabilities = the buyer's beliefs); the seller observes `x` and makes an **assertion** `A ⊆ X` subject to the truth constraint `x ∈ A`; the buyer observes `A` and chooses a quantity `q ≥ 0`.
  - The problem a truth law does **not** solve: *the seller can tell the truth without revealing all the information.* With `x = 89` octane, "at least 70", "at least 85", "at most 89" and "exactly 89" are **all true**.
  - **Result**: if the buyer adopts a **skeptical** view — always interpreting a claim in the way **least favorable to the seller** ("not more than 30% fat" read as "exactly 30% fat") — then under reasonable hypotheses there is an equilibrium whose **outcome is the same as under complete information**.
  - Mechanism: skepticism is a choice of **off-path beliefs**, which weak sequential equilibrium leaves free. It makes vagueness unprofitable, so full revelation becomes optimal.
  - Converse: if the buyer is **naïve**, there is an equilibrium where the seller **does** make vague claims (Exercise 14.4).

- **Multi-sided incomplete information in dynamic games** (§14.2): conceptually the same as the multi-sided static case. Requires a **common prior** for the Harsanyi transformation, exactly as in Ch 13.

- **The recurring simplification move** — used in every example: before searching, **collapse information sets and singleton nodes with a strictly dominant choice**, replacing them with the payoff vector of that choice. Sequential rationality forces the choice regardless of beliefs, so nothing is lost and the tree shrinks dramatically.

## Key Concepts
- **Type** — here, a payoff variant of a *player*, e.g. **rational** vs. **hotheaded** incumbent, **high-profit** vs. **low-profit** firm.
- **Hotheaded type** — one who *enjoys fighting*; in the chain-store example he "considers a fight to be as good as getting $2 million".
- **Discount factor `δ`** (`0 < δ < 1`) — `$1` one period ahead is worth `$δ` now; this is what makes a strike costly and thus a credible signal.
- **`ε` (hurt feelings)** — in the bargaining example, the buyer's disutility from having his initial offer rejected.
- **Reservation price** — the seller sells iff price `≥ s`; the buyer buys iff price `≤ b`.
- **Skeptical vs. naïve buyer** — the off-path belief rule that decides whether disclosure is full or vague.

## Reference Tables

The chain-store game by incumbent type (Fig 14.7):

| Incumbent **rational** | entrant: in | entrant: out |
|---|---|---|
| **fight** | 0, 0 | 5, 1 |
| **share** | 1.5, 1.5 | 5, 1 |

| Incumbent **hotheaded** | entrant: in | entrant: out |
|---|---|---|
| **fight** | **2**, 0 | 5, 1 |
| **share** | 1.5, 1.5 | 5, 1 |

Which solution concept for which setting:

| Setting | Solution concept |
|---|---|
| Static incomplete information (Ch 13) | Bayesian Nash equilibrium |
| **Dynamic** incomplete information | **subgame-perfect** or **weak sequential** equilibrium |

## Worked Example

**1 — Why Bayesian Nash equilibrium must be abandoned (Figs 14.1–14.5).** Player 1's payoffs are common knowledge; **Player 1** is uncertain between two games, with probability `⅓` on the left and `⅔` on the right:

```
LEFT  game:  B → (1,0)    T then A → (2,1)    T then D → (0,2)
RIGHT game:  B → (1,0)    T then A → (2,2)    T then D → (0,1)
```

Backward induction *within* each game: in the left game Player 2 prefers `D` (2 > 1), so Player 1 prefers `B` (1 > 0). In the right game Player 2 prefers `A` (2 > 1), so Player 1 prefers `T` (2 > 1). **The true state is the left one.**

Harsanyi transformation: Nature picks the state; **Player 2** is informed (she knows her own payoffs); **Player 1** has a single information set spanning both. Strategic form (Player 2's strategy = (choice in left, choice in right)):

| P1 \ P2 | DD | DA | AD | AA |
|---|---|---|---|---|
| **B** | 1, 0 | 1, 0 | 1, 0 | 1, 0 |
| **T** | 0, 4⁄3 | **4⁄3, 2** | 2⁄3, 1 | 2, 5⁄3 |

Nash (= Bayesian Nash) equilibria: **`(B, DD)`, `(B, AD)`, `(T, DA)`**. Only **`(T, DA)`** is subgame-perfect — the other two have Player 2 "choosing" a dominated action at a node Player 1's `B` prevents from being reached. So take `(T, DA)` as the solution.

Since the true state is the left game, the **actual** play is `(T, D)` — which is **not** the backward-induction solution of the true game (that was `B`). Exactly the Ch 13 warning, now in dynamic form.

**2 — Selten's chain store: reputation finally works (Figs 14.6–14.10).** Two towns; per town, `out → (5,1)` for the incumbent/entrant, `share → (1.5, 1.5)`, `fight → (0,0)` for a rational incumbent but `(2,0)` for a hotheaded one.

The situation: **the incumbent is in fact rational, and this is common knowledge between the incumbent and PE-1.** But **PE-2** is uncertain, assigning probability `p` to hotheaded. PE-2's beliefs and both entrants' payoffs are common knowledge.

*Simplify first*: at each of the incumbent's singleton nodes followed only by terminal nodes, a hotheaded incumbent strictly prefers **fight** and a rational one strictly prefers **share**. Collapse those nodes into their payoff vectors.

*The candidate equilibrium* `σ`:
1. **PE-1** plays **out** at both nodes.
2. **PE-2** plays **out** at the top information set (PE-1 stayed out), **in** at the middle one (PE-1 entered and was accommodated), **out** at the bottom one (PE-1 entered and was fought).
3. **The incumbent fights PE-1's entry in every case** — whether hotheaded or rational.

*Beliefs* `μ`: at the top information set, probability `p` on hotheaded (Bayesian updating — this is the only information set reached by `σ`); at the middle, probability **1 on rational**; at the bottom, probability **1 on hotheaded**. The last two are unconstrained by Bayesian updating, so weak sequential equilibrium permits them.

*Sequential rationality*:
- **PE-1**: at either node, `in` yields 0 and `out` yields 1 → **out** ✓.
- **Incumbent**: at the left (hotheaded) node `fight` yields 7 vs. `share` 3.5; at the right (rational) node `fight` yields 5 vs. `share` 3 → **fight** ✓ *in both cases.*
- **PE-2**, top: `in` yields `p(0) + (1−p)(1.5)` and `out` yields 1, so **out** is sequentially rational iff
  ```
  1 ≥ 1.5(1 − p)   ⟺   p ≥ 1/3
  ```
- **PE-2**, middle (believes rational): `in` yields 1.5, `out` yields 1 → **in** ✓.
- **PE-2**, bottom (believes hotheaded): `in` yields 0, `out` yields 1 → **out** ✓.

**This is a weak sequential equilibrium for every `p ≥ ⅓`** — and it captures the Ch 2 intuition exactly: *even though it is common knowledge between the incumbent and PE-1 that the incumbent is rational and would lose 1.5 by fighting, the threat to fight is credible because it would influence PE-2's beliefs and induce her to stay out; understanding this, PE-1 stays out.*

The argument leans on weak sequential equilibrium's free off-path beliefs — **but the postulated beliefs are highly plausible**, and in fact (Exercise 14.2) this assessment is also a **sequential equilibrium**.

**3 — Why strikes happen: signalling through a costly delay (Figs 14.11–14.14).** A union requests `w_H` or `w_L`; the firm accepts or rejects. Rejection ⟹ a one-period strike, then a final request the firm accepts or rejects (no agreement ⟹ both get 0). Common discount factor `δ ∈ (0,1)`. The union does **not** know the firm's gross profit `π`, believing `π_H` with probability `λ` and `π_L` with probability `1−λ`.

Assumptions: `π_H > π_L > 0`, `w_H > w_L > 0`, and
```
π_H − w_H > 0     (high-profit firm can afford the high wage)
π_L − w_L > 0     (low-profit firm can afford the low wage)
π_L − w_H < 0     (low-profit firm CANNOT afford the high wage)
```
**The true state is `π = π_L`.** These imply a contract is in both parties' interest even when profits are low — so any strike is pure waste.

*Target: a separating equilibrium* where (1) the union requests `w_H` in period 1; (2) the **high**-profit firm accepts and the **low**-profit firm **rejects**; (3) after rejection the union requests `w_L` and the firm accepts. I.e. **the low-profit firm endures a strike to signal that it cannot pay `w_H`.**

*Simplify first*: eliminate the firm's second-period choice — under the assumptions every second-period offer is accepted, except `w_H` by the low firm.

*Three conditions*:
```
(i)  Union's period-2 low request optimal:   δ w_L ≥ (1 − p) δ w_H   ⟺   p ≥ 1 − w_L/w_H
     where p is the probability the union assigns to the low type. (p = 1 works.)

(ii) High-profit firm does NOT imitate:      π_H − w_H  ≥  δ (π_H − w_L)
     ⟺   δ ≤ (π_H − w_H)/(π_H − w_L)

(iii) Union's period-1 HIGH request optimal:  w_L ≤ λ w_H + (1 − λ) δ w_L
     ⟺   λ ≥ (1 − δ) w_L / (w_H − δ w_L)      — i.e. λ sufficiently large
```
If (ii) holds, the high type accepts `w_H` immediately, the low type rejects, and **Bayesian updating then forces the union to assign probability 1 to the low type** at its middle information set — making the reduced demand `w_L` sequentially rational, satisfying (i) automatically. Weak sequential equilibrium imposes **no** restriction on beliefs at the bottom information set.

*A numerical witness*: `π_H = 100, π_L = 55, w_H = 60, w_L = 50, λ = 0.7, δ = 0.6`.
```
(ii)  π_H − w_H = 40  >  δ(π_H − w_L) = 0.6(50) = 30                       ✓
(iii) w_L = 50  <  λ w_H + (1−λ) δ w_L = 0.7(60) + 0.3(0.6)(50) = 51       ✓
```
**The inefficient strike is an equilibrium phenomenon**, and it exists precisely because enduring it is the only *credible* way for the low-profit firm to convince the union.

**4 — Truth-in-advertising: skepticism produces full disclosure (Fig 14.15).** Three quality levels `X = {l, m, h}`, equally likely; the buyer chooses 1 or 2 units; the seller may make **any true** claim, e.g. at quality `l` he may say `{l}`, `{l,m}`, `{l,h}` or `{l,m,h}`.

A weak sequential equilibrium:
- **Seller**: claims `{l}` at `l`, `{m}` at `m`, `{h}` at `h` — **full revelation, no vagueness**.
- **Buyer**: buys 1 unit if told `{l}`, 2 units if told `{m}` or `{h}`; and adopts the **least-favorable-to-the-seller** beliefs off path — told `{l,m}`, `{l,h}` or `{l,m,h}` she believes `l` with probability 1 and buys 1 unit; told `{m,h}` she believes `m` with probability 1 and buys 2 units.

All those beliefs are **admissible because those information sets are not reached in equilibrium**, so Bayesian updating does not apply. Skepticism makes every vague claim yield the worst possible reading, so vagueness never pays — and full revelation is optimal. **A naïve buyer, by contrast, sustains an equilibrium with vague claims** (Exercise 14.4).

**5 — Two-sided incomplete information in a bargaining game (Figs 14.16–14.19).** Seller's reservation price `s`, buyer's `b`, both in `{1,…,n}`; each knows only their own and puts **equal probability** on all possibilities for the other. The buyer offers `p`; if `p = n` the game ends with exchange; if `p < n` the seller accepts or counter-offers `p′ > p`, which the buyer accepts or rejects.

```
π_seller = 0                     if no exchange
         = x − s                 if exchange at price $x

π_buyer  = 0                     if no exchange
         = b − p                 if exchange at the initial offer $p
         = b − p′ − ε            if exchange at the counter-offer $p′
```

where `ε > 0` measures the buyer's **hurt feelings** at seeing his initial offer rejected.

With `n = 2` the states are `(1,1), (1,2), (2,1), (2,2)`. Both partitions split them into two cells of two states each with probabilities `(½, ½)` — so the **uniform distribution is a common prior** and the Harsanyi transformation goes through with each state at probability `¼`.

*First simplification*: at the buyer's **bottom** information sets, `Yes` is **strictly dominated** by `No`, so any weak sequential equilibrium must select `No`. Collapse those nodes and search the reduced game.

## Key Takeaways
1. **Do not use Bayesian Nash equilibrium in dynamic games.** It tolerates strictly dominated actions at unreached information sets. Use subgame-perfect or weak sequential equilibrium.
2. A solution of the transformed game **need not** reproduce the backward-induction solution of the **true** game. Always distinguish equilibrium play in the model from play in the actual game.
3. **Always simplify before searching**: collapse every node/information set with a strictly dominant choice into its payoff vector. Sequential rationality makes this free, and it is the difference between a tractable and an intractable tree.
4. **Reputation requires uncertainty.** The Ch 2 chain-store paradox dissolves the moment a third party is unsure of the incumbent's type — and it needs only `p ≥ ⅓`, not a large probability.
5. Fighting is credible **not** because it pays in the current town but because it changes a **later, different player's** beliefs. Signalling targets the audience, not the opponent.
6. To build a **separating** equilibrium, the binding constraint is always **"does the other type want to imitate?"** — here `π_H − w_H ≥ δ(π_H − w_L)`. Derive that inequality first; the rest usually follows from Bayesian updating.
7. **Costly delay is a signalling technology.** Strikes are inefficient *and* equilibrium behaviour: the low-profit firm has no cheaper credible way to prove it cannot pay.
8. **Off-path beliefs are the design variable.** Skeptical interpretation is just a choice of off-path beliefs — and it converts a toothless truth-in-advertising law into full disclosure. Naïveté reverses the conclusion.
9. Truth-telling ≠ disclosure. A law requiring true statements permits arbitrarily vague true statements; only the receiver's interpretation rule closes the gap.
10. Verify plausibility of your off-path beliefs. Weak sequential equilibrium permits anything, but a good equilibrium's beliefs should survive **sequential equilibrium** too — as the chain-store one does (Exercise 14.2).

## Connects To
- **Ch 2 §2.4**: Selten's chain-store game and the explicit promise that reputation would need uncertainty — redeemed here.
- **Ch 13**: the state-space representation, the Harsanyi transformation, common priors, pooling/separating, and the warning about the true game — all carried over unchanged.
- **Ch 10**: weak sequential equilibrium and Remark 10.1's free off-path beliefs, which every example in this chapter exploits.
- **Ch 11**: sequential equilibrium — the stronger check that the chain-store assessment also passes.
- **Ch 3 / Ch 6**: subgame-perfect equilibrium and the §6.3 pathology that disqualifies Bayesian Nash equilibrium here.
- **Ch 15**: the type-space reformulation of everything in Chapters 13–14.
- **Milgrom–Roberts (1986)**: the disclosure result; **Kreps–Wilson / Milgrom–Roberts (1982)**: the reputation literature this chain-store treatment belongs to.
