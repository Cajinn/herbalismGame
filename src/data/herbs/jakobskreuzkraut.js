import { createSprite } from "../../engine/pixelSprite.js";

// Jakobskreuzkraut (Jacobaea vulgaris). GIFTIG. Gefiederte Blätter, kein Öldrüsenpunkt.
export const jakobskreuzkraut = {
  nameDe: "Jakobskreuzkraut",
  nameLat: "Jacobaea vulgaris",
  schweizerdeutsch: "Jakobskruut",
  plate: null,
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "trocken, kalkhaltig, Magerwiesen und Wegränder",
  saison: {
    teil: {
      blueten: ["sommer:14-28", "herbst:1-28"],
    },
  },
  realMonths: [7, 8, 9, 10],
  merkmale: {
    blattform: "wechselständig, fiederteilig, Endlappen unregelmäßig gelappt — KEIN Öldrüsenpunkt",
    blattstellung: "wechselständig am Stängel, Grundblätter in Rosette",
    bluete: "gelb, strahlend, in lockeren Trugdolden — täuschend Johanniskraut-ähnlich",
    geruch: "schwach herb, KEIN aromatisch-balsamischer Geruch beim Zerreiben",
    stengel: "aufrecht, meist rötlich überlaufen, nicht geflügelt",
    wuchshoehe: "30–100 cm",
  },
  verwechslung: [
    {
      art: "johanniskraut",
      gefahr: "giftig",
      unterscheidung:
        "Johanniskraut: geflügelter Stängel, Öldrüsen in Blättern (gegen Licht!), typischer Geruch beim Zerreiben",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell:
      "GIFTIG — Pyrrolizidinalkaloide schädigen die Leber chronisch. Verwechslung mit Johanniskraut vermeiden!",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#558b2f", "#ffd600", "#ff8f00"],
    rows: [
      "0000020200200000",
      "0000222222200000",
      "0002223332220000",
      "0002233232220000",
      "0002223332220000",
      "0000222222200000",
      "0000020200200000",
      "0000001100000000",
      "0000001100000000",
      "0000011110000000",
      "0001011110010000",
      "0001111111100000",
      "0001111111100000",
      "0000111111100000",
      "0000011110000000",
      "0000001100000000",
    ],
  }),
};
