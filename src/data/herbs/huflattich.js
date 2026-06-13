import { createSprite } from "../../engine/pixelSprite.js";

// Huflattich (Tussilago farfara). Blüten erscheinen vor den Blättern.
export const huflattich = {
  nameDe: "Huflattich",
  nameLat: "Tussilago farfara",
  schweizerdeutsch: "Brustchrut",
  plate: "tussilago-farfara.jpg",
  biotope: ["waldrand"],
  sonne: "sonnig",
  boden: "lehmig, kalkhaltig, Pionierstandorte (Böschungen, Wegränder)",
  saison: {
    teil: {
      blueten: ["fruehling:1-14"],
      blaetter: ["fruehling:10-28", "sommer:1-14"],
    },
  },
  realMonths: [2, 3, 4, 5, 6],
  merkmale: {
    blattform:
      "grundständig, gross, herzförmig-rundlich, hufeisenartig gebuchtet (erscheinen NACH der Blüte)",
    blattstellung:
      "Blätter erst nach der Blüte direkt aus dem Boden, Unterseite weissfilzig behaart",
    bluete:
      "leuchtend gelbe, löwenzahnähnliche Köpfchen auf schuppigem, blattlosem Stängel — erscheinen VOR den Blättern",
    geruch: "kaum wahrnehmbar",
    stengel: "schuppig behaarter, blattloser Blütenstängel",
    wuchshoehe: "5-20 cm (Blüte), Blätter bis 20 cm Durchmesser",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blueten: ["tee"],
    blaetter: ["tee"],
    wirkungTraditionell: "traditionell bei Husten und Reizhusten (Hustentee)",
  },
  fundorte: 3,
  // Stage sprites: early spring = Blüten (no leaves yet), later = Blätter
  stages: {
    bluehend: {
      windows: ["fruehling:1-14"],
      sprite: createSprite({
        palette: [null, "#a1887f", "#8d6e63", "#fdd835", "#f9a825"],
        rows: [
          "0000000030000000",
          "0000003333300000",
          "0000003343300000",
          "0000033444330000",
          "0000003343300000",
          "0000003333300000",
          "0000000231000000",
          "0000000111000000",
          "0000000111000000",
          "0000000112000000",
          "0000000111000000",
          "0000000111000000",
          "0000000211000000",
          "0000000111000000",
          "0000000111000000",
          "0000000111000000",
        ],
      }),
    },
    blatternd: {
      windows: ["fruehling:10-28", "sommer:1-14"],
      sprite: createSprite({
        palette: [null, "#558b2f", "#388e3c", "#81c784", "#fdd835"],
        rows: [
          "0000000000000000",
          "0000000000000000",
          "0001110001110000",
          "0011220011220000",
          "0011221111221000",
          "0001112211110000",
          "0000011221100000",
          "0000001221000000",
          "0000000120000000",
          "0000000110000000",
          "0000000110000000",
          "0000000110000000",
          "0000000110000000",
          "0000000110000000",
          "0000000110000000",
          "0000000110000000",
        ],
      }),
    },
  },
  sprite: createSprite({
    palette: [null, "#a1887f", "#8d6e63", "#fdd835", "#f9a825"],
    rows: [
      "0000000030000000",
      "0000003333300000",
      "0000003343300000",
      "0000033444330000",
      "0000003343300000",
      "0000003333300000",
      "0000000231000000",
      "0000000111000000",
      "0000000111000000",
      "0000000112000000",
      "0000000111000000",
      "0000000111000000",
      "0000000211000000",
      "0000000111000000",
      "0000000111000000",
      "0000000111000000",
    ],
  }),
};
