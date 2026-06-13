import { createSprite } from "../../engine/pixelSprite.js";

// Salbei (Salvia officinalis). Graugrüne filzige Blätter, campherartig — Garten-Klassiker.
export const salbei = {
  nameDe: "Salbei",
  nameLat: "Salvia officinalis",
  schweizerdeutsch: "Salbei",
  plate: "salvia-officinalis.jpg",
  biotope: ["garten"],
  sonne: "sonnig",
  boden: "trocken, durchlässig, kalkhaltig",
  saison: {
    teil: {
      blaetter: ["fruehling:7-28", "sommer:1-28", "herbst:1-14"],
    },
  },
  realMonths: [5, 6, 7, 8, 9],
  merkmale: {
    blattform: "oval-lanzettlich, runzlig, graugrün, filzig behaart — samtartig",
    blattstellung: "kreuzgegenständig, vierkantig Stängel",
    bluete: "blauviolette Lippen, in Quirlen am Stängel",
    geruch:
      "intensiv aromatisch-campherartig beim Zerreiben — typischer Kräutergeruch",
    stengel: "verholzend, vierkantig, graufilzig",
    wuchshoehe: "30–80 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee", "trocknen"],
    wirkungTraditionell:
      "antiseptisch, schweißhemmend — Salbeitee bei Halsschmerzen und Mundspülung; Nicht in der Schwangerschaft!",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#78909c", "#b0bec5", "#7986cb"],
    rows: [
      "0000000000000000",
      "0001110001110000",
      "0011220011220000",
      "0012220012220000",
      "0011220011220000",
      "0001110001110000",
      "0000131000131000",
      "0000033300033000",
      "0000001100001000",
      "0000001100000000",
      "0000001100000000",
      "0000001100000000",
      "0001111111100000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
    ],
  }),
};
