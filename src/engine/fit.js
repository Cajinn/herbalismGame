// Scale the fixed 960x672 game box to fit any viewport, preserving aspect
// ratio. The canvas keeps its native pixel buffer (crisp via image-rendering:
// pixelated); we only scale the displayed size with a CSS transform, which
// also scales the DOM UI overlay (#ui-root) in lockstep so everything stays
// aligned.
const BASE_W = 960;
const BASE_H = 672;

export function initFit() {
  const game = document.getElementById("game");
  if (!game) return;

  function fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / BASE_W, vh / BASE_H);
    game.style.transform = `scale(${scale})`;
  }

  fit();
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", fit);
  window.visualViewport?.addEventListener("resize", fit);
}
