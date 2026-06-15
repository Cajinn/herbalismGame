import { createSprite } from "../../engine/pixelSprite.js";

// Birke (Betula pendula). Frühjahrskur — junge Blätter entwässernd.
export const birke = {
  nameDe: "Birke",
  nameLat: "Betula pendula",
  schweizerdeutsch: "Birchi",
  plate: "betula-pendula.jpg",
  biotope: ["wald", "waldrand"],
  sonne: "sonnig bis halbschattig",
  boden: "sauer, nährstoffarm, Pioniergehölz",
  saison: {
    teil: {
      blaetter: ["fruehling:1-21"],
    },
  },
  realMonths: [4, 5],
  merkmale: {
    blattform: "dreieckig-rhombisch, doppelt gesägt, Blattspitze ausgezogen",
    blattstellung: "wechselständig, hängend an langen Stielen",
    bluete: "Kätzchen (nicht geerntet)",
    geruch: "frisch, leicht harzig beim Zerreiben junger Blätter",
    stengel: "weiße, papierartige Rinde (Birkenrinde), hängende Äste",
    wuchshoehe: "15–25 m Baum",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  // A 15–25 m tree: draw the spawn sprite across a 2×2-tile footprint
  // (anchored bottom-centre on the spawn tile) instead of a single herb tile.
  renderTiles: 2,
  verwendung: {
    blaetter: ["tee", "trocknen"],
    wirkungTraditionell:
      "entwässernd (Birkentee-Kur im Frühling!), leicht entzündungshemmend — klassische Frühjahrskur der Volksmedizin",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#c5e1a5", "#aed581", "#f5f5f5"],
    rows: [
      "0001120012100000",
      "0011121121110000",
      "0011221122110000",
      "0001121211110000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
      "0000003300000000",
      "0000003300000000",
      "0000033330000000",
      "0000033330000000",
      "0000333333000000",
      "0000333333000000",
      "0000333333000000",
      "0000033330000000",
      "0000003300000000",
    ],
  }),
};
