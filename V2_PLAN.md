# V2 Plan — Visual & UX Overhaul

> v1 shipped M1–M5: full herb roster, Alpweide quest, toxic mislabeling, four
> book chapters, title screen, contributor guide.
>
> **v2 direction (decided 2026-06-13, from playtest feedback):** v2 is a pure
> **visual + UX overhaul**. v1 has the systems; it doesn't yet *look* or *read*
> like a game. The simulation-depth ideas originally drafted for v2 (storage,
> energy, weather, audio) are deferred to v3 — see bottom of this file.

---

## What the playtest surfaced

1. **Wrong title.** It says "Herbs Schmerbs" — should be "Herbalism Game".
2. **The avatar isn't a person** — it's a flat brown square.
3. **The world is unreadable** — every tile and station is a flat colored
   square. "I don't know what these squares represent."
4. **No map.** Want a map I can open (from the HUD / inventory) to see where
   things are.
5. **Game should start in my shop/house**, inside the village — that's home base.
6. **Customers should come to me.** Keep the notice board, but put it **in front
   of my shop**, and add a **deposit box** where I drop finished products.
7. **Real botanical images.** When I press E on a plant, show a real botanical
   anatomy plate (not the pixel sprite), clickable to expand. Keep the text
   descriptions too. All plates from the **same source** for visual consistency.

## Decisions locked

- **Scope:** visual/UX only. No spoilage/energy/weather sim in v2.
- **Art:** upgrade the existing 16px pixel art with a cohesive **CC0** tileset +
  character. Keep the custom pixel herb sprites — they stay consistent.
- **Customers:** notice board relocated to in front of the shop + a new deposit
  box station. **No** walk-in NPC pathfinding.
- **Plates:** **Köhler's Medizinal-Pflanzen (1887)** antique colored plates,
  public domain. Single consistent source; per-herb `plate` filenames already
  exist in the data.

---

## Architecture notes (why this is cheaper than it looks)

- **Tile renderer is image-ready.** `tilemap.js#renderMap` fills flat `color`
  per tile. Swapping to sprites is an additive change: load a tileset atlas,
  draw the atlas cell when a legend entry has a sprite ref, else fall back to
  `color`. Zero changes to map *logic* (`solid`, exits, stations).
- **Stations already exist & are proximity-gated.** The Kräuterhäuschen has
  dachboden, herd, mörser, vorratsregal, buchstand, sonnenfenster, bett — the
  craft menu only opens next to one (`main.js#updateInteractables`). The problem
  is purely that they render as identical squares. Distinct furniture sprites
  fix the "what does this square mean" complaint with no mechanics change.
- **Plates are half-wired.** Every herb module has `nameLat` + a `plate`
  filename; `book.js` already renders `assets/plates/<plate>` with graceful
  fallback. v2 work = download the images for all herbs + show the plate in the
  **E-interact (identify) dialog** with click-to-expand.

---

## Work packages

### WP1 — Rename to "Herbalism Game"
- `index.html` `<title>`, `title.js` (title screen heading/intro), `README.md`,
  any other "Herbs Schmerbs" strings (grep `schmerbs`/`schmurp`).
- Keep the German in-game tone; only the product name changes.
- **DoD:** no "Schmerbs" anywhere; title screen and tab read "Herbalism Game".

### WP2 — World & station art (CC0 pixel tileset)
- Source a cohesive CC0 16px tileset (Kenney-style) → `assets/tiles/` with an
  `ATTRIBUTION.md` (same discipline as `assets/plates/`).
- `engine/tileset.js`: load atlas image, expose cell-blit by index/coords.
- `tilemap.js#renderMap`: draw atlas cell when legend entry has a sprite ref,
  else fall back to `def.color` (keeps maps that aren't mapped yet working).
- Add sprite refs to each tile char across the 8 maps (dorf, wald, wiese,
  waldrand, bachufer, garten, alpweide, kraeuterhaeuschen). Grass/path/water/
  wall/floor + **distinct furniture sprites** for each station type so they read
  as objects.
- Single-tile-per-type first; edge/auto-tiling is a stretch.
- **DoD:** every map renders with textures; each station is visually distinct
  and recognizable.

### WP3 — Player avatar (+ NPCs)
- Source/compose a CC0 directional character sprite (4 directions; walk frames
  if available). `assets/sprites/` + attribution.
- Replace `sprites.js#drawPlayer` to blit the character by `player.direction`
  (optional 2–3 frame walk cycle driven by movement).
- Optionally upgrade NPC rendering (`world/npc.js`) to matching character
  sprites for consistency.
- **DoD:** the avatar reads as a person and faces the way it moves.

### WP4 — Start in the shop · board out front · deposit box
- New games start in `kraeuterhaeuschen` (saved games keep their stored map).
- Relocate the Anschlagbrett (notice board) from the village center to **just
  outside the cottage door** in `dorf.js`.
- New **deposit box** station (`type: "abgabebox"`) beside the board. New
  `ui/deposit.js`: lists open requests, lets the player deposit a matching
  finished product → reuses `evaluateDelivery` to grant coins/Vertrauen / handle
  toxic mismatch. (Direct villager hand-off via `dialog.js` can stay as a
  secondary path.)
- Strings + interaction prompts for the new station.
- **DoD:** game opens inside the shop; board + deposit box sit at the entrance;
  depositing a correct remedy fulfills a request.

### WP5 — Botanical plates in the E-dialog (Köhler, click-to-expand)
- Expand `tools/download_plates.sh` to fetch a Köhler (fallback: Thomé, also
  pre-1927 colored, consistent enough) plate for **every** herb with a non-null
  `plate`; fill in plates for herbs currently `plate: null` where one exists.
  Record each in `assets/plates/ATTRIBUTION.md`.
- `ui/identify.js`: in the header, show the plate image (when present) in place
  of the pixel sprite; click → full-size lightbox overlay. Pixel sprite remains
  the graceful fallback. **Keep all merkmale/descriptions unchanged.**
- **DoD:** pressing E shows a real botanical plate, clicking expands it, and
  herbs without a sourced plate still work (sprite fallback).

### WP6 — Openable map
- `ui/map.js`: a stylized overview of the connected areas (Dorf hub + Wald,
  Wiese, Bachufer, Waldrand, Garten, Alpweide, your cottage) with the player's
  current area highlighted and key spots marked (shop, board, foraging zones).
- Open via a HUD button + `M` key (and/or an entry in the inventory panel).
- **DoD:** pressing M opens a readable map showing where I am and where things
  are.

---

## Suggested sequence
WP1 (trivial) → WP2 (tiles, biggest visual win) → WP3 (avatar) → WP4 (shop/board/
deposit) → WP5 (plates) → WP6 (map). WP2/WP3/WP5 each need an asset-sourcing pass.

## Risks
- **CC0 asset fetching.** Kenney packs ship as zips; need a reliable fetch path
  (kenney.nl / GitHub mirror / OpenGameArt CC0). Flag if a download is unstable.
- **Plate coverage.** A few toxic/non-medicinal species aren't in Köhler; use a
  same-era colored source (Thomé) or leave the sprite fallback. Plates already
  degrade gracefully.
- **Tileset cohesion.** Custom pixel herb sprites must not clash with the chosen
  tileset palette — pick a soft/cozy CC0 set.

---

## Deferred to V3 (was the original v2 sim draft)

The simulation-depth ideas below are **not** in v2. Kept here for v3.

- **Vollständige Vorratshaltung:** container types (Braunglas/Klarglas/Papier),
  Lagerplätze, Haltbarkeit/expiry, Befüllen workflow, save-schema bump.
- **Energie & Erschöpfung:** energy stat, self-poisoning → sick in bed, fatigue
  collapse, no death.
- **Wetter:** daily weather state affecting foraging yield, shown in HUD.
- **Audio:** CC0 ambient layers + UI blips, mute toggle.
- **Interactive crafting screen** (player explicitly called this "for the
  future"): a dedicated workshop view with shelves you manipulate directly,
  replacing the dialog prompt.
