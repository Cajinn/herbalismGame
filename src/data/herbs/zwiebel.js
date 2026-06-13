import { createSprite } from "../../engine/pixelSprite.js";

// Zwiebel (Allium cepa) — Küchenzutat, nicht in der Wildnis zu finden.
// Dient als Rezeptanker für Zwiebelsirup. Keine Spawns, kein fundorte.
export const zwiebel = {
  nameDe: "Küchenzwiebel",
  nameLat: "Allium cepa",
  schweizerdeutsch: "Zwiebel",
  plate: null,
  biotope: [],
  sonne: "sonnig",
  boden: "nährstoffreich, locker",
  saison: { teil: {} },
  realMonths: [],
  merkmale: {
    blattform: "röhrenförmige Blätter, aus dem Boden",
    blattstellung: "büschelig",
    bluete: "weiß-violette Kugelblüten (wenn ausgewachsen)",
    geruch: "typisch zwiebelartig",
    stengel: "röhrig, hohl",
    wuchshoehe: "30–60 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    zwiebel: ["hausmittel", "sirup"],
    wirkungTraditionell: "schleimlösend, antibakteriell — Zwiebelsirup ist ein klassisches Hausmittel bei Husten",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#a1887f", "#6d4c41", "#d7ccc8"],
    rows: [
      "0000000000000000",
      "0000000110000000",
      "0000001111000000",
      "0000011221100000",
      "0000112221110000",
      "0001122221111000",
      "0001122221110000",
      "0000112221100000",
      "0000011221100000",
      "0000011111000000",
      "0000011111000000",
      "0000001111000000",
      "0000001113000000",
      "0000000130000000",
      "0000000000000000",
      "0000000000000000",
    ],
  }),
};
