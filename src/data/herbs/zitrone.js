import { createSprite } from "../../engine/pixelSprite.js";

// Zitrone (Citrus limon) — Küchenzutat, nicht in der Schweiz wild wachsend.
// Im Dorfladen erhältlich als Unterstützung bei Erkältungen.
export const zitrone = {
  nameDe: "Zitrone",
  nameLat: "Citrus limon",
  schweizerdeutsch: "Zitroone",
  plate: null,
  biotope: [],
  sonne: "sonnig",
  boden: "durchlässig, warm",
  saison: { teil: {} },
  realMonths: [],
  merkmale: {
    blattform: "oval, glänzend, leicht gezähnt",
    blattstellung: "wechselständig",
    bluete: "weiß mit violettem Anflug, stark duftend",
    geruch: "frisch-zitronig, belebend",
    stengel: "kleine Dornen am Trieb",
    wuchshoehe: "2–4 m (Strauch/Baum)",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    frucht: ["tee", "hausmittel"],
    wirkungTraditionell: "reich an Vitamin C, antiseptisch — bei Erkältung und Halsschmerzen als Heißgetränk",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#f9a825", "#fdd835", "#fff176"],
    rows: [
      "0000000000000000",
      "0000001000000000",
      "0000001000000000",
      "0000011110000000",
      "0000122221000000",
      "0001222222100000",
      "0001222322100000",
      "0001222222100000",
      "0000122221000000",
      "0000011110000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
  }),
};
