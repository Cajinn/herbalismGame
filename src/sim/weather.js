// Optional weather system (stretch goal): a global daily weather value that
// reskins outdoor tiles and waters the garden for free on rainy days.
// Pure data + logic, no DOM/canvas here — main.js reads `weather.today` to
// decide what to draw and hud.js to decide what label to show.
import { getSeasonKey } from "./time.js";

// Approximate seasonal odds (sonnig / bewoelkt / regen), must sum to 1 per
// season. Winter "regen" mechanically doubles as sleet/snow — same effects.
const WEATHER_TABLE = {
  fruehling: { sonnig: 0.45, bewoelkt: 0.25, regen: 0.30 },
  sommer:    { sonnig: 0.60, bewoelkt: 0.25, regen: 0.15 },
  herbst:    { sonnig: 0.35, bewoelkt: 0.30, regen: 0.35 },
  winter:    { sonnig: 0.40, bewoelkt: 0.40, regen: 0.20 },
};

export function createWeather() {
  return { today: "sonnig" };
}

// Rolls a new day's weather from the current season's table and stores it on
// `weather.today`. Called once per day rollover (sleep or midnight collapse).
// `rng` is injectable for deterministic tests; the live game always uses the
// default Math.random (this codebase has no seeded rng elsewhere).
export function rollWeather(weather, time, rng = Math.random) {
  const table = WEATHER_TABLE[getSeasonKey(time)] ?? WEATHER_TABLE.sommer;
  const roll = rng();
  let acc = 0;
  for (const [kind, chance] of Object.entries(table)) {
    acc += chance;
    if (roll < acc) {
      weather.today = kind;
      return weather.today;
    }
  }
  weather.today = "sonnig"; // float-rounding fallback
  return weather.today;
}
