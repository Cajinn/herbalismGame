import { villagers } from "../data/villagers.js";
import { isVillagerSick } from "../sim/villagerStatus.js";

// Returns villagers currently present on mapId, with their current position.
// Before 12:00 → home position; 12:00 and after → square position.
// Sick villagers (villagerStatus entry present) stay home and are hidden.
export function getActiveNpcs(mapId, time, villagerStatus = {}) {
  const afternoon = time.hour >= 12;
  return Object.values(villagers)
    .map((v) => {
      if (isVillagerSick(villagerStatus, v.id)) return null;
      const pos = afternoon ? v.square : v.home;
      if (pos.map !== mapId) return null;
      return { ...v, x: pos.x, y: pos.y };
    })
    .filter(Boolean);
}
