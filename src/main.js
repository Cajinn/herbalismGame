import { SCALE, VIEWPORT_TILES_X, VIEWPORT_TILES_Y } from "./engine/config.js";
import { loadTileset, drawTile } from "./engine/tileset.js";
import { loadObject, renderObjects, getObject } from "./engine/objects.js";
import { startLoop } from "./engine/loop.js";
import { initInput, consumeJustPressed } from "./engine/input.js";
import { createCamera, updateCamera } from "./engine/camera.js";
import { renderMap, mapPixelSize } from "./engine/tilemap.js";
import { renderBuildings } from "./engine/buildings.js";
import { drawPlayer, drawCharacter, loadPlCharacter } from "./engine/sprites.js";
import { herbTile } from "./data/herbTiles.js";
import { loadGame, saveGame, clearGame } from "./engine/save.js";
import { loadMap } from "./world/mapLoader.js";
import { createPlayer, updatePlayer } from "./world/player.js";
import { getActiveSpawns, harvestYield } from "./world/plantSpawns.js";
import { getActiveNpcs } from "./world/npc.js";
import { createTime, advanceTime, advanceDay, addMinutes, absoluteDay } from "./sim/time.js";
import { shopCatalog } from "./data/shop.js";
import { createInventory, addItem, removeItem, groupInventory, tickSpoilage, discardItems } from "./sim/inventory.js";
import { createProgress, recordSighting, recordMerkmalReveal, recordCraft, recordDelivery } from "./sim/progress.js";
import { createProcessingState, startDrying, startRecipe, tickAndComplete, recordCare } from "./sim/processing.js";
import { createReputation, addVertrauen, getVillageVertrauen } from "./sim/reputation.js";
import { createZutaten, addZutat } from "./sim/zutaten.js";
import { createGarden, plantSeed, waterBed, harvestBed, tickGarden } from "./sim/garden.js";
import { createRequests, generateDailyRequests, requestForVillager, resolveRequest, evaluateDelivery } from "./sim/requests.js";
import { createHud } from "./ui/hud.js";
import { createIdentifyDialog } from "./ui/identify.js";
import { createInventoryPanel } from "./ui/inventory.js";
import { createWorkshopDialog } from "./ui/workshop.js";
import { createBook } from "./ui/book.js";
import { createShopDialog } from "./ui/shop.js";
import { createGardenDialog } from "./ui/garden.js";
import { createVillagerDialog } from "./ui/dialog.js";
import { createBoardDialog } from "./ui/board.js";
import { createMapPanel } from "./ui/map.js";
import { createDepositPanel } from "./ui/deposit.js";
import { createTitleScreen } from "./ui/title.js";
import { createVillagerStatus, tickVillagerStatus, makeVillagerSick } from "./sim/villagerStatus.js";
import { methods } from "./data/methods.js";
import { strings } from "./data/strings.de.js";
import { herbs } from "./data/herbs/index.js";
import { villagers } from "./data/villagers.js";
import { ailments } from "./data/ailments.js";

const EXAMINE_MINUTES = 5;
const DELIVERY_COINS  = 10;
const DELIVERY_VERTRAUEN = 5;

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Preload Sprout Lands tile atlases — async, render loop falls back to flat
// color until ready. Each sheet has a different column count (imageWidth/16).
loadTileset("grass",     "assets/tiles/sprout/grass.png",        11);
loadTileset("dirt",      "assets/tiles/sprout/tilled_dirt.png",  11);
loadTileset("water",     "assets/tiles/sprout/water.png",         4);
loadTileset("paths",     "assets/tiles/sprout/paths.png",         4);
loadTileset("bridge",    "assets/tiles/sprout/bridge.png",        5);
loadTileset("fences",    "assets/tiles/sprout/fences.png",        4);
loadTileset("house",     "assets/tiles/sprout/wooden_house.png",  7);
loadTileset("roof",      "assets/tiles/sprout/house_roof.png",     7);
loadTileset("wall",      "assets/tiles/sprout/house_walls.png",    5);
loadTileset("door",      "assets/tiles/sprout/doors.png",          1);
loadTileset("furniture", "assets/tiles/sprout/furniture.png",     9);
loadTileset("chest",     "assets/tiles/sprout/chest.png",        15);
loadTileset("biom",      "assets/tiles/sprout/grass_biom.png",    9);
loadTileset("plants",    "assets/tiles/sprout/plants.png",        6);

// PixelLab Wang tilesets (4 cols × 4 rows = 16 tiles each).
// pl_gp: grass↔path transitions. Lower=dirt path, upper=lush grass.
// pl_gw: grass↔water transitions. Lower=alpine stream, upper=lush grass.
// pl_gf: grass↔forest transitions. Lower=mossy forest floor, upper=lush grass.
// pl_gr: grass↔rock transitions. Lower=grey alpine rock, upper=lush grass.
// pl_gt: grass↔tilled transitions. Lower=tilled earth, upper=lush grass.
loadTileset("pl_gp",     "assets/tiles/pixellab/terrain_gp.png",   4);
loadTileset("pl_gw",     "assets/tiles/pixellab/terrain_gw.png",   4);
loadTileset("pl_gf",     "assets/tiles/pixellab/terrain_gf.png",   4);
loadTileset("pl_gr",     "assets/tiles/pixellab/terrain_gr.png",   4);
loadTileset("pl_gt",     "assets/tiles/pixellab/grass_tilled.png", 4);

// PixelLab map objects (transparent-background PNGs).
loadObject("tree_oak",      "assets/objects/tree_oak.png");
loadObject("hedge",         "assets/objects/hedge.png");
loadObject("well",          "assets/objects/well.png");
loadObject("notice_board",  "assets/objects/notice_board.png");
loadObject("deposit_box",   "assets/objects/deposit_box.png");
loadObject("drying_rack",      "assets/objects/drying_rack.png");
loadObject("hut_a",            "assets/objects/hut_a.png");
loadObject("hut_b",            "assets/objects/hut_b.png");
loadObject("herbalist_house",  "assets/objects/herbalist_house.png");
loadObject("shop",             "assets/objects/shop.png");
// Environment decoration sprites (one "primary" variant per category for active maps)
loadObject("rocks",       "assets/objects/env/rocks/rocks_0.png");
loadObject("wildflowers", "assets/objects/env/wildflowers/wildflowers_0.png");
loadObject("fern",        "assets/objects/env/ferns/fern_0.png");
loadObject("tree_stump",  "assets/objects/env/stumps/stump_0.png");
loadObject("fallen_log",  "assets/objects/env/logs/log_0.png");
loadObject("shrub",       "assets/objects/env/shrub/shrub_0.png");
loadObject("bridge",      "assets/objects/bridge.png");
loadObject("garden_plot_3x3", "assets/objects/garden_plot_3x3.png");
loadObject("garden_plot_2x3", "assets/objects/garden_plot_2x3.png");
loadObject("forest_pine", "assets/objects/env/forest_pine.png");
loadObject("forest_oak",  "assets/objects/env/forest_oak.png");
loadObject("mushrooms",   "assets/objects/interior/mushrooms/mushrooms_0.png");
loadObject("stream_reeds","assets/objects/interior/stream_reeds/stream_reeds_0.png");
// Interior furniture (kraeuterhaeuschen + laden)
loadObject("herb_shelf",    "assets/objects/interior/herb_shelf/herb_shelf_0.png");
loadObject("fireplace",     "assets/objects/interior/fireplace/fireplace_0.png");
loadObject("mortar_pestle", "assets/objects/interior/mortar_pestle/mortar_pestle_0.png");
loadObject("bookshelf",     "assets/objects/interior/bookshelf/bookshelf_0.png");
loadObject("herb_window",   "assets/objects/interior/herb_window/herb_window_0.png");
loadObject("bed",           "assets/objects/interior/bed/bed_0.png");
loadObject("shop_counter",  "assets/objects/interior/shop_counter/shop_counter_0.png");
loadObject("shop_barrels",  "assets/objects/interior/shop_barrels/shop_barrels_0.png");
loadObject("work_table",    "assets/objects/interior/work_table/work_table_0.png");
loadObject("shop_crates",   "assets/objects/interior/shop_crates/shop_crates_0.png");
// Dorfladen (laden) grocery sprites — warm wood, colorful produce.
loadObject("produce_shelf",   "assets/objects/interior/laden/produce_shelf.png");
loadObject("produce_baskets", "assets/objects/interior/laden/produce_baskets.png");
loadObject("grain_sacks",     "assets/objects/interior/laden/grain_sacks.png");
loadObject("bread_shelf",     "assets/objects/interior/laden/bread_shelf.png");
// Testhuette interior sprites (dev test room) — warm-wood apothecary, V2.
// Base furniture render EMPTY; the stateful content layer (map.content) adds
// jars/bundles/glow on top from game state. See src/data/maps/kraeuterhaeuschen.js.
loadObject("th_floor",       "assets/objects/interior/testhuette/floor_planks.png");
loadObject("th_rug",         "assets/objects/interior/testhuette/rug.png");
loadObject("th_door",        "assets/objects/interior/testhuette/door.png");
loadObject("th_shelf",       "assets/objects/interior/testhuette/storage_shelf.png");
loadObject("th_oven",        "assets/objects/interior/testhuette/oven_wood.png");
loadObject("th_rack",        "assets/objects/interior/testhuette/drying_rack_v2.png");
loadObject("th_work_desk",   "assets/objects/interior/testhuette/work_desk.png");
loadObject("th_mortar_desk", "assets/objects/interior/testhuette/mortar_desk_v2.png");
loadObject("th_bookstand",   "assets/objects/interior/testhuette/book_stand.png");
// Content-layer sprites (small, repeated per unit of state)
loadObject("th_c_jar",       "assets/objects/interior/testhuette/c_jar.png");
loadObject("th_c_bundle",    "assets/objects/interior/testhuette/c_bundle.png");
loadObject("th_c_hang",      "assets/objects/interior/testhuette/c_hang_bundle.png");
loadObject("th_c_herbs",     "assets/objects/interior/testhuette/c_herbs.png");
loadObject("th_plant",       "assets/objects/interior/testhuette/potted_herb.png");
loadObject("th_stool",       "assets/objects/interior/testhuette/stool.png");
loadObject("th_window",      "assets/objects/interior/testhuette/wall_window.png");
loadObject("th_cabinet",     "assets/objects/interior/testhuette/jar_cabinet.png");
loadObject("th_hearth",      "assets/objects/interior/testhuette/hearth.png");
loadObject("th_trough",      "assets/objects/interior/testhuette/herb_trough.png");
loadObject("th_flower",      "assets/objects/interior/testhuette/potted_flower.png");

// PixelLab per-character sprites (4 cardinal directions each).
// Keys match villager id fields in villagers.js; "herbalist" reserved for player.
const _charDirs = (key) => ({
  south: `assets/chars/${key}_south.png`,
  north: `assets/chars/${key}_north.png`,
  east:  `assets/chars/${key}_east.png`,
  west:  `assets/chars/${key}_west.png`,
});
loadPlCharacter("herbalist", _charDirs("herbalist"));
loadPlCharacter("vreni",     _charDirs("vreni"));
loadPlCharacter("klara",     _charDirs("klara"));
loadPlCharacter("anna",      _charDirs("anna"));
loadPlCharacter("sophie",    _charDirs("sophie"));
loadPlCharacter("ueli",      _charDirs("ueli"));
loadPlCharacter("res",       _charDirs("res"));
loadPlCharacter("margrit",   _charDirs("margrit"));

// PixelLab per-species herb sprites. Loaded for every species; missing PNGs
// (404) leave naturalWidth===0 and fall back to the SL biom tile silently.
const _herbSprites = new Map();
[
  // batch 1 — downloaded
  "kamille", "ringelblume", "lavendel", "pfefferminze", "holunder",
  "schafgarbe", "arnika", "wacholder", "gundelrebe", "frauenmantel",
  "baerlauch", "baldrian", "johanniskraut", "loewenzahn", "spitzwegerich",
  // batch 2 — meadow/garden flowers
  "maigloeckchen", "herbstzeitlose", "gaensebluemchen", "brennnessel", "veilchen",
  "huflattich", "rotklee", "malve", "wegwarte", "koenigskerze",
  "giersch", "hundskamille", "jakobskreuzkraut", "schluesselblume", "roterfingerhut", "salbei",
  // batch 3 — trees, shrubs, waterside
  "hagebutte", "weissdorn", "schlehe", "birke", "fichte", "attich", "pestwurz",
  "beinwell", "weide", "linde", "zitrone", "gefleckterSchierling", "hundspetersilie",
  "madesüss", "zwiebel", "quendel",
  // batch 4 — alpine + culinary
  "thymian", "zitronenmelisse", "gelberEnzian", "alpenfrauenmantel",
  "lungenkraut", "blauerEnzian", "akelei", "odermennig", "waldmeister",
  "iris", "weissklee", "ysop",
  "baldrian_alt", "holunder_alt", "loewenzahn_alt", "brennnessel_alt",
].forEach((key) => {
  const img = new Image();
  img.src = `assets/objects/herbs/${key}.png`;
  _herbSprites.set(key, img);
});

const uiRoot = document.getElementById("ui-root");

// New games start inside the cottage (kraeuterhaeuschen).
// Saved games restore the stored map in the block below.
let map = loadMap("kraeuterhaeuschen");

const player = createPlayer(map);
let time = createTime();
let inventory = createInventory();
let progress = createProgress();
let processingState = createProcessingState();
let harvested = new Set();
// M4 state
let coins = 50;
let zutaten = createZutaten();
let seeds = {};
let reputation = createReputation();
let requests = createRequests();
let garden = createGarden();
// M5 state
let villagerStatus = createVillagerStatus();
let quests = { alpweideUnlocked: false };
let introSeen = false;
// WP4a: Hard Mode (OFF by default — normal mode is unaffected)
let hardMode = false;

// WP4b: Hard Mode shop stock. Keys are shopCatalog item ids; values are current count.
// Only used when hardMode is true; normal mode bypasses all stock checks entirely.
const RESTOCK_INTERVAL = 3;   // every N in-game days, stock trickles back
const RESTOCK_AMOUNT   = 2;   // units added per restock tick (capped at item.stock max)

/** Build the default shopStock map from catalog definitions. */
function defaultShopStock() {
  const s = {};
  for (const item of shopCatalog) {
    if (item.stock != null) s[item.id] = item.stock;
  }
  return s;
}

let shopStock = defaultShopStock();

const saved = loadGame();
if (saved) {
  if (saved.map) map = loadMap(saved.map);
  player.x = saved.player.x;
  player.y = saved.player.y;
  player.direction = saved.player.direction;
  time = saved.time;
  if (saved.inventory) inventory = saved.inventory;
  if (saved.progress) {
    progress = saved.progress;
    for (const e of Object.values(progress)) {
      if ((e.correct ?? 0) > 0 && !e.gesehen) e.gesehen = true;
    }
  }
  if (saved.processingState) processingState = saved.processingState;
  if (saved.harvested) harvested = new Set(saved.harvested);
  coins = saved.coins ?? 50;
  if (saved.zutaten)        zutaten        = saved.zutaten;
  if (saved.seeds)          seeds          = saved.seeds;
  if (saved.reputation)     reputation     = saved.reputation;
  if (saved.requests)       requests       = saved.requests;
  if (saved.garden)         garden         = saved.garden;
  villagerStatus = saved.villagerStatus ?? createVillagerStatus();
  quests         = saved.quests         ?? { alpweideUnlocked: false };
  introSeen      = saved.introSeen      ?? false;
  hardMode       = saved.hardMode       ?? false;
  // WP4b: restore stock; backfill any newly-added catalog items so older saves work.
  if (saved.shopStock) {
    shopStock = saved.shopStock;
    const defaults = defaultShopStock();
    for (const [id, max] of Object.entries(defaults)) {
      if (shopStock[id] == null) shopStock[id] = max;
    }
  }
}

canvas.width = VIEWPORT_TILES_X * map.tileSize * SCALE;
canvas.height = VIEWPORT_TILES_Y * map.tileSize * SCALE;

initInput();

// Effective render scale. Outdoor maps render at SCALE (whole map fits / scrolls
// as before). Interiors set `zoom` (>1) to render bigger and more intimate; the
// camera then shows fewer tiles and follows the player. Canvas size is constant.
let viewScale = SCALE * (map.zoom ?? 1);

let { width: mapWidth, height: mapHeight } = mapPixelSize(map);
const camera = createCamera(canvas.width / viewScale, canvas.height / viewScale);
updateCamera(camera, player, mapWidth, mapHeight);

let activeSpawns = [];

function persist() {
  saveGame({
    map: map.id,
    player: { x: player.x, y: player.y, direction: player.direction },
    time,
    inventory,
    progress,
    processingState,
    harvested: [...harvested],
    coins,
    zutaten,
    seeds,
    reputation,
    requests,
    garden,
    villagerStatus,
    quests,
    introSeen,
    hardMode,
    shopStock,
  });
}

// Called whenever a day boundary is crossed (manual sleep or midnight collapse).
function onDayComplete() {
  const completed = tickAndComplete(processingState, inventory, time, { hardMode });
  for (const prep of completed) {
    recordCraft(progress, prep.species);
    const name = herbs[prep.species]?.nameDe ?? prep.species;
    hud.showMessage(`${name} ${strings.meldungenVerarbeitung.fertig}`);
  }

  // Hard Mode: raw herbs spoil after 3 days; processed items are exempt.
  if (hardMode) {
    const spoiled = tickSpoilage(inventory, absoluteDay(time));
    if (spoiled > 0) hud.showMessage(strings.meldungen.verdorben);
  }

  // WP4b: Hard Mode shop restock — every RESTOCK_INTERVAL days, trickle stock back.
  if (hardMode && absoluteDay(time) % RESTOCK_INTERVAL === 0) {
    for (const item of shopCatalog) {
      if (item.stock != null) {
        shopStock[item.id] = Math.min(
          (shopStock[item.id] ?? 0) + RESTOCK_AMOUNT,
          item.stock,
        );
      }
    }
  }

  tickGarden(garden, time);

  // Tick villager sickness countdown
  const justRecovered = tickVillagerStatus(villagerStatus, time);
  for (const vid of justRecovered) {
    const v = villagers[vid];
    if (v) hud.showMessage(strings.meldungen.genesen(v.nameDe));
  }

  const prevOpen = requests.active.filter((r) => r.status === "open").length;
  generateDailyRequests(requests, villagers, ailments, time);
  const newOpen = requests.active.filter((r) => r.status === "open").length;
  if (newOpen > prevOpen) hud.showMessage(strings.meldungen.neueAnfragen);
}

function doTransition(exit) {
  map = loadMap(exit.target);
  player.x = exit.spawn.x * map.tileSize;
  player.y = exit.spawn.y * map.tileSize;
  ({ width: mapWidth, height: mapHeight } = mapPixelSize(map));
  // Re-zoom for the new map (interiors zoom in, outdoors reset to SCALE).
  viewScale = SCALE * (map.zoom ?? 1);
  camera.width = canvas.width / viewScale;
  camera.height = canvas.height / viewScale;
}

function checkExit() {
  const tx = Math.floor((player.x + player.width / 2) / map.tileSize);
  const ty = Math.floor((player.y + player.height / 2) / map.tileSize);
  const exit = map.exits?.find((e) => e.x === tx && e.y === ty);
  if (!exit) return;
  if (exit.keyEnter) return; // handled by updateInteractables

  if (exit.target === "alpweide" && !quests.alpweideUnlocked) {
    hud.showMessage(strings.quest.alpweideGesperrt);
    return;
  }

  doTransition(exit);
}

// Checks for nearby plants, stations, garden beds, and NPCs, shows the
// correct interaction prompt, and opens the appropriate dialog on E.
function updateInteractables() {
  const tx = Math.floor((player.x + player.width / 2) / map.tileSize);
  const ty = Math.floor((player.y + player.height / 2) / map.tileSize);

  activeSpawns = getActiveSpawns(map.id, time, harvested);
  const nearbySpawn = activeSpawns.find(
    (spawn) => Math.abs(spawn.x - tx) <= 1 && Math.abs(spawn.y - ty) <= 1,
  );

  const nearbyStation = (map.stations ?? []).find(
    (s) => Math.abs(s.x - tx) <= 1 && Math.abs(s.y - ty) <= 1,
  );

  const nearbyBed = (map.beds ?? []).find(
    (b) => Math.abs(b.x - tx) <= 1 && Math.abs(b.y - ty) <= 1,
  );

  const nearbyNpc = getActiveNpcs(map.id, time, villagerStatus).find(
    (n) => Math.abs(n.x - tx) <= 1 && Math.abs(n.y - ty) <= 1,
  );

  const nearbyKeyExit = map.exits?.find(
    (e) => e.keyEnter && e.x === tx && e.y === ty,
  );

  if (nearbyKeyExit) {
    hud.setPrompt(strings.interaktion.gebaeude);
    if (consumeJustPressed("interact")) {
      if (nearbyKeyExit.target === "alpweide" && !quests.alpweideUnlocked) {
        hud.showMessage(strings.quest.alpweideGesperrt);
      } else {
        doTransition(nearbyKeyExit);
      }
    }
  } else if (nearbySpawn) {
    hud.setPrompt(strings.interaktion.hinweis);
    if (consumeJustPressed("interact")) {
      recordSighting(progress, nearbySpawn.species);
      identifyDialog.open(nearbySpawn);
    }
  } else if (nearbyStation) {
    hud.setPrompt(strings.interaktionStation[nearbyStation.type] ?? `[E] ${nearbyStation.type}`);
    if (consumeJustPressed("interact")) {
      if (nearbyStation.type === "buchstand") {
        book.open(progress, time);
      } else if (nearbyStation.type === "dorfladen") {
        shopDialog.open(coins, { hardMode, stock: shopStock });
      } else if (nearbyStation.type === "anschlagbrett") {
        boardDialog.open(requests);
      } else if (nearbyStation.type === "abgabebox") {
        depositPanel.open(requests, inventory);
      } else {
        workshopDialog.open(nearbyStation.type, inventory, processingState, time, zutaten);
      }
    }
  } else if (nearbyBed) {
    hud.setPrompt(strings.interaktionStation.beet);
    if (consumeJustPressed("interact")) {
      gardenDialog.open(nearbyBed, garden, seeds);
    }
  } else if (nearbyNpc) {
    hud.setPrompt(`${strings.interaktion.npc} (${nearbyNpc.nameDe})`);
    if (consumeJustPressed("interact")) {
      villagerDialog.open(nearbyNpc, requests, inventory);
    }
  } else {
    hud.setPrompt("");
  }
}

function handleExamine(speciesId, key) {
  recordMerkmalReveal(progress, speciesId, key);
  const collapsed = addMinutes(time, EXAMINE_MINUTES);
  hud.update(time);
  if (collapsed) {
    onDayComplete();
    persist();
    hud.showMessage(strings.meldungen.eingeschlafen);
  }
  return collapsed;
}

function handleHarvest(spawn, teil) {
  if (spawn.herb.geschuetzt && !spawn.labeledAs) {
    hud.showMessage(strings.quest.geschuetztEingegriffen);
    addVertrauen(reputation, "margrit", -3);
    persist();
    hud.showMessage(strings.quest.geschuetztKonfisziert);
    return;
  }
  const n = harvestYield(spawn.species, teil);
  const createdDay = absoluteDay(time);
  for (let i = 0; i < n; i++) {
    addItem(inventory, spawn.species, teil, spawn.labeledAs ?? null, createdDay);
  }
  harvested.add(spawn.id);
  persist();
  const displayName = spawn.labeledAs ? (herbs[spawn.labeledAs]?.nameDe ?? spawn.labeledAs) : spawn.herb.nameDe;
  hud.showMessage(`${displayName} (${strings.teile[teil]}) ×${n} ${strings.meldungen.gesammelt}`);
}

function doSleep() {
  onDayComplete();
  advanceDay(time);
  persist();
  hud.update(time);
}

let inventoryPanel;

const hud = createHud(uiRoot, {
  onSleep: doSleep,
  onSave: () => {
    persist();
    hud.showMessage(strings.meldungen.gespeichert);
  },
  onToggleInventory: () => inventoryPanel.toggle(inventory, {
    onDiscard(group) {
      discardItems(inventory, group);
      persist();
      inventoryPanel.refresh(inventory);
    },
  }),
  onOpenBook: () => book.open(progress, time),
  onOpenMap: () => mapPanel.toggle(map.id),
  onNewGame: () => {
    if (!window.confirm(strings.hud.neuesSpielFrage)) return;
    clearGame();
    window.location.reload();
  },
});
hud.update(time);
hud.setStats({ coins });
if (saved) hud.showMessage(strings.meldungen.geladen);

// Hard Mode badge — small indicator shown while hardMode is on.
const hardModeBadge = document.createElement("div");
hardModeBadge.className = "hud__hard-mode-badge";
hardModeBadge.textContent = strings.inventar.hardModeBadge ?? "⚠ Schwerer Modus aktiv";
hardModeBadge.hidden = !hardMode;
uiRoot.appendChild(hardModeBadge);

const identifyDialog = createIdentifyDialog(uiRoot, {
  progress,
  onExamine: handleExamine,
  onHarvest: handleHarvest,
});

const workshopDialog = createWorkshopDialog(uiRoot, {
  onStartDrying: (species, teil) => startDrying(processingState, inventory, species, teil, time),
  onStartRecipe: (recipe) => startRecipe(processingState, inventory, recipe, time, zutaten),
  onSleep: doSleep,
});

const book = createBook(uiRoot);

inventoryPanel = createInventoryPanel(uiRoot);

const shopDialog = createShopDialog(uiRoot, {
  onBuy(item, preis) {
    if (coins < preis) return false;
    // WP4b: Hard Mode stock check — sold-out items cannot be purchased.
    if (hardMode && item.stock != null) {
      if ((shopStock[item.id] ?? 0) <= 0) return false;
    }
    coins -= preis;
    if (item.kind === "zutat") {
      addZutat(zutaten, item.ref);
    } else if (item.kind === "seed") {
      seeds[item.ref] = (seeds[item.ref] ?? 0) + 1;
    } else if (item.kind === "produce") {
      addItem(inventory, item.ref, item.teil ?? item.ref);
    }
    // WP4b: Decrement stock in Hard Mode.
    if (hardMode && item.stock != null) {
      shopStock[item.id] = Math.max(0, (shopStock[item.id] ?? 0) - 1);
    }
    hud.setStats({ coins });
    persist();
    hud.showMessage(`${item.nameDe} ${strings.meldungen.gekauft}`);
    return true;
  },
});

const gardenDialog = createGardenDialog(uiRoot, {
  onPlant(bedId, species) {
    const ok = plantSeed(garden, bedId, species, seeds, time);
    if (ok) persist();
    return ok;
  },
  onWater(bedId) {
    waterBed(garden, bedId, time);
    persist();
  },
  onHarvest(bedId) {
    const species = harvestBed(garden, bedId, inventory, progress);
    if (species) {
      const name = herbs[species]?.nameDe ?? species;
      hud.showMessage(`${name} ${strings.meldungen.geerntet}`);
      persist();
      return true;
    }
    return false;
  },
});

const ALPWEIDE_VERTRAUEN_THRESHOLD = 20;

const villagerDialog = createVillagerDialog(uiRoot, {
  getQuestState() {
    return {
      alpweideReady: getVillageVertrauen(reputation) >= ALPWEIDE_VERTRAUEN_THRESHOLD,
      alpweideUnlocked: quests.alpweideUnlocked,
    };
  },
  onMargritQuest(questId) {
    if (questId === "alpweide") {
      quests.alpweideUnlocked = true;
      hud.showMessage(strings.quest.alpweideFreigabe);
      persist();
    }
  },
  onGive(requestId, item) {
    const request = requests.active.find((r) => r.id === requestId);
    if (!request) return "mismatch";
    const ailment = ailments[request.ailmentId];
    const result = evaluateDelivery(request, ailment, item);
    if (result === "match") {
      removeItem(inventory, item.species, item.teil, item.processed);
      addVertrauen(reputation, request.villagerId, DELIVERY_VERTRAUEN);
      coins += DELIVERY_COINS;
      recordDelivery(progress, item.species);
      resolveRequest(requests, requestId);
      hud.setStats({ coins });
      hud.showMessage(strings.meldungen.geliefert);
      persist();
    } else if (result === "toxic") {
      removeItem(inventory, item.species, item.teil, item.processed);
      makeVillagerSick(villagerStatus, request.villagerId, 3, item.species);
      addVertrauen(reputation, request.villagerId, -DELIVERY_VERTRAUEN * 2);
      resolveRequest(requests, requestId);
      persist();
    }
    return result;
  },
});

const boardDialog = createBoardDialog(uiRoot);

const mapPanel = createMapPanel(uiRoot);

const depositPanel = createDepositPanel(uiRoot, {
  onDeposit(requestId, item) {
    const request = requests.active.find((r) => r.id === requestId);
    if (!request) return "mismatch";
    const ailment = ailments[request.ailmentId];
    const result = evaluateDelivery(request, ailment, item);
    if (result === "match") {
      removeItem(inventory, item.species, item.teil, item.processed);
      addVertrauen(reputation, request.villagerId, DELIVERY_VERTRAUEN);
      coins += DELIVERY_COINS;
      recordDelivery(progress, item.species);
      resolveRequest(requests, requestId);
      hud.setStats({ coins });
      hud.showMessage(strings.meldungen.geliefert);
      persist();
    } else if (result === "toxic") {
      removeItem(inventory, item.species, item.teil, item.processed);
      makeVillagerSick(villagerStatus, request.villagerId, 3, item.species);
      addVertrauen(reputation, request.villagerId, -DELIVERY_VERTRAUEN * 2);
      resolveRequest(requests, requestId);
      persist();
    }
    return result;
  },
});

const titleScreen = createTitleScreen(uiRoot);
const startedNewGame = !introSeen;   // Hard Mode is chosen only for a fresh game
titleScreen.show((chosen) => {
  if (startedNewGame) hardMode = chosen;   // saved games keep their stored mode
  hardModeBadge.hidden = !hardMode;
  introSeen = true;
  persist();
}, { newGame: startedNewGame, hardMode });

function update(dt) {
  if (titleScreen.isVisible()) return;

  const modalOpen =
    identifyDialog.isOpen() || workshopDialog.isOpen() || book.isOpen() ||
    shopDialog.isOpen() || gardenDialog.isOpen() ||
    villagerDialog.isOpen() || boardDialog.isOpen() || depositPanel.isOpen() ||
    mapPanel.isOpen();

  // M toggles the overview map: always closes it, but only opens it when no
  // other overlay is up so panels never stack.
  if (consumeJustPressed("map")) {
    if (mapPanel.isOpen() || !modalOpen) mapPanel.toggle(map.id);
    return;
  }

  if (modalOpen) return;

  updatePlayer(player, map, dt);
  checkExit();
  updateCamera(camera, player, mapWidth, mapHeight);

  if (advanceTime(time, dt)) {
    onDayComplete();
    persist();
    hud.showMessage(strings.meldungen.eingeschlafen);
  }

  updateInteractables();
  hud.update(time);
}

function render() {
  // Local SCALE = the map's effective (zoomed) scale for this whole frame.
  const SCALE = viewScale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderMap(ctx, map, camera, SCALE);
  renderBuildings(ctx, map, camera, SCALE);
  renderObjects(ctx, map, camera, SCALE);

  // Stateful interior content — furniture fills with what the player actually
  // has. Base furniture sprites render EMPTY; these overlays add the contents,
  // scaling with game state. Driven by map.content layers (see kraeuterhaeuschen.js):
  //   kind "fill"  → draw one sprite per unit into fixed slots (capped at slots)
  //   kind "glow"  → warm ember glow when a station has an active preparation
  if (map.content) {
    ctx.imageSmoothingEnabled = false;
    const storageGroups = groupInventory(inventory).length;        // distinct stored herbs
    const dryingCount = processingState.preparations
      .filter((p) => p.method === "trocknen").length;
    const stationActive = (st) =>
      processingState.preparations.some((p) => methods[p.method]?.station === st);

    for (const layer of map.content) {
      if (layer.kind === "fill") {
        // source: "storage" → distinct stored herbs; "drying" → herbs on the
        // rack; any other string → preparations whose method runs at that station
        // (e.g. "sonnenfenster" → herbs drying in the window).
        const count = layer.source === "storage" ? storageGroups
                    : layer.source === "drying"  ? dryingCount
                    : processingState.preparations
                        .filter((p) => methods[p.method]?.station === layer.source).length;
        const n = Math.min(count, layer.slots.length);
        const names = Array.isArray(layer.sprite) ? layer.sprite : [layer.sprite];
        const sz = (layer.size ?? 1) * map.tileSize * SCALE;
        for (let i = 0; i < n; i++) {
          const img = getObject(names[i % names.length]);
          if (!img?.complete || img.naturalWidth === 0) continue;
          const [tx, ty] = layer.slots[i];
          const sx = Math.round((tx * map.tileSize - camera.x) * SCALE);
          const sy = Math.round((ty * map.tileSize - camera.y) * SCALE);
          ctx.drawImage(img, sx, sy, sz, sz);
        }
      } else if (layer.kind === "glow") {
        if (!stationActive(layer.source)) continue;
        const [tx, ty, rTiles] = layer.at;
        const cx = (tx * map.tileSize - camera.x) * SCALE;
        const cy = (ty * map.tileSize - camera.y) * SCALE;
        const r = rTiles * map.tileSize * SCALE;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, "rgba(255,170,60,0.55)");
        grad.addColorStop(1, "rgba(255,120,0,0)");
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
      }
    }
    ctx.imageSmoothingEnabled = true;
  }

  // Garden bed overlays — visual state per bed:
  //   empty       → bare soil (garden_plot PNG only, no overlay)
  //   keimling    → tiny sprite (35%), yellow-tinted if needs water
  //   wachsend    → mid sprite (65%), faded if needs water
  //   reif        → full sprite (95%) + gold ready-dot
  //   any + dry   → small blue water-drop indicator in corner
  ctx.imageSmoothingEnabled = false;
  for (const bedDef of (map.beds ?? [])) {
    const bedState = garden.beds[bedDef.bedId];
    if (!bedState) continue;                          // empty bed — no overlay
    const sx = Math.round((bedDef.x * map.tileSize - camera.x) * SCALE);
    const sy = Math.round((bedDef.y * map.tileSize - camera.y) * SCALE);
    const full = map.tileSize * SCALE;
    const needsWater = absoluteDay(time) - (bedState.lastWateredDay ?? 0) > 2;
    const herbImg = _herbSprites.get(bedState.species);
    if (herbImg?.complete && herbImg.naturalWidth > 0) {
      const pct = bedState.stage === "keimling" ? 0.35
                : bedState.stage === "wachsend" ? 0.65
                : 0.95;
      const sz  = Math.round(full * pct);
      const pad = Math.round((full - sz) / 2);
      if (needsWater) ctx.globalAlpha = 0.55;
      ctx.drawImage(herbImg, sx + pad, sy + pad, sz, sz);
      ctx.globalAlpha = 1;
    }
    if (bedState.stage === "reif") {
      ctx.fillStyle = "rgba(255,220,0,0.9)";
      ctx.fillRect(sx + full - 5, sy + 1, 4, 4);
    }
    if (needsWater) {
      // Water-drop indicator: small blue teardrop in top-left corner
      ctx.fillStyle = "rgba(80,160,255,0.85)";
      ctx.beginPath();
      ctx.arc(sx + 4, sy + 6, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + 4, sy + 1);
      ctx.lineTo(sx + 7, sy + 6);
      ctx.lineTo(sx + 1, sy + 6);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.imageSmoothingEnabled = true;

  ctx.imageSmoothingEnabled = false;
  for (const spawn of activeSpawns) {
    const screenX = (spawn.x * map.tileSize - camera.x) * SCALE;
    const screenY = (spawn.y * map.tileSize - camera.y) * SCALE;
    const sz = map.tileSize * SCALE;
    const herbImg = _herbSprites.get(spawn.species);
    if (herbImg?.complete && herbImg.naturalWidth > 0) {
      // Crop bottom 15% to remove species-name label baked into PixelLab PNGs.
      const cropH = Math.round(herbImg.naturalHeight * 0.85);
      ctx.drawImage(herbImg, 0, 0, herbImg.naturalWidth, cropH, screenX, screenY, sz, sz);
    } else {
      const [htAtlas, htIdx] = herbTile(spawn.species);
      drawTile(ctx, htAtlas, htIdx, screenX, screenY, sz);
    }
  }
  ctx.imageSmoothingEnabled = true;

  for (const npc of getActiveNpcs(map.id, time, villagerStatus)) {
    const screenX = (npc.x * map.tileSize - camera.x) * SCALE;
    const screenY = (npc.y * map.tileSize - camera.y) * SCALE;
    drawCharacter(ctx, screenX, screenY, { direction: npc.direction ?? "down", colour: npc.colour, plCharKey: npc.id }, map.tileSize, SCALE);
  }

  drawPlayer(ctx, player, camera, map.tileSize, SCALE);

  // Ambient interior tint — opt-in per map (map.ambient). A subtle warm multiply
  // makes interiors feel intimate and lamp-lit vs the bright outdoors. Outdoor
  // maps omit the field and render unchanged.
  if (map.ambient) {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = map.ambient.alpha ?? 0.12;
    ctx.fillStyle = map.ambient.tint ?? "#6a4525";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

startLoop(update, render);

// Debug/testing hook: requestAnimationFrame is paused in backgrounded/headless
// browser tabs, which freezes the loop and makes automated testing impossible.
// With `?test` in the URL, expose a manual frame stepper so a test harness can
// drive the game (dispatch a key, then __tick(n) to advance n frames). No effect
// on normal play — the hook is never installed without the query flag.
if (location.search.includes("test")) {
  window.__tick = (frames = 1, dt = 1 / 60) => {
    for (let i = 0; i < frames; i++) {
      update(dt);
      render();
    }
  };
  // Read-only state accessor for headless tests (map id + player tile).
  window.__state = () => ({
    map: map.id,
    tx: Math.floor((player.x + player.width / 2) / map.tileSize),
    ty: Math.floor((player.y + player.height / 2) / map.tileSize),
  });
  // Place the player on a known tile (testing only; mirrors an exit spawn).
  window.__warp = (tx, ty) => {
    player.x = tx * map.tileSize;
    player.y = ty * map.tileSize;
    updateCamera(camera, player, mapWidth, mapHeight);
    render();
  };
}
