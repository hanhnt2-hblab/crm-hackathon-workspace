# Chapter 12: Perfect Bayesian Equilibrium

## Core Idea
Replace Kreps–Wilson's limit condition with a **plausibility order on histories** (AGM belief revision) plus **Bayesian updating as long as possible**. The result refines subgame-perfect equilibrium, has a clear interpretation, and — with two further conditions (**choice measurability** + **uniform Bayesian consistency**) — yields a characterization of sequential equilibrium **free of limits**.

## Frameworks Introduced

- **History-based extensive form** (Appendix 12.A): identify a node with the **sequence of actions from the root** to it — a **history**. The root is the null history `∅`. `A(h)` = actions available at `h`; `ha` = `h` with `a` appended; `I(h)` = the information set containing `h`; `D` = decision histories.
  - Payoff: nodes no longer need labels — refer to them by their histories (`adf`, `bfe`, …).

- **Plausibility order** (Def 12.1): a **total pre-order** `⪯` (complete + transitive) on `H` satisfying, for all `h ∈ D`:
  - **PL1**: for all `a ∈ A(h)`, `h ⪯ ha`. — *Appending an action cannot make a history more plausible.*
  - **PL2**: (i) there exists `a ∈ A(h)` with `h ~ ha`; (ii) if `h ~ ha` then `h′ ~ h′a` for all `h′ ∈ I(h)`. — *Every decision history has at least one **plausibility-preserving** action, and such an action plays the same role everywhere in the information set.*
  - **PL3**: if `h` is assigned to chance, then `h ~ ha` for all `a ∈ A(h)`. — *All of Nature's actions are plausibility-preserving.*
  - Notation: `h ⪯ h′` = "`h` is at least as plausible as `h′`"; **lower is more plausible**.
  - **Display convention**: write equivalence classes as rows, most plausible at the top. Same row ⟹ `~`; higher row ⟹ `≺`.

- **AGM-consistency** (Def 12.2): `(σ, μ)` is **AGM-consistent** if some plausibility order `⪯` satisfies
  - **(P1)** `σ(a) > 0` **iff** `h ~ ha` — the positive-probability actions are **exactly** the plausibility-preserving ones;
  - **(P2)** `μ(h) > 0` **iff** `h ⪯ h′` for all `h′ ∈ I(h)` — the positive-probability histories are **exactly** the most plausible ones in their information set.
  - Such a `⪯` is said to **rationalize** `(σ, μ)`.
  - **Nature of the condition**: purely **qualitative** — it constrains only the *supports*, not how probability is distributed on them.
  - **Proof technique for ruling things out**: derive `~` and `≺` relations from P1 and P2, then invoke **transitivity** to reach a contradiction.

- **Bayesian (Bayes) consistency relative to `⪯`** (Def 12.3) — the **quantitative** half, encoding "**Bayesian updating as long as possible**":
  1. When information causes **no surprises** (positive prior probability), beliefs must come from Bayesian updating.
  2. When information **is surprising**, new beliefs may be formed **arbitrarily**, but from then on Bayesian updating must be used on those new beliefs.
  - Formally, for every equivalence class `E` of `⪯` with `E ∩ D_μ⁺ ≠ ∅` (where `D_μ⁺ = {h ∈ D : μ(h) > 0}`) there must exist a probability distribution `ν_E: H → [0,1]` with
    - **B1**: `ν_E(h) > 0` **iff** `h ∈ E ∩ D_μ⁺`.
    - **B2**: if `h, h′ ∈ E ∩ D_μ⁺` and `h′ = ha₁…a_m` then `ν_E(h′) = ν_E(h)·σ(a₁)·…·σ(a_m)`. — *`ν_E` is consistent with `σ`.*
    - **B3**: if `h ∈ E ∩ D_μ⁺` then for every `h′ ∈ I(h)`, `μ(h′) = ν_E(h′ | I(h)) = ν_E(h′) / Σ_{h″∈I(h)} ν_E(h″)`. — *`μ` is the conditional-probability rule applied to `ν_E`.*

- **Perfect Bayesian equilibrium** (Def 12.4): an assessment `(σ, μ)` that is (1) **sequentially rational**, (2) **rationalized by a plausibility order**, and (3) **Bayesian relative to that order**.

- **Theorem 12.1 (Bonanno 2013)**: if `(σ, μ)` is a perfect Bayesian equilibrium then (1) `σ` is a **subgame-perfect equilibrium** and (2) `(σ, μ)` is a **weak sequential equilibrium**. The refinement is **strict** (Fig 12.2).

- **Theorem 12.2 (Bonanno 2013)**: every **sequential** equilibrium is a **perfect Bayesian** equilibrium. Not conversely (Fig 12.7).

- **Theorem 12.3**: every finite extensive-form game with cardinal payoffs has at least one perfect Bayesian equilibrium (corollary of Thm 11.2 + Thm 12.2).

- **The two independence conditions** (§12.4) — restrictions that rule out *reversal of judgment about one player after observing an unexpected move by a different player*:
  - **IND1** (qualitative): if `h′ ∈ I(h)` and `a ∈ A(h)`, then `h ⪯ h′` **iff** `ha ⪯ h′a`. — *Observing a new action cannot change the relative plausibility of prior histories.*
  - **IND2** (qualitative): if `h′ ∈ I(h)` and `a, b ∈ A(h)`, then `ha ⪯ hb` **iff** `h′a ⪯ h′b`. — *The implicit ranking of actions is the same at every history in the information set.*
  - **Remark 12.1**: IND1 and IND2 are **independent** of each other (Exercises 12.7, 12.8).
  - **IND3** (quantitative, "weak independence" of `μ`): if `h′ ∈ I(h)`, `a ∈ A(h)`, `ha′ ∈ I(ha)` and `{h, h′, ha, h′a} ⊆ D_μ⁺`, then `μ(h)/μ(h′) = μ(ha)/μ(h′a)`.
  - **Independent perfect Bayesian equilibrium** (Def 12.5): a perfect Bayesian equilibrium rationalized by an order satisfying **IND1 and IND2**, with `μ` satisfying **IND3**.
  - **Theorem 12.4**: every sequential equilibrium is an independent perfect Bayesian equilibrium. **Strictly** (Exercise 12.10).
  - Caution: IND1 does **not** imply IND3 (Fig 12.10).

- **Closing the gap** (§12.5) — the two strengthenings that exactly characterize sequential equilibrium:
  - **Integer-valued representation** (Def 12.6): `F: H → ℕ` with `F(h) ≤ F(h′)` **iff** `h ⪯ h′`. Analogous to an ordinal utility function, but with **lower values for more plausible** histories. WLOG `F(∅) = 0` (Remark 12.2). One always exists (Remark 12.3): peel off `H₀` = most plausible, `H₁` = most plausible of the rest, …, and set `F(h) = k` iff `h ∈ H_k`.
  - **Choice measurability** (Def 12.7): `⪯` is **choice measurable** if some integer-valued representation `F` satisfies, for all `h ∈ D`, `h′ ∈ I(h)`, `a ∈ A(h)`,
    ```
    F(h) − F(h′) = F(ha) − F(h′a)        (CM)
    ```
    Reading: `F` measures "**plausibility distance**", and CM is a **distance-preserving** condition — the distance between two histories in the same information set is preserved by appending the same action.
  - **Uniform Bayesian consistency** (Def 12.8): there is a **full-support common prior** `ν: D → (0,1]` of the collection `{ν_E}` with
    - **UB1**: if `a ∈ A(h)` and `ha ∈ D` then (1) `ν(ha) ≤ ν(h)` and (2) if `σ(a) > 0` then `ν(ha) = ν(h)·σ(a)`. *(Always achievable — Remark 12.4.)*
    - **UB2**: if `a ∈ A(h)`, `h, h′` are in the same information set and `ha, h′a ∈ D`, then `ν(h)/ν(h′) = ν(ha)/ν(h′a)`. — *the relative prior probability of two histories in one information set is unchanged by appending the same action.*
  - Choice measurability and uniform Bayesian consistency are **independent** (Fig 12.7 satisfies the second but not the first; Fig 12.10's PBE satisfies the first but not the second).
  - **Theorem 12.5 (Bonanno 2015)** — the main result: `(σ, μ)` is a **sequential equilibrium** **⟺** it is a **perfect Bayesian equilibrium rationalized by a choice-measurable plausibility order and uniformly Bayesian relative to it.**
    - Payoff: *a characterization of sequential equilibrium free of the questionable requirement of taking limits of sequences of completely mixed strategies* — the direct answer to Ch 11 §11.3. Theorem 12.4 is proved from it.

## Key Concepts
- **KW-consistency vs. AGM-consistency** — Kreps–Wilson's limit condition (Ch 11) vs. this chapter's plausibility-order condition. They are different notions; the chapter renames the former to keep them apart.
- **Plausibility-preserving action** — an `a` with `h ~ ha`; by P1 exactly the actions given positive probability.
- **`D_μ⁺`** — the decision histories to which `μ` assigns positive probability.
- **Total pre-order** — complete and transitive; allows ties (`~`).
- **Belief revision policy** — the reading of `μ` either as an external observer's view or as a policy shared by all players.

## Reference Tables

The complete hierarchy (Figs 12.9 + 12.11):

```
Nash equilibria
  ⊃ Subgame-perfect equilibria
      ⊃ Perfect Bayesian equilibria                          (Thm 12.1)
          ⊃ Independent perfect Bayesian equilibria          (Def 12.5)
              ⊃ Sequential equilibria                        (Thm 12.4, strict)
Perfect Bayesian ⊂ Weak sequential                            (Thm 12.1(2))
```

The two halves of perfect Bayesian equilibrium:

| Condition | Kind | Constrains | Mechanism |
|---|---|---|---|
| AGM-consistency (Def 12.2) | **qualitative** | the **supports** of `σ` and `μ` | plausibility order, P1 + P2 |
| Bayes consistency (Def 12.3) | **quantitative** | the actual **probabilities** | `ν_E` on each equivalence class, B1–B3 |
| Sequential rationality (Def 10.2) | — | optimality of `σ` given `μ` | every information set |

Sequential equilibrium = PBE + these two (Thm 12.5):

| Strengthening | Of what | Condition |
|---|---|---|
| **Choice measurability** | the plausibility order | `F(h) − F(h′) = F(ha) − F(h′a)` |
| **Uniform Bayesian consistency** | the `ν_E` collection | full-support common prior with UB1 + UB2 |

## Worked Example

**1 — Killing a subgame-perfect equilibrium with transitivity alone (Fig 12.2).** `σ = (c, d, f)` is a Nash and (no proper subgames) **subgame-perfect** equilibrium. Can it be part of a sequentially rational AGM-consistent assessment?

For Player 3, `f` is rational only with sufficiently high probability on history `be`, so sequential rationality requires `μ(be) > 0`. Now suppose `⪯` rationalizes `(σ, μ)`:

```
σ(d) = 1 > 0   ⟹ (P1)   b ~ bd
σ(e) = 0       ⟹ (P1 + PL1)   b ≺ be
μ(be) > 0      ⟹ (P2)   be ⪯ bd
```

By transitivity, `b ≺ be` and `b ~ bd` give **`bd ≺ be`** — contradicting `be ⪯ bd`. **No such assessment exists.** Note the whole argument is qualitative; no probability arithmetic was needed.

*What does work*: `σ(c) = 1, σ(d) = σ(e) = ½, σ(f) = σ(g) = ½` with `μ(bd) = μ(be) = ½`, rationalized by

```
∅, c                                      ← most plausible
b, bd, be, bdf, bdg, bef, beg
a, af, ag                                 ← least plausible
```

**2 — Verifying Bayes consistency end to end (Figs 12.4 → 12.6).** Assessment
```
σ = (a:0, b:0, c:1 | d:1, e:0 | f:⅓, g:⅔)      μ = (ad:¼, ae:0 ; b:¾, a:¼, bf:¼, bg:2⁄4)
```
*AGM-consistency* via the order

```
E = {∅, c}                                                       ← most plausible
F = {a, b, ad, bf, bg, adf, adg, bfd, bgd}
G = {ae, aef, aeg, bfe, bge}                                     ← least plausible
```

*Bayes consistency.* `D_μ⁺ = {∅, a, ad, b, bf, bg}`. Only `E` and `F` meet `D_μ⁺`, so only two distributions are needed.

- `ν_E`: trivially `ν_E(∅) = 1`.
- `ν_F`: by B1 its support must be `{a, ad, b, bf, bg}`. Take
  ```
  ν_F = (a: ⅛, ad: ⅛, b: ⅜, bf: ⅛, bg: 2⁄8)
  ```
  **B2 check** — each must equal its predecessor times the action probabilities:
  ```
  ν_F(ad) = ⅛ = ν_F(a)·σ(d) = (⅛)(1)  ✓
  ν_F(bf) = ⅛ = ν_F(b)·σ(f) = (⅜)(⅓)  ✓
  ν_F(bg) = 2⁄8 = ν_F(b)·σ(g) = (⅜)(⅔) ✓
  ```
  **B3 check** — conditioning `ν_F` on each information set must reproduce `μ`. With `I₂ = {a, bf, bg}` and `I₃ = {b, ad, ae}`, both have `ν_F(Iᵏ) = 4⁄8`:
  ```
  μ(a)  = (⅛)/(4⁄8) = ¼ ✓     μ(bf) = (⅛)/(4⁄8) = ¼ ✓     μ(bg) = (2⁄8)/(4⁄8) = 2⁄4 ✓
  μ(b)  = (⅜)/(4⁄8) = ¾ ✓     μ(ad) = (⅛)/(4⁄8) = ¼ ✓     μ(ae) = 0/(4⁄8) = 0  ✓
  ```

*Sequential rationality* (Fig 12.6). Player 3: `f` gives `¼(0) + 0(1) + ¾(1) = ¾`; `g` gives `¼(3) + 0(2) + ¾(0) = ¾` → indifferent, so the mix `(f:⅓, g:⅔)` is rational. Player 2: `d` gives `2` and `e` gives `5⁄4` → `d` is rational. Player 1: `c` gives `2`, `a` gives `⅓`, `b` gives `5⁄3` → `c` is rational. **Perfect Bayesian equilibrium.**

**3 — A PBE that is NOT a sequential equilibrium, and the belief-reversal that causes it (Fig 12.7).** `σ = (c, d, g)` with degenerate beliefs `μ(a) = μ(be) = 1`, rationalized by

```
∅, c            most plausible        ν_{∅,c}(∅) = 1
a, ad                                 ν_{a,ad}(a) = 1
b, bd                                 —
be, beg                               ν_{be,beg}(be) = 1
ae, aeg                               —
bef                                   —
aef             least plausible       —
```

The **belief revision policy** this encodes — readable either as an external observer's view or as one shared by all players:

> Initially, believe Player 1 plays `c`. On learning she did **not** play `c`, become convinced she played `a` (judge `a ≺ b`) and expect Player 2 to play `d`. On further learning that Player 2 did **not** play `d`, become convinced she played `b` and Player 2 played `e` (judge `be ≺ ae`) — **reversing the earlier judgment that `a` was more plausible than `b`.**

This is perfectly AGM-rational, but **not KW-consistent**. Proof: for any sequence `σₙ` with `σₙ = (a: pₙ, b: qₙ, c: 1−pₙ−qₙ | d: 1−rₙ, e: rₙ | f: tₙ, g: 1−tₙ)` and all of `pₙ, qₙ, rₙ, tₙ → 0`, Bayesian updating gives

```
μₙ(a)  = pₙ/(pₙ+qₙ)                          μₙ(b)  = qₙ/(pₙ+qₙ)
μₙ(ae) = pₙrₙ/(pₙrₙ+qₙrₙ) = pₙ/(pₙ+qₙ)       μₙ(be) = qₙ/(pₙ+qₙ)
```

So `μₙ(a) = μₙ(ae)` **identically**. Therefore `lim μₙ(a) = 1` forces `lim μₙ(ae) = 1`, i.e. `μ(ae) = 1 ≠ 0`. **Contradiction.** The `rₙ` cancels — a belief reversal is exactly what a single sequence cannot produce.

*Diagnosis via §12.5*: any order rationalizing this must have `a ≺ b` **and** `be ≺ ae`, so any integer representation would need `F(b) − F(a) > 0` and `F(be) − F(ae) < 0` — violating **CM**. The order is **not choice measurable**. It *is* uniformly Bayesian (take `ν` uniform on `D = {∅, a, b, ae, be}`: UB1 holds and `ν(a)/ν(b) = 1 = ν(ae)/ν(be)`). Exactly one of the two Thm 12.5 conditions fails.

*Also*: this assessment violates **IND1**, since it requires `a ≺ b` and `be ≺ ae`.

**4 — IND1 without IND3 (Fig 12.10).** `σ = (c, d, g)` with `μ = (a:½, b:½ ; ae:¼, be:¾)` is rationalized by

```
∅, c                     most plausible
a, b, ad, bd
ae, be, aeg, beg
aef, bef                 least plausible
```

**IND1 holds**: `a ~ b`, `ad ~ bd`, `ae ~ be`. But **IND3 fails**:

```
μ(a)/μ(b) = 1        while       μ(ae)/μ(be) = (¼)/(¾) = ⅓
```

So a qualitatively independent order is compatible with quantitatively non-independent beliefs. Conversely, the *same* strategy profile with `μ = (a:¾, b:¼ ; ae:¼, be:¾)` is rationalized by a **choice-measurable** order but **cannot** be uniformly Bayesian relative to any rationalizing order — the two Thm 12.5 conditions are genuinely independent.

## Key Takeaways
1. **Separate the qualitative from the quantitative.** AGM-consistency constrains *supports* via a plausibility order; Bayes consistency constrains *probabilities* via `ν_E`. Check them separately.
2. To rule out a candidate assessment, derive `~`/`≺` relations from **P1 and P2 and PL1**, then hit a **transitivity** contradiction. Usually no arithmetic is needed.
3. To verify Bayes consistency: identify `D_μ⁺`, find which equivalence classes meet it, construct one `ν_E` per class, then check **B2** (consistency with `σ`) and **B3** (conditioning reproduces `μ`).
4. **"Bayesian updating as long as possible"** is the design principle: free choice of beliefs at the moment of surprise, strict Bayes discipline before and after.
5. Perfect Bayesian equilibrium **strictly refines subgame-perfect equilibrium** and is **strictly weaker** than sequential equilibrium (Thms 12.1, 12.2). Existence is guaranteed (Thm 12.3).
6. What separates PBE from sequential equilibrium is **belief reversal**: PBE tolerates revising your judgment about *player 1* after an unexpected move by *player 2*. If you find that unacceptable, impose IND1/IND2/IND3.
7. **IND1 does not imply IND3.** Qualitative independence of the order is weaker than quantitative independence of the beliefs.
8. **Theorem 12.5 is the payoff of the chapter**: sequential equilibrium = PBE + **choice measurability** + **uniform Bayesian consistency**. This replaces Ch 11's limits with two checkable, interpretable conditions.
9. To show an order is **not choice measurable**, exhibit two same-information-set pairs whose plausibility gaps must have **opposite signs** under the addition of a common action.
10. Use **history-based notation** for anything in this chapter — the conditions are all stated about histories `h`, `ha`, and appending common actions.

## Connects To
- **Ch 8 §8.3**: AGM belief revision, plausibility orders, and Theorem 8.1 (Grove/Bonanno) — the entire conceptual foundation, deliberately placed there for this chapter.
- **Ch 10**: sequential rationality (Def 10.2) is imported unchanged; Thm 12.1(2) relates PBE back to weak sequential equilibrium.
- **Ch 11 §11.3**: the complaint about limits that Theorem 12.5 answers; **KW-consistency** is renamed here to avoid confusion with AGM-consistency.
- **Ch 3 / Ch 6**: subgame-perfect equilibrium, the notion being refined.
- **Ch 13–14**: perfect Bayesian equilibrium is the solution concept applied to dynamic games of incomplete information.
- **Alchourrón–Gärdenfors–Makinson (1985)**, **Bonanno (2011, 2013, 2015)**: the AGM axioms and the theorems of this chapter.
