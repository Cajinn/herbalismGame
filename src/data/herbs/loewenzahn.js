import { createSprite } from "../../engine/pixelSprite.js";

// Löwenzahn (Taraxacum officinale).
export const loewenzahn = {
  nameDe: "Löwenzahn",
  nameLat: "Taraxacum officinale",
  schweizerdeutsch: "Chrottepösch",
  plate: "taraxacum-officinale.jpg",
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "nährstoffreich, verträgt fast alles",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28", "sommer:1-28"],
      blueten: ["fruehling:8-28", "sommer:1-28"],
    },
  },
  realMonths: [4, 5, 6, 7, 8, 9],
  merkmale: {
    blattform: "tief gezähnt (löwenzahnartig gebuchtet), in grundständiger Rosette",
    blattstellung: "Rosette direkt aus der Wurzel, keine Stängelblätter",
    bluete: "leuchtend gelbe Zungenblütenköpfe, einzeln auf hohlem Stängel",
    geruch: "milchig-herb beim Anbrechen (Milchsaft)",
    stengel: "hohler, milchsaftführender Stängel",
    wuchshoehe: "10-30 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blaetter: ["kueche", "tee"],
    wurzel: ["tinktur"],
    wirkungTraditionell: "traditionell verdauungsfördernd, leicht harntreibend (Bettseicher)",
  },
  fundorte: 4,
  sprite: createSprite({
    palette: [null, "#558b2f", "#fdd835", "#f9a825"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000020000000",
      "0000002222200000",
      "0000002232200000",
      "0000022333220000",
      "0000002232200000",
      "0000002222200000",
      "0000000121000000",
      "0000000111000000",
      "0000000111000000",
      "0001000111000100",
      "0001110111011100",
      "0000111111111000",
      "0000011111110000",
      "0000001111100000",
    ],
  }),
};
