// Player inventory: a flat list of items.
// Raw herbs:     { species, teil, labeledAs?, createdDay?, quality? }
// Processed:     { species, teil, processed, labeledAs?, quality, createdDay? }
// labeledAs is set when player mislabels a plant during identification.
// createdDay (absoluteDay) is stamped on harvest; used for spoilage in Hard Mode.
// quality on raw items is set to "unbrauchbar" when spoiled in Hard Mode.
export function createInventory() {
  return [];
}

// createdDay is optional; pass absoluteDay(time) from main.js to enable spoilage tracking.
export function addItem(inventory, species, teil, labeledAs = null, createdDay = null) {
  const item = { species, teil };
  if (labeledAs && labeledAs !== species) item.labeledAs = labeledAs;
  if (createdDay !== null) item.createdDay = createdDay;
  inventory.push(item);
}

// createdDay is optional; pass absoluteDay(time) from tickAndComplete to stamp processed items.
export function addProcessedItem(inventory, species, teil, processed, quality = "gut", createdDay = null) {
  const item = { species, teil, processed, quality };
  if (createdDay !== null) item.createdDay = createdDay;
  inventory.push(item);
}

// Removes one matching USABLE item from inventory (skips unbrauchbar).
// Returns true if found and removed.
export function removeItem(inventory, species, teil, processed = null) {
  const idx = inventory.findIndex(
    (it) => it.species === species && it.teil === teil
      && (it.processed ?? null) === processed
      && it.quality !== "unbrauchbar",
  );
  if (idx === -1) return false;
  inventory.splice(idx, 1);
  return true;
}

// Counts USABLE items only (excludes unbrauchbar).
export function countItem(inventory, species, teil, processed = null) {
  return inventory.filter(
    (it) => it.species === species && it.teil === teil
      && (it.processed ?? null) === processed
      && it.quality !== "unbrauchbar",
  ).length;
}

// Groups items by species+teil+processed+quality+labeledAs for display.
// Processed items with different quality levels stack separately.
// Raw items with quality "unbrauchbar" form their own group (for discard UI).
export function groupInventory(inventory) {
  const counts = new Map();
  for (const item of inventory) {
    const qualityKey = item.processed
      ? (item.quality ?? "gut")
      : (item.quality === "unbrauchbar" ? "unbrauchbar" : "");
    const key = `${item.species}:${item.teil}:${item.processed ?? ""}:${qualityKey}:${item.labeledAs ?? ""}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, {
        species: item.species,
        teil: item.teil,
        processed: item.processed ?? null,
        quality: item.processed
          ? (item.quality ?? "gut")
          : (item.quality === "unbrauchbar" ? "unbrauchbar" : null),
        labeledAs: item.labeledAs ?? null,
        count: 1,
      });
    }
  }
  return [...counts.values()];
}

// Hard Mode spoilage: marks raw items older than 3 days as "unbrauchbar".
// Only called when hardMode is true. Processed items never spoil.
// Returns the number of items newly marked unbrauchbar.
export function tickSpoilage(inventory, today) {
  const SHELF_LIFE_DAYS = 3;
  let count = 0;
  for (const item of inventory) {
    if (item.processed != null) continue;                    // processed = preserved
    if (item.quality === "unbrauchbar") continue;            // already spoiled
    if (item.createdDay == null) continue;                   // no stamp = no spoilage
    if (today - item.createdDay > SHELF_LIFE_DAYS) {
      item.quality = "unbrauchbar";
      count++;
    }
  }
  return count;
}

// Removes ALL items matching a group object (by species+teil+processed+quality).
// Used by the discard UI to throw away an entire unbrauchbar group.
export function discardItems(inventory, group) {
  let i = inventory.length;
  while (i--) {
    const it = inventory[i];
    if (
      it.species === group.species &&
      it.teil === group.teil &&
      (it.processed ?? null) === group.processed &&
      (it.quality ?? null) === group.quality
    ) {
      inventory.splice(i, 1);
    }
  }
}
