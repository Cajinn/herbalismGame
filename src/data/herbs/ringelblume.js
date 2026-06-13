import { createSprite } from "../../engine/pixelSprite.js";

// Ringelblume (Calendula officinalis) — garden-only cultivar.
export const ringelblume = {
  nameDe: "Ringelblume",
  nameLat: "Calendula officinalis",
  schweizerdeutsch: "Ringelblume",
  plate: "calendula-officinalis.jpg",
  biotope: ["garten"],
  sonne: "sonnig",
  boden: "durchlässig, mager bis mittelnährstoffreich",
  saison: {
    teil: {
      blueten: ["fruehling:20-28", "sommer:1-28", "herbst:1-14"],
    },
  },
  realMonths: [5, 6, 7, 8, 9, 10],
  merkmale: {
    blattform: "länglich-lanzettlich, wechselständig, leicht klebrig-behaart",
    blattstellung: "wechselständig am Stängel, am Grund etwas breiter",
    bluete: "leuchtend orange bis gelbe Zungenblüten, Körbchenblütenstand",
    geruch: "harzig-aromatisch beim Zerreiben der Blätter",
    stengel: "aufrecht, verzweigt, zottig-behaart",
    wuchshoehe: "30–60 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["salbe", "oelauszug", "tee"],
    wirkungTraditionell: "entzündungshemmend, wundheilungsfördernd, hautpflegend (Ringelblumensalbe)",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#558b2f", "#e65100", "#ffa726"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000300000000",
      "0000003330000000",
      "0000033230000000",
      "0000032230000000",
      "0000003330000000",
      "0000000300000000",
      "0000000110000000",
      "0000000111000000",
      "0000000111000000",
      "0000100111001000",
      "0001111111110000",
      "0000111111110000",
      "0000011111100000",
      "0000001111000000",
    ],
  }),
};
