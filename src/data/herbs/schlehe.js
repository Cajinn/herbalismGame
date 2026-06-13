import { createSprite } from "../../engine/pixelSprite.js";

// Schlehe (Prunus spinosa). Weiße Blüten vor dem Blattaustrieb, herbsaure Früchte.
export const schlehe = {
  nameDe: "Schlehe",
  nameLat: "Prunus spinosa",
  schweizerdeutsch: "Schleeche",
  plate: "prunus-spinosa.jpg",
  biotope: ["waldrand"],
  sonne: "sonnig",
  boden: "trocken, kalkhaltig, Hecken und Waldränder",
  saison: {
    teil: {
      blueten: ["fruehling:1-14"],
      frucht: ["herbst:14-28", "winter:1-14"],
    },
  },
  realMonths: [3, 4, 10, 11],
  merkmale: {
    blattform: "klein, elliptisch, gesägt — erscheinen NACH den Blüten",
    blattstellung: "wechselständig, sehr starke Dornen",
    bluete: "weiß, einzeln, VOR dem Blattaustrieb — schwarzer Strauch in weißer Blüte (Frühjahr)",
    geruch: "Blüten schwach mandelartig; Früchte herb-sauer",
    stengel: "schwarzbraun, sehr dicht bestachelt — undurchdringliches Dickicht",
    wuchshoehe: "1–3 m Strauch",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    frucht: ["trocknen", "tinktur"],
    blueten: ["tee", "trocknen"],
    wirkungTraditionell:
      "Früchte (nach Frost!) adstringierend, bei Durchfall; Blüten mildlaxativ; Schlehenlikör — traditionell volksmedizinisch",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#37474f", "#4a148c", "#7b1fa2"],
    rows: [
      "0000000000000000",
      "0000022000220000",
      "0000222002220000",
      "0002222222220000",
      "0002232322220000",
      "0002222222200000",
      "0000022002200000",
      "0000001100000000",
      "0000001110000000",
      "0000001110000000",
      "0001001110010000",
      "0001111111100000",
      "0001111111100000",
      "0001111111110000",
      "0000111111100000",
      "0000001100000000",
    ],
  }),
};
