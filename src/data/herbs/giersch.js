import { createSprite } from "../../engine/pixelSprite.js";

// Giersch (Aegopodium podagraria). Dreikantiger Stängel — wichtigstes Merkmal!
export const giersch = {
  nameDe: "Giersch",
  nameLat: "Aegopodium podagraria",
  schweizerdeutsch: "Geischfuess",
  plate: "aegopodium-podagraria.jpg",
  biotope: ["wiese", "waldrand"],
  sonne: "halbschattig bis schattig",
  boden: "nährstoffreich, feucht, Gartenunkraut",
  saison: {
    teil: {
      blaetter: ["fruehling:1-28", "sommer:1-14"],
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [4, 5, 6, 7],
  merkmale: {
    blattform: "doppelt dreiteilig (dreizählig!), Blättchen länglich-oval, unregelmäßig gesägt",
    blattstellung: "wechselständig, langer Blattstiel, Stiel DREIKANTIG — wichtigstes Merkmal",
    bluete: "weiß, in zusammengesetzten Dolden — typisch Doldenblütler",
    geruch: "charakteristisch aromatisch-würzig beim Zerreiben",
    stengel: "hohl, DREIKANTIG (zum Fühlen!), kahl, gerillt",
    wuchshoehe: "30–90 cm",
  },
  verwechslung: [
    {
      art: "gefleckterSchierling",
      gefahr: "toedlich",
      unterscheidung:
        "Schierling: Stängel rund mit violetten Flecken, unangenehmer Mausgeruch, glatte Blättchen",
    },
    {
      art: "hundspetersilie",
      gefahr: "giftig",
      unterscheidung:
        "Hundspetersilie: kleiner, unangenehm stinkend, glänzende Blättchen, Stängel nicht dreikantig",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    blaetter: ["kueche", "tee"],
    wirkungTraditionell:
      "traditionell bei Gicht (Podagra) — Blätter junger Triebe als Salat oder Gemüse sehr fein",
  },
  fundorte: 5,
  sprite: createSprite({
    palette: [null, "#2e7d32", "#f1f8e9", "#ffffff"],
    rows: [
      "0000033300000000",
      "0000033333000000",
      "0000333333000000",
      "0003333333300000",
      "0003333333300000",
      "0003333333300000",
      "0000333333000000",
      "0000003330000000",
      "0000001110000000",
      "0000001110000000",
      "0001001110100000",
      "0001111111100000",
      "0001111111100000",
      "0000111111000000",
      "0000011110000000",
      "0000001100000000",
    ],
  }),
};
