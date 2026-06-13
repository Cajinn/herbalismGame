import { createSprite } from "../../engine/pixelSprite.js";

// Johanniskraut (Hypericum perforatum). Geflügelter Stängel — wichtigstes Merkmal.
export const johanniskraut = {
  nameDe: "Johanniskraut",
  nameLat: "Hypericum perforatum",
  schweizerdeutsch: "Johanniskrut",
  plate: "hypericum-perforatum.jpg",
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "trocken bis mäßig feucht, kalkhaltig",
  saison: {
    teil: {
      blaetter: ["sommer:1-28"],
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform: "gegenständig, länglich-oval, mit durchscheinenden Öldrüsen (gegen Licht halten!)",
    blattstellung: "kreuzgegenständig, sitzend am Stängel",
    bluete: "leuchtend gelb, 5 Blütenblätter mit schwarzen Randpunkten, büschelig",
    geruch: "beim Zerreiben schwach balsamisch, Öl rotviolett (Rotöl!)",
    stengel: "zweizeilig geflügelt — wichtigstes Bestimmungsmerkmal",
    wuchshoehe: "30–80 cm",
  },
  verwechslung: [
    {
      art: "jakobskreuzkraut",
      gefahr: "giftig",
      unterscheidung:
        "Jakobskreuzkraut hat gefiederte Blätter, KEINE durchscheinenden Ölpunkte, Stängel nicht geflügelt",
    },
  ],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["oelauszug"],
    blueten: ["oelauszug", "tinktur"],
    wirkungTraditionell:
      "traditionell bei leichten Depressionen, Nervenschmerzen (Rotöl äußerlich bei Muskelverspannungen und Sonnenbrand)",
  },
  fundorte: 4,
  sprite: createSprite({
    palette: [null, "#558b2f", "#fdd835", "#e65100"],
    rows: [
      "0000020200200000",
      "0000222222200000",
      "0002222232220000",
      "0002223332220000",
      "0002222232220000",
      "0000222222200000",
      "0000022022000000",
      "0000001100000000",
      "0000011110000000",
      "0000011110000000",
      "0000011110000000",
      "0001011110100000",
      "0001111111100000",
      "0000111111100000",
      "0000011111000000",
      "0000001110000000",
    ],
  }),
};
