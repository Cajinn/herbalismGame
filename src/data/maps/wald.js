// Wald — deep forest. Dense trees with three spacious clearings.
// Path at col 15 runs north-south; exit south → bachufer; north = dead end.
// Clearings at rows 3-7, 9-13, 15-18 (9 tiles wide, cols 11-19).
// T tiles covered visually by forest_pine / forest_oak PNG objects.
export const wald = {
  id: "wald",
  name: "Wald",
  tileSize: 16,
  biotope: "wald",
  legend: {
    ".": { solid: false, color: "#2d4a1e" },
    "#": { solid: false, color: "#c9b896", wang: "pl_gp", terrain: "path" },
    "T": { solid: true,  color: "#1b3d14" },
    "F": { solid: false, color: "#6a9449", wang: "pl_gp" },
  },
  grid: [
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",  //  0: dead-end north
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",  //  1
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",  //  2
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  //  3: clearing 1 start
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  //  4
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  //  5
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  //  6
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  //  7: clearing 1 end
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",  //  8: dense tree band
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  //  9: clearing 2 start
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 10
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 11
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 12
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 13: clearing 2 end
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",  // 14: dense tree band
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 15: clearing 3 start
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 16
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 17
    "TTTTTTTTTTTFFFF#FFFFTTTTTTTTTTT",  // 18: clearing 3 end
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",  // 19: exit south at col 15
  ],
  playerSpawn: { x: 15, y: 18 },
  exits: [
    { x: 15, y: 19, target: "bachufer", spawn: { x: 1, y: 10 } },
  ],
  objects: [
    // ── Left dense strip (cols 0–10) — tight staggered grid ──
    { name: "forest_pine", x: 0,  y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 3,  y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 7,  y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 1,  y: 2,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 5,  y: 2,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 9,  y: 1,  tilew: 2, tileh: 2 },
    // clearing 1 flanks (cols 0-10, rows 3-7)
    { name: "forest_pine", x: 0,  y: 3,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 3,  y: 4,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 7,  y: 3,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 1,  y: 6,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 5,  y: 5,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 9,  y: 5,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 0,  y: 7,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 7,  y: 6,  tilew: 2, tileh: 2 },
    // band row 8
    { name: "forest_pine", x: 3,  y: 8,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 7,  y: 8,  tilew: 2, tileh: 2 },
    // clearing 2 flanks (cols 0-10, rows 9-13)
    { name: "forest_pine", x: 0,  y: 9,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 5,  y: 9,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 9,  y: 10, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 1,  y: 11, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 5,  y: 12, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 8,  y: 12, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 0,  y: 13, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 3,  y: 13, tilew: 2, tileh: 2 },
    // band row 14
    { name: "forest_pine", x: 1,  y: 14, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 6,  y: 14, tilew: 2, tileh: 2 },
    // clearing 3 flanks (cols 0-10, rows 15-18)
    { name: "forest_oak",  x: 0,  y: 15, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 4,  y: 15, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 8,  y: 15, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 2,  y: 17, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 6,  y: 17, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 0,  y: 18, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 9,  y: 18, tilew: 2, tileh: 2 },
    // ── Right dense strip (cols 20–30) — mirror pattern ──
    { name: "forest_oak",  x: 20, y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 24, y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 28, y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 22, y: 1,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 26, y: 2,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 20, y: 2,  tilew: 2, tileh: 2 },
    // clearing 1 flanks right
    { name: "forest_oak",  x: 20, y: 3,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 24, y: 4,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 28, y: 3,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 22, y: 6,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 26, y: 5,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 20, y: 5,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 28, y: 6,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 24, y: 7,  tilew: 2, tileh: 2 },
    // band row 8 right
    { name: "forest_oak",  x: 20, y: 8,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 25, y: 8,  tilew: 2, tileh: 2 },
    // clearing 2 flanks right
    { name: "forest_pine", x: 21, y: 9,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 26, y: 9,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 20, y: 11, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 24, y: 10, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 28, y: 11, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 22, y: 12, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 26, y: 13, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 20, y: 13, tilew: 2, tileh: 2 },
    // band row 14 right
    { name: "forest_pine", x: 22, y: 14, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 27, y: 14, tilew: 2, tileh: 2 },
    // clearing 3 flanks right
    { name: "forest_pine", x: 21, y: 15, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 25, y: 15, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 29, y: 15, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 23, y: 17, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 27, y: 17, tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 20, y: 18, tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 28, y: 18, tilew: 2, tileh: 2 },
    // ── Top connector strip (rows 0–2, cols 11–19 all T) ──
    { name: "forest_pine", x: 11, y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 14, y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 17, y: 0,  tilew: 2, tileh: 2 },
    { name: "forest_oak",  x: 12, y: 1,  tilew: 2, tileh: 2 },
    { name: "forest_pine", x: 17, y: 2,  tilew: 2, tileh: 2 },
    // ── Clearing atmosphere ──
    { name: "mushrooms",  x: 11, y: 4,  tilew: 1, tileh: 1 },
    { name: "mushrooms",  x: 19, y: 6,  tilew: 1, tileh: 1 },
    { name: "mushrooms",  x: 13, y: 11, tilew: 1, tileh: 1 },
    { name: "mushrooms",  x: 17, y: 12, tilew: 1, tileh: 1 },
    { name: "mushrooms",  x: 19, y: 17, tilew: 1, tileh: 1 },
    { name: "fern",       x: 19, y: 3,  tilew: 1, tileh: 1 },
    { name: "fern",       x: 14, y: 7,  tilew: 1, tileh: 1 },
    { name: "fern",       x: 11, y: 10, tilew: 1, tileh: 1 },
    { name: "fern",       x: 18, y: 15, tilew: 1, tileh: 1 },
    { name: "tree_stump", x: 16, y: 5,  tilew: 1, tileh: 1 },
    { name: "fallen_log", x: 12, y: 13, tilew: 1, tileh: 1 },
  ],
};
