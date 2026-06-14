// Alpweide — high alpine pasture north of the forest.
// Rocky terrain, open alm grass, an alpine hut (multi-tile).
// Only exit: south → wald.
// Sprout Lands:
//   grass[55] = flat alm grass  grass[56] = alt
//   biom[39]  = large round bush (= alpine shrub)
//   house[5/6/12/13/19/20] = hut roof  house[0/7/14] = hut walls
//   dirt[55]  = path through alm
//   biom[41]  = large grey rock (solid coverage, ~50% fill — reads as cliff/fels)
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
    "B": { tile: "strauch", solid: true,  color: "#8bc34a", t: ["biom",  39] },
    // Alpine hut — roof (house cols 5-6)
    "r": { tile: "dach_tl", solid: true,  color: "#8d6039", t: ["house",  5] },
    "e": { tile: "dach_tr", solid: true,  color: "#8d6039", t: ["house",  6] },
    "m": { tile: "dach_ml", solid: true,  color: "#8d6039", t: ["house", 12] },
    "M": { tile: "dach_mr", solid: true,  color: "#8d6039", t: ["house", 13] },
    "v": { tile: "dach_bl", solid: true,  color: "#7a5230", t: ["house", 19] },
    "V": { tile: "dach_br", solid: true,  color: "#7a5230", t: ["house", 20] },
    // Alpine hut — walls (house cols 0-1)
    "w": { tile: "wand_t",  solid: true,  color: "#b8997a", t: ["house",  0] },
    "W": { tile: "wand_w",  solid: true,  color: "#a1887f", t: ["house",  7] },
    "x": { tile: "wand_b",  solid: true,  color: "#9a7060", t: ["house", 14] },
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
    { x: 5, y: 3, w: 6, roofBody: 1, door: { dx: 2 } }, // alpine hut
  ],
};
