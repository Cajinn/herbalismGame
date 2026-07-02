import { createSprite } from "../../engine/pixelSprite.js";

// Ingwer (Zingiber officinale) — exotisches Gewürzrhizom, wächst nicht in
// der Schweiz. Dient als Rezeptanker für Ingwertee (M6-Stretch: exotische
// Hausmittel). Keine Spawns, kein fundorte — nur im Dorfladen.
export const ingwer = {
  nameDe: "Ingwer",
  nameLat: "Zingiber officinale",
  schweizerdeutsch: "Ingwer",
  plate: null,
  biotope: [],
  sonne: "tropisch, halbschattig",
  boden: "feucht, locker, humusreich",
  saison: { teil: {} },
  realMonths: [],
  merkmale: {
    blattform: "schmal-lanzettlich, schilfartig",
    blattstellung: "zweizeilig wechselständig",
    bluete: "gelb-violett, selten in Kultur blühend",
    geruch: "scharf-würzig, zitronig-frisch",
    stengel: "schilfartiger Scheinstamm aus Blattscheiden",
    wuchshoehe: "60–90 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wurzel: ["tee"],
    wirkungTraditionell: "wärmend, verdauungsfördernd, gegen Übelkeit — klassischer Ingwertee bei Erkältung und Magenbeschwerden",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#d7ccc8", "#a1887f", "#efebe9"],
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000011000110000",
      "0000122112211000",
      "0001222222221000",
      "0011222222222100",
      "0011222222222100",
      "0001222222221000",
      "0000122112211000",
      "0000011000110000",
      "0000000330000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
  }),
};
