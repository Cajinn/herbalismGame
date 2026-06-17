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

// Source pixel row where the character's feet sit (confirmed from sprite bounds).
// Used to anchor the character so feet land on the tile ground line.
const FEET_SRC_Y = 31;

const DIR_ROW = { down: 0, up: 1, right: 2, left: 3 };

// ──────────────────────────────────────────────────────────────────────────────
// PixelLab per-character images.
// Each character has 8 direction images (one PNG per direction).
// Keyed by villager ID (string matching villagers.js keys).
// Directions: south, north, east, west, south-east, south-west, north-east, north-west
// ──────────────────────────────────────────────────────────────────────────────
const _plChars = new Map(); // villager key → { dir: HTMLImageElement }

// Call from main.js after downloading PixelLab character images.
// dirSrcs: { south: url, north: url, east: url, west: url, ... }
export function loadPlCharacter(key, dirSrcs) {
  const imgs = {};
  for (const [dir, src] of Object.entries(dirSrcs)) {
    const img = new Image();
    img.src = src;
    imgs[dir] = img;
  }
  _plChars.set(key, imgs);
}

// PixelLab direction name from the 4-direction game convention.
const _plDir = { down: "south", up: "north", right: "east", left: "west" };

// Walk-cycle columns (excluding idle at col 0).
// We step through cols 1, 2, 3 while moving.
const WALK_COLS = [1, 2, 3];
const WALK_FRAMES = WALK_COLS.length;

// Walk animation: advance one frame every N game frames (~60 fps → ~8fps anim)
const FRAMES_PER_STEP = 8;

// Module-level tick counter and walk-frame index.
let _tick = 0;
let _walkFrame = 0;

// Legacy Sprout Lands character sheet has been retired — all characters now
// render from PixelLab per-character PNGs (see loadPlCharacter / drawCharacter).
// This image is intentionally left unloaded so the old tint/sheet code paths
// below are inert (naturalWidth stays 0) and never fetch anything.
const _img = new Image();

// Fallback colors (original placeholder).
const BODY_COLOR = "#5d4037";
const FACE_COLOR = "#3e2723";

// Cache of tinted offscreen canvases, keyed by CSS colour string.
// Populated lazily on first use per colour value; never rebuilt after that.
const _tintCache = new Map();

/**
 * Return a colour-overlaid copy of the character sheet as an OffscreenCanvas.
 * Strategy: draw the base sprite, then composite a solid-colour fill over it
 * using `source-atop` at alpha 0.62. This saturates the clothing (cream base →
 * vivid colour) while keeping enough original luminance for the skin to remain
 * readable. Cached by colour string — one canvas per villager, built once.
 * Returns null if the source image is not yet loaded.
 */
function _getTintedSheet(colour) {
  if (!_img.complete || _img.naturalWidth === 0) return null;

  if (_tintCache.has(colour)) return _tintCache.get(colour);

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

  // Pass 1: base sprite (full opacity).
  offCtx.drawImage(_img, 0, 0);

  // Pass 2: solid colour overlay, confined to existing sprite pixels.
  // `source-atop` draws only where the destination already has alpha > 0,
  // so transparent regions stay transparent. Alpha 0.62 gives a strong,
  // clearly distinct hue while keeping skin tones recognisably warm.
  offCtx.globalCompositeOperation = "source-atop";
  offCtx.globalAlpha = 0.62;
  offCtx.fillStyle = colour;
  offCtx.fillRect(0, 0, w, h);
  offCtx.globalAlpha = 1;
  offCtx.globalCompositeOperation = "source-over";

  _tintCache.set(colour, offscreen);
  return offscreen;
}

/**
 * drawCharacter — shared renderer for both the player and NPCs.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} screenX  — screen-pixel X of the top-left of the tile footprint
 * @param {number} screenY  — screen-pixel Y of the top-left of the tile footprint
 * @param {{ direction?: string, moving?: boolean, colour?: string }} opts
 *   direction: "down"|"up"|"left"|"right"  (default "down")
 *   moving:    boolean                      (default false)
 *   colour:    CSS colour string            (default undefined → untinted player)
 * @param {number} tileSize — logical tile size in world pixels
 * @param {number} scale    — render scale factor
 */
export function drawCharacter(ctx, screenX, screenY, opts, tileSize, scale) {
  const direction  = opts.direction  ?? "down";
  const moving     = opts.moving     ?? false;
  const colour     = opts.colour;
  const plCharKey  = opts.plCharKey; // villager ID for PixelLab per-character image

  // --- PixelLab per-character image (preferred when available) ---
  if (plCharKey) {
    const dirImages = _plChars.get(plCharKey);
    if (dirImages) {
      const plDir = _plDir[direction] ?? "south";
      const img = dirImages[plDir];
      if (img?.complete && img.naturalWidth > 0) {
        // Render PixelLab chars at 1.5× tile size; feet sit ~88% down the image.
        const destSize = Math.round(tileSize * scale * 1.5);
        const footX = screenX + Math.round((tileSize * scale) / 2);
        const footY = screenY + Math.round(tileSize * scale);
        const destX = footX - Math.round(destSize / 2);
        const destY = footY - Math.round(destSize * 0.88);
        const prev = ctx.imageSmoothingEnabled;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, destX, destY, destSize, destSize);
        ctx.imageSmoothingEnabled = prev;
        return;
      }
      // image not loaded yet — fall through to SL sheet below
    }
  }

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
  if (colour !== undefined) {
    sheet = _getTintedSheet(colour);
    if (!sheet) return; // image not ready (shouldn't happen given check above)
  } else {
    sheet = _img;
  }

  // --- sprite blit ---
  // Draw the frame at 1:1 native scale (SRC_FRAME × render-scale).
  // The source frame (48px) covers a 3×3 tile area; the visible character body
  // is 14×16 px within it → renders as ≈1 tile wide × 1 tile tall at SCALE=3.
  // Anchor: feet (source y=31) land exactly on the tile's ground line (footY).
  const destSize = SRC_FRAME * scale;
  const footX = screenX + Math.round((tileSize * scale) / 2);
  const footY = screenY + Math.round(tileSize * scale);

  const destX = footX - Math.round(destSize / 2);
  const destY = footY - Math.round((FEET_SRC_Y / SRC_FRAME) * destSize);

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
    plCharKey: "herbalist",
  }, tileSize, scale);
}
