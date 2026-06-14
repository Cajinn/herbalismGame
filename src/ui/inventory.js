import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { groupInventory } from "../sim/inventory.js";

// DOM overlay listing collected items, grouped by species + Teil.
// Toggled from the HUD's Inventar button.
// onDiscard(group) callback is optional; called when player discards an unbrauchbar group.
export function createInventoryPanel(root) {
  const panel = document.createElement("div");
  panel.className = "inventory";
  panel.hidden = true;

  const titleEl = document.createElement("h2");
  titleEl.textContent = strings.inventar.titel;

  const list = document.createElement("ul");
  list.className = "inventory__list";

  panel.append(titleEl, list);
  root.appendChild(panel);

  // Stored callbacks so re-render has access to them
  let _inventory = null;
  let _onDiscard = null;

  function render(inventory) {
    list.innerHTML = "";
    const groups = groupInventory(inventory);

    if (groups.length === 0) {
      const li = document.createElement("li");
      li.textContent = strings.inventar.leer;
      list.appendChild(li);
      return;
    }

    for (const group of groups) {
      const { species, teil, processed, quality, labeledAs, count } = group;
      const li = document.createElement("li");
      const displaySpecies = labeledAs ?? species;
      const herbName = herbs[displaySpecies]?.nameDe ?? displaySpecies;
      const teilName = strings.teile[teil] ?? teil;

      // Quality label: shown for processed items AND for unbrauchbar raw items
      const showQuality = processed
        ? quality
        : (quality === "unbrauchbar" ? quality : null);
      const qualityLabel = showQuality
        ? ` (${strings.qualitaet?.[showQuality] ?? showQuality})`
        : "";
      const processedPart = processed
        ? ` [${strings.verarbeitet[processed] ?? processed}${qualityLabel}]`
        : qualityLabel;
      const mislabelMark = labeledAs ? " (?)" : "";

      const isUnbrauchbar = (quality === "unbrauchbar");

      if (isUnbrauchbar) {
        li.className = "inventory__item--unbrauchbar";
      }

      li.textContent = `${herbName}${mislabelMark} (${teilName})${processedPart} ×${count}`;

      // Discard button for unbrauchbar items
      if (isUnbrauchbar && _onDiscard) {
        const btn = document.createElement("button");
        btn.className = "inventory__discard-btn";
        btn.textContent = strings.inventar.wegwerfen ?? "Wegwerfen";
        btn.addEventListener("click", () => {
          _onDiscard(group);
        });
        li.appendChild(btn);
      }

      list.appendChild(li);
    }
  }

  return {
    // inventory: the flat inventory array
    // callbacks: optional { onDiscard(group) }
    toggle(inventory, callbacks = {}) {
      _inventory = inventory;
      _onDiscard = callbacks.onDiscard ?? null;
      panel.hidden = !panel.hidden;
      if (!panel.hidden) render(inventory);
    },
    // Re-render in place (e.g. after discard)
    refresh(inventory) {
      if (!panel.hidden) render(inventory);
    },
    close() {
      panel.hidden = true;
    },
    isOpen() {
      return !panel.hidden;
    },
  };
}
