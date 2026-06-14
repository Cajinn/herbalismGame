// Waldrand — forest edge north of the village. A path runs from the village
// (south exit) up through the tree line toward the deep forest (north exit).
// The village stream crosses at the south end over a wooden bridge.
// Sprout Lands tiles:
//   grass[55] = open meadow ground
//   grass[56] = alt meadow
//   dirt[55]  = sandy path fill
//   water[0]  = stream water
//   bridge[8] = horizontal bridge plank middle (where path crosses stream)
//   biom[27]  = pink bush (meadow edge)
//   biom[28]  = rose bush (forest understorey)
//   biom[39]  = large green round bush (= "tree" stand-in, most opaque)
export const waldrand = {
  id: "waldrand",
  name: "Waldrand",
  tileSize: 16,
  biotope: "waldrand",
  legend: {
    ".": { tile: "wiese",     solid: false, color: "#8bc34a", wang: "pl_gp" },
    ",": { tile: "wiese2",    solid: false, color: "#7cb342", wang: "pl_gp" },
    "#": { tile: "pfad",      solid: false, color: "#c8aa7a", wang: "pl_gp", terrain: "path" },
    "~": { tile: "wasser",    solid: true,  color: "#4fc3f7", t: ["water",  0] },
    "=": { tile: "bruecke",   solid: false, color: "#c8a06a", t: ["bridge", 8] },
    "T": { tile: "baum",      solid: true,  color: "#558b2f", t: ["biom",  39] },
    "B": { tile: "strauch",   solid: true,  color: "#8bc34a", t: ["biom",  27] },
    "b": { tile: "strauch2",  solid: true,  color: "#8bc34a", t: ["biom",  28] },
  },
  grid: [
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTTT",
    "T..............#...............T",
    "T....bbb.......#......bbb......T",
    "T....bbb.......#......bbb......T",
    "T....bbb.......#......bbb......T",
    "T..............#...............T",
    "T.....B........#........B......T",
    "T..............#...............T",
    "T..............#...............T",
    "T..............#...............T",
    "T...B..........#.........B.....T",
    "T..............#...............T",
    "T..............#...............T",
    "T..............#...............T",
    "T....bbb.......#......bbb......T",
    "T....bbb.......#......bbb......T",
    "T....bbb.......#......bbb......T",
    "T...B..........#.........B.....T",
    "T..............#...............T",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTTT",
  ],
  playerSpawn: { x: 15, y: 18 },
  exits: [
    { x: 15, y: 19, target: "dorf",  spawn: { x: 6,  y: 1  } },
    { x: 15, y: 0,  target: "wald",  spawn: { x: 15, y: 18 } },
  ],
};
