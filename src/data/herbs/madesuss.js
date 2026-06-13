import { createSprite } from "../../engine/pixelSprite.js";

// Mädesüss (Filipendula ulmaria). Cremeweiß-schaumige Rispen, Mandelduft — «Aspirin der Natur».
export const madesüss = {
  nameDe: "Mädesüss",
  nameLat: "Filipendula ulmaria",
  schweizerdeutsch: "Wiestee",
  plate: "filipendula-ulmaria.jpg",
  biotope: ["bachufer"],
  sonne: "halbschattig bis sonnig",
  boden: "feucht bis nass, nährstoffreich, Bachränder",
  saison: {
    teil: {
      blueten: ["sommer:1-28"],
      blaetter: ["sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8],
  merkmale: {
    blattform:
      "unterbrochen gefiedert, Endblättchen groß 3-5 lappig, Blattunterseite weißfilzig",
    blattstellung: "wechselständig, unpaarig gefiedert",
    bluete:
      "cremeweiß, winzig, in dichten fedrig-schaumigen Rispen — charakteristisch Mandarinengeruch",
    geruch:
      "intensiv süßlich-mandelartig, enthält Salicylate (wie Aspirin!)",
    stengel: "aufrecht, kantig, rötlich, kahl",
    wuchshoehe: "60–150 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "trocknen"],
    blaetter: ["tee"],
    wirkungTraditionell:
      "entzündungshemmend, schmerzlindernd (Salicylate), schweißtreibend — «das Aspirin der Natur» bei Fieber und Gelenkschmerzen",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#2e7d32", "#f5f5f5", "#bcaaa4"],
    rows: [
      "0022222222222200",
      "0222222222222220",
      "2222222222222222",
      "2222222222222222",
      "0222222222222220",
      "0022222222222200",
      "0000222222220000",
      "0000003333000000",
      "0000003313000000",
      "0000003333000000",
      "0000003313000000",
      "0000003333000000",
      "0003003313003000",
      "0003333333333000",
      "0001333333331000",
      "0000033333300000",
    ],
  }),
};
