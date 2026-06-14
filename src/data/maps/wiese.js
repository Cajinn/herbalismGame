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
    "B": { tile: "strauch", solid: true,  color: "#8bc34a", t: ["biom",  27] },
    "b": { tile: "strauch2",solid: true,  color: "#8bc34a", t: ["biom",  28] },
    "T": { tile: "baum",    solid: true,  color: "#558b2f", t: ["biom",  39] },
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
    "T#############################",
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
};
