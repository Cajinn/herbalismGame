import { createSprite } from "../../engine/pixelSprite.js";

// Gänseblümchen (Bellis perennis).
export const gaensebluemchen = {
  nameDe: "Gänseblümchen",
  nameLat: "Bellis perennis",
  schweizerdeutsch: "Margritli",
  plate: "bellis-perennis.jpg",
  biotope: ["wiese"],
  sonne: "sonnig bis halbschattig",
  boden: "verträgt Trittrasen, magere bis normale Böden",
  saison: {
    teil: {
      blueten: ["fruehling:1-28", "sommer:1-28", "herbst:1-28"],
    },
  },
  realMonths: [3, 4, 5, 6, 7, 8, 9, 10],
  merkmale: {
    blattform: "löffelförmig, ganzrandig bis schwach gezähnt, in grundständiger Rosette",
    blattstellung: "Rosette flach am Boden, keine Stängelblätter",
    bluete: "kleine Köpfchen mit weissen Zungenblüten und gelber Mitte, einzeln auf kurzem Stiel",
    geruch: "kaum wahrnehmbar, leicht grasig",
    stengel: "dünner, blattloser Blütenstiel",
    wuchshoehe: "5-15 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blueten: ["kueche", "tee"],
    wirkungTraditionell: "traditionell bei kleinen Hautirritationen, als milder Tee",
  },
  fundorte: 5,
  sprite: createSprite({
    palette: [null, "#66bb6a", "#ffffff", "#fdd835"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000020000000",
      "0000002232200000",
      "0000022333220000",
      "0000002232200000",
      "0000000121000000",
      "0000000111000000",
      "0000000111000000",
      "0000000111000000",
      "0000000111000000",
      "0000000111000000",
      "0000100111001000",
      "0000011111110000",
      "0000000111000000",
    ],
  }),
};
