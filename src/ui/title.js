import { strings } from "../data/strings.de.js";

// Full-screen title/splash shown on first launch (introSeen === false).
// Returns { show(onStart), hide() }.
// onStart(hardMode: bool) is called when the player clicks the start button.
export function createTitleScreen(root) {
  const overlay = document.createElement("div");
  overlay.className = "title-screen";
  overlay.hidden = true;
  root.appendChild(overlay);

  const box = document.createElement("div");
  box.className = "title-screen__box";
  overlay.appendChild(box);

  const title = document.createElement("h1");
  title.className = "title-screen__title";
  title.textContent = strings.titelbildschirm?.titel ?? "Herbalism Game";
  box.appendChild(title);

  const sub = document.createElement("p");
  sub.className = "title-screen__sub";
  sub.textContent = strings.titelbildschirm?.untertitel ?? "Ein Kräuterspiel aus der Schweiz";
  box.appendChild(sub);

  const disclaimer = document.createElement("p");
  disclaimer.className = "title-screen__disclaimer";
  disclaimer.textContent = strings.titelbildschirm?.disclaimer ??
    "Dieses Spiel dient ausschliesslich der Unterhaltung. Keine Heilversprechen.";
  box.appendChild(disclaimer);

  const startBtn = document.createElement("button");
  startBtn.className = "title-screen__start";
  startBtn.textContent = strings.titelbildschirm?.starten ?? "Spiel starten";
  box.appendChild(startBtn);

  // Hard Mode checkbox
  const hardModeRow = document.createElement("label");
  hardModeRow.className = "title-screen__hard-mode";
  const hardModeCheck = document.createElement("input");
  hardModeCheck.type = "checkbox";
  hardModeCheck.checked = false;
  const hardModeLabel = document.createTextNode(
    ` ${strings.titelbildschirm?.hardMode ?? "Schwerer Modus (Verderb & Vernachlässigung)"}`,
  );
  hardModeRow.appendChild(hardModeCheck);
  hardModeRow.appendChild(hardModeLabel);
  box.appendChild(hardModeRow);

  let _onStart = null;

  startBtn.addEventListener("click", () => {
    overlay.hidden = true;
    if (_onStart) _onStart(hardModeCheck.checked);
  });

  return {
    // newGame=false (a save exists) hides the Hard Mode choice — the mode is
    // fixed for an in-progress game; the checkbox just reflects the stored value.
    show(onStart, { newGame = true, hardMode = false } = {}) {
      _onStart = onStart;
      hardModeCheck.checked = hardMode;
      hardModeRow.hidden = !newGame;
      overlay.hidden = false;
    },
    hide() {
      overlay.hidden = true;
    },
    isVisible() {
      return !overlay.hidden;
    },
  };
}
