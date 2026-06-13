# Herbs Schmerbs — PLAN.md

A cozy pixel-art browser game about Swiss herbalism. You play the **Dorf-Heilerin/der Dorf-Heiler** of a small Swiss village: villagers come to you with everyday ailments, and you forage herbs by season, identify them carefully (lookalikes can be deadly), process them with real methods and real waiting times, and fill your herb book — **«Herbs Schmerbs»** — with genuine vintage botanical plates.

**The entire game UI and all content is in German (du-Form, leichte Schweizer Färbung).** This plan is written in English for implementation handoff; all in-game strings are German.

**The game must teach real herbalism.** Every herb, harvest window, lookalike warning, and processing method must be factually correct for Switzerland. When in doubt, be accurate rather than convenient for game balance.

---

## 1. Design pillars

1. **Lernen durch Spielen** — playing a full in-game year should leave the player genuinely knowing the Swiss foraging calendar, the classic dangerous lookalikes, and how tinctures/salves/syrups are actually made.
2. **Cozy, not punishing** — soft stakes, no fail state, no time pressure beyond the seasons themselves. But mistakes are *memorable* (see §8).
3. **Echt schweizerisch** — only herbs that actually grow in Switzerland, real protected-species rules, Swiss village flavor in names and dialogue.
4. **Pixel world, real book** — the world is warm 2D pixel art; the herb book uses real public-domain botanical illustrations (Köhler 1887). The contrast is intentional.

## 2. Tech stack

- Browser game, **vanilla JS with ES modules**, no framework, no build step.
- Multiple source files (see §13). Run via `python3 -m http.server` (ES modules need a server; document this in README).
- **Canvas** (pixel-scaled, `image-rendering: pixelated`) for the world; **DOM/CSS** for all UI overlays (dialogs, book, inventory, almanac). Don't render UI text in canvas.
- Save state in `localStorage` (autosave on sleep + manual save). Versioned save schema.
- No network calls at runtime. All assets local. The Almanach (§11) uses only `new Date()`.

## 3. Assets

### 3.1 World tiles & characters
- Use a **CC0 pack from Kenney** (kenney.nl — e.g. "Tiny Town" + "Tiny Dungeon" characters, 16×16) as base tileset: terrain, paths, houses, trees, water, fences, interiors. Download into `assets/tiles/`, keep Kenney's license note.
- Render at 16×16 logical tiles, scaled ×3 (configurable).

### 3.2 Plant sprites (custom, code-drawn)
- Each forageable herb needs a small distinctive sprite (16×24 or 16×16). Define them **in code as indexed-color pixel arrays** (palette + 2D index array per sprite) rendered to offscreen canvases at load. This avoids hand-drawn PNG work and keeps everything in-repo.
- Each herb has up to 3 seasonal stage sprites where relevant: `vegetativ`, `blühend`, `fruchtend` (e.g. Holunder: Blüten in June vs. Beeren in September — different harvest, different use).
- Sprites need to be *suggestive*, not botanically precise — precision lives in the Bestimmen feature texts (§7) and the Köhler plates.

### 3.3 Botanical plates (the educational heart)
- The book uses scans from **«Köhler's Medizinal-Pflanzen» (1887)** — public domain, available on Wikimedia Commons (search `Koehler's Medizinal-Pflanzen` category; files named like `Allium ursinum - Köhler–s Medizinal-Pflanzen-006.jpg`).
- Provide `tools/download_plates.sh` that curls each plate from Wikimedia Commons into `assets/plates/<latin-name>.jpg` (use the `Special:FilePath` endpoint), plus `assets/plates/ATTRIBUTION.md` listing source/license per file.
- For the few herbs without a Köhler plate, fall back to another PD source on Commons (e.g. Thomé, «Flora von Deutschland, Österreich und der Schweiz», 1885) — note the source per plate in ATTRIBUTION.md.
- Plates display in the book with a paper-texture CSS frame and the original plate caption style.

## 4. World structure (walkable)

Stardew-style top-down tile world, but **small and dense**. Maps are hand-authored **ASCII tile maps** in `src/data/maps/` — each map is a template-literal grid of characters plus a legend object (`"B": { tile: "bush", solid: true }`), with overlay entries for spawn points, transitions, and plant patches. This format is human-readable, diff-friendly, and cheap to edit later (changing the environment = editing characters in a text grid, no map editor needed). Simple AABB tile collision, 4-direction walking, camera follows player and clamps to map.

Maps (each roughly 30×20 to 50×30 tiles):

| Map | Content |
|---|---|
| **Dorf** | Village square with the big **Dorflinde** (lindenblüten harvest in summer!), your **Kräuterhäuschen** (home/workshop), Dorfladen, villagers' houses, well. Hub with exits to all biotopes. |
| **Garten** | Behind your house. 8–12 beds for cultivation (§9), drying rack, bench. |
| **Wiese** | Flower meadow + Wegrand. Sunny species. |
| **Waldrand & Wald** | Forest edge and shady interior. Spring ephemerals (Bärlauch!), elder, wild roses. |
| **Bachufer** | Stream with wet-soil species. |
| **Alpweide** | Mountain pasture, **unlocked in year 1 summer** via a quest. Protected species live here (§8.3). |
| **Kräuterhäuschen (interior)** | Workshop: Herd (teas, salves, syrup, Hausmittel), Mörser (powders), Regal (maceration jars), Vorratsregal (§10.1), Dachboden-Leiter (drying), bed (end day), bookstand (open Herbs Schmerbs). |

Villagers are static or two-position NPCs (house/square by time of day). No pathfinding needed beyond that.

## 5. Time & seasons (Hybrid model)

- **In-game**: 1 year = 4 seasons × 28 days. A day runs 06:00–24:00 on a visible clock; ~10 real minutes if you let it run, but the day only *ends when you sleep* (or at 24:00 you collapse → next morning, small energy penalty). Stardew pacing.
- Each calendar day belongs to a season; **herb availability is driven by (biotope × season-window)** from herb data. Some windows are narrow on purpose (Holunderblüten ~2 weeks in Frühsommer) — scarcity teaches the calendar.
- Light **energy** stat limits actions per day (walking is free; harvesting/digging/processing cost a little). Generous, anti-grind only.
- Optional weather (rain reskins tiles, waters garden for free). Stretch goal, not core.
- **Echtzeit-Brücke**: the Almanach chapter of the book (§11) reads the *real* date and shows what's in season in Switzerland *right now*, independent of game time.

## 6. Core loop

Morning: check requests (Anschlagbrett/visitors) → decide foraging route by what's in season → walk biotopes, spot plants, **Bestimmen** (§7), harvest correctly → afternoon: garden chores, start/continue processing (§10) → evening: deliver remedies to villagers (§8) → update book → sleep.

## 7. Bestimmen (identification) — the key learning mechanic

When the player interacts with a plant spawn, an **identification dialog** opens (DOM overlay):

1. Shows the zoomed sprite + the **Standort** (biotope, sun/shade, soil note).
2. Player can **examine features**, each revealing one line of real botanical detail: *Blattform, Blattstellung, Blüte, Geruch (Zerreiben), Stängel, Wuchshöhe*. Examining costs a few in-game minutes — encourages learning to need fewer clues.
3. Player chooses the species from a candidate list (the true species + its lookalikes + 1–2 plausible same-biotope species).
4. **Correct** → harvest choice (which part: Blätter/Blüten/Wurzel/Frucht — taking the *wrong part* yields a useless ingredient and a book note). **Wrong** → see §8.2.

**Mastery**: after 3 correct independent identifications of a species, it becomes *gelernt* — auto-identified on sight (name label on hover), no dialog needed. The dialog can always be reopened to review features. This is spaced repetition disguised as convenience.

Critical detail: lookalike species (Maiglöckchen, Herbstzeitlose, Hundspetersilie, Gefleckter Schierling, Fingerhut, Attich, Jakobskreuzkraut, Hundskamille, Pestwurz) **actually spawn in the world** in the same biotopes/seasons as their doubles, with near-identical sprites differing only in the feature texts. They are never requested by villagers; their only role is to be correctly *not* picked. Identifying one correctly ("Das ist Herbstzeitlose — stehen lassen!") also counts toward book completion.

## 8. Villagers, requests & consequences

### 8.1 Cast (6–8 NPCs, Swiss names, one ailment-theme each)
e.g.: **Vreni** (alt, Gelenke/Rheuma), **Ueli** (Bauer — Rückenweh, Schürfungen, Insektenstiche), **Klara** (Lehrerin — Schlafprobleme, Nervosität), **Res** (Wirt — Magen, Kater), **Sophie** (Kind — Schürfwunden, Husten), **Anna** (Sophies Mutter — Erkältungen im Haus, will Vorräte), **Frau Margrit** (pensionierte Heilerin — your informal mentor, gives tutorial guidance & quests, sells you nothing but wisdom). Final names/flavor free to adjust.

Requests are generated from a seasonal ailment table (Erkältungen im Winter, Insektenstiche & Sonnenbrand im Sommer, …) and phrased in character. Each request maps to 1–3 valid remedies (from §10 recipes) — the player must figure out *which* herb/preparation fits, with the book and Frau Margrit as help. Rewards: Münzen + reputation (**Vertrauen**, per-villager and village-wide). Vertrauen gates the Alpweide quest, shop stock, and villagers gifting you rare seeds.

All claims are framed as traditional use: «wird traditionell verwendet bei …». A short respectful disclaimer on the title screen: the game teaches Pflanzenkunde, ersetzt keinen Arztbesuch.

### 8.2 Echte Konsequenzen (chosen design)
- Delivering a remedy made from a **misidentified harmless** herb → it simply doesn't help; villager returns disappointed, small Vertrauen dip, book records the Verwechslung.
- A **toxic lookalike** in a remedy → the villager gets sick for 2–3 days (visibly: stays home, others mention it), notable Vertrauen drop, and a dramatic full-page book entry: «Verwechslung! Herbstzeitlose ist tödlich giftig — Merkmal: kein Knoblauchgeruch, Blätter umfassen den Stängel…». Never permanent death — cozy game — but the scare is the lesson.
- Eating/tasting foraged toxic plants yourself → you're sick in bed 1–2 days (time/season cost).
- The toxic-lookalike event should be *rare and earned* (only possible if the player ignores or rushes identification), but fully possible.

### 8.3 Geschützte Arten (harvesting ethics)
- Rules taught in-world: **nie alles ernten** (harvesting >⅔ of a wild patch makes it not respawn that year), and **geschützte Arten stehen lassen**. Arnika and Gelber Enzian on the Alpweide are protected: picking them triggers Frau Margrit / a Wildhüter scene, Vertrauen penalty, herb confiscated. The legal path: Arnika can be *cultivated from seed in the garden*; Enzianwurzel can be *bought* at the Dorfladen (cultivated source). This mirrors real Swiss practice (NHV/kantonale Listen).

## 9. Garden

- 8–12 beds. Sow seeds (bought or gifted) or transplant wild finds. Simple model: plant → water every 1–2 days → harvestable in season, repeatedly for Mehrjährige.
- Cultivable: Ringelblume, Kamille, Pfefferminze, Zitronenmelisse, Salbei, Thymian, Lavendel, Baldrian, Arnika (slow, special), plus Küchenzutaten-Beete: Zwiebel, Knoblauch (§10). **Not cultivable** (forage-only, communicate why): Bärlauch, Holunder, Linde, Mädesüss, Hagebutte, Huflattich, Schlüsselblume… Garden = reliability; forest = seasonality. Both are needed.
- Drying rack + workshop shelf give the garden a logistics role: harvested ≠ usable until processed.

## 10. Verarbeiten (processing) — real methods, real durations

Processing happens in the Kräuterhäuschen. Started preparations live on the Regal/Dachboden and tick in game-days. UI: jars/bundles with progress labels («Tinktur — noch 12 Tage, täglich schütteln»).

| Methode | Real rule encoded in game | Dauer (Spieltage) |
|---|---|---|
| **Trocknen** | Bündel kopfüber, dunkel & luftig (Dachboden). Needed for teas & storage; dried herbs keep ~1 year (then verfallen — teaches Vorratspflege) | 5–8 |
| **Tee/Aufguss** | frisch oder getrocknet, sofort fertig; correct plant part matters | 0 |
| **Tinktur** | zerkleinertes Kraut 1:5 in 40 % Alkohol (Schnaps vom Dorfladen), dunkel, **täglich schütteln** (daily interaction or it takes longer), dann abseihen | 21 |
| **Ölauszug** | Blüten in Olivenöl ans **Sonnenfenster**; Johanniskraut wird rot («Rotöl») | 42 (warm method for Ringelblume: 2) |
| **Salbe** | Ölauszug + Bienenwachs (~10:1) am Herd schmelzen, in Tiegel | 0 (requires fertiges Öl) |
| **Sirup** | Holunderblüten/Tannenspitzen + Zucker + Zitrone, ziehen lassen, abseihen | 2–3 |
| **Honigauszug** | Kraut in Honig (Thymianhonig gegen Husten) | 7 |
| **Pulver** | getrocknetes Kraut im **Mörser** pulverisieren; z.B. Schafgarben-Wundpulver («Soldatenkraut») — blutstillend auf kleine Schnittwunden gestreut | 0 (requires getrocknetes Kraut) |
| **Wickel/Umschlag** | frisch zerquetscht (Spitzwegerich auf Insektenstich — works in the field!), Quark-/Beinwellwickel, **Zwiebelsäckli** ans Ohr bei Ohrenweh | 0 |
| **Küchen-Hausmittel** | am Herd aus Küchenzutaten ± Kräutern: **Zwiebelsirup** gegen Husten (Zwiebel + Zucker/Honig, über Nacht ziehen), **Goldene Milch** (Kurkuma + Milch + Honig + Prise Pfeffer), **Knoblauch-Honig** bei Erkältung, heisse Zitrone, Salbeimilch | 0–1 |

Recipes unlock progressively (Frau Margrit, book pages, experimentation). Each finished product records its ingredients — quality/validity is determined at delivery (§8.2).

**Küchenzutaten are a second ingredient class** alongside herbs: Zwiebel & Knoblauch (growable in the garden), Honig, Milch, Quark, Zucker, Zitrone, Essig, and exotics like Kurkuma & Ingwer — sold at the Dorfladen (the book honestly notes which ones don't grow in Switzerland: «wächst nicht bei uns — aus dem Lädeli»). They combine with herbs in recipes and power the Hausmittel tradition: not every remedy needs a foraged plant, and the game should teach that the kitchen *is* part of the Hausapotheke. Hausmittel recipes appear in the book's Rezepte chapter and are valid answers to villager requests (Res's Erkältung can be met with Holundertee *or* Zwiebelsirup).

**Methods are a data registry** (`src/data/methods.js`), not engine code. Each method declares: required station (Herd/Regal/Dachboden/Sonnenfenster), inputs, duration in days, **care actions** (a generic hook — e.g. `{ action: "schuetteln", every: 1 }` for tinctures, `{ action: "wenden", every: 2 }` for drying bundles; neglecting care extends duration or reduces quality, communicated in German on the jar label), and output product type. Adding a new method later (Oxymel, Kräutersalz, Hustenbonbons, Räuchern, Dampfbad…) = one registry entry + a recipe + strings, no engine changes — same expandability rule as herbs (§13.1).

### 10.1 Vorratshaltung (storage) — a real system, not an afterthought

Correct storage is part of the craft the game teaches. Your Kräuterhäuschen has a **Vorratsregal** (pantry shelf UI) where every stored item shows container, location, and remaining shelf life.

- **Containers matter** (bought at the Dorfladen, reusable): *Braunglas* (lichtgeschützt — correct for dried herbs & tinctures), *Klarglas* (cheaper, contents degrade faster in light), *Salbentiegel*, *Sirupflasche* (must be sauber/heiss ausgespült — a one-click «sterilisieren» step at the Herd; skipping it risks Schimmel).
- **Conditions matter**: shelf spots are *hell* vs. *dunkel* and *warm* vs. *kühl* (Keller unlockable). Each product type has correct conditions; wrong placement shortens shelf life. The book's Rezepte pages state the real rule («dunkel und kühl lagern, beschriftet mit Datum»).
- **Real shelf lives** (in game time, matching real-world guidance): getrocknete Kräuter ~1 Jahr im Braunglas (deutlich kürzer in Klarglas/hell), Tinkturen mehrere Jahre, Ölauszüge ~1 Jahr (können **ranzig** werden — warm gelagert schneller), Salben ~6–12 Monate kühl, Sirup ~6 Monate (angebrochen kürzer), frische Kräuter 1–2 Tage.
- **Labeling**: storing an item auto-labels it (Inhalt + Erntedatum) — and the *Verwechslungs-risk applies here too*: a misidentified herb sits mislabeled in your pantry until used. Expired/spoiled items show visibly (verblasst, Schimmel) and must be discarded; using them yields weak or harmful remedies.
- **The seasonal logic this creates is the lesson**: Lindenblüten and Holunderblüten harvested in June, dried and stored correctly, are what get the village through the Erkältungswinter. Vorratsplanung *is* gameplay.

## 11. The book: «Herbs Schmerbs»

Full-screen DOM overlay styled as a worn notebook; the title is hand-lettered «Herbs Schmerbs» on the cover. Four chapters (tabs as Lesezeichen):

1. **Pflanzen** — one spread per species: left page the **Köhler plate**, right page the facts, which **fill in progressively**: name appears on first sighting, features after examining, Erntezeit/Standort after first correct harvest, Wirkung & Rezeptverweise after first successful remedy, Verwechslungsgefahr panel (red edge) after meeting/learning the lookalike. Completion % per plant and overall.
2. **Rezepte** — known preparations with method, duration, real-world quantities (e.g. «1 TL getrocknete Blüten auf 2 dl Wasser, 10 Min ziehen»).
3. **Almanach** — two columns: *Spieljahr* (current game season: what's harvestable where) and **«Draussen vor deiner Tür»** — driven by the **real date**: which of the game's herbs are in season in Switzerland *this real month*, with a practical foraging tip. This is the bridge from game knowledge to a real walk outside.
4. **Verwechslungen** — the poison gallery: side-by-side feature comparison of each dangerous pair, unlocked as encountered. The most important educational page in the game.

## 12. Herb data (the content core)

All species data lives in `src/data/herbs/` — **one module per species** (`baerlauch.js`, `holunder.js`, …) plus an `index.js` that imports and aggregates them. Adding a herb later means: create one self-contained file (data + pixel-sprite array), add one import line, add spawn patches to a map, drop the plate into `assets/plates/`. **No engine code is touched to add content.** **~32 species + 9 lookalikes** at launch. Every entry must be verified-accurate for Switzerland. Schema example (fully worked):

```js
baerlauch: {
  nameDe: "Bärlauch", nameLat: "Allium ursinum", schweizerdeutsch: "Bärlouch",
  plate: "allium-ursinum.jpg",
  biotope: ["wald"], sonne: "schattig", boden: "feucht, humos",
  saison: { teil: { blaetter: ["fruehling:1-21"], blueten: ["fruehling:14-28"] } },
  merkmale: {
    blattform: "breit-lanzettlich, weich, gestielt, matte Unterseite",
    blattstellung: "einzeln aus dem Boden (jedes Blatt eigener Stiel!)",
    bluete: "weisse Sterndolden",
    geruch: "deutlich nach Knoblauch beim Zerreiben",
    stengel: "dreikantiger Blütenstängel"
  },
  verwechslung: [
    { art: "maigloeckchen", gefahr: "giftig", unterscheidung: "Blätter zu zweit am Stängel, glänzende Unterseite, KEIN Knoblauchgeruch" },
    { art: "herbstzeitlose", gefahr: "toedlich", unterscheidung: "Blätter umfassen den Stängel, steifer, kein Stiel, KEIN Knoblauchgeruch" }
  ],
  geschuetzt: false, kultivierbar: false,
  verwendung: { blaetter: ["kueche", "tinktur"], wirkungTraditionell: "stoffwechselanregend, bei Frühjahrsmüdigkeit" },
  fundorte: 3 // spawn patches in the Wald map
}
```

### Species list (implementer: expand each into the full schema, verify facts)

**Garten (kultivierbar):** Ringelblume, Echte Kamille, Pfefferminze, Zitronenmelisse, Salbei, Thymian, Lavendel, Baldrian.
**Wiese/Wegrand:** Löwenzahn, Gänseblümchen, Spitzwegerich, Schafgarbe, Johanniskraut, Rotklee, Frauenmantel, Malve, Wegwarte, Königskerze, Brennnessel, Giersch, Gundelrebe.
**Wald/Waldrand:** Bärlauch, Schwarzer Holunder (Blüten + Beeren), Hagebutte/Hundsrose, Weissdorn, Schlehe, Birke (Blätter), Fichte (Maitriebe), Veilchen, Schlüsselblume (teilweise geschützt — teach checking), Huflattich.
**Bachufer:** Mädesüss, Beinwell, Weide (Rinde).
**Alpweide:** Arnika (geschützt), Gelber Enzian (geschützt), Alpen-Frauenmantel, Quendel, Wacholder.
**Dorf:** Linde (Dorflinde, Blüten im Hochsommer).

**Lookalikes (spawn, never requested):** Maiglöckchen (giftig), Herbstzeitlose (tödlich), Hundskamille (wirkungslos), Gefleckter Schierling (tödlich — vs. Giersch/Wilde Möhre), Hundspetersilie (giftig), Roter Fingerhut (tödlich — vs. Beinwell-Rosette), Attich/Zwergholunder (giftig — vs. Holunder), Jakobskreuzkraut (giftig — vs. Johanniskraut im Heu-Sinn), Pestwurz (vs. Huflattich).

Season windows use game calendar (`fruehling/sommer/herbst/winter` + day ranges) **and** a `realMonths: [5,6]` field for the Almanach's real-world column.

## 13. Project structure

```
herbsSchmerbs/
  index.html            # canvas + UI root, loads src/main.js as module
  README.md             # how to run, asset download steps
  css/                  # ui.css, book.css (paper/notebook styling)
  src/
    main.js             # boot, game loop, scene switching
    engine/             # loop.js, input.js, camera.js, tilemap.js, sprites.js, save.js
    world/              # player.js, npc.js, plantSpawns.js, mapLoader.js
    sim/                # time.js, energy.js, inventory.js, processing.js, storage.js,
                        # requests.js, reputation.js, garden.js
    ui/                 # hud.js, dialog.js, identify.js, book.js, almanac.js, shop.js
    data/               # methods.js, recipes.js, ailments.js, villagers.js, strings.de.js
      herbs/            # one module per species + index.js (incl. its sprite array)
      maps/             # one ASCII map module per area + legend
  assets/
    tiles/              # Kenney CC0 (+ license note)
    plates/             # Köhler scans + ATTRIBUTION.md
  tools/
    download_plates.sh  # fetch plates from Wikimedia Commons
  EXPANDING.md          # content-author guide (see §13.1)
```

All user-facing strings live in `strings.de.js` (plus the German content in data files). No English may appear in-game.

### 13.1 Expandability (hard design constraint)

The game will grow after launch — more herbs, new map areas, new villagers/ailments — and those additions should be possible **without reading or modifying engine code**. Therefore:

- **Engine and content are strictly separated.** Engine modules consume the aggregated data exports and must contain zero species-, map-, or villager-specific logic (no `if (herb === "baerlauch")` anywhere).
- Everything content-like is **registry-driven**: herbs, recipes, ailments, villagers, and maps are data files; the engine discovers them through their index modules.
- Write **`EXPANDING.md`** during M5: step-by-step checklists for "Neues Kraut hinzufügen", "Karte ändern/erweitern", "Neuer Dorfbewohner", "Neues Rezept", "Neue Verarbeitungsmethode", each listing exactly which files to touch and including a copy-paste template. A future session (or a smaller model) should be able to add a herb from this guide + one example file alone, without loading the engine into context.

## 14. Milestones (build order)

1. **M1 — Walking skeleton**: engine, one map (Dorf), player movement/collision, camera, day clock, sleep cycle, save/load. *Playable: walk around, time passes.*
2. **M2 — Foraging & Bestimmen**: all maps, seasons driving plant spawns, identification dialog with 8 starter herbs + Bärlauch lookalike trio, inventory. *Playable: the core learning loop.*
3. **M3 — Verarbeiten & book**: workshop interior, drying/tinctures/salves/tea with durations, book chapters Pflanzen + Rezepte with plates, plate download tooling. *Playable: forage → craft → book fills.*
4. **M4 — Dorf & requests**: villagers, request generation, delivery & consequences (§8.2), reputation, shop, garden. *Playable: the full fantasy.*
5. **M5 — Content & polish**: all ~32 herbs + 9 lookalikes fully dataed and verified, Alpweide + protected-species quest, Almanach real-date page, Verwechslungen gallery, audio (stretch), balancing, title screen + disclaimer.

Each milestone should leave the game runnable. Verify in browser (load, walk, trigger the new systems) before moving on.

## 15. Non-goals

- No combat, no death, no fail state, no monetization, no backend, no accounts.
- No medical dosage advice beyond traditional-use Tee-style quantities; no claims of curing diseases.
- No procedural map generation — hand-authored maps are part of the coziness.
- Winter is sparse on purpose (Hagebutten, Schlehen nach Frost, Fichtennadeln, Vorräte, Wurzelernte) — don't "fix" it by adding fantasy winter herbs.

## 16. Open questions for implementation (decide pragmatically, note decisions in README)

- Exact Kenney pack(s) and whether character sprites need recoloring.
- Whether NPC dialogue is template-generated or hand-written per request type (recommend: hand-written templates with slots).
- Energy tuning, prices, Vertrauen thresholds — balance freely, keep it gentle.
- Sound: optional; if added, CC0 only.
