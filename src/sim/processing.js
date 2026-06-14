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

// Starts a recipe-based preparation. Consumes required inputs from inventory
// and the required zutat (if any) from the zutaten store.
// `recipe` is an entry from src/data/recipes.js.
// Returns false if inputs or zutat are not available.
export function startRecipe(processingState, inventory, recipe, time, zutaten) {
  const { method, species, teil, inputs = [] } = recipe;

  // Check zutat availability before touching inventory
  if (recipe.requiresZutat && countZutat(zutaten ?? {}, recipe.requiresZutat) < 1) {
    return false;
  }

  // Consume each required input from inventory
  for (const req of inputs) {
    if (!removeItem(inventory, req.species ?? species, req.teil ?? teil, req.processed ?? null)) {
      return false;
    }
  }

  // Consume zutat
  if (recipe.requiresZutat && zutaten) {
    removeZutat(zutaten, recipe.requiresZutat);
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
// hardMode is reserved for a future WP (spoilage) — currently unused.
export function computeQuality(prep, method, { hardMode = false } = {}) {
  if (!method || !method.care || method.care.length === 0) return "gut";

  // Expected care windows: for each care rule, floor(durationDays / every), min 1
  const expected = method.care.reduce(
    (sum, rule) => sum + Math.max(1, Math.floor(method.durationDays / rule.every)),
    0,
  );

  const actual = (prep.careLog ?? []).length;
  const coverage = expected > 0 ? actual / expected : 1;

  if (coverage >= 0.66) return "sorgfaeltig";
  if (coverage >= 0.33) return "gut";
  // TODO hardMode: return "unbrauchbar" for very poor coverage
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
export function tickAndComplete(processingState, inventory, time) {
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
    const quality = computeQuality(prep, method);
    addProcessedItem(inventory, prep.species, prep.teil, prep.output, quality);
  }

  return done;
}

// Elapsed days and remaining days for UI display.
export function prepProgress(prep, time) {
  const elapsed = absoluteDay(time) - prep.startAbsoluteDay;
  const remaining = Math.max(0, prep.durationDays - elapsed);
  return { elapsed, remaining };
}
