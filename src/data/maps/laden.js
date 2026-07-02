// Dorfladen — the village grocery (warm wood, V2). 20×14, rendered zoomed-in
// (map.zoom) so it feels intimate and scrolls. Entered from the dorf shop door
// (9,7); exit at the bottom → dorf (9,8). One `dorfladen` station at the counter.
//
// A warm grocery zoned into a checkout (back-centre counter + barrels), two
// shelf clusters per side wall (back corners + lower corners, with an open
// mid-wall aisle instead of shelving on every row), and a browsing aisle of
// crates/sacks/baskets down the middle. Lightly de-cluttered from the V2 pass
// (fewer loose displays, mid-wall shelves removed) with ground shadows on
// every free-standing floor piece.
const FLOOR = "#9c6b3f";
export const laden = {
  id: "laden",
  name: "Dorfladen",
  tileSize: 16,
  biotope: "dorf",
  zoom: 1.6,                                   // interior zoom (camera follows player)
  ambient: { tint: "#7a5a30", alpha: 0.06 },   // light warm daytime tint
  legend: {
    ".": { solid: false, color: FLOOR, img: "th_floor" }, // warm plank floor
    "X": { solid: true,  color: FLOOR, img: "th_floor" }, // furniture footprint
    "E": { solid: false, color: FLOOR, img: "th_floor" }, // exit threshold
    "W": { solid: true,  color: "#6b4626" },              // warm wood wall
    "T": { solid: true,  color: "#4a2f18" },              // wall top trim
  },
  // 20 cols × 14 rows — every row exactly 20 chars. X = furniture footprint.
  grid: [
    "TTTTTTTTTTTTTTTTTTTT", //  0: wall top trim
    "WWWWWWWWWWWWWWWWWWWW", //  1: back wall face
    "WXX....XXXX......XXW", //  2: shelf | counter (7-10) | shelf
    "W..................W", //  3: counter front (station)
    "W..................W", //  4
    "W..................W", //  5: open aisle (mid-wall shelf removed for breathing room)
    "W..................W", //  6
    "W..................W", //  7
    "WXX..............XXW", //  8: side shelves
    "WXX..............XXW", //  9
    "W..................W", // 10
    "W...XX........XX...W", // 11: floor produce-crate displays
    "W..................W", // 12
    "WWWWWWWWWEEWWWWWWWWW", // 13: exit at cols 9-10
  ],
  playerSpawn: { x: 10, y: 12 },
  exits: [
    { x: 9,  y: 13, target: "dorf", spawn: { x: 9, y: 8 } },
    { x: 10, y: 13, target: "dorf", spawn: { x: 9, y: 8 } },
  ],
  stations: [
    { x: 9, y: 3, type: "dorfladen" }, // in front of the counter
  ],
  objects: [
    // Back-centre counter with register (128×64 → 2:1) — the checkout zone.
    { name: "shop_counter", x: 6.4, y: 0.7, tilew: 4, tileh: 2 },
    { name: "shop_barrels", x: 11.5, y: 2.6, tilew: 1.8, tileh: 1.8, shadow: true }, // by counter

    // Side-wall produce shelves grouped as two stacked zones per wall, with a
    // clear gap at mid-wall instead of a shelf on every row.
    { name: "produce_shelf", x: 0.8,  y: 0.5, tilew: 2.4, tileh: 2.2 }, // back-left
    { name: "produce_shelf", x: 16.8, y: 0.5, tilew: 2.4, tileh: 2.2 }, // back-right
    { name: "bread_shelf",   x: 0.8,  y: 7.6, tilew: 2.4, tileh: 1.8 }, // left-lower
    { name: "produce_shelf", x: 16.8, y: 7.3, tilew: 2.4, tileh: 2.2 }, // right-lower

    // Floor produce-crate displays (96×64 → 1.5) — the browsing aisle.
    { name: "shop_crates", x: 3.3,  y: 10.1, tilew: 2.4, tileh: 1.6, shadow: true },
    { name: "shop_crates", x: 13.3, y: 10.1, tilew: 2.4, tileh: 1.6, shadow: true },
    { name: "grain_sacks",    x: 3.1, y: 3.0, tilew: 1.5, tileh: 1.08, shadow: true },
    { name: "produce_baskets", x: 7.4, y: 6.7, tilew: 1.8, tileh: 0.92, shadow: true },
    { name: "produce_baskets", x: 10.4, y: 10.1, tilew: 1.8, tileh: 0.92, shadow: true },

    // ── Decor (non-blocking) ─────────────────────────────────────────────────
    { name: "th_plant", x: 1.1,  y: 11.6, tilew: 0.85, tileh: 1.16, shadow: true },
    { name: "th_plant", x: 17.1, y: 11.6, tilew: 0.85, tileh: 1.16, shadow: true },

    // Exit door (128×64 → true 2:1 aspect — was stretched to 1.71:1 before, fixed here).
    { name: "th_door", x: 8.4, y: 11.6, tilew: 2.4, tileh: 1.2 },
  ],
};
