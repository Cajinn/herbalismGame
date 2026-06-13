import { createSprite } from "../../engine/pixelSprite.js";

// Beinwell (Symphytum officinale). Geflügelter Stängel, raue Blätter — Verwechslung mit Fingerhut möglich!
export const beinwell = {
  nameDe: "Beinwell",
  nameLat: "Symphytum officinale",
  schweizerdeutsch: "Schwarzwurzel",
  plate: "symphytum-officinale.jpg",
  biotope: ["bachufer"],
  sonne: "halbschattig",
  boden: "feucht, nährstoffreich, Bachufer und Gräben",
  saison: {
    teil: {
      blaetter: ["fruehling:14-28", "sommer:1-28"],
      blueten: ["sommer:1-14"],
      wurzel: ["fruehling:1-14", "herbst:14-28"],
    },
  },
  realMonths: [5, 6, 7, 8],
  merkmale: {
    blattform:
      "sehr groß, lanzettlich, rau-borstig behaart, am Stängel herablaufend (geflügelter Stängel)",
    blattstellung:
      "wechselständig, die unteren sehr groß (bis 30 cm), stark rau",
    bluete:
      "röhrenförmig, hängend, violett bis gelblichweiß — Hummeln bevorzugt",
    geruch: "kaum wahrnehmbar, leicht saponinartig",
    stengel: "aufrecht, markant geflügelt-herablaufend, borstig behaart",
    wuchshoehe: "30–100 cm",
  },
  verwechslung: [
    {
      art: "roterfingerhut",
      gefahr: "toedlich",
      unterscheidung:
        "Fingerhut: Blätter weicher, ovaler, nicht herablaufend; Blüten einseitswendig-glockenförmig, rosa-lila mit Innenflecken; KEIN herablaufender Stängel",
    },
  ],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blaetter: ["wickel", "trocknen"],
    wurzel: ["wickel"],
    wirkungTraditionell:
      "entzündungshemmend, heilungsfördernd (Allantoin) — äußerlich bei Prellungen, Verstauchungen, Knochenbrüchen; Wurzel NUR äußerlich (Pyrrolizidinalkaloide!)",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#558b2f", "#7b1fa2", "#ce93d8"],
    rows: [
      "0000000000000000",
      "0011100000111000",
      "0111100001111000",
      "0111100001111100",
      "0011100001111100",
      "0000100001110100",
      "0000100000000100",
      "0000023300000000",
      "0000233320000000",
      "0000233320000000",
      "0000023300000000",
      "0000001100000000",
      "0001111111100000",
      "0001111111100000",
      "0000011111000000",
      "0000001110000000",
    ],
  }),
};
