import { createSprite } from "../../engine/pixelSprite.js";

// Schafgarbe (Achillea millefolium).
export const schafgarbe = {
  nameDe: "Schafgarbe",
  nameLat: "Achillea millefolium",
  schweizerdeutsch: "Schoofgarbä",
  plate: "achillea-millefolium.jpg",
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "trocken bis normal, magere Wiesen",
  saison: {
    teil: {
      blueten: ["sommer:1-28", "herbst:1-14"],
    },
  },
  realMonths: [6, 7, 8, 9],
  merkmale: {
    blattform: "doppelt bis dreifach fiederteilig, sehr fein zerschlitzt (\"Federchen\")",
    blattstellung: "wechselständig am Stängel, untere Blätter in Rosette",
    bluete: "kleine weisse bis zartrosa Körbchen in flachen Schirmrispen",
    geruch: "aromatisch-würzig beim Zerreiben",
    stengel: "kantig-gerieft, fein behaart",
    wuchshoehe: "20-60 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blueten: ["tee", "tinktur", "pulver"],
    wirkungTraditionell:
      "traditionell krampflösend bei Verdauungsbeschwerden, Pulver blutstillend auf kleinen Wunden (Soldatenkraut)",
  },
  fundorte: 4,
  sprite: createSprite({
    palette: [null, "#7cb342", "#9ccc65", "#ffffff", "#f8bbd0"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000003333400000",
      "0000034333330000",
      "0000003333300000",
      "0000000111000000",
      "0000000111000000",
      "0000022111220000",
      "0000000111000000",
      "0000022111220000",
      "0000000111000000",
      "0000022111220000",
      "0000000111000000",
      "0000022111220000",
      "0000000111000000",
      "0000000111000000",
    ],
  }),
};
