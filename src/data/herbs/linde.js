import { createSprite } from "../../engine/pixelSprite.js";

// Dorflinde (Tilia cordata). Intensiver Honigduft im Hochsommer — Bienenmagnet und Dorfmittelpunkt.
export const linde = {
  nameDe: "Dorflinde",
  nameLat: "Tilia cordata",
  schweizerdeutsch: "Linde",
  plate: "tilia-cordata.jpg",
  biotope: ["dorf"],
  sonne: "sonnig bis halbschattig",
  boden: "nährstoffreich, tief, locker",
  saison: {
    teil: {
      blueten: ["sommer:7-21"],
    },
  },
  realMonths: [6, 7],
  merkmale: {
    blattform:
      "herzförmig, asymmetrisch, fein gesägt, Unterseite mit blauen Achselhaarbüscheln",
    blattstellung: "wechselständig, zweizeilig",
    bluete:
      "gelblichweiß, hängend, intensiv duftend — schwerer süßer Honigduft im Hochsommer",
    geruch:
      "unverwechselbar intensiv-süßlich-honigig beim Blühen — Bienenmagnet",
    stengel:
      "mächtiger Baum, glatte Rinde, Strangelfaser für Körbe",
    wuchshoehe: "10–30 m Baum (nur Blüten von unten erreichbar)",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blueten: ["tee", "trocknen", "sirup"],
    wirkungTraditionell:
      "schweißtreibend, beruhigend, krampflösend — Lindenblütentee bei Erkältungen, Nervosität und zum Einschlafen",
  },
  fundorte: 1,
  stages: {
    bluehend: {
      windows: ["sommer:7-21"],
      sprite: createSprite({
        palette: [null, "#33691e", "#fdd835", "#558b2f"],
        rows: [
          "0000033330000000",
          "0003333333000000",
          "0033331333300000",
          "0333331133330000",
          "0033333133300000",
          "0003333333000000",
          "0000033330000000",
          "0000002220000000",
          "0000002220000000",
          "0000012221000000",
          "0001112221110000",
          "0011122122110000",
          "0001122122100000",
          "0000112121100000",
          "0000011111000000",
          "0000001110000000",
        ],
      }),
    },
  },
  sprite: createSprite({
    palette: [null, "#33691e", "#fdd835", "#558b2f"],
    rows: [
      "0000033330000000",
      "0003333333000000",
      "0033331333300000",
      "0333331133330000",
      "0033333133300000",
      "0003333333000000",
      "0000033330000000",
      "0000002220000000",
      "0000002220000000",
      "0000012221000000",
      "0001112221110000",
      "0011122122110000",
      "0001122122100000",
      "0000112121100000",
      "0000011111000000",
      "0000001110000000",
    ],
  }),
};
