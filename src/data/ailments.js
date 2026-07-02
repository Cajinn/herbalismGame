// Ailment registry (PLAN.md §8.2). Each ailment has a seasonal window and a
// list of valid remedies (species + processed output). Only list species that
// exist in the current herb registry.
export const ailments = {
  erkaeltung: {
    id: "erkaeltung",
    nameDe: "Erkältung",
    beschreibungDe: "Ich hab Halsschmerzen und einen lästigen Schnupfen.",
    seasons: ["herbst", "winter"],
    validRemedies: [
      { species: "spitzwegerich", output: "tee" },
      { species: "veilchen",      output: "tee" },
      { species: "huflattich",    output: "tee" },
      { species: "kamille",       output: "tee" },
      { species: "zwiebel",       output: "sirup" },
      { species: "zitrone",       output: "tee" },
      { species: "salbei",        output: "tee" },
      { species: "thymian",       output: "tee" },
      { species: "kurkuma",       output: "hausmittel" },
      { species: "ingwer",        output: "tee" },
    ],
  },
  husten: {
    id: "husten",
    nameDe: "Husten",
    beschreibungDe: "Seit Tagen hustet es mich durch — besonders nachts.",
    seasons: ["herbst", "winter"],
    validRemedies: [
      { species: "huflattich",    output: "tee" },
      { species: "spitzwegerich", output: "tee" },
      { species: "veilchen",      output: "tee" },
      { species: "zwiebel",       output: "sirup" },
      { species: "thymian",       output: "tee" },
    ],
  },
  verdauung: {
    id: "verdauung",
    nameDe: "Magenbeschwerden",
    beschreibungDe: "Mein Bauch macht mir zu schaffen — Blähungen und Schwere nach dem Essen.",
    seasons: ["fruehling", "sommer"],
    validRemedies: [
      { species: "loewenzahn",  output: "tee" },
      { species: "schafgarbe",  output: "tee" },
      { species: "kamille",     output: "tee" },
      { species: "ingwer",      output: "tee" },
    ],
  },
  fruehjahrsmuedigkeit: {
    id: "fruehjahrsmuedigkeit",
    nameDe: "Frühjahrsmüdigkeit",
    beschreibungDe: "Ich komme einfach nicht in die Gänge — müde, kraftlos, blass.",
    seasons: ["fruehling"],
    validRemedies: [
      { species: "brennnessel",    output: "tee" },
      { species: "loewenzahn",     output: "tee" },
      { species: "gaensebluemchen", output: "tee" },
    ],
  },
  kopfschmerz: {
    id: "kopfschmerz",
    nameDe: "Kopfschmerzen",
    beschreibungDe: "Die Hitze schlägt mir auf den Kopf — schon den ganzen Nachmittag.",
    seasons: ["sommer"],
    validRemedies: [
      { species: "pfefferminze", output: "tee" },
      { species: "schafgarbe",   output: "tee" },
    ],
  },
  gelenkschmerz: {
    id: "gelenkschmerz",
    nameDe: "Gelenkschmerzen",
    beschreibungDe: "Meine Knie und Hände tun bei der Kälte weh — schon seit Wochen.",
    seasons: ["herbst", "winter"],
    validRemedies: [
      { species: "ringelblume", output: "salbe" },
      { species: "kurkuma",     output: "hausmittel" },
    ],
  },
  wunde: {
    id: "wunde",
    nameDe: "Kleine Wunde",
    beschreibungDe: "Hab mich beim Heuen geschnitten — blutet nicht mehr, aber entzündet.",
    seasons: ["fruehling", "sommer", "herbst"],
    validRemedies: [
      { species: "schafgarbe",  output: "pulver" },
      { species: "ringelblume", output: "salbe" },
    ],
  },
  schlaflosigkeit: {
    id: "schlaflosigkeit",
    nameDe: "Schlaflosigkeit",
    beschreibungDe: "Ich kann nachts nicht schlafen — drehe mich stundenlang hin und her.",
    seasons: ["herbst", "winter", "fruehling"],
    validRemedies: [
      { species: "baldrian", output: "tinktur" },
      { species: "baldrian", output: "tee" },
    ],
  },
  erkaeltungHerbst: {
    id: "erkaeltungHerbst",
    nameDe: "Herbsterkältung",
    beschreibungDe: "Alles läuft und kratzt im Hals — typisch für diese Jahreszeit.",
    seasons: ["herbst"],
    validRemedies: [
      { species: "holunder", output: "sirup" },
      { species: "hagebutte", output: "tee" },
      { species: "spitzwegerich", output: "tee" },
      { species: "zwiebel", output: "sirup" },
    ],
  },
  nervositaet: {
    id: "nervositaet",
    nameDe: "Nervosität",
    beschreibungDe: "Ich bin so unruhig und kann mich nicht konzentrieren.",
    seasons: ["fruehling", "sommer", "herbst"],
    validRemedies: [
      { species: "baldrian", output: "tinktur" },
      { species: "zitronenmelisse", output: "tee" },
      { species: "lavendel", output: "tee" },
    ],
  },
  prellung: {
    id: "prellung",
    nameDe: "Prellung / Bluterguss",
    beschreibungDe: "Hab mich gestossen — blauer Fleck, schwillt an. Hast du etwas Äusserliches?",
    seasons: ["sommer", "herbst"],
    validRemedies: [
      { species: "arnika",      output: "tinktur" },
      { species: "ringelblume", output: "salbe" },
    ],
  },
  gelenkschmerz2: {
    id: "gelenkschmerz2",
    nameDe: "Rückenschmerzen",
    beschreibungDe: "Mein Rücken schmerzt — zu viel Arbeit auf dem Feld.",
    seasons: ["sommer", "herbst"],
    validRemedies: [
      { species: "beinwell", output: "wickel" },
      { species: "ringelblume", output: "salbe" },
    ],
  },
};
