// Composed Sprout Lands building renderer.
//
// Buildings are drawn OVER the terrain as a unit rather than as flat grid tiles,
// because a roof's scalloped bottom fringe is partly transparent and must overlap
// the top of the wall — the per-tile grid can't layer like that. Drawing walls
// first, then the roof on top (with the fringe landing on the wall-top row), gives
// the cohesive look of the Sprout Lands reference houses.
//
// Atlas cells (validated against the pack sheets):
//   roof  (house_roof.png,  7 cols): caps [0,1,2]   body [7,8,9]   fringe [28,29,30]
//   walls (house_walls.png, 5 cols): top  [0,1,2]    brick [5,6,7]  base   [10,11,12]
//   door  (doors.png,       1 col ): closed = 0
//
// Building spec (in map data, `buildings: [...]`):
//   { x, y, w, roofBody = 1, door = { dx } }
//     x, y      top-left tile of the footprint (the roof-cap row)
//     w         width in tiles (>= 2)
//     roofBody  number of plain roof-body rows between caps and fringe
//     door.dx   door column offset from x (defaults to centre)
//   Row layout from y:  caps | body×roofBody | fringe+wallTop | wallBody | wallBase
//   Footprint height = roofBody + 4 tiles.
import { drawTile } from "./tileset.js";

const edge = (x, w, l, m, r) => (x === 0 ? l : x === w - 1 ? r : m);

export function buildingFootprint(b) {
  return { x: b.x, y: b.y, w: b.w, h: (b.roofBody ?? 1) + 4 };
}

// Absolute map tile of the (walkable) door — used for collision + exit alignment.
export function buildingDoorTile(b) {
  const rB = b.roofBody ?? 1;
  return { x: b.x + (b.door?.dx ?? Math.floor(b.w / 2)), y: b.y + rB + 3 };
}

// True when (tx,ty) is a solid part of any building footprint (i.e. not the door).
export function buildingSolidAt(map, tx, ty) {
  for (const b of map.buildings ?? []) {
    const f = buildingFootprint(b);
    if (tx < f.x || tx >= f.x + f.w || ty < f.y || ty >= f.y + f.h) continue;
    const d = buildingDoorTile(b);
    if (tx === d.x && ty === d.y) return false; // door is walkable
    return true;
  }
  return false;
}

export function renderBuildings(ctx, map, camera, scale) {
  const ts = map.tileSize;
  const st = ts * scale;
  const px = (tx) => Math.round(tx * ts * scale - camera.x * scale);
  const py = (ty) => Math.round(ty * ts * scale - camera.y * scale);

  for (const b of map.buildings ?? []) {
    if (b.noRender) continue;
    const rB = b.roofBody ?? 1;
    const wallTop = b.y + rB + 1;
    const dx = b.door?.dx ?? Math.floor(b.w / 2);

    // Walls first (top, brick body, base) so the roof can overlap the top row.
    for (let x = 0; x < b.w; x++) drawTile(ctx, "wall", edge(x, b.w, 0, 1, 2),    px(b.x + x), py(wallTop),     st);
    for (let x = 0; x < b.w; x++) drawTile(ctx, "wall", edge(x, b.w, 5, 6, 7),    px(b.x + x), py(wallTop + 1), st);
    for (let x = 0; x < b.w; x++) drawTile(ctx, "wall", edge(x, b.w, 10, 11, 12), px(b.x + x), py(wallTop + 2), st);
    drawTile(ctx, "door", 0, px(b.x + dx), py(wallTop + 2), st);

    // Roof on top: caps, body rows, then the fringe landing on the wall-top row.
    for (let x = 0; x < b.w; x++) drawTile(ctx, "roof", edge(x, b.w, 0, 1, 2), px(b.x + x), py(b.y), st);
    for (let r = 0; r < rB; r++)
      for (let x = 0; x < b.w; x++) drawTile(ctx, "roof", edge(x, b.w, 7, 8, 9), px(b.x + x), py(b.y + 1 + r), st);
    for (let x = 0; x < b.w; x++) drawTile(ctx, "roof", edge(x, b.w, 28, 29, 30), px(b.x + x), py(wallTop), st);
  }
}
