import { createSprite } from "../../engine/pixelSprite.js";

// Quendel / Feldthymian (Thymus serpyllum). Kriechend, intensiv thymianähnlich — wilder Bruder des Gartenthymians.
export const quendel = {
  nameDe: "Quendel / Feldthymian",
  nameLat: "Thymus serpyllum",
  schweizerdeutsch: "Thymeli",
  plate: null,
  biotope: ["alpweide"],
  sonne: "sonnig",
  boden: "trocken, sandig, Magerrasen und steinige Stellen",
  saison: {
    teil: {
      blaetter: ["sommer:1-28"],
      blueten: ["sommer:7-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform:
      "winzig, oval, kahl oder wenig behaart (im Ggs. zu Garten-Thymian)",
    blattstellung: "kreuzgegenständig, kriechend-aufliegend",
    bluete: "rosa bis violett, winzig, in dichten end- und seitenständigen Köpfchen",
    geruch:
      "intensiv thymianähnlich beim Zerreiben — wilder Bruder des Gartenthymians",
    stengel: "kriechend, an Knoten wurzelnd, halbverholzend",
    wuchshoehe: "3–10 cm (kriechend)",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee", "trocknen"],
    blueten: ["tee"],
    wirkungTraditionell:
      "schleimlösend, antiseptisch — wie Gartenthymian, traditionell wildes Alpenkraut bei Husten; auf dem Weidegang von Rindern als natürliches Gesundheitskraut",
  },
  fundorte: 4,
  sprite: createSprite({
    palette: [null, "#558b2f", "#e91e63", "#f48fb1"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000231132000000",
      "0002311113200000",
      "0023111111320000",
      "0231311131132000",
      "0023111111320000",
      "0002311113200000",
      "0001111111100000",
      "0011111111110000",
      "0011111111110000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
    ],
  }),
};
