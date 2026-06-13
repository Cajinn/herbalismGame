# V2 Plan — Lebendige Welt & Vorratshaltung

> v1 shipped M1–M5 complete: full herb roster, Alpweide quest, toxic mislabeling,
> four book chapters, title screen, contributor guide.
> v2 deepens the living world with the three systems explicitly deferred in M5.

---

## Theme: the Hausapotheke comes alive

v1 teaches *what* to forage and *how* to process it. v2 makes the results matter
beyond the next delivery: things age, containers matter, the world has weather,
and the player has a body.

---

## Work areas (not yet sequenced into WPs)

### 1. Vollständige Vorratshaltung (§10.1)

The biggest deferral from M5. The sim that makes processed herbs feel real.

- **Container types**: Braunglas (dunkel, haltbar), Klarglas (licht, kürzer),
  Papier (sehr kurz). Buying Behälter at the Dorfladen.
- **Lagerplätze**: Vorratsregal (dunkel, kühl), Fensterbrett (licht, warm).
  Mismatch degrades quality faster.
- **Haltbarkeit**: each processed item has an expiry in game-days. Visual cue
  (farbe verblasst) before Schimmel. Expired item = unusable, must discard.
- **Befüllen workflow**: new step in workshop — fill a container after processing.
  Affects shelf-life. No container → short-lived, cannot be delivered.
- **Save schema**: container + expiry fields on inventory items. Bump SAVE_VERSION
  since this is a v2 break anyway.

### 2. Energie & Erschöpfung (§6, §8.2)

- Player has an energy stat (e.g. 0–100). Foraging, processing, and travel cost
  energy. Sleep restores it.
- Self-tasting a toxic forage → player sick in bed 1–2 days (time cost, no
  foraging). The M5 self-tasting string (`strings.toxic.selbstVergiftet`) is
  already written — just not wired.
- Fatigue at zero → forced early sleep (same mechanic as midnight collapse).
- Keeps the cozy feel: no death, no permanent loss — just slower days.

### 3. Wetter (weather)

- Simple daily weather state: sonnig / bewölkt / regnerisch / neblig.
- Affects foraging yield (rain → fewer available spawns; fog → harder to spot).
- Visible in HUD. Changes at day boundary.
- Stretch: some herbs only appear after rain (Pfifferlinge?) or in fog.

### 4. Audio

- Ambient layer per map (Vogelgezwitscher / Bachgemurmel / Dorfgeräusche).
- UI blips: harvest, dialog open, delivery success.
- CC0 sources only; all documented in `assets/audio/ATTRIBUTION.md`.
- Mute toggle in HUD. No autoplay surprise on load.
- Lowest priority — ship without if sourcing CC0 takes too long.

### 5. Tile-Grafik (stretch)

- Replace color-placeholder tiles with real pixel art (Kenney CC0 or custom).
- Pure asset swap in `src/data/maps/*.js` — zero engine changes needed.
- Lowest priority but highest visual impact.

---

## Scope decisions (locked for v2)

- **No new herb species in v2.** The roster is complete at ~32 + 9. New content
  focus is depth (storage, energy) not breadth.
- **Vorratshaltung is the anchor work area.** If v2 ships nothing else, it ships
  this.
- **Audio and tile art are optional** — ship if CC0 sources are found and
  integration is clean, skip if not.
- **SAVE_VERSION bump is appropriate for v2** — the container/expiry fields on
  inventory items are a schema break; old saves can be discarded cleanly.

---

## Definition of done for v2

A processed herb in a Braunglas on the Vorratsregal has a longer shelf-life than
the same herb in Klarglas on the Fensterbrett. The player runs low on energy after
a full day of foraging and must sleep. A delivery of a fresh Baldrian-Tinktur in a
properly sealed Braunglas is meaningfully different from one in a scrappy Papier-
Beutel. The Almanach shows today's weather. Optional: ambient birdsong plays.
