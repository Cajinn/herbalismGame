// Village reputation. `village` = sum of all per-villager Vertrauen scores.
export function createReputation() {
  return { village: 0, perVillager: {} };
}

export function addVertrauen(rep, villagerId, amount) {
  rep.perVillager[villagerId] = (rep.perVillager[villagerId] ?? 0) + amount;
  rep.village = Object.values(rep.perVillager).reduce((a, b) => a + b, 0);
}

export function getVillagerVertrauen(rep, id) {
  return rep.perVillager[id] ?? 0;
}

export function getVillageVertrauen(rep) {
  return rep.village;
}
