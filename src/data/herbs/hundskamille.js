import { createSprite } from "../../engine/pixelSprite.js";

// Hundskamille (Anthemis cotula). Stinkende Kamille-Verwechslung — KEIN Apfelgeruch!
export const hundskamille = {
  nameDe: "Hundskamille",
  nameLat: "Anthemis cotula",
  schweizerdeutsch: "Hundschamillen",
  plate: null,
  biotope: ["wiese"],
  sonne: "sonnig",
  boden: "trocken, nährstoffarm",
  saison: {
    teil: {
      blueten: ["sommer:1-28"],
    },
  },
  realMonths: [6, 7, 8, 9],
  merkmale: {
    blattform: "fein gefiedert wie Kamille",
    blattstellung: "wechselständig",
    bluete: "weiße Zungenblüten, gelbe Scheibe — wie Kamille, aber kein Apfelgeruch",
    geruch: "stinkend unangenehm beim Zerreiben — KEIN Apfelgeruch!",
    stengel: "aufrecht, kahl oder wenig behaart",
    wuchshoehe: "15–40 cm",
  },
  verwechslung: [
    {
      art: "kamille",
      gefahr: "wirkungslos",
      unterscheidung:
        "Echte Kamille: unverwechselbarer Apfelgeruch, hohler Blütenboden, Blütenblätter hängen zurück",
    },
  ],
  geschuetzt: false,
  kultivierbar: false,
  verwendung: {
    wirkungTraditionell:
      "keine Heilwirkung — wirkungslose Verwechslungsart der Echten Kamille",
  },
  fundorte: 2,
  sprite: createSprite({
    palette: [null, "#558b2f", "#f5f5f5", "#fdd835"],
    rows: [
      "0000000000000000",
      "0000002020000000",
      "0000022222000000",
      "0000223332000000",
      "0000233332000000",
      "0000223332000000",
      "0000022222000000",
      "0000002020000000",
      "0000000100000000",
      "0000001110000000",
      "0000001110000000",
      "0000101110010000",
      "0001111111110000",
      "0000111111110000",
      "0000011111100000",
      "0000001111000000",
    ],
  }),
};
