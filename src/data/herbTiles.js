// Sprout Lands tile assignments for every herb species.
// Replaces custom pixel-art sprites in map render, identify dialog, and book.
//
// Atlas "biom" = grass_biom.png (9 cols, 45 cells).  Confirmed vocabulary:
//   Trees (woody):          9 (oak), 10 (oak), 39 (large leafy)
//   Fruit trees / big shrub:0, 1, 2, 3, 4
//   Berry shrub:            27 · Plain green bushes: 28, 36, 37 · Large bush: 38
//   Yellow flower cluster:  25 · Big sunflower head: 26 · Tall sunflower spike: 35
//   Pink single flower:     33 · Pink/white open bloom: 34
//   Tiny red-topped sprouts:29, 30 · Small ground sprouts: 14, 15, 42, 43
//   AVOID (non-plant props):16-24, 31, 32, 40, 41, 44
//
// Atlas "plants" = plants.png (6 cols, 12 cells).
//   Not used here — biom flowers cover all cases well enough without atlas inspection.

export const HERB_TILES = {
  // ── M4 starters ────────────────────────────────────────────────────────────
  // Bärlauch: white star-shaped umbels, forest floor
  baerlauch:         ["biom", 34],
  // Maiglöckchen: white bell-shaped flowers, low rosette
  maigloeckchen:     ["biom", 34],
  // Herbstzeitlose: pink/lilac chalice-shaped autumn crocus
  herbstzeitlose:    ["biom", 33],
  // Löwenzahn: bright yellow daisy-like heads on hollow stem
  loewenzahn:        ["biom", 25],
  // Gänseblümchen: tiny white + yellow daisy, ground-level
  gaensebluemchen:   ["biom", 34],
  // Spitzwegerich: inconspicuous brown spike, ground rosette
  spitzwegerich:     ["biom", 15],
  // Schafgarbe: white flat-topped umbel clusters
  schafgarbe:        ["biom", 34],
  // Brennnessel: tall leafy, inconspicuous greenish flowers
  brennnessel:       ["biom", 28],
  // Veilchen: deep violet single flowers, low
  veilchen:          ["biom", 33],
  // Huflattich: yellow daisy before leaves, low
  huflattich:        ["biom", 25],
  // Ringelblume (cultivable): orange-yellow garden marigold — big sunflower head
  ringelblume:       ["biom", 26],
  // Echte Kamille (cultivable): white daisy, garden
  kamille:           ["biom", 34],
  // Pfefferminze (cultivable): lilac whorled spikes, spreads by runners
  pfefferminze:      ["biom", 33],

  // ── WP0 kitchen anchors ────────────────────────────────────────────────────
  // Küchenzwiebel: sprouting bulb
  zwiebel:           ["biom", 14],
  // Zitrone: shrub/small tree with white flowers
  zitrone:           ["biom",  4],

  // ── WP2 Wiese / Wegrand ───────────────────────────────────────────────────
  // Johanniskraut: bright yellow 5-petal flowers in clusters
  johanniskraut:     ["biom", 25],
  // Rotklee: round reddish-violet heads
  rotklee:           ["biom", 33],
  // Frauenmantel: tiny yellow-green flowers, leafy/bushy
  frauenmantel:      ["biom", 36],
  // Malve: large pink-violet 5-petal flowers
  malve:             ["biom", 33],
  // Wegwarte: azure blue ray flowers, tall
  wegwarte:          ["biom", 33],
  // Königskerze: tall spike with yellow flowers, 50-200 cm
  koenigskerze:      ["biom", 35],
  // Giersch: white umbels, leafy spreading
  giersch:           ["biom", 34],
  // Gundelrebe: blue-violet lipped flowers, creeping low
  gundelrebe:        ["biom", 33],
  // Hundskamille: white ray + yellow disc, like chamomile but no scent
  hundskamille:      ["biom", 34],
  // Gefleckter Schierling: white umbels, tall and dangerous
  gefleckterSchierling: ["biom", 34],
  // Jakobskreuzkraut: yellow ray flowers in loose clusters
  jakobskreuzkraut:  ["biom", 25],

  // ── WP3 Wald / Waldrand ───────────────────────────────────────────────────
  // Schwarzer Holunder: large cream-white flat umbels, 2-7 m shrub
  holunder:          ["biom",  0],
  // Hagebutte / Hundsrose: pink 5-petal rose, 1-3 m shrub
  hagebutte:         ["biom",  3],
  // Weissdorn: white 5-petal dense corymbs, 2-6 m shrub/small tree
  weissdorn:         ["biom",  1],
  // Schlehe: white flowers before leaves, 1-3 m spiny shrub
  schlehe:           ["biom",  2],
  // Birke: tall deciduous tree (15-25 m)
  birke:             ["biom",  9],
  // Fichte: tall conifer (20-50 m)
  fichte:            ["biom", 10],
  // Schlüsselblume: golden yellow nodding umbel, low forest edge
  schluesselblume:   ["biom", 25],
  // Attich / Zwergholunder: white upright panicles, 1-2 m herbaceous
  attich:            ["biom", 37],
  // Pestwurz: reddish-violet flowers before leaves, broad leafy
  pestwurz:          ["biom", 37],

  // ── WP4 Bachufer ──────────────────────────────────────────────────────────
  // Mädesüss: creamy white feathery flowers, 60-150 cm
  "madesüss":        ["biom", 34],
  // Beinwell: large leafy plant, 30-100 cm
  beinwell:          ["biom", 28],
  // Weide: tree (5-20 m), willow at the waterside
  weide:             ["biom", 39],
  // Roter Fingerhut: tall spike with purple-red bell flowers, 50-150 cm
  roterfingerhut:    ["biom", 33],

  // ── WP5 Garten ────────────────────────────────────────────────────────────
  // Zitronenmelisse: small white lip flowers, leafy bush
  zitronenmelisse:   ["biom", 33],
  // Salbei: blue-violet lipped whorls
  salbei:            ["biom", 33],
  // Thymian: tiny pink-lilac heads, 10-30 cm
  thymian:           ["biom", 33],
  // Lavendel: blue-violet spikes, intensely fragrant
  lavendel:          ["biom", 33],
  // Baldrian: tall 50-150 cm, pale pink-white
  baldrian:          ["biom", 34],

  // ── WP6 Dorf ──────────────────────────────────────────────────────────────
  // Dorflinde: large tree (10-30 m)
  linde:             ["biom",  9],
  // Hundspetersilie: white umbels, dangerous lookalike
  hundspetersilie:   ["biom", 34],

  // ── WP7 Alpweide ──────────────────────────────────────────────────────────
  // Arnika: yellow daisy, 15-50 cm alpine
  arnika:            ["biom", 25],
  // Gelber Enzian: yellow whorled flowers, 50-140 cm
  gelberEnzian:      ["biom", 25],
  // Alpen-Frauenmantel: tiny yellow-green flowers, very low (5-20 cm), alpine
  alpenfrauenmantel: ["biom", 42],
  // Quendel / Feldthymian: pink-violet tiny heads, creeping 3-10 cm
  quendel:           ["biom", 43],
  // Wacholder: berry shrub/small tree, 1-6 m
  wacholder:         ["biom", 27],
};

/**
 * Returns the [atlasName, tileIndex] for a species key.
 * Falls back to a plain green bush (biom 28) for unknown keys.
 */
export function herbTile(speciesKey) {
  return HERB_TILES[speciesKey] ?? ["biom", 28];
}
