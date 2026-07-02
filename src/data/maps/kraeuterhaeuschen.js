// Kräuterhäuschen — the herbalist's home (warm-wood apothecary, V2.1 layout).
// 24×16 single room, rendered zoomed-in (map.zoom) so it still feels intimate
// while giving the furniture room to breathe. Reached from dorf (press E on
// the house at 22,6); new games start here. Exit at the bottom → dorf (22,7).
//
// Composed in ZONES with deliberate negative space between them (the old
// 20×14 room lined every wall with ~17 filler plants and read as cluttered —
// this version keeps decor to a handful of pieces and gives each function —
// storage, light, heat, drying, study, grinding, sleeping, prep — its own
// clear spot with ≥2-tile walkways between). Two render layers:
//   1. Base furniture (objects[]) — empty warm-wood pieces.
//   2. Stateful content (content[]) — jars/bundles/glow drawn ON TOP from live
//      game state (main.js render()): storage shelf fills per stored herb, drying
//      rack + sun-window hang bundles per herb drying, hearth glows while cooking.
//
// Stations (7): vorratsregal, sonnenfenster, herd, dachboden, moerser, buchstand,
//   bett. Player spawns beside the centre rug.
const FLOOR = "#9c6b3f";
export const kraeuterhaeuschen = {
  id: "kraeuterhaeuschen",
  name: "Kräuterhäuschen",
  tileSize: 16,
  biotope: "garten",
  zoom: 1.4,                                   // interior zoom (camera follows player)
  ambient: { tint: "#6a4524", alpha: 0.14 },   // cozy warm interior dim
  legend: {
    ".": { solid: false, color: FLOOR, img: "th_floor" }, // walkable floor
    "X": { solid: true,  color: FLOOR, img: "th_floor" }, // furniture footprint
    "E": { solid: false, color: FLOOR, img: "th_floor" }, // exit threshold
    "W": { solid: true,  color: "#6b4626" },              // warm wood wall
    "T": { solid: true,  color: "#4a2f18" },              // wall top trim
  },
  // 24 cols × 16 rows — every row exactly 24 chars. X = furniture footprint.
  //
  //   row  0    T T T T T T T T T T T T T T T T T T T T T T T T
  //   row  1    W . . . . . . . . . . . . . . . . . . . . . . W   back wall
  //   row  2    W[shelf|cab] . . [win1] . . [ hearth ] . [win2] . W   work wall | light | hearth | light
  //   row  3    W . . . . . . . . . . . . . [hearth] . . . . . . W
  //   row  4    W . . . . . . . . . . . . . . . . . . . . . . W   negative space
  //   row  5    W[desk] . . . . . . . . . . . . . . . . . [rack]W   study | drying corner
  //   row  6    W . [book] . . . . . . . . . . . . . . . . . . W
  //   row  7    W . . . . . . . . [ rug  ] . . . . . . . . . . W
  //   row  8    W . . . . . . . . [ rug  ] . . . . . . . . . . W   centre rug
  //   row  9    W[mortar] . . . . . [table] . . . . . . [bed]  W   mortar | anchor table | sleep nook
  //   row 10    W[mortar] . . . . . . . . . . . . . . . [bed]  W
  //   row 11    W . . . . . . . . . . . . . . . . . . . . . . W
  //   row 12    W . . . . . . . . . . . . . . . . . . . . . . W   door approach (open)
  //   row 13    W . . . . . . . . . . . . . . . . . . . . . . W
  //   row 14    W . . . . . . . . . . . . . . . . . . . . . . W
  //   row 15    W W W W W W W W W W W E E W W W W W W W W W W W   exit cols 11-12
  grid: [
    "TTTTTTTTTTTTTTTTTTTTTTTT", //  0: wall top trim
    "WWWWWWWWWWWWWWWWWWWWWWWW", //  1: back wall face
    "WXXXXX...XX...XXX..XX..W", //  2: shelf+cabinet | window1 | hearth | window2
    "W.............XXX......W", //  3: hearth is deep
    "W......................W", //  4: negative space
    "WXX..................XXW", //  5: work desk (1-2) | drying rack (21-22)
    "W..X...................W", //  6: book stand (3)
    "W......................W", //  7: centre rug
    "W......................W", //  8: centre rug
    "WXX.......XXXX.......XXW", //  9: mortar (1-2) | work table (10-13) | bed (21-22)
    "WXX..................XXW", // 10: mortar | bed
    "W......................W", // 11
    "W......................W", // 12: door approach
    "W......................W", // 13
    "W......................W", // 14
    "WWWWWWWWWWWEEWWWWWWWWWWW", // 15: exit at cols 11-12
  ],
  playerSpawn: { x: 11, y: 11 },
  exits: [
    { x: 11, y: 15, target: "dorf", spawn: { x: 22, y: 7 } },
    { x: 12, y: 15, target: "dorf", spawn: { x: 22, y: 7 } },
  ],
  objects: [
    // Floor decal — big warm rug framing the anchor table (flat: under furniture).
    { name: "th_rug", x: 8.5, y: 6.5, tilew: 6.0, tileh: 4.0, flat: true },

    // ── Work wall (back, left half): shelf + jar cabinet grouped tightly ──────
    { name: "th_shelf",   x: 1.3, y: 0.6,  tilew: 2.2, tileh: 1.8333 }, // storage (vorratsregal)
    { name: "th_cabinet", x: 3.6, y: 0.35, tilew: 1.5, tileh: 2.1    }, // jar cabinet (decor)

    // ── Light corner (back, middle) ───────────────────────────────────────────
    { name: "th_window", x: 9.4, y: 0.7, tilew: 2.4, tileh: 2.0 }, // sun-window (sonnenfenster)

    // ── Hearth corner (back, right) + a second window for symmetry/light ─────
    { name: "th_hearth", x: 14.3, y: 0.5, tilew: 2.7, tileh: 2.3143 }, // hearth (herd)
    { name: "th_window", x: 19.3, y: 0.7, tilew: 2.4, tileh: 2.0    },

    // ── Study (left wall, mid): work desk + book stand + stool ───────────────
    { name: "th_work_desk", x: 1.0, y: 5.5, tilew: 2.0, tileh: 1.333, shadow: true },
    { name: "th_bookstand", x: 2.9, y: 6.0, tilew: 1.4, tileh: 1.4,   shadow: true }, // buchstand
    { name: "th_stool",     x: 1.6, y: 7.0, tilew: 0.8, tileh: 0.92,  shadow: true },

    // ── Drying corner (right wall, upper) ─────────────────────────────────────
    { name: "th_rack", x: 20.8, y: 5.6, tilew: 2.4, tileh: 1.6 }, // drying rack (dachboden)

    // ── Centre anchor: work table on the rug, lots of clear floor around it ──
    { name: "work_table", x: 9.6, y: 8.2, tilew: 4.0, tileh: 1.1429, shadow: true },
    { name: "th_stool",   x: 9.0, y: 9.6, tilew: 0.8, tileh: 0.92,   shadow: true },

    // ── Mortar bench (left wall, lower) ───────────────────────────────────────
    { name: "th_mortar_desk", x: 1.0, y: 8.8, tilew: 1.7, tileh: 1.7, shadow: true }, // moerser

    // ── Sleeping nook (right wall, lower) ─────────────────────────────────────
    { name: "bed", x: 20.6, y: 8.6, tilew: 2.4, tileh: 1.6, shadow: true }, // bett

    // ── Decor discipline: 5 plant/decor pieces total, each with a reason ──────
    { name: "th_trough", x: 9.6,  y: 3.3,  tilew: 1.8,  tileh: 0.9273, shadow: true }, // herbs by window1 — need light
    { name: "th_flower", x: 19.4, y: 3.3,  tilew: 0.8,  tileh: 1.0,    shadow: true }, // herbs by window2 — need light
    { name: "th_plant",  x: 9.6,  y: 12.6, tilew: 0.85, tileh: 1.16,   shadow: true }, // greets you by the door
    { name: "mushrooms", x: 1.2,  y: 11.2, tilew: 1,    tileh: 1,      shadow: true }, // shaded corner, away from windows
    { name: "th_plant",  x: 19.3, y: 10.4, tilew: 0.85, tileh: 1.16,   shadow: true }, // cozy touch by the bed

    // Exit door (128×64 → true 2:1 aspect — was stretched to 1.71:1 before, fixed here).
    { name: "th_door", x: 10.8, y: 13.0, tilew: 2.4, tileh: 1.2 },
  ],
  // Stateful content overlays — see main.js render(). Slot coords are in tiles,
  // and every slot sits inside the sprite rect of the furniture it belongs to.
  content: [
    // th_shelf rect: x[1.3,3.5] y[0.6,2.43]
    { kind: "fill", source: "storage", sprite: ["th_c_jar", "th_c_bundle"], size: 0.6, slots: [
      [1.6, 1.0], [2.3, 1.0], [1.6, 1.7], [2.3, 1.7],
    ] },
    // th_rack rect: x[20.8,23.2] y[5.6,7.2]
    { kind: "fill", source: "drying", sprite: "th_c_hang", size: 0.7, slots: [
      [21.0, 5.7], [21.7, 5.7], [22.4, 5.7],
    ] },
    // th_window (window1) rect: x[9.4,11.8] y[0.7,2.7]
    { kind: "fill", source: "sonnenfenster", sprite: "th_c_hang", size: 0.6, slots: [
      [9.6, 1.0], [10.3, 1.0], [11.0, 1.0],
    ] },
    // th_hearth rect: x[14.3,17.0] y[0.5,2.8143]
    { kind: "glow", source: "herd", at: [15.65, 2.3, 1.2] },
  ],
  stations: [
    { x: 3,  y: 3,  type: "vorratsregal"  }, // storage shelf
    { x: 10, y: 3,  type: "sonnenfenster" }, // sun-window
    { x: 15, y: 4,  type: "herd"          }, // hearth
    { x: 20, y: 5,  type: "dachboden"     }, // drying rack
    { x: 3,  y: 9,  type: "moerser"       }, // mortar desk
    { x: 4,  y: 6,  type: "buchstand"     }, // book stand
    { x: 20, y: 9,  type: "bett"          }, // bed
  ],
};
