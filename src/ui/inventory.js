import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { groupInventory } from "../sim/inventory.js";

// DOM overlay listing collected items, grouped by species + Teil
// (PLAN.md §14). Toggled from the HUD's Inventar button.
export function createInventoryPanel(root) {
  const panel = document.createElement("div");
  panel.className = "inventory";
  panel.hidden = true;

  const title = document.createElement("h2");
  title.textContent = strings.inventar.titel;

  const list = document.createElement("ul");
  list.className = "inventory__list";

  panel.append(title, list);
  root.appendChild(panel);

  function render(inventory) {
    list.innerHTML = "";
    const groups = groupInventory(inventory);

    if (groups.length === 0) {
      const li = document.createElement("li");
      li.textContent = strings.inventar.leer;
      list.appendChild(li);
      return;
    }

    for (const { species, teil, processed, quality, labeledAs, count } of groups) {
      const li = document.createElement("li");
      const displaySpecies = labeledAs ?? species;
      const herbName = herbs[displaySpecies]?.nameDe ?? displaySpecies;
      const teilName = strings.teile[teil] ?? teil;
      const qualityLabel = (processed && quality)
        ? ` (${strings.qualitaet[quality] ?? quality})`
        : "";
      const processedPart = processed
        ? ` [${strings.verarbeitet[processed] ?? processed}${qualityLabel}]`
        : "";
      const mislabelMark = labeledAs ? " (?)" : "";
      li.textContent = `${herbName}${mislabelMark} (${teilName})${processedPart} ×${count}`;
      list.appendChild(li);
    }
  }

  return {
    toggle(inventory) {
      panel.hidden = !panel.hidden;
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
