# Chapter 15: Incomplete Information — The Type-Space Approach

## Core Idea
Harsanyi's **types** and the book's **state-space** structures are two notations for the same thing, and the conversion is mechanical: **one type per cell of a player's information partition**. The general definition must let a player's utility depend on the **whole type profile**, because a rational player may not know her own payoff.

## Frameworks Introduced

- **The terminological correction (footnote 7)** — worth stating precisely: *strictly speaking there is no such thing as a game of incomplete information.* There are **situations** of incomplete information involving the playing of a game. Harsanyi's contribution was a way to **transform** such a situation into an extensive-form game with imperfect information — and once the Harsanyi transformation is applied, **the resulting game is a game of complete information.** So the "theory of games of incomplete information" is a theory of *representation and transformation*.

- **Why the book uses state spaces**: the interactive knowledge-belief structures of Ch 8 are a special case of an **interactive Kripke structure** (Saul Kripke, 1959/1963 — written while he was still an undergraduate). Well known to logicians and computer scientists, unknown to game theorists at the time. *"Perhaps, if Harsanyi had been aware of Kripke's work he might have developed his theory using those structures."* The author finds them more natural and elegant.

- **Knowledge of one's own payoffs, as a restriction on a state-space model**:
  ```
  if ω, ω′ ∈ Ω and ω′ ∈ ℐᵢ(ω)  then  U_{i,ω} = U_{i,ω′}
  ```
  — a player's utility function does not vary across states within her own information set.

- **Static Bayesian game with knowledge of one's own payoffs** (Def 15.1):
  - a set `I = {1,…,n}` of players;
  - for each `i`, a set `Sᵢ` of strategies (`S` = strategy profiles);
  - for each `i`, a set `Tᵢ` of **types** (`T = T₁ × … × Tₙ`; `T₋ᵢ` = the others' type profiles);
  - for each `i` and each type `tᵢ ∈ Tᵢ`, a utility function **`U_{i,tᵢ}: S → ℝ`**;
  - for each `i` and each `tᵢ`, a probability distribution **`P_{i,tᵢ}: T₋ᵢ → [0,1]`** — type `tᵢ`'s beliefs about the **others' types**.
  - **Interpretation of a type**: *each type of Player `i` represents a utility function of Player `i` **and** Player `i`'s beliefs about the types of the other players.*

- **Harsanyi consistency in type language**: the beliefs of all types are Harsanyi consistent if there is a **common prior** `P: T → [0,1]` with, for every `i` and `tᵢ`,
  ```
  P_{i,tᵢ}(t₋ᵢ) = P((t₋ᵢ, tᵢ)) / Σ_{t′₋ᵢ ∈ T₋ᵢ} P((t′₋ᵢ, tᵢ))
  ```
  i.e. each type's beliefs are `P` conditioned on the event "`i`'s type is `tᵢ`".

- **Static Bayesian game — the general case** (Def 15.2), identical to Def 15.1 except:
  - **a set `Y ⊆ T` of *relevant* profiles of types**;
  - the utility function is indexed by the **whole profile**: for every `i` and every `t ∈ Y`, **`U_{i,t}: S → ℝ`**;
  - the belief restriction: **if `P_{i,tᵢ}(t₋ᵢ) > 0` then `(tᵢ, t₋ᵢ) ∈ Y`.**
  - **Why the generalization is needed**: by Remark 13.1, a rational player may **not know her own payoffs** (though she does know her preferences) — for instance because she is uncertain what outcome a given action will produce. Def 15.1 cannot express that; Def 15.2 can, because `Uᵢ` may vary with the *others'* types.

- **State-space → type-space conversion** (mechanical, 4 steps):
  1. For every Player `i`, **create one type per cell of `i`'s partition**, ensuring **different cells get different types**.
  2. Each state is thereby identified with a **profile of types** (every state lies in exactly one cell of every player's partition).
  3. The probability distribution on each information set of `i` becomes the belief distribution `P_{i,tᵢ}` of the corresponding type over the others' type profiles.
  4. Assign the utility function: under Def 15.1's hypothesis, `U_{i,tᵢ}` is well defined because `Uᵢ` is constant on `i`'s cells. In the **general** case, assign to each type profile the utility function of `i` **at the corresponding state**.

- **Type-space → state-space conversion**:
  1. Let the set of states be **`T`** (Def 15.1) or **`Y`**, the set of relevant type profiles (Def 15.2).
  2. Put `t′ ∈ ℐᵢ(t)` **iff `t′ᵢ = tᵢ`** — two states are indistinguishable to `i` exactly when `i`'s type is the same in both.
  3. Each type's beliefs become a probability distribution over `i`'s corresponding information set.

## Key Concepts
- **Type** — a utility function **plus** beliefs about others' types, bundled. In a state-space model it corresponds exactly to **a cell of the player's information partition**.
- **`Y`, the set of relevant type profiles** — the general case's device for excluding type combinations that no type assigns positive probability to.
- **Interactive Kripke structure** — the general logical structure of which the Ch 8 knowledge-belief structures are a special case.
- **Scope note**: this chapter covers **static** games only.

## Reference Tables

The correspondence, in one table:

| State-space (Ch 13–14) | Type-space (Harsanyi) |
|---|---|
| a state `ω` | a **profile** of types `t` |
| a **cell** of `i`'s partition `ℐᵢ` | a **type** `tᵢ ∈ Tᵢ` |
| probability distribution on `ℐᵢ(ω)` | `P_{i,tᵢ}` over `T₋ᵢ` |
| `U_{i,ω}` (state-dependent utility) | `U_{i,tᵢ}` (Def 15.1) or `U_{i,t}` (Def 15.2) |
| common prior over states | common prior `P` over `T` |
| set of states `Ω` | `T`, or `Y ⊆ T` in the general case |

Def 15.1 vs. Def 15.2:

| | Def 15.1 | Def 15.2 (general) |
|---|---|---|
| Utility indexed by | own type `tᵢ` | **whole profile** `t ∈ Y` |
| Type set restriction | none (`T`) | **`Y ⊆ T`** relevant profiles |
| Belief restriction | none | `P_{i,tᵢ}(t₋ᵢ) > 0 ⟹ (tᵢ,t₋ᵢ) ∈ Y` |
| Can a player be unsure of her own payoff? | **No** | **Yes** |

## Worked Example

**1 — One-sided incomplete information, translated (Fig 15.1 = Fig 13.3).** State-space model: two states `α` (Player 1 type `a`) and `β` (Player 1 type `b`, the **true state**); Player 1's partition is `{α}, {β}`; Player 2's is `{α, β}` with `(⅔, ⅓)`.

Game-frame: `I = {1,2}`, `S₁ = {T,B}`, `S₂ = {L,R}`, `O = {o₁,o₂,o₃,o₄}` with `f((T,L)) = o₁`, `f((T,R)) = o₂`, `f((B,L)) = o₃`, `f((B,R)) = o₄`. State-dependent utilities:

```
U_{1,α} = (o₁:0, o₂:3, o₃:3, o₄:0)      U_{1,β} = (o₁:6, o₂:0, o₃:3, o₄:3)
U_{2,α} = U_{2,β} = (o₁:3, o₂:9, o₃:3, o₄:0)
```

*Translate.* Player 1's partition has **two** cells → **two types**; Player 2's has **one** cell → **one type**:

```
T₁ = {t₁ᵃ, t₁ᵇ}      T₂ = {t₂}      T = {(t₁ᵃ,t₂), (t₁ᵇ,t₂)}
```

Utilities, now over strategy profiles:

```
U_{1,t₁ᵃ} = ((T,L):0, (T,R):3, (B,L):3, (B,R):0)
U_{1,t₁ᵇ} = ((T,L):6, (T,R):0, (B,L):3, (B,R):3)
U_{2,t₂}  = ((T,L):3, (T,R):9, (B,L):3, (B,R):0)
```

Beliefs — each type of Player 1 is certain of Player 2's (only) type; Player 2's single type holds the original `(⅔, ⅓)`:

```
P_{1,t₁ᵃ} = P_{1,t₁ᵇ} = (t₂: 1)          P_{2,t₂} = (t₁ᵃ: ⅔, t₁ᵇ: ⅓)
```

Common prior:

```
P = ((t₁ᵃ,t₂): ⅔,  (t₁ᵇ,t₂): ⅓)
```

Note how the translation *loses nothing*: Player 2's belief is recoverable as `P` conditioned on `t₂`, and Player 1's certainty is recoverable because `T₂` is a singleton.

**2 — Two-sided incomplete information, translated (Fig 15.2 = Fig 13.8).** Three states `α, β, γ` (true state `γ`); games `G` at `β, γ` and `G′` at `α`. Partitions: Player 1 has `{α, β}` with `(½, ½)` and `{γ}`; Player 2 has `{α}` and `{β, γ}` with `(⅓, ⅔)`.

Each player has **two** cells → **two types each**:

```
T₁ = {t₁ᵃ, t₁ᵇ}        T₂ = {t₂ᵃ, t₂ᵇ}
```

Utilities:

```
U_{1,t₁ᵃ} = U_{1,t₁ᵇ} = ((A,C):1, (A,D):0, (B,C):0, (B,D):3)
U_{2,t₂ᵃ} =            ((A,C):3, (A,D):1, (B,C):0, (B,D):1)
U_{2,t₂ᵇ} =            ((A,C):0, (A,D):2, (B,C):0, (B,D):1)
```

Beliefs:

```
P_{1,t₁ᵃ} = (t₂ᵃ: 1)                    P_{1,t₁ᵇ} = (t₂ᵃ: ½, t₂ᵇ: ½)
P_{2,t₂ᵃ} = (t₁ᵃ: ⅔, t₁ᵇ: ⅓)            P_{2,t₂ᵇ} = (t₁ᵇ: 1)
```

Common prior over the four type profiles:

```
P = ((t₁ᵃ,t₂ᵃ): 2⁄4,  (t₁ᵃ,t₂ᵇ): 0,  (t₁ᵇ,t₂ᵃ): ¼,  (t₁ᵇ,t₂ᵇ): ¼)
```

**Read the asymmetry off the translation**: Player 1's two types have the **same utility function but different beliefs** about Player 2's type; Player 2's two types differ in **both** utility function and beliefs. That is exactly the Ch 13 §13.3 point that two-sided incomplete information can arise from uncertainty about *beliefs* alone — here visible as a type distinction with no payoff distinction.

Note also `P((t₁ᵃ,t₂ᵇ)) = 0`: some type profiles are simply never relevant. Def 15.2's `Y` formalizes exactly this.

**3 — The general case: a player who doesn't know her own payoff (Fig 15.3 = Exercise 13.2).** Bill (Player 1) chooses `g` (offer a gift) or `ng`; Ann (Player 2) chooses `a` (accept) or `r`. Bill is a **friend** (probability `p`) or an **enemy** (probability `1−p`); Ann does not know which, though Bill does.

```
Bill is a FRIEND:              Ann: a    Ann: r          Bill is an ENEMY:      Ann: a    Ann: r
  Bill: g                       1, 1     −1, 0             Bill: g              1, −1     −1, 0
  Bill: ng                      0, 0      0, 0             Bill: ng              0, 0      0, 0
```

Translate. Two types of Bill (`t₁ᶠ` friend, `t₁ᵉ` enemy), **one** type of Ann. Here `Y = T`. The utilities:

```
U_{1,(t₁ᶠ,t₂)} = U_{1,(t₁ᵉ,t₂)} = ((g,a):1, (g,r):−1, (ng,a):0, (ng,r):0)

U_{2,(t₁ᶠ,t₂)} = ((g,a): 1, (g,r):0, (ng,a):0, (ng,r):0)
U_{2,(t₁ᵉ,t₂)} = ((g,a):−1, (g,r):0, (ng,a):0, (ng,r):0)
```

Beliefs and prior:

```
P_{1,t₁ᶠ} = P_{1,t₁ᵉ} = (t₂: 1)        P_{2,t₂} = (t₁ᶠ: p, t₁ᵉ: 1−p)
P = ((t₁ᶠ,t₂): p,  (t₁ᵉ,t₂): 1−p)
```

**Look at `U₂`.** Ann has **one type**, yet her utility function is **different** in the two type profiles — `(g,a)` pays her `1` against a friend and `−1` against an enemy. Def 15.1 cannot express this: it demands `U_{2,t₂}` be a single function of `S`. **Def 15.2 can**, because the utility is indexed by `t ∈ Y`, not by `t₂` alone.

This is Remark 13.1 made formal: **Ann knows her preferences** (a thoughtful gift beats an insulting one) but **does not know her payoff** from accepting, because that depends on Bill's type. Any textbook definition restricted to "types know their own payoffs" quietly excludes this entirely ordinary situation.

## Key Takeaways
1. **There is no such thing as a game of incomplete information.** There are *situations*; the Harsanyi transformation turns them into games of **imperfect but complete** information.
2. **A type = a utility function + beliefs about others' types.** Anything that varies across a player's own information cells cannot be part of her type.
3. The conversion is mechanical and lossless: **one type per partition cell**, state ↦ type profile, and `t′ ∈ ℐᵢ(t) ⟺ t′ᵢ = tᵢ` in the other direction.
4. **Two types can share a utility function and differ only in beliefs** (Fig 15.2, Player 1). Type distinctions are not always payoff distinctions — that is how two-sided incomplete information about *beliefs* is encoded.
5. **Def 15.1 is the textbook special case and it is genuinely restrictive.** Requiring a type to determine its own payoff excludes any situation where your payoff depends on someone else's type — which is most interesting situations.
6. **Use Def 15.2 by default.** Index utilities by the full profile `t ∈ Y`, and restrict beliefs to put positive probability only on relevant profiles.
7. Zero-probability type profiles are normal (Fig 15.2's `(t₁ᵃ,t₂ᵇ)`). `Y` is the device that keeps them out of the model rather than in it with weight 0.
8. Harsanyi consistency is the **same** condition in both notations: a common prior whose conditionals reproduce every type's beliefs. Check it exactly as in Ch 8 §8.4.
9. The state-space formulation is the special case of an **interactive Kripke structure** — a reminder that the epistemic machinery of Part III is standard logic, not a game-theoretic invention.

## Connects To
- **Ch 8**: the interactive knowledge-belief structures being translated, and the common-prior definition (Def 8.10) restated in type language.
- **Ch 13**: Figs 15.1, 15.2, 15.3 **are** Figs 13.3, 13.8 and Exercise 13.2 — this chapter re-expresses Ch 13's examples rather than introducing new ones. Remark 13.1 is the motivation for Def 15.2.
- **Ch 14**: the dynamic counterpart; this chapter is restricted to static games.
- **Ch 1**: the game-frame `⟨I, (S₁,…,Sₙ), O, f⟩` (Def 1.1) that all of this is built on, and the ordinal/cardinal utility distinction.
- **Ch 4**: von Neumann-Morgenstern utility functions, which is what every `U_{i,t}` here is.
- **Kripke (1959, 1963)**, **Harsanyi (1967–68)**, **van Ditmarsch et al. (2015)**: the logical and game-theoretic sources.
