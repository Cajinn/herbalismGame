import { createSprite } from "../../engine/pixelSprite.js";

// Herbstzeitlose (Colchicum autumnale). Tödlicher Bärlauch-Lookalike — PLAN.md §7.
export const herbstzeitlose = {
  nameDe: "Herbstzeitlose",
  nameLat: "Colchicum autumnale",
  schweizerdeutsch: "Nackti Jumpfere",
  plate: "colchicum-autumnale.jpg",
  biotope: ["wald"],
  sonne: "halbschattig",
  boden: "feucht, nährstoffreich",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28"],
      blueten: ["herbst:1-21"],
    },
  },
  realMonths: [3, 4, 5, 8, 9, 10],
  merkmale: {
    blattform: "länglich-lanzettlich, glänzend, steif aufrecht, ohne Stiel",
    blattstellung: "Blätter umfassen den Stängel scheidenartig, mehrere Blätter pro Trieb",
    bluete:
      "im Frühling KEINE Blüte sichtbar (Blüten erscheinen erst im Herbst, ohne Blätter)",
    geruch: "kein Knoblauchgeruch — völlig geruchlos",
    stengel: "kein dreikantiger Stängel — Blätter direkt aus einer festen Scheide",
    wuchshoehe: "15-30 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell: "tödlich giftig (Colchicin) — keine Anwendung, stehen lassen",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#1b5e20", null, "#6d4c41"],
    rows: [
      "0000000000000000",
      "0000001010100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000001111100000",
      "0000003333300000",
      "0000033333330000",
    ],
  }),
};
