// Fully synthesized audio engine — Web Audio API only, no external audio
// files (the project stays 100% self-owned, no attribution needed). Lazily
// creates a single AudioContext on the first user gesture (browsers block
// autoplay), routes everything through a master GainNode, and exposes:
//   sfx(name)               — short one-shot effects (see SFX below)
//   setScene({indoor,rain}) — crossfades the ambient bed over ~1s
//   setMuted(bool)/isMuted()— device mute preference (persisted outside saves)
// Never throws: if AudioContext is unavailable (old browser) every export
// becomes a no-op.

const MUTE_KEY = "herbalism-muted";
const SFX_PEAK = 0.15;
const AMBIENT_PEAK = 0.05;
const CROSSFADE_S = 1.0;

let ctx = null;
let master = null;
let sfxBus = null;
let ambientBus = null;
let ambientNodes = null; // { windGain, roomGain, rainGain }
let birdTimer = null;

let muted = loadMuted();
let scene = { indoor: false, rain: false };

function loadMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveMuted(value) {
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    // Private browsing etc. — mute preference just won't survive a reload.
  }
}

// A short buffer of white noise, looped for wind/room-tone/rain beds or
// sliced once for the page-turn swish.
function noiseBuffer(c, seconds) {
  const buf = c.createBuffer(1, Math.max(1, Math.round(c.sampleRate * seconds)), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function buildAmbient(c) {
  if (ambientNodes) return ambientNodes;

  const wind = c.createBufferSource();
  wind.buffer = noiseBuffer(c, 4);
  wind.loop = true;
  const windFilter = c.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 500;
  const windGain = c.createGain();
  windGain.gain.value = 0;
  wind.connect(windFilter).connect(windGain).connect(ambientBus);
  wind.start();

  const room = c.createBufferSource();
  room.buffer = noiseBuffer(c, 4);
  room.loop = true;
  const roomFilter = c.createBiquadFilter();
  roomFilter.type = "lowpass";
  roomFilter.frequency.value = 200;
  const roomGain = c.createGain();
  roomGain.gain.value = 0;
  room.connect(roomFilter).connect(roomGain).connect(ambientBus);
  room.start();

  const rain = c.createBufferSource();
  rain.buffer = noiseBuffer(c, 4);
  rain.loop = true;
  const rainFilter = c.createBiquadFilter();
  rainFilter.type = "bandpass";
  rainFilter.frequency.value = 1200;
  rainFilter.Q.value = 0.6;
  const rainGain = c.createGain();
  rainGain.gain.value = 0;
  rain.connect(rainFilter).connect(rainGain).connect(ambientBus);
  rain.start();

  ambientNodes = { windGain, roomGain, rainGain };
  scheduleBirds(c);
  return ambientNodes;
}

// Soft random bird chirps, only audible outdoors. Re-scheduled with plain
// setTimeout (wall-clock gap between chirps is unimportant), but the note
// itself is always placed on the AudioContext clock — no Date.now() involved
// in the actual sound scheduling.
function scheduleBirds(c) {
  clearTimeout(birdTimer);
  const delayMs = 4000 + Math.random() * 8000;
  birdTimer = setTimeout(() => {
    if (c === ctx && !scene.indoor && !muted) chirp(c, ambientBus, c.currentTime);
    scheduleBirds(c);
  }, delayMs);
}

function chirp(c, out, t0) {
  const osc = c.createOscillator();
  osc.type = "sine";
  const base = 1800 + Math.random() * 900;
  osc.frequency.setValueAtTime(base, t0);
  osc.frequency.exponentialRampToValueAtTime(base * 1.35, t0 + 0.06);
  osc.frequency.exponentialRampToValueAtTime(base * 0.9, t0 + 0.13);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.5, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.15);
  osc.connect(g).connect(out);
  osc.start(t0);
  osc.stop(t0 + 0.16);
}

function applyScene(c) {
  if (!c || !ambientNodes) return;
  const t = c.currentTime;
  const rampTo = (param, value) => {
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(value, t + CROSSFADE_S);
  };
  rampTo(ambientNodes.windGain.gain, scene.indoor ? 0 : 1);
  rampTo(ambientNodes.roomGain.gain, scene.indoor ? 1 : 0);
  rampTo(ambientNodes.rainGain.gain, !scene.indoor && scene.rain ? 0.7 : 0);
}

function ensureContext() {
  if (ctx) return ctx;
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  try {
    ctx = new AudioCtor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = SFX_PEAK;
    sfxBus.connect(master);
    ambientBus = ctx.createGain();
    ambientBus.gain.value = AMBIENT_PEAK;
    ambientBus.connect(master);
    buildAmbient(ctx);
    applyScene(ctx);
  } catch {
    ctx = null;
  }
  return ctx;
}

// Browsers require a user gesture before audio can play. One-time listener:
// on the first pointerdown/keydown, create (or resume) the context.
if (typeof window !== "undefined") {
  const resume = () => {
    const c = ensureContext();
    c?.resume?.().catch(() => {});
  };
  window.addEventListener("pointerdown", resume, { once: true });
  window.addEventListener("keydown", resume, { once: true });
}

// ── SFX — each a tiny envelope of oscillators/noise, quiet and cozy. ───────
const SFX = {
  // Soft short tap for opening a dialog / panel.
  blip(c, out, t0) {
    const osc = c.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(660, t0);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(1, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
    osc.connect(g).connect(out);
    osc.start(t0);
    osc.stop(t0 + 0.07);
  },
  // Gentle pluck, two quick notes rising — picking a plant.
  harvest(c, out, t0) {
    [523.25, 659.25].forEach((freq, i) => {
      const s = t0 + i * 0.09;
      const osc = c.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, s);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, s);
      g.gain.linearRampToValueAtTime(1, s + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.18);
      osc.connect(g).connect(out);
      osc.start(s);
      osc.stop(s + 0.2);
    });
  },
  // Low warm bubble — a short filtered triangle wobble for starting a brew.
  brew(c, out, t0) {
    const osc = c.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t0);
    osc.frequency.linearRampToValueAtTime(140, t0 + 0.3);
    const lfo = c.createOscillator();
    lfo.frequency.value = 7;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 20;
    lfo.connect(lfoGain).connect(osc.frequency);
    const filt = c.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 500;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(1, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
    osc.connect(filt).connect(g).connect(out);
    osc.start(t0);
    lfo.start(t0);
    osc.stop(t0 + 0.4);
    lfo.stop(t0 + 0.4);
  },
  // Soft two-note chime — buying or delivering something.
  coin(c, out, t0) {
    [880, 1318.5].forEach((freq, i) => {
      const s = t0 + i * 0.07;
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, s);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, s);
      g.gain.linearRampToValueAtTime(1, s + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.25);
      osc.connect(g).connect(out);
      osc.start(s);
      osc.stop(s + 0.27);
    });
  },
  // Slow descending three-note lullaby phrase (~0.8s) — the day turning over.
  sleep(c, out, t0) {
    [440, 349.23, 293.66].forEach((freq, i) => {
      const s = t0 + i * 0.26;
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, s);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, s);
      g.gain.linearRampToValueAtTime(1, s + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.5);
      osc.connect(g).connect(out);
      osc.start(s);
      osc.stop(s + 0.55);
    });
  },
  // Paper-ish noise swish — opening/closing the herbal book.
  page(c, out, t0) {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.3);
    const filt = c.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(2500, t0);
    filt.frequency.linearRampToValueAtTime(1200, t0 + 0.25);
    filt.Q.value = 0.7;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(1, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
    src.connect(filt).connect(g).connect(out);
    src.start(t0);
    src.stop(t0 + 0.3);
  },
  // Muted low thud — a failed action (no coins, no zutaten, wrong plant…).
  error(c, out, t0) {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, t0);
    osc.frequency.exponentialRampToValueAtTime(60, t0 + 0.2);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(1, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
    osc.connect(g).connect(out);
    osc.start(t0);
    osc.stop(t0 + 0.25);
  },
};

/** Play a short synthesized effect by name. Silently does nothing if audio
 * is unavailable, muted, or the name is unknown. */
export function sfx(name) {
  const c = ensureContext();
  if (!c || muted) return;
  const fn = SFX[name];
  if (!fn) return;
  try {
    fn(c, sfxBus, c.currentTime);
  } catch {
    // Audio must never break gameplay.
  }
}

/** Crossfade the ambient bed to match the current scene. Safe to call before
 * the AudioContext exists — the scene is remembered and applied once it does. */
export function setScene({ indoor = false, rain = false } = {}) {
  scene = { indoor, rain };
  if (!ctx) return;
  try {
    applyScene(ctx);
  } catch {
    // ignore
  }
}

export function setMuted(value) {
  muted = !!value;
  saveMuted(muted);
  if (!ctx || !master) return;
  try {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(muted ? 0 : 1, t + 0.15);
  } catch {
    // ignore
  }
}

export function isMuted() {
  return muted;
}
