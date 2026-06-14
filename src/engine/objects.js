// Overlay renderer for PixelLab PNG objects (transparent-background sprites).
// Objects are declared per-map as `objects: [{name, x, y, tilew?, tileh?}]`
// where x/y are top-left tile coords and tilew/tileh are the rendered footprint
// in tiles (both default to 1). The PNG is scaled to fill that footprint.
// Rendered AFTER terrain, BEFORE characters, so chars walk over objects.
//
// Collision is separate: keep solid legend tiles under objects for blocking.

const _cache = new Map(); // name → HTMLImageElement

export function loadObject(name, src) {
  if (_cache.has(name)) return;
  const img = new Image();
  img.src = src;
  _cache.set(name, img);
}

export function getObject(name) {
  return _cache.get(name) ?? null;
}

export function renderObjects(ctx, map, camera, scale) {
  if (!map.objects?.length) return;
  const ts = map.tileSize;
  const prev = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;

  // Draw back-to-front by baseline (y + footprint height) so taller furniture
  // nearer the camera overlaps pieces behind it. Objects flagged `flat` (floor
  // decals like rugs) always sort behind. Stable copy — never mutate map.
  const baseline = (o) => (o.flat ? -Infinity : o.y + (o.tileh ?? 1));
  const ordered = map.objects
    .map((obj, i) => ({ obj, i }))
    .sort((a, b) => baseline(a.obj) - baseline(b.obj) || a.i - b.i);

  for (const { obj } of ordered) {
    const img = _cache.get(obj.name);
    if (!img || !img.complete || img.naturalWidth === 0) continue;

    const tw = obj.tilew ?? 1;
    const th = obj.tileh ?? 1;
    const drawW = tw * ts * scale;
    const drawH = th * ts * scale;
    const screenX = Math.round(obj.x * ts * scale - camera.x * scale);
    const screenY = Math.round(obj.y * ts * scale - camera.y * scale);

    ctx.drawImage(img, screenX, screenY, drawW, drawH);
  }

  ctx.imageSmoothingEnabled = prev;
}
