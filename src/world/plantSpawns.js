import { herbs } from "../data/herbs/index.js";
import { getSeasonKey } from "../sim/time.js";

// Default yield per plant-part key — how many units a realistic handful gives.
// A herb may override per-part via herbs[species].ertrag[teil] (number).
const TEIL_YIELD = {
  blueten:  3,
  blaetter: 4,
  beeren:   5,
  frucht:   3,
  wurzel:   2,
  rinde:    2,
  triebe:   4,
  samen:    5,
  nadeln:   3,
  kraut:    2,
  zwiebel:  1,
};

// Returns the number of inventory units produced when harvesting `teil` from `species`.
export function harvestYield(species, teil) {
  const herb = herbs[species];
  const override = herb?.ertrag?.[teil];
  if (typeof override === "number") return override;
  return TEIL_YIELD[teil] ?? 2;
}

// Resolves the sprite to display for a herb spawn given the current time.
// If the herb defines `stages` (a map of stageName → { sprite, windows }),
// the first stage whose windows include the current season+day is used.
// Falls back to herb.sprite for single-stage herbs.
export function resolveSprite(herb, time) {
  if (!herb.stages) return herb.sprite;
  const season = getSeasonKey(time);
  const day = time.day;
  for (const stage of Object.values(herb.stages)) {
    const match = (stage.windows ?? []).some((w) => {
      const [s, range] = w.split(":");
      const [start, end] = range.split("-").map(Number);
      return s === season && day >= start && day <= end;
    });
    if (match) return stage.sprite;
  }
  return herb.sprite;
}

// Fixed-position plant spawn points per map (PLAN.md §12, §14). Each entry
// names a species from src/data/herbs/index.js; whether it is currently
// visible depends on the herb's saison.teil windows (see getAvailableTeile).
// Positions sit inside the "Lichtung"/clearing tiles of wald & waldrand, or
// scattered across the open grass of wiese, and avoid paths/bushes/borders.
// v3.1: counts roughly doubled per map; dorf gained ruderal village weeds.
export const SPAWN_POINTS = {
  wald: [
    // Clearing 1 (rows 3–7, cols 11–14 and 16–19 = F tiles)
    { id: "wald-1",  x: 12, y: 4,  species: "baerlauch" },
    { id: "wald-2",  x: 18, y: 4,  species: "maigloeckchen" },
    { id: "wald-8",  x: 12, y: 6,  species: "fichte" },
    { id: "wald-9",  x: 18, y: 6,  species: "birke" },
    { id: "wald-12", x: 13, y: 4,  species: "holunder" },
    { id: "wald-13", x: 16, y: 4,  species: "baerlauch" },
    { id: "wald-14", x: 11, y: 5,  species: "maigloeckchen" },
    { id: "wald-15", x: 19, y: 5,  species: "herbstzeitlose" },
    { id: "wald-16", x: 14, y: 3,  species: "holunder" },
    // Clearing 1 — v3.1 additions
    { id: "wald-25", x: 11, y: 3,  species: "baerlauch" },
    { id: "wald-26", x: 17, y: 3,  species: "maigloeckchen" },
    { id: "wald-27", x: 19, y: 3,  species: "birke" },
    { id: "wald-28", x: 13, y: 5,  species: "baerlauch" },
    { id: "wald-29", x: 16, y: 6,  species: "holunder" },
    { id: "wald-30", x: 14, y: 7,  species: "maigloeckchen" },
    // Clearing 2 (rows 9–13, cols 11–14 and 16–19 = F tiles)
    { id: "wald-3",  x: 13, y: 10, species: "herbstzeitlose" },
    { id: "wald-4",  x: 17, y: 10, species: "baerlauch" },
    { id: "wald-10", x: 12, y: 12, species: "fichte" },
    { id: "wald-11", x: 18, y: 12, species: "birke" },
    { id: "wald-17", x: 16, y: 9,  species: "baerlauch" },
    { id: "wald-18", x: 11, y: 11, species: "fichte" },
    { id: "wald-19", x: 19, y: 11, species: "birke" },
    { id: "wald-20", x: 14, y: 13, species: "maigloeckchen" },
    // Clearing 2 — v3.1 additions
    { id: "wald-31", x: 11, y: 9,  species: "herbstzeitlose" },
    { id: "wald-32", x: 19, y: 9,  species: "baerlauch" },
    { id: "wald-33", x: 13, y: 11, species: "holunder" },
    { id: "wald-34", x: 17, y: 12, species: "herbstzeitlose" },
    { id: "wald-35", x: 16, y: 13, species: "fichte" },
    // Clearing 3 (rows 15–18, cols 11–14 and 16–19 = F tiles)
    { id: "wald-5",  x: 13, y: 16, species: "maigloeckchen" },
    { id: "wald-6",  x: 17, y: 16, species: "herbstzeitlose" },
    { id: "wald-7",  x: 12, y: 16, species: "baerlauch" },
    { id: "wald-21", x: 16, y: 15, species: "herbstzeitlose" },
    { id: "wald-22", x: 12, y: 17, species: "holunder" },
    { id: "wald-23", x: 19, y: 17, species: "baerlauch" },
    { id: "wald-24", x: 16, y: 18, species: "maigloeckchen" },
    // Clearing 3 — v3.1 additions
    { id: "wald-36", x: 11, y: 15, species: "baerlauch" },
    { id: "wald-37", x: 19, y: 15, species: "birke" },
    { id: "wald-38", x: 14, y: 16, species: "fichte" },
    { id: "wald-39", x: 11, y: 17, species: "maigloeckchen" },
    { id: "wald-40", x: 18, y: 17, species: "holunder" },
    { id: "wald-41", x: 13, y: 18, species: "herbstzeitlose" },
    { id: "wald-42", x: 17, y: 18, species: "baerlauch" },
  ],
  waldrand: [
    { id: "waldrand-1",  x: 8,  y: 3,  species: "veilchen" },
    { id: "waldrand-2",  x: 25, y: 3,  species: "huflattich" },
    { id: "waldrand-3",  x: 8,  y: 15, species: "veilchen" },
    { id: "waldrand-4",  x: 25, y: 15, species: "huflattich" },
    { id: "waldrand-5",  x: 9,  y: 15, species: "veilchen" },
    { id: "waldrand-6",  x: 21, y: 3,  species: "huflattich" },
    // WP3
    { id: "waldrand-7",  x: 10, y: 5,  species: "holunder" },
    { id: "waldrand-8",  x: 20, y: 5,  species: "holunder" },
    { id: "waldrand-9",  x: 8,  y: 9,  species: "hagebutte" },
    { id: "waldrand-10", x: 18, y: 9,  species: "hagebutte" },
    { id: "waldrand-11", x: 14, y: 5,  species: "weissdorn" },
    { id: "waldrand-12", x: 9,  y: 13, species: "schlehe" },
    { id: "waldrand-13", x: 19, y: 13, species: "schlehe" },
    { id: "waldrand-14", x: 12, y: 12, species: "schluesselblume" },
    { id: "waldrand-15", x: 18, y: 12, species: "schluesselblume" },
    { id: "waldrand-16", x: 14, y: 9,  species: "birke" },
    { id: "waldrand-17", x: 8,  y: 6,  species: "attich" },
    { id: "waldrand-18", x: 20, y: 14, species: "pestwurz" },
    { id: "waldrand-19", x: 10, y: 14, species: "giersch" },
    { id: "waldrand-20", x: 20, y: 8,  species: "gundelrebe" },
    { id: "waldrand-21", x: 14, y: 14, species: "gefleckterSchierling" },
    // v3.1 additions — reuse same species, more coverage
    { id: "waldrand-22", x: 6,  y: 7,  species: "veilchen" },
    { id: "waldrand-23", x: 24, y: 7,  species: "huflattich" },
    { id: "waldrand-24", x: 10, y: 2,  species: "schluesselblume" },
    { id: "waldrand-25", x: 21, y: 2,  species: "schluesselblume" },
    { id: "waldrand-26", x: 7,  y: 11, species: "hagebutte" },
    { id: "waldrand-27", x: 24, y: 11, species: "hagebutte" },
    { id: "waldrand-28", x: 12, y: 7,  species: "weissdorn" },
    { id: "waldrand-29", x: 10, y: 10, species: "holunder" },
    { id: "waldrand-30", x: 21, y: 10, species: "holunder" },
    { id: "waldrand-31", x: 7,  y: 17, species: "schlehe" },
    { id: "waldrand-32", x: 24, y: 17, species: "pestwurz" },
    { id: "waldrand-33", x: 12, y: 16, species: "giersch" },
    { id: "waldrand-34", x: 21, y: 16, species: "gundelrebe" },
    { id: "waldrand-35", x: 8,  y: 18, species: "attich" },
    { id: "waldrand-36", x: 22, y: 18, species: "birke" },
    { id: "waldrand-37", x: 6,  y: 1,  species: "veilchen" },
    { id: "waldrand-38", x: 25, y: 1,  species: "huflattich" },
  ],
  wiese: [
    { id: "wiese-1",  x: 3,  y: 2,  species: "loewenzahn" },
    { id: "wiese-2",  x: 8,  y: 2,  species: "gaensebluemchen" },
    { id: "wiese-3",  x: 13, y: 2,  species: "spitzwegerich" },
    { id: "wiese-4",  x: 18, y: 2,  species: "schafgarbe" },
    { id: "wiese-5",  x: 23, y: 2,  species: "brennnessel" },
    { id: "wiese-6",  x: 3,  y: 6,  species: "gaensebluemchen" },
    { id: "wiese-7",  x: 8,  y: 6,  species: "spitzwegerich" },
    { id: "wiese-8",  x: 13, y: 6,  species: "schafgarbe" },
    { id: "wiese-9",  x: 18, y: 6,  species: "brennnessel" },
    { id: "wiese-10", x: 23, y: 6,  species: "loewenzahn" },
    { id: "wiese-11", x: 3,  y: 8,  species: "spitzwegerich" },
    { id: "wiese-12", x: 3,  y: 12, species: "brennnessel" },
    { id: "wiese-13", x: 8,  y: 12, species: "loewenzahn" },
    { id: "wiese-14", x: 13, y: 12, species: "gaensebluemchen" },
    { id: "wiese-15", x: 18, y: 12, species: "spitzwegerich" },
    { id: "wiese-16", x: 23, y: 12, species: "schafgarbe" },
    { id: "wiese-17", x: 3,  y: 16, species: "loewenzahn" },
    { id: "wiese-18", x: 8,  y: 16, species: "gaensebluemchen" },
    { id: "wiese-19", x: 13, y: 16, species: "spitzwegerich" },
    { id: "wiese-20", x: 18, y: 16, species: "schafgarbe" },
    { id: "wiese-21", x: 23, y: 16, species: "brennnessel" },
    { id: "wiese-22", x: 13, y: 18, species: "gaensebluemchen" },
    // WP2
    { id: "wiese-23", x: 8,  y: 8,  species: "johanniskraut" },
    { id: "wiese-24", x: 18, y: 8,  species: "rotklee" },
    { id: "wiese-25", x: 23, y: 8,  species: "frauenmantel" },
    { id: "wiese-26", x: 13, y: 8,  species: "malve" },
    { id: "wiese-27", x: 3,  y: 4,  species: "wegwarte" },
    { id: "wiese-28", x: 8,  y: 4,  species: "koenigskerze" },
    { id: "wiese-29", x: 18, y: 4,  species: "giersch" },
    { id: "wiese-30", x: 23, y: 4,  species: "gundelrebe" },
    { id: "wiese-31", x: 3,  y: 14, species: "hundskamille" },
    { id: "wiese-32", x: 23, y: 14, species: "jakobskreuzkraut" },
    { id: "wiese-33", x: 13, y: 4,  species: "johanniskraut" },
    { id: "wiese-34", x: 8,  y: 14, species: "gefleckterSchierling" },
    // v3.1 additions — more of everything, filling mid-field gaps
    { id: "wiese-35", x: 6,  y: 2,  species: "loewenzahn" },
    { id: "wiese-36", x: 11, y: 2,  species: "schafgarbe" },
    { id: "wiese-37", x: 16, y: 2,  species: "gaensebluemchen" },
    { id: "wiese-38", x: 21, y: 2,  species: "spitzwegerich" },
    { id: "wiese-39", x: 6,  y: 4,  species: "gaensebluemchen" },
    { id: "wiese-40", x: 11, y: 4,  species: "rotklee" },
    { id: "wiese-41", x: 16, y: 4,  species: "frauenmantel" },
    { id: "wiese-42", x: 21, y: 4,  species: "wegwarte" },
    { id: "wiese-43", x: 6,  y: 6,  species: "brennnessel" },
    { id: "wiese-44", x: 11, y: 6,  species: "loewenzahn" },
    { id: "wiese-45", x: 16, y: 6,  species: "johanniskraut" },
    { id: "wiese-46", x: 21, y: 6,  species: "malve" },
    { id: "wiese-47", x: 6,  y: 8,  species: "schafgarbe" },
    { id: "wiese-48", x: 11, y: 8,  species: "gundelrebe" },
    { id: "wiese-49", x: 16, y: 8,  species: "koenigskerze" },
    { id: "wiese-50", x: 21, y: 8,  species: "spitzwegerich" },
    { id: "wiese-51", x: 6,  y: 12, species: "gaensebluemchen" },
    { id: "wiese-52", x: 11, y: 12, species: "schafgarbe" },
    { id: "wiese-53", x: 16, y: 12, species: "loewenzahn" },
    { id: "wiese-54", x: 21, y: 12, species: "rotklee" },
    { id: "wiese-55", x: 6,  y: 14, species: "spitzwegerich" },
  ],
  bachufer: [
    { id: "bachufer-1",  x: 4,  y: 3,  species: "madesüss" },
    { id: "bachufer-2",  x: 9,  y: 6,  species: "beinwell" },
    { id: "bachufer-3",  x: 14, y: 2,  species: "weide" },
    { id: "bachufer-4",  x: 5,  y: 14, species: "roterfingerhut" },
    { id: "bachufer-5",  x: 21, y: 4,  species: "madesüss" },
    { id: "bachufer-6",  x: 24, y: 7,  species: "beinwell" },
    { id: "bachufer-7",  x: 14, y: 15, species: "weide" },
    { id: "bachufer-8",  x: 24, y: 14, species: "pestwurz" },
    { id: "bachufer-9",  x: 10, y: 13, species: "roterfingerhut" },
    // v3.1 additions — more streamside coverage on both banks
    { id: "bachufer-10", x: 7,  y: 2,  species: "madesüss" },
    { id: "bachufer-11", x: 22, y: 2,  species: "beinwell" },
    { id: "bachufer-12", x: 4,  y: 7,  species: "beinwell" },
    { id: "bachufer-13", x: 21, y: 8,  species: "madesüss" },
    { id: "bachufer-14", x: 9,  y: 9,  species: "weide" },
    { id: "bachufer-15", x: 22, y: 12, species: "weide" },
    { id: "bachufer-16", x: 7,  y: 16, species: "pestwurz" },
    { id: "bachufer-17", x: 22, y: 16, species: "roterfingerhut" },
    { id: "bachufer-18", x: 5,  y: 5,  species: "madesüss" },
    { id: "bachufer-19", x: 23, y: 5,  species: "beinwell" },
    { id: "bachufer-20", x: 10, y: 17, species: "pestwurz" },
  ],
  dorf: [
    // Linde trees near village center (original)
    { id: "dorf-1", x: 12, y: 9,  species: "linde" },
    { id: "dorf-2", x: 11, y: 8,  species: "linde" },  // note: well at x:10-11,y:8-9 but x:11,y:8 is open per grid
    // Hundspetersilie — shadowy corners near buildings (original)
    { id: "dorf-3", x: 22, y: 18, species: "hundspetersilie" },
    { id: "dorf-4", x: 13, y: 17, species: "hundspetersilie" },
    // v3.1: ruderal / weedy herbs that grow around human settlements
    // Löwenzahn — ubiquitous, all over the village grass
    { id: "dorf-5",  x: 3,  y: 2,  species: "loewenzahn" },
    { id: "dorf-6",  x: 19, y: 2,  species: "loewenzahn" },
    { id: "dorf-7",  x: 4,  y: 12, species: "loewenzahn" },
    { id: "dorf-8",  x: 28, y: 12, species: "loewenzahn" },
    // Gänseblümchen — lawns near huts south section
    { id: "dorf-9",  x: 4,  y: 14, species: "gaensebluemchen" },
    { id: "dorf-10", x: 24, y: 14, species: "gaensebluemchen" },
    // Spitzwegerich — trampled paths and verges
    { id: "dorf-11", x: 3,  y: 7,  species: "spitzwegerich" },
    { id: "dorf-12", x: 19, y: 7,  species: "spitzwegerich" },
    { id: "dorf-13", x: 4,  y: 19, species: "spitzwegerich" },
    // Brennnessel — waste ground near huts
    { id: "dorf-14", x: 8,  y: 19, species: "brennnessel" },
    { id: "dorf-15", x: 23, y: 19, species: "brennnessel" },
    // Giersch — shady spots near fences and buildings
    { id: "dorf-16", x: 3,  y: 10, species: "giersch" },
    { id: "dorf-17", x: 27, y: 10, species: "giersch" },
    // Gundelrebe — creeps along walls and paths
    { id: "dorf-18", x: 4,  y: 20, species: "gundelrebe" },
    { id: "dorf-19", x: 18, y: 20, species: "gundelrebe" },
    // Schafgarbe — sunny open spots
    { id: "dorf-20", x: 24, y: 20, species: "schafgarbe" },
    { id: "dorf-21", x: 13, y: 20, species: "schafgarbe" },
    // Malve — near south huts, cottage gardens
    { id: "dorf-22", x: 8,  y: 20, species: "malve" },
    // Hundspetersilie — more shadowy niches (keep a couple extra decoys)
    { id: "dorf-23", x: 27, y: 13, species: "hundspetersilie" },
  ],
  alpweide: [
    { id: "alpweide-1",  x: 15, y: 2,  species: "arnika" },
    { id: "alpweide-2",  x: 22, y: 5,  species: "arnika" },
    { id: "alpweide-3",  x: 25, y: 2,  species: "gelberEnzian" },
    { id: "alpweide-4",  x: 12, y: 10, species: "gelberEnzian" },
    { id: "alpweide-5",  x: 5,  y: 10, species: "alpenfrauenmantel" },
    { id: "alpweide-6",  x: 25, y: 12, species: "alpenfrauenmantel" },
    { id: "alpweide-7",  x: 12, y: 9,  species: "quendel" },
    { id: "alpweide-8",  x: 20, y: 14, species: "quendel" },
    { id: "alpweide-9",  x: 10, y: 2,  species: "wacholder" },
    { id: "alpweide-10", x: 27, y: 7,  species: "wacholder" },
    // v3.1 additions — more alpine coverage
    { id: "alpweide-11", x: 3,  y: 3,  species: "arnika" },
    { id: "alpweide-12", x: 20, y: 3,  species: "arnika" },
    { id: "alpweide-13", x: 14, y: 6,  species: "gelberEnzian" },
    { id: "alpweide-14", x: 23, y: 9,  species: "gelberEnzian" },
    { id: "alpweide-15", x: 7,  y: 13, species: "alpenfrauenmantel" },
    { id: "alpweide-16", x: 18, y: 11, species: "alpenfrauenmantel" },
    { id: "alpweide-17", x: 3,  y: 7,  species: "quendel" },
    { id: "alpweide-18", x: 26, y: 5,  species: "quendel" },
    { id: "alpweide-19", x: 3,  y: 13, species: "wacholder" },
    { id: "alpweide-20", x: 22, y: 13, species: "wacholder" },
  ],
};

function parseWindow(window) {
  const [season, range] = window.split(":");
  const [start, end] = range.split("-").map(Number);
  return { season, start, end };
}

// Returns the plant-part keys (e.g. "blaetter", "blueten") that are
// currently in season for `herb`, given the in-game clock `time`.
export function getAvailableTeile(herb, time) {
  const season = getSeasonKey(time);
  const day = time.day;
  const teile = herb.saison?.teil ?? {};
  const available = [];
  for (const [teil, windows] of Object.entries(teile)) {
    const inSeason = windows.some((w) => {
      const { season: s, start, end } = parseWindow(w);
      return s === season && day >= start && day <= end;
    });
    if (inSeason) available.push(teil);
  }
  return available;
}

// Returns the spawn points on `mapId` currently visible: the species has at
// least one available part this season and the point isn't in `harvested`
// (a Set of spawn-point ids).
export function getActiveSpawns(mapId, time, harvested = new Set()) {
  const points = SPAWN_POINTS[mapId] ?? [];
  const result = [];
  for (const point of points) {
    if (harvested.has(point.id)) continue;
    const herb = herbs[point.species];
    if (!herb) continue;
    const availableTeile = getAvailableTeile(herb, time);
    if (availableTeile.length === 0) continue;
    const sprite = resolveSprite(herb, time);
    result.push({ ...point, herb, availableTeile, sprite });
  }
  return result;
}
