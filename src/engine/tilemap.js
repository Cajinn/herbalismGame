// Reads ASCII map grids (src/data/maps/*.js). Engine-side, this knows nothing
// about specific tile meanings beyond `solid` + `color` from the legend.
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
      ctx.fillStyle = def.color;
      ctx.fillRect(screenX, screenY, scaledTile, scaledTile);
    }
  }
}
