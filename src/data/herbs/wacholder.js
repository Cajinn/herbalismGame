import { createSprite } from "../../engine/pixelSprite.js";

// Wacholder (Juniperus communis). Immergrüner Nadelstrauch, Beeren brauchen 2 Jahre! Gin-Aroma.
export const wacholder = {
  nameDe: "Wacholder",
  nameLat: "Juniperus communis",
  schweizerdeutsch: "Wacholdere",
  plate: "juniperus-communis.jpg",
  biotope: ["alpweide", "waldrand"],
  sonne: "sonnig",
  boden: "trocken, kalkhaltig, Magerrasen und Alpen",
  saison: {
    teil: {
      beeren: ["herbst:1-28", "winter:1-14"],
    },
  },
  realMonths: [9, 10, 11],
  merkmale: {
    blattform:
      "nadelförmig, starr stechend, graugrün mit weißer Oberseite (Wachsstreif)",
    blattstellung: "zu dritt wirtelig",
    bluete: "kleine Kätzchen (nicht geerntet)",
    geruch: "Beeren intensiv-harzig-würzig beim Zerdrücken — Gin-Geruch!",
    stengel: "immergrüner Nadelstrauch, braune Borke schuppig",
    wuchshoehe: "1–6 m Strauch",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    beeren: ["tinktur", "trocknen"],
    wirkungTraditionell:
      "harntreibend, verdauungsfördernd, antiseptisch — Wacholderbeeren (2 Jahre reifen!) als Gewürz und Tinktur, vorsichtig bei Nierenproblemen. Gin-Ingredienz!",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#37474f", "#0288d1", "#01579b"],
    rows: [
      "0001111111100000",
      "0011111111110000",
      "0011121121110000",
      "0111222222111000",
      "0111222222111000",
      "0011222112110000",
      "0011121121110000",
      "0011111111110000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
      "0000011110000000",
      "0000011110000000",
      "0000011110000000",
      "0000011110000000",
      "0000001100000000",
    ],
  }),
};
