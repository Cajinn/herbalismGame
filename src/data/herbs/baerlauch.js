import { createSprite } from "../../engine/pixelSprite.js";

// Bärlauch (Allium ursinum). PLAN.md §12 worked example; the Maiglöckchen/
// Herbstzeitlose lookalike trio is the core M2 identification challenge.
export const baerlauch = {
  nameDe: "Bärlauch",
  nameLat: "Allium ursinum",
  schweizerdeutsch: "Bärlouch",
  plate: "allium-ursinum.jpg",
  biotope: ["wald"],
  sonne: "schattig",
  boden: "feucht, humos, kalkhaltig",
  saison: {
    teil: {
      blaetter: ["fruehling:1-21"],
      blueten: ["fruehling:14-28"],
    },
  },
  realMonths: [3, 4, 5],
  merkmale: {
    blattform: "breit-lanzettlich, weich, gestielt, matte (nicht glänzende) Unterseite",
    blattstellung: "jedes Blatt einzeln und gestielt direkt aus dem Boden, kein gemeinsamer Stängel",
    bluete: "weisse, sternförmige Blüten in lockerer Dolde",
    geruch: "deutlich nach Knoblauch beim Zerreiben",
    stengel: "dreikantiger Blütenstängel, blattlos",
    wuchshoehe: "15-25 cm",
  },
  verwechslung: [
    {
      art: "maigloeckchen",
      gefahr: "giftig",
      unterscheidung:
        "Blätter stets zu zweit aus einer gemeinsamen Scheide, glänzende Oberseite, KEIN Knoblauchgeruch",
    },
    {
      art: "herbstzeitlose",
      gefahr: "toedlich",
      unterscheidung:
        "Blätter umfassen den Stängel scheidenartig, steif und glänzend, KEIN Knoblauchgeruch, im Frühling keine Blüte",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blaetter: ["kueche", "tinktur"],
    wirkungTraditionell: "stoffwechselanregend, traditionell bei Frühjahrsmüdigkeit",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#2e7d32", "#81c784"],
    rows: [
      "0000000000000000",
      "0000000020000000",
      "0002000222000200",
      "0002200222002200",
      "0002210222012200",
      "0001220222022100",
      "0001221222122100",
      "0000222222222000",
      "0000122222221000",
      "0000122222221000",
      "0000122222221000",
      "0000012222210000",
      "0000012222210000",
      "0000012222210000",
      "0000011222110000",
      "0000001222100000",
    ],
  }),
};
