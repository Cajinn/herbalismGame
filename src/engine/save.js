// Versioned localStorage save. Bump SAVE_VERSION and add migration logic
// here if the schema changes — old saves are simply discarded for now.
const SAVE_KEY = "herbsSchmerbs:save";
const SAVE_VERSION = 1;

export function saveGame(state) {
  const payload = { version: SAVE_VERSION, ...state };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

export function clearGame() {
  localStorage.removeItem(SAVE_KEY);
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
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
