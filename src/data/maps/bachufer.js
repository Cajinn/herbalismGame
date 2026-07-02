// Bachufer — streamside map east of the village.
// A stream runs vertically through the center; grassy banks either side.
// Horizontal path at row 10 leads back west to dorf (col 0 exit).
// Sprout Lands tiles:
//   grass[55] = flat ground  grass[56] = alt
//   water[0]  = teal water
//   bridge object (assets/objects/bridge.png) spans the stream at the path row
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
    "O": { tile: "wasser",  solid: true,  color: "#3a6ea5", wang: "pl_gw", terrain: "water" },
    "B": { tile: "strauch", solid: true,  color: "#5a8a28", wang: "pl_gp" },
    "T": { tile: "baum",    solid: true,  color: "#558b2f", wang: "pl_gp" },
    "=": { solid: false, color: "#3a6ea5", wang: "pl_gw", terrain: "water" },
  },
  grid: [
    "TTTTTTTTTTTTTTTTTOOTTTTTTTTTTTT",
    "T................OO...........T",
    "T................OO.......B...T",
    "T....B...........OO...........T",
    "T................OO...........T",
    "T................OO...........T",
    "T....B...........OO...B.......T",
    "T................OO...........T",
    "T................OO...........T",
    "T................OO...........T",
    "#################==############",  // bridge over the stream at cols 17-18
    "T................OO...........T",
    "T....B...........OO...........T",
    "T................OO...........T",
    "T................OO.......B...T",
    "T................OO...........T",
    "T....B...........OO...........T",
    "T................OO...........T",
    "T................OO...........T",
    "TTTTTTTTTTTTTTTTTOOTTTTTTTTTTTT",
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
    // Bridge over stream at the road crossing. Art is 38x28 px (2.375x1.75
    // tiles at native scale): fractional x/y center the walkway on the water
    // columns (17-18) and path row 10, railings overhanging the banks.
    { name: "bridge", x: 16.8125, y: 9.625, tilew: 2.375, tileh: 1.75 },
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
