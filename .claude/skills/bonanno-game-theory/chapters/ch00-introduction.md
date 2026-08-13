# Chapter 0: Introduction

## Core Idea
Game theory is a formal language for interactive situations where several players take actions that jointly determine the outcome; this book covers **non-cooperative** game theory only, for **Homo rationalis** — players who act purposefully and logically toward well-defined goals.

## Frameworks Introduced

- **Cooperative vs. non-cooperative game theory**: the top-level branch split.
  - When to use: before choosing any solution concept, decide which branch you are in.
  - How: ask *can the players sign binding agreements?* Yes → cooperative (coalitions, voting power). No → non-cooperative (this book). "No" covers both "cannot communicate" and "can communicate but agreements are unenforceable" (e.g. antitrust law makes price-fixing illegal).

- **The ordinal → cardinal → informational ladder** (the book's architecture):
  - When to use: to locate which chapter answers your question, and to know what you are *entitled* to assume.
  - How: escalate only as far as the problem requires.
    1. **Ordinal payoffs** (Part I, Ch 1–3) — you know only the ranking `o ≻ o′`. Buys you: dominance, IDSDS, Nash, backward induction, subgame-perfect equilibrium.
    2. **Cardinal payoffs** (Part II, Ch 4–6) — players rank *lotteries* over outcomes, so expected utility is meaningful. Buys you: mixed strategies, mixed-strategy Nash.
    3. **Knowledge & belief** (Part III, Ch 7–9) — model what players know about what others know. Buys you: the epistemic *justification* of the solution concepts above.
    4. **Refinements** (Part IV, Ch 10–12) — weak sequential → sequential → perfect Bayesian equilibrium, for dynamic games where subgame-perfection is too weak.
    5. **Incomplete information** (Part V, Ch 13–15) — players are uncertain about the game itself.

- **State-space over type-space** (the author's deliberate methodological choice):
  - When to use: whenever you model incomplete information.
  - How: Harsanyi's standard treatment uses "types". Bonanno instead reuses the interactive knowledge-belief structures of Part III (the state-space approach) as "simpler and more elegant", and only in Ch 15 shows the two are equivalent and how to convert between them.

## Key Concepts
- **Player** — an "entity" whose actions affect others. Its nature is context-dependent: non-thinking organisms in evolutionary biology, artificial agents in computer science, ordinary humans in behavioral game theory.
- **Homo rationalis** — Aumann's term for the idealized agent game theory traditionally studies: always acts purposefully and logically, has well-defined goals, is motivated solely by approaching those goals, and has the calculating ability to do so.
- **Interactive situation** — a situation where several players take actions that affect each other; the primitive object game theory formalizes.
- **Game-frame vs. game** — the frame is the situation without preferences; adding preferences makes it a game (developed in Ch 1).
- **Appendix E / Appendix S** — every chapter ends with Appendix E (exercises, grouped by section) and Appendix S (complete detailed solutions). 165 solved exercises total.
- **Challenging question** — the final exercise of each chapter's Appendix E; harder and more time-consuming than the rest.

## Mental Models
- **Think of game theory as a language, not a predictor.** It provides "a formal language for the representation and analysis of interactive situations". Its first job is to make a situation precise enough to reason about, not to output a prediction.
- **Use the branch test before the solution concept.** Reaching for Nash equilibrium in a setting where binding contracts exist is a category error — you are in cooperative game theory.
- **Treat "the players are rational" as an assumption you are importing, not a fact you observed.** The book is explicit that the traditional focus on Homo rationalis is a choice; behavioral and evolutionary game theory substitute different player models into the same formalism.

## Anti-patterns
- **Assuming players are selfish and greedy**: "a common mistake (unfortunately one that even game theorists sometimes make)". Experimental psychology, philosophy and economics show many people are strongly motivated by fairness — as are primates. Selfishness is an assumption to be stated, never a default.
- **Treating a non-binding agreement as binding**: in non-cooperative game theory the whole point is that the agreement is not enforceable, so it only holds if no player gains by deviating.
- **Reading the concepts without solving the exercises**: "In game theory, as in mathematics in general, it is essential to test one's understanding of the material by attempting to solve exercises." The book is built so that each section ends by sending you to its exercises.

## Worked Example
**Reading the book's structure as a decision procedure.** You face a problem: two firms choose prices simultaneously, each knows the other's cost function, and each wants maximum profit.

1. *Cooperative or non-cooperative?* Price-fixing agreements are illegal and unenforceable → **non-cooperative**.
2. *Do I need cardinal payoffs?* No randomization is required to state the problem, and profit already gives a ranking → start with **ordinal** (Part I). If no equilibrium exists in pure strategies (as in Matching Pennies), escalate to Part II for mixed strategies, which requires the expected-utility machinery of Ch 4.
3. *Static or dynamic?* Simultaneous → **strategic form** (Ch 1), not extensive form (Ch 2–3).
4. *Is the game itself common knowledge?* Yes, by hypothesis → stay out of Part V.
5. → **Ch 1** is the chapter; Cournot competition in §1.7 is the closest worked model.

Now change one premise — the firms do *not* know each other's costs. Step 4 flips, and the problem moves to **Ch 13** (incomplete information, static games), which in turn depends on the knowledge-belief structures of **Ch 7–8**. That dependency is why the advanced parts sit where they do.

## Key Takeaways
1. Determine cooperative vs. non-cooperative first — it decides the entire toolkit.
2. Do not assume selfishness. Preferences are an input you must elicit or state, not infer.
3. Escalate the payoff/information ladder only as far as the problem forces you; ordinal machinery is cheaper and gets you further than expected.
4. Game theory's core contribution is representation; solution concepts come second.
5. Nobel prizes in 1994 (Nash, Harsanyi, Selten), 2005 (Aumann, Schelling), 2007 (Hurwicz, Maskin, Myerson), 2012 (Shapley, Roth) mark the field's applied credibility — the FCC ran a $7-billion spectrum auction on it, with bidders using game theory too.
6. Subgame-perfect equilibrium (Ch 3, 6) is not the end of the story; Part IV exists because it is too permissive in dynamic games.

## Connects To
- **Ch 1**: turns the game-frame/game distinction sketched here into formal definitions.
- **Ch 4**: supplies the expected-utility theory that makes the ordinal → cardinal step legitimate.
- **Ch 7–9**: the knowledge and belief machinery that later justifies IDSDS and Nash epistemically, and that Part V reuses.
- **Mechanism design**: the second-price auction (Ch 1.3) and pivotal mechanism (Ch 1.4) are the book's entry points into designing games rather than solving them.
