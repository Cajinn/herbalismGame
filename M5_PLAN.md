# M5 — Content & Polish — Implementation Spec

> Handoff spec for building Milestone 5 ("the full game"): the complete herb
> roster, the Alpweide protected-species quest, the toxic-lookalike consequence
> system, the Almanach + Verwechslungen book chapters, the title screen +
> disclaimer, balancing, and the contributor guide. Authored against the actual
> **M4 codebase**. Build the Work Packages **in order**; each one wires itself
> into `main.js`, adds its own strings, and leaves the game runnable +
> browser-tested before the next begins (same incremental workflow as M2–M4).
>
> **PLAN.md is the source of truth for game design.** This spec covers M5 only
> and records the scope decisions made below. M5 is the largest milestone — it
> is content-heavy by definition (PLAN §14.5: "all ~32 herbs + 9 lookalikes
> fully dataed and verified"). The WP order is chosen so the game is shippable
> at almost every checkpoint, and so a natural split point (M5a content / M5b
> systems+polish) exists if you want to land it in two passes.

---

## Where M4 left us (verified against the repo)

- **Herbs present (13 modules):** 8 wild starters (loewenzahn, gaensebluemchen,
  spitzwegerich, schafgarbe, brennnessel, huflattich, veilchen, baerlauch) + 3
  garden (ringelblume, kamille, pfefferminze) + 2 lookalikes (maigloeckchen,
  herbstzeitlose). **All carry `realMonths`** — the Almanach's data substrate is
  already in place on every herb.
- **Maps (8):** dorf, garten, wiese, waldrand, wald, bachufer, **alpweide**,
  kraeuterhaeuschen. Alpweide is a bare walkable map with a single exit to Wald —
  **no spawns, no station, no quest yet.**
- **Methods (6):** trocknen, tee, tinktur, pulver, oelauszug, salbe. Recipes in
  `src/data/recipes.js`.
- **Book (2 chapters):** Pflanzen (progressive reveal) + Rezepte. The tab bar in
  `src/ui/book.js` (`tabPflanzen`/`tabRezepte`) is where Almanach + Verwechslungen
  attach.
- **Delivery:** `evaluateDelivery(request, ailment, item)` returns
  `"match" | "mismatch"` — the **single marked extension point** for M5's toxic
  branch. Mismatch is currently a cozy no-penalty decline.
- **Inventory item shape:** `{ species, teil, processed? }` — `species` is the
  *true* identity. Mislabeling (WP-Toxic) adds one optional field; no schema
  break.
- **Save:** `SAVE_VERSION = 1`, discards on mismatch. **Do NOT bump it.** Add
  every new top-level key defensively with `?? default` in the `main.js` load
  block and to `persist()` — exactly as M4 added `coins/zutaten/seeds/
  reputation/requests/garden`.

---

## Scope decisions (locked — record these in README §Entscheidungen)

1. **Full Vorratshaltung (§10.1) is deferred to a future milestone (M6). M5
   builds only the *mislabeling slice* it needs for §8.2.** The container /
   shelf-life / spoilage pantry is a self-contained sim that PLAN §14 does *not*
   list in the M5 "content & polish" line. But the toxic-consequence drama (§8.2)
   *does* depend on a herb being mislabeled — so M5 implements **only** the
   minimal mislabeling mechanic: a misidentified harvest is stored under the
   *chosen* (wrong) label while keeping its *true* species. Everything else about
   storage (Braunglas vs Klarglas, hell/dunkel spots, expiry, Schimmel) is M6.
   Mark the extension clearly.

2. **Toxic consequences (§8.2) are built; they are rare and earned.** A toxic
   lookalike can only reach a remedy if the player **misidentifies** during
   Bestimmen (picks the wrong species and harvests anyway). Deliver such a remedy
   → the villager is sick 2–3 days (stays home, others mention it), notable
   Vertrauen drop, dramatic full-page book entry. Self-tasting a toxic forage →
   1–2 days in bed. **Never permanent — cozy game.** This is the payoff the M4
   `evaluateDelivery` hook was built for.

3. **Herb completeness is the milestone's bulk and is batched by biotope.** M5
   reaches the full PLAN §12 roster (~32 species + 9 lookalikes). Each batch
   (WP2–WP6) is one biotope's remaining species + their lookalikes, authored to
   the full schema, given recipes, spawned into the existing map, and
   browser-verified in the book before the next batch. **Facts must be verified
   for Switzerland** (harvest windows, protected status, lookalike distinctions)
   — accuracy over convenience, per PLAN's prime directive.

4. **Multi-stage sprites (§3.2) are added where a species has genuinely distinct
   harvests in different seasons** (Holunder: Blüten in Juni vs. Beeren im
   September; Linde; Hagebutte after frost). This is the **one real engine
   extension** in M5: `plantSpawns`/`render` select a stage sprite by the active
   season window. Kept content-driven — the stage map lives in herb data, the
   engine only reads it. Single-sprite herbs are unaffected.

5. **Küchenzutaten / Hausmittel (§10) get a bounded slice, not the full pantry.**
   Add a small second ingredient class (Zwiebel + Honig + Zucker + Zitrone in the
   Dorfladen) and the Hausmittel recipes that real ailments need (Zwiebelsirup,
   Honigauszug). This lets ailments be solved without a foraged plant — a core
   teaching point ("the kitchen *is* part of the Hausapotheke") — without
   building the whole exotic-spice economy. Kurkuma/Ingwer/Goldene-Milch are
   optional stretch.

6. **Energy stat: still skipped.** Same rationale as M4 — self-contained, addable
   later, not required by the M5 line. The 24:00 collapse stays penalty-free.

7. **Audio is a stretch, CC0 only, and is the *last* WP.** Skippable without
   affecting Definition of Done. If added: sourced CC0, documented in
   ATTRIBUTION, behind a mute toggle, no autoplay surprises.

---

## House conventions

**These are unchanged from M4 — re-read `M4_PLAN.md` §"House conventions" before
starting.** The load-bearing ones for M5:

- **Engine/content separation is a hard rule (§13.1).** Zero species-, villager-,
  map-, ailment-, or *method*-specific `if` in engine/sim/ui. New content =
  registry entries discovered through an index. The multi-stage sprite work (WP1)
  must stay data-driven: the engine reads a stage→sprite map from herb data, it
  does not name Holunder.
- **No `SAVE_VERSION` bump.** New keys (`villagerStatus`, quest flags, intro-seen)
  load with `?? default` and join `persist()`. Mislabeling rides inside the
  already-persisted `inventory`.
- **Dialog/overlay shape:** `createXDialog(root, callbacks)` → `{ open, close,
  isOpen }`, starts `hidden = true`, **must** add `.x[hidden] { display: none; }`
  or it eats clicks, and **must** be added to the `update()` modal-guard list.
- **Day-advance hook:** per-day ticks (villager-sickness countdown, patch
  regrowth) go inside `onDayComplete()` in `main.js`.
- **Time:** `absoluteDay(time)` for elapsed-day math; never real `dt`. The
  Almanach's real-world column is the *one* place `new Date()` is allowed
  (PLAN §2, §11.3).
- **All in-game strings German** (du-Form, Schweizer Färbung) in
  `src/data/strings.de.js`. No English in-game.
- **Plates:** public-domain Köhler 1887 (fallback Thomé 1885) via
  `tools/download_plates.sh` + `assets/plates/ATTRIBUTION.md`. The book degrades
  gracefully if a plate is absent — running the script stays optional.
- **Testing in preview:** warp via `localStorage['herbsSchmerbs:save']`
  (`save.map`, `save.player.x/y` = tile×16); to fire `interact`, clear the
  pressed-set (keyup) then keydown, and advance a frame before reading dialog
  state.

---

## New engine/sim touch-points (the only non-content code M5 adds)

```
src/world/plantSpawns.js   stage-by-season sprite selection (WP1) — reads herb.stages
src/engine/sprites.js      (maybe) stage-aware draw helper, if not done in plantSpawns
src/sim/inventory.js       optional item.labeledAs (defaults to species) — mislabeling
src/sim/identify.js (ui)   misident → harvest-under-wrong-label path (WP-Toxic)
src/sim/villagerStatus.js  NEW — sickness countdown {[villagerId]: {sickUntilDay, cause}}
src/world/npc.js           sick villagers stay home; expose status for dialog mentions
src/ui/book.js             +2 chapters (Almanach, Verwechslungen)
src/ui/title.js            NEW — title screen + disclaimer (WP-Title)
src/sim/quest.js           NEW (tiny) — Alpweide unlock flag + protected-pick handler
```

## New state shape (added to `main.js` game state + save)

```js
let villagerStatus = {};            // { [villagerId]: { sickUntilDay, cause } }
let quests = { alpweideUnlocked: false };  // gentle flags; Vertrauen-gated
let introSeen = false;              // title screen shown once (cosmetic)
// mislabeling rides inside `inventory` items: { species, teil, processed?, labeledAs? }
```

All default-loaded with `??` from `saved.*`; all added to `persist()`.

---

## Work Packages (build in order)

> WP0–WP1 are foundations. WP2–WP6 are the herb-content batches (the bulk; the
> natural **M5a** boundary is end of WP6). WP7–WP12 are the systems + polish
> (**M5b**). Each WP ends browser-verified.

### WP0 — Method & recipe registry expansion + Küchenzutaten
**Files:** `src/data/methods.js`, `src/data/recipes.js`, `src/data/shop.js`,
`src/sim/zutaten.js` (reuse), `src/data/strings.de.js`, `css/ui.css` (only if a
new station UI state appears).

- Add methods (registry entries only, no engine change): **sirup** (Herd, 2–3
  Tage, inputs Blüten + Zucker/Honig), **honigauszug** (7 Tage, Kraut in Honig),
  **wickel/umschlag** (0 Tage, frisch zerquetscht — field-usable later),
  **hausmittel** (0–1 Tag, Herd, Küchenzutaten ± Kraut). Each declares station,
  inputs, `durationDays`, optional `care`, `output`, `requiresZutat`.
- Küchenzutaten as a **second ingredient class** in the existing `zutaten` store
  (same count-object). Add to `src/data/shop.js`: **zwiebel, honig, zucker,
  zitrone** (gentle prices; book notes which don't grow here — none of these are
  exotic, so all fine). Kurkuma/Ingwer optional.
- Recipes that the herb batches + ailments will need: **Zwiebelsirup**
  (zwiebel + zucker/honig → sirup, valid vs. Husten/Erkältung), **Thymianhonig**
  (honigauszug), **Holunderblütensirup** (lands with WP3's Holunder).
- **Acceptance:** workshop lists the new methods where inputs exist; shop sells
  Küchenzutaten; a Zwiebelsirup can be started and completes; save round-trips
  the new zutaten. No regressions in the M4 zutat-gated recipes.

### WP1 — Multi-stage plant sprites (engine extension, data-driven)
**Files:** `src/world/plantSpawns.js`, `src/engine/sprites.js` (if needed), one
existing herb module as the pilot, `src/data/strings.de.js`.

- Extend the herb schema with an **optional** `stages` map:
  `stages: { bluehend: <sprite>, fruchtend: <sprite> }` plus a way to pick the
  active stage from the season window (e.g. `stageBySeason` or derive from which
  `saison.teil` window is currently open). Herbs without `stages` use the single
  `sprite` unchanged.
- `plantSpawns`/`render`: when resolving a spawn's sprite, if the herb has
  `stages`, select by the current season/teil window; else use `sprite`.
  **No species names in the engine** — it only reads the data.
- Pilot on one existing herb (give huflattich or veilchen a token second stage)
  to prove the path, then Holunder/Linde/Hagebutte in WP3/WP6 use it for real.
- **Acceptance:** the pilot herb shows a different sprite in two seasons in the
  same patch; single-sprite herbs render identically to before.

### WP2 — Content batch A: Wiese/Wegrand
**Files:** new `src/data/herbs/*.js` (8 species + 3 lookalikes), `index.js`,
`recipes.js`, `plantSpawns.js` (Wiese patches), `download_plates.sh`,
`ATTRIBUTION.md`, `strings.de.js`.

- **Species:** Johanniskraut, Rotklee, Frauenmantel, Malve, Wegwarte,
  Königskerze, Giersch, Gundelrebe. Full schema each (copy `loewenzahn.js`):
  nameDe/nameLat/schweizerdeutsch, plate, biotope, sonne/boden, `saison.teil`,
  `realMonths`, 6 merkmale incl. wuchshoehe, verwechslung, geschuetzt,
  kultivierbar, verwendung, fundorte, sprite. **Johanniskraut → Ölauszug
  («Rotöl»)** — ties into WP0/M4 oil chain.
- **Lookalikes (spawn, never requested):** Hundskamille (wirkungslos, vs.
  Kamille), **Gefleckter Schierling** (tödlich, vs. Giersch/Wilde Möhre),
  **Jakobskreuzkraut** (giftig, vs. Johanniskraut). Author with the toxic
  distinctions in `merkmale`/`verwechslung` — these feed WP9 (Verwechslungen
  gallery) and WP8 (toxic consequence).
- Add Wiese spawn patches (`SPAWN_POINTS`) gated by each herb's season window;
  lookalikes spawn in the same biotope/season as their double.
- **Acceptance:** new species appear in the book Pflanzen sidebar; foraging in
  Wiese surfaces them + their lookalikes; recipes show in Rezepte.

### WP3 — Content batch B: Wald/Waldrand (+ first real multi-stage)
**Files:** as WP2, spawning into Wald + Waldrand.

- **Species:** Schwarzer Holunder (**Blüten + Beeren** — uses WP1 stages,
  Holunderblütensirup + Beeren), Hagebutte/Hundsrose (after frost), Weissdorn,
  Schlehe, Birke (Blätter), Fichte (Maitriebe → Sirup), Schlüsselblume
  (**teilweise geschützt — teach the check**).
- **Lookalikes:** **Attich/Zwergholunder** (giftig, vs. Holunder), **Pestwurz**
  (vs. Huflattich).
- Holunder is the multi-stage showcase: Blüten window (Frühsommer) vs. Beeren
  window (Herbst) render different sprites and offer different Teile/recipes.
- **Acceptance:** Holunder shows Blüten in summer, Beeren in autumn in the same
  patch; Schlüsselblume surfaces a "geschützt — prüfen" note; book fills.

### WP4 — Content batch C: Bachufer
**Files:** as WP2, spawning into Bachufer.

- **Species:** Mädesüss, Beinwell (Wurzel/Blätter, Wickel), Weide (Rinde →
  traditional Schmerz/Fieber note, the "Aspirin-Vorläufer" teaching beat).
- **Lookalike:** **Roter Fingerhut** (tödlich, vs. Beinwell-Rosette) — a classic
  rosette confusion; author the distinction carefully.
- **Acceptance:** wet-soil species surface at Bachufer; Beinwell offers a Wickel;
  Fingerhut spawns alongside Beinwell with its toxic warning.

### WP5 — Content batch D: Garten cultivables (remainder)
**Files:** new herb modules (5), `recipes.js`, **`src/data/shop.js`** (seeds),
`index.js`, plates, strings. **No `SPAWN_POINTS`** (garden-only, per the M4
cultivable convention).

- **Species:** Zitronenmelisse, Salbei, Thymian (→ Thymianhonig), Lavendel,
  Baldrian (→ Tinktur/Tee, Schlaf). All `kultivierbar: true`, biotope
  `["garten"]`.
- Add their **seeds to the Dorfladen**; they grow via the existing M4 garden sim
  (no garden-sim change needed — verify the 5-bed capacity is comfortable, or
  bump bed count in `garten.js` if the roster outgrows it).
- **Acceptance:** buy seeds, plant, grow, harvest each; recipes (Salbeitee,
  Thymianhonig, Baldriantinktur, Lavendelöl) appear; book fills.

### WP6 — Content batch E: Dorf + remaining lookalikes (roster complete)
**Files:** as WP2; spawn into Dorf where appropriate.

- **Species:** **Linde** (Dorflinde — Blüten im Hochsommer, multi-stage via WP1;
  a single prominent patch on the Dorf square, not a wandering spawn).
- **Lookalike:** **Hundspetersilie** (giftig, vs. Petersilie/Giersch).
- **Reconcile the roster against PLAN §12** — fill any species still missing to
  reach **~32 + 9**. Audit: every herb has plate entry, ≥1 recipe, ≥1 spawn (or
  garden seed), `realMonths`, and a complete `verwechslung` where a dangerous
  double exists.
- **Acceptance (end of M5a):** the book Pflanzen sidebar shows the full roster;
  every dangerous pair has both members present; foraging across all biotopes is
  seasonally alive. Screenshot the completed sidebar.

### WP7 — Alpweide unlock quest + protected species (§8.3)
**Files:** `src/sim/quest.js` (new, tiny), `src/data/maps/alpweide.js`,
`src/data/villagers.js` (Margrit hint + quest trigger), `src/world/npc.js`,
`src/main.js`, `strings.de.js`; Alpweide herb modules (Arnika, Gelber Enzian,
Alpen-Frauenmantel, Quendel, Wacholder).

- **Unlock:** Vertrauen-gated (PLAN §8: Vertrauen gates the Alpweide quest).
  When village Vertrauen ≥ threshold, Margrit offers the quest; completing it
  flips `quests.alpweideUnlocked`. Until then the Wald→Alpweide exit shows a
  gentle "noch nicht bereit" gate (or the path is hidden).
- **Protected species:** Arnika + Gelber Enzian are `geschuetzt: true`. Picking a
  protected wild plant triggers a **Margrit/Wildhüter scene**: Vertrauen penalty,
  herb confiscated, book note "stehen lassen". The **legal paths** (data-driven,
  no special-casing): Arnika is `kultivierbar` (garden seed from the Dorfladen,
  slow), Enzianwurzel is **bought** at the Dorfladen (cultivated source). This is
  the §8.3 ethics lesson — encode it through the same `geschuetzt`/`kultivierbar`
  data the harvest flow already reads.
- Spawn Arnika/Enzian/Alpen-Frauenmantel/Quendel/Wacholder into Alpweide.
- **Acceptance:** below threshold the Alpweide is gated; raise Vertrauen → quest →
  unlock; on the Alpweide, picking Arnika triggers the protected scene + penalty;
  buying Enzianwurzel / growing Arnika is the rewarded path.

### WP8 — Toxic consequences & mislabeling slice (§8.2)
**Files:** `src/ui/identify.js`, `src/sim/inventory.js`, `src/sim/requests.js`
(the `evaluateDelivery` extension point), `src/sim/villagerStatus.js` (new),
`src/world/npc.js`, `src/sim/progress.js`, `src/ui/dialog.js`, `src/ui/book.js`
(dramatic entry), `src/main.js`, `strings.de.js`.

- **Mislabeling at identification:** when the player picks the **wrong** species
  in Bestimmen and harvests, store the item with its **true** `species` but a
  `labeledAs` = the chosen (wrong) species. (Default `labeledAs = species` for
  correct harvests; persists inside inventory — no save-key change.) The UI shows
  the *label*; the sim knows the *truth*. **This is the only piece of §10.1 M5
  builds** — comment it as the mislabeling slice, full Vorratshaltung = M6.
- **`evaluateDelivery` toxic branch** (the marked hook): if the delivered item's
  *true* species is a toxic lookalike → return `"toxic"` (new). Wire the three
  §8.2 outcomes:
  - misidentified **harmless** → `"mismatch"`-like: doesn't help, small Vertrauen
    dip, book records the Verwechslung (already cozy-handled — extend slightly).
  - misidentified **toxic** → `"toxic"`: villager sick 2–3 days
    (`villagerStatus[id] = { sickUntilDay, cause }`), notable Vertrauen drop,
    dramatic full-page book entry, villager stays **home** (npc.js reads status)
    and other villagers' greetings mention it. Countdown ticks in
    `onDayComplete()`.
  - **self-tasting** a toxic forage → player sick in bed 1–2 days (time/season
    cost; reuse the sleep/day-advance path).
- **Rare & earned:** only reachable by ignoring/rushing Bestimmen. Mastery
  (`gelernt`) auto-IDs and removes the risk for known species — so the danger
  lives exactly where the learning hasn't happened yet.
- **Acceptance:** deliberately misidentify a toxic lookalike → harvest →
  process → deliver → villager sick (home, mentioned), Vertrauen drops, a
  full-page «Verwechslung!» book entry appears. Correct play never triggers it.

### WP9 — Book chapter: Verwechslungen (§11.4)
**Files:** `src/ui/book.js`, `css/book.css`, `strings.de.js`.

- New tab (Lesezeichen) beside Pflanzen/Rezepte. **Poison gallery:** side-by-side
  feature comparison of each dangerous pair (Bärlauch↔Maiglöckchen↔Herbstzeitlose,
  Giersch↔Schierling, Beinwell↔Fingerhut, Holunder↔Attich, Johanniskraut↔
  Jakobskreuzkraut, Huflattich↔Pestwurz, …), built from the `verwechslung` data
  already on the herbs. Each pair unlocks **as encountered** (both members seen,
  or a toxic event recorded). The red-edge styling already exists on the Pflanzen
  Verwechslungs-panel — reuse it.
- **Acceptance:** meeting both members of a pair unlocks its comparison; a
  triggered toxic event force-unlocks the relevant pair; locked pairs show as
  "noch nicht begegnet".

### WP10 — Book chapter: Almanach (§11.3)
**Files:** `src/ui/book.js`, `css/book.css`, `strings.de.js`.

- New tab, two columns:
  - **Spieljahr** — current game season: what's harvestable where (read herb
    `saison.teil` × biotope against `time`).
  - **«Draussen vor deiner Tür»** — driven by the **real date** (`new Date()`,
    the sanctioned exception): which of the game's herbs are in season in
    Switzerland *this real month*, via each herb's `realMonths` (already present
    on every herb), with a short practical foraging tip. This is the
    game→real-walk bridge.
- **Acceptance:** the Spieljahr column tracks the in-game season; the real column
  reflects the actual current month and changes if the system date changes. No
  network calls.

### WP11 — Title screen + disclaimer (§8.1, §14)
**Files:** `src/ui/title.js` (new), `src/main.js`, `index.html`/`css`,
`strings.de.js`.

- Cover with hand-lettered «Herbs Schmerbs», **Start / Weiter** (Weiter only if a
  save exists), and the respectful disclaimer: *das Spiel lehrt Pflanzenkunde,
  ersetzt keinen Arztbesuch* + the traditional-use framing. `introSeen` flag is
  cosmetic (skip-on-return optional). Boot flows: title → game; the modal-guard
  pattern applies while the title is up.
- **Acceptance:** fresh load shows the title + disclaimer; Start enters the game;
  with a save, Weiter resumes; disclaimer is legible and respectful.

### WP12 — Balancing, EXPANDING.md, audio (stretch), holistic test, docs
**Files:** `EXPANDING.md` (new), `README.md`, memory files, light balancing,
optional `assets/audio/` + `ATTRIBUTION.md`.

- **EXPANDING.md** (PLAN §13.1/§14 deliverable): step-by-step checklists for
  "Neues Kraut hinzufügen", "Karte ändern/erweitern", "Neuer Dorfbewohner",
  "Neues Rezept", "Neue Verarbeitungsmethode" — each listing exactly which files
  to touch + a copy-paste template, so a future session (or a smaller model) can
  add a herb from this guide + one example file alone, without loading the engine.
- **Balancing** (PLAN §16, keep gentle): prices, Vertrauen thresholds (incl. the
  Alpweide gate), garden growth times, request cadence, toxic-event rarity.
- **Audio (stretch, CC0 only):** ambient + UI blips behind a mute toggle;
  document sources. Skippable.
- **Holistic test:** play a full in-game year — forage every biotope across all
  seasons, hit a multi-stage harvest, unlock + visit the Alpweide, trigger (and
  recover from) a toxic event, fill all four book chapters, read the real-date
  Almanach. Screenshot proof of each new system.
- **README:** add a **"Stand: M5 — Content & Polish"** section (mirror the M3/M4
  style) + record the 7 scope decisions above (deferred Vorratshaltung, toxic
  slice, biotope batching, data-driven multi-stage sprites, bounded Hausmittel,
  energy still skipped, audio optional).
- **Memory:** update `memory/project_overview.md` → M5 complete; note what a
  hypothetical M6 would be (full Vorratshaltung, energy, weather, audio polish).
- **Acceptance:** the full PLAN §6 core loop is playable end to end across a year
  with no errors; the book is complete; EXPANDING.md lets a cold session add a
  herb unaided.

---

## Quick reference — files you will create

```
src/sim/villagerStatus.js     src/ui/title.js
src/sim/quest.js              EXPANDING.md
src/data/herbs/*.js           (~21 new species + ~7 new lookalikes — full schema each)
```

## Files you will edit

```
src/main.js                  src/data/herbs/index.js
src/world/plantSpawns.js     src/data/recipes.js
src/world/npc.js             src/data/methods.js
src/sim/inventory.js         src/data/shop.js
src/sim/requests.js          src/data/villagers.js
src/sim/progress.js          src/data/maps/alpweide.js  (+ garten.js if beds grow)
src/ui/identify.js           src/data/strings.de.js
src/ui/dialog.js             tools/download_plates.sh
src/ui/book.js               assets/plates/ATTRIBUTION.md
css/book.css, css/ui.css     README.md
src/engine/save.js           (NO version bump — defensive defaults in main.js)
```

## Definition of done for M5
The full PLAN §12 herb roster (~32 species + 9 lookalikes) is dataed, verified
for Switzerland, spawned, recipe-backed, and fills the book. The Alpweide unlocks
via a Vertrauen-gated quest and teaches protected-species ethics through data, not
special-casing. A rushed misidentification can mislabel a toxic lookalike into a
remedy and make a villager memorably (never permanently) sick — and mastery makes
that risk disappear as the player learns. The book has all four chapters,
including the real-date Almanach bridge to a walk outside and the Verwechslungen
poison gallery. A title screen carries the respectful disclaimer. EXPANDING.md
lets the next contributor add content without reading the engine. Every system
stays registry-driven — no engine code knows any specific herb, villager,
ailment, or method by name.
