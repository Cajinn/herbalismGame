import { createSprite } from "../../engine/pixelSprite.js";

// Hundspetersilie (Aethusa cynapium). GIFTIG. Stinkend, glänzende Blätter — täuschend ähnlich Petersilie.
export const hundspetersilie = {
  nameDe: "Hundspetersilie",
  nameLat: "Aethusa cynapium",
  schweizerdeutsch: "Hundspetersili",
  plate: null,
  biotope: ["dorf", "wiese"],
  sonne: "halbschattig",
  boden: "nährstoffreich, stickstoffhaltig, Gärten und Mist",
  saison: {
    teil: {
      blaetter: ["sommer:1-28"],
      blueten: ["sommer:7-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform:
      "doppelt gefiedert, glänzend, dunkelgrün — täuschend ähnlich Petersilie oder Giersch",
    blattstellung: "wechselständig, kahl und glänzend (Petersilie: matt)",
    bluete:
      "weiß, in zusammengesetzten Dolden — drei lange Hüllblättchen hängen einseitig herunter (Schlüsselmerkmal!)",
    geruch: "widerlich-stinkend beim Zerreiben — KEIN Petersiliengeruch",
    stengel: "hohl, glänzend, kahl, mit feinen Rippen",
    wuchshoehe: "20–60 cm",
  },
  verwechslung: [
    {
      art: "giersch",
      gefahr: "giftig",
      unterscheidung:
        "Giersch riecht angenehm-aromatisch; Hundspetersilie: stinkend. Giersch: Stängel dreikantig; Hundspetersilie: rund-hohl. Immer riechen!",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell:
      "GIFTIG — Coniin (ähnlich Schierling). Vergiftung: Schwindel, Erbrechen, Lähmungen. Täuschende Ähnlichkeit zur Petersilie ist heimtückisch.",
  },
  fundorte: 1,
  sprite: createSprite({
    palette: [null, "#2e7d32", "#ffffff", "#9e9d24"],
    rows: [
      "0000022200000000",
      "0000222222000000",
      "0002222222200000",
      "0002222222200000",
      "0002222222200000",
      "0000222222000000",
      "0000022200000000",
      "0000001300000000",
      "0000001330000000",
      "0000001300000000",
      "0000001330000000",
      "0000001300000000",
      "0001001330100000",
      "0001111111100000",
      "0001111111100000",
      "0000111111000000",
    ],
  }),
};
