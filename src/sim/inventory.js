// Player inventory: a flat list of items.
// Raw herbs:     { species, teil, labeledAs? }
// Processed:     { species, teil, processed, labeledAs? }
// labeledAs is set when player mislabels a plant during identification.
export function createInventory() {
  return [];
}

export function addItem(inventory, species, teil, labeledAs = null) {
  const item = { species, teil };
  if (labeledAs && labeledAs !== species) item.labeledAs = labeledAs;
  inventory.push(item);
}

export function addProcessedItem(inventory, species, teil, processed, quality = "gut") {
  inventory.push({ species, teil, processed, quality });
}

// Removes one matching item from inventory. Returns true if found.
export function removeItem(inventory, species, teil, processed = null) {
  const idx = inventory.findIndex(
    (it) => it.species === species && it.teil === teil
      && (it.processed ?? null) === processed,
  );
  if (idx === -1) return false;
  inventory.splice(idx, 1);
  return true;
}

export function countItem(inventory, species, teil, processed = null) {
  return inventory.filter(
    (it) => it.species === species && it.teil === teil
      && (it.processed ?? null) === processed,
  ).length;
}

// Groups items by species+teil+processed+quality+labeledAs for display.
// Processed items with different quality levels stack separately.
export function groupInventory(inventory) {
  const counts = new Map();
  for (const item of inventory) {
    const qualityKey = item.processed ? (item.quality ?? "gut") : "";
    const key = `${item.species}:${item.teil}:${item.processed ?? ""}:${qualityKey}:${item.labeledAs ?? ""}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, {
        species: item.species,
        teil: item.teil,
        processed: item.processed ?? null,
        quality: item.processed ? (item.quality ?? "gut") : null,
        labeledAs: item.labeledAs ?? null,
        count: 1,
      });
    }
  }
  return [...counts.values()];
}
