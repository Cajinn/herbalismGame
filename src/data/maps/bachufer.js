// Bachufer — streamside map east of the village.
// A stream runs vertically through the center; grassy banks either side.
// Horizontal path at row 10 leads back west to dorf (col 0 exit).
// Sprout Lands tiles:
//   grass[55] = flat ground  grass[56] = alt
//   water[0]  = teal water
//   bridge[5] = vertical bridge left plank (row1 col0) — used as bridge over stream
//   bridge[6] = vertical bridge right plank (row1 col1)
//   dirt[55]  = sandy path
//   biom[27]  = pink bush  biom[28] = rose bush
export const bachufer = {
  id: "bachufer",
  name: "Bachufer",
  tileSize: 16,
  biotope: "bachufer",
  legend: {
    ".": { tile: "ufer",    solid: false, color: "#7cb342", wang: "pl_gw" },
    ",": { tile: "ufer2",   solid: false, color: "#82c044", wang: "pl_gw" },
    "#": { tile: "pfad",    solid: false, color: "#c8aa7a", wang: "pl_gp", terrain: "path" },
    "O": { tile: "wasser",  solid: true,  color: "#4fc3f7", t: ["water",  0], terrain: "water" },
    "B": { tile: "strauch", solid: true,  color: "#5a8a28", wang: "pl_gp" },
    "T": { tile: "baum",    solid: true,  color: "#558b2f", wang: "pl_gp" },
    "=": { solid: false, color: "#c8a06a", t: ["bridge", 8] },
  },
  grid: [
    "TTTTTTTTTTTTTTTTOOOTTTTTTTTTTTT",
    "T................OO...........T",
    "T................OO.......B...T",
    "T....B...........OO...........T",
    "T................OO...........T",
    "T................OO...........T",
    "T....B...........OO...B.......T",
    "T................OO...........T",
    "T................OO...........T",
    "T................OO...........T",
    "#################==############",  // bridge at cols 17-18 over stream
    "T................OO...........T",
    "T....B...........OO...........T",
    "T................OO...........T",
    "T................OO.......B...T",
    "T................OO...........T",
    "T....B...........OO...........T",
    "T................OO...........T",
    "T................OO...........T",
    "TTTTTTTTTTTTTTTTOOOTTTTTTTTTTTT",
  ],
  playerSpawn: { x: 29, y: 10 },
  exits: [
    // East edge ← back to the village (you arrive here walking west out of dorf).
    { x: 30, y: 10, target: "dorf", spawn: { x: 1, y: 11 } },
    // West edge → deeper into the woods.
    { x: 0, y: 10, target: "wald", spawn: { x: 15, y: 18 } },
  ],
  objects: [
    { name: "stream_reeds", x: 18, y: 3,  tilew: 1, tileh: 1 },
    { name: "stream_reeds", x: 18, y: 7,  tilew: 1, tileh: 1 },
    { name: "stream_reeds", x: 18, y: 13, tilew: 1, tileh: 1 },
    { name: "wildflowers",  x: 6,  y: 4,  tilew: 1, tileh: 1 },
    { name: "wildflowers",  x: 22, y: 2,  tilew: 1, tileh: 1 },
    { name: "wildflowers",  x: 25, y: 14, tilew: 1, tileh: 1 },
    // Bridge over stream at road crossing (cols 17-18)
    { name: "bridge", x: 17, y: 10, tilew: 2, tileh: 1 },
    // Shrubs replacing former B biom tiles
    { name: "shrub", x: 26, y: 2,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 5,  y: 3,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 5,  y: 6,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 22, y: 6,  tilew: 1, tileh: 1 },
    { name: "shrub", x: 5,  y: 12, tilew: 1, tileh: 1 },
    { name: "shrub", x: 26, y: 14, tilew: 1, tileh: 1 },
    { name: "shrub", x: 5,  y: 16, tilew: 1, tileh: 1 },
  ],
};
