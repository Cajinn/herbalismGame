import { absoluteDay } from "./time.js";
import { addItem } from "./inventory.js";
import { recordSighting } from "./progress.js";
import { herbs } from "../data/herbs/index.js";

export function createGarden() {
  return { beds: {} };
}

// Plant a seed in an empty bed. Decrements seeds[species]. Returns bool.
export function plantSeed(garden, bedId, species, seeds, time) {
  if ((seeds[species] ?? 0) < 1) return false;
  if (garden.beds[bedId]) return false;
  seeds[species] -= 1;
  garden.beds[bedId] = {
    species,
    plantedDay: absoluteDay(time),
    lastWateredDay: absoluteDay(time),
    stage: "keimling",
  };
  return true;
}

export function waterBed(garden, bedId, time) {
  const bed = garden.beds[bedId];
  if (!bed || bed.stage === "reif") return false;
  bed.lastWateredDay = absoluteDay(time);
  return true;
}

// Called once per day from onDayComplete. Advances stage for watered beds.
// Days required: 4 total to reach wachsend, 10 total to reach reif (from planting).
// Un-watered days simply pause growth — no wilting.
export function tickGarden(garden, time) {
  const today = absoluteDay(time);
  for (const bed of Object.values(garden.beds)) {
    if (bed.stage === "reif") continue;
    if (today - bed.lastWateredDay > 2) continue; // needs water
    const daysGrown = today - bed.plantedDay;
    if (bed.stage === "keimling" && daysGrown >= 4) bed.stage = "wachsend";
    else if (bed.stage === "wachsend" && daysGrown >= 10) bed.stage = "reif";
  }
}

function primaryTeil(species) {
  const teile = Object.keys(herbs[species]?.saison?.teil ?? {});
  return teile[0] ?? "blueten";
}

// Harvest a ripe bed. Adds item to inventory, records sighting, clears bed.
// Returns the species id on success, null if not ripe or empty.
export function harvestBed(garden, bedId, inventory, progress) {
  const bed = garden.beds[bedId];
  if (!bed || bed.stage !== "reif") return null;
  const { species } = bed;
  addItem(inventory, species, primaryTeil(species));
  recordSighting(progress, species);
  delete garden.beds[bedId];
  return species;
}
