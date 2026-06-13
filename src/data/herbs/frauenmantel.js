import { createSprite } from "../../engine/pixelSprite.js";

// Frauenmantel (Alchemilla vulgaris). Tau perlt wie Quecksilber auf den Blättern.
export const frauenmantel = {
  nameDe: "Frauenmantel",
  nameLat: "Alchemilla vulgaris",
  schweizerdeutsch: "Frauemäntelitee",
  plate: "alchemilla-vulgaris.jpg",
  biotope: ["wiese"],
  sonne: "halbschattig bis sonnig",
  boden: "feucht, nährstoffreich",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28", "sommer:1-28"],
      blueten: ["fruehling:14-28", "sommer:1-28"],
    },
  },
  realMonths: [4, 5, 6, 7, 8],
  merkmale: {
    blattform: "rundlich-gelappt, 7–11 Lappen, Rand fein gezähnt — Tau perlt darauf wie Quecksilber",
    blattstellung: "grundständig, wechselständig am Stängel",
    bluete: "winzig gelbgrün, in dichten Büscheln — kaum als Blüte erkennbar",
    geruch: "kaum wahrnehmbar, leicht zusammenziehend",
    stengel: "behaart, bogig aufsteigend",
    wuchshoehe: "10–40 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee", "trocknen"],
    blueten: ["tee"],
    wirkungTraditionell:
      "zusammenziehend (adstringierend), traditionell bei Frauenleiden, Wunden und als Magentee",
  },
  fundorte: 4,
  sprite: createSprite({
    palette: [null, "#558b2f", "#cddc39", "#8bc34a"],
    rows: [
      "0000000000000000",
      "0000222222200000",
      "0002222222220000",
      "0002221122220000",
      "0002221122220000",
      "0002222222220000",
      "0000222222200000",
      "0000012021200000",
      "0000001111000000",
      "0000001311000000",
      "0000003331000000",
      "0000013331000000",
      "0000133133100000",
      "0001331133110000",
      "0000111111100000",
      "0000001110000000",
    ],
  }),
};
