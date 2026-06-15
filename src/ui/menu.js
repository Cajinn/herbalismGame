import { strings } from "../data/strings.de.js";

// Full-screen main menu shown on launch. Replaces the old single-button title
// screen. Drives New Game / Continue / Saved Games / Settings across three
// save slots. The host (main.js) owns the actual save/load via callbacks.
//
// opts:
//   getSaves()        -> [{ slot, exists, summary, hardMode }]  (slot 1..3)
//   onNewGame(slot)   -> start a fresh game in `slot`
//   onContinue(slot)  -> load `slot`
//   onDeleteSave(slot)-> erase `slot`
//   getHardMode()     -> bool   (current Hard Mode preference for new games)
//   setHardMode(bool) -> persist the preference
export function createMainMenu(root, opts = {}) {
  const t = strings.menu ?? {};
  const overlay = document.createElement("div");
  overlay.className = "title-screen";
  overlay.hidden = true;
  root.appendChild(overlay);

  const box = document.createElement("div");
  box.className = "title-screen__box menu__box";
  overlay.appendChild(box);

  let view = "main";

  function mostRecentSlot(saves) {
    const filled = saves.filter((s) => s.exists);
    if (filled.length === 0) return null;
    return filled.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))[0].slot;
  }

  function makeButton(label, { className = "menu__btn", disabled = false, onClick } = {}) {
    const b = document.createElement("button");
    b.className = className;
    b.textContent = label;
    b.disabled = disabled;
    if (onClick) b.addEventListener("click", onClick);
    return b;
  }

  function header(titleText, subText) {
    const h = document.createElement("h1");
    h.className = "title-screen__title";
    h.textContent = titleText;
    box.appendChild(h);
    if (subText) {
      const s = document.createElement("p");
      s.className = "title-screen__sub";
      s.textContent = subText;
      box.appendChild(s);
    }
  }

  function slotRow(save, { actionLabel, onAction, allowDelete }) {
    const row = document.createElement("div");
    row.className = "menu__slot";

    const info = document.createElement("div");
    info.className = "menu__slot-info";
    const name = document.createElement("div");
    name.className = "menu__slot-name";
    name.textContent = `${t.slot ?? "Spielstand"} ${save.slot}`;
    const desc = document.createElement("div");
    desc.className = "menu__slot-desc";
    desc.textContent = save.exists ? save.summary : (t.leer ?? "— leer —");
    info.append(name, desc);
    row.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "menu__slot-actions";
    if (actionLabel) {
      actions.appendChild(makeButton(actionLabel, { className: "menu__btn menu__btn--small", onClick: () => onAction(save) }));
    }
    if (allowDelete && save.exists) {
      actions.appendChild(makeButton(t.loeschen ?? "Löschen", {
        className: "menu__btn menu__btn--small menu__btn--danger",
        onClick: () => {
          if (window.confirm((t.loeschenFrage ?? "Spielstand {n} löschen?").replace("{n}", save.slot))) {
            opts.onDeleteSave?.(save.slot);
            render();
          }
        },
      }));
    }
    row.appendChild(actions);
    return row;
  }

  function backButton() {
    return makeButton(t.zurueck ?? "Zurück", {
      className: "menu__btn menu__btn--ghost",
      onClick: () => { view = "main"; render(); },
    });
  }

  function render() {
    box.innerHTML = "";
    const saves = opts.getSaves?.() ?? [];

    if (view === "main") {
      header(strings.titelbildschirm?.titel ?? "Herbalism Game",
             strings.titelbildschirm?.untertitel ?? "Ein Kräuterspiel aus der Schweiz");
      const disc = document.createElement("p");
      disc.className = "title-screen__disclaimer";
      disc.textContent = strings.titelbildschirm?.disclaimer ??
        "Dieses Spiel dient ausschliesslich der Unterhaltung. Keine Heilversprechen.";
      box.appendChild(disc);

      const list = document.createElement("div");
      list.className = "menu__list";
      const recent = mostRecentSlot(saves);
      list.appendChild(makeButton(t.neuesSpiel ?? "Neues Spiel", {
        onClick: () => { view = "new"; render(); },
      }));
      list.appendChild(makeButton(t.weiterspielen ?? "Weiterspielen", {
        disabled: recent === null,
        onClick: () => recent !== null && opts.onContinue?.(recent),
      }));
      list.appendChild(makeButton(t.spielstaende ?? "Spielstände", {
        onClick: () => { view = "load"; render(); },
      }));
      list.appendChild(makeButton(t.einstellungen ?? "Einstellungen", {
        onClick: () => { view = "settings"; render(); },
      }));
      box.appendChild(list);
      return;
    }

    if (view === "new") {
      header(t.neuesSpiel ?? "Neues Spiel", t.slotWaehlen ?? "Spielstand wählen");
      const list = document.createElement("div");
      list.className = "menu__list";
      for (const save of saves) {
        list.appendChild(slotRow(save, {
          actionLabel: save.exists ? (t.ueberschreiben ?? "Überschreiben") : (t.starten ?? "Starten"),
          onAction: (s) => {
            if (s.exists && !window.confirm((t.ueberschreibenFrage ?? "Spielstand {n} überschreiben?").replace("{n}", s.slot))) return;
            opts.onNewGame?.(s.slot);
          },
        }));
      }
      box.appendChild(list);
      box.appendChild(backButton());
      return;
    }

    if (view === "load") {
      header(t.spielstaende ?? "Spielstände");
      const list = document.createElement("div");
      list.className = "menu__list";
      for (const save of saves) {
        list.appendChild(slotRow(save, {
          actionLabel: save.exists ? (t.laden ?? "Laden") : null,
          onAction: (s) => { if (s.exists) opts.onContinue?.(s.slot); },
          allowDelete: true,
        }));
      }
      box.appendChild(list);
      box.appendChild(backButton());
      return;
    }

    if (view === "settings") {
      header(t.einstellungen ?? "Einstellungen");
      const list = document.createElement("div");
      list.className = "menu__list";

      const hardRow = document.createElement("label");
      hardRow.className = "menu__setting";
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = !!opts.getHardMode?.();
      check.addEventListener("change", () => opts.setHardMode?.(check.checked));
      const lbl = document.createElement("span");
      lbl.textContent = ` ${strings.titelbildschirm?.hardMode ?? "Schwerer Modus (Verderb & Vernachlässigung)"}`;
      hardRow.append(check, lbl);
      list.appendChild(hardRow);

      const note = document.createElement("p");
      note.className = "menu__note";
      note.textContent = t.hardModeHinweis ?? "Gilt für neu gestartete Spiele.";
      list.appendChild(note);

      box.appendChild(list);
      box.appendChild(backButton());
      return;
    }
  }

  return {
    show() { view = "main"; render(); overlay.hidden = false; },
    hide() { overlay.hidden = true; },
    isVisible() { return !overlay.hidden; },
  };
}
