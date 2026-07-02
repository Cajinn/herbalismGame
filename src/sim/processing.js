import { absoluteDay } from "./time.js";
import { addProcessedItem, removeItem } from "./inventory.js";
import { countZutat, removeZutat } from "./zutaten.js";
import { methods } from "../data/methods.js";

// Active preparations: herbs currently drying, steeping, macerating, etc.
// Each entry: { id, method, species, teil, output, startAbsoluteDay,
//              durationDays, careLog: [{action, day}] }
export function createProcessingState() {
  return { preparations: [] };
}

// Starts drying one unit of raw herb from inventory. Returns false if the
// herb isn't in raw form in the inventory.
export function startDrying(processingState, inventory, species, teil, time) {
  if (!removeItem(inventory, species, teil, null)) return false;
  processingState.preparations.push({
    id: `prep-${Date.now()}`,
    method: "trocknen",
    species,
    teil,
    output: "getrocknet",
    startAbsoluteDay: absoluteDay(time),
    durationDays: 6,
    careLog: [],
  });
  return true;
}

// `recipe.requiresZutat` may be a single key or an array of keys
// (e.g. Goldene Milch braucht Honig UND Pfeffer).
export function requiredZutaten(recipe) {
  return [].concat(recipe.requiresZutat ?? []);
}

// Starts a recipe-based preparation. Consumes required inputs from inventory
// and the required zutaten (if any) from the zutaten store.
// `recipe` is an entry from src/data/recipes.js.
// Returns false if inputs or zutaten are not available.
export function startRecipe(processingState, inventory, recipe, time, zutaten) {
  const { method, species, teil, inputs = [] } = recipe;

  // Check zutaten availability before touching inventory
  for (const key of requiredZutaten(recipe)) {
    if (countZutat(zutaten ?? {}, key) < 1) return false;
  }

  // Consume each required input from inventory
  for (const req of inputs) {
    if (!removeItem(inventory, req.species ?? species, req.teil ?? teil, req.processed ?? null)) {
      return false;
    }
  }

  // Consume zutaten
  if (zutaten) {
    for (const key of requiredZutaten(recipe)) {
      removeZutat(zutaten, key);
    }
  }

  const prep = {
    id: `prep-${Date.now()}`,
    method,
    recipe: recipe.id,
    species,
    teil,
    output: recipe.output,
    startAbsoluteDay: absoluteDay(time),
    durationDays: recipe.durationDays,
    careLog: [],
  };
  processingState.preparations.push(prep);
  return true;
}

// Quality tiers ordered best → worst.
export const QUALITY_ORDER = ["sorgfaeltig", "gut", "maessig", "unbrauchbar"];

// Computes the quality of a finished preparation based on how well it was tended.
// method must be the methods[prep.method] object.
// hardMode: when true, total neglect (0 care logged) returns "unbrauchbar".
export function computeQuality(prep, method, { hardMode = false } = {}) {
  if (!method || !method.care || method.care.length === 0) return "gut";

  // Expected care windows: for each care rule, floor(durationDays / every), min 1
  const expected = method.care.reduce(
    (sum, rule) => sum + Math.max(1, Math.floor(method.durationDays / rule.every)),
    0,
  );

  const actual = (prep.careLog ?? []).length;
  const coverage = expected > 0 ? actual / expected : 1;

  // Hard Mode: total neglect (zero care logged at all) → unbrauchbar
  if (hardMode && method.care.length > 0 && actual === 0) {
    return "unbrauchbar";
  }

  if (coverage >= 0.66) return "sorgfaeltig";
  if (coverage >= 0.33) return "gut";
  return "maessig";
}

// Returns { due: bool, actions: string[] } — which care actions are overdue today.
export function careDueToday(prep, method, today) {
  if (!method || !method.care || method.care.length === 0) {
    return { due: false, actions: [] };
  }

  const actions = [];
  for (const rule of method.care) {
    const lastEntry = [...(prep.careLog ?? [])]
      .reverse()
      .find((e) => e.action === rule.action);
    const lastDay = lastEntry ? lastEntry.day : null;

    const sinceLastCare = lastDay !== null
      ? today - lastDay
      : today - prep.startAbsoluteDay;

    if (sinceLastCare >= rule.every) {
      actions.push(rule.action);
    }
  }

  return { due: actions.length > 0, actions };
}

// Records a care action (e.g. schütteln for Tinktur) for a preparation.
// Guards against logging the same action twice on the same day.
export function recordCare(processingState, prepId, action, time) {
  const prep = processingState.preparations.find((p) => p.id === prepId);
  if (!prep) return;
  const today = absoluteDay(time);
  const alreadyToday = prep.careLog.some(
    (e) => e.action === action && e.day === today,
  );
  if (!alreadyToday) {
    prep.careLog.push({ action, day: today });
  }
}

// Checks all active preparations and completes any whose time has elapsed.
// Completed items are added to inventory. Returns the list of completed preps
// (so main.js can show HUD messages and record craft progress).
// opts: { hardMode: bool } — passed to computeQuality for neglect penalty.
export function tickAndComplete(processingState, inventory, time, opts = {}) {
  const { hardMode = false } = opts;
  const current = absoluteDay(time);
  const done = [];

  processingState.preparations = processingState.preparations.filter((prep) => {
    if (current - prep.startAbsoluteDay >= prep.durationDays) {
      done.push(prep);
      return false;
    }
    return true;
  });

  for (const prep of done) {
    const method = methods[prep.method];
    const quality = computeQuality(prep, method, { hardMode });
    addProcessedItem(inventory, prep.species, prep.teil, prep.output, quality, current);
  }

  return done;
}

// Elapsed days and remaining days for UI display.
export function prepProgress(prep, time) {
  const elapsed = absoluteDay(time) - prep.startAbsoluteDay;
  const remaining = Math.max(0, prep.durationDays - elapsed);
  return { elapsed, remaining };
}
