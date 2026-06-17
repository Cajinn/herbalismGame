// Alpweide — high alpine pasture north of the forest.
// Rocky terrain, open alm grass, an alpine hut (PixelLab object PNG).
// Only exit: west → dorf.
// Owned art only: pl_gr Wang rock/grass, pl_gp path, shrub + hut_a object PNGs.
export const alpweide = {
  id: "alpweide",
  name: "Alpweide",
  tileSize: 16,
  biotope: "alpweide",
  legend: {
    ".": { tile: "alm",     solid: false, color: "#bcd98f", wang: "pl_gr" },
    ",": { tile: "alm2",    solid: false, color: "#c5e0a0", wang: "pl_gr" },
    "#": { tile: "pfad",    solid: false, color: "#c8aa7a", wang: "pl_gp", terrain: "path" },
    "R": { tile: "fels",    solid: true,  color: "#9e9e9e", wang: "pl_gr", terrain: "rock" },
    "B": { tile: "strauch", solid: true,  color: "#5a8a28", wang: "pl_gr" },
  },
  // 30 cols × 20 rows
  grid: [
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    "R.,..........................R",
    "R............................R",
    "R............................R",
    "R................B...........R",
    "R............................R",
    "R............................R",
    "R............................R",
    "R.............R..............R",
    "R..,.................,.......R",
    ".............................R",
    "R............................R",
    "R.......R...,................R",
    "R.........R..................R",
    "R.................R..........R",
    "R..............#.............R",
    "R..............#.............R",
    "R..............#.............R",
    "R..............#.............R",
    "RRRRRRRRRRRRRRR#RRRRRRRRRRRRRR",
  ],
  playerSpawn: { x: 1, y: 10 },
  exits: [
    // West edge ← back to the village (reached from dorf's gated east exit).
    { x: 0, y: 10, target: "dorf", spawn: { x: 28, y: 11 } },
  ],
  buildings: [
    // Footprint kept for collision; rendered as a PixelLab hut PNG (noRender).
    { x: 5, y: 3, w: 3, roofBody: 0, door: { dx: 1 }, noRender: true }, // alpine hut
  ],
  objects: [
    { name: "hut_a", x: 5,  y: 3,  tilew: 3, tileh: 4 },
    { name: "shrub", x: 17, y: 4,  tilew: 1, tileh: 1 },
  ],
};
