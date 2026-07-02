import { createSprite } from "../../engine/pixelSprite.js";

// Kurkuma (Curcuma longa) — exotisches Gewürzrhizom, wächst nicht in der
// Schweiz. Dient als Rezeptanker für die Goldene Milch (M6-Stretch:
// exotische Hausmittel). Keine Spawns, kein fundorte — nur im Dorfladen.
export const kurkuma = {
  nameDe: "Kurkuma",
  nameLat: "Curcuma longa",
  schweizerdeutsch: "Gälwurz",
  plate: null,
  biotope: [],
  sonne: "tropisch, schattig bis halbschattig",
  boden: "feucht, nährstoffreich",
  saison: { teil: {} },
  realMonths: [],
  merkmale: {
    blattform: "lang-lanzettlich, bananenblattähnlich",
    blattstellung: "grundständig, in Büscheln",
    bluete: "gelb-weiß, in dichten Ähren versteckt",
    geruch: "erdig-scharf, leicht bitter",
    stengel: "kein oberirdischer Stängel — Blattscheiden bilden Scheinstamm",
    wuchshoehe: "60–100 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wurzel: ["hausmittel"],
    wirkungTraditionell: "entzündungshemmend, wärmend — Basis der Goldenen Milch, einem beliebten Hausmittel bei Erkältung und Gelenkschmerzen",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#f9a825", "#e65100", "#fff176"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000001111000000",
      "0000012222100000",
      "0000122222210000",
      "0001222222221000",
      "0001222222221000",
      "0000122222210000",
      "0000012222100000",
      "0000001111000000",
      "0000000330000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
  }),
};
