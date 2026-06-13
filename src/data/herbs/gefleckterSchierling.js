import { createSprite } from "../../engine/pixelSprite.js";

// Gefleckter Schierling (Conium maculatum). TÖDLICH GIFTIG. Violette Flecken am Stängel.
export const gefleckterSchierling = {
  nameDe: "Gefleckter Schierling",
  nameLat: "Conium maculatum",
  schweizerdeutsch: "Giftlich",
  plate: null,
  biotope: ["wiese", "waldrand"],
  sonne: "halbschattig bis sonnig",
  boden: "nährstoffreich, stickstoffhaltig, Wegränder",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28", "sommer:1-14"],
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [5, 6, 7, 8],
  merkmale: {
    blattform:
      "doppelt bis dreifach gefiedert, weich, hellgrün — täuschend ähnlich wie Giersch oder Wilde Möhre",
    blattstellung: "wechselständig, Blattstiele RUND, nicht dreikantig",
    bluete: "weiß, in zusammengesetzten Dolden — äußerlich Giersch ähnlich",
    geruch: "mausartig-stinkend beim Zerreiben — DER entscheidende Unterschied",
    stengel: "rund, hohl, kahl, mit violetten FLECKEN — absolutes Erkennungszeichen",
    wuchshoehe: "50–200 cm",
  },
  verwechslung: [
    {
      art: "giersch",
      gefahr: "toedlich",
      unterscheidung:
        "Giersch hat dreikantigen Stängel, angenehm-aromatischen Geruch, KEINE Flecken",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell:
      "TOEDLICH GIFTIG — alle Teile giftig. Sokrates wurde damit hingerichtet. NIEMALS essen oder auch nur anfassen ohne Handschuhe.",
  },
  fundorte: 1,
  sprite: createSprite({
    palette: [null, "#4a148c", "#f5f5f5", "#e53935"],
    rows: [
      "0000022200000000",
      "0000222222000000",
      "0002222222200000",
      "0002222222200000",
      "0002222222200000",
      "0000222222000000",
      "0000022200000000",
      "0000001300000000",
      "0000001130000000",
      "0000001300000000",
      "0000001130000000",
      "0000001300000000",
      "0001001130100000",
      "0001111111100000",
      "0001111111100000",
      "0000111111000000",
    ],
  }),
};
