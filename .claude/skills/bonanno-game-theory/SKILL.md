---
name: bonanno-game-theory
description: "Knowledge base from \"Game Theory: An open access textbook with 165 solved exercises\" by Giacomo Bonanno. Use when applying Bonanno's frameworks for Nash equilibrium, dominance and IDSDS, backward induction, subgame-perfect equilibrium, mixed strategies, expected utility, common knowledge and belief revision, sequential and perfect Bayesian equilibrium, or incomplete information and Bayesian games; studying the book; or referencing its concepts."
---

<!-- argument-hint: [topic, framework name, or chapter number] -->

# Game Theory: An open access textbook with 165 solved exercises
**Author**: Giacomo Bonanno (UC Davis) | **Pages**: ~585 | **Chapters**: 16 (Ch 0–15) | **Generated**: 2026-08-13
License: CC BY-NC-ND 4.0 (© 2015 Giacomo Bonanno)

## How to Use This Skill

- **Without arguments** — load the core frameworks below for reference
- **With a topic** — ask about `mixed strategies`, `common knowledge`, `perfect Bayesian equilibrium`, `signalling`; I find and read the relevant chapter
- **With a chapter** — ask for `ch08`; I load that chapter file
- **Browse** — ask "what chapters do you have?" for the full index

When you ask about a topic not covered in Core Frameworks below, I read the relevant chapter file before answering. For *how to actually run* a procedure, see [patterns.md](patterns.md); for *which concept to reach for*, see [cheatsheet.md](cheatsheet.md).

---

## Core Frameworks & Mental Models

### The discipline that organizes the whole book: frame ≠ game

A **game-frame** `⟨I, (S₁,…,Sₙ), O, f⟩` specifies players, strategy sets, outcomes, and which outcome each strategy profile produces. It is **not a game**. A game adds, for each player, a **complete and transitive ranking** of the outcomes. Bonanno returns to this in Ch 1, Ch 2, Ch 3, Ch 5 and Ch 6, every time with the same lesson:

> **Never answer "what is the rational choice?" from a frame.** The same frame supports opposite answers. In Split-or-Steal, a selfish Sarah steals and a fair-minded Sarah splits. In the partnership dissolution, a selfish Beth accepts 70-30 and a fairness-minded Beth rejects it — reversing Amy's optimal offer.

Corollary, stated bluntly: **assuming players are "selfish and greedy" is a mistake, not a default** — "unfortunately one that even game theorists sometimes make."

### The escalation ladder — go only as far as forced

1. **Ordinal payoffs** (Ch 1–3): you know only `o ≻ o′`. Buys dominance, IDSDS, Nash, best replies, backward induction, subgame-perfect equilibrium.
2. **Cardinal (vNM) payoffs** (Ch 4–6): players rank *lotteries*, so expected utility is meaningful. Buys mixed strategies, guaranteed existence (Nash Thm 5.1), behavioral strategies, guaranteed SPE existence (Thm 6.2).
3. **Knowledge & belief** (Ch 7–9): buys the *epistemic justification* of the concepts above.
4. **Refinements** (Ch 10–12): buys discipline on off-path beliefs.
5. **Incomplete information** (Ch 13–15): buys models where players don't know the game.

Use the cheapest rung that works. Escalate only when existence fails or the question demands it.

### Dominance and the two iterated procedures

- `a` **strictly dominates** `b`: strictly better against **every** opponent profile. `a` **weakly dominates** `b`: weakly better against all, strictly against at least one.
- **Say what dominates what.** "x is dominated" is like saying "x is worse" — worse than what? "y is *dominant*" is meaningful: it means best.
- **IDSDS** is **order-independent** (Remark 1.5) and epistemically exact: its output is precisely the profiles compatible with rationality + **common belief of rationality** (Thms 9.1 + 9.2).
- **IDWDS** must delete **all** dominated strategies **simultaneously** at each step, because order matters. It requires *caution* — never fully ruling out an opponent's strategy — which conflicts with the deletion procedure itself. The book declines to justify it, and warns it is **not** interchangeable with backward induction.
- With cardinal payoffs, check dominance **by mixed strategies** (Thm 5.3, Pearce): a strategy can survive pure dominance and still be a best reply to nothing.

### Nash equilibrium, and its four readings

`s*` is a Nash equilibrium iff every `sᵢ*` is a **best reply** to `s₋ᵢ*`. Bonanno gives four interpretations, all "mere rewordings" of the inequalities: **no regret**, **self-enforcing agreement**, **viable recommendation**, and **transparency of reason**.

Fast method for small games — **the underlining method**: in each column underline Player 1's largest payoff; in each row underline Player 2's. Both underlined ⟹ Nash equilibrium.

**Ordinal games need not have one** (Matching Pennies). With cardinal payoffs and mixing, one always exists (Nash 1951).

### The counter-intuitive core of mixed strategies

At a mixed-strategy Nash equilibrium, a player is **indifferent** among all strategies in her support (Thm 5.2), so she has **no incentive** to randomize:

> **The only purpose of randomizing is to make the other player indifferent** among two or more of his own pure strategies.

Operationally: **solve for the opponent's probabilities from your own indifference condition.** And Thm 5.2 is **necessary, not sufficient** — always check every pure strategy *outside* the support.

### Dynamic games: backward induction and its limits

Backward induction outputs a **strategy profile** (the *solution*), not a play (the *outcome*). Every backward-induction solution is Nash (Thm 2.1) but not conversely; the extra Nash equilibria "often involve **incredible threats**" — threats the threatener would not want to carry out when actually faced with the situation.

**Subgame-perfect equilibrium** generalizes it: a Nash equilibrium whose restriction to **every** proper subgame is a Nash equilibrium of that subgame. Its four limits, all stated as remarks in Ch 3 and Ch 6:
- ties ⟹ multiple equilibria; no Nash equilibrium in a subgame ⟹ **no** SPE (fixed by cardinal payoffs, Thm 6.2);
- **no proper subgames ⟹ zero bite** (SPE = Nash);
- it tolerates a choice that is **strictly dominated *as a choice*** (conditional on the information set being reached) though not **as a strategy**.

That last distinction is the engine of all of Part IV.

### Reputation requires uncertainty

Selten's chain-store paradox (Ch 2) is the book's cleanest structural result. The incumbent's argument for fighting an early entrant to deter a later one **fails** under backward induction, because in the last town there is no audience. Businesswoman 1's rebuttal is the lesson:

> *"Whatever happens in town 1, it will be common knowledge that your interaction in town 2 is the last — nobody else is watching, so there is no reputation to establish."*

**In a perfect-information game uncertainty is ruled out by definition.** Reputation, deterrence and signalling are therefore impossible there — and become available only in Ch 14, where a small probability `p ≥ ⅓` that the incumbent is "hotheaded" makes fighting credible.

### Expected utility: what rationality does and does not dictate

Four axioms — **Completeness/transitivity, Monotonicity, Continuity, Independence** — guarantee a vNM utility function whose *expected value* represents the ranking (Thm 4.1), unique up to a **positive affine transformation** (Thm 4.2). Hence "cardinal", but differences of utility have no absolute meaning.

> **Rationality does not and cannot dictate an attitude to risk** (Remark 4.1). *De gustibus non est disputandum.* Risk **neutrality** pins down the whole ranking of money lotteries; risk aversion and risk loving pin down nothing.

Never ask someone for her utility function. Ask for her **ranking**, then for the indifference probability against the best/worst lottery — at most `m−1` questions, none using the word "utility".

### Knowledge, certainty, and common knowledge

Knowledge is containment: `KE = {w : ℐ(w) ⊆ E}`. It satisfies `KE ⊆ E` (**veridical**), `KKE = KE`, `K¬KE = ¬KE`. Keep `¬KG` ("doesn't know `G`") apart from `K¬G` ("knows `G` is false"): `K¬G ⊆ ¬KG`, never the reverse.

> **Knowledge is always true; certainty can be false.** `P(E) = 1` is compatible with `E` being false (Remark 8.1). Never treat probability 1 as knowledge.

**Common knowledge** looks like an infinite hierarchy but is one containment check: merge overlapping information sets across **all** agents to get the **common knowledge partition**, then `CKE = {w : ℐ_CK(w) ⊆ E}` (Thm 7.1). The payoff: **a public announcement of something everyone already knows can be decisive**, because it upgrades mutual knowledge to common knowledge (three-hats puzzle: knowledge to depth 2, nothing at depth 3).

Design rule from Example 7.1: **coordination strategies must condition on events that are common knowledge when they occur.**

### Belief updating vs. belief revision

**Updating** = conditional probability; requires `P(E) > 0`. **AGM revision** handles surprising information (`P(E) = 0`) via a **plausibility order** + a full-support prior: take the most plausible states inside the information received, then condition. Updating is a **special case** of revision.

This distinction exists because dynamic games routinely reach information sets that the initial beliefs gave probability 0 — which is exactly the problem of Part IV.

**Aumann's Agreement Theorem**: two **like-minded** (Harsanyi-consistent, i.e. common-prior) individuals **cannot agree to disagree** once the disagreement is common knowledge. They *can* disagree, and even *know* they disagree — the two-scientists example converges to agreement through e-mail, and lands **farther from the truth** than where it started. **Agreement is not accuracy.**

### The Part IV refinements, and what each buys

Move from a strategy profile to an **assessment** `(σ, μ)`: behavioral strategies **plus** beliefs at every information set. Then:

| Notion | Requires | Excludes | Leaves open |
|---|---|---|---|
| **Weak sequential** | sequential rationality + Bayesian updating at **reached** sets | strictly dominated choices | off-path beliefs entirely free ⟹ doesn't refine SPE |
| **Sequential** (Kreps–Wilson) | + KW-consistency (a **limit** of completely mixed profiles) | beliefs contradicting `σ` | weakly dominated choices; and the limit is "a rather opaque technical assumption" |
| **Perfect Bayesian** (Bonanno) | + AGM-consistency (plausibility order) + Bayes consistency | same as sequential, interpretably | belief **reversal** |

**Sequential rationality means whole-strategy optimality from `H` onward** — check joint deviations at `H` *and* at your own later information sets, not one node at a time.

**Theorem 12.5 is the book's own contribution**: sequential equilibrium = perfect Bayesian equilibrium + **choice measurability** + **uniform Bayesian consistency** — a characterization free of limits, answering the complaint that Kreps and Wilson themselves voiced about their own definition.

### Incomplete information

**Incomplete ≠ imperfect.** Imperfect = you don't know past *moves*. Incomplete = you don't know the *game*.

Model it by letting **states carry games**, then apply the **Harsanyi transformation**: Nature picks the state, informed players observe, uninformed players don't. Nature's probabilities are the uninformed player's beliefs (one-sided) or a **common prior** (otherwise) — and **without a common prior the transformation cannot be carried out at all**.

Three warnings the book insists on:
- **Designate the true state.** "Almost never done in the literature", but the transformation destroys that information.
- A Bayesian Nash equilibrium **need not** induce a Nash equilibrium in the true game.
- In **dynamic** games, do **not** use Bayesian Nash equilibrium — it tolerates dominated choices at unreached sets. Use subgame-perfect or weak sequential equilibrium.
- **Know your preferences, not your payoff** (Remark 13.1). Being uncertain what outcome your own action produces is fully rational — which is why the general type-space definition (Def 15.2) indexes utility by the **whole** type profile.

**Off-path beliefs are the design variable.** Skepticism — reading every claim in the way least favorable to the seller — is what turns a toothless truth-in-advertising law into full disclosure (Milgrom–Roberts).

---

## Chapter Index

| # | Title | Key Frameworks |
|---|-------|----------------|
| [ch00](chapters/ch00-introduction.md) | Introduction | cooperative vs. non-cooperative, the ordinal→cardinal→informational ladder, state-space over type-space |
| [ch01](chapters/ch01-ordinal-games-strategic-form.md) | Ordinal games in strategic form | game-frame vs. game, ordinal utility, strict/weak dominance, Pareto superiority, Vickrey auction, Clarke pivotal mechanism, IDSDS, IDWDS, Nash equilibrium, underlining method, Cournot |
| [ch02](chapters/ch02-dynamic-games-perfect-information.md) | Dynamic games with perfect information | extensive form, backward induction, strategy as contingent plan, incredible threats, Selten's chain store, win-lose determinacy (Thms 2.2, 2.3) |
| [ch03](chapters/ch03-general-dynamic-games.md) | General dynamic games | information sets, perfect recall, proper & minimal subgames, subgame-perfect equilibrium + algorithm, chance moves, risk neutrality |
| [ch04](chapters/ch04-expected-utility.md) | Expected Utility | risk attitudes, vNM representation (Thm 4.1) and uniqueness (Thm 4.2), normalized utility, elicitation, the four axioms, compound lotteries |
| [ch05](chapters/ch05-mixed-strategies.md) | Mixed strategies in strategic-form games | mixed strategies, Nash existence (Thm 5.1), equalization (Thm 5.2), best-reply functions, Pearce (Thm 5.3), cardinal IDSDS, rationalizability |
| [ch06](chapters/ch06-dynamic-games-cardinal-payoffs.md) | Dynamic games with cardinal payoffs | behavioral strategies, Kuhn's theorem, SPE existence (Thm 6.2), the choice-vs-strategy distinction |
| [ch07](chapters/ch07-knowledge-common-knowledge.md) | Knowledge and Common Knowledge | information partitions, knowledge operator, interactive knowledge, common knowledge, reachability, CK partition (Thm 7.1) |
| [ch08](chapters/ch08-adding-beliefs-to-knowledge.md) | Adding Beliefs to Knowledge | certainty vs. knowledge, Bayesian updating, Bayes' rule, AGM belief revision, plausibility orders, common prior, Agreement Theorem |
| [ch09](chapters/ch09-common-knowledge-of-rationality.md) | Common knowledge of rationality | model of a game, rationality at a state, `CKR`, IDSDS characterization (Thms 9.1, 9.2), why dynamic models are hard |
| [ch10](chapters/ch10-weak-sequential-equilibrium.md) | A First Attempt: Weak Sequential Equilibrium | assessments, sequential rationality, Bayesian updating at reached sets, weak sequential equilibrium |
| [ch11](chapters/ch11-sequential-equilibrium.md) | Sequential Equilibrium | KW-consistency, sequential equilibrium, Thms 11.1/11.2, the two objections, trembling-hand perfection |
| [ch12](chapters/ch12-perfect-bayesian-equilibrium.md) | Perfect Bayesian Equilibrium | history-based form, plausibility order PL1–PL3, AGM-consistency, Bayes consistency, IND1–IND3, choice measurability, Thm 12.5 |
| [ch13](chapters/ch13-incomplete-information-static.md) | Incomplete Information: Static Games | incomplete vs. imperfect, Harsanyi transformation, Bayesian Nash equilibrium, pooling/separating, one-/two-/multi-sided |
| [ch14](chapters/ch14-incomplete-information-dynamic.md) | Incomplete Information: Dynamic Games | reputation via types, signalling, strikes as credible signals, Milgrom–Roberts disclosure |
| [ch15](chapters/ch15-type-space-approach.md) | Incomplete Information: the type-space approach | types, static Bayesian games (Defs 15.1, 15.2), state-space ⟷ type-space conversion |

## Topic Index

- **AGM belief revision** → ch08, ch12
- **Agreement Theorem / agreeing to disagree** → ch08
- **Assessment** → ch10, ch11, ch12
- **Auctions (first-price, second-price/Vickrey)** → ch01, ch05
- **Backward induction** → ch02, ch03, ch06
- **Bayes' rule / Bayesian updating** → ch08, ch10
- **Bayesian Nash equilibrium** → ch13, ch14
- **Behavioral strategies / Kuhn's theorem** → ch06
- **Best reply** → ch01, ch05
- **Cardinal payoffs** → ch04, ch05, ch06
- **Chain store / reputation** → ch02, ch14
- **Chance moves / Nature** → ch03, ch06, ch13
- **Choice measurability** → ch12
- **Common knowledge** → ch07, ch09, ch13
- **Common knowledge of rationality** → ch09, ch01, ch05
- **Common prior / Harsanyi consistency** → ch08, ch13, ch15
- **Compound lotteries** → ch04
- **Cournot competition** → ch01, ch13
- **Dominance (strict, weak, mixed)** → ch01, ch05
- **Dominant-strategy equilibrium** → ch01
- **Expected utility** → ch04, ch03
- **Extensive form** → ch02, ch03, ch06, ch12
- **Frame vs. game** → ch01, ch02, ch03, ch05
- **Harsanyi transformation** → ch13, ch14
- **History-based games** → ch12
- **IDSDS / IDWDS** → ch01, ch05, ch09
- **Imperfect information** → ch03
- **Incomplete information** → ch13, ch14, ch15
- **Incredible threats** → ch02
- **Independence conditions (IND1–IND3)** → ch12
- **Information sets** → ch03, ch07
- **Knowledge operator** → ch07, ch09
- **Mechanism design (Vickrey, Clarke)** → ch01
- **Mixed strategies** → ch05, ch06
- **Nash equilibrium** → ch01, ch05
- **Ordinal utility** → ch01
- **Pareto superiority** → ch01
- **Perfect Bayesian equilibrium** → ch12, ch14
- **Perfect recall** → ch03, ch06
- **Pivotal (Clarke) mechanism** → ch01
- **Plausibility order** → ch08, ch12
- **Pooling / separating equilibrium** → ch13, ch14
- **Prisoner's Dilemma** → ch01
- **Rationalizability** → ch05, ch09
- **Risk attitudes** → ch03, ch04
- **Sequential equilibrium** → ch11, ch12
- **Sequential rationality** → ch10, ch11, ch12
- **Signalling** → ch14
- **Strikes / labor negotiation** → ch14
- **Subgames / subgame-perfect equilibrium** → ch03, ch06
- **Trembling-hand perfection** → ch11
- **Truth-in-advertising / disclosure** → ch14
- **Types / type space** → ch15, ch13
- **Weak sequential equilibrium** → ch10, ch13, ch14
- **Win-lose games / determinacy** → ch02

## Supporting Files

- [glossary.md](glossary.md) — every key term with a one-line definition and chapter reference
- [patterns.md](patterns.md) — the book's procedures as executable recipes (when to use / how / trade-offs)
- [cheatsheet.md](cheatsheet.md) — solution-concept decision tree, refinement ladder, thresholds, tells & smells

---

## Scope & Limits

This skill covers the book's content only: **non-cooperative** game theory, static and dynamic, with ordinal and cardinal payoffs, plus the epistemic foundations and incomplete information. It does **not** cover cooperative game theory, repeated games as such, evolutionary game theory, trembling-hand perfection (explicitly outside the book's scope), or mechanism design beyond the Vickrey and Clarke examples. The book contains **165 solved exercises** in Appendix E/S of each chapter — these chapter summaries carry the frameworks and worked examples, not the exercise solutions; consult the source PDF for those. For applying these frameworks to a specific model or codebase, combine with project-specific tools.
