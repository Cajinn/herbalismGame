import { createSprite } from "../../engine/pixelSprite.js";

// Pfefferminze (Mentha × piperita) — garden-only cultivar.
export const pfefferminze = {
  nameDe: "Pfefferminze",
  nameLat: "Mentha × piperita",
  schweizerdeutsch: "Pfefferminze",
  plate: "mentha-piperita.jpg",
  biotope: ["garten"],
  sonne: "sonnig bis halbschattig",
  boden: "frisch, nährstoffreich, feucht",
  saison: {
    teil: {
      blaetter: ["fruehling:10-28", "sommer:1-28", "herbst:1-20"],
    },
  },
  realMonths: [4, 5, 6, 7, 8, 9, 10],
  merkmale: {
    blattform: "eiförmig bis lanzettlich, gesägt, am Rand leicht gewellt",
    blattstellung: "kreuzgegenständig, kurz gestielt",
    bluete: "kleine lila Quirlblüten, Ähre; blüht Juli–September",
    geruch: "intensiv mentholartig, frisch-kühlend beim Zerreiben",
    stengel: "vierkantig, rötlich-violett überlaufen",
    wuchshoehe: "30–90 cm, breitet sich durch Ausläufer aus",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee"],
    wirkungTraditionell: "kühlend, krampflösend, bei Kopfschmerzen und Verdauungsbeschwerden",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#2e7d32", "#66bb6a", "#7b1fa2"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000010100000000",
      "0000011100000000",
      "0000211120000000",
      "0000121110000000",
      "0000011100000000",
      "0000011100000000",
      "0000001110000000",
      "0000001100000000",
      "0000001100000000",
      "0000011110000000",
      "0000011111000000",
      "0000001111000000",
      "0000001110000000",
      "0000000000000000",
    ],
  }),
};
