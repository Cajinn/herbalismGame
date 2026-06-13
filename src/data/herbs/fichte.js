import { createSprite } from "../../engine/pixelSprite.js";

// Fichte Maitriebe (Picea abies). Nur junge, noch weiche Triebspitzen im Mai ernten.
export const fichte = {
  nameDe: "Fichte (Maitriebe)",
  nameLat: "Picea abies",
  schweizerdeutsch: "Rotfichten Maitrieb",
  plate: null,
  biotope: ["wald"],
  sonne: "halbschattig bis schattig",
  boden: "sauer, feucht, bergisch",
  saison: {
    teil: {
      triebe: ["fruehling:7-21"],
    },
  },
  realMonths: [5],
  merkmale: {
    blattform: "junge Triebe hellgrün, weich, noch nicht verhärtet (NUR diese!), nadelförmig",
    blattstellung: "spiralig um den Trieb",
    bluete: "Zapfen (nicht geerntet)",
    geruch: "frisch-harzig, typisch Nadelbaum, belebend",
    stengel: "Nadelbaum, Borke orangebraun",
    wuchshoehe: "20–50 m Baum (nur Jungtriebe: 3–5 cm)",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    triebe: ["sirup", "tee"],
    wirkungTraditionell:
      "Maitriebe reich an Vitamin C und ätherischen Ölen — Fichtensirup (Maitriebsirup) traditionelles Schweizer Erkältungsmittel",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#1a5c1a", "#7cb342", "#dcedc8"],
    rows: [
      "0000000200000000",
      "0000002220000000",
      "0000022323000000",
      "0000223232000000",
      "0000023232300000",
      "0000002222000000",
      "0000001110000000",
      "0000001110000000",
      "0001101110110000",
      "0001111111110000",
      "0011111111111000",
      "0011111111111000",
      "0001111111110000",
      "0001111111110000",
      "0000111111100000",
      "0000011111000000",
    ],
  }),
};
