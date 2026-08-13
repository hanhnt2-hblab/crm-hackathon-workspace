# Chapter 7: Knowledge and Common Knowledge

## Core Idea
Model knowledge as an **information partition** over a set of states: an agent knows event `E` at state `w` iff her entire information set at `w` lies inside `E`. Common knowledge — nominally an infinite hierarchy — is computable in one step via the **common knowledge partition** built from **reachability**.

## Frameworks Introduced

- **Information partition** (Def 7.1): let `W` be a finite set of **states**, each a *complete specification of the relevant facts about the world*. An information partition is a partition `ℐ` of `W`; its elements are **information sets**. `ℐ(w)` denotes the information set containing `w`.
  - This is the Ch 3 notion of information set lifted out of game trees into general settings.

- **Event and knowledge** (Def 7.2): an **event** is a subset of `W` — think of a proposition *as the set of states where it is true*. At `w` the agent **knows** `E` iff
  ```
  ℐ(w) ⊆ E
  ```
  - Reading: everything she still considers possible is consistent with `E`.
  - It is entirely possible that there is **no** state where the agent knows a given event.

- **Knowledge operator** (Def 7.3): `K: 2^W → 2^W` with
  ```
  KE = { w ∈ W : ℐ(w) ⊆ E }
  ```
  - Because `KE` is itself an event, you can iterate: `KKE`, `K¬KE`, and across agents `K₂K₁E`, `K₃K₂K₁E`, …

- **`¬KG` vs. `K¬G`** — the distinction to get right:
  - `w ∈ ¬KG`: at `w` the agent **does not know** `G`. She may consider `G` possible *and* `¬G` possible.
  - `w ∈ K¬G`: at `w` she **knows `G` is false** — every state she considers possible is in `¬G`.
  - Therefore `K¬G ⊆ ¬KG`, but **the converse inclusion fails.**

- **Remark 7.1 — the three properties of `K`** (Exercise 7.5): for every `E ⊆ W`,
  ```
  KE ⊆ E          (knowledge is veridical — you only know true things)
  KKE = KE        (positive introspection — knowing implies knowing that you know)
  K¬KE = ¬KE      (negative introspection — not knowing implies knowing you don't)
  ```

- **Interactive knowledge**: with `n` agents, one partition `ℐᵢ` and one operator `Kᵢ` each. Nest them freely — `K₂K₁E` is "2 knows that 1 knows `E`", `K_Ann ¬K_Bob K_Carol E` is "Ann knows that Bob does not know that Carol knows `E`".
  - **How to compute**: work strictly **inside-out**. Compute the innermost event, then apply the next operator to *that set*, and so on. Complements are taken at the point they appear.

- **Common knowledge**: the strongest form of interactive knowledge. For two individuals,
  ```
  CKE = K₁E ∩ K₂E ∩ K₁K₂E ∩ K₂K₁E ∩ K₁K₂K₁E ∩ K₂K₁K₂E ∩ …
  ```
  - Apparently uncheckable (infinitely many conditions) — Theorem 7.1 makes it easy.

- **Reachability** (Def 7.4): given partitions `ℐ₁,…,ℐₙ`,
  - `w′` is **reachable from `w` in one step** if `w′ ∈ ℐᵢ(w)` for **some** `i`;
  - **in two steps** if some `x` is reachable from `w` in one step and `w′` is reachable from `x` in one step;
  - **in `m` steps** if there is a chain `w = w₁, w₂, …, w_m = w′` with each consecutive pair one step apart.
  - `w′` is **reachable from `w`** if reachable in `m` steps for some `m ≥ 1`.
  - Note: reachability **mixes agents freely along the chain** — that is exactly what makes it capture the infinite hierarchy.

- **Common knowledge partition** (Def 7.5): `ℐ_CK(w)` = the set of states **reachable from `w`**. The collection of these sets is the common knowledge partition.
  - Practical construction: take the union-closure — merge any two information sets (of *any* agents) that overlap, and keep merging until nothing overlaps.

- **Theorem 7.1**: at state `w`, event `E` is common knowledge **iff** `ℐ_CK(w) ⊆ E`. Hence
  ```
  CKE = { w ∈ W : ℐ_CK(w) ⊆ E }
  ```
  - Reading: *`E` is common knowledge at `w` exactly when a hypothetical agent whose partition were the common knowledge partition would know `E` at `w`.* One containment check replaces the infinite intersection.
  - Corollary worth remembering: the **smallest event that is common knowledge at `w`** is `ℐ_CK(w)` itself.

## Key Concepts
- **State** — a complete specification of the relevant facts about the world.
- **Event** — a subset of `W`; equivalently a proposition, identified with its truth set.
- **`2^W`** — the set of events; `|2^W| = 2^n` for `|W| = n`.
- **Public announcement** — announcing `E` deletes all states outside `E` from **every** agent's partition, making `E` common knowledge. This is the mechanism by which announcing something everyone already knows can still change behavior.
- **Blindfolded witness** — an observer with the trivial initial partition `{W}` who updates only on public announcements and answers; a useful device for isolating what the *public record* reveals.

## Reference Tables

The doctor example: `W = {a,b,c,d,e}` (bacterial, viral, drug allergy, food allergy, environment), `ℐ = {{a,b}, {c,d,e}}` (positive vs. negative lab test):

| Event | `KE` | `¬KE` | `K¬E` |
|---|---|---|---|
| `E = {a,b,d,e}` | `{a,b}` | `{c,d,e}` | `∅` |
| `F = {a,c}` | `∅` | `W` | `∅` |
| `{a,b,e}` ("infection or environment") | `{a,b}` | `{c,d,e}` | `∅` |

Note `KF = ∅` **and** `K¬F = ∅`: there is no state where the doctor knows `F`, and none where she knows `¬F`.

## Worked Example

**1 — Nested knowledge, computed inside-out (Fig 7.2).** `W = {a,…,h}`; Ann `{{a},{b,c},{d},{e,f,g},{h}}`-style partitions as drawn, with `E = {a,b,c,f,g}`:

```
K_Ann E   = {a,b,c}      (b ∈ K_Ann E since ℐ_Ann(b) = {b,c} ⊆ E;
                          f ∉ K_Ann E since ℐ_Ann(f) = {e,f,g} ⊄ E)
K_Bob E   = {a,b,f}
K_Carol E = {b,c,f,g}
```

Then, layer by layer:

```
K_Carol K_Ann E  = K_Carol {a,b,c}            = {b,c}
K_Bob K_Carol K_Ann E = K_Bob {b,c}           = ∅
```

— there is **no** state where Bob knows that Carol knows that Ann knows `E`. And with a negation in the middle:

```
K_Carol E                = {b,c,f,g}
K_Bob K_Carol E          = {f}
¬K_Bob K_Carol E         = {a,b,c,d,e,g,h}
K_Ann ¬K_Bob K_Carol E   = {a,b,c,d,h}
```

So at `a` Ann knows Bob doesn't know that Carol knows `E`; at `e` she does not.

**2 — The three hats: why announcing what everyone knows changes everything.** Three students each see the other two hats but not their own. States, named:

| | `a` | `b` | `c` | `d` | `e` | `f` | `g` | `h` |
|---|---|---|---|---|---|---|---|---|
| | WWW | WWR | WRW | WRR | RRR | RRW | RWR | RWW |

Partitions (each student is uncertain only about her own hat):

```
Student 1: {a,h} {b,g} {c,f} {d,e}
Student 2: {a,c} {b,d} {e,g} {f,h}
Student 3: {a,b} {c,d} {e,f} {g,h}
```

Let `E` = "not all hats are white" `= {b,c,d,e,f,g,h}` (everything but `a`).

```
K₁E = {b,c,d,e,f,g}          K₂E = {b,d,e,f,g,h}          K₃E = {c,d,e,f,g,h}
K₁K₂E = K₂K₁E = {b,d,e,g}    K₁K₃E = K₃K₁E = {c,d,e,f}    K₂K₃E = K₃K₂E = {e,f,g,h}
```

Their intersection is exactly `{e} = (R,R,R)`. But go one level deeper:

```
K₁K₂K₃E = K₁K₃K₂E = K₂K₁K₃E = K₂K₃K₁E = K₃K₁K₂E = K₃K₂K₁E = ∅
```

**At no state — not even `e` — does anyone know that another knows that the third knows `E`.** So at `(R,R,R)`, `E` is *known* by all and *known to be known* by all, yet is **not common knowledge**. This is why the professor's announcement of a fact everyone already knows is informative: **it converts mutual knowledge into common knowledge.**

Now trace the elimination at the true state `(R,R,R)`:

| Step | Announcement / answer | State(s) deleted |
|---|---|---|
| 0 | "I did not pick three white hats" | `(W,W,W)` |
| 1 | Student 1: "No" | `(R,W,W)` — she'd have known, seeing two white hats |
| 2 | Student 2: "No" | `(W,R,W)` and `(R,R,W)` |
| 3 | Student 3: **"Yes"** | — |

After step 2, each surviving state — `(W,W,R)`, `(W,R,R)`, `(R,R,R)`, `(R,W,R)` — is a **singleton** in Student 3's partition, so she learns the whole state; and in every one of them **her hat is red**. Answer: **Student 3's hat is red**; Students 1 and 2 also have red hats (the true state is `(R,R,R)`).

*The blindfolded witness* ends with information set `{(W,W,R), (W,R,R), (R,R,R), (R,W,R)}` — all he learns is that **Student 3's hat is red**. Student 3's "Yes" is uninformative to him, because in every surviving state she knows her colour anyway. Student 3, by contrast, knows the entire state.

**3 — Coordination requires conditioning on commonly known events (Example 7.1).** Abby picks `n ∈ {2,4,6}`, writes `n−1` and `n+1`, shuffles, gives one to Bruno and one to Caroline. Each writes a pair of numbers; they win $1,000 each iff **(1)** the pairs are identical **and (2)** at least one number equals **Bruno's** number. No communication.

States `abc` (`a` = Abby's pick, `b` = Bruno's, `c` = Caroline's): `213, 231, 435, 453, 657, 675`.

```
Bruno    (sees b):  {213} | {231, 435} | {453, 657} | {675}
Caroline (sees c):  {213, 453} | {231} | {435, 675} | {657}
```

*Failed strategy*: "write `(1,3)` if Bruno gets 1 or 3; `(5,7)` if he gets 5 or 7." Let `E =` "Bruno gets 1 or 3" `= {213, 231, 435}`:

```
K_B E = E              K_C E = {231}              K_B K_C E = ∅
```

Bruno always knows whether `E` happened; Caroline knows only at `231`; and Bruno **never** knows that Caroline knows. The conditioning event is nowhere near common knowledge, so they cannot reliably write the *same* pair.

*Winning strategy* `(*)`: "write `(1,5)` if Bruno gets **1 or 5**; write `(3,7)` if Bruno gets **3 or 7**." Let `F =` "Bruno gets 1 or 5" `= {213, 453, 657}`:

```
K_B F = F     K_C F = F     K_B K_C F = F     K_C K_B F = F     …     ⟹  CKF = F
```

Likewise `CKG = G` for `G = {231, 435, 675}`. Both conditioning events are common knowledge whenever they occur, so the pairs always match — and condition (2) holds because Bruno's number is always *in* the pair his branch names. **They should accept: the strategy guarantees $1,000 each.**

Confirm with Theorem 7.1. The common knowledge partition is obtained by merging overlapping information sets across both agents:

```
ℐ_CK = { {213, 453, 657},  {231, 435, 675} }
```

(`213` reaches `453` via Caroline, and `453` reaches `657` via Bruno.) Since `ℐ_CK(213) = F`, indeed `CKF = F` — one containment check instead of an infinite intersection.

Contrast `H =` "Bruno did **not** get a 5" `= {213, 231, 435, 675}`. Then `CKH = {231, 435, 675}`: at `231` Bruno doesn't get a 5 **and this is common knowledge**, but at `213` he doesn't get a 5 and it is **not** common knowledge (Caroline doesn't even know it).

**4 — Reading off common knowledge from the partition (Fig 7.2 → 7.10).** The common knowledge partition for Ann/Bob/Carol collapses to `{{a,b,c,d}, {e,f,g,h}}`. Hence:

```
E = {a,b,c,d,e,f}  →  CKE = {a,b,c,d}
F = {a,b,f,g,h}    →  CKF = ∅
```

The smallest event common knowledge at `a` is `{a,b,c,d}`; at `g` it is `{e,f,g,h}`.

## Key Takeaways
1. **Identify a proposition with the set of states where it is true.** Everything else is set operations.
2. Knowledge is containment: `KE = {w : ℐ(w) ⊆ E}`. Nothing subtler is needed.
3. Keep `¬KG` and `K¬G` apart. "Doesn't know `G`" is much weaker than "knows `G` is false"; `K¬G ⊆ ¬KG` and never the reverse.
4. Compute nested knowledge **inside-out**, applying each operator to the *set* produced by the previous step.
5. **Never check common knowledge by expanding the hierarchy.** Build the common knowledge partition by merging overlapping information sets across all agents, then apply Theorem 7.1.
6. `ℐ_CK(w)` is the **smallest** event that is common knowledge at `w` — a useful upper bound on what any coordination scheme can rely on.
7. **A public announcement of something everyone already knows can still be decisive**, because it upgrades mutual knowledge to common knowledge. The three-hats puzzle is the canonical demonstration.
8. **Coordination strategies must condition on events that are common knowledge when they occur.** This is the operative design rule from Example 7.1, and it fails silently — the naive partition (`1 or 3` / `5 or 7`) *looks* symmetric but isn't commonly known.
9. Mutual knowledge at every finite depth is still not common knowledge; the hats example has knowledge to depth 2 at `(R,R,R)` and nothing at depth 3.

## Connects To
- **Ch 3**: information sets in extensive-form games are the special case this chapter generalizes.
- **Ch 8**: adds **probabilistic beliefs** on top of these partitions — Bayesian updating, belief revision, Harsanyi consistency, and the Agreement Theorem.
- **Ch 9**: uses these structures to model the players' state of mind in a game and prove that common knowledge of rationality ⟺ the IDSDS / rationalizable output promised in Ch 1 §1.5 and Ch 5 Remark 5.5.
- **Ch 13–15**: the **state-space approach** to incomplete information is built directly on these partitions — the reason the author prefers it to Harsanyi's type spaces.
- **Aumann (1976)**: the origin of the partitional model of interactive knowledge and of the reachability characterization.
