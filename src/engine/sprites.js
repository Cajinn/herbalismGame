// M1 placeholder rendering: the player is a flat-color tile with a small
// "face" square showing facing direction. M2 replaces this with the
// indexed-color pixel-sprite system described in PLAN.md §3.2.
const BODY_COLOR = "#5d4037";
const FACE_COLOR = "#3e2723";

export function drawPlayer(ctx, player, camera, tileSize, scale) {
  const screenX = Math.round((player.x - camera.x) * scale);
  const screenY = Math.round((player.y - camera.y) * scale);
  const size = tileSize * scale;

  ctx.fillStyle = BODY_COLOR;
  ctx.fillRect(screenX, screenY, size, size);

  const indicator = Math.round(size / 4);
  let ix = screenX + Math.round((size - indicator) / 2);
  let iy = screenY + Math.round((size - indicator) / 2);
  switch (player.direction) {
    case "up": iy = screenY; break;
    case "down": iy = screenY + size - indicator; break;
    case "left": ix = screenX; break;
    case "right": ix = screenX + size - indicator; break;
  }

  ctx.fillStyle = FACE_COLOR;
  ctx.fillRect(ix, iy, indicator, indicator);
}
