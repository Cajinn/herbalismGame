// Dorf — village of Oberbottigen rebuilt to match aerial photo (pat's stuff/mapOberbottigen.png).
// North = top. East = right (alpweide, gated). West = stream. South = wiese.
//
// Grid: 30 cols × 22 rows, each exactly 30 chars.
// Main N-S path: col 6 (stream bridge at rows 0-1, south exit at row 21).
// Main E-W road: row 11 (west→stream exit col 0, east→alpweide exit col 29).
// Center branch path: col 14, rows 8-11 (connecting notice board to E-W road).
//
// Herbalist house (8w, roofBody 2): cols 20-27, rows 2-7. Door col 22 → cottage.
// Shop (3w, roofBody 1): cols 8-10, rows 3-7. Door col 9 → dorfladen station.
// Notice board (A) col 14, row 8 — village center (between shop and herbalist).
// Deposit box (C) col 17, row 8.
// Garden beds (E) cols 20-25, rows 9-10 — in front of herbalist house.
// Village well object at col 12, row 9.
//
// Five villager huts as building overlays:
//   W (0,15), CW (9,15), CE (15,16), SW (0,18), S (10,18).
//
// PixelLab Wang grass: `.`,`,` have `wang:"pl_gp"` so transition tiles render
// around paths. Path tiles also tagged `wang:"pl_gp"` to draw pure-path tile.
export const dorf = {
  id: "dorf",
  name: "Dorf",
  tileSize: 16,
  biotope: "dorf",
  legend: {
    // Ground — PixelLab Wang transitions computed at render time from path neighbors
    ".": { solid: false, color: "#7cb342", wang: "pl_gp" },
    ",": { solid: false, color: "#82c044", wang: "pl_gp" },
    // Path — pl_gp index 6 (wang_0 = pure dirt/lower terrain)
    "#": { solid: false, color: "#c8aa7a", wang: "pl_gp", terrain: "path" },
    // Water & bridge (Sprout Lands, keep as-is)
    "~": { solid: true,  color: "#4fc3f7", t: ["water",  0] },
    "=": { solid: false, color: "#c8a06a", t: ["bridge", 8] },
    // Trees (solid for collision; PixelLab tree_oak PNG drawn from objects array)
    "T": { solid: true,  color: "#5a8a28" },
    "B": { solid: true,  color: "#5a8a28" },
    // Garden beds (SL blob autotile, tilled_dirt.png)
    "E": { solid: false, color: "#8d6e4a", t: ["dirt", 28], terrain: "bed" },
    // Fences
    "f": { solid: true,  color: "#a07848", t: ["fences",  2] },
    "|": { solid: true,  color: "#a07848", t: ["fences",  0] },
    "c": { solid: true,  color: "#a07848", t: ["fences", 12] },
    // Station markers (solid for collision + proximity detection)
    // PixelLab notice-board and deposit-box PNGs render from objects array
    "A": { solid: true,  color: "#8d6e63" },  // Anschlagbrett
    "C": { solid: true,  color: "#a07848" },  // Abgabebox
  },

  // 30 cols × 22 rows. Building footprints are open ground here (`.`);
  // the overlay renderer draws roofs/walls and marks footprints solid.
  grid: [
    //0         1         2
    //0123456789012345678901234567890 (col index)
    "TT....=....TT.......TT....TT..",  // 0: bridge at col 6; T clusters
    "TT....#....TT.,,....TT....TT..",  // 1: path continues down col 6
    "......#..........B............",  // 2: herbalist house overlay (cols 20-27)
    "......#..........B............",  // 3: shop overlay (cols 8-10)
    "......#..........B............",  // 4
    ".B....#.......................",  // 5
    "......#.......................",  // 6
    "......#.......................",  // 7: herbalist door (22,7) → cottage
    ".B....#.......A..C............",  // 8: A=notice board(14,8), C=deposit(17,8)
    "......#.............E.E.E.....",  // 9: garden beds at cols 20, 22, 24
    "......#..............E.E......",  // 10: garden beds at cols 21, 23
    "##############################",  // 11: E-W exit road (full width #)
    "......#.......................",  // 12
    ".B....#.......................",  // 13
    "......#..................B....",  // 14
    "......#.......................",  // 15: villager huts (0,15) and (9,15) overlay
    "......#.......................",  // 16: villager hut (15,16) overlay
    "......#.......................",  // 17
    "......#.......................",  // 18: villager huts (0,18) and (10,18) overlay
    "......#.....B.................",  // 19
    ".B....#..................B....",  // 20
    "......#.......................",  // 21: south exit at (6,21) → wiese
  ],

  playerSpawn: { x: 15, y: 9 },

  exits: [
    { x: 6,  y: 21, target: "wiese",             spawn: { x: 15, y: 1  } },
    { x: 0,  y: 11, target: "bachufer",          spawn: { x: 29, y: 10 } },
    { x: 29, y: 11, target: "alpweide",          spawn: { x: 1,  y: 10 } },
    { x: 22, y: 7,  target: "kraeuterhaeuschen", spawn: { x: 9,  y: 10 } },
  ],

  beds: [
    { bedId: "bed-1", x: 20, y: 9  },
    { bedId: "bed-2", x: 22, y: 9  },
    { bedId: "bed-3", x: 24, y: 9  },
    { bedId: "bed-4", x: 21, y: 10 },
    { bedId: "bed-5", x: 23, y: 10 },
  ],

  stations: [
    { x: 9,  y: 8,  type: "dorfladen"     },  // one step south of shop door (9,7)
    { x: 14, y: 8,  type: "anschlagbrett" },
    { x: 17, y: 8,  type: "abgabebox"     },
  ],

  buildings: [
    { x: 20, y: 2,  w: 8, roofBody: 2, door: { dx: 2 } }, // herbalist house
    { x: 8,  y: 3,  w: 3, roofBody: 1, door: { dx: 1 } }, // shop
    { x: 0,  y: 15, w: 3, roofBody: 0, door: { dx: 1 } }, // villager hut W
    { x: 9,  y: 15, w: 3, roofBody: 0, door: { dx: 1 } }, // villager hut CW
    { x: 15, y: 16, w: 3, roofBody: 0, door: { dx: 1 } }, // villager hut CE
    { x: 0,  y: 18, w: 3, roofBody: 0, door: { dx: 1 } }, // villager hut SW (new)
    { x: 10, y: 18, w: 3, roofBody: 0, door: { dx: 1 } }, // villager hut S (new)
  ],

  // PixelLab PNG objects rendered after terrain + buildings, before characters.
  // tilew/tileh = grid-tile footprint the PNG is scaled to fill.
  objects: [
    // Oak trees — match photo's canopy clusters at borders
    { name: "tree_oak", x: 0,  y: 0,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 13, y: 0,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 20, y: 0,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 25, y: 0,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 1,  y: 5,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 17, y: 13, tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 1,  y: 19, tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 19, y: 19, tilew: 2, tileh: 2 },
    // Hedge shrub borders along field edges
    { name: "hedge",    x: 5,  y: 4,  tilew: 1, tileh: 1 },
    { name: "hedge",    x: 5,  y: 13, tilew: 1, tileh: 1 },
    // Village well in the open center (matches photo — Swiss hamlets have wells)
    { name: "well",     x: 12, y: 9,  tilew: 1, tileh: 1 },
    // Station objects (render over the solid placeholder tiles A and C)
    { name: "notice_board", x: 14, y: 8, tilew: 1, tileh: 1 },
    { name: "deposit_box",  x: 17, y: 8, tilew: 1, tileh: 1 },
  ],
};
