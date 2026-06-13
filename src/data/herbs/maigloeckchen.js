import { createSprite } from "../../engine/pixelSprite.js";

// Maiglöckchen (Convallaria majalis). Giftiger Bärlauch-Lookalike — PLAN.md §7.
export const maigloeckchen = {
  nameDe: "Maiglöckchen",
  nameLat: "Convallaria majalis",
  schweizerdeutsch: "Maiglöckli",
  plate: "convallaria-majalis.jpg",
  biotope: ["wald"],
  sonne: "schattig",
  boden: "frisch, humos",
  saison: {
    teil: {
      blaetter: ["fruehling:8-28"],
      blueten: ["fruehling:20-28", "sommer:1-10"],
    },
  },
  realMonths: [4, 5, 6],
  merkmale: {
    blattform: "breit-elliptisch, glänzend glatt, ohne Stiel direkt aus der Blattscheide",
    blattstellung: "stets zu zweit (selten zu dritt) aus einer gemeinsamen Scheide am Boden",
    bluete: "weisse, glockenförmige Blüten in einseitiger Traube",
    geruch: "kein Knoblauchgeruch — geruchlos oder leicht süsslich",
    stengel: "kein eigener Blattstängel, Blätter direkt aus der Scheide",
    wuchshoehe: "10-25 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell:
      "giftig — alle Pflanzenteile, vor allem für die Herzwirkung; keine Anwendung",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#43a047", "#a5d6a7"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000002000200000",
      "0000122212221000",
      "0000122212221000",
      "0001122212221100",
      "0001122212221100",
      "0001122212221100",
      "0011122212221110",
      "0001122212221100",
      "0001122212221100",
      "0001122212221100",
      "0000122212221000",
      "0000122212221000",
      "0000022202220000",
    ],
  }),
};
