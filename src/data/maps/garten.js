// Garten — the herbalist's garden plot south of the house.
// Fenced perimeter, tilled-dirt beds inside, alt-grass texture.
// Sprout Lands tiles:
//   grass[55/56] = ground  dirt[28] = tilled soil  dirt[55] = path
//   fences[2] = H-fence  fences[0] = V-fence post  fences[12] = corner
//   biom[27] = pink bush  house[5] = roof (south wall of herbalist house)
export const garten = {
  id: "garten",
  name: "Garten",
  tileSize: 16,
  biotope: "garten",
  legend: {
    ".": { tile: "rasen",  solid: false, color: "#7cb342", t: ["grass", 55] },
    ",": { tile: "gras2",  solid: false, color: "#82c044", t: ["grass", 56] },
    "#": { tile: "pfad",   solid: false, color: "#c8aa7a", t: ["dirt",  55], terrain: "path" },
    "E": { tile: "beet",   solid: false, color: "#8d6e4a", t: ["dirt",  28], terrain: "bed" },
    "Z": { tile: "zaun_h", solid: true,  color: "#a07848", t: ["fences",  2] },
    "z": { tile: "zaun_v", solid: true,  color: "#a07848", t: ["fences",  0] },
    "c": { tile: "zaun_c", solid: true,  color: "#a07848", t: ["fences", 12] },
    "B": { tile: "strauch",solid: true,  color: "#8bc34a", t: ["biom",  27] },
    "H": { tile: "haus",   solid: true,  color: "#8d6039", t: ["house",   5] },
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
};
