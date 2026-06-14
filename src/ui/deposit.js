import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { ailments } from "../data/ailments.js";
import { villagers } from "../data/villagers.js";
import { groupInventory } from "../sim/inventory.js";

// Deposit box (Abgabebox) panel.
// Lists all open villager requests; player picks a finished product to deposit.
// On deposit, calls onDeposit(requestId, item) → "match" | "mismatch" | "toxic".
//
// Returns { open(requests, inventory), close(), isOpen() }.
export function createDepositPanel(root, { onDeposit }) {
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

  function makeBtn(text, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", onClick);
    return btn;
  }

  return {
    open(requests, inventory) {
      panel.innerHTML = "";
      overlay.hidden = false;

      const title = el("h2", strings.abgabe.titel);
      title.className = "board-dialog__title";
      panel.appendChild(title);

      const openRequests = requests.active.filter((r) => r.status === "open");

      if (openRequests.length === 0) {
        panel.appendChild(el("p", strings.abgabe.keineAnfragen));
      } else {
        // Gather finished (processed) usable items from inventory for quick access
        const processedItems = groupInventory(inventory).filter(
          (g) => g.processed !== null && g.quality !== "unbrauchbar",
        );

        const list = document.createElement("div");
        list.className = "board-dialog__list";

        for (const req of openRequests) {
          const villager = villagers[req.villagerId];
          const ailment = ailments[req.ailmentId];
          if (!villager || !ailment) continue;

          const entry = document.createElement("div");
          entry.className = "board-dialog__entry";

          // Who is asking and why
          const who = el("strong", strings.abgabe.fuerAnfrage(
            `${villager.nameDe} (${villager.rolleDe})`,
            ailment.nameDe,
          ));
          entry.appendChild(who);

          const complaint = el("p", ailment.beschreibungDe);
          complaint.className = "board-dialog__complaint";
          entry.appendChild(complaint);

          // Feedback line for this request (reset on each render)
          const feedbackEl = el("p", "");
          feedbackEl.className = "board-dialog__complaint";

          if (processedItems.length === 0) {
            entry.appendChild(el("small", strings.abgabe.keineProdukte));
          } else {
            // Show all finished products as deposit candidates
            const itemList = document.createElement("div");
            itemList.className = "board-dialog__list";

            for (const item of processedItems) {
              const row = document.createElement("div");
              row.className = "board-dialog__entry";

              const herbName =
                herbs[item.labeledAs ?? item.species]?.nameDe ?? item.species;
              const outputName =
                strings.verarbeitet[item.processed] ?? item.processed;

              const label = el("span", `${herbName} ${outputName} ×${item.count}`);

              const depositBtn = makeBtn(strings.abgabe.einlegen, () => {
                const result = onDeposit(req.id, item);

                if (result === "match") {
                  // Re-render the panel to reflect the resolved request
                  // and updated inventory after removal.
                  panel.innerHTML = "";
                  const doneEl = el("p", strings.abgabe.erfolgreich);
                  doneEl.className = "board-dialog__title";
                  panel.appendChild(doneEl);
                  const closeBtn2 = makeBtn(strings.bestimmen.schliessen, close);
                  closeBtn2.className = "board-dialog__close";
                  panel.appendChild(closeBtn2);
                } else if (result === "toxic") {
                  feedbackEl.textContent = strings.abgabe.toxisch(villager.nameDe);
                  feedbackEl.className =
                    "board-dialog__complaint villager-dialog__feedback--toxic";
                  entry.appendChild(feedbackEl);
                  setTimeout(close, 2500);
                } else {
                  feedbackEl.textContent = strings.abgabe.fehlschlag;
                  if (!entry.contains(feedbackEl)) entry.appendChild(feedbackEl);
                }
              });

              row.append(label, depositBtn);
              itemList.appendChild(row);
            }

            entry.appendChild(itemList);
          }

          list.appendChild(entry);
        }

        panel.appendChild(list);
      }

      const closeBtn = makeBtn(strings.bestimmen.schliessen, close);
      closeBtn.className = "board-dialog__close";
      panel.appendChild(closeBtn);
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
