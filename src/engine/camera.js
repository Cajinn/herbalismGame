// Camera follows a target (the player) and clamps to the map bounds so it
// never shows beyond the edge of small maps.
export function createCamera(viewportWidth, viewportHeight) {
  return { x: 0, y: 0, width: viewportWidth, height: viewportHeight };
}

export function updateCamera(camera, target, mapPixelWidth, mapPixelHeight) {
  const focusX = target.x + target.width / 2;
  const focusY = target.y + target.height / 2;

  camera.x = clamp(focusX - camera.width / 2, 0, Math.max(0, mapPixelWidth - camera.width));
  camera.y = clamp(focusY - camera.height / 2, 0, Math.max(0, mapPixelHeight - camera.height));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
