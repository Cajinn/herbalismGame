# M4 — Dorf & Requests — Implementation Spec

> Handoff spec for building Milestone 4 ("the full fantasy"): villagers, request
> generation, delivery + reputation, shop, garden. Authored against the actual
> M3 codebase. Build the Work Packages **in order**; each one wires itself into
> `main.js`, adds its own strings, and leaves the game runnable + browser-tested
> before the next begins (same incremental workflow as M2/M3).
>
> **PLAN.md is the source of truth for game design.** This spec only covers M4
> and records the scope decisions already made (see "Scope decisions" below).

---

## Scope decisions (locked — record these in README §Entscheidungen)

1. **Consequences (§8.2): match + reputation now, drama deferred to M5.**
   In the current flow you can only harvest a *correctly identified* herb, and
   toxic lookalikes never offer a harvestable Teil (data-driven), so a poison
   can never reach a remedy yet. The full toxic-lookalike sickness event depends
   on the §10.1 mislabeling/storage system, which is M5. **M4 delivery = check
   the handed-over product against the ailment's valid remedies → reward on
   match, polite decline (no penalty, item kept) on mismatch.** Build the
   delivery code so M5 can attach the toxic/mislabel branch at one clearly
   marked extension point (the delivered item already flows through one
   `evaluateDelivery()` function — M5 adds a `mislabeledAs` check there).

2. **Garden (§9): add 2–3 real cultivable herbs.** All 7 existing herbs are
   `kultivierbar: false` (wild). Author **Ringelblume, Echte Kamille,
   Pfefferminze** as proper herb modules (data + sprite + recipes). They are
   **garden-only** (NOT added to `SPAWN_POINTS`) — this gives the garden
   exclusive content and a real purpose (reliability vs. foraging seasonality).
   The shop sells their seeds; Ringelblume feeds the Ölauszug→Salbe chain.

3. **Energy stat: skipped in M4.** Not in the M4 milestone line. It is a
   self-contained sim module addable in any later milestone without engine
   changes. Do not build it now.

---

## House conventions (follow these — discovered during M1–M3)

- **Vanilla JS ES modules, no build step.** Served via
  `/usr/local/bin/python3 -m http.server 4173` (launch config `.claude/launch.json`,
  server name `herbs-schmerbs`). Preview reuses the running server; hard-reload
  with `location.reload(true)` after edits.
- **Engine/content separation is a hard rule (§13.1).** Zero species-, villager-,
  map-, or ailment-specific `if` in engine/sim/ui modules. Everything content-like
  is a **registry** (`src/data/...`) discovered through an index/export. No
  `if (villager === "vreni")` anywhere.
- **Registry + index pattern:** see `src/data/herbs/` (one module per species +
  `index.js` aggregator). Mirror it for villagers if you split files; a single
  `villagers.js` / `ailments.js` registry object is also fine (PLAN §13 lists
  them as single files — prefer single files for villagers/ailments).
- **Interaction pattern (reuse exactly):** proximity = `Math.abs(a.x - tx) <= 1
  && Math.abs(a.y - ty) <= 1` against the player's center tile; show a HUD prompt
  via `hud.setPrompt(...)`; open the dialog on `consumeJustPressed("interact")`.
  Stations live in a `stations` array on the map (see
  `src/data/maps/kraeuterhaeuschen.js`); NPCs/beds follow the same idea.
- **Dialog/overlay UI module shape:** `createXDialog(root, callbacks)` returning
  `{ open(...), close(), isOpen() }`. The overlay element starts `hidden = true`.
  **CSS gotchas that WILL bite you again:**
  - Author `.x { display: flex }` overrides UA `[hidden]{display:none}` by
    cascade origin — you MUST add `.x[hidden] { display: none; }` explicitly or
    the overlay stays full-screen and eats all clicks.
  - `#ui-root` already sets `line-height: normal` to undo `#game { line-height:0 }`.
    Any new overlay is a child of `#ui-root`, so you inherit the fix — but if you
    create a sibling, re-apply it.
- **`update()` must early-return while ANY modal overlay is open**, so the world
  doesn't move under the dialog. Current guard:
  `if (identifyDialog.isOpen() || workshopDialog.isOpen() || book.isOpen()) return;`
  — extend this list with every new modal (shop, garden, villager dialog, board).
- **Day-advance hook:** all "a day passed" logic funnels through
  `onDayComplete()` in `main.js` (called from manual sleep, Bett station, and
  the 24:00 collapse in both `advanceTime` and `addMinutes` paths). Add new
  per-day ticks (request generation, garden growth) **inside `onDayComplete()`**,
  before `advanceDay(time)` is called for sleep — read the current code, it
  already calls `tickAndComplete` there.
- **Time:** use `absoluteDay(time)` from `src/sim/time.js` for elapsed-day math
  (garden growth, request age), never real-time `dt`.
- **Save:** `src/engine/save.js` discards on version mismatch. **Do NOT bump
  `SAVE_VERSION`.** Add every new top-level key defensively in the load block of
  `main.js` with `?? default` (exactly how M3 added `processingState` and the
  `gesehen` backfill). New keys: `coins`, `zutaten`, `seeds`, `reputation`,
  `requests`, `garden`. Add each to the `persist()` payload too.
- **Testing in preview:** to fire `interact`, dispatch keyup THEN keydown
  (`pressed` set must clear first), and advance a frame (screenshot) before
  reading dialog state — `consumeJustPressed` runs inside the rAF `update()`.
  You can warp the player for testing by editing `localStorage['herbsSchmerbs:save']`
  (`save.map`, `save.player.x/y` in pixels = tile×16) and reloading.
- **All in-game strings are German** (du-Form, leichte Schweizer Färbung), in
  `src/data/strings.de.js`. No English in-game.
- **Character/herb sprites:** indexed-color via `createSprite({palette, rows})`,
  16×16, palette index 0 = transparent. Villagers get a small character sprite
  each (see herb modules for the format; `drawSprite(ctx, sprite, x, y, scale)`
  to render in-world).

---

## New state shape (added to `main.js` game state + save)

```js
let coins = 50;                       // Münzen — starting purse
let zutaten = {};                     // { schnaps: 2, olivenoel: 1, ... } bought ingredients
let seeds = {};                       // { ringelblume: 3, ... } bought/gifted seeds
let reputation = createReputation();  // { village: 0, perVillager: {} }
let requests = createRequests();      // { active: [ {id, villagerId, ailmentId, createdDay, status} ], nextId }
let garden = createGarden();          // { beds: { [bedId]: {species, plantedDay, lastWateredDay, stage} } }
```

All default-loaded with `??` from `saved.*`; all added to `persist()`.

---

## Work Packages (build in order)

### WP0 — Economy + reputation foundations
**Files:** `src/sim/reputation.js` (new), `src/sim/zutaten.js` (new, tiny),
`src/data/strings.de.js`, `src/ui/hud.js`, `src/main.js`, `css/ui.css`.

- `src/sim/zutaten.js`: `createZutaten()`, `addZutat(z, id, n=1)`,
  `removeZutat(z, id, n=1) -> bool`, `countZutat(z, id)`. Plain count-object
  helpers (same shape used for `seeds`). Used by shop + processing.
- `src/sim/reputation.js`: `createReputation()` → `{ village: 0, perVillager: {} }`;
  `addVertrauen(rep, villagerId, amount)` (updates per-villager and `village` =
  sum of per-villager); `getVillagerVertrauen(rep, id)`; `getVillageVertrauen(rep)`.
- HUD: show **Münzen** count (and optionally village Vertrauen) next to the clock.
  Add `hud.update(time, coins, reputation)` or a `hud.setStats({coins, vertrauen})`.
- main.js: introduce `coins`, `zutaten`, `seeds`, `reputation` state + defensive
  load + persist. No behavior yet beyond HUD display.
- **Acceptance:** game loads, HUD shows `Münzen 50`, save/reload round-trips the
  new fields. No regressions.

### WP1 — Cultivable herb content (3 herbs)
**Files:** `src/data/herbs/ringelblume.js`, `kamille.js`, `pfefferminze.js` (new),
`src/data/herbs/index.js`, `src/data/recipes.js`, `src/data/strings.de.js`,
`tools/download_plates.sh`, `assets/plates/ATTRIBUTION.md`.

- Author each herb to the full schema (copy `loewenzahn.js` shape: nameDe,
  nameLat, schweizerdeutsch, plate, biotope:["garten"], sonne, boden, saison.teil,
  realMonths, merkmale (6 incl. wuchshoehe), verwechslung, `geschuetzt:false`,
  `kultivierbar:true`, verwendung, `fundorte:0`, sprite). **Verify facts for
  Switzerland.** Plates: `calendula-officinalis.jpg`, `matricaria-chamomilla.jpg`,
  `mentha-× piperita` → use `mentha-piperita.jpg`.
- Recipes: at minimum Tee + Trocknen for each; **Ringelblume → Ölauszug → Salbe**
  (the payoff for shop-bought Olivenöl + Bienenwachs); Kamille → Tee (+ Ölauszug
  optional); Pfefferminze → Tee.
- Do NOT add to `SPAWN_POINTS` (garden-only).
- Add plate URLs to `download_plates.sh` + ATTRIBUTION rows (public-domain
  Köhler/Thomé; running the script is optional — book degrades gracefully).
- **Acceptance:** new herbs appear in the book's Pflanzen sidebar (as `?` until
  seen — they become "seen" when first harvested from the garden in WP2), their
  recipes show in the Rezepte tab.

### WP2 — Garden (sim + UI)
**Files:** `src/sim/garden.js` (new), `src/ui/garden.js` (new), `css/ui.css`,
`src/data/maps/garten.js`, `src/data/strings.de.js`, `src/main.js`.

- `src/sim/garden.js`:
  - `createGarden()` → `{ beds: {} }`.
  - `plantSeed(garden, bedId, species, seeds, time)`: requires `seeds[species]>0`,
    decrements, sets bed `{species, plantedDay: absoluteDay(time), lastWateredDay,
    stage:"keimling"}`. Returns bool.
  - `waterBed(garden, bedId, time)`: sets `lastWateredDay`.
  - `tickGarden(garden, time)`: per day — if watered within the last 1–2 days,
    advance growth; reach `reif` after N days (e.g. 8–12). Un-watered days pause
    growth (gentle, no death). Call from `onDayComplete()`.
  - `harvestBed(garden, bedId, inventory)`: if `reif`, adds raw herb to inventory
    (`addItem(inventory, species, teil)` — choose the herb's primary Teil),
    resets bed to empty (or to regrow for Mehrjährige — keep simple: clears bed).
    No Bestimmen needed (you planted it → also call `recordSighting` +
    auto-`gelernt`? No — just `recordSighting` so it enters the book).
- Repurpose `garten.js`: add a `beds` array mapping each `E` bed cluster to a
  `{ bedId, x, y }` interaction point (one point per bed; place the point on a
  walkable tile adjacent to/over the bed). Keep the existing dorf exit.
- `src/ui/garden.js`: proximity dialog. Empty bed → list owned seeds with "Säen"
  buttons. Growing → show stage + "Giessen" + progress label
  («Ringelblume — Keimling, giessen»). Ready → "Ernten". Standard
  `{open,close,isOpen}` shape; add to the `update()` modal guard.
- main.js: detect bed proximity (iterate `map.beds`), open garden dialog;
  `tickGarden` in `onDayComplete`; persist `garden`.
- **Acceptance:** walk into Garten, plant a seed (after buying in WP3 — for now
  test by seeding `seeds` in localStorage), water, sleep several days, harvest →
  herb appears in inventory and the book.

### WP3 — Shop (Dorfladen)
**Files:** `src/data/shop.js` (new), `src/ui/shop.js` (new), `css/ui.css`,
`src/data/maps/dorf.js`, `src/data/strings.de.js`, `src/main.js`.

- `src/data/shop.js`: catalog array. Each entry
  `{ id, kind: "zutat"|"seed", ref, nameDe, preis, descDe }`. Stock: **zutaten**
  schnaps, olivenoel, bienenwachs; **seeds** ringelblume, kamille, pfefferminze.
  (Containers/Gläser are M5 — do not add.) Prices gentle (PLAN §16: balance
  freely; e.g. schnaps 12, olivenoel 8, bienenwachs 6, seeds 4–6).
- `src/ui/shop.js`: dialog listing catalog with price + "Kaufen" button, disabled
  when `coins < preis`. On buy: `coins -= preis`; zutat → `addZutat`; seed →
  `seeds[ref] = (seeds[ref]??0)+1`. Show current Münzen. Standard shape; add to
  modal guard.
- `dorf.js`: add a `stations` array (the Dorf has none yet) with a `dorfladen`
  station at a sensible tile near a house; later WP5/WP6 add `anschlagbrett`.
  Add the station-prompt + open wiring in `main.js` (Dorf currently has no
  station handling — generalize the kraeuterhaeuschen station loop, or add a
  parallel `map.stations` check in `updateInteractables`). **Keep it generic:**
  `updateInteractables` should handle `map.stations` for ANY map, dispatching by
  `station.type` (`dorfladen` → shop, `anschlagbrett` → board, plus the existing
  kraeuterhäuschen types). No per-map hardcoding.
- **Acceptance:** enter Dorfladen, buy Schnaps/Olivenöl/Bienenwachs/seeds, coins
  decrease, save round-trips zutaten + seeds. Garden seeding (WP2) now works
  from real purchases.

### WP4 — Unlock zutat-gated recipes
**Files:** `src/ui/workshop.js`, `src/sim/processing.js`, `src/main.js`,
`src/data/strings.de.js`.

- Today `requiresZutat` recipes are hard-disabled with "(bald im Dorfladen)".
  Replace with a real check against `zutaten`: have it → enabled; lack it →
  disabled with "(im Dorfladen kaufen)" + show which zutat. Pass `zutaten` into
  `workshopDialog.open(...)` and `canStartRecipe`.
- `processing.startRecipe`: also consume `recipe.requiresZutat` (and method-level
  `requiresZutat`) from `zutaten` via `removeZutat`; abort + restore if missing
  (or check-all-before-consume). Thread `zutaten` through the
  `onStartRecipe` callback in `main.js`.
- **Acceptance:** with Schnaps in stock, start a Löwenzahn-Tinktur; it consumes
  the Schnaps and appears in "In Bearbeitung". With Olivenöl, start a
  Ringelblumen-Ölauszug; later Bienenwachs → Salbe. Verify the zutat is consumed
  and persisted.

### WP5 — Villagers (content + NPC rendering)
**Files:** `src/data/villagers.js` (new), `src/data/ailments.js` (new),
`src/world/npc.js` (new), `src/data/maps/dorf.js`, `src/data/strings.de.js`,
`src/main.js`.

- `src/data/ailments.js`: registry keyed by id. Each:
  `{ id, nameDe, beschreibungDe, seasons:["winter",...],
     validRemedies: [ {species, output} | {output, wirkungTag} ] }`.
  Express valid remedies as concrete `{species, output}` matchers achievable
  with current content (the 7 wild + 3 garden herbs × tee/getrocknet/tinktur/
  pulver/salbe). Example: `erkaeltung` (winter/herbst) →
  `[{species:"spitzwegerich", output:"tee"}, {species:"holunder",...}]` — only
  list species that exist. Keep 5–8 ailments spanning the seasons.
- `src/data/villagers.js`: 6 villagers + **Frau Margrit** (mentor). Each:
  `{ id, nameDe, rolleDe, ailmentThemes:[ailmentId,...],
     home:{map,x,y}, square:{map,x,y}, sprite, dialog:{ gruss, bitte(slots),
     dank, ablehnung } }`. Use the PLAN §8.1 cast (Vreni/Ueli/Klara/Res/Sophie/
     Anna + Margrit). Hand-written templates with slots (PLAN §16). Margrit gives
     wisdom/hints, issues no ailment requests.
- `src/world/npc.js`: `getActiveNpcs(mapId, time)` → villagers whose current
  position (home before ~12:00, square after — or simply `square` during day) is
  on `mapId`, with `{...villager, x, y, sprite}`. Proximity + render like spawns.
- main.js: render NPC sprites (`drawSprite`), show name prompt on proximity, open
  villager dialog (WP6) on interact. Until WP6, interact can just show greeting.
- **Acceptance:** villagers visible in the Dorf, walking near one shows their
  name and a greeting on E.

### WP6 — Requests, delivery & consequences
**Files:** `src/sim/requests.js` (new), `src/sim/reputation.js` (WP0),
`src/ui/dialog.js` (new — villager/request dialog), `src/ui/board.js` (new —
Anschlagbrett), `src/sim/progress.js`, `src/data/maps/dorf.js`,
`src/data/strings.de.js`, `src/main.js`.

- `src/sim/requests.js`:
  - `createRequests()` → `{ active: [], nextId: 1 }`.
  - `generateDailyRequests(requests, villagers, ailments, time)`: on day advance,
    for each villager without an open request, with a gentle probability, if the
    season matches one of their `ailmentThemes`, create a request
    `{id, villagerId, ailmentId, createdDay: absoluteDay(time), status:"open"}`.
    Cap total active (e.g. ≤ 4). Deterministic-enough; cozy cadence.
  - `requestForVillager(requests, villagerId)`, `resolveRequest(requests, id)`.
  - `evaluateDelivery(request, ailment, item)` → `"match" | "mismatch"`.
    **This is the M5 extension point** — add a `// M5: mislabeledAs/toxic branch
    here` comment. For M4: `match` iff `item` matches any `ailment.validRemedies`
    entry (`species` + `processed===output`).
- `src/ui/dialog.js`: villager interaction. If they have an open request → show
  `bitte` text (their complaint) + a list of inventory products that *could* be
  remedies (processed items) with "Geben" buttons. On give → `evaluateDelivery`:
  - **match:** consume item, `addVertrauen`, `coins += reward`, `resolveRequest`,
    `recordDelivery(progress, species)` (new in progress.js — unlocks the book's
    "geliefert" note), villager `dank` message.
  - **mismatch:** **do NOT consume, no penalty** (cozy) — villager `ablehnung`
    line + a gentle hint ("das ist eher bei … — frag im Buch nach"). Request
    stays open.
  If no open request → greeting only. Margrit → hint dialog.
- `src/ui/board.js`: Anschlagbrett station lists all open requests
  (villager name + complaint + season) as a read-only overview. Add an
  `anschlagbrett` station to `dorf.js`.
- `src/sim/progress.js`: add `recordDelivery(progress, speciesId)` /
  `hasDelivered(...)` (mirror `recordCraft`/`hasCrafted`).
- main.js: `generateDailyRequests` in `onDayComplete`; wire villager dialog +
  board into station/NPC interaction + modal guard; reputation reward on
  delivery; persist `requests` + `reputation`. HUD reflects coins/Vertrauen.
- **Acceptance:** sleep → a villager has a request (visible on the Anschlagbrett
  and when you talk to them); craft a matching remedy, deliver it → Münzen +
  Vertrauen rise, request clears, book records it; deliver a wrong remedy →
  polite decline, nothing lost, hint shown.

### WP7 — Polish, README, memory, holistic test
**Files:** `README.md`, memory files, light balancing.

- Browser-test the full loop end to end: wake → check board → forage/garden →
  craft (incl. a zutat-gated recipe) → deliver → reputation up → sleep → new
  requests. Screenshot proof of each new system.
- README: add a **"Stand: M4 — Dorf & Requests"** section (mirror the M3 section
  style) + add the WP "Entscheidungen": the 3 scope decisions above, the generic
  `map.stations` dispatch, the `evaluateDelivery` M5 extension point, the
  defensive-save-defaults (no version bump) choice, and the cozy
  no-penalty-on-mismatch delivery.
- Update `memory/project_overview.md`: M4 complete, M5 next.
- **Acceptance:** full fantasy loop playable start to finish without errors.

---

## Quick reference — files you will create

```
src/sim/reputation.js        src/ui/shop.js
src/sim/zutaten.js           src/ui/garden.js
src/sim/garden.js            src/ui/dialog.js      (villager/request dialog)
src/sim/requests.js          src/ui/board.js       (Anschlagbrett)
src/world/npc.js
src/data/shop.js             src/data/herbs/ringelblume.js
src/data/villagers.js        src/data/herbs/kamille.js
src/data/ailments.js         src/data/herbs/pfefferminze.js
```

## Files you will edit

```
src/main.js                  src/data/herbs/index.js
src/engine/save.js (NO version bump — defensive defaults in main.js instead)
src/ui/hud.js                src/data/recipes.js
src/ui/workshop.js           src/data/strings.de.js
src/sim/processing.js        src/data/maps/dorf.js
src/sim/progress.js          src/data/maps/garten.js
css/ui.css                   tools/download_plates.sh
README.md                    assets/plates/ATTRIBUTION.md
```

## Definition of done for M4
Walk the Dorf, talk to villagers, read the Anschlagbrett, buy ingredients/seeds
at the Dorfladen, grow herbs in the garden, craft remedies (including the
now-unlocked Tinktur/Ölauszug/Salbe), deliver the right remedy to the right
villager, watch Münzen + Vertrauen rise — and the book fill — then sleep into a
fresh set of requests. Each system registry-driven, no engine code knowing any
specific villager/herb/ailment by name.
