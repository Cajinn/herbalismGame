// On-screen touch controls for mobile / tablet. Builds a DOM D-pad plus
// interact ("E") and map ("M") buttons and feeds them into the same action
// system the keyboard uses (see input.js). Only shown on touch devices.
import { pressAction, releaseAction } from "./input.js";

const isTouch =
  window.matchMedia?.("(pointer: coarse)").matches ||
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;

function makeButton(action, label, extraClass = "") {
  const btn = document.createElement("button");
  btn.className = `tc-btn ${extraClass}`.trim();
  btn.dataset.action = action;
  btn.textContent = label;
  btn.setAttribute("aria-label", action);

  // Pointer events cover touch + mouse and survive multi-touch (holding a
  // direction while tapping interact). Capture so we still get the "up" even
  // if the finger slides off the button.
  const down = (e) => {
    e.preventDefault();
    btn.classList.add("tc-btn--down");
    try { btn.setPointerCapture(e.pointerId); } catch {}
    pressAction(action);
  };
  const up = (e) => {
    e.preventDefault();
    btn.classList.remove("tc-btn--down");
    releaseAction(action);
  };
  btn.addEventListener("pointerdown", down);
  btn.addEventListener("pointerup", up);
  btn.addEventListener("pointercancel", up);
  // Block the synthetic mouse/scroll/zoom gestures touch would otherwise fire.
  btn.addEventListener("contextmenu", (e) => e.preventDefault());
  return btn;
}

export function initTouch() {
  if (!isTouch) return;
  document.body.classList.add("touch");

  const root = document.createElement("div");
  root.id = "touch-controls";

  const dpad = document.createElement("div");
  dpad.className = "tc-dpad";
  dpad.append(
    makeButton("up", "▲", "tc-up"),
    makeButton("left", "◀", "tc-left"),
    makeButton("right", "▶", "tc-right"),
    makeButton("down", "▼", "tc-down"),
  );

  const actions = document.createElement("div");
  actions.className = "tc-actions";
  actions.append(
    makeButton("map", "Karte", "tc-round tc-map"),
    makeButton("interact", "E", "tc-round tc-interact"),
  );

  root.append(dpad, actions);
  document.body.append(root);
}
