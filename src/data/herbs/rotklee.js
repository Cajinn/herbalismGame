import { createSprite } from "../../engine/pixelSprite.js";

// Rotklee (Trifolium pratense). Dreizähliges Blatt mit V-Fleck.
export const rotklee = {
  nameDe: "Rotklee",
  nameLat: "Trifolium pratense",
  schweizerdeutsch: "Chleeblüemli",
  plate: "trifolium-pratense.jpg",
  biotope: ["wiese"],
  sonne: "sonnig bis halbschattig",
  boden: "nährstoffreich, lehmig",
  saison: {
    teil: {
      blueten: ["fruehling:14-28", "sommer:1-28"],
    },
  },
  realMonths: [5, 6, 7, 8],
  merkmale: {
    blattform: "dreiteilig, oval, mit hellem V-förmigem Fleck auf jedem Blättchen",
    blattstellung: "wechselständig, behaart",
    bluete: "kugelrunde, rötlich-violette Köpfchen, duftend",
    geruch: "süßlich-blütig",
    stengel: "aufrecht, behaart, hohl",
    wuchshoehe: "15–40 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "trocknen"],
    wirkungTraditionell: "mild schleimlösend, isoflavonhaltig — traditionell Frauenkraut",
  },
  fundorte: 5,
  sprite: createSprite({
    palette: [null, "#558b2f", "#c2185b", "#f8bbd9"],
    rows: [
      "0000002220000000",
      "0000022222000000",
      "0000023232000000",
      "0000022222000000",
      "0000002320000000",
      "0000002220000000",
      "0000000100000000",
      "0000001110000000",
      "0000111111100000",
      "0001111111110000",
      "0001111111110000",
      "0000111111100000",
      "0000011111100000",
      "0000001111000000",
      "0000000110000000",
      "0000000100000000",
    ],
  }),
};
