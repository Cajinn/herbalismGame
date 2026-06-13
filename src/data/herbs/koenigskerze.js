import { createSprite } from "../../engine/pixelSprite.js";

// Königskerze (Verbascum thapsus). Hohe Blütenähre, wollig-filzige Blätter.
export const koenigskerze = {
  nameDe: "Königskerze",
  nameLat: "Verbascum thapsus",
  schweizerdeutsch: "Wullchruut",
  plate: "verbascum-thapsus.jpg",
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "trocken, kiesig, Böschungen und Kiesgruben",
  saison: {
    teil: {
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform:
      "grundständig: sehr groß, filzig-weich behaart (wie Tuch), lanzettlich; Stängelblätter herablaufend",
    blattstellung:
      "grundständige Rosette im 1. Jahr, im 2. Jahr aufrechter Blütenschaft",
    bluete: "gelb, 5 Blütenblätter, einzeln öffnend auf hoher Ähre — jeden Tag nur wenige",
    geruch: "schwach süßlich-honigig",
    stengel: "aufrecht, kantig, weich wollig behaart, sehr fest",
    wuchshoehe: "50–200 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "trocknen"],
    wirkungTraditionell:
      "schleimlösend, reizlindernd — bei Husten und Bronchitis, Tee täglich frisch bereiten (Blüten nicht lagern)",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#78909c", "#fdd835", "#f9a825"],
    rows: [
      "0000002200000000",
      "0000022220000000",
      "0000023320000000",
      "0000022220000000",
      "0000002200000000",
      "0000002200000000",
      "0000002200000000",
      "0000002200000000",
      "0001112211110000",
      "0001112211110000",
      "0001111111110000",
      "0001111111110000",
      "0011111111111000",
      "0011111111111000",
      "0001111111110000",
      "0000111111100000",
    ],
  }),
};
