import { createSprite } from "../../engine/pixelSprite.js";

// Pestwurz (Petasites hybridus). Riesige Blätter erscheinen nach den Blüten.
export const pestwurz = {
  nameDe: "Pestwurz",
  nameLat: "Petasites hybridus",
  schweizerdeutsch: "Pestwurz",
  plate: null,
  biotope: ["waldrand", "bachufer"],
  sonne: "halbschattig",
  boden: "feucht, nährstoffreich, Bachufer",
  saison: {
    teil: {
      blueten: ["fruehling:1-14"],
      blaetter: ["fruehling:14-28", "sommer:1-14"],
    },
  },
  realMonths: [3, 4, 5, 6],
  merkmale: {
    blattform:
      "Blätter werden ENORM groß (bis 60 cm Ø!) — herzförmig, unterseits graufilzig. Erscheinen NACH den Blüten",
    blattstellung: "grundständig, sehr langgestielt, bilden große Kolonien",
    bluete: "rötlich-violett, erscheinen VOR den Blättern (wie Huflattich) — kurze gedrungene Rispe",
    geruch: "Blätter leicht aromatisch-würzig",
    stengel: "beschuppt wie Huflattich-Stängel (aber viel dicker)",
    wuchshoehe: "Blätter: 30–60 cm; Blüten: 10–30 cm",
  },
  verwechslung: [
    {
      art: "huflattich",
      gefahr: "giftig",
      unterscheidung:
        "Huflattich: viel kleiner, Blüten leuchtend gelb (nicht rötlich), Blätter erst 10–20 cm. Pestwurz enthält Pyrrolizidinalkaloide — vorsichtig!",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blaetter: ["tee"],
    wirkungTraditionell:
      "Enthält Pyrrolizidinalkaloide — nur pyrrolizidinalkaloidfreie Extrakte verwenden! Migräne-Prophylaxe in der modernen Phytotherapie (Butterbur).",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#1b5e20", "#81c784", "#c2185b"],
    rows: [
      "0000003330000000",
      "0000033333000000",
      "0000333333300000",
      "0000333333300000",
      "0000033333000000",
      "0000003330000000",
      "0000001110000000",
      "0000001110000000",
      "0002211111220000",
      "0022211111222000",
      "0022111111122000",
      "0021111111112000",
      "0022111111122000",
      "0022111111122000",
      "0002211111220000",
      "0000011111000000",
    ],
  }),
};
