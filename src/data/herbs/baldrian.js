import { createSprite } from "../../engine/pixelSprite.js";

// Baldrian (Valeriana officinalis). Wurzel riecht unangenehm (Isovaleriansäure) — beruhigend.
export const baldrian = {
  nameDe: "Baldrian",
  nameLat: "Valeriana officinalis",
  schweizerdeutsch: "Baldrian",
  plate: "valeriana-officinalis.jpg",
  biotope: ["garten"],
  sonne: "halbschattig bis sonnig",
  boden: "feucht, nährstoffreich",
  saison: {
    teil: {
      blaetter: ["sommer:1-28"],
      blueten: ["sommer:1-21"],
      wurzel: ["fruehling:1-14", "herbst:1-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform: "unpaarig gefiedert, 9–21 Blättchen, lanzettlich",
    blattstellung: "gegenständig gefiedert",
    bluete:
      "zartrosa-weiß, winzig, in dichten Trugdolden — süßlicher Honiggeruch",
    geruch:
      "Blüten süßlich; Wurzel unangenehm (Isovaleriansäure!) — typischer Baldrian-Geruch",
    stengel: "aufrecht, hohl, gerillt, kahl bis wenig behaart",
    wuchshoehe: "50–150 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    wurzel: ["tinktur", "tee"],
    wirkungTraditionell:
      "beruhigend, schlaffördernd — Baldrianwurzel-Tinktur bei Nervosität und Einschlafproblemen; Wirkung nach 2–4 Wochen regelmäßiger Einnahme",
  },
  fundorte: 0,
  sprite: createSprite({
    palette: [null, "#558b2f", "#f8bbd9", "#ffffff"],
    rows: [
      "0000022222220000",
      "0002222222222000",
      "0022233333222000",
      "0022233333222000",
      "0002222222220000",
      "0000022222200000",
      "0000002222000000",
      "0000001111000000",
      "0000001111000000",
      "0000001111000000",
      "0001001111001000",
      "0001111111100000",
      "0001111111100000",
      "0001111111100000",
      "0000111111100000",
      "0000011111000000",
    ],
  }),
};
