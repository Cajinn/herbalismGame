import { herbs } from "../data/herbs/index.js";
import { getSeasonKey } from "../sim/time.js";

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
export const SPAWN_POINTS = {
  wald: [
    { id: "wald-1", x: 13, y: 4,  species: "baerlauch" },
    { id: "wald-2", x: 17, y: 4,  species: "maigloeckchen" },
    { id: "wald-3", x: 13, y: 10, species: "herbstzeitlose" },
    { id: "wald-4", x: 17, y: 10, species: "baerlauch" },
    { id: "wald-5", x: 13, y: 16, species: "maigloeckchen" },
    { id: "wald-6", x: 17, y: 16, species: "herbstzeitlose" },
    { id: "wald-7", x: 14, y: 16, species: "baerlauch" },
    // WP3
    { id: "wald-8",  x: 10, y: 7,  species: "fichte" },
    { id: "wald-9",  x: 20, y: 7,  species: "birke" },
    { id: "wald-10", x: 10, y: 13, species: "fichte" },
    { id: "wald-11", x: 20, y: 13, species: "birke" },
    { id: "wald-12", x: 15, y: 7,  species: "holunder" },
  ],
  waldrand: [
    { id: "waldrand-1",  x: 6,  y: 3,  species: "veilchen" },
    { id: "waldrand-2",  x: 23, y: 3,  species: "huflattich" },
    { id: "waldrand-3",  x: 6,  y: 15, species: "veilchen" },
    { id: "waldrand-4",  x: 23, y: 15, species: "huflattich" },
    { id: "waldrand-5",  x: 7,  y: 15, species: "veilchen" },
    { id: "waldrand-6",  x: 22, y: 3,  species: "huflattich" },
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
  ],
  bachufer: [
    { id: "bachufer-1", x: 4,  y: 3,  species: "madesüss" },
    { id: "bachufer-2", x: 9,  y: 6,  species: "beinwell" },
    { id: "bachufer-3", x: 14, y: 2,  species: "weide" },
    { id: "bachufer-4", x: 5,  y: 14, species: "roterfingerhut" },
    { id: "bachufer-5", x: 21, y: 4,  species: "madesüss" },
    { id: "bachufer-6", x: 24, y: 7,  species: "beinwell" },
    { id: "bachufer-7", x: 14, y: 15, species: "weide" },
    { id: "bachufer-8", x: 24, y: 14, species: "pestwurz" },
    { id: "bachufer-9", x: 10, y: 13, species: "roterfingerhut" },
  ],
  dorf: [
    { id: "dorf-1", x: 12, y: 9,  species: "linde" },
    { id: "dorf-2", x: 11, y: 8,  species: "linde" },
    { id: "dorf-3", x: 22, y: 18, species: "hundspetersilie" },
    { id: "dorf-4", x: 9,  y: 17, species: "hundspetersilie" },
  ],
  alpweide: [
    { id: "alpweide-1",  x: 15, y: 2,  species: "arnika" },
    { id: "alpweide-2",  x: 22, y: 5,  species: "arnika" },
    { id: "alpweide-3",  x: 25, y: 2,  species: "gelberEnzian" },
    { id: "alpweide-4",  x: 12, y: 10, species: "gelberEnzian" },
    { id: "alpweide-5",  x: 5,  y: 10, species: "alpenfrauenmantel" },
    { id: "alpweide-6",  x: 25, y: 12, species: "alpenfrauenmantel" },
    { id: "alpweide-7",  x: 10, y: 6,  species: "quendel" },
    { id: "alpweide-8",  x: 20, y: 14, species: "quendel" },
    { id: "alpweide-9",  x: 10, y: 2,  species: "wacholder" },
    { id: "alpweide-10", x: 27, y: 7,  species: "wacholder" },
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
