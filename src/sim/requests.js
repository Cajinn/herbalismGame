import { absoluteDay, getSeasonKey } from "./time.js";
import { herbs } from "../data/herbs/index.js";

function isToxicSpecies(speciesId) {
  for (const herb of Object.values(herbs)) {
    if ((herb.verwechslung ?? []).some(
      (v) => v.art === speciesId && (v.gefahr === "giftig" || v.gefahr === "toedlich"),
    )) return true;
  }
  return false;
}

export function createRequests() {
  return { active: [], nextId: 1 };
}

export function requestForVillager(requests, villagerId) {
  return requests.active.find(
    (r) => r.villagerId === villagerId && r.status === "open",
  ) ?? null;
}

export function resolveRequest(requests, id) {
  const req = requests.active.find((r) => r.id === id);
  if (req) req.status = "resolved";
}

// Called from onDayComplete. Creates new requests for villagers without one,
// respecting a seasonal match and a 4-request global cap.
export function generateDailyRequests(requests, villagers, ailments, time) {
  const season = getSeasonKey(time);
  const today = absoluteDay(time);
  const openCount = requests.active.filter((r) => r.status === "open").length;
  if (openCount >= 4) return;

  for (const villager of Object.values(villagers)) {
    if (villager.id === "margrit") continue;
    if (requestForVillager(requests, villager.id)) continue;
    if (Math.random() > 0.5) continue;

    const possible = (villager.ailmentThemes ?? []).filter((aId) =>
      ailments[aId]?.seasons.includes(season),
    );
    if (possible.length === 0) continue;

    const ailmentId = possible[Math.floor(Math.random() * possible.length)];
    requests.active.push({
      id: requests.nextId++,
      villagerId: villager.id,
      ailmentId,
      createdDay: today,
      status: "open",
    });

    if (requests.active.filter((r) => r.status === "open").length >= 4) break;
  }
}

// Checks the handed-over item against the ailment's valid remedies.
// Returns "match" | "mismatch" | "toxic".
// "toxic" = item appeared to match (labeledAs matches remedy) but actual species is toxic.
export function evaluateDelivery(request, ailment, item) {
  const labeledAs = item.labeledAs ?? item.species;
  const matched = ailment.validRemedies.some(
    (r) => r.species === labeledAs && r.output === item.processed,
  );
  if (!matched) return "mismatch";
  if (item.labeledAs && item.labeledAs !== item.species && isToxicSpecies(item.species)) {
    return "toxic";
  }
  return "match";
}
