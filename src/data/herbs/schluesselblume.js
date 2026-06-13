import { createSprite } from "../../engine/pixelSprite.js";

// Schlüsselblume (Primula veris). In der Schweiz geschützt — nur aus dem Garten!
export const schluesselblume = {
  nameDe: "Schlüsselblume",
  nameLat: "Primula veris",
  schweizerdeutsch: "Schlüesselblüemli",
  plate: "primula-veris.jpg",
  biotope: ["waldrand"],
  sonne: "halbschattig bis sonnig",
  boden: "kalkhaltig, mäßig feucht",
  saison: {
    teil: {
      blueten: ["fruehling:1-21"],
    },
  },
  realMonths: [3, 4, 5],
  merkmale: {
    blattform: "grundständig, oval, runzlig, leicht behaart, gestielt",
    blattstellung: "grundständige Rosette — Blätter bleiben auch nach der Blüte",
    bluete: "goldgelb, 5 Blütenblätter mit orangem Fleck, nickend in einseitiger Dolde",
    geruch: "angenehm süßlich-würzig, charakteristisch",
    stengel: "blattloser Blütenschaft, weich behaart",
    wuchshoehe: "8–20 cm",
  },
  verwechslung: [],
  geschuetzt: true,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "trocknen"],
    wirkungTraditionell:
      "schleimlösend, leicht harntreibend — nur aus dem Garten oder Dorfladen beziehen! In der Schweiz geschützt.",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#558b2f", "#fdd835", "#f57f17"],
    rows: [
      "0000000000000000",
      "0000002220000000",
      "0000022322000000",
      "0000023230000000",
      "0000022322000000",
      "0000002220000000",
      "0000000200000000",
      "0000002200000000",
      "0000002220000000",
      "0000001110000000",
      "0001001110010000",
      "0001111111100000",
      "0001111111100000",
      "0011111111110000",
      "0001111111100000",
      "0000011110000000",
    ],
  }),
};
