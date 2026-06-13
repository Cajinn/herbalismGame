import { createSprite } from "../../engine/pixelSprite.js";

// Gelber Enzian (Gentiana lutea). National geschützt! Prächtige Alpenpflanze — wild stehen lassen.
export const gelberEnzian = {
  nameDe: "Gelber Enzian",
  nameLat: "Gentiana lutea",
  schweizerdeutsch: "Bitterroot / Enziane",
  plate: "gentiana-lutea.jpg",
  biotope: ["alpweide"],
  sonne: "sonnig",
  boden: "kalkreich, tief, Alpweiden und steinige Hänge",
  saison: {
    teil: {
      blueten: ["sommer:14-28"],
    },
  },
  realMonths: [7, 8],
  merkmale: {
    blattform:
      "groß, oval-elliptisch, graugrün, 5–7 parallele Blattnerven — unverwechselbare Blattstruktur",
    blattstellung: "kreuzgegenständig, Grundblätter sehr groß bis 30 cm",
    bluete:
      "leuchtend gelb, 5–9 sternförmige Blütenblätter, in dichten Quirlen am Stängel",
    geruch: "sehr bitter, Geruch schwach",
    stengel:
      "aufrecht, hohl, sehr kräftig, bis 5 cm Ø — Jahrhundertpflanze!",
    wuchshoehe: "50–140 cm",
  },
  verwechslung: [],
  geschuetzt: true,
  kultivierbar: false,
  verwendung: {
    wurzel: ["tinktur"],
    blueten: ["tee"],
    wirkungTraditionell:
      "bitteres Magenmittel (Bitterstoff Gentiopicrin) — Enzianschnaps aus der kultivierten Wurzel traditionell; wild stehen lassen! Getrocknete Wurzel im Dorfladen erhältlich",
  },
  fundorte: 1,
  sprite: createSprite({
    palette: [null, "#558b2f", "#fbc02d", "#f9a825"],
    rows: [
      "0000023232000000",
      "0000232232000000",
      "0002323232000000",
      "0002323332000000",
      "0002323232000000",
      "0000232232000000",
      "0000023232000000",
      "0000001110000000",
      "0000011110000000",
      "0011011110000000",
      "0011111110000000",
      "0011111111100000",
      "0001111111100000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
    ],
  }),
};
