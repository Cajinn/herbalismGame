import { createSprite } from "../../engine/pixelSprite.js";

// Malve (Malva sylvestris). Schleimhaltige Blätter und Blüten.
export const malve = {
  nameDe: "Malve",
  nameLat: "Malva sylvestris",
  schweizerdeutsch: "Käslichrut",
  plate: "malva-sylvestris.jpg",
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "nährstoffreich, stickstoffhaltig, Wegränder",
  saison: {
    teil: {
      blueten: ["sommer:1-28", "herbst:1-14"],
      blaetter: ["fruehling:14-28", "sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8, 9],
  merkmale: {
    blattform: "rundlich-herzförmig, 5–7 Lappen, gekerbt — Blätter schleimartig",
    blattstellung: "wechselständig, gestielt",
    bluete: "rosa-violett mit dunkleren Streifen, 5 Blütenblätter, auffällig groß",
    geruch: "kaum wahrnehmbar, Blätter schleimig",
    stengel: "aufrecht bis niederliegend, behaart",
    wuchshoehe: "30–100 cm",
  },
  verwechslung: [],
  geschuetzt: false,
  kultivierbar: true,
  verwendung: {
    blueten: ["tee", "trocknen"],
    blaetter: ["tee"],
    wirkungTraditionell:
      "schleimhautberuhigend, schleimlösend — bei Husten, Halsschmerzen und Magenbeschwerden",
  },
  fundorte: 3,
  sprite: createSprite({
    palette: [null, "#558b2f", "#ce93d8", "#9c27b0"],
    rows: [
      "0000023320000000",
      "0000232232000000",
      "0002323332200000",
      "0002333333200000",
      "0002323332200000",
      "0000232232000000",
      "0000023020000000",
      "0000001100000000",
      "0000011110000000",
      "0000011110000000",
      "0001011110100000",
      "0001111111100000",
      "0001111111110000",
      "0000111111100000",
      "0000011110000000",
      "0000001100000000",
    ],
  }),
};
