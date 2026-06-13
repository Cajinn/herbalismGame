import { createSprite } from "../../engine/pixelSprite.js";

// Attich / Zwergholunder (Sambucus ebulus). GIFTIG. Krautig — stirbt im Winter ab.
export const attich = {
  nameDe: "Attich / Zwergholunder",
  nameLat: "Sambucus ebulus",
  schweizerdeutsch: "Aatich",
  plate: null,
  biotope: ["waldrand", "wiese"],
  sonne: "halbschattig",
  boden: "nährstoffreich, stickstoffhaltig",
  saison: {
    teil: {
      blueten: ["sommer:7-28"],
      beeren: ["herbst:1-21"],
    },
  },
  realMonths: [7, 8, 9],
  merkmale: {
    blattform: "gefiedert wie Holunder, aber Pflanze KRAUTIG (stirbt im Winter ab)",
    blattstellung: "gegenständig gefiedert, Blättchen größer als Holunder",
    bluete: "weiß mit rötlichem Anflug, AUFRECHT stehende Rispen (Holunder: hängend-flach)",
    geruch: "unangenehm-ranzig, stärker als Holunder",
    stengel: "krautig, grün (kein Holzstamm!), unverzweigt, bis 2 m",
    wuchshoehe: "1–2 m krautig",
  },
  verwechslung: [
    {
      art: "holunder",
      gefahr: "giftig",
      unterscheidung:
        "Holunder ist Strauch/Baum mit verholztem Stamm; Attich ist krautig und stirbt im Winter ab; Blütenstand aufrecht statt flach-hängend",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell:
      "GIFTIG — alle Teile giftig (Pyrrolizidinalkaloide und Sambunigrin). Beeren schwach-toxisch. Niemals verwechseln mit Holunder!",
  },
  fundorte: 1,
  sprite: createSprite({
    palette: [null, "#1b5e20", "#e8f5e9", "#4caf50"],
    rows: [
      "0000022222000000",
      "0000222222200000",
      "0002232232220000",
      "0002222222220000",
      "0002222222220000",
      "0000222222200000",
      "0000022222000000",
      "0000001110000000",
      "0000001110000000",
      "0000011110000000",
      "0001111111100000",
      "0001111111100000",
      "0011111111110000",
      "0011111111110000",
      "0001111111100000",
      "0000011110000000",
    ],
  }),
};
