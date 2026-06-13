import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";

// Garden bed dialog. Callbacks: onPlant(bedId, species) → bool,
// onWater(bedId), onHarvest(bedId) → bool.
// Returns { open(bed, garden, seeds), close(), isOpen() }.
export function createGardenDialog(root, { onPlant, onWater, onHarvest }) {
  const overlay = document.createElement("div");
  overlay.className = "garden-dialog";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "garden-dialog__panel";
  overlay.appendChild(panel);
  root.appendChild(overlay);

  let _state = null;

  function close() {
    overlay.hidden = true;
    panel.innerHTML = "";
    _state = null;
  }

  function el(tag, text) {
    const e = document.createElement(tag);
    e.textContent = text;
    return e;
  }

  function makeBtn(text, onClick, disabled = false) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function render() {
    const { bed, garden, seeds } = _state;
    const { bedId } = bed;
    panel.innerHTML = "";

    const title = el("h2", strings.garten.titel);
    title.className = "garden-dialog__title";
    panel.appendChild(title);

    const bedState = garden.beds[bedId];

    if (!bedState) {
      // Empty: list available seeds
      const seedEntries = Object.entries(seeds).filter(
        ([s, n]) => n > 0 && herbs[s]?.kultivierbar,
      );
      if (seedEntries.length === 0) {
        panel.appendChild(el("p", strings.garten.keinsamen));
      } else {
        const list = document.createElement("div");
        list.className = "garden-dialog__list";
        for (const [species, count] of seedEntries) {
          const herb = herbs[species];
          const row = document.createElement("div");
          row.className = "garden-dialog__row";
          const label = el("span", `${herb.nameDe} ×${count}`);
          const btn = makeBtn(strings.garten.saeen, () => {
            if (onPlant(bedId, species)) close();
          });
          row.append(label, btn);
          list.appendChild(row);
        }
        panel.appendChild(list);
      }
    } else {
      const herb = herbs[bedState.species];
      const stageName = strings.garten.stages[bedState.stage] ?? bedState.stage;
      const statusEl = el("p", `${herb.nameDe} — ${stageName}`);
      statusEl.className = "garden-dialog__status";
      panel.appendChild(statusEl);

      if (bedState.stage === "reif") {
        panel.appendChild(makeBtn(strings.garten.ernten, () => {
          if (onHarvest(bedId)) close();
        }));
      } else {
        panel.appendChild(makeBtn(strings.garten.giessen, () => {
          onWater(bedId);
          render(); // update stage display in-place
        }));
      }
    }

    const closeBtn = makeBtn(strings.bestimmen.schliessen, close);
    closeBtn.className = "garden-dialog__close";
    panel.appendChild(closeBtn);
  }

  return {
    open(bed, garden, seeds) {
      _state = { bed, garden, seeds };
      overlay.hidden = false;
      render();
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
