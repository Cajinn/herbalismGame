import { createSprite } from "../../engine/pixelSprite.js";

// Brennnessel (Urtica dioica).
export const brennnessel = {
  nameDe: "Brennnessel",
  nameLat: "Urtica dioica",
  schweizerdeutsch: "Nessle",
  plate: "urtica-dioica.jpg",
  biotope: ["wiese"],
  sonne: "halbschattig bis sonnig",
  boden: "stickstoffreich, nährstoffreiche Böden",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28", "sommer:1-28"],
    },
  },
  realMonths: [3, 4, 5, 6, 7, 8],
  merkmale: {
    blattform: "herzförmig-eilanzettlich, grob gesägt, mit Brennhaaren",
    blattstellung: "gegenständig (paarweise gegenüber) am vierkantigen Stängel",
    bluete: "unscheinbare grünliche Rispen in den Blattachseln",
    geruch:
      "kaum wahrnehmbar (Vorsicht: Brennhaare lösen Hautreizung aus, nicht zum Riechen anfassen!)",
    stengel: "vierkantig, mit Brennhaaren besetzt",
    wuchshoehe: "30-150 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blaetter: ["tee", "kueche", "tinktur"],
    wirkungTraditionell: "traditionell harntreibend, blutreinigend, eisenreich (Frühlingskur)",
  },
  fundorte: 4,
  sprite: createSprite({
    palette: [null, "#33691e", "#558b2f"],
    rows: [
      "0000000000000000",
      "0000000010000000",
      "0000020111020000",
      "0000222111222000",
      "0002222212222200",
      "0000222111222000",
      "0000220111022000",
      "0002220111022200",
      "0022222111222220",
      "0002220111022200",
      "0000200111002000",
      "0002220111022200",
      "0022222111222220",
      "0002220111022200",
      "0000200111002000",
      "0000000111000000",
    ],
  }),
};
