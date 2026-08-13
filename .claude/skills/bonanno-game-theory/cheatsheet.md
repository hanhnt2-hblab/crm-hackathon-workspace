# Cheatsheet — Bonanno's judgment calls

## Which solution concept? (decision tree)

- **Can players sign binding agreements?** → **Yes**: you are in *cooperative* game theory; nothing in this book applies. **No**: continue.
- **Are preferences over outcomes specified?** → **No**: you have a *frame*, not a game. **Stop and elicit rankings** — the same frame supports opposite answers.
- **Simultaneous (or ignorant of others' choices)?**
  - Ordinal payoffs suffice → dominance → **IDSDS** → **Nash equilibrium**. If no Nash equilibrium exists (Matching Pennies), you *must* go cardinal.
  - Cardinal payoffs → **cardinal IDSDS** → **mixed-strategy Nash** (always exists, Thm 5.1).
- **Sequential, perfect information?** → **backward induction** (= subgame-perfect equilibrium here).
- **Sequential, imperfect information?**
  - Has proper subgames → **subgame-perfect equilibrium**.
  - **No proper subgames** → subgame-perfection has **zero bite**; go to the refinements below.
- **Is the game itself common knowledge?** → **No**: Harsanyi-transform first, then solve the resulting game with the concept above (**not** Bayesian Nash if dynamic).

## Refinement ladder — pick by what you need to exclude

| You need to exclude | Use | Cost |
|---|---|---|
| nothing | Nash | tolerates incredible threats |
| incredible threats | subgame-perfect | empty without proper subgames |
| strictly dominated choices at unreached sets | **weak sequential** | doesn't refine subgame-perfect |
| beliefs that contradict `σ` | **sequential** | limit condition: hard to refute, impossible to interpret |
| same, but interpretably | **perfect Bayesian** | weaker than sequential; allows belief reversal |
| belief reversal | independent PBE | IND1+IND2+IND3 |
| **weakly** dominated choices | trembling-hand perfect | outside the book |

**Containments**: Sequential ⊂ Independent PBE ⊂ PBE ⊂ Subgame-perfect ⊂ Nash; and PBE ⊂ Weak sequential ⊂ Nash. Subgame-perfect and weak sequential only **overlap** — neither contains the other.

**Sequential equilibrium = PBE + choice measurability + uniform Bayesian consistency** (Thm 12.5). Use this instead of limits.

## Thresholds & specific numbers

| Rule | Value |
|---|---|
| vNM elicitation questions needed | ≤ `m − 1` for `m` outcomes |
| `ν_E`, `μ` normalization | `U(o_worst)=0`, `U(o_best)=1`; `F(∅)=0` |
| Chain-store reputation works iff | `p ≥ ⅓` (probability incumbent is hotheaded) |
| High-profit firm won't mimic iff | `δ ≤ (π_H − w_H)/(π_H − w_L)` |
| Union demands high wage iff | `λ ≥ (1−δ)w_L/(w_H − δw_L)` |
| Cournot symmetric duopoly | `qᵢ* = (a−c)/3b`, `P = (a+2c)/3`, `πᵢ = (a−c)²/9b` |
| Second-price auction | bid `bᵢ = vᵢ` (weakly dominant, **iff** selfish & greedy) |
| Pivotal mechanism | report `wᵢ = vᵢ`; guarantee non-pivotality with `wᵢ = cᵢ` — but that is **not** optimal |

## Trade-off matrix: dominance procedures

| | order-independent? | epistemic grounding | deletions | when |
|---|---|---|---|---|
| IDSDS (ordinal) | **yes** | common belief of rationality | fewest | always run first |
| Cardinal IDSDS | yes | + common knowledge of vNM prefs | more | before mixed equilibria |
| IDWDS | **no** — delete simultaneously | rationality **+ caution**, which conflict | most | avoid; not a substitute for backward induction |

## Decision rules the author commits to

- **Never answer "what is rational?" from a frame.** Preferences are an input you elicit or state, not infer.
- **Never assume selfish and greedy.** It is "a common mistake, unfortunately one that even game theorists sometimes make."
- **Rationality is silent on risk attitude.** *De gustibus non est disputandum.* Risk aversion alone does **not** pin down any choice between lotteries; **risk neutrality does**.
- **Say what dominates what.** "x is dominated" is like saying "x is worse" — worse than what? "y is dominant" is fine: it means best.
- **Escalate the ladder only as far as forced.** Ordinal machinery gets you further than expected; go cardinal only when existence or mixing demands it.
- **Simplify before searching.** Collapse any information set with a strictly dominant choice into its payoff vector — sequential rationality makes this free.
- **Designate the true state.** "Almost never done in the literature", but without it your model doesn't say what is actually the case.
- **Surface your assumptions.** Common knowledge of vNM preferences is "often (almost always?) very unrealistic"; the common-prior assumption is an unresolved debate.
- **Prefer common *belief* of rationality** to common knowledge — knowledge forbids the mistakes real players make.
- **Solve incomplete-information games via weak sequential equilibrium**, not by building the strategic form.

## Tells & smells

- Payoff table with **outcomes** in the cells, not numbers → **it's a frame**. Don't solve it.
- No pure-strategy Nash equilibrium → you need **cardinal payoffs and mixing**; check whether the source justified them.
- You verified indifference within a support and declared equilibrium → **you skipped the strategies outside the support** (Thm 5.2 is necessary only).
- A "reputation" or "deterrence" story in a **perfect-information** game → the argument cannot work; uncertainty is ruled out by definition. Needs Ch 14.
- Someone claims agreement proves accuracy → **no**. Aumann's theorem gives convergence, and the two-scientists example converges *away* from the truth.
- An off-path belief that requires reaching a node the strategy gives probability 0 through a **different** player's zero-probability move → likely **KW-inconsistent**; check for **belief reversal**.
- A subgame-perfect equilibrium in a game with **no proper subgames** → subgame-perfection certified nothing. Check sequential rationality by hand.
- Order of deletion changed your answer → you used **weak** dominance non-simultaneously.
- A strategy specifying a choice at a node the same strategy makes unreachable → normal and necessary; read it as the **opponent's conjecture**, not a plan (Ch 2, Ch 9 §9.3, Ch 13).
- A truth-in-advertising / disclosure problem → the binding variable is the **receiver's interpretation rule**, not the truth constraint.
- "Everyone knows `E`, and everyone knows everyone knows `E`" → **still not common knowledge.** Build the CK partition (three-hats puzzle has depth 2 and nothing at depth 3).
- Probability 1 treated as knowledge → **certainty can be false**; knowledge cannot.
- A type-space model where each type determines its own payoff → excludes a player being unsure of her **own payoff**. Use Def 15.2.
