// Shop-bought ingredients and their counts — a plain count-object used for
// both `zutaten` (schnaps, olivenoel, bienenwachs) and `seeds`.
export function createZutaten() {
  return {};
}

export function addZutat(z, id, n = 1) {
  z[id] = (z[id] ?? 0) + n;
}

export function removeZutat(z, id, n = 1) {
  if ((z[id] ?? 0) < n) return false;
  z[id] -= n;
  return true;
}

export function countZutat(z, id) {
  return z[id] ?? 0;
}
