import { createSprite } from "../../engine/pixelSprite.js";

// Zitronenmelisse (Melissa officinalis). Intensiver Zitronengeruch beim Zerreiben — unverwechselbar.
export const zitronenmelisse = {
  nameDe: "Zitronenmelisse",
  nameLat: "Melissa officinalis",
  schweizerdeutsch: "Zitronenmelisse",
  plate: "melissa-officinalis.jpg",
  biotope: ["garten"],
  sonne: "sonnig bis halbschattig",
  boden: "humos, locker, feucht",
  saison: {
    teil: {
      blaetter: ["sommer:1-28", "herbst:1-14"],
    },
  },
  realMonths: [6, 7, 8, 9],
  merkmale: {
    blattform: "herzförmig-oval, grob gekerbt, hellgrün, runzlig",
    blattstellung: "kreuzgegenständig, typisch Lippenblütler",
    bluete: "kleine weiße Lippblüten, unscheinbar (Blätter verwenden!)",
    geruch:
      "intensiv nach Zitrone beim Zerreiben — unverwechselbar!",
    stengel: "vierkantig (Lippenblütler!), aufrecht, verzweigt",
    wuchshoehe: "30–80 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee", "trocknen"],
    wirkungTraditionell:
      "beruhigend, antiviral (Herpes!), verdauungsfördernd — Melissentee bei Nervosität, Unruhe und Einschlafproblemen",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#558b2f", "#c5e1a5", "#8bc34a"],
    rows: [
      "0000000000000000",
      "0002220002220000",
      "0022322022322000",
      "0023332023332000",
      "0022322022322000",
      "0002220002220000",
      "0000211002110000",
      "0000021122100000",
      "0000001221000000",
      "0000001331000000",
      "0000003331000000",
      "0000013331300000",
      "0001133113310000",
      "0001331133110000",
      "0000111111100000",
      "0000001110000000",
    ],
  }),
};
