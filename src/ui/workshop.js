import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { methods } from "../data/methods.js";
import { recipes, recipesForStation } from "../data/recipes.js";
import { groupInventory, countItem } from "../sim/inventory.js";
import { prepProgress, careDueToday } from "../sim/processing.js";
import { countZutat } from "../sim/zutaten.js";
import { absoluteDay } from "../sim/time.js";

// Workshop dialog opened when the player interacts with a station in the
// Kräuterhäuschen. `onStartDrying`, `onStartRecipe`, `onSleep` are callbacks
// from main.js. Returns { open(stationType, inventory, processingState, time, zutaten),
// close(), isOpen() }.
export function createWorkshopDialog(root, { onStartDrying, onStartRecipe, onSleep, onCare }) {
  const overlay = document.createElement("div");
  overlay.className = "workshop";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "workshop__panel";
  overlay.appendChild(panel);
  root.appendChild(overlay);

  // Stored context so we can re-render in place after care actions
  let _openContext = null;

  function close() {
    overlay.hidden = true;
    panel.innerHTML = "";
    _openContext = null;
  }

  // ── Buchstand ─────────────────────────────────────────────────────────────
  // (handled by openBook in main.js; workshop dialog stays closed)

  // ── Bett ──────────────────────────────────────────────────────────────────
  function renderBett() {
    const title = el("h2", strings.stationen.bett);
    title.className = "workshop__title";
    panel.appendChild(title);

    const btn = makeBtn(strings.hud.schlafen, () => { close(); onSleep(); });
    panel.appendChild(btn);

    panel.appendChild(closeBtn());
  }

  // ── Dachboden (Trocknen) ───────────────────────────────────────────────────
  function renderDachboden(inventory, processingState) {
    panel.appendChild(stationTitle("dachboden"));
    panel.appendChild(activePreps(processingState, "dachboden"));

    const raw = groupInventory(inventory).filter((g) => !g.processed);
    if (raw.length === 0) {
      panel.appendChild(el("p", strings.werkstatt.keineRezepte));
    } else {
      const list = document.createElement("div");
      list.className = "workshop__list";
      for (const { species, teil, count } of raw) {
        const row = document.createElement("div");
        row.className = "workshop__row";
        const label = el("span", `${herbs[species].nameDe} (${strings.teile[teil]}) ×${count}`);
        const btn = makeBtn(strings.werkstatt.beginnen, () => {
          if (onStartDrying(species, teil)) {
            close();
          }
        });
        row.append(label, btn);
        list.appendChild(row);
      }
      panel.appendChild(list);
    }

    panel.appendChild(closeBtn());
  }

  // ── Herd / Mörser / Vorratsregal / Sonnenfenster ──────────────────────────
  function renderStation(stationType, inventory, processingState, zutaten) {
    panel.appendChild(stationTitle(stationType));
    panel.appendChild(activePreps(processingState, stationType));

    const stationRecipes = recipesForStation(stationType, methods);
    if (stationRecipes.length === 0) {
      panel.appendChild(el("p", strings.werkstatt.keineRezepte));
    } else {
      const list = document.createElement("div");
      list.className = "workshop__list";
      for (const recipe of stationRecipes) {
        const herb = herbs[recipe.species];
        if (!herb) continue;

        const row = document.createElement("div");
        row.className = "workshop__row";

        const name = el("span",
          `${herb.nameDe} (${strings.teile[recipe.teil]}) → ${strings.verarbeitet[recipe.output] ?? recipe.output}`
        );

        const zutatKey = recipe.requiresZutat;
        const hasZutat = !zutatKey || countZutat(zutaten ?? {}, zutatKey) > 0;
        const canMake = hasZutat && canStartRecipe(recipe, inventory);

        const btn = makeBtn(strings.werkstatt.beginnen, () => {
          if (onStartRecipe(recipe)) close();
        });

        if (zutatKey && !hasZutat) {
          btn.disabled = true;
          const note = el("span",
            `${strings.werkstatt.benoetigtZutat}${zutatName(zutatKey)} ${strings.werkstatt.imLaden}`
          );
          note.className = "workshop__note";
          row.append(name, note, btn);
        } else if (!canMake) {
          btn.disabled = true;
          const note = el("span", strings.werkstatt.nichtGenugZutaten);
          note.className = "workshop__note workshop__note--warn";
          row.append(name, note, btn);
        } else {
          row.append(name, btn);
        }

        list.appendChild(row);
      }
      panel.appendChild(list);
    }

    panel.appendChild(closeBtn());
  }

  function canStartRecipe(recipe, inventory) {
    for (const req of recipe.inputs ?? []) {
      const needed = req.processed ?? null;
      if (countItem(inventory, req.species ?? recipe.species, req.teil ?? recipe.teil, needed) < 1) {
        return false;
      }
    }
    return true;
  }

  function zutatName(key) {
    const names = {
      schnaps: "Schnaps", olivenoel: "Olivenöl", bienenwachs: "Bienenwachs",
      honig: "Honig", zucker: "Zucker", zitrone: "Zitrone",
    };
    return names[key] ?? key;
  }

  // ── helpers ───────────────────────────────────────────────────────────────
  function stationTitle(type) {
    const h = el("h2", strings.stationen[type] ?? type);
    h.className = "workshop__title";
    return h;
  }

  function activePreps(processingState, stationType) {
    const frag = document.createDocumentFragment();
    const running = (processingState?.preparations ?? []).filter(
      (p) => methods[p.method]?.station === stationType,
    );
    if (running.length === 0) return frag;

    const section = document.createElement("div");
    section.className = "workshop__running";
    const heading = el("p", strings.werkstatt.laufend + ":");
    heading.className = "workshop__running-label";
    section.appendChild(heading);

    const today = _openContext?.time
      ? (absoluteDay(_openContext.time))
      : null;

    for (const prep of running) {
      const herb = herbs[prep.species];
      const method = methods[prep.method];

      const prepDiv = document.createElement("div");
      prepDiv.className = "workshop__prep";

      const line = el("p",
        `${herb?.nameDe ?? prep.species} (${strings.teile[prep.teil]}) — `
        + `${strings.werkstatt.noch} ${prep._remaining ?? "?"} ${strings.werkstatt.tage}`
      );
      prepDiv.appendChild(line);

      // Care status and button (only for methods with care rules)
      if (method?.care?.length > 0) {
        for (const rule of method.care) {
          const careCount = (prep.careLog ?? []).filter(
            (e) => e.action === rule.action,
          ).length;

          const statusEl = el("span", strings.werkstatt.gepflegt(rule.action, careCount));
          statusEl.className = "workshop__care-status";
          prepDiv.appendChild(statusEl);

          if (today !== null) {
            const { actions: dueActions } = careDueToday(prep, method, today);
            if (dueActions.includes(rule.action)) {
              const btnLabel = strings.werkstatt.pflege[rule.action]
                ?? `${rule.action}`;
              const careBtn = makeBtn(btnLabel, () => {
                onCare?.(prep.id, rule.action);
                // Re-render the panel in place
                if (_openContext) {
                  workshopOpen(
                    _openContext.stationType,
                    _openContext.inventory,
                    _openContext.processingState,
                    _openContext.time,
                    _openContext.zutaten,
                  );
                }
              });
              careBtn.className = "workshop__care-btn";
              prepDiv.appendChild(careBtn);
            }
          }
        }
      }

      section.appendChild(prepDiv);
    }

    frag.appendChild(section);
    return frag;
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

  function closeBtn() {
    const btn = makeBtn(strings.bestimmen.schliessen, close);
    btn.className = "workshop__close";
    return btn;
  }

  function workshopOpen(stationType, inventory, processingState, time, zutaten) {
    panel.innerHTML = "";
    overlay.hidden = false;

    // Store context for re-rendering after care button clicks
    _openContext = { stationType, inventory, processingState, time, zutaten };

    // Annotate preparations with remaining days for display
    if (processingState) {
      for (const prep of processingState.preparations) {
        const { remaining } = prepProgress(prep, time);
        prep._remaining = remaining;
      }
    }

    if (stationType === "bett") {
      renderBett();
    } else if (stationType === "dachboden") {
      renderDachboden(inventory, processingState);
    } else {
      renderStation(stationType, inventory, processingState, zutaten);
    }
  }

  return {
    open: workshopOpen,
    close,
    isOpen() { return !overlay.hidden; },
  };
}
