// Kräuterhäuschen interior — 20×12 tiles.
// Stations are listed separately so main.js can detect proximity without
// parsing tile characters (same pattern as exits).
export const kraeuterhaeuschen = {
  id: "kraeuterhaeuschen",
  name: "Kräuterhäuschen",
  tileSize: 16,
  biotope: "garten",
  legend: {
    ".": { tile: "boden",     solid: false, color: "#d7ccc8" },
    "W": { tile: "wand",      solid: true,  color: "#5d4037" },
    "D": { tile: "dachboden", solid: true,  color: "#8d6e63" },
    "H": { tile: "herd",      solid: true,  color: "#616161" },
    "M": { tile: "moerser",   solid: true,  color: "#8d6e63" },
    "R": { tile: "regal",     solid: true,  color: "#795548" },
    "B": { tile: "buchstand", solid: true,  color: "#6d4c41" },
    "S": { tile: "fenster",   solid: true,  color: "#fff59d" },
    "Z": { tile: "bett",      solid: true,  color: "#ef9a9a" },
    "F": { tile: "deur",      solid: false, color: "#a1887f" },
  },
  grid: [
    "WWWWWWWWWWWWWWWWWWWW",
    "W..................W",
    "W.DDDDDDDDD.....HHW",
    "W.DDDDDDDDD.....HHW",
    "W..................W",
    "W.MM............RRRW",
    "W..................W",
    "W..................W",
    "W..BBB.........SSSSW",
    "W..................W",
    "W.ZZZZZ...........W",
    "WWWWWWWWWFWWWWWWWWWW",
  ],
  playerSpawn: { x: 9, y: 10 },
  exits: [
    { x: 9, y: 11, target: "dorf", spawn: { x: 5, y: 7 } },
  ],
  // Fixed station positions for proximity-based interaction (1-tile radius,
  // same detection as plant spawns). `type` matches methods.station keys
  // plus "bett" (sleep) and "buchstand" (open book).
  stations: [
    { x: 5,  y: 2,  type: "dachboden"   },
    { x: 16, y: 2,  type: "herd"        },
    { x: 2,  y: 5,  type: "moerser"     },
    { x: 17, y: 5,  type: "vorratsregal"},
    { x: 4,  y: 8,  type: "buchstand"   },
    { x: 17, y: 8,  type: "sonnenfenster"},
    { x: 3,  y: 10, type: "bett"        },
  ],
};
