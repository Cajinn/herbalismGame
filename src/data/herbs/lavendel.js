import { createSprite } from "../../engine/pixelSprite.js";

// Lavendel (Lavandula angustifolia). Unverwechselbarer Duft (Linalool) — beruhigend.
export const lavendel = {
  nameDe: "Lavendel",
  nameLat: "Lavandula angustifolia",
  schweizerdeutsch: "Lavendel",
  plate: "lavandula-angustifolia.jpg",
  biotope: ["garten"],
  sonne: "sonnig",
  boden: "trocken, kalkhaltig, sandig",
  saison: {
    teil: {
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform: "linealisch, schmal, graugrün, silbrig behaart — Mediterran-Look",
    blattstellung: "kreuzgegenständig, dicht",
    bluete: "blauviolett, in ährigem Blütenstand, intensiv duftend",
    geruch: "unverwechselbar intensiv-süßlich (Linalool) — beruhigend",
    stengel: "halbverholzend, aufrecht, verzweigt, silbriggrau behaart",
    wuchshoehe: "30–60 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "trocknen", "oelauszug"],
    wirkungTraditionell:
      "beruhigend, schlaffördernd, antiseptisch — Lavendelöl bei Kopfschmerzen, Schlaflosigkeit, Mückenstichen",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#78909c", "#7b1fa2", "#9c27b0"],
    rows: [
      "0000002200000000",
      "0000022220000000",
      "0000232320000000",
      "0000232320000000",
      "0000023230000000",
      "0000022220000000",
      "0000002200000000",
      "0000001100000000",
      "0000001100000000",
      "0000001100000000",
      "0001001101001000",
      "0001111111100000",
      "0001111111100000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
    ],
  }),
};
