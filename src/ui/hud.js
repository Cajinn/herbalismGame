import { strings } from "../data/strings.de.js";
import { formatClock, getSeasonKey, DAYS_PER_SEASON } from "../sim/time.js";
import { sfx, isMuted, setMuted } from "../engine/audio.js";

// DOM overlay (PLAN.md §2: UI is DOM/CSS, not canvas) showing the clock and
// the Schlafen/Speichern actions.
export function createHud(root, { onSleep, onSave, onToggleInventory, onOpenBook, onOpenMap, onNewGame }) {
  const hud = document.createElement("div");
  hud.className = "hud";

  const timeEl = document.createElement("div");
  timeEl.className = "hud__time";

  const weatherEl = document.createElement("div");
  weatherEl.className = "hud__weather";

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

  const karteBtn = document.createElement("button");
  karteBtn.textContent = strings.hud.karte;
  karteBtn.addEventListener("click", onOpenMap);

  const neuesSpielBtn = document.createElement("button");
  neuesSpielBtn.textContent = strings.hud.neuesSpiel;
  neuesSpielBtn.addEventListener("click", onNewGame);

  // Mute toggle — a device preference (persisted in audio.js via localStorage,
  // outside the save slots), so it just reflects/flips engine state directly.
  const muteBtn = document.createElement("button");
  function refreshMuteBtn() {
    muteBtn.textContent = isMuted() ? strings.hud.tonAus : strings.hud.tonAn;
  }
  refreshMuteBtn();
  muteBtn.addEventListener("click", () => {
    setMuted(!isMuted());
    refreshMuteBtn();
    sfx("blip"); // no-ops silently if we just muted
  });

  actions.append(sleepBtn, saveBtn, inventarBtn, buchBtn, karteBtn, neuesSpielBtn, muteBtn);
  hud.append(timeEl, weatherEl, statsEl, actions);
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
    setWeather(weatherKey) {
      weatherEl.textContent = strings.wetter[weatherKey] ?? "";
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
