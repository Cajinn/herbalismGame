// Kräuterhäuschen interior — 20×12 tiles.
// No interior floor tile in Sprout Lands — floor uses warm color fallback (#d7ccc8).
// Each station gets a distinct recognisable furniture sprite.
//
// furniture[12]  = green lamp/potted plant     → dachboden (drying rack)
// furniture[32]  = clock                       → herd (stove)
// furniture[30]  = small square cabinet        → moerser (mortar)
// furniture[21]  = tall dresser/chest-drawers  → vorratsregal (storage)
// furniture[0]   = framed picture              → buchstand (book stand)
// furniture[3]   = tall potted plant with hat  → sonnenfenster (sunny window)
// furniture[18]  = green bed top half          → bett (sleep, top)
// furniture[27]  = green bed bottom half       → bett (sleep, bottom)
export const kraeuterhaeuschen = {
  id: "kraeuterhaeuschen",
  name: "Kräuterhäuschen",
  tileSize: 16,
  biotope: "garten",
  legend: {
    ".": { tile: "boden",     solid: false, color: "#d7ccc8" },
    "W": { tile: "wand",      solid: true,  color: "#5d4037" },
    "F": { tile: "deur",      solid: false, color: "#a1887f" },
    "D": { tile: "dachboden", solid: true,  color: "#8d6e63", t: ["furniture", 12] },
    "H": { tile: "herd",      solid: true,  color: "#616161", t: ["furniture", 32] },
    "M": { tile: "moerser",   solid: true,  color: "#8d6e63", t: ["furniture", 30] },
    "R": { tile: "regal",     solid: true,  color: "#795548", t: ["furniture", 21] },
    "B": { tile: "buchstand", solid: true,  color: "#6d4c41", t: ["furniture",  0] },
    "S": { tile: "fenster",   solid: true,  color: "#fff59d", t: ["furniture",  3] },
    "Z": { tile: "bett_top",  solid: true,  color: "#a5d6a7", t: ["furniture", 18] },
    "z": { tile: "bett_bot",  solid: true,  color: "#81c784", t: ["furniture", 27] },
  },
  // 20 cols × 12 rows — every row exactly 20 chars
  grid: [
    "WWWWWWWWWWWWWWWWWWWW",
    "W..................W",
    "W.DDDDDDDDD.....HHHW",
    "W.DDDDDDDDD.....HHHW",
    "W..................W",
    "W.MM............RRRW",
    "W..................W",
    "W..................W",
    "W..BBB..........SSSW",
    "W..................W",
    "W.ZZZZz............W",
    "WWWWWWWWWFWWWWWWWWWW",
  ],
  playerSpawn: { x: 9, y: 10 },
  exits: [
    { x: 9, y: 11, target: "dorf", spawn: { x: 22, y: 8 } },
  ],
  stations: [
    { x: 5,  y: 2,  type: "dachboden"    },
    { x: 16, y: 2,  type: "herd"         },
    { x: 2,  y: 5,  type: "moerser"      },
    { x: 17, y: 5,  type: "vorratsregal" },
    { x: 4,  y: 8,  type: "buchstand"    },
    { x: 17, y: 8,  type: "sonnenfenster"},
    { x: 3,  y: 10, type: "bett"         },
  ],
};
