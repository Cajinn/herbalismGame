// Reads ASCII map grids (src/data/maps/*.js). Engine-side, this knows nothing
// about specific tile meanings beyond `solid` + `color` + optional `t` from the legend.
// When a legend entry has `t: [atlasName, tileIndex]` the atlas tile is drawn
// instead of the flat color. If the atlas is not yet loaded the color is used
// as a fallback, so the world never goes black on startup.
//
// Auto-tiling: legend entries with a `terrain` field ("path" or "bed") receive
// neighbor-aware tile selection via computeBitmask + dirtBlobIndex from autotile.js.
// Paths additionally overlay paths.png fringe marks for surface texture.
import { drawTile } from "./tileset.js";
import { computeBitmask, dirtBlobIndex, pathFringeIndex } from "./autotile.js";

export function getTileDef(map, tx, ty) {
  const row = map.grid[ty];
  if (row === undefined) return null;
  const char = row[tx];
  if (char === undefined) return null;
  return map.legend[char] ?? null;
}

export function isSolid(map, tx, ty) {
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
      // Always paint def.color first so transparent tile pixels show through to
      // the correct color rather than the black canvas background. Then blit the
      // atlas sprite on top (if available); skip the fill-only path only when
      // the tile is fully opaque and the atlas is confirmed loaded.
      ctx.fillStyle = def.color;
      ctx.fillRect(screenX, screenY, scaledTile, scaledTile);
      if (def.terrain === "path" || def.terrain === "bed") {
        // Auto-tiled terrain: compute bitmask from same-terrain neighbors and
        // draw the matching blob tile from the "dirt" atlas. Transparent areas
        // in the blob tile let the color fill (drawn above) show through as the
        // path/bed color. Falls back to def.t[1] flat fill if atlas not ready.
        const bitmask = computeBitmask(map, tx, ty, def.terrain);
        const blobIdx = dirtBlobIndex(bitmask);
        const drawn = drawTile(ctx, "dirt", blobIdx, screenX, screenY, scaledTile);
        if (!drawn && def.t) {
          // Atlas not loaded yet — draw the fallback flat tile
          drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
        }
        // For paths: also overlay the paths.png fringe texture
        if (def.terrain === "path" && drawn) {
          const fringeIdx = pathFringeIndex(bitmask);
          drawTile(ctx, "paths", fringeIdx, screenX, screenY, scaledTile);
        }
      } else if (def.t) {
        drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
      }
    }
  }
}
