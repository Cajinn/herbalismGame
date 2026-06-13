import { strings } from "../data/strings.de.js";
import { formatClock, getSeasonKey, DAYS_PER_SEASON } from "../sim/time.js";

// DOM overlay (PLAN.md §2: UI is DOM/CSS, not canvas) showing the clock and
// the Schlafen/Speichern actions.
export function createHud(root, { onSleep, onSave, onToggleInventory, onOpenBook, onNewGame }) {
  const hud = document.createElement("div");
  hud.className = "hud";

  const timeEl = document.createElement("div");
  timeEl.className = "hud__time";

  const statsEl = document.createElement("div");
  statsEl.className = "hud__stats";

  const actions = document.createElement("div");
  actions.className = "hud__actions";

  const sleepBtn = document.createElement("button");
  sleepBtn.textContent = strings.hud.schlafen;
  sleepBtn.addEventListener("click", onSleep);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = strings.hud.speichern;
  saveBtn.addEventListener("click", onSave);

  const inventarBtn = document.createElement("button");
  inventarBtn.textContent = strings.hud.inventar;
  inventarBtn.addEventListener("click", onToggleInventory);

  const buchBtn = document.createElement("button");
  buchBtn.textContent = strings.hud.buch;
  buchBtn.addEventListener("click", onOpenBook);

  const neuesSpielBtn = document.createElement("button");
  neuesSpielBtn.textContent = strings.hud.neuesSpiel;
  neuesSpielBtn.addEventListener("click", onNewGame);

  actions.append(sleepBtn, saveBtn, inventarBtn, buchBtn, neuesSpielBtn);
  hud.append(timeEl, statsEl, actions);
  root.appendChild(hud);

  const messageEl = document.createElement("div");
  messageEl.className = "hud__message";
  root.appendChild(messageEl);

  const promptEl = document.createElement("div");
  promptEl.className = "hud__prompt";
  root.appendChild(promptEl);

  let messageTimeout = null;

  return {
    update(time) {
      const season = strings.seasons[getSeasonKey(time)];
      timeEl.textContent =
        `${season} – ${strings.hud.tag} ${time.day}/${DAYS_PER_SEASON} – ` +
        `${strings.hud.jahr} ${time.year} – ${formatClock(time)}`;
    },
    setStats({ coins }) {
      statsEl.textContent = `${strings.hud.muenzen} ${coins}`;
    },
    showMessage(text) {
      messageEl.textContent = text;
      messageEl.classList.add("hud__message--visible");
      clearTimeout(messageTimeout);
      messageTimeout = setTimeout(() => {
        messageEl.classList.remove("hud__message--visible");
      }, 2500);
    },
    setPrompt(text) {
      promptEl.textContent = text;
      promptEl.classList.toggle("hud__prompt--visible", Boolean(text));
    },
  };
}
