// Versioned localStorage save with three slots. Bump SAVE_VERSION and add
// migration logic here if the schema changes — old saves are discarded for now.
const SAVE_PREFIX = "herbsSchmerbs:save"; // slot keys are `${PREFIX}:${slot}`
const LEGACY_KEY = "herbsSchmerbs:save";  // pre-slot single-save key
const SAVE_VERSION = 1;

export const SAVE_SLOTS = [1, 2, 3];

function slotKey(slot) {
  return `${SAVE_PREFIX}:${slot}`;
}

function readSlot(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (data.version !== SAVE_VERSION) return null;
  return data;
}

export function saveGame(state, slot = 1) {
  const payload = { version: SAVE_VERSION, ...state, savedAt: Date.now() };
  localStorage.setItem(slotKey(slot), JSON.stringify(payload));
}

export function loadGame(slot = 1) {
  return readSlot(slotKey(slot));
}

export function clearGame(slot = 1) {
  localStorage.removeItem(slotKey(slot));
}

// [{ slot, data|null }] for all slots, for the menu's slot list.
export function listSaves() {
  return SAVE_SLOTS.map((slot) => ({ slot, data: readSlot(slotKey(slot)) }));
}

// One-time migration: an older build stored a single save under the bare key.
// Move it into slot 1 so existing players keep their progress, then drop it.
export function migrateLegacySave() {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy === null) return;
  if (localStorage.getItem(slotKey(1)) === null) {
    localStorage.setItem(slotKey(1), legacy);
  }
  localStorage.removeItem(LEGACY_KEY);
}
