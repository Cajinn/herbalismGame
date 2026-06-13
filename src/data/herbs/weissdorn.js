import { createSprite } from "../../engine/pixelSprite.js";

// Weissdorn (Crataegus monogyna). Herztonikum, sehr harte Dornen.
export const weissdorn = {
  nameDe: "Weissdorn",
  nameLat: "Crataegus monogyna",
  schweizerdeutsch: "Hagedorn",
  plate: "crataegus-monogyna.jpg",
  biotope: ["waldrand"],
  sonne: "sonnig bis halbschattig",
  boden: "kalkhaltig, gut drainiert, Hecken",
  saison: {
    teil: {
      blueten: ["fruehling:14-28", "sommer:1-7"],
      frucht: ["herbst:7-28"],
    },
  },
  realMonths: [5, 6, 9, 10],
  merkmale: {
    blattform: "tief 3–5 lappig, glänzend, keilförmig",
    blattstellung: "wechselständig, stark bestachelt",
    bluete: "weiß, 5 Blütenblätter, in dichten Dolden, leicht unangenehmer Geruch",
    geruch: "Blüten leicht fischig; Früchte kaum Geruch",
    stengel: "graubraun, sehr harte Dornen — Blutungsschnitt!",
    wuchshoehe: "2–6 m Strauch/kleiner Baum",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "trocknen"],
    frucht: ["tee", "trocknen"],
    wirkungTraditionell:
      "Herztonikum — traditionell bei Herzinsuffizienz und Bluthochdruck (Blüten + Blätter); keine Selbstbehandlung bei echten Herzproblemen!",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#558b2f", "#ffffff", "#c62828"],
    rows: [
      "0002222222000000",
      "0022222222200000",
      "0022323232200000",
      "0022222222200000",
      "0002222222000000",
      "0000222222000000",
      "0000001100000000",
      "0000001100000000",
      "0001011110010000",
      "0001311110310000",
      "0001111111100000",
      "0001111111100000",
      "0011111111110000",
      "0011111111110000",
      "0001111111100000",
      "0000111111000000",
    ],
  }),
};
