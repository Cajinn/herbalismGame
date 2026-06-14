import { createSprite } from "../engine/pixelSprite.js";

// Shared sprite rows — same silhouette, different palette per villager.
function humanSprite(palette) {
  return createSprite({
    palette,
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000033330000000",
      "0000031130000000",
      "0000011110000000",
      "0000011110000000",
      "0000122221000000",
      "0000022220000000",
      "0000022220000000",
      "0000022220000000",
      "0000044440000000",
      "0000040040000000",
      "0000040040000000",
      "0000040040000000",
      "0000000000000000",
      "0000000000000000",
    ],
  });
}

// Slightly shorter silhouette for Sophie (child).
function childSprite(palette) {
  return createSprite({
    palette,
    rows: [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000033330000000",
      "0000031130000000",
      "0000011110000000",
      "0000122221000000",
      "0000022220000000",
      "0000022220000000",
      "0000044440000000",
      "0000040040000000",
      "0000040040000000",
      "0000040040000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
  });
}

// Village cast (PLAN.md §8.1). Each villager has a position in the Dorf
// (home = morning, square = afternoon ≥12:00) and a dialog template.
// Margrit is the mentor — she gives hints, not requests.
export const villagers = {
  vreni: {
    id: "vreni",
    nameDe: "Vreni",
    rolleDe: "Bäuerin",
    ailmentThemes: ["verdauung", "wunde", "erkaeltungHerbst"],
    home:   { map: "dorf", x: 4,  y: 5  },
    square: { map: "dorf", x: 11, y: 9  },
    colour: "#c0392b", // bold red
    tint: 180,
    sprite: humanSprite([null, "#f5cba7", "#c0392b", "#6b3a2a", "#795548"]),
    dialog: {
      gruss: "Grüezi! Schön, dich zu sehen.",
      bitte: ({ ailmentNameDe }) =>
        `Ich plagts mich mit: ${ailmentNameDe}. Hast du vielleicht etwas dagegen?`,
      dank: "Tausend Dank! Du bist eine grosse Hilfe.",
      ablehnung:
        "Das passt leider nicht so ganz — aber ich glaube, du findest es noch.",
    },
  },

  ueli: {
    id: "ueli",
    nameDe: "Ueli",
    rolleDe: "Bauer",
    ailmentThemes: ["gelenkschmerz", "husten", "gelenkschmerz2", "prellung"],
    home:   { map: "dorf", x: 4,  y: 14 },
    square: { map: "dorf", x: 7,  y: 11 },
    colour: "#1a5276", // dark navy blue
    tint: 25,
    sprite: humanSprite([null, "#e8c9a0", "#2e4a7a", "#aaaaaa", "#5d4037"]),
    dialog: {
      gruss: "Jo, Gott zum Gruss!",
      bitte: ({ ailmentNameDe }) =>
        `${ailmentNameDe} — schon die ganze Woche. Du kennst doch deine Kräuter?`,
      dank: "Ha, das hilft! Ich sag's meiner Frau.",
      ablehnung: "Hm, ich weiss nicht… Das ist nicht ganz das Richtige.",
    },
  },

  klara: {
    id: "klara",
    nameDe: "Klara",
    rolleDe: "Müllerstochter",
    ailmentThemes: ["kopfschmerz", "fruehjahrsmuedigkeit", "nervositaet"],
    home:   { map: "dorf", x: 26, y: 8  },
    square: { map: "dorf", x: 21, y: 8  },
    colour: "#27ae60", // vivid green
    tint: 120,
    sprite: humanSprite([null, "#f5cba7", "#27ae60", "#1c1c1c", "#5d4037"]),
    dialog: {
      gruss: "Guten Tag! Ich war gerade beim Brunnen.",
      bitte: ({ ailmentNameDe }) =>
        `Uf, ${ailmentNameDe} — kannst du mir was Passendes geben?`,
      dank: "Oh, super! Vielen Dank.",
      ablehnung:
        "Hmm, das glaube ich, trifft's nicht ganz. Schau nochmal nach?",
    },
  },

  res: {
    id: "res",
    nameDe: "Res",
    rolleDe: "Schreiner",
    ailmentThemes: ["wunde", "verdauung", "gelenkschmerz2", "prellung"],
    home:   { map: "dorf", x: 26, y: 14 },
    square: { map: "dorf", x: 22, y: 12 },
    colour: "#8e44ad", // vivid purple
    tint: 300,
    sprite: humanSprite([null, "#f5cba7", "#8e44ad", "#7d3c00", "#5d4037"]),
    dialog: {
      gruss: "Hoi! Alles guet?",
      bitte: ({ ailmentNameDe }) =>
        `Hast du was gegen ${ailmentNameDe}? Ich komm nicht weiter so.`,
      dank: "Perfekt, genau das Richtige. Merci vielmal!",
      ablehnung:
        "Äh, nein, das brauch ich nicht wirklich. Aber trotzdem danke.",
    },
  },

  sophie: {
    id: "sophie",
    nameDe: "Sophie",
    rolleDe: "Schmiedskind",
    ailmentThemes: ["erkaeltung", "husten", "erkaeltungHerbst"],
    home:   { map: "dorf", x: 4,  y: 3  },
    square: { map: "dorf", x: 6,  y: 8  },
    colour: "#e67e22", // warm orange
    tint: 210,
    sprite: childSprite([null, "#f5d0a7", "#f39c12", "#d4a017", "#795548"]),
    dialog: {
      gruss: "Hallo! Schaust du auch Blumen?",
      bitte: ({ ailmentNameDe }) =>
        `Ich hab ${ailmentNameDe}. Mama sagt, du kannst helfen.`,
      dank: "Danke! Das schmeckt gar nicht so schlimm.",
      ablehnung: "Oh… das ist wohl nicht das Richtige.",
    },
  },

  anna: {
    id: "anna",
    nameDe: "Anna",
    rolleDe: "Wirtin",
    ailmentThemes: ["gelenkschmerz", "fruehjahrsmuedigkeit", "schlaflosigkeit", "nervositaet"],
    home:   { map: "dorf", x: 24, y: 15 },
    square: { map: "dorf", x: 19, y: 13 },
    colour: "#16a085", // teal/cyan — distinct from red, blue, green, purple
    tint: 160,
    sprite: humanSprite([null, "#f5cba7", "#c77c1e", "#c0c0c0", "#795548"]),
    dialog: {
      gruss: "Grüezi wohl! Kommst du zum Znacht?",
      bitte: ({ ailmentNameDe }) =>
        `${ailmentNameDe} macht mir zu schaffen. Hast du ein gutes Mittel?`,
      dank: "Das ist fein. Ich danke dir von Herzen.",
      ablehnung:
        "Nein, das hilft mir nicht so — aber ich frage lieber nochmals nach.",
    },
  },

  margrit: {
    id: "margrit",
    nameDe: "Frau Margrit",
    rolleDe: "Kräuterkundige",
    ailmentThemes: [],
    home:   { map: "dorf", x: 12, y: 7  },
    square: { map: "dorf", x: 12, y: 8  },
    colour: "#d4ac0d", // golden yellow — mentor stands out distinctly
    tint: 45,
    sprite: humanSprite([null, "#f5d0a7", "#1a5276", "#d4ac0d", "#2c3e50"]),
    dialog: {
      gruss: "Schön, dass du lernst, Kind.",
      bitte: null,
      dank: null,
      ablehnung: null,
      hinweise: [
        "Jede Pflanze hat ihre Zeit — das Buch sagt dir, wann sie bereit ist.",
        "Ringelblume und Olivenöl am Sonnenfenster: sechs Wochen Geduld, dann eine herrliche Salbe.",
        "Pfefferminze wächst wie Unkraut — halt sie im Zaum, aber nutze sie fürs Kopfweh.",
        "Der Mörser will, dass du trocknest, bevor du mahlst.",
        "Kamille riecht nach Äpfeln. Wenn nicht, ist sie's nicht.",
        "Schaue auf das Anschlagbrett — die Dorfleute brauchen dich.",
      ],
    },
  },
};
