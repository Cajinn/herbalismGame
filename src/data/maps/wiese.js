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
    ".": { tile: "wiese",   solid: false, color: "#9ccc65", t: ["grass", 56] },
    ",": { tile: "wiese2",  solid: false, color: "#7cb342", t: ["grass", 55] },
    "#": { tile: "wegrand", solid: false, color: "#c8aa7a", t: ["dirt",  55], terrain: "path" },
    "B": { tile: "strauch", solid: true,  color: "#8bc34a", t: ["biom",  27] },
    "b": { tile: "strauch2",solid: true,  color: "#8bc34a", t: ["biom",  28] },
    "T": { tile: "baum",    solid: true,  color: "#558b2f", t: ["biom",  39] },
  },
  grid: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
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
  playerSpawn: { x: 28, y: 10 },
  exits: [
    { x: 29, y: 10, target: "dorf", spawn: { x: 0, y: 11 } },
  ],
};
