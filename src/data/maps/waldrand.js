// Waldrand — forest edge north of the village. A path runs from the village
// (south exit) up through the tree line toward the deep forest (north exit).
// A path runs from the village (south) up through the tree line to the forest.
// Owned art only: the tree line / bushes are solid pl_gp Wang grass (forest
// green), with shrub object PNGs placed over the understorey clusters
// (same convention as wiese/bachufer).
export const waldrand = {
  id: "waldrand",
  name: "Waldrand",
  tileSize: 16,
  biotope: "waldrand",
  legend: {
    ".": { tile: "wiese",     solid: false, color: "#8bc34a", wang: "pl_gp" },
    ",": { tile: "wiese2",    solid: false, color: "#7cb342", wang: "pl_gp" },
    "#": { tile: "pfad",      solid: false, color: "#c8aa7a", wang: "pl_gp", terrain: "path" },
    "T": { tile: "baum",      solid: true,  color: "#558b2f", wang: "pl_gp" },
    "B": { tile: "strauch",   solid: true,  color: "#5a8a28", wang: "pl_gp" },
    "b": { tile: "strauch2",  solid: true,  color: "#5a8a28", wang: "pl_gp" },
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
  // Shrub object PNGs over the former biom bush clusters (bbb 3×3) and singles.
  objects: [
    { name: "shrub", x: 5,  y: 2,  tilew: 3, tileh: 3 },
    { name: "shrub", x: 21, y: 2,  tilew: 3, tileh: 3 },
    { name: "shrub", x: 5,  y: 14, tilew: 3, tileh: 3 },
    { name: "shrub", x: 21, y: 14, tilew: 3, tileh: 3 },
    { name: "shrub", x: 6,  y: 6,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 24, y: 6,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 4,  y: 10, tilew: 1, tileh: 1 },
    { name: "shrub", x: 25, y: 10, tilew: 1, tileh: 1 },
    { name: "shrub", x: 4,  y: 17, tilew: 1, tileh: 1 },
    { name: "shrub", x: 25, y: 17, tilew: 1, tileh: 1 },
    { name: "fern",  x: 12, y: 8,  tilew: 1, tileh: 1 },
    { name: "fern",  x: 18, y: 12, tilew: 1, tileh: 1 },
  ],
};
