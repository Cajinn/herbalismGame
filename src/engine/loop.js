// Minimal requestAnimationFrame loop. dt is clamped so tab-switches don't
// cause huge jumps (e.g. the player teleporting through walls).
export function startLoop(update, render) {
  let last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
