// Tileset loader + blit. Sprout Lands sheets vary in width, so each atlas
// stores its own column count. 16×16 source tiles. Index N → col=N%cols,
// row=floor(N/cols). Returns false (caller falls back to def.color) until the
// image is loaded, so the world never goes black on startup.
const SRC = 16;
const atlases = {}; // name -> { img, cols }

export function loadTileset(name, src, cols) {
  const img = new Image();
  img.src = src;
  atlases[name] = { img, cols };
  return atlases[name];
}

export function drawTile(ctx, name, index, dx, dy, size) {
  const a = atlases[name];
  if (!a) return false;
  const { img, cols } = a;
  if (!img.complete || img.naturalWidth === 0) return false;
  const col = index % cols;
  const row = Math.floor(index / cols);
  ctx.drawImage(img, col * SRC, row * SRC, SRC, SRC, dx, dy, size, size);
  return true;
}
