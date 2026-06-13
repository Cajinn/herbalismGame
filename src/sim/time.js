// In-game clock: 1 year = 4 seasons x 28 days, day runs 06:00-24:00.
// ~10 real minutes per full day if left running (PLAN.md §5).
export const SEASONS = ["fruehling", "sommer", "herbst", "winter"];
export const DAYS_PER_SEASON = 28;
export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 24;

const DAY_LENGTH_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60;
const DAY_LENGTH_REAL_SECONDS = 10 * 60;
const GAME_MINUTES_PER_REAL_SECOND = DAY_LENGTH_MINUTES / DAY_LENGTH_REAL_SECONDS;

export function createTime() {
  return { year: 1, seasonIndex: 0, day: 1, hour: DAY_START_HOUR, minute: 0 };
}

// Rolls `time.minute` overflow into hours and, if 24:00 is reached, into the
// next day. Returns true if the player collapsed from reaching 24:00.
function rollHour(time) {
  while (time.minute >= 60) {
    time.minute -= 60;
    time.hour += 1;
  }

  if (time.hour >= DAY_END_HOUR) {
    advanceDay(time);
    return true;
  }

  return false;
}

// Advances the clock by dtSeconds of real time. Returns true if the player
// collapsed from reaching 24:00 (the day rolls over automatically).
// `minute` is kept as a float between calls so small per-frame fractions
// (e.g. ~0.03 game-minutes at 60fps) accumulate instead of being floored away.
export function advanceTime(time, dtSeconds) {
  time.minute += dtSeconds * GAME_MINUTES_PER_REAL_SECOND;
  return rollHour(time);
}

// Advances the clock by a fixed number of in-game minutes (used by costed
// actions like Bestimmen's "Untersuchen"). Returns true if this rolled the
// day over.
export function addMinutes(time, minutes) {
  time.minute += minutes;
  return rollHour(time);
}

// Called on manual sleep (Schlafen) or automatic collapse at 24:00.
export function advanceDay(time) {
  time.hour = DAY_START_HOUR;
  time.minute = 0;
  time.day += 1;

  if (time.day > DAYS_PER_SEASON) {
    time.day = 1;
    time.seasonIndex += 1;

    if (time.seasonIndex >= SEASONS.length) {
      time.seasonIndex = 0;
      time.year += 1;
    }
  }
}

export function formatClock(time) {
  const hh = String(time.hour).padStart(2, "0");
  const mm = String(Math.floor(time.minute)).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function getSeasonKey(time) {
  return SEASONS[time.seasonIndex];
}

// Absolute game-day index (0 = Year 1, Frühling, Day 1). Used by
// processing.js to compute elapsed days independent of real-time dt.
export function absoluteDay(time) {
  return (time.year - 1) * SEASONS.length * DAYS_PER_SEASON
       + time.seasonIndex * DAYS_PER_SEASON
       + time.day - 1;
}
