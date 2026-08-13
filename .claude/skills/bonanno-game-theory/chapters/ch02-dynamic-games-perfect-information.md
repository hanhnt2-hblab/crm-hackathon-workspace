# Chapter 2: Dynamic games with perfect information

## Core Idea
When moves are sequential and every player sees all preceding moves, the game is a rooted directed tree and **backward induction** solves it — but only after you supply preferences, and the solution is a *strategy profile*, not a play. Backward induction refines Nash equilibrium by killing **incredible threats**.

## Frameworks Introduced

- **Rooted directed tree**: nodes `X` + directed edges. The **root** has indegree 0; every other node has indegree exactly 1; there is a **unique path** from the root to any node. Outdegree 0 → **terminal node** (`Z`); otherwise **decision node** (`D`). `X = D ∪ Z`.

- **Finite extensive form (frame) with perfect information** (Def 2.1): four items —
  1. a finite rooted directed tree;
  2. players `I = {1,…,n}` and a function assigning **one player to every decision node**;
  3. actions `A` and a function assigning one action to every edge, with the restriction that **no two edges out of the same node carry the same action**;
  4. outcomes `O` and a function assigning an outcome to every terminal node.
  - When to use: to represent any sequential interaction where nobody is ever uncertain about what has happened.

- **Finite extensive game with perfect information** (Def 2.2): a frame **plus** a ranking `≽ᵢ` of `O` for every player. Same discipline as Ch 1 — the tree alone is a frame, not a game.

- **Backward-induction algorithm** (Def 2.3): a node is *marked* when a payoff vector is attached to it. Initially all and only terminal nodes are marked.
  1. Select a decision node `x` whose immediate successors are **all** marked. Let `i` move at `x`. Select a choice leading to an immediate successor with the **highest payoff for `i`**. Mark `x` with the payoff vector of the node following the selected choice.
  2. Repeat until all nodes are marked.
  - How to start: begin at the **penultimate nodes** (those followed only by terminal nodes). Finiteness guarantees the procedure is well defined and terminates.
  - Why multiplicity happens: if several choices maximize the mover's payoff, the procedure requires selecting *one* — an arbitrary selection that can yield **several backward-induction solutions**.

- **Strategy in a perfect-information game** (Def 2.4): a **list of choices, one for each decision node of that player** — a complete, contingent plan.
  - How to count: multiply the number of choices across the player's nodes. Three nodes with 3, 2 and 4 choices → `3 × 2 × 4 = 24` strategies.
  - Why the redundancy is deliberate: a strategy specifies behavior at nodes the strategy itself precludes reaching (e.g. `(a, g)` when choosing `a` means the second node is never reached). Three justifications the author offers: (1) the player is cautious and covers her own implementation mistakes; (2) a strategy is a set of instructions handed to a third party playing on her behalf; (3) reinterpret a strategy as a **belief in the opponent's mind** about what she would do.

- **Strategic form of an extensive game**: every strategy profile determines a unique terminal node, hence a unique payoff vector — so any perfect-information game induces a strategic-form game solvable by Ch 1 methods. The redundancy in strategies shows up as **duplicate rows/columns**.

- **Backward-induction solution vs. backward-induction outcome** (Remark 2.1):
  - **Solution** = a strategy profile (includes counterfactual behavior).
  - **Outcome** = the sequence of actual moves (the *play*).
  - Example: solutions `((a,g),(c,f))` and `((b,h),(c,e))` have outcomes `ac` (payoff 2,1) and `be` (payoff 3,1).

- **Theorem 2.1**: every backward-induction solution of a perfect-information game **is** a Nash equilibrium of the associated strategic form. So backward induction is a **refinement** of Nash equilibrium.
  - Typically the Nash set is a **proper superset** of the backward-induction set (Fig 2.6: 2 backward-induction solutions vs. 5 Nash equilibria). The extra Nash equilibria "often involve incredible threats".

- **Backward induction vs. IDWDS** — the exact, limited relationship: applying iterated deletion of weakly dominated strategies to the associated strategic form yields a set of profiles that **contains at least one** backward-induction solution, but (1) it may also contain profiles that are **not** backward-induction solutions, and (2) it may **fail to contain all** of them (Exercise 2.8). Do not treat the two as interchangeable.

- **Theorem 2.2 (win-lose games)**: in every finite two-player, win-lose, perfect-information game **one of the two players has a winning strategy**.
  - Proof idea: backward-induct until the root's immediate successors are marked. *Case 1* — at least one carries `(1,0)` → Player 1 wins by always steering into `(1,0)` nodes. *Case 2* — all carry `(0,1)` → Player 2 has the winning strategy.

- **Theorem 2.3 (three outcomes: `W₁`, `W₂`, `D`)** with `W₁ ≻₁ D ≻₁ W₂` and `W₂ ≻₂ D ≻₂ W₁`. Every such finite game falls in exactly one of three categories:
  1. Player 1 has a strategy guaranteeing `W₁`;
  2. Player 2 has a strategy guaranteeing `W₂`;
  3. Player 1 can guarantee `W₁ or D` **and** Player 2 can guarantee `W₂ or D` — so if both use these strategies the outcome is `D`.
  - Proof idea: mark nodes `(2,0)`, `(0,2)`, `(1,1)`; inspect the root's immediate successors as in Thm 2.2 with a third case for `(1,1)`.
  - Status: Tic-Tac-Toe and Draughts are category 3. **As of 2015 it is not known which category Chess belongs to** — and there is not even agreement that Chess's rules guarantee every play is finite.

## Key Concepts
- **Perfect information** — whenever it is her turn to move, a player knows all preceding moves. Uncertainty is ruled out **by definition**.
- **Dynamic game / game in extensive form** — a game with sequential interaction.
- **Penultimate node** — a decision node followed only by terminal nodes; where backward induction starts.
- **Incredible threat** — a threatened action the threatener would not actually want to carry out when faced with the fait accompli. The signature defect of non-backward-induction Nash equilibria.
- **Winning strategy** — a strategy guaranteeing a win no matter what the opponent chooses.
- **Losing position** — a partial state from which the player to move cannot win while the opponent can.
- **Selten's Chain Store Game** — the *m*-town repeated entry game used to test whether backward induction captures reputation-building.

## Reference Tables

The entry game (Fig 2.9), strategic form — potential entrant vs. incumbent:

| | fight | accommodate |
|---|---|---|
| **In** | 0, 0 | **2, 2** |
| **Out** | *1, 5* | 1, 5 |

Two Nash equilibria: **(In, accommodate)** — the backward-induction solution — and *(Out, fight)*, sustained only by an incredible threat.

## Worked Example

**Partnership dissolution: the frame flips the answer (Example 2.1).** Amy (senior, Player 1) offers Beth (junior, Player 2) either a 50-50 or a 70-30 split of $100,000. Beth can Accept or Reject; rejection means litigation costing each $20,000, with a certain verdict of 60/40 in Amy's favour.

```
                    1
        Offer 50-50   /   \   Offer 70-30
              2                 2
      Acc /    \ Rej      Acc /   \ Rej
      o₁        o₂        o₃       o₄
   50k/50k   40k/20k   70k/30k  40k/20k
```

The "obvious" backward induction — *Beth accepts either offer since 50k > 20k and 30k > 20k, so Amy offers 70-30* — is **invalid** for exactly the Ch 1 reason: it assumes Beth's ranking.

Now make it a game. Amy is selfish and greedy: `o₃ ≻₁ o₁ ≻₁ o₂ ~₁ o₄`. Beth cares about fairness and would sacrifice $10,000 to punish an unfair offer: `o₁ ≻₂ o₂ ~₂ o₄ ≻₂ o₃`. Utilities:

| | `o₁` | `o₂` | `o₃` | `o₄` |
|---|---|---|---|---|
| `U₁` | 2 | 1 | 3 | 1 |
| `U₂` | 3 | 2 | 1 | 2 |

Backward-induct: at the 70-30 node Beth compares Accept (`U₂ = 1`) with Reject (`U₂ = 2`) → **Reject**. At the 50-50 node, Accept (3) vs. Reject (2) → **Accept**. Amy therefore compares offering 50-50 (leads to `o₁`, `U₁ = 2`) with 70-30 (leads to `o₄`, `U₁ = 1`) → **offer 50-50**. Beth accepts.

**The frame's "obvious" answer (70-30, accepted) is reversed to (50-50, accepted) once fairness enters.**

**Why (Out, fight) must be discarded — and why reputation needs uncertainty (§2.4).** In the entry game, if the entrant *believes* the threat to fight, staying out is her best reply — that is what makes (Out, fight) a Nash equilibrium. But she should ignore it: faced with actual entry, the incumbent prefers 2 to 0.

Selten's chain store sharpens this. The incumbent's pitch to Businesswoman 1: *"If I fight you, Businesswoman 2 may stay out, giving me 0 + 5 = 5; if I accommodate you, she enters too and I get 2 + 2 = 4. So fighting you IS in my interest."*

Backward induction on the `m = 2` tree rejects this: the unique solution is **both businesswomen enter and the chain store accommodates in both towns**. Businesswoman 1's counter-argument is the lesson:

> *"Whatever happens in town 1, it will be common knowledge that your interaction in town 2 is the last — nobody else is watching, so there is no reputation to establish. In town 2 you face the one-shot entry game and will accommodate. So a rational Businesswoman 2 enters regardless of what you do to me. Your choice is between 0 + 2 = 2 (fight me) and 2 + 2 = 4 (don't). So I enter and you don't fight."*

**Reputation arguments require uncertainty in some player's mind — and perfect information rules uncertainty out by definition.** This is precisely why Ch 3 introduces imperfect information.

**A winning strategy found without drawing the tree (Example 2.2).** Players alternate choosing from `{1,…,10}`, Player 1 first; whoever brings the running sum to **100 or more** wins. The tree is hopeless — 10,000 nodes just for the first four moves. Instead reason about **losing positions**.

- **89** is the largest losing position: whoever moves there can only reach 90–99, and the opponent then hits 100 exactly.
- The predecessor is **78**: from 78 you must move to 79–88, from where the opponent can always reach 89.
- Iterating: **89, 78, 67, 56, 45, 34, 23, 12, 1** (spacing 11).

Player 1 moves first, so he takes **1**, then always answers Player 2's `n` with `11 − n`, keeping the sum on the ladder. Player 1's winning strategy:

> Start with 1. Then at every turn choose `(11 − n)`, where `n` is Player 2's immediately preceding choice.

A play where it works: `1, 9, 2, 6, 5, 7, 4, 10, 1, 8, 3, 3, 8, 9, 2, 5, 6, 1, 10`.

## Key Takeaways
1. A tree is a **frame**. Add rankings before applying backward induction — the same tree supports opposite solutions.
2. Backward induction outputs a **strategy profile**, not a play. Keep *solution* and *outcome* distinct; a single outcome can arise from different solutions.
3. Ties during marking generate **multiple** backward-induction solutions. This is a feature of the algorithm's arbitrary selection step, not an error.
4. Every backward-induction solution is Nash (Thm 2.1), but the converse fails. Use backward induction to strip out equilibria resting on **incredible threats**.
5. Do **not** substitute IDWDS for backward induction: it may add non-solutions and drop genuine ones.
6. Strategies specify choices at unreachable nodes. Accept the redundancy — it is what makes the strategic-form translation work, and reinterpreting a strategy as an *opponent's belief* is what makes it conceptually respectable.
7. **Finite two-player win-lose games are determined** (Thm 2.2); with a draw outcome, one of three exhaustive cases holds (Thm 2.3). Determinacy does not mean tractability — Chess's category was unknown as of 2015.
8. To solve a huge perfect-information game, look for **losing positions** and a periodic invariant instead of the tree.
9. Reputation and deterrence cannot be modeled here. They need imperfect information (Ch 3) or incomplete information (Ch 13–14).

## Connects To
- **Ch 1**: supplies Nash equilibrium, best replies and IDWDS, all reused via the strategic-form translation; §1.1's frame/game discipline is re-applied verbatim.
- **Ch 3**: drops perfect information, replacing single nodes with **information sets** and backward induction with **subgame-perfect equilibrium**.
- **Ch 6**: revisits subgame-perfect equilibrium once payoffs are cardinal.
- **Zermelo (1913)**: Thm 2.2 and 2.3 are the classical determinacy results that opened the field (Ch 0).
- **Repeated games / reputation (Kreps–Wilson–Milgrom)**: the chain-store paradox motivates the incomplete-information treatment in Ch 14.
