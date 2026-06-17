// Keyboard state tracker. Maps arrow keys/WASD to movement actions and "E"/
// Enter/Space to the interact action.
const ACTIONS_BY_KEY = {
  ArrowUp: "up", w: "up", W: "up",
  ArrowDown: "down", s: "down", S: "down",
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
  e: "interact", E: "interact", Enter: "interact", " ": "interact",
  m: "map", M: "map",
};

const pressed = new Set();
const justPressed = new Set();

export function initInput() {
  window.addEventListener("keydown", (event) => {
    const action = ACTIONS_BY_KEY[event.key];
    if (action) {
      if (!pressed.has(action)) justPressed.add(action);
      pressed.add(action);
      event.preventDefault();
    }
  });

  window.addEventListener("keyup", (event) => {
    const action = ACTIONS_BY_KEY[event.key];
    if (action) pressed.delete(action);
  });
}

export function isPressed(action) {
  return pressed.has(action);
}

// Programmatic input, used by on-screen touch controls. pressAction/releaseAction
// mirror keydown/keyup for held actions (movement); tapAction fires a one-shot
// (interact/map) without leaving the action stuck "down".
export function pressAction(action) {
  if (!pressed.has(action)) justPressed.add(action);
  pressed.add(action);
}

export function releaseAction(action) {
  pressed.delete(action);
}

export function tapAction(action) {
  justPressed.add(action);
}

// Returns true once per key press (not while held), for one-shot actions
// like opening a dialog.
export function consumeJustPressed(action) {
  if (justPressed.has(action)) {
    justPressed.delete(action);
    return true;
  }
  return false;
}
