// Indexed-color pixel sprites (PLAN.md §3.2). A sprite is a palette (array
// of CSS colors, index 0 = transparent) plus `rows`: equal-length strings
// where each character is a palette index (0-9). createSprite() rasterizes
// this once to an offscreen canvas; drawSprite() blits it scaled and
// pixelated onto the world canvas. Content-driven: herb modules own their
// palette + rows, this module knows nothing about specific plants.
export function createSprite({ palette, rows }) {
  const height = rows.length;
  const width = rows[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  for (let y = 0; y < height; y++) {
    const row = rows[y];
    for (let x = 0; x < width; x++) {
      const color = palette[Number(row[x])];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return { canvas, width, height };
}

export function drawSprite(ctx, sprite, x, y, scale) {
  ctx.drawImage(
    sprite.canvas,
    0,
    0,
    sprite.width,
    sprite.height,
    Math.round(x),
    Math.round(y),
    sprite.width * scale,
    sprite.height * scale,
  );
}
