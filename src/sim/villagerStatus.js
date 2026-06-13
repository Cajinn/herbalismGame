// Tracks temporary sickness for villagers. Shape: { [villagerId]: { sickUntilDay, cause } }
// where sickUntilDay is an absolute day count (time.totalDays).

export function createVillagerStatus() {
  return {};
}

// Make a villager sick for `days` days, with an optional cause string.
export function makeVillagerSick(villagerStatus, villagerId, days, cause = "") {
  villagerStatus[villagerId] = { sickUntilDay: -1, cause, daysRemaining: days };
}

// Called once per day. Returns array of villager IDs that just recovered.
export function tickVillagerStatus(villagerStatus, time) {
  const recovered = [];
  for (const [id, status] of Object.entries(villagerStatus)) {
    if (status.daysRemaining === undefined) {
      delete villagerStatus[id];
      continue;
    }
    status.daysRemaining -= 1;
    if (status.daysRemaining <= 0) {
      delete villagerStatus[id];
      recovered.push(id);
    }
  }
  return recovered;
}

// Returns true if the villager is currently sick.
export function isVillagerSick(villagerStatus, villagerId) {
  return villagerId in villagerStatus;
}
