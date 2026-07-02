import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { ailments } from "../data/ailments.js";
import { recipes } from "../data/recipes.js";
import { methods } from "../data/methods.js";
import { SEASONS, DAYS_PER_SEASON, getSeasonKey } from "../sim/time.js";
import {
  isGesehen, isGelernt, getRevealedMerkmale, hasCrafted,
} from "../sim/progress.js";
import { remediesForSpecies } from "../sim/remedies.js";
import { drawTile } from "../engine/tileset.js";
import { herbTile } from "../data/herbTiles.js";

// Singleton lightbox (shared with identify.js logic — same pattern).
let _lightbox = null;
function getLightbox() {
  if (_lightbox) return _lightbox;
  const overlay = document.createElement("div");
  overlay.className = "plate-lightbox";
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("role", "dialog");
  overlay.hidden = true;
  const img = document.createElement("img");
  img.className = "plate-lightbox__img";
  img.alt = "";
  const hint = document.createElement("p");
  hint.className = "plate-lightbox__hint";
  hint.textContent = "Klicken oder Esc zum Schließen";
  overlay.append(img, hint);
  document.body.appendChild(overlay);
  const close = () => { overlay.hidden = true; img.src = ""; };
  overlay.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });
  _lightbox = { open(src, alt) { img.src = src; img.alt = alt ?? ""; overlay.hidden = false; } };
  return _lightbox;
}

const MERKMALE_ORDER = ["blattform", "blattstellung", "bluete", "geruch", "stengel", "wuchshoehe"];
const TILE_BOOK_SIZE = 64; // 16px source → 64px in book (4×)

// Full-screen notebook overlay. Two chapters: Pflanzen (progressive reveal)
// and Rezepte (known preparations). Opened from HUD or Buchstand station.
export function createBook(root) {
  const overlay = document.createElement("div");
  overlay.className = "book";
  overlay.hidden = true;
  root.appendChild(overlay);

  const notebook = document.createElement("div");
  notebook.className = "book__notebook";
  overlay.appendChild(notebook);

  // ── Header ────────────────────────────────────────────────────────────────
  const header = document.createElement("div");
  header.className = "book__header";

  const titleEl = el("h1", strings.buch.titel);
  titleEl.className = "book__title";

  const tabs = document.createElement("div");
  tabs.className = "book__tabs";

  const tabPflanzen       = makeTab(strings.buch.tabPflanzen);
  const tabRezepte        = makeTab(strings.buch.tabRezepte);
  const tabVerwechslungen = makeTab(strings.buch.tabVerwechslungen);
  const tabAlmanach       = makeTab(strings.buch.tabAlmanach);
  tabs.append(tabPflanzen, tabRezepte, tabVerwechslungen, tabAlmanach);

  const closeBtn = document.createElement("button");
  closeBtn.className = "book__close";
  closeBtn.textContent = strings.buch.schliessen;
  closeBtn.addEventListener("click", close);

  header.append(titleEl, tabs, closeBtn);
  notebook.appendChild(header);

  // ── Content ───────────────────────────────────────────────────────────────
  const content = document.createElement("div");
  content.className = "book__content";
  notebook.appendChild(content);

  // ── State ─────────────────────────────────────────────────────────────────
  let activeTab = "pflanzen";
  let selectedSpecies = null;
  let currentProgress = {};
  let currentTime = null;

  function close() {
    overlay.hidden = true;
    content.innerHTML = "";
  }

  function switchTab(tab) {
    activeTab = tab;
    tabPflanzen.classList.toggle("book__tab--active", tab === "pflanzen");
    tabRezepte.classList.toggle("book__tab--active", tab === "rezepte");
    tabVerwechslungen.classList.toggle("book__tab--active", tab === "verwechslungen");
    tabAlmanach.classList.toggle("book__tab--active", tab === "almanach");
    renderContent();
  }

  tabPflanzen.addEventListener("click",       () => switchTab("pflanzen"));
  tabRezepte.addEventListener("click",        () => switchTab("rezepte"));
  tabVerwechslungen.addEventListener("click", () => switchTab("verwechslungen"));
  tabAlmanach.addEventListener("click",       () => switchTab("almanach"));

  // ── Pflanzen chapter ──────────────────────────────────────────────────────
  function renderPflanzen() {
    content.innerHTML = "";
    const speciesIds = Object.keys(herbs);

    const layout = document.createElement("div");
    layout.className = "book__pflanzen-layout";

    // Sidebar: species list
    const sidebar = document.createElement("div");
    sidebar.className = "book__species-list";
    for (const id of speciesIds) {
      const btn = document.createElement("button");
      btn.className = "book__species-btn";
      if (id === selectedSpecies) btn.classList.add("book__species-btn--active");

      if (isGesehen(currentProgress, id)) {
        btn.textContent = herbs[id].nameDe;
      } else {
        btn.textContent = "?";
        btn.classList.add("book__species-btn--unbekannt");
      }

      btn.addEventListener("click", () => {
        selectedSpecies = id;
        renderPflanzen();
      });
      sidebar.appendChild(btn);
    }

    // Main panel: herb spread
    const main = document.createElement("div");
    main.className = "book__spread";

    if (selectedSpecies && herbs[selectedSpecies]) {
      renderHerbSpread(main, selectedSpecies);
    } else {
      main.appendChild(el("p", strings.buch.nochNichtGesehen));
    }

    layout.append(sidebar, main);
    content.appendChild(layout);
  }

  function renderHerbSpread(container, speciesId) {
    const herb = herbs[speciesId];
    const gesehen = isGesehen(currentProgress, speciesId);

    // Left page: plate + sprite
    const left = document.createElement("div");
    left.className = "book__page book__page--left";

    const plateDiv = document.createElement("div");
    plateDiv.className = "book__plate";

    if (gesehen) {
      // The PixelLab herb sprite as shown on the ground (falls back to SL tile).
      const groundSprite = () => {
        const spriteImg = document.createElement("img");
        spriteImg.className = "book__sprite-img";
        spriteImg.src = `assets/objects/herbs/${speciesId}.png`;
        spriteImg.alt = herb.nameLat ?? "";
        spriteImg.addEventListener("error", () => {
          const canvas = document.createElement("canvas");
          canvas.className = "book__sprite";
          canvas.width = TILE_BOOK_SIZE; canvas.height = TILE_BOOK_SIZE;
          const ctx2 = canvas.getContext("2d");
          ctx2.imageSmoothingEnabled = false;
          const [atlas, idx] = herbTile(speciesId);
          drawTile(ctx2, atlas, idx, 0, 0, TILE_BOOK_SIZE);
          spriteImg.replaceWith(canvas);
        });
        return spriteImg;
      };
      if (herb.plate) {
        // Botanical anatomy plate — click to open full-size lightbox.
        const plateImg = document.createElement("img");
        plateImg.className = "book__plate-img";
        plateImg.src = `assets/plates/${herb.plate}`;
        plateImg.alt = herb.nameLat ?? "";
        plateImg.title = "Vergrößern";
        plateImg.style.cursor = "pointer";
        plateImg.addEventListener("click", () =>
          getLightbox().open(`assets/plates/${herb.plate}`, herb.nameLat ?? ""));
        // Missing/broken plate → show the ground sprite instead of a blank.
        plateImg.addEventListener("error", () => plateImg.replaceWith(groundSprite()));
        plateDiv.appendChild(plateImg);
      } else {
        plateDiv.appendChild(groundSprite());
      }
    }

    left.appendChild(plateDiv);

    // Latin name below plate (if gesehen)
    if (gesehen) {
      const lat = el("p", herb.nameLat);
      lat.className = "book__latin";
      left.appendChild(lat);
      if (herb.schweizerdeutsch) {
        const sd = el("p", `«${herb.schweizerdeutsch}»`);
        sd.className = "book__schweizerdeutsch";
        left.appendChild(sd);
      }
    }

    // Right page: progressive facts
    const right = document.createElement("div");
    right.className = "book__page book__page--right";

    if (!gesehen) {
      right.appendChild(el("p", strings.buch.nochNichtGesehen));
      container.append(left, right);
      return;
    }

    // Name (always after first sighting)
    const nameH = el("h2", herb.nameDe);
    nameH.className = "book__herb-name";
    right.appendChild(nameH);

    // Revealed merkmale
    const revealed = getRevealedMerkmale(currentProgress, speciesId);
    if (revealed.length > 0) {
      const section = bookSection(strings.buch.merkmale);
      const dl = document.createElement("dl");
      dl.className = "book__merkmale";
      for (const key of MERKMALE_ORDER) {
        if (!revealed.includes(key)) continue;
        const dt = el("dt", strings.merkmale[key]);
        const dd = el("dd", herb.merkmale[key]);
        dl.append(dt, dd);
      }
      section.appendChild(dl);
      right.appendChild(section);
    }

    // Standort + Saison (after first correct harvest: correct >= 1)
    if ((currentProgress[speciesId]?.correct ?? 0) >= 1) {
      const section = bookSection(strings.buch.standort);
      const dl = document.createElement("dl");
      dl.className = "book__standort";
      addDlRow(dl, strings.buch.standort,
        herb.biotope.map((b) => strings.biotope[b]).join(", "));
      addDlRow(dl, strings.buch.sonne, herb.sonne);
      addDlRow(dl, strings.buch.boden, herb.boden);

      // Erntezeit: list all teil windows
      const erntezeilen = [];
      for (const [teil, windows] of Object.entries(herb.saison?.teil ?? {})) {
        const wText = windows.map(seasonWindowDe).join(", ");
        erntezeilen.push(`${strings.teile[teil]}: ${wText}`);
      }
      if (erntezeilen.length) {
        addDlRow(dl, strings.buch.erntezeit, erntezeilen.join(" · "));
      }

      section.appendChild(dl);
      right.appendChild(section);
    }

    // Wirkung (shown as soon as gesehen — knowledge-first)
    {
      const section = bookSection(strings.buch.wirkung);
      if (herb.verwendung?.wirkungTraditionell) {
        section.appendChild(el("p", herb.verwendung.wirkungTraditionell));
      }

      // "Hilft bei: …" — reverse-lookup from ailments registry
      const remedyEntries = remediesForSpecies(speciesId);
      if (remedyEntries.length > 0) {
        // Group ailment names by output so we can emit "Erkältung, Husten (als Tee)"
        const byOutput = {};
        for (const { ailmentId, output } of remedyEntries) {
          const ail = ailments[ailmentId];
          if (!ail) continue;
          if (!byOutput[output]) byOutput[output] = [];
          byOutput[output].push(ail.nameDe);
        }
        const parts = Object.entries(byOutput).map(([output, names]) => {
          const prep = strings.verarbeitet[output] ?? output;
          return `${names.join(", ")} (als ${prep})`;
        });
        const hilftBeiEl = document.createElement("p");
        hilftBeiEl.className = "book__hilft-bei";
        hilftBeiEl.textContent = `${strings.buch.hilftBei} ${parts.join("; ")}`;
        section.appendChild(hilftBeiEl);
      }

      right.appendChild(section);
    }

    // Verwendung — teil-based prep list (after first craft OR after gelernt)
    if (hasCrafted(currentProgress, speciesId) || isGelernt(currentProgress, speciesId)) {
      const section = bookSection(strings.buch.verwendung);
      const teile = Object.keys(herb.verwendung ?? {}).filter((k) => k !== "wirkungTraditionell");
      if (teile.length) {
        const list = el("p",
          teile.map((t) => `${strings.teile[t] ?? t}: ${(herb.verwendung[t] ?? []).join(", ")}`).join(" · ")
        );
        section.appendChild(list);
      }
      right.appendChild(section);
    }

    // Verwechslung panel (after meeting lookalike)
    const verwechslungen = (herb.verwechslung ?? []).filter(
      (v) => isGesehen(currentProgress, v.art)
    );
    // Also check reverse: herbs that list this one as verwechslung
    for (const [id, h] of Object.entries(herbs)) {
      if ((h.verwechslung ?? []).some((v) => v.art === speciesId)
          && isGesehen(currentProgress, id)) {
        const existingArt = herb.verwechslung?.find((v) => v.art === id);
        if (!existingArt) {
          verwechslungen.push({
            art: id,
            gefahr: (h.verwechslung.find((v) => v.art === speciesId) ?? {}).gefahr ?? "",
            unterscheidung: `Verwechslungsart: ${herbs[id].nameDe}`,
          });
        }
      }
    }

    if (verwechslungen.length > 0) {
      const section = bookSection(strings.buch.verwechslung);
      section.classList.add("book__section--danger");
      for (const v of verwechslungen) {
        const p = el("p", `${herbs[v.art]?.nameDe ?? v.art}: ${v.unterscheidung}`);
        p.className = "book__verwechslung-entry";
        section.appendChild(p);
      }
      right.appendChild(section);
    }

    container.append(left, right);
  }

  // ── Rezepte chapter ───────────────────────────────────────────────────────
  function renderRezepte() {
    content.innerHTML = "";

    const seenSpecies = new Set(
      Object.keys(herbs).filter((id) => isGesehen(currentProgress, id))
    );
    const known = recipes.filter((r) => seenSpecies.has(r.species));

    if (known.length === 0) {
      content.appendChild(el("p", strings.buch.keineRezepte));
      return;
    }

    const list = document.createElement("div");
    list.className = "book__rezepte-list";

    for (const recipe of known) {
      const herb = herbs[recipe.species];
      const method = methods[recipe.method];
      const card = document.createElement("div");
      card.className = "book__rezept-card";

      const title = el("h3",
        `${herb.nameDe} — ${strings.teile[recipe.teil]} → ${strings.verarbeitet[recipe.output] ?? recipe.output}`
      );
      title.className = "book__rezept-title";
      card.appendChild(title);

      if (method) {
        const station = el("p", `${strings.stationen[method.station] ?? method.station}`);
        station.className = "book__rezept-station";
        card.appendChild(station);
      }

      const duration = el("p",
        `${strings.buch.dauer}: ${recipe.durationDays === 0
          ? strings.buch.sofort
          : `${recipe.durationDays} ${recipe.durationDays === 1 ? strings.werkstatt.tag : strings.werkstatt.tage}`
        }`
      );
      duration.className = "book__rezept-dauer";
      card.appendChild(duration);

      if (recipe.mengeDe) {
        const menge = el("p", recipe.mengeDe);
        menge.className = "book__rezept-menge";
        card.appendChild(menge);
      }

      if (recipe.wirkungDe && (hasCrafted(currentProgress, recipe.species) || isGelernt(currentProgress, recipe.species))) {
        const wirkung = el("p", recipe.wirkungDe);
        wirkung.className = "book__rezept-wirkung";
        card.appendChild(wirkung);
      }

      if (recipe.requiresZutat) {
        const zutatNames = [].concat(recipe.requiresZutat).map(zutatName).join(", ");
        const note = el("p",
          `${strings.werkstatt.benoetigtZutat}${zutatNames} ${strings.werkstatt.baldigVerfuegbar}`
        );
        note.className = "book__rezept-note";
        card.appendChild(note);
      }

      list.appendChild(card);
    }

    content.appendChild(list);
  }

  // ── Verwechslungen chapter ────────────────────────────────────────────────
  function renderVerwechslungen() {
    content.innerHTML = "";

    const seen = new Set(Object.keys(herbs).filter((id) => isGesehen(currentProgress, id)));
    const pairs = [];
    const added = new Set();

    for (const [id, herb] of Object.entries(herbs)) {
      if (!seen.has(id)) continue;
      for (const v of herb.verwechslung ?? []) {
        const key = [id, v.art].sort().join(":");
        if (added.has(key)) continue;
        added.add(key);
        pairs.push({ a: id, b: v.art, gefahr: v.gefahr, unterscheidung: v.unterscheidung });
      }
    }

    if (pairs.length === 0) {
      content.appendChild(el("p", strings.buch.verwechslungenLeer));
      return;
    }

    const title = el("h2", strings.buch.verwechslungenTitel);
    title.className = "book__section-label";
    content.appendChild(title);

    const list = document.createElement("div");
    list.className = "book__verwechslungen-list";

    for (const pair of pairs) {
      const card = document.createElement("div");
      card.className = `book__verwechslung-card book__verwechslung-card--${pair.gefahr ?? "wirkungslos"}`;

      const nameA = herbs[pair.a]?.nameDe ?? pair.a;
      const nameB = herbs[pair.b]?.nameDe ?? pair.b;
      const pairTitle = el("h3", `${nameA} ${strings.buch.vs ?? "↔"} ${nameB}`);
      pairTitle.className = "book__verwechslung-pair";
      card.appendChild(pairTitle);

      if (pair.gefahr) {
        const danger = el("p", pair.gefahr === "toedlich" ? "⚠ Tödlich giftig!" : pair.gefahr === "giftig" ? "⚠ Giftig" : "Wirkungslos");
        danger.className = `book__verwechslung-gefahr book__verwechslung-gefahr--${pair.gefahr}`;
        card.appendChild(danger);
      }

      const unterscheidung = el("p", pair.unterscheidung);
      unterscheidung.className = "book__verwechslung-unterscheidung";
      card.appendChild(unterscheidung);

      list.appendChild(card);
    }

    content.appendChild(list);
  }

  // ── Almanach chapter ──────────────────────────────────────────────────────
  function renderAlmanach() {
    content.innerHTML = "";

    const title = el("h2", strings.buch.almanachTitel);
    title.className = "book__section-label";
    content.appendChild(title);

    if (!currentTime) {
      content.appendChild(el("p", strings.buch.almanachLeer));
      return;
    }

    const season = getSeasonKey(currentTime);
    const day = currentTime.day;

    // What's in season now (game time)
    const jetzt = [];
    for (const [id, herb] of Object.entries(herbs)) {
      if (!isGesehen(currentProgress, id)) continue;
      const teile = herb.saison?.teil ?? {};
      const available = [];
      for (const [teil, windows] of Object.entries(teile)) {
        const inSeason = windows.some((w) => {
          const [s, range] = w.split(":");
          const [start, end] = range.split("-").map(Number);
          return s === season && day >= start && day <= end;
        });
        if (inSeason) available.push(teil);
      }
      if (available.length > 0) jetzt.push({ id, herb, available });
    }

    const nowSection = bookSection(strings.buch.almanachDraussen ?? "Jetzt ernten");
    if (jetzt.length === 0) {
      nowSection.appendChild(el("p", strings.buch.almanachLeer));
    } else {
      const dl = document.createElement("dl");
      dl.className = "book__almanach-list";
      for (const { herb, available } of jetzt) {
        const dt = el("dt", herb.nameDe);
        const dd = el("dd", available.map((t) => strings.teile[t] ?? t).join(", "));
        dl.append(dt, dd);
      }
      nowSection.appendChild(dl);
    }
    content.appendChild(nowSection);

    // What grows in current real-world season months (based on realMonths)
    const seasonMonths = { fruehling: [3,4,5], sommer: [6,7,8], herbst: [9,10,11], winter: [12,1,2] };
    const currentMonths = seasonMonths[season] ?? [];
    const draussen = Object.entries(herbs).filter(([id, h]) =>
      isGesehen(currentProgress, id) && (h.realMonths ?? []).some((m) => currentMonths.includes(m))
    );

    const realSection = bookSection(strings.buch.almanachJetzt ?? "In der realen Schweiz");
    if (draussen.length === 0) {
      realSection.appendChild(el("p", strings.buch.almanachDraussenLeer));
    } else {
      const dl = document.createElement("dl");
      dl.className = "book__almanach-list";
      for (const [id, herb] of draussen) {
        const dt = el("dt", herb.nameDe);
        const dd = el("dd", herb.nameLat);
        dl.append(dt, dd);
      }
      realSection.appendChild(dl);
    }
    content.appendChild(realSection);

    const hint = el("p", strings.buch.almanachHinweis);
    hint.className = "book__almanach-hint";
    content.appendChild(hint);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function renderContent() {
    if (activeTab === "pflanzen") renderPflanzen();
    else if (activeTab === "rezepte") renderRezepte();
    else if (activeTab === "verwechslungen") renderVerwechslungen();
    else if (activeTab === "almanach") renderAlmanach();
  }

  function bookSection(labelText) {
    const section = document.createElement("div");
    section.className = "book__section";
    const label = el("h3", labelText);
    label.className = "book__section-label";
    section.appendChild(label);
    return section;
  }

  function addDlRow(dl, label, value) {
    const dt = el("dt", label); const dd = el("dd", value);
    dl.append(dt, dd);
  }

  function makeTab(text) {
    const btn = document.createElement("button");
    btn.className = "book__tab";
    btn.textContent = text;
    return btn;
  }

  function el(tag, text) {
    const e = document.createElement(tag);
    e.textContent = text;
    return e;
  }

  function seasonWindowDe(window) {
    const [season, range] = window.split(":");
    const [start, end] = range.split("-");
    const sName = strings.seasons[season] ?? season;
    return `${sName} (Tag ${start}–${end})`;
  }

  function zutatName(key) {
    const names = {
      schnaps: "Schnaps", olivenoel: "Olivenöl", bienenwachs: "Bienenwachs",
      honig: "Honig", zucker: "Zucker", pfeffer: "Schwarzer Pfeffer",
    };
    return names[key] ?? key;
  }

  return {
    open(progress, time = null) {
      currentProgress = progress;
      currentTime = time;
      // Default to first seen species
      if (!selectedSpecies || !isGesehen(progress, selectedSpecies)) {
        selectedSpecies = Object.keys(herbs).find((id) => isGesehen(progress, id)) ?? null;
      }
      overlay.hidden = false;
      switchTab(activeTab);
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
