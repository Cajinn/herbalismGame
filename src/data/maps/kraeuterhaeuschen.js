// Kräuterhäuschen — the herbalist's home (warm-wood apothecary, V2).
// 20×14 single room, rendered zoomed-in (map.zoom) so it feels intimate and
// scrolls as the player walks. Reached from dorf (press E on the house at 22,6);
// new games start here. Exit at the bottom → dorf (22,7).
//
// Furniture footprints read in proportion to the ~1.5-tile avatar, and pieces +
// greenery line all four walls + centre so every screen stays full. Two layers:
//   1. Base furniture (objects[]) — empty warm-wood pieces.
//   2. Stateful content (content[]) — jars/bundles/glow drawn ON TOP from live
//      game state (main.js render()): storage shelf fills per stored herb, drying
//      rack + sun-window hang bundles per herb drying, hearth glows while cooking.
//
// Stations (7): vorratsregal, sonnenfenster, herd, dachboden, moerser, buchstand,
//   bett. Player spawns on the central rug.
const FLOOR = "#9c6b3f";
export const kraeuterhaeuschen = {
  id: "kraeuterhaeuschen",
  name: "Kräuterhäuschen",
  tileSize: 16,
  biotope: "garten",
  zoom: 1.6,                                   // interior zoom (camera follows player)
  ambient: { tint: "#6a4524", alpha: 0.14 },   // cozy warm interior dim
  legend: {
    ".": { solid: false, color: FLOOR, img: "th_floor" }, // walkable floor
    "X": { solid: true,  color: FLOOR, img: "th_floor" }, // furniture footprint
    "E": { solid: false, color: FLOOR, img: "th_floor" }, // exit threshold
    "W": { solid: true,  color: "#6b4626" },              // warm wood wall
    "T": { solid: true,  color: "#4a2f18" },              // wall top trim
  },
  // 20 cols × 14 rows — every row exactly 20 chars. X = furniture footprint.
  grid: [
    "TTTTTTTTTTTTTTTTTTTT", //  0: wall top trim
    "WWWWWWWWWWWWWWWWWWWW", //  1: back wall face
    "WXXXX.XX..XXX.XX...W", //  2: shelf|cab | window | hearth | rack
    "W.........XXX......W", //  3: hearth is deep
    "W..................W", //  4
    "W.......XXX........W", //  5: central prep bench (8-10)
    "WXX............XX..W", //  6: work desk (1-2) | bed (15-16)
    "W..............XX..W", //  7: bed
    "W.......X..........W", //  8: book stand (8) on rug
    "WXX.............XX.W", //  9: mortar (1-2) | side cabinet (16-17)
    "WXX.............XX.W", // 10: mortar | side cabinet
    "W..................W", // 11
    "W..................W", // 12
    "WWWWWWWWWEEWWWWWWWWW", // 13: exit at cols 9-10
  ],
  playerSpawn: { x: 9, y: 10 },
  exits: [
    { x: 9,  y: 13, target: "dorf", spawn: { x: 22, y: 7 } },
    { x: 10, y: 13, target: "dorf", spawn: { x: 22, y: 7 } },
  ],
  objects: [
    // Floor decal — big warm rug the player spawns on (flat: under furniture).
    { name: "th_rug", x: 6, y: 7, tilew: 4, tileh: 2.67, flat: true },
    // Back wall L→R.
    { name: "th_shelf",   x: 1,   y: 0.7, tilew: 2.2, tileh: 1.83 }, // storage (vorratsregal)
    { name: "th_cabinet", x: 3,   y: 0.4, tilew: 1.5, tileh: 2.1  }, // jar cabinet (decor)
    { name: "th_window",  x: 5.6, y: 0.7, tilew: 2.4, tileh: 2.0  }, // sun-window (sonnenfenster)
    { name: "th_hearth",  x: 9.7, y: 0.5, tilew: 2.7, tileh: 2.3  }, // hearth (herd)
    { name: "th_rack",    x: 14,  y: 0.9, tilew: 2.4, tileh: 1.6  }, // drying rack (dachboden)
    // Centre — prep bench + study lectern on the rug.
    { name: "work_table",   x: 7.6, y: 4.7, tilew: 3.3, tileh: 0.94 },
    { name: "th_bookstand", x: 7.4, y: 7.3, tilew: 1.4, tileh: 1.4  }, // buchstand
    // Left wall — work desk + mortar.
    { name: "th_work_desk",   x: 1, y: 5.6, tilew: 2.0, tileh: 1.33 },
    { name: "th_mortar_desk", x: 1, y: 8.4, tilew: 1.7, tileh: 1.7  }, // moerser
    // Right wall — sleeping nook + a second cabinet.
    { name: "bed",        x: 14.6, y: 5.7, tilew: 2.4, tileh: 1.6 }, // bett
    { name: "th_cabinet", x: 16,   y: 8.3, tilew: 1.5, tileh: 2.1 }, // decor storage
    // ── Greenery & decor (non-blocking) ──────────────────────────────────────
    // back-wall gaps
    { name: "th_plant",  x: 4.6,  y: 2.7,  tilew: 0.85, tileh: 1.16 },
    { name: "th_flower", x: 8.4,  y: 2.9,  tilew: 0.85, tileh: 1.0  },
    { name: "th_plant",  x: 12.9, y: 2.8,  tilew: 0.85, tileh: 1.16 },
    { name: "th_flower", x: 16.4, y: 2.6,  tilew: 0.85, tileh: 1.0  },
    // planters / herb troughs
    { name: "th_trough", x: 11.9, y: 7.5,  tilew: 1.8,  tileh: 0.93 },
    { name: "th_trough", x: 3.0,  y: 3.8,  tilew: 1.8,  tileh: 0.93 },
    // side-wall greenery
    { name: "fern",      x: 17.1, y: 4.2,  tilew: 1,    tileh: 1 },
    { name: "fern",      x: 2.2,  y: 3.9,  tilew: 1,    tileh: 1 },
    { name: "mushrooms", x: 1.3,  y: 7.0,  tilew: 1,    tileh: 1 },
    { name: "th_flower", x: 17.4, y: 6.8,  tilew: 0.85, tileh: 1.0  },
    { name: "th_plant",  x: 13.0, y: 10.4, tilew: 0.85, tileh: 1.16 },
    { name: "th_flower", x: 10.6, y: 9.9,  tilew: 0.85, tileh: 1.0  },
    // bottom-wall line
    { name: "th_plant",     x: 1.2,  y: 11.8, tilew: 0.85, tileh: 1.16 },
    { name: "th_flower",    x: 3.9,  y: 11.6, tilew: 0.85, tileh: 1.0  },
    { name: "wildflowers",  x: 5.9,  y: 11.4, tilew: 1,    tileh: 1 },
    { name: "th_flower",    x: 12.0, y: 11.6, tilew: 0.85, tileh: 1.0  },
    { name: "th_plant",     x: 14.4, y: 11.7, tilew: 0.85, tileh: 1.16 },
    { name: "th_plant",     x: 17,   y: 11.8, tilew: 0.85, tileh: 1.16 },
    // seating
    { name: "th_stool", x: 3.2,  y: 6.4,  tilew: 0.8, tileh: 0.92 },
    { name: "th_stool", x: 10.5, y: 8.4,  tilew: 0.8, tileh: 0.92 },
    // Exit door (128×64 → 2:1), sized to read as a real doorway.
    { name: "th_door", x: 8.4, y: 11.6, tilew: 2.4, tileh: 1.4 },
  ],
  // Stateful content overlays — see main.js render(). Slot coords are in tiles.
  content: [
    { kind: "fill", source: "storage", sprite: ["th_c_jar", "th_c_bundle"], size: 0.6, slots: [
      [1.2, 1.0], [1.95, 1.0], [1.2, 1.75], [1.95, 1.75],
    ] },
    { kind: "fill", source: "drying", sprite: "th_c_hang", size: 0.7, slots: [
      [14.3, 1.15], [15.0, 1.15], [15.7, 1.15],
    ] },
    { kind: "fill", source: "sonnenfenster", sprite: "th_c_hang", size: 0.6, slots: [
      [6.0, 1.0], [6.7, 1.0], [7.4, 1.0],
    ] },
    { kind: "glow", source: "herd", at: [11.0, 2.2, 1.2] },
  ],
  stations: [
    { x: 2,  y: 3,  type: "vorratsregal"  }, // storage shelf
    { x: 7,  y: 3,  type: "sonnenfenster" }, // sun-window
    { x: 11, y: 4,  type: "herd"          }, // hearth
    { x: 15, y: 3,  type: "dachboden"     }, // drying rack
    { x: 3,  y: 9,  type: "moerser"       }, // mortar desk
    { x: 8,  y: 9,  type: "buchstand"     }, // book stand
    { x: 15, y: 8,  type: "bett"          }, // bed
  ],
};
