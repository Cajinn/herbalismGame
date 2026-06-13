import { createSprite } from "../../engine/pixelSprite.js";

// Echte Kamille (Matricaria chamomilla) — garden-only cultivar.
export const kamille = {
  nameDe: "Echte Kamille",
  nameLat: "Matricaria chamomilla",
  schweizerdeutsch: "Chamillen",
  plate: "matricaria-chamomilla.jpg",
  biotope: ["garten"],
  sonne: "sonnig bis halbschattig",
  boden: "locker, sandig-lehmig, nicht zu feucht",
  saison: {
    teil: {
      blueten: ["sommer:1-28", "fruehling:20-28"],
    },
  },
  realMonths: [5, 6, 7, 8],
  merkmale: {
    blattform: "zwei- bis dreifach fiederteilig, sehr fein zerschlitzt",
    blattstellung: "wechselständig, zart und licht",
    bluete: "weisse Zungenblüten klappen zurück; Blütenboden hohl (Erkennungsmerkmal!)",
    geruch: "intensiv apfelartig-aromatisch beim Zerreiben",
    stengel: "verzweigt, aufrecht, kahl",
    wuchshoehe: "20–50 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "oelauszug"],
    wirkungTraditionell: "krampflösend, entzündungshemmend, beruhigend — bei Magen-Darm-Beschwerden",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#558b2f", "#fafafa", "#fdd835"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000200000000",
      "0000002220000000",
      "0000022320000000",
      "0000022320000000",
      "0000002220000000",
      "0000000200000000",
      "0000000110000000",
      "0000000111000000",
      "0000000111000000",
      "0000100111001000",
      "0001111111110000",
      "0000111111110000",
      "0000011111100000",
      "0000001111000000",
    ],
  }),
};
