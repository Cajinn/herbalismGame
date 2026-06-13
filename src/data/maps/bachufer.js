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
    ".": { tile: "ufer",    solid: false, color: "#7cb342", t: ["grass", 55] },
    ",": { tile: "ufer2",   solid: false, color: "#82c044", t: ["grass", 56] },
    "#": { tile: "pfad",    solid: false, color: "#c8aa7a", t: ["dirt",  55], terrain: "path" },
    "O": { tile: "wasser",  solid: true,  color: "#4fc3f7", t: ["water",  0] },
    "B": { tile: "strauch", solid: true,  color: "#8bc34a", t: ["biom",  27] },
    "T": { tile: "baum",    solid: true,  color: "#8bc34a", t: ["biom",  28] },
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
    "###############################",
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
};
