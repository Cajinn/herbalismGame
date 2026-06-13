import { createSprite } from "../../engine/pixelSprite.js";

// Veilchen (Viola odorata).
export const veilchen = {
  nameDe: "Veilchen",
  nameLat: "Viola odorata",
  schweizerdeutsch: "Veieli",
  plate: "viola-odorata.jpg",
  biotope: ["waldrand"],
  sonne: "halbschattig",
  boden: "frisch, humusreich, Hecken und Waldränder",
  saison: {
    teil: {
      blueten: ["fruehling:1-14"],
      blaetter: ["fruehling:1-28"],
    },
  },
  realMonths: [3, 4],
  merkmale: {
    blattform: "herzförmig, am Rand fein gezähnt, langgestielt",
    blattstellung: "grundständige Rosette aus einem Wurzelstock, kriechende Ausläufer",
    bluete: "dunkelviolette, stark duftende Blüten mit Sporn, einzeln auf langem Stiel",
    geruch: "Blüten angenehm süsslich duftend (namensgebend)",
    stengel: "blattloser Blütenstiel, kriechende Ausläufer (Stolonen)",
    wuchshoehe: "5-15 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blueten: ["sirup", "kueche"],
    wirkungTraditionell: "traditionell bei Husten (Sirup), Blüten als essbare Dekoration",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#388e3c", "#9ccc65", "#7b1fa2"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000300",
      "0000000000003330",
      "0000000000033333",
      "0000000000003330",
      "0000000000002300",
      "0000001000102200",
      "0000111111112200",
      "0000111111122200",
      "0001111111122200",
      "0000111111122000",
      "0000111111222000",
      "0000001111222000",
      "0000001111100000",
    ],
  }),
};
