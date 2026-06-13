import { createSprite } from "../../engine/pixelSprite.js";

// Alpen-Frauenmantel (Alchemilla alpina). Silbrige Blattunterseite — Erkennungszeichen gegenüber Talform.
export const alpenfrauenmantel = {
  nameDe: "Alpen-Frauenmantel",
  nameLat: "Alchemilla alpina",
  schweizerdeutsch: "Älpler Frauemäntelitee",
  plate: null,
  biotope: ["alpweide"],
  sonne: "sonnig bis halbschattig",
  boden: "sauer, nährstoffarm, alpine Weiden",
  saison: {
    teil: {
      blaetter: ["sommer:1-28"],
      blueten: ["sommer:7-28"],
    },
  },
  realMonths: [7, 8, 9],
  merkmale: {
    blattform:
      "handförmig, 5–9 schmale Lappen, Unterseite silbrig-seidig (glänzend!) — unterscheidet von Tal-Frauenmantel",
    blattstellung: "grundständig, langgestielt",
    bluete: "winzig gelbgrün, in dichten Büscheln",
    geruch: "kaum wahrnehmbar",
    stengel: "niedrig, dicht behaart",
    wuchshoehe: "5–20 cm (alpin!)",
  },
  verwechslung: [
    {
      art: "frauenmantel",
      gefahr: "wirkungslos",
      unterscheidung:
        "Talfrauenmantel hat rundlichere Blätter, weniger silbrige Unterseite — Alpen-Art ist höher oben, Blätter eleganter gelappt",
    },
  ],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["tee", "trocknen"],
    wirkungTraditionell:
      "zusammenziehend, stärkend — wie Tal-Frauenmantel, aber Alpenkräuter gelten als besonders wirksam",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#607d8b", "#8bc34a", "#cddc39"],
    rows: [
      "0000000000000000",
      "0002220002220000",
      "0022322022322000",
      "0023332023332000",
      "0022332022332000",
      "0002220002220000",
      "0000210002100000",
      "0000011022100000",
      "0000001221000000",
      "0000001331000000",
      "0000001331000000",
      "0000011331100000",
      "0000111331110000",
      "0001113113111000",
      "0000111111100000",
      "0000011111000000",
    ],
  }),
};
