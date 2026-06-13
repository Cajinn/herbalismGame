// Per-species identification & learning progress (PLAN.md §7 — mastery).
// After 3 correct independent identifications a species becomes "gelernt"
// and is auto-identified on sight. Also tracks sightings, revealed merkmale,
// and craft count for the book's progressive reveal (PLAN.md §11).
const MASTERY_THRESHOLD = 3;

function entry(progress, speciesId) {
  if (!progress[speciesId]) progress[speciesId] = { correct: 0, gelernt: false };
  return progress[speciesId];
}

export function createProgress() {
  return {};
}

// Records one identification attempt. Returns true if this attempt just
// pushed the species over the mastery threshold (so the UI can celebrate).
export function recordIdentification(progress, speciesId, correct) {
  if (!correct) return false;
  const e = entry(progress, speciesId);
  e.correct += 1;
  const justGelernt = !e.gelernt && e.correct >= MASTERY_THRESHOLD;
  if (justGelernt) e.gelernt = true;
  return justGelernt;
}

export function isGelernt(progress, speciesId) {
  return progress[speciesId]?.gelernt ?? false;
}

// Called when the Bestimmen dialog is opened for a species for the first time.
export function recordSighting(progress, speciesId) {
  const e = entry(progress, speciesId);
  if (!e.gesehen) { e.gesehen = true; return true; }
  return false;
}

export function isGesehen(progress, speciesId) {
  return progress[speciesId]?.gesehen ?? false;
}

// Persists which merkmale the player has revealed via "Untersuchen".
export function recordMerkmalReveal(progress, speciesId, key) {
  const e = entry(progress, speciesId);
  if (!e.merkmaleRevealed) e.merkmaleRevealed = [];
  if (!e.merkmaleRevealed.includes(key)) e.merkmaleRevealed.push(key);
}

export function getRevealedMerkmale(progress, speciesId) {
  return progress[speciesId]?.merkmaleRevealed ?? [];
}

// Incremented each time a finished product using this species is added to
// inventory — used to unlock the Wirkung section in the book.
export function recordCraft(progress, speciesId) {
  const e = entry(progress, speciesId);
  e.crafted = (e.crafted ?? 0) + 1;
}

export function hasCrafted(progress, speciesId) {
  return (progress[speciesId]?.crafted ?? 0) > 0;
}

// Incremented each time a product is successfully delivered to a villager.
export function recordDelivery(progress, speciesId) {
  const e = entry(progress, speciesId);
  e.delivered = (e.delivered ?? 0) + 1;
}

export function hasDelivered(progress, speciesId) {
  return (progress[speciesId]?.delivered ?? 0) > 0;
}
