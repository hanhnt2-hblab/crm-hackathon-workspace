# Patterns & Procedures — Bonanno, *Game Theory*

Executable procedures. Each is a recipe, not a definition — see `glossary.md` for definitions and the chapter files for worked instances.

## Frame → Game
**When to use**: before any claim about rational behaviour, in any chapter.
**How**: (1) write the frame `⟨I,(Sᵢ),O,f⟩` or the tree, with **outcomes** in the cells/terminal nodes; (2) elicit each player's **ranking** of `O`; (3) pick any representing utility function; (4) only now solve.
**Trade-offs**: skipping step 2 is the single most common error in the book's examples — the same frame supports opposite rational choices (Ch 1 Split-or-Steal, Ch 2 partnership dissolution).

## The underlining method (all pure Nash equilibria)
**When to use**: any game small enough to tabulate.
**How**: in each **column** underline Player 1's largest payoff (all ties); in each **row** underline Player 2's largest. Both underlined ⟹ Nash equilibrium. Three players: one table per Player-3 strategy; underline Player 3's payoff iff it is her largest **across tables** for the same cell.
**Trade-offs**: useless for infinite strategy sets or many players — apply the definition directly (Ch 1 Example 1.1's 50-player game).

## IDSDS (iterated deletion of strictly dominated strategies)
**When to use**: no dominant strategy exists; before hunting for Nash equilibria.
**How**: delete all strictly dominated strategies of all players; repeat on the smaller game until nothing is deletable.
**Trade-offs**: **order-independent** (Remark 1.5), so delete in any order. Epistemically grounded: output ⟺ common belief of rationality (Thm 9.1/9.2). Cheap — always run it first.

## Cardinal IDSDS / rationalizability
**When to use**: cardinal payoffs, before computing mixed equilibria.
**How**: same loop, but delete pure strategies strictly dominated **by a mixed strategy** (Thm 5.3, Pearce).
**Trade-offs**: strictly more deletions than ordinal IDSDS, and mixed deletions often unlock further **pure** ones (Ch 5 Fig 5.9). Requires common knowledge of vNM preferences — an unrealistic assumption worth stating (Remark 5.6).

## IDWDS (iterated deletion of weakly dominated strategies)
**When to use**: sparingly.
**How**: at **every step**, identify all weakly-or-strictly dominated strategies of **all** players and delete them **all at once**.
**Trade-offs**: order **matters**, which is why simultaneity is mandatory. Needs a notion of *caution* that conflicts with the deletion procedure itself; the book declines to justify it. Not interchangeable with backward induction (Ch 2 §2.4).

## Equalization (mixed-strategy Nash equilibria)
**When to use**: after IDSDS, when you have a candidate support.
**How**: set the payoffs of the pure strategies **in your support** equal to each other and solve for the **opponent's** probabilities (Thm 5.2). Repeat for the other player.
**Trade-offs**: **necessary, not sufficient.** You must then check every pure strategy **outside** the support (Ch 5 Table 5.6). Direction matters: your indifference determines *their* probabilities.

## Best-reply-function method
**When to use**: when equalization is ambiguous — more than two strategies, or a strategy outside the support may dominate.
**How**: plot each pure strategy's payoff as a function of the opponent's mixing probability `q ∈ [0,1]`; take the **upper envelope**; intervals give pure best replies, intersection points give mixed ones. Read off candidate supports, then impose the opponent's indifference.
**Trade-offs**: only practical for 2×n games; but it is the only reliable way to enumerate *all* mixed equilibria.

## Backward induction
**When to use**: finite perfect-information games.
**How**: mark all terminal nodes; repeatedly pick a decision node whose successors are all marked, select a payoff-maximizing choice for its mover, and mark the node with that successor's payoff **vector**; repeat. Patch selected choices into a strategy profile.
**Trade-offs**: ties ⟹ multiple solutions (re-run with a different selection). Every solution is Nash (Thm 2.1), but Nash is strictly larger. Cannot represent reputation — that needs uncertainty (Ch 2 §2.4 → Ch 14).

## Losing-position search
**When to use**: a perfect-information game far too large to draw (Ch 2 Example 2.2's 10,000-node prefix).
**How**: reason from the end: find the largest state from which the mover cannot win; find its predecessor; iterate to get the **ladder**; then state the invariant strategy that keeps the opponent on it.
**Trade-offs**: needs a game with arithmetic structure; gives an explicit strategy rather than a table.

## Subgame-perfect equilibrium algorithm
**When to use**: any extensive-form game with proper subgames.
**How**: (1) pick a **minimal** proper subgame and select a Nash equilibrium of it; (2) delete it, replacing it with the **full** payoff vector of the corresponding terminal history (including players not in the subgame); (3) repeat on the smaller game; (4) patch the recorded choices together.
**Trade-offs**: multiple Nash equilibria in a subgame ⟹ multiple SPE (Remark 3.1); none ⟹ **no** SPE (Remark 3.2) — impossible with cardinal payoffs (Thm 6.2). **Zero bite** when there are no proper subgames (Remark 3.4).

## Subgame identification (the two-condition test)
**When to use**: before running the SPE algorithm.
**How**: (1) start at a non-root node whose information set is the **singleton** `{x}`; enclose `x` and all successors; (2) reject if the oval **cuts** any information set.
**Trade-offs**: condition (2) is the one people skip (Ch 3 Fig 3.8, node `y`).

## Fold Nature into payoff vectors
**When to use**: any game with chance moves, before solving.
**How**: replace each chance move with the vector of **expected utilities** it induces.
**Trade-offs**: valid because vNM utility is linear in probabilities; shrinks the tree at no cost (Ch 6 Figs 6.5 → 6.6).

## Mixed → behavioral strategy conversion
**When to use**: perfect-recall extensive games, to cut parameters.
**How**: `P(a)` = total probability the mixed strategy gives to plans beginning with `a`; the choice probability at a later information set is the **conditional** probability given the earlier choice.
**Trade-offs**: equivalent **only under perfect recall** (Kuhn, Thm 6.1). Without it, mixed strategies buy correlation across your own decisions that behavioral strategies cannot (Ch 6 Fig 6.4).

## Eliciting a vNM utility function
**When to use**: you need cardinal payoffs from a real person.
**How**: (1) ask for the **ranking** of basic outcomes; assign 1 to the best, 0 to the worst; (2) for each remaining `oᵢ`, ask for the `pᵢ` making her indifferent between `oᵢ` for certain and `(o_best w.p. pᵢ, o_worst w.p. 1−pᵢ)`; (3) set `U(oᵢ) = pᵢ`.
**Trade-offs**: at most `m−1` questions, fewer with indifferences. **Never** use the word "utility" — the questions must be answerable without the concept (Ch 4 Example 4.1).

## Inferring an unobserved preference from an observed one
**When to use**: you know how someone ranks `A` vs `B` and want their choice between `C` and `D`.
**How**: let `U` be the vNM function Thm 4.1 guarantees exists; write `E[U(A)] > E[U(B)]` as a linear inequality in the unknown utilities; rearrange to compare `E[U(C)]` and `E[U(D)]`.
**Trade-offs**: uses only the **existence** of `U` — no numbers needed (Ch 4, Susan's A/B → C/D).

## Reducing a compound lottery
**How**: multiply probabilities **along** each path; then **add**, for each outcome, over all paths reaching it (Ch 4 §4.3).

## Computing nested knowledge
**When to use**: any `K₁¬K₂K₃E`-style expression.
**How**: work strictly **inside-out**: compute the innermost event as a **set**, apply the next operator to that set, take complements where they appear.
**Trade-offs**: mechanical and error-free if you always write down the intermediate set (Ch 7).

## Computing common knowledge
**When to use**: instead of ever expanding the infinite hierarchy.
**How**: merge any two information sets (of **any** agents) that overlap; repeat until nothing overlaps — that is the **common knowledge partition**. Then `CKE = {w : ℐ_CK(w) ⊆ E}` (Thm 7.1).
**Trade-offs**: also gives you `ℐ_CK(w)`, the **smallest** event common knowledge at `w` — the ceiling on what any coordination scheme can condition on.

## Designing a coordination strategy
**When to use**: two agents must act identically without communicating (Ch 7 Example 7.1).
**How**: candidate conditioning events must satisfy `CKE = E`. Compute the CK partition first and build the strategy on **its cells**.
**Trade-offs**: naive partitions fail silently — they look symmetric but aren't commonly known.

## Testing for a common prior
**When to use**: before applying the Harsanyi transformation to a two- or multi-sided situation; whenever you claim like-mindedness.
**How**: write one equation per information set expressing the required conditional **ratios** in unknowns `p_w`; add `Σ p_w = 1`; solve the linear system. A solution exists ⟺ Harsanyi consistency.
**Trade-offs**: **no common prior ⟹ the Harsanyi transformation cannot be carried out** (Ch 13, Exercise 13.6). The justification of the common-prior assumption is itself an open problem (Remark 13.3).

## Auditing rationality in a model
**When to use**: epistemic analysis of a strategic-form game (Ch 9).
**How**: for each state, read the opponents' strategies off the states in the player's information set, weight by her beliefs, compare her chosen strategy's expected payoff to every alternative. Collect `Rᵢ`, intersect to get `R`, then compute `CKR` via the CK partition.
**Trade-offs**: `R ⊆ CKR` is **false** — all players rational at a state does not make it common knowledge.

## Finding weak sequential equilibria
**When to use**: dynamic games; also the fastest route to Bayesian Nash equilibria in incomplete-information games.
**How**: (1) **simplify** — collapse every information set with a strictly dominant choice into its payoff vector; (2) hypothesize the informed/first player's pure strategy; (3) let **Bayesian updating** pin beliefs at reached information sets; (4) derive the other players' sequentially rational responses; (5) look for a contradiction (discard) or a supporting inequality (keep); (6) choose **off-path beliefs freely** to support what survives; (7) indifference ⟹ solve for the **interval** of mixing probabilities, yielding infinite families.
**Trade-offs**: far faster than building the strategic form, and it is the **only** route with infinite strategy sets (take first-order conditions instead — Ch 13's Cournot).

## Proving KW-consistency
**How**: exhibit a sequence of **completely mixed** profiles: put `kᵢ/n`-order weights on the zero-probability choices, choosing the constants `kᵢ` so the resulting belief **ratios** match `μ`; compute `μₙ` by Bayesian updating; take limits (Ch 11 Fig 11.2).
**Trade-offs**: easy. The reverse is hard.

## Proving KW-INconsistency
**How**: work with belief **ratios** — the shared denominators cancel — and derive a **contradiction between two of them** (Ch 11 Fig 11.3, Ch 12 Fig 12.7).
**Trade-offs**: never try to enumerate sequences. Belief **reversal** is the classic obstruction, since a single sequence cannot produce it.

## Ruling out an assessment with a plausibility order
**When to use**: showing a subgame-perfect equilibrium is not part of any PBE (Ch 12 Fig 12.2).
**How**: from P1 derive `h ~ ha` for positive-probability actions and `h ≺ ha` for zero-probability ones; from P2 derive `h ⪯ h′` for the positive-`μ` histories; apply **transitivity** to reach a contradiction.
**Trade-offs**: purely qualitative — no arithmetic. Fastest disqualification tool in the book.

## Verifying Bayes consistency
**How**: identify `D_μ⁺`; find which equivalence classes of `⪯` meet it; construct one `ν_E` per class; check **B2** (`ν_E(h′) = ν_E(h)·σ(a₁)…σ(a_m)`) and **B3** (conditioning `ν_E` on each information set reproduces `μ`) (Ch 12 Figs 12.4–12.6).

## Testing choice measurability
**How**: build an integer representation `F` (peel off `H₀` = most plausible, `H₁` = most plausible of the rest, …). To **disprove** it, exhibit two same-information-set pairs whose plausibility gaps must have **opposite signs** after appending a common action (Ch 12).

## Harsanyi transformation
**When to use**: converting a situation of incomplete information into a solvable game.
**How**: (1) Nature chooses the state — probabilities = the **uninformed player's beliefs** (one-sided) or a **common prior** (otherwise); (2) inform the informed player(s); (3) the uninformed player moves without learning Nature's choice **or** the other's choice.
**Trade-offs**: the resulting game **loses the identity of the true state**. A solution need not induce a Nash/backward-induction solution in the actual game. In **dynamic** games do **not** solve it with Bayesian Nash equilibrium — use subgame-perfect or weak sequential equilibrium (Ch 14).

## Designing a separating (signalling) equilibrium
**When to use**: you want the informed player's action to reveal her type (Ch 14: strikes, reputation, disclosure).
**How**: the binding constraint is always **"does the other type want to imitate?"** — write that inequality first (e.g. `π_H − w_H ≥ δ(π_H − w_L)`). Then Bayesian updating pins the receiver's beliefs after the separating action, which usually makes the receiver's response automatic. Finally check the receiver prefers to initiate at all.
**Trade-offs**: off-path beliefs are the design variable. Weak sequential equilibrium permits anything, so verify the beliefs are also **sequentially** admissible (Ch 14, Exercise 14.2).

## State-space ⟷ type-space conversion
**How** (→ types): one type per **cell** of each player's partition (distinct cells ⟹ distinct types); each state becomes a type **profile**; each cell's distribution becomes that type's beliefs over `T₋ᵢ`; assign utilities per type (Def 15.1) or per profile (Def 15.2).
**How** (→ states): states = `T` (or `Y`); `t′ ∈ ℐᵢ(t) ⟺ t′ᵢ = tᵢ`; each type's beliefs give the distribution on its information set.
**Trade-offs**: use **Def 15.2** by default — indexing utility by own type alone forbids a player being uncertain about her **own payoff**, which is both rational and common (Ch 15 Fig 15.3).
