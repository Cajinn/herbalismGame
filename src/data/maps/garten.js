// Garten — generated grid (see tools/gen_maps.mjs).
export const garten = {
  id: "garten",
  name: "Garten",
  tileSize: 16,
  biotope: "garten",
  legend: {
    ".": { tile: "rasen",  solid: false, color: "#7cb342" },
    "#": { tile: "pfad",   solid: false, color: "#d7c4a3" },
    "E": { tile: "beet",   solid: true,  color: "#8d6e4a" },
    "Z": { tile: "zaun",   solid: true,  color: "#6d4c41" },
    "H": { tile: "haus",   solid: true,  color: "#a1887f" },
  },
  grid: [
    "ZZZZZZZZZZZZZZZ#ZZZZZZZZZZZZZZ",
    "Z..............#.............Z",
    "Z..............#.............Z",
    "Z..............#.............Z",
    "Z............................Z",
    "Z............................Z",
    "Z............................Z",
    "Z....EE..EE..EE..EE..EE......Z",
    "Z....EE..EE..EE..EE..EE......Z",
    "Z............................Z",
    "Z............................Z",
    "Z....EE..EE..EE..EE..EE......Z",
    "Z....EE..EE..EE..EE..EE......Z",
    "Z............................Z",
    "Z............................Z",
    "Z............................Z",
    "Z...........HHHHHH...........Z",
    "Z...........HHHHHH...........Z",
    "Z...........HHHHHH...........Z",
    "ZZZZZZZZZZZZHHHHHHZZZZZZZZZZZZ",
  ],
  playerSpawn: { x: 15, y: 1 },
  exits: [
    { x: 15, y: 0, target: "dorf", spawn: { x: 15, y: 18 } },
  ],
  // Garden beds: each E-cluster (2×2) has one interaction point one row above it.
  // Player approaching from the row above triggers proximity (abs(dy)=1).
  beds: [
    { bedId: "bed-1", x: 5,  y: 7  },
    { bedId: "bed-2", x: 9,  y: 7  },
    { bedId: "bed-3", x: 13, y: 7  },
    { bedId: "bed-4", x: 5,  y: 11 },
    { bedId: "bed-5", x: 9,  y: 11 },
  ],
};
