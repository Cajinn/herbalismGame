import { createSprite } from "../../engine/pixelSprite.js";

// Thymian (Thymus vulgaris). Kleiner Halbstrauch, intensiv Thymol-Duft — starkes Hustenmittel.
export const thymian = {
  nameDe: "Thymian",
  nameLat: "Thymus vulgaris",
  schweizerdeutsch: "Thymian",
  plate: "thymus-vulgaris.jpg",
  biotope: ["garten"],
  sonne: "sonnig",
  boden: "trocken, steinig, kalkhaltig",
  saison: {
    teil: {
      blaetter: ["fruehling:7-28", "sommer:1-28", "herbst:1-14"],
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [5, 6, 7, 8, 9],
  merkmale: {
    blattform: "winzig, oval, Ränder leicht eingerollt, immergrün",
    blattstellung: "kreuzgegenständig, dicht besetzt",
    bluete: "winzig rosa-lila, in endständigen Köpfchen",
    geruch: "intensiv aromatisch-würzig (Thymol) — Erkältungsgeruch",
    stengel: "halbverholzend, verzweigt, niedrig",
    wuchshoehe: "10–30 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee", "trocknen", "honigauszug"],
    blueten: ["tee", "honigauszug"],
    wirkungTraditionell:
      "stark antiseptisch, schleimlösend, krampflösend — Thymiantee und Thymianhonig bei Husten und Bronchitis; eines der wirksamsten Hustenmittel",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#558b2f", "#e91e63", "#f48fb1"],
    rows: [
      "0000000000000000",
      "0000311031100000",
      "0001311131100000",
      "0001111111100000",
      "0001111111100000",
      "0011111111110000",
      "0011111111110000",
      "0001111111100000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
      "0000011110000000",
      "0000011110000000",
      "0000011110000000",
      "0000011110000000",
      "0000001100000000",
    ],
  }),
};
