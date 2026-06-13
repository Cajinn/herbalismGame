import { createSprite } from "../../engine/pixelSprite.js";

// Roter Fingerhut (Digitalis purpurea). TÖDLICH GIFTIG. Verwechslung mit Beinwell-Rosette gefährlich.
export const roterfingerhut = {
  nameDe: "Roter Fingerhut",
  nameLat: "Digitalis purpurea",
  schweizerdeutsch: "Fingerhüetli",
  plate: null,
  biotope: ["waldrand", "bachufer"],
  sonne: "halbschattig",
  boden: "sauer, nährstoffarm bis mäßig, Waldlichtungen",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28", "sommer:1-14"],
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform:
      "ovale Grundrosette, runzlig, graugrün, weich behaart — täuschend ähnlich Beinwell, aber OHNE Stängelflügel",
    blattstellung:
      "grundständige Rosette im 1. Jahr, Stängelblätter wechselständig",
    bluete:
      "einseitswendig, große glockenförmige Röhren, rosa-lila mit dunklen Innenflecken — unverwechselbar in Blüte",
    geruch: "kaum wahrnehmbar, leicht bitter",
    stengel: "aufrecht, nicht geflügelt (im Ggs. zu Beinwell!), behaart",
    wuchshoehe: "50–150 cm",
  },
  verwechslung: [
    {
      art: "beinwell",
      gefahr: "toedlich",
      unterscheidung:
        "Beinwell: geflügelter Stängel, raue Blätter; Beinwell-Rosette im Frühjahr ähnelt Fingerhut-Rosette. Bei Fingerhut: Blüten klar einseitswendig-glockenförmig und rosa mit Flecken",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell:
      "TOEDLICH GIFTIG — Digitalisglykoside: Herzgift. Wurde historisch als Herzmedikament genutzt, aber NUR unter ärztlicher Kontrolle. Nicht anfassen!",
  },
  fundorte: 1,
  sprite: createSprite({
    palette: [null, "#558b2f", "#e53935", "#ef9a9a"],
    rows: [
      "0000000200000000",
      "0000002220000000",
      "0000022322000000",
      "0000023332000000",
      "0000022322000000",
      "0000002220000000",
      "0000000200000000",
      "0000002200000000",
      "0000022200000000",
      "0000022200000000",
      "0000001100000000",
      "0000001110000000",
      "0001001110100000",
      "0011111111110000",
      "0011111111110000",
      "0000111111100000",
    ],
  }),
};
