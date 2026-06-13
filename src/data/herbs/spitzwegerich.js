import { createSprite } from "../../engine/pixelSprite.js";

// Spitzwegerich (Plantago lanceolata).
export const spitzwegerich = {
  nameDe: "Spitzwegerich",
  nameLat: "Plantago lanceolata",
  schweizerdeutsch: "Wegerich",
  plate: "plantago-lanceolata.jpg",
  biotope: ["wiese"],
  sonne: "sonnig bis halbschattig",
  boden: "verdichtete Böden, Wegränder",
  saison: {
    teil: {
      blaetter: ["fruehling:8-28", "sommer:1-28", "herbst:1-14"],
    },
  },
  realMonths: [4, 5, 6, 7, 8, 9],
  merkmale: {
    blattform: "schmal-lanzettlich, mit deutlichen Längsrippen (5 Hauptnerven)",
    blattstellung: "grundständige Rosette, Blätter aufrecht abstehend",
    bluete: "unscheinbarer brauner Ährenkopf auf langem, kantigem Stiel",
    geruch: "kaum wahrnehmbar",
    stengel: "blattlos, kantig gerieft, mit Ährenkopf",
    wuchshoehe: "10-40 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blaetter: ["wickel", "tinktur", "sirup"],
    wirkungTraditionell:
      "traditionell bei Insektenstichen (frisch zerquetscht) und Husten (Sirup)",
  },
  fundorte: 5,
  sprite: createSprite({
    palette: [null, "#558b2f", "#9ccc65", "#795548"],
    rows: [
      "0000000030000000",
      "0000000131000000",
      "0000100333001000",
      "0000110232011000",
      "0000110232011000",
      "0000111222111000",
      "0000111222111000",
      "0000011222110000",
      "0000011222110000",
      "0000011222110000",
      "0000011222110000",
      "0000001222100000",
      "0000001222100000",
      "0000001222100000",
      "0000001222100000",
      "0000000222000000",
    ],
  }),
};
