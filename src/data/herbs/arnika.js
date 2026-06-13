import { createSprite } from "../../engine/pixelSprite.js";

// Arnika (Arnica montana). Geschützt! Nur kultivierte Ware verwenden. NUR äußerlich.
export const arnika = {
  nameDe: "Arnika",
  nameLat: "Arnica montana",
  schweizerdeutsch: "Wolfsblüemli",
  plate: "arnica-montana.jpg",
  biotope: ["alpweide"],
  sonne: "sonnig",
  boden: "sauer, nährstoffarm, Alpweiden und Magerrasen",
  saison: {
    teil: {
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform:
      "grundständige Rosette, oval, leicht behaart; Stängelblätter gegenständig, kleiner",
    blattstellung:
      "grundständige Rosette + 1–2 Paar gegenständige Stängelblätter",
    bluete:
      "leuchtend orangegelb, Strahlenblüten, ein einzelner Köpfchen pro Stängel — unverwechselbar",
    geruch: "aromatisch-würzig, schwach harzig",
    stengel: "aufrecht, meist unverzweigt, drüsig behaart",
    wuchshoehe: "15–50 cm",
  },
  verwechslung: [],
  geschuetzt: true,
  kultivierbar: true,
  verwendung: {
    blueten: ["tinktur", "oelauszug", "trocknen"],
    wirkungTraditionell:
      "entzündungshemmend, durchblutungsfördernd — äußerlich (!) bei Prellungen, Muskelverspannungen. Nie auf offene Wunden! NICHT innerlich!",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#558b2f", "#ff8f00", "#ffd54f"],
    rows: [
      "0000003330000000",
      "0000033333000000",
      "0000333233300000",
      "0003332223300000",
      "0003332223300000",
      "0000333233300000",
      "0000033333000000",
      "0000003330000000",
      "0000002200000000",
      "0000002200000000",
      "0001002200100000",
      "0011111111100000",
      "0011112211100000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
    ],
  }),
};
