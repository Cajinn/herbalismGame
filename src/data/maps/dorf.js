// Dorf — village of Oberbottigen rebuilt to match aerial photo (pat's stuff/mapOberbottigen.png).
// North = top. East = right (alpweide, gated). West = stream. South = wiese.
//
// Grid: 30 cols × 22 rows, each exactly 30 chars.
// Main N-S path: col 6 (stream bridge at rows 0-1, south exit at row 21).
// Main E-W road: row 11 (west→stream exit col 0, east→alpweide exit col 29).
// Center branch path: col 14, rows 8-11 (connecting notice board to E-W road).
//
// Herbalist house (8w, roofBody 2): cols 20-27, rows 1-6. Door col 22 → cottage.
// Shop (3w, roofBody 1): cols 8-10, rows 3-7. Door col 9 → dorfladen station.
// Notice board (A) col 14, row 8 — village center (between shop and herbalist).
// Deposit box (C) col 17, row 8.
// Garden beds (E) cols 20-22, 24-26, rows 8-10 — in front of herbalist house.
// Village well object at cols 10-11, rows 8-9 (2×2).
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
    // biom fallback renders when no tree_oak PNG covers this tile.
    "T": { solid: true,  color: "#5a8a28", wang: "pl_gp" },
    // B = decorative bush; wang renders as grass so no biom background square shows
    "B": { solid: false, color: "#5a8a28", wang: "pl_gp" },
    // Garden beds — wang grass so background blends; garden_plot PNGs render on top
    "E": { solid: false, color: "#6b4423", wang: "pl_gp" },
    // Fences
    "f": { solid: true,  color: "#a07848", t: ["fences",  2] },
    "|": { solid: true,  color: "#a07848", t: ["fences",  0] },
    "c": { solid: true,  color: "#a07848", t: ["fences", 12] },
    // Station markers (solid for collision + proximity detection)
    // PixelLab notice-board and deposit-box PNGs render from objects array
    "A": { solid: true,  color: "#8d6e63", wang: "pl_gp" },  // Anschlagbrett
    "C": { solid: true,  color: "#a07848", wang: "pl_gp" },  // Abgabebox
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
    "......#.......................",  // 6: herbalist door (22,6) → cottage
    "......#.......................",  // 7: free ground (below house)
    ".B....#.......A..C..EEE#EEE...",  // 8: A=notice board(14,8), C=deposit(17,8); garden (col 23 = stone path)
    "......#.............EEE#EEE...",  // 9: garden row 2
    "......#.............EEE#EEE...",  // 10: garden row 3 (18 beds: 2 plots × 3×3)
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
    { x: 22, y: 6,  target: "kraeuterhaeuschen", spawn: { x: 9,  y: 10 }, keyEnter: true },
    { x: 9,  y: 7,  target: "laden",             spawn: { x: 10, y: 12 }, keyEnter: true },
  ],

  beds: [
    { bedId: "bed-1",  x: 20, y: 8  },
    { bedId: "bed-2",  x: 21, y: 8  },
    { bedId: "bed-3",  x: 22, y: 8  },
    { bedId: "bed-4",  x: 24, y: 8  },
    { bedId: "bed-5",  x: 25, y: 8  },
    { bedId: "bed-6",  x: 26, y: 8  },
    { bedId: "bed-9",  x: 20, y: 9  },
    { bedId: "bed-10", x: 21, y: 9  },
    { bedId: "bed-11", x: 22, y: 9  },
    { bedId: "bed-12", x: 24, y: 9  },
    { bedId: "bed-13", x: 25, y: 9  },
    { bedId: "bed-14", x: 26, y: 9  },
    { bedId: "bed-17", x: 20, y: 10 },
    { bedId: "bed-18", x: 21, y: 10 },
    { bedId: "bed-19", x: 22, y: 10 },
    { bedId: "bed-20", x: 24, y: 10 },
    { bedId: "bed-21", x: 25, y: 10 },
    { bedId: "bed-22", x: 26, y: 10 },
  ],

  stations: [
    { x: 14, y: 8,  type: "anschlagbrett" },
    { x: 17, y: 8,  type: "abgabebox"     },
  ],

  buildings: [
    { x: 20, y: 1,  w: 8, roofBody: 2, door: { dx: 2 }, noRender: true }, // herbalist house
    { x: 8,  y: 3,  w: 3, roofBody: 1, door: { dx: 1 }, noRender: true }, // shop
    { x: 0,  y: 15, w: 3, roofBody: 0, door: { dx: 1 }, noRender: true }, // villager hut W
    { x: 9,  y: 15, w: 3, roofBody: 0, door: { dx: 1 }, noRender: true }, // villager hut CW
    { x: 15, y: 16, w: 3, roofBody: 0, door: { dx: 1 }, noRender: true }, // villager hut CE
    { x: 0,  y: 18, w: 3, roofBody: 0, door: { dx: 1 }, noRender: true }, // villager hut SW
    { x: 10, y: 18, w: 3, roofBody: 0, door: { dx: 1 }, noRender: true }, // villager hut S
  ],

  // PixelLab PNG objects rendered after terrain + buildings, before characters.
  // tilew/tileh = grid-tile footprint the PNG is scaled to fill.
  objects: [
    // Oak trees — match photo's canopy clusters at borders
    { name: "tree_oak", x: 0,  y: 0,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 11, y: 0,  tilew: 2, tileh: 2 },  // T tiles at cols 11-12
    { name: "tree_oak", x: 20, y: 0,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 26, y: 0,  tilew: 2, tileh: 2 },  // T tiles at cols 26-27
    { name: "tree_oak", x: 1,  y: 5,  tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 17, y: 13, tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 1,  y: 19, tilew: 2, tileh: 2 },
    { name: "tree_oak", x: 19, y: 19, tilew: 2, tileh: 2 },
    // Hedge shrub borders along field edges
    // Wildflowers at former B-tile positions (B now renders as grass)
    { name: "wildflowers", x: 17, y: 2,  tilew: 1, tileh: 1 },
    { name: "wildflowers", x: 17, y: 4,  tilew: 1, tileh: 1 },
    { name: "fern",        x: 12, y: 19, tilew: 1, tileh: 1 },
    // Village well — 2×2 so it reads clearly in the village square
    { name: "well",     x: 10, y: 8,  tilew: 2, tileh: 2 },
    // Station objects — notice board is 1×2 (post + board); deposit box 1×1
    { name: "notice_board", x: 14, y: 7, tilew: 1, tileh: 2 },
    { name: "deposit_box",  x: 17, y: 8, tilew: 1, tileh: 1 },
    // Garden plot overlays — 3 raised-bed plots covering the 24 E tiles
    { name: "garden_plot_3x3", x: 20, y: 8, tilew: 3, tileh: 3 },
    { name: "garden_plot_3x3", x: 24, y: 8, tilew: 3, tileh: 3 },
    // PixelLab buildings — replace SL tile renderer (noRender on buildings entries)
    // Footprint h = roofBody + 4. Huts alternate a/b for variety.
    { name: "herbalist_house", x: 20, y: 1,  tilew: 8, tileh: 6 },
    { name: "shop",            x: 8,  y: 3,  tilew: 3, tileh: 5 },
    { name: "hut_a",           x: 0,  y: 15, tilew: 3, tileh: 4 },
    { name: "hut_b",           x: 9,  y: 15, tilew: 3, tileh: 4 },
    { name: "hut_a",           x: 15, y: 16, tilew: 3, tileh: 4 },
    { name: "hut_b",           x: 0,  y: 18, tilew: 3, tileh: 4 },
    { name: "hut_a",           x: 10, y: 18, tilew: 3, tileh: 4 },
  ],
};
