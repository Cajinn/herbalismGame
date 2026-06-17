// Garten — the herbalist's garden plot south of the house.
// Hedged perimeter, tilled-soil beds inside, lush grass.
// Owned art only: pl_gp Wang grass/paths, procedural tilled_soil beds,
// hedge/shrub/herbalist_house object PNGs (see objects array).
export const garten = {
  id: "garten",
  name: "Garten",
  tileSize: 16,
  biotope: "garten",
  legend: {
    ".": { tile: "rasen",  solid: false, color: "#7cb342", wang: "pl_gp" },
    ",": { tile: "gras2",  solid: false, color: "#82c044", wang: "pl_gp" },
    "#": { tile: "pfad",   solid: false, color: "#c8aa7a", wang: "pl_gp", terrain: "path" },
    "E": { tile: "beet",   solid: false, color: "#6b4a2e", img: "tilled_soil" },
    "Z": { tile: "zaun_h", solid: true,  color: "#5a8a28", img: "hedge" },
    "z": { tile: "zaun_v", solid: true,  color: "#5a8a28", img: "hedge" },
    "c": { tile: "zaun_c", solid: true,  color: "#5a8a28", img: "hedge" },
    "B": { tile: "strauch",solid: true,  color: "#5a8a28", wang: "pl_gp" },
    "H": { tile: "haus",   solid: true,  color: "#7cb342", wang: "pl_gp" },
  },
  // 30 cols × 20 rows — all rows exactly 30 chars
  grid: [
    "cZZZZZZZZZZZZZ#ZZZZZZZZZZZZZZc",
    "z,............#..............z",
    "z,............#..............z",
    "z,............#..............z",
    "z,...........................z",
    "z,...........................z",
    "z,...........................z",
    "z,...EE..EE..EE..EE..EE......z",
    "z,...EE..EE..EE..EE..EE......z",
    "z,...........................z",
    "z,...........................z",
    "z,...EE..EE..EE..EE..EE......z",
    "z,...EE..EE..EE..EE..EE......z",
    "z,...........................z",
    "z,.........B.................z",
    "z,...........................z",
    "z,.........HHHHHH............z",
    "z,.........HHHHHH............z",
    "z,.........HHHHHH............z",
    "cZZZZZZZZZHHHHHHZZZZZZZZZZZZZc",
  ],
  playerSpawn: { x: 14, y: 1 },
  exits: [
    // North gate in the fence (path runs up col 14) ← back to the village.
    { x: 14, y: 0, target: "dorf", spawn: { x: 6, y: 20 } },
  ],
  beds: [
    { bedId: "bed-1", x: 5,  y: 7  },
    { bedId: "bed-2", x: 9,  y: 7  },
    { bedId: "bed-3", x: 13, y: 7  },
    { bedId: "bed-4", x: 5,  y: 11 },
    { bedId: "bed-5", x: 9,  y: 11 },
  ],

  // Owned PixelLab object PNGs over the grass (B bush, H = back of the
  // herbalist's house at the south edge).
  objects: [
    { name: "shrub",           x: 10, y: 14, tilew: 1, tileh: 1 },
    { name: "herbalist_house", x: 9,  y: 16, tilew: 6, tileh: 4 },
  ],
};
