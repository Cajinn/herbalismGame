import { createSprite } from "../../engine/pixelSprite.js";

// Wegwarte (Cichorium intybus). Azurblaue Blüten, öffnet nur morgens.
export const wegwarte = {
  nameDe: "Wegwarte",
  nameLat: "Cichorium intybus",
  schweizerdeutsch: "Zichoorie",
  plate: "cichorium-intybus.jpg",
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "trocken, kalkhaltig, Wegränder und Böschungen",
  saison: {
    teil: {
      blueten: ["sommer:14-28", "herbst:1-14"],
      wurzel: ["fruehling:1-14", "herbst:14-28"],
    },
  },
  realMonths: [7, 8, 9],
  merkmale: {
    blattform: "grundständige Blätter tief fiederspaltig, obere Stängelblätter pfeilförmig umfassend",
    blattstellung: "grundständige Rosette, Stängelblätter wechselständig",
    bluete: "azurblau, vielstrahlig, öffnet nur morgens — «die Braut der Sonne»",
    geruch: "kaum wahrnehmbar, leicht bitter",
    stengel: "kantig, milchsaftführend, verzweigt",
    wuchshoehe: "30–120 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee"],
    wurzel: ["trocknen", "tinktur"],
    wirkungTraditionell:
      "verdauungsfördernd, leberanregend — Wurzel geröstet als Kaffeeersatz (Chicoree)",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#558b2f", "#1976d2", "#42a5f5"],
    rows: [
      "0000030300000000",
      "0000333333000000",
      "0003333233300000",
      "0003332223300000",
      "0003333233300000",
      "0000333333000000",
      "0000030300000000",
      "0000001100000000",
      "0000001100000000",
      "0002001100000000",
      "0002001100200000",
      "0002111111200000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
      "0000001100000000",
    ],
  }),
};
