// Reads ASCII map grids (src/data/maps/*.js). Engine-side, this knows nothing
// about specific tile meanings beyond `solid` + `color` + optional `t` from the legend.
//
// Legend entry fields:
//   t: [atlasName, tileIndex]  — draw this atlas tile (SL tilesets)
//   wang: "atlasName"          — PixelLab Wang grass tile; index computed from path
//                                neighbors. If terrain:"path", draws pure-path tile
//                                (wang_0, index 6). Otherwise draws grass transition.
//   terrain: "path"|"bed"      — auto-tiled with blob tiles from "dirt" atlas
//
// Fallback: def.color fills the tile when no atlas is ready.
// img: "spriteName" — tiles the named PNG (loaded via loadObject) across the tile.
import { drawTile } from "./tileset.js";
import { getObject } from "./objects.js";
import { computeBitmask, dirtBlobIndex, pathFringeIndex, grassWangIndex } from "./autotile.js";
import { buildingSolidAt } from "./buildings.js";

// Which "lower" terrain class each PixelLab Wang atlas transitions against.
const WANG_LOWER = { pl_gp: "path", pl_gw: "water", pl_gf: "forest", pl_gr: "rock" };

export function getTileDef(map, tx, ty) {
  const row = map.grid[ty];
  if (row === undefined) return null;
  const char = row[tx];
  if (char === undefined) return null;
  return map.legend[char] ?? null;
}

export function isSolid(map, tx, ty) {
  if (buildingSolidAt(map, tx, ty)) return true;
  const def = getTileDef(map, tx, ty);
  return def === null || def.solid;
}

export function mapPixelSize(map) {
  return {
    width: map.grid[0].length * map.tileSize,
    height: map.grid.length * map.tileSize,
  };
}

export function renderMap(ctx, map, camera, scale) {
  const { tileSize } = map;
  const scaledTile = tileSize * scale;

  const startCol = Math.floor(camera.x / tileSize);
  const startRow = Math.floor(camera.y / tileSize);
  const endCol = Math.ceil((camera.x + camera.width) / tileSize);
  const endRow = Math.ceil((camera.y + camera.height) / tileSize);

  for (let ty = startRow; ty < endRow; ty++) {
    for (let tx = startCol; tx < endCol; tx++) {
      const def = getTileDef(map, tx, ty);
      if (!def) continue;
      const screenX = Math.round(tx * tileSize * scale - camera.x * scale);
      const screenY = Math.round(ty * tileSize * scale - camera.y * scale);

      // Color fill first — transparent atlas pixels blend to this, not to black.
      ctx.fillStyle = def.color;
      ctx.fillRect(screenX, screenY, scaledTile, scaledTile);

      if (def.img) {
        // Custom tile image (loaded via loadObject) — tiles the PNG across the tile.
        // Takes precedence over wang/t rendering. Falls back to color if not loaded.
        const tileImg = getObject(def.img);
        if (tileImg?.complete && tileImg.naturalWidth > 0) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tileImg, screenX, screenY, scaledTile, scaledTile);
          ctx.imageSmoothingEnabled = true;
        }
      } else if (def.wang) {
        // Each Wang atlas transitions against a specific "lower" terrain class.
        const lowerClass = WANG_LOWER[def.wang] ?? "path";
        if (def.terrain === "bed") {
          // Bed tiles: keep SL blob approach; Wang atlas not used for beds.
          const bitmask = computeBitmask(map, tx, ty, "bed");
          const drawn = drawTile(ctx, "dirt", dirtBlobIndex(bitmask), screenX, screenY, scaledTile);
          if (!drawn && def.t) drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
        } else if (def.terrain === lowerClass) {
          // "Lower" terrain tile: draw pure lower tile (wang_0 = index 6).
          const drawn = drawTile(ctx, def.wang, 6, screenX, screenY, scaledTile);
          if (!drawn && def.t) drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
        } else {
          // "Upper" terrain tile: Wang transition based on lower-terrain neighbors.
          const mask = computeBitmask(map, tx, ty, lowerClass);
          const drawn = drawTile(ctx, def.wang, grassWangIndex(mask), screenX, screenY, scaledTile);
          if (!drawn && def.t) drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
        }
      } else if (def.terrain === "path" || def.terrain === "bed") {
        // Legacy SL blob approach (maps without wang field).
        const bitmask = computeBitmask(map, tx, ty, def.terrain);
        const blobIdx = dirtBlobIndex(bitmask);
        const drawn = drawTile(ctx, "dirt", blobIdx, screenX, screenY, scaledTile);
        if (!drawn && def.t) drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
        if (def.terrain === "path" && drawn) {
          drawTile(ctx, "paths", pathFringeIndex(bitmask), screenX, screenY, scaledTile);
        }
      } else if (def.t) {
        drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
      }

      // Modern-trail edge: grass tiles that already transition to another
      // terrain (water/forest/rock via pl_gw/pl_gf/pl_gr) never blend into a
      // path, since their own Wang atlas isn't pl_gp. Where such a tile borders
      // a path (e.g. the streamside path through Bachufer), overlay the pl_gp
      // grass→path transition on top so the trail gets the same soft edges as
      // the village paths instead of a hard-cut band.
      // Only the "upper" (grass) tiles qualify: skip the atlas's own lower
      // terrain (e.g. the water tiles themselves, terrain==="water"), or the
      // overlay would paint grass/dirt onto the river next to the bridge.
      const wangLower = def.wang ? (WANG_LOWER[def.wang] ?? "path") : null;
      if (wangLower && wangLower !== "path" &&
          def.terrain !== wangLower && def.terrain !== "path") {
        const pathMask = computeBitmask(map, tx, ty, "path");
        if (pathMask !== 0) {
          drawTile(ctx, "pl_gp", grassWangIndex(pathMask), screenX, screenY, scaledTile);
        }
      }
    }
  }
}
