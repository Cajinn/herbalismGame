// Reads ASCII map grids (src/data/maps/*.js). Engine-side, this knows nothing
// about specific tile meanings beyond `solid` + `color` + optional `t` from the legend.
// When a legend entry has `t: [atlasName, tileIndex]` the atlas tile is drawn
// instead of the flat color. If the atlas is not yet loaded the color is used
// as a fallback, so the world never goes black on startup.
import { drawTile } from "./tileset.js";
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
      if (def.t) {
        drawTile(ctx, def.t[0], def.t[1], screenX, screenY, scaledTile);
      }
    }
  }
}
