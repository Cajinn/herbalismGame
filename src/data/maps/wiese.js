// Wiese — open meadow east of the village.
// Gentle grassy field with scattered bushes. Exit west → dorf.
// Sprout Lands: bright grass, scattered biom bushes.
// grass[56] = slightly lighter/alt textured grass = open meadow feel
// biom[27]  = pink flowering bush  biom[28] = rose bush variant
export const wiese = {
  id: "wiese",
  name: "Wiese",
  tileSize: 16,
  biotope: "wiese",
  legend: {
    ".": { tile: "wiese",   solid: false, color: "#9ccc65", wang: "pl_gp" },
    ",": { tile: "wiese2",  solid: false, color: "#7cb342", wang: "pl_gp" },
    "#": { tile: "wegrand", solid: false, color: "#c8aa7a", wang: "pl_gp", terrain: "path" },
    "B": { tile: "strauch",  solid: true,  color: "#5a8a28", wang: "pl_gp" },
    "b": { tile: "strauch2", solid: true,  color: "#5a8a28", wang: "pl_gp" },
    "T": { tile: "baum",     solid: true,  color: "#558b2f", wang: "pl_gp" },
  },
  grid: [
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTT",
    "T............................T",
    "T............................T",
    "T,...........................T",
    "T....B..................b....T",
    "T..............B.............T",
    "T,...........................T",
    "T............................T",
    "T,...........................T",
    "T............................T",
    "TTT.#######################.TT",
    "T,...........................T",
    "T............................T",
    "T,...........................T",
    "T....B..........b.......B....T",
    "T,...........................T",
    "T............................T",
    "T,...........................T",
    "T............................T",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  playerSpawn: { x: 15, y: 1 },
  exits: [
    // North edge ← back to the village (you arrive here walking south out of dorf).
    { x: 15, y: 0, target: "dorf", spawn: { x: 6, y: 20 } },
  ],
  objects: [
    { name: "wildflowers", x: 7,  y: 3,  tilew: 1, tileh: 1 },
    { name: "wildflowers", x: 20, y: 6,  tilew: 1, tileh: 1 },
    { name: "wildflowers", x: 5,  y: 12, tilew: 1, tileh: 1 },
    { name: "wildflowers", x: 25, y: 15, tilew: 1, tileh: 1 },
    { name: "rocks",       x: 22, y: 3,  tilew: 1, tileh: 1 },
    { name: "rocks",       x: 8,  y: 14, tilew: 1, tileh: 1 },
    // Shrubs replacing former B/b biom tiles
    { name: "shrub", x: 5,  y: 4,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 26, y: 4,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 15, y: 5,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 5,  y: 14, tilew: 1, tileh: 1 },
    { name: "shrub", x: 16, y: 14, tilew: 1, tileh: 1 },
    { name: "shrub", x: 24, y: 14, tilew: 1, tileh: 1 },
  ],
};
