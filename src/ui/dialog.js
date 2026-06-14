import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { ailments } from "../data/ailments.js";
import { groupInventory } from "../sim/inventory.js";
import { requestForVillager } from "../sim/requests.js";
import { exampleRemedy } from "../sim/remedies.js";

// Villager interaction dialog. onGive(requestId, item) → "match"|"mismatch"|"toxic".
// onMargritQuest() → called when player accepts alpweide quest.
// getQuestState() → { alpweideReady: bool, alpweideUnlocked: bool }.
// Returns { open(villager, requests, inventory), close(), isOpen() }.
export function createVillagerDialog(root, { onGive, getQuestState, onMargritQuest }) {
  const overlay = document.createElement("div");
  overlay.className = "villager-dialog";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "villager-dialog__panel";
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

  function renderMargrit(villager) {
    const nameEl = el("h2", villager.nameDe);
    nameEl.className = "villager-dialog__name";
    panel.appendChild(nameEl);

    const questState = getQuestState?.() ?? {};

    if (questState.alpweideReady && !questState.alpweideUnlocked) {
      const questEl = el("p", `«${strings.quest.alpweideFreigabe}»`);
      questEl.className = "villager-dialog__quote";
      panel.appendChild(questEl);

      const acceptBtn = makeBtn(strings.quest.alpweideFreigabeAktion, () => {
        onMargritQuest?.("alpweide");
        close();
      });
      panel.appendChild(acceptBtn);

      const skipBtn = makeBtn(strings.quest.alpweideFreigabeAbbrechen, close);
      skipBtn.className = "villager-dialog__close";
      panel.appendChild(skipBtn);
      return;
    }

    const hints = villager.dialog.hinweise ?? [];
    const hint = hints[Math.floor(Math.random() * hints.length)] ?? villager.dialog.gruss;
    const hintEl = el("p", `«${hint}»`);
    hintEl.className = "villager-dialog__quote";
    panel.appendChild(hintEl);

    const closeBtn = makeBtn(strings.bestimmen.schliessen, close);
    closeBtn.className = "villager-dialog__close";
    panel.appendChild(closeBtn);
  }

  function renderGreeting(villager) {
    const nameEl = el("h2", villager.nameDe);
    nameEl.className = "villager-dialog__name";
    panel.appendChild(nameEl);

    const greetEl = el("p", `«${villager.dialog.gruss}»`);
    greetEl.className = "villager-dialog__quote";
    panel.appendChild(greetEl);

    const closeBtn = makeBtn(strings.bestimmen.schliessen, close);
    closeBtn.className = "villager-dialog__close";
    panel.appendChild(closeBtn);
  }

  function renderRequest(villager, request, ailment, inventory) {
    const nameEl = el("h2", villager.nameDe);
    nameEl.className = "villager-dialog__name";
    panel.appendChild(nameEl);

    const bitte = villager.dialog.bitte({ ailmentNameDe: ailment.nameDe });
    const bitteEl = el("p", `«${bitte}»`);
    bitteEl.className = "villager-dialog__quote";
    panel.appendChild(bitteEl);

    const descEl = el("p", ailment.beschreibungDe);
    descEl.className = "villager-dialog__ailment";
    panel.appendChild(descEl);

    const feedbackEl = el("p", "");
    feedbackEl.className = "villager-dialog__feedback";
    panel.appendChild(feedbackEl);

    const processedItems = groupInventory(inventory).filter((g) => g.processed !== null);

    if (processedItems.length === 0) {
      panel.appendChild(el("p", strings.anfragen.keineProdukte));
    } else {
      const list = document.createElement("div");
      list.className = "villager-dialog__list";
      for (const item of processedItems) {
        const row = document.createElement("div");
        row.className = "villager-dialog__row";
        const herbName = herbs[item.labeledAs ?? item.species]?.nameDe ?? item.species;
        const outputName = strings.verarbeitet[item.processed] ?? item.processed;
        const label = el("span", `${herbName} ${outputName} ×${item.count}`);
        const btn = makeBtn(strings.anfragen.geben, () => {
          const result = onGive(request.id, item);
          if (result === "match") {
            panel.innerHTML = "";
            const dankEl = el("p", `«${villager.dialog.dank}»`);
            dankEl.className = "villager-dialog__dank";
            panel.appendChild(dankEl);
            // Gentle "why it worked" line, with quality mention if present
            const wirkung = herbs[item.species]?.verwendung?.wirkungTraditionell;
            const qualityStr = item.quality
              ? ` ${strings.qualitaet.lieferungRichtig(strings.qualitaet[item.quality] ?? item.quality)}`
              : "";
            if (wirkung || qualityStr) {
              const whyEl = el("p", `${strings.anfragen.remedyRichtig}${wirkung ?? ""}${qualityStr}`);
              whyEl.className = "villager-dialog__feedback villager-dialog__feedback--richtig";
              panel.appendChild(whyEl);
            }
            setTimeout(close, 2200);
          } else if (result === "toxic") {
            feedbackEl.textContent = strings.toxic.krank(villager.nameDe);
            feedbackEl.className = "villager-dialog__feedback villager-dialog__feedback--toxic";
            setTimeout(close, 2500);
          } else {
            // mismatch — show ablehnung + teaching hint
            feedbackEl.textContent = `«${villager.dialog.ablehnung}»`;
            feedbackEl.className = "villager-dialog__feedback villager-dialog__feedback--ablehnung";
            const ex = exampleRemedy(ailment);
            if (ex) {
              const remedyText = `${herbs[ex.species]?.nameDe ?? ex.species}-${strings.verarbeitet[ex.output] ?? ex.output}`;
              const hintEl = el("p", strings.anfragen.remedyHinweis(ailment.nameDe, remedyText));
              hintEl.className = "villager-dialog__feedback villager-dialog__feedback--hinweis";
              panel.appendChild(hintEl);
            }
          }
        });
        row.append(label, btn);
        list.appendChild(row);
      }
      panel.appendChild(list);
    }

    const closeBtn = makeBtn(strings.bestimmen.schliessen, close);
    closeBtn.className = "villager-dialog__close";
    panel.appendChild(closeBtn);
  }

  return {
    open(villager, requests, inventory) {
      panel.innerHTML = "";
      overlay.hidden = false;

      if (villager.id === "margrit") {
        renderMargrit(villager);
        return;
      }

      const request = requestForVillager(requests, villager.id);
      if (request) {
        const ailment = ailments[request.ailmentId];
        renderRequest(villager, request, ailment, inventory);
      } else {
        renderGreeting(villager);
      }
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
