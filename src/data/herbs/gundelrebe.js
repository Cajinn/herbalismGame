import { createSprite } from "../../engine/pixelSprite.js";

// Gundelrebe (Glechoma hederacea). Kriechend, vierkantig, aromatisch.
export const gundelrebe = {
  nameDe: "Gundelrebe",
  nameLat: "Glechoma hederacea",
  schweizerdeutsch: "Gundelräbe",
  plate: "glechoma-hederacea.jpg",
  biotope: ["wiese", "waldrand"],
  sonne: "halbschattig",
  boden: "feucht, nährstoffreich",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28", "sommer:1-14"],
      blueten: ["fruehling:8-28"],
    },
  },
  realMonths: [3, 4, 5, 6],
  merkmale: {
    blattform: "nierenförmig, gekerbt, weich behaart, aromatisch",
    blattstellung: "kreuzgegenständig, kriechende Stängel",
    bluete: "blauviolett, zweilippig, quirlständig",
    geruch: "kräftig aromatisch-minzig beim Zerreiben",
    stengel: "vierkantig, kriechend und wurzelnd an Knoten",
    wuchshoehe: "5–20 cm (kriechend)",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee", "trocknen"],
    blueten: ["tee"],
    wirkungTraditionell:
      "schleimlösend, entzündungshemmend — traditionell Frühjahrskur und bei Husten",
  },
  fundorte: 4,
  sprite: createSprite({
    palette: [null, "#558b2f", "#7b1fa2", "#9c27b0"],
    rows: [
      "0000000000000000",
      "0002200000022000",
      "0022220000222200",
      "0022220000222200",
      "0002200000022000",
      "0000023200000000",
      "0000023200000000",
      "0000232320000000",
      "0000232320000000",
      "0001111111100000",
      "0001111111100000",
      "0011111111110000",
      "0011111111110000",
      "0001111111100000",
      "0000111111000000",
      "0000001100000000",
    ],
  }),
};
