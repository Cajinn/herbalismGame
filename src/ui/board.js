import { strings } from "../data/strings.de.js";
import { villagers } from "../data/villagers.js";
import { ailments } from "../data/ailments.js";

// Anschlagbrett (notice board) — read-only overview of all open requests.
// Returns { open(requests), close(), isOpen() }.
export function createBoardDialog(root) {
  const overlay = document.createElement("div");
  overlay.className = "board-dialog";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "board-dialog__panel";
  overlay.appendChild(panel);
  root.appendChild(overlay);

  function close() {
    overlay.hidden = true;
    panel.innerHTML = "";
  }

  function el(tag, text) {
    const e = document.createElement(tag);
    e.textContent = text;
    return e;
  }

  return {
    open(requests) {
      panel.innerHTML = "";
      overlay.hidden = false;

      const title = el("h2", strings.anfragen.titel);
      title.className = "board-dialog__title";
      panel.appendChild(title);

      const openRequests = requests.active.filter((r) => r.status === "open");

      if (openRequests.length === 0) {
        panel.appendChild(el("p", strings.anfragen.keineAnfragen));
      } else {
        const list = document.createElement("div");
        list.className = "board-dialog__list";
        for (const req of openRequests) {
          const villager = villagers[req.villagerId];
          const ailment  = ailments[req.ailmentId];
          if (!villager || !ailment) continue;

          const entry = document.createElement("div");
          entry.className = "board-dialog__entry";

          const who = el("strong", `${villager.nameDe} (${villager.rolleDe})`);
          const ailmentNameEl = el("p", ailment.nameDe);
          ailmentNameEl.className = "board-dialog__ailment-name";
          const complaint = el("p", ailment.beschreibungDe);
          complaint.className = "board-dialog__complaint";

          const seasonList = ailment.seasons
            .map((s) => strings.seasons[s] ?? s)
            .join(", ");
          const seasonEl = el("small", seasonList);
          seasonEl.className = "board-dialog__season";

          entry.append(who, ailmentNameEl, complaint, seasonEl);
          list.appendChild(entry);
        }
        panel.appendChild(list);
      }

      const closeBtn = document.createElement("button");
      closeBtn.textContent = strings.bestimmen.schliessen;
      closeBtn.className = "board-dialog__close";
      closeBtn.addEventListener("click", close);
      panel.appendChild(closeBtn);
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
