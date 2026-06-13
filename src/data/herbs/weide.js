import { createSprite } from "../../engine/pixelSprite.js";

// Weide (Salix alba/purpurea). Rinde im Frühling ernten — Salicin = Aspirin-Vorläufer.
export const weide = {
  nameDe: "Weide (Rinde)",
  nameLat: "Salix alba / purpurea",
  schweizerdeutsch: "Wyde",
  plate: null,
  biotope: ["bachufer"],
  sonne: "sonnig bis halbschattig",
  boden: "feucht bis nass, Bachränder und Flussauen",
  saison: {
    teil: {
      rinde: ["fruehling:1-28"],
    },
  },
  realMonths: [3, 4, 5],
  merkmale: {
    blattform:
      "lanzettlich, schmal, fein gezähnt, silbrig behaart bei Silberweide",
    blattstellung: "wechselständig, hängend bei Trauerweide",
    bluete: "Kätzchen (nicht geerntet)",
    geruch: "Rinde bitter-herb, die Rinde enthält Salicin",
    stengel: "biegsame Zweige, junge Rinde gelblich-grün oder rötlich",
    wuchshoehe: "5–20 m Baum (nur Rindenreis von Jungtrieben)",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    rinde: ["tee", "trocknen"],
    wirkungTraditionell:
      "fiebersenkend, schmerzlindernd, entzündungshemmend (Salicin = Aspirin-Vorläufer!) — alte Volksmedizin bei Fieber und Gelenkschmerzen, Rinde im Frühling ernten",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#558b2f", "#c5e1a5", "#b0bec5"],
    rows: [
      "0000000000000000",
      "0000000221000000",
      "0000002221200000",
      "0000022221220000",
      "0000222222220000",
      "0000022222200000",
      "0000002221200000",
      "0000000221000000",
      "0000000131000000",
      "0000003331000000",
      "0000033331300000",
      "0000333313330000",
      "0003333113333000",
      "0003311111333000",
      "0001111111111000",
      "0000011111100000",
    ],
  }),
};
