import { createSprite } from "../../engine/pixelSprite.js";

// Hagebutte / Hundsrose (Rosa canina). Rote Hüftfrüchte, reich an Vitamin C.
export const hagebutte = {
  nameDe: "Hagebutte / Hundsrose",
  nameLat: "Rosa canina",
  schweizerdeutsch: "Hagebutte",
  plate: "rosa-canina.jpg",
  biotope: ["waldrand"],
  sonne: "sonnig",
  boden: "trocken bis frisch, kalkhaltig, Hecken",
  saison: {
    teil: {
      frucht: ["herbst:1-28", "winter:1-14"],
    },
  },
  realMonths: [9, 10, 11],
  merkmale: {
    blattform: "unpaarig gefiedert, 5–7 Blättchen, Rand gesägt",
    blattstellung: "wechselständig, Stacheln am Stängel",
    bluete: "rosa, 5 Blütenblätter (Blüte im Sommer, nicht geerntet)",
    geruch: "Früchte kaum Geruch, leicht fruchtig",
    stengel: "bogig, stark bestachelt — Heckenpflanze",
    wuchshoehe: "1–3 m Strauch",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    frucht: ["tee", "trocknen"],
    wirkungTraditionell:
      "sehr reich an Vitamin C und Antioxidantien — Hagebuttentee bei Erkältungen, Immunstärkung; Schale der Frucht verwenden (Kerne entfernen — Juckreiz!)",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#33691e", "#c62828", "#ef9a9a"],
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
      "0000011110100000",
      "0000111111100000",
      "0001111111110000",
      "0001111111110000",
      "0000111111100000",
      "0000011110000000",
      "0000001100000000",
    ],
  }),
};
