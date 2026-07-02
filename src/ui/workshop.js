import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { methods } from "../data/methods.js";
import { recipesForStation } from "../data/recipes.js";
import { shopCatalog } from "../data/shop.js";
import { groupInventory, countItem } from "../sim/inventory.js";
import { prepProgress, requiredZutaten, careDueToday } from "../sim/processing.js";
import { countZutat } from "../sim/zutaten.js";
import { absoluteDay } from "../sim/time.js";
import { drawTile } from "../engine/tileset.js";
import { herbTile } from "../data/herbTiles.js";
import { sfx } from "../engine/audio.js";

// Interactive crafting screen opened when the player interacts with a station
// in the Kräuterhäuschen. A full-viewport wooden overlay (not a floating list
// dialog) with three zones: header (station art + title), an "In Arbeit"
// shelf for running preparations (with care buttons), and a two-panel
// crafting area (Zutatenbord shelf + Rezepte cards). `onStartDrying`,
// `onStartRecipe`, `onSleep`, `onCare` are callbacks from main.js.
// Returns { open(stationType, inventory, processingState, time, zutaten),
// close(), isOpen() }.
export function createWorkshopDialog(root, { onStartDrying, onStartRecipe, onSleep, onCare }) {
  const overlay = document.createElement("div");
  overlay.className = "workshop";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "workshop__panel";
  overlay.appendChild(panel);
  root.appendChild(overlay);

  // Snapshot of the args passed to open(), so care-button re-renders don't
  // need fresh arguments from the caller — the underlying objects are the
  // same live references main.js mutates (inventory/processingState/zutaten),
  // so re-reading them here always reflects the current game state.
  let _stationType = null;
  let _inventory = null;
  let _processingState = null;
  let _time = null;
  let _zutaten = null;

  // Craft-area selection, kept across re-renders within one open() session so
  // choosing a shelf item survives a care-button click. Reset on every open().
  let selectedSpecies = null; // Zutatenbord filter for recipe stations
  let selectedRaw = null;     // { species, teil } chosen on the Dachboden shelf

  function close() {
    overlay.hidden = true;
    panel.innerHTML = "";
    _stationType = null;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });

  // ── station header art ─────────────────────────────────────────────────
  // Mirrors the furniture sprites `loadObject`-ed by main.js for the
  // Kräuterhäuschen interior (see src/data/maps/kraeuterhaeuschen.js
  // `stations`, and the matching loadObject(...) calls near the top of
  // main.js) — same PNGs, just shown here as a portrait instead of a tile.
  const STATION_ART = {
    dachboden:     "assets/objects/interior/testhuette/drying_rack_v2.png",
    herd:          "assets/objects/interior/testhuette/hearth.png",
    moerser:       "assets/objects/interior/testhuette/mortar_desk_v2.png",
    vorratsregal:  "assets/objects/interior/testhuette/storage_shelf.png",
    sonnenfenster: "assets/objects/interior/testhuette/wall_window.png",
    bett:          "assets/objects/interior/bed/bed_0.png",
    buchstand:     "assets/objects/interior/testhuette/book_stand.png",
  };

  function renderHeader(stationType) {
    const header = el("div", null, "workshop__header");

    const art = document.createElement("img");
    art.className = "workshop__art";
    art.alt = "";
    art.src = STATION_ART[stationType] ?? "";
    header.appendChild(art);

    header.appendChild(el("h2", strings.stationen[stationType] ?? stationType, "workshop__title"));

    const closeX = makeBtn("×", close, "workshop__close-x");
    closeX.setAttribute("aria-label", strings.bestimmen.schliessen);
    header.appendChild(closeX);

    return header;
  }

  // ── ingredient thumbnail ──────────────────────────────────────────────────
  // Same PixelLab-PNG-with-tile-fallback approach as identify.js / book.js:
  // try the per-species PNG first, fall back to the Sprout Lands atlas tile.
  const THUMB_SIZE = 40;
  function herbImg(speciesKey, className = "workshop__herb-img") {
    const img = document.createElement("img");
    img.className = className;
    img.src = `assets/objects/herbs/${speciesKey}.png`;
    img.alt = "";
    img.addEventListener("error", () => {
      const canvas = document.createElement("canvas");
      canvas.className = className;
      canvas.width = THUMB_SIZE;
      canvas.height = THUMB_SIZE;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      const [atlas, idx] = herbTile(speciesKey);
      drawTile(ctx, atlas, idx, 0, 0, THUMB_SIZE);
      img.replaceWith(canvas);
    });
    return img;
  }

  // Zutat display names live in the shop catalog (single source of truth —
  // every purchasable zutat already has a nameDe there).
  function zutatName(key) {
    return shopCatalog.find((item) => item.kind === "zutat" && item.ref === key)?.nameDe ?? key;
  }

  // ── "In Arbeit" shelf — running preparations at this station ─────────────
  function renderRunning(stationType, processingState, time) {
    const running = (processingState?.preparations ?? []).filter(
      (p) => methods[p.method]?.station === stationType,
    );
    if (running.length === 0) return null;

    const section = el("div", null, "workshop__running");
    section.appendChild(el("p", strings.werkstatt.laufend, "workshop__running-label"));

    const shelf = el("div", null, "workshop__running-shelf");
    const today = absoluteDay(time);

    for (const prep of running) {
      const method = methods[prep.method];
      const herb = herbs[prep.species];
      const { elapsed, remaining } = prepProgress(prep, time);
      const pct = method.durationDays > 0
        ? Math.max(0, Math.min(100, Math.round((elapsed / method.durationDays) * 100)))
        : 100;

      const card = el("div", null, "workshop__prep-card");

      const head = el("div", null, "workshop__prep-head");
      head.appendChild(herbImg(prep.species, "workshop__prep-img"));
      head.appendChild(el("span", herb?.nameDe ?? prep.species, "workshop__prep-name"));
      card.appendChild(head);

      const bar = el("div", null, "workshop__prep-bar");
      const fill = el("div", null, "workshop__prep-bar-fill");
      fill.style.width = `${pct}%`;
      bar.appendChild(fill);
      card.appendChild(bar);

      const tageWort = remaining === 1 ? strings.werkstatt.tag : strings.werkstatt.tage;
      card.appendChild(el("p", `${strings.werkstatt.noch} ${remaining} ${tageWort}`, "workshop__prep-remaining"));

      const care = careDueToday(prep, method, today);
      if (care.due) {
        for (const action of care.actions) {
          const label = strings.werkstatt.pflegeAktionen[action] ?? action;
          card.appendChild(makeBtn(label, () => {
            onCare?.(prep.id, action);
            renderAll();
          }, "workshop__care-btn"));
        }
      } else if (method.care?.length) {
        card.appendChild(el("p", strings.werkstatt.versorgt, "workshop__care-done"));
      }

      shelf.appendChild(card);
    }

    section.appendChild(shelf);
    section.appendChild(el("p", strings.werkstatt.pflegeHinweis, "workshop__care-hint"));
    return section;
  }

  // ── Zutatenbord (shared shelf widget) ─────────────────────────────────────
  function renderBoardItem(group, isSelected, onSelect) {
    const { species, teil, processed, quality, count } = group;
    const herb = herbs[species];

    const item = makeBtn(null, () => { sfx("blip"); onSelect(); }, "workshop__board-item");
    if (isSelected) item.classList.add("workshop__board-item--selected");

    item.appendChild(herbImg(species));
    item.appendChild(el("span", herb?.nameDe ?? species, "workshop__board-name"));
    item.appendChild(el("span", `${strings.teile[teil] ?? teil} ×${count}`, "workshop__board-meta"));
    if (processed && quality) {
      item.appendChild(el("span", strings.qualitaet[quality] ?? quality, "workshop__board-quality"));
    }
    return item;
  }

  // ── Dachboden (Trocknen) — no recipes, just raw herb → drying flow ────────
  function renderDachboden(inventory, processingState, time) {
    const frag = document.createDocumentFragment();
    const runningSection = renderRunning("dachboden", processingState, time);
    if (runningSection) frag.appendChild(runningSection);

    const craft = el("div", null, "workshop__craft");

    // Exclude unbrauchbar raw items — they can't be dried.
    const raw = groupInventory(inventory).filter(
      (g) => !g.processed && g.quality !== "unbrauchbar",
    );

    const board = el("div", null, "workshop__board");
    board.appendChild(el("h3", strings.werkstatt.zutatenbord, "workshop__board-title"));
    if (raw.length === 0) {
      board.appendChild(el("p", strings.werkstatt.leerDachboden, "workshop__empty"));
    } else {
      const grid = el("div", null, "workshop__board-grid");
      for (const g of raw) {
        const isSelected = !!selectedRaw && selectedRaw.species === g.species && selectedRaw.teil === g.teil;
        grid.appendChild(renderBoardItem(g, isSelected, () => {
          selectedRaw = isSelected ? null : { species: g.species, teil: g.teil };
          renderAll();
        }));
      }
      board.appendChild(grid);
    }
    craft.appendChild(board);

    const right = el("div", null, "workshop__recipes");
    right.appendChild(el("h3", strings.stationen.dachboden, "workshop__board-title"));
    if (!selectedRaw) {
      right.appendChild(el("p", strings.werkstatt.waehleKraut, "workshop__empty"));
    } else {
      const herb = herbs[selectedRaw.species];
      const dur = methods.trocknen.durationDays;

      const card = el("div", null, "workshop__recipe-card");
      const head = el("div", null, "workshop__recipe-head");
      head.appendChild(herbImg(selectedRaw.species, "workshop__slot-img"));
      head.appendChild(el(
        "span",
        `${herb?.nameDe ?? selectedRaw.species} (${strings.teile[selectedRaw.teil] ?? selectedRaw.teil})`,
        "workshop__recipe-name",
      ));
      card.appendChild(head);
      card.appendChild(el(
        "p",
        `${strings.buch.dauer}: ${dur} ${dur === 1 ? strings.werkstatt.tag : strings.werkstatt.tage}`,
        "workshop__recipe-duration",
      ));
      card.appendChild(makeBtn(strings.werkstatt.beginnen, () => {
        if (onStartDrying(selectedRaw.species, selectedRaw.teil)) close();
      }, "workshop__begin-btn"));
      right.appendChild(card);
    }
    craft.appendChild(right);

    frag.appendChild(craft);
    return frag;
  }

  // Every unique (species, teil, processed) input combo required by any
  // recipe at this station — used to filter the Zutatenbord to relevant
  // inventory only (purely derived from data/recipes.js, no hardcoding).
  function relevantInputKeys(stationRecipes) {
    const keys = new Set();
    for (const r of stationRecipes) {
      for (const req of r.inputs ?? []) {
        const species = req.species ?? r.species;
        const teil = req.teil ?? r.teil;
        const processed = req.processed ?? null;
        keys.add(`${species}:${teil}:${processed ?? ""}`);
      }
    }
    return keys;
  }

  // Collapses a recipe's `inputs` array into unique (species, teil, processed)
  // slots with a count (e.g. the Löwenzahn-Tinktur needs 2× raw leaves).
  function inputSummary(recipe) {
    const counts = new Map();
    for (const req of recipe.inputs ?? []) {
      const species = req.species ?? recipe.species;
      const teil = req.teil ?? recipe.teil;
      const processed = req.processed ?? null;
      const key = `${species}:${teil}:${processed ?? ""}`;
      const existing = counts.get(key);
      if (existing) existing.count++;
      else counts.set(key, { species, teil, processed, count: 1 });
    }
    return [...counts.values()];
  }

  function renderRecipeCard(recipe, inventory, zutaten) {
    const herb = herbs[recipe.species];
    const card = el("div", null, "workshop__recipe-card");

    const outputName = strings.verarbeitet[recipe.output] ?? recipe.output;
    card.appendChild(el(
      "div",
      `${herb?.nameDe ?? recipe.species} → ${outputName}`,
      "workshop__recipe-name",
    ));

    // Input slots — filled/empty depending on inventory.
    const slots = el("div", null, "workshop__slots");
    let inputsOk = true;
    for (const req of inputSummary(recipe)) {
      const have = countItem(inventory, req.species, req.teil, req.processed) >= req.count;
      if (!have) inputsOk = false;

      const slot = el("div", null, `workshop__slot${have ? "" : " workshop__slot--missing"}`);
      slot.appendChild(herbImg(req.species, "workshop__slot-img"));
      slots.appendChild(slot);

      const reqHerb = herbs[req.species];
      const stateLabel = req.processed
        ? (strings.verarbeitet[req.processed] ?? req.processed)
        : (strings.teile[req.teil] ?? req.teil);
      const countLabel = req.count > 1 ? ` ×${req.count}` : "";
      slots.appendChild(el(
        "span",
        `${reqHerb?.nameDe ?? req.species} (${stateLabel})${countLabel}`,
        "workshop__slot-label",
      ));
    }
    card.appendChild(slots);

    // Zutaten badges (schnaps, honig, …) — green when in stock, red when not.
    const neededZutaten = requiredZutaten(recipe);
    let zutatenOk = true;
    if (neededZutaten.length > 0) {
      const badges = el("div", null, "workshop__zutaten");
      for (const key of neededZutaten) {
        const has = countZutat(zutaten ?? {}, key) >= 1;
        if (!has) zutatenOk = false;
        badges.appendChild(el(
          "span",
          has ? zutatName(key) : `${zutatName(key)} ${strings.werkstatt.fehltImLaden}`,
          `workshop__zutat-badge ${has ? "workshop__zutat-badge--ok" : "workshop__zutat-badge--missing"}`,
        ));
      }
      card.appendChild(badges);
    }

    // Duration + Beginnen.
    const footer = el("div", null, "workshop__recipe-footer");
    const dur = recipe.durationDays;
    const durLabel = dur === 0
      ? strings.buch.sofort
      : `${dur} ${dur === 1 ? strings.werkstatt.tag : strings.werkstatt.tage}`;
    footer.appendChild(el("span", durLabel, "workshop__recipe-duration"));

    const beginBtn = makeBtn(strings.werkstatt.beginnen, () => {
      if (onStartRecipe(recipe)) close();
    }, "workshop__begin-btn");
    if (!inputsOk || !zutatenOk) beginBtn.disabled = true;
    footer.appendChild(beginBtn);
    card.appendChild(footer);

    if (!inputsOk) {
      card.appendChild(el("p", strings.werkstatt.nichtGenugZutaten, "workshop__note workshop__note--warn"));
    }

    return card;
  }

  // ── Herd / Mörser / Vorratsregal / Sonnenfenster ──────────────────────────
  function renderStation(stationType, inventory, processingState, time, zutaten) {
    const frag = document.createDocumentFragment();
    const runningSection = renderRunning(stationType, processingState, time);
    if (runningSection) frag.appendChild(runningSection);

    const craft = el("div", null, "workshop__craft");
    const stationRecipes = recipesForStation(stationType, methods);

    // Left: Zutatenbord — only the inventory this station's recipes can use.
    // Spoiled (Hard Mode "unbrauchbar") raw herbs are excluded — they can't
    // be used, same as the Dachboden shelf.
    const keys = relevantInputKeys(stationRecipes);
    const boardItems = groupInventory(inventory).filter(
      (g) => g.quality !== "unbrauchbar" && keys.has(`${g.species}:${g.teil}:${g.processed ?? ""}`),
    );

    const board = el("div", null, "workshop__board");
    board.appendChild(el("h3", strings.werkstatt.zutatenbord, "workshop__board-title"));
    if (boardItems.length === 0) {
      board.appendChild(el("p", strings.werkstatt.leerBoard, "workshop__empty"));
    } else {
      const grid = el("div", null, "workshop__board-grid");
      for (const g of boardItems) {
        const isSelected = selectedSpecies === g.species;
        grid.appendChild(renderBoardItem(g, isSelected, () => {
          selectedSpecies = isSelected ? null : g.species;
          renderAll();
        }));
      }
      board.appendChild(grid);
    }
    craft.appendChild(board);

    // Right: Rezepte — filtered to the selected species, if any.
    const right = el("div", null, "workshop__recipes");
    right.appendChild(el("h3", strings.buch.tabRezepte, "workshop__board-title"));

    const visibleRecipes = selectedSpecies
      ? stationRecipes.filter((r) => r.species === selectedSpecies)
      : stationRecipes;

    if (visibleRecipes.length === 0) {
      right.appendChild(el("p", strings.werkstatt.keineRezepte, "workshop__empty"));
    } else {
      for (const recipe of visibleRecipes) {
        right.appendChild(renderRecipeCard(recipe, inventory, zutaten));
      }
    }
    craft.appendChild(right);

    frag.appendChild(craft);
    return frag;
  }

  // ── Bett — trivial, deliberately undecorated ──────────────────────────────
  function renderBett() {
    const wrap = el("div", null, "workshop__bett");
    wrap.appendChild(makeBtn(strings.hud.schlafen, () => { close(); onSleep(); }, "workshop__begin-btn"));
    return wrap;
  }

  // ── render dispatch ────────────────────────────────────────────────────────
  function renderAll() {
    panel.innerHTML = "";
    panel.appendChild(renderHeader(_stationType));

    if (_stationType === "bett") {
      panel.appendChild(renderBett());
    } else if (_stationType === "dachboden") {
      panel.appendChild(renderDachboden(_inventory, _processingState, _time));
    } else if (_stationType === "buchstand") {
      // Never actually routed here (main.js opens the book directly for
      // buchstand) — guarded so an unexpected call still shows something sane.
      panel.appendChild(el("p", strings.werkstatt.keineRezepte, "workshop__empty"));
    } else {
      panel.appendChild(renderStation(_stationType, _inventory, _processingState, _time, _zutaten));
    }
  }

  // ── DOM helpers ────────────────────────────────────────────────────────────
  function el(tag, text, className) {
    const e = document.createElement(tag);
    if (text != null) e.textContent = text;
    if (className) e.className = className;
    return e;
  }

  function makeBtn(text, onClick, className) {
    const btn = document.createElement("button");
    btn.type = "button";
    if (text != null) btn.textContent = text;
    if (className) btn.className = className;
    btn.addEventListener("click", onClick);
    return btn;
  }

  return {
    open(stationType, inventory, processingState, time, zutaten) {
      _stationType = stationType;
      _inventory = inventory;
      _processingState = processingState;
      _time = time;
      _zutaten = zutaten;
      selectedSpecies = null;
      selectedRaw = null;
      overlay.hidden = false;
      renderAll();
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
