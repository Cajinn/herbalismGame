import { SCALE, VIEWPORT_TILES_X, VIEWPORT_TILES_Y } from "./engine/config.js";
import { loadTileset } from "./engine/tileset.js";
import { startLoop } from "./engine/loop.js";
import { initInput, consumeJustPressed } from "./engine/input.js";
import { createCamera, updateCamera } from "./engine/camera.js";
import { renderMap, mapPixelSize } from "./engine/tilemap.js";
import { drawPlayer } from "./engine/sprites.js";
import { drawSprite } from "./engine/pixelSprite.js";
import { loadGame, saveGame, clearGame } from "./engine/save.js";
import { loadMap } from "./world/mapLoader.js";
import { createPlayer, updatePlayer } from "./world/player.js";
import { getActiveSpawns } from "./world/plantSpawns.js";
import { getActiveNpcs } from "./world/npc.js";
import { createTime, advanceTime, advanceDay, addMinutes } from "./sim/time.js";
import { createInventory, addItem, removeItem } from "./sim/inventory.js";
import { createProgress, recordSighting, recordMerkmalReveal, recordCraft, recordDelivery } from "./sim/progress.js";
import { createProcessingState, startDrying, startRecipe, tickAndComplete } from "./sim/processing.js";
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
import { createTitleScreen } from "./ui/title.js";
import { createVillagerStatus, tickVillagerStatus, makeVillagerSick } from "./sim/villagerStatus.js";
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
loadTileset("furniture", "assets/tiles/sprout/furniture.png",     9);
loadTileset("chest",     "assets/tiles/sprout/chest.png",        15);
loadTileset("biom",      "assets/tiles/sprout/grass_biom.png",    9);
loadTileset("plants",    "assets/tiles/sprout/plants.png",        6);

const uiRoot = document.getElementById("ui-root");

let map = loadMap("dorf");

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
}

canvas.width = VIEWPORT_TILES_X * map.tileSize * SCALE;
canvas.height = VIEWPORT_TILES_Y * map.tileSize * SCALE;

initInput();

let { width: mapWidth, height: mapHeight } = mapPixelSize(map);
const camera = createCamera(canvas.width / SCALE, canvas.height / SCALE);
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
  });
}

// Called whenever a day boundary is crossed (manual sleep or midnight collapse).
function onDayComplete() {
  const completed = tickAndComplete(processingState, inventory, time);
  for (const prep of completed) {
    recordCraft(progress, prep.species);
    const name = herbs[prep.species]?.nameDe ?? prep.species;
    hud.showMessage(`${name} ${strings.meldungenVerarbeitung.fertig}`);
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

function checkExit() {
  const tx = Math.floor((player.x + player.width / 2) / map.tileSize);
  const ty = Math.floor((player.y + player.height / 2) / map.tileSize);
  const exit = map.exits?.find((e) => e.x === tx && e.y === ty);
  if (!exit) return;

  if (exit.target === "alpweide" && !quests.alpweideUnlocked) {
    hud.showMessage(strings.quest.alpweideGesperrt);
    return;
  }

  map = loadMap(exit.target);
  player.x = exit.spawn.x * map.tileSize;
  player.y = exit.spawn.y * map.tileSize;
  ({ width: mapWidth, height: mapHeight } = mapPixelSize(map));
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

  if (nearbySpawn) {
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
        shopDialog.open(coins);
      } else if (nearbyStation.type === "anschlagbrett") {
        boardDialog.open(requests);
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
  addItem(inventory, spawn.species, teil, spawn.labeledAs ?? null);
  harvested.add(spawn.id);
  persist();
  const displayName = spawn.labeledAs ? (herbs[spawn.labeledAs]?.nameDe ?? spawn.labeledAs) : spawn.herb.nameDe;
  hud.showMessage(`${displayName} (${strings.teile[teil]}) ${strings.meldungen.gesammelt}`);
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
  onToggleInventory: () => inventoryPanel.toggle(inventory),
  onOpenBook: () => book.open(progress, time),
  onNewGame: () => {
    if (!window.confirm(strings.hud.neuesSpielFrage)) return;
    clearGame();
    window.location.reload();
  },
});
hud.update(time);
hud.setStats({ coins });
if (saved) hud.showMessage(strings.meldungen.geladen);

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
    coins -= preis;
    if (item.kind === "zutat") {
      addZutat(zutaten, item.ref);
    } else if (item.kind === "seed") {
      seeds[item.ref] = (seeds[item.ref] ?? 0) + 1;
    } else if (item.kind === "produce") {
      addItem(inventory, item.ref, item.teil ?? item.ref);
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

const titleScreen = createTitleScreen(uiRoot);
if (!introSeen) {
  titleScreen.show(() => {
    introSeen = true;
    persist();
  });
}

function update(dt) {
  if (titleScreen.isVisible()) return;
  if (
    identifyDialog.isOpen() || workshopDialog.isOpen() || book.isOpen() ||
    shopDialog.isOpen() || gardenDialog.isOpen() ||
    villagerDialog.isOpen() || boardDialog.isOpen()
  ) return;

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderMap(ctx, map, camera, SCALE);

  for (const spawn of activeSpawns) {
    const screenX = (spawn.x * map.tileSize - camera.x) * SCALE;
    const screenY = (spawn.y * map.tileSize - camera.y) * SCALE;
    drawSprite(ctx, spawn.sprite ?? spawn.herb.sprite, screenX, screenY, SCALE);
  }

  for (const npc of getActiveNpcs(map.id, time, villagerStatus)) {
    const screenX = (npc.x * map.tileSize - camera.x) * SCALE;
    const screenY = (npc.y * map.tileSize - camera.y) * SCALE;
    drawSprite(ctx, npc.sprite, screenX, screenY, SCALE);
  }

  drawPlayer(ctx, player, camera, map.tileSize, SCALE);
}

startLoop(update, render);
