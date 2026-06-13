// Directional character sprite renderer using the Sprout Lands character sheet.
// Sheet: assets/tiles/sprout/character.png  — 192×192, 4×4 grid of 48×48 frames.
//
// Frame layout (visually confirmed from the PNG):
//   Row 0 (y=  0): facing DOWN  — col 0 idle, cols 1-3 walk
//   Row 1 (y= 48): facing UP    — col 0 idle, cols 1-3 walk
//   Row 2 (y= 96): facing RIGHT — col 0 idle, cols 1-3 walk
//   Row 3 (y=144): facing LEFT  — col 0 idle, cols 1-3 walk
//
// Fallback (image not yet loaded): the original flat brown square + direction
// indicator is drawn so the game never shows a blank player on first frame.

const SRC_FRAME = 48; // source pixels per frame

const DIR_ROW = { down: 0, up: 1, right: 2, left: 3 };

// Walk-cycle columns (excluding idle at col 0).
// We step through cols 1, 2, 3 while moving.
const WALK_COLS = [1, 2, 3];
const WALK_FRAMES = WALK_COLS.length;

// Walk animation: advance one frame every N game frames (~60 fps → ~8fps anim)
const FRAMES_PER_STEP = 8;

// Module-level tick counter and walk-frame index.
let _tick = 0;
let _walkFrame = 0;

// Lazy-loaded character image.
const _img = new Image();
_img.src = "assets/tiles/sprout/character.png";

// Fallback colors (original placeholder).
const BODY_COLOR = "#5d4037";
const FACE_COLOR = "#3e2723";

// Cache of tinted offscreen canvases, keyed by hue-rotation degrees (number).
// Populated lazily on first use per tint value; never rebuilt after that.
const _tintCache = new Map();

/**
 * Return a tinted copy of the character sheet as an OffscreenCanvas (or a
 * regular Canvas in environments that don't support OffscreenCanvas).
 * The result is cached by `deg` so the expensive filter pass runs only once.
 * Returns null if the source image is not yet loaded.
 */
function _getTintedSheet(deg) {
  if (!_img.complete || _img.naturalWidth === 0) return null;

  if (_tintCache.has(deg)) return _tintCache.get(deg);

  const w = _img.naturalWidth;
  const h = _img.naturalHeight;

  let offscreen;
  try {
    offscreen = new OffscreenCanvas(w, h);
  } catch (_) {
    // OffscreenCanvas not available — fall back to a regular canvas element.
    offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
  }

  const offCtx = offscreen.getContext("2d");
  offCtx.filter = `hue-rotate(${deg}deg)`;
  offCtx.drawImage(_img, 0, 0);
  offCtx.filter = "none";

  _tintCache.set(deg, offscreen);
  return offscreen;
}

/**
 * drawCharacter — shared renderer for both the player and NPCs.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} screenX  — screen-pixel X of the top-left of the tile footprint
 * @param {number} screenY  — screen-pixel Y of the top-left of the tile footprint
 * @param {{ direction?: string, moving?: boolean, tint?: number }} opts
 *   direction: "down"|"up"|"left"|"right"  (default "down")
 *   moving:    boolean                      (default false)
 *   tint:      hue-rotation degrees         (default undefined → untinted)
 * @param {number} tileSize — logical tile size in world pixels
 * @param {number} scale    — render scale factor
 */
export function drawCharacter(ctx, screenX, screenY, opts, tileSize, scale) {
  const direction = opts.direction ?? "down";
  const moving    = opts.moving    ?? false;
  const tint      = opts.tint;       // undefined → use raw sheet

  // --- fallback: image not yet loaded ---
  if (!_img.complete || _img.naturalWidth === 0) {
    const size = tileSize * scale;
    ctx.fillStyle = BODY_COLOR;
    ctx.fillRect(screenX, screenY, size, size);
    const indicator = Math.round(size / 4);
    let ix = screenX + Math.round((size - indicator) / 2);
    let iy = screenY + Math.round((size - indicator) / 2);
    switch (direction) {
      case "up":    iy = screenY; break;
      case "down":  iy = screenY + size - indicator; break;
      case "left":  ix = screenX; break;
      case "right": ix = screenX + size - indicator; break;
    }
    ctx.fillStyle = FACE_COLOR;
    ctx.fillRect(ix, iy, indicator, indicator);
    return;
  }

  // --- resolve source sheet (tinted or raw) ---
  let sheet;
  if (tint !== undefined) {
    sheet = _getTintedSheet(tint);
    if (!sheet) return; // image not ready (shouldn't happen given check above)
  } else {
    sheet = _img;
  }

  // --- sprite blit ---
  // Draw the character ~1.5 tiles tall (48 source px → 1.5× tileSize on screen).
  // Anchor: bottom-center of the character's tile footprint.
  const destSize = Math.round(tileSize * scale * 1.5);
  const footX = screenX + Math.round((tileSize * scale) / 2);
  const footY = screenY + Math.round(tileSize * scale);

  const destX = footX - Math.round(destSize / 2);
  const destY = footY - destSize;

  const row = DIR_ROW[direction] ?? 0;
  const col = moving ? WALK_COLS[_walkFrame] : 0;
  const srcX = col * SRC_FRAME;
  const srcY = row * SRC_FRAME;

  const prevSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(
    sheet,
    srcX, srcY, SRC_FRAME, SRC_FRAME,
    destX, destY, destSize, destSize,
  );

  ctx.imageSmoothingEnabled = prevSmoothing;
}

// drawPlayer — called once per frame from main.js render().
// Signature must stay exactly as is.
export function drawPlayer(ctx, player, camera, tileSize, scale) {
  const screenX = Math.round((player.x - camera.x) * scale);
  const screenY = Math.round((player.y - camera.y) * scale);

  // --- walk-cycle tick (player only) ---
  if (player.moving) {
    _tick++;
    if (_tick >= FRAMES_PER_STEP) {
      _tick = 0;
      _walkFrame = (_walkFrame + 1) % WALK_FRAMES;
    }
  } else {
    _tick = 0;
    _walkFrame = 0;
  }

  drawCharacter(ctx, screenX, screenY, {
    direction: player.direction,
    moving:    player.moving,
    // no tint → player uses the raw sheet
  }, tileSize, scale);
}
