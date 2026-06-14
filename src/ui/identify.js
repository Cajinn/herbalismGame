import { strings } from "../data/strings.de.js";
import { herbs } from "../data/herbs/index.js";
import { drawTile } from "../engine/tileset.js";
import { herbTile } from "../data/herbTiles.js";
import { recordIdentification, isGelernt } from "../sim/progress.js";

// ── Botanical plate lightbox ──────────────────────────────────────────────────
// A singleton overlay that shows a full-size plate image.  Created once on first
// use and reused for every subsequent open.
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

  // Close hint — TODO: move to strings.de.js
  const hint = document.createElement("p");
  hint.className = "plate-lightbox__hint";
  hint.textContent = "Klicken oder Esc zum Schließen";

  overlay.append(img, hint);
  document.body.appendChild(overlay);

  function closeLightbox() {
    overlay.hidden = true;
    img.src = "";
  }

  overlay.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) {
      closeLightbox();
    }
  });

  _lightbox = {
    open(src, altText) {
      img.src = src;
      img.alt = altText ?? "";
      overlay.hidden = false;
    },
  };
  return _lightbox;
}

const MERKMALE_ORDER = ["blattform", "blattstellung", "bluete", "geruch", "stengel", "wuchshoehe"];
const MAX_CANDIDATES = 4;

// Candidate list for the guessing step (PLAN.md §7): the true species, its
// known lookalikes (in either direction of the verwechslung relation), plus
// extra same-biotope species up to MAX_CANDIDATES.
function getCandidates(trueId) {
  const herb = herbs[trueId];
  const ids = new Set([trueId]);

  for (const v of herb.verwechslung ?? []) ids.add(v.art);

  for (const [id, h] of Object.entries(herbs)) {
    if ((h.verwechslung ?? []).some((v) => v.art === trueId)) ids.add(id);
  }

  for (const [id, h] of Object.entries(herbs)) {
    if (ids.size >= MAX_CANDIDATES) break;
    if (ids.has(id)) continue;
    if (h.biotope.some((b) => herb.biotope.includes(b))) ids.add(id);
  }

  return shuffle([...ids]);
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Plant parts that are both currently in season and have a recorded use —
// the data-driven reason dangerous lookalikes never offer a harvest choice.
function getHarvestableTeile(herb, availableTeile) {
  return availableTeile.filter(
    (teil) => Array.isArray(herb.verwendung?.[teil]) && herb.verwendung[teil].length > 0,
  );
}

function addRow(dl, label, value) {
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value;
  dl.append(dt, dd);
}

// DOM overlay for the Bestimmen dialog (PLAN.md §7). `progress` is the
// mutable mastery-tracking object (src/sim/progress.js); `onExamine` is
// called for each revealed feature and returns true if it rolled the day
// over; `onHarvest(spawn, teil)` is called when the player harvests a part.
export function createIdentifyDialog(root, { progress, onExamine, onHarvest }) {
  const overlay = document.createElement("div");
  overlay.className = "identify";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "identify__panel";
  overlay.appendChild(panel);
  root.appendChild(overlay);

  function close() {
    overlay.hidden = true;
    panel.innerHTML = "";
  }

  function renderResult(body, spawn) {
    const { herb, availableTeile } = spawn;
    const harvestable = getHarvestableTeile(herb, availableTeile);

    if (harvestable.length === 0) {
      const note = document.createElement("p");
      note.textContent = strings.bestimmen.keineVerwendung;
      body.appendChild(note);

      if (herb.verwendung?.wirkungTraditionell) {
        const info = document.createElement("p");
        info.className = "identify__info";
        info.textContent = herb.verwendung.wirkungTraditionell;
        body.appendChild(info);
      }
      return;
    }

    const actions = document.createElement("div");
    actions.className = "identify__harvest";
    for (const teil of harvestable) {
      const btn = document.createElement("button");
      btn.textContent = `${strings.bestimmen.ernten}: ${strings.teile[teil]}`;
      btn.addEventListener("click", () => {
        onHarvest(spawn, teil);
        close();
      });
      actions.appendChild(btn);
    }

    const skip = document.createElement("button");
    skip.textContent = strings.bestimmen.nichtsErnten;
    skip.addEventListener("click", close);
    actions.appendChild(skip);

    body.appendChild(actions);
  }

  function renderCandidates(body, spawn) {
    const prompt = document.createElement("p");
    prompt.textContent = strings.bestimmen.wasIstDas;
    body.appendChild(prompt);

    const list = document.createElement("div");
    list.className = "identify__candidates";
    body.appendChild(list);

    // Shown after a wrong guess: lets player harvest with wrong label (risky!)
    let mislabelSection = null;

    for (const candidateId of getCandidates(spawn.species)) {
      const btn = document.createElement("button");
      btn.textContent = herbs[candidateId].nameDe;
      btn.addEventListener("click", () => {
        if (candidateId !== spawn.species) {
          btn.disabled = true;
          let info = body.querySelector(".identify__inkorrekt");
          if (!info) {
            info = document.createElement("p");
            info.className = "identify__inkorrekt";
            body.appendChild(info);
          }
          info.textContent = strings.bestimmen.inkorrekt;

          // Offer mislabeled harvest option so player can still take the plant
          if (mislabelSection) mislabelSection.remove();
          mislabelSection = document.createElement("div");
          mislabelSection.className = "identify__mislabel";
          const wrongHarvestable = getHarvestableTeile(herbs[candidateId], spawn.availableTeile);
          if (wrongHarvestable.length > 0) {
            const warn = document.createElement("p");
            warn.className = "identify__mislabel-warn";
            warn.textContent = strings.bestimmen.mislabelWarn ?? "Trotzdem ernten (auf eigene Gefahr)?";
            mislabelSection.appendChild(warn);
            for (const teil of wrongHarvestable) {
              const mBtn = document.createElement("button");
              mBtn.className = "identify__mislabel-btn";
              mBtn.textContent = `${strings.bestimmen.ernten}: ${strings.teile[teil]} (als ${herbs[candidateId].nameDe})`;
              mBtn.addEventListener("click", () => {
                onHarvest({ ...spawn, labeledAs: candidateId }, teil);
                close();
              });
              mislabelSection.appendChild(mBtn);
            }
          }
          body.appendChild(mislabelSection);
          return;
        }

        prompt.remove();
        list.remove();
        if (mislabelSection) mislabelSection.remove();

        const correct = document.createElement("p");
        correct.textContent = strings.bestimmen.korrekt;
        body.appendChild(correct);

        if (recordIdentification(progress, spawn.species, true)) {
          const gelernt = document.createElement("p");
          gelernt.textContent = strings.meldungen.gelernt;
          body.appendChild(gelernt);
        }

        renderResult(body, spawn);
      });
      list.appendChild(btn);
    }
  }

  const TILE_PREVIEW_SIZE = 96;

  function buildSpriteCanvas(speciesKey) {
    const canvas = document.createElement("canvas");
    canvas.className = "identify__sprite";
    canvas.width  = TILE_PREVIEW_SIZE;
    canvas.height = TILE_PREVIEW_SIZE;
    const spriteCtx = canvas.getContext("2d");
    spriteCtx.imageSmoothingEnabled = false;
    const [atlas, idx] = herbTile(speciesKey);
    drawTile(spriteCtx, atlas, idx, 0, 0, TILE_PREVIEW_SIZE);
    return canvas;
  }

  // Returns an <img> for the PixelLab herb PNG, falling back to SL tile canvas.
  function buildSpriteImg(speciesKey) {
    const img = document.createElement("img");
    img.className = "identify__sprite";
    img.src = `assets/objects/herbs/${speciesKey}.png`;
    img.alt = "";
    img.addEventListener("error", () => img.replaceWith(buildSpriteCanvas(speciesKey)));
    return img;
  }

  function render(spawn) {
    panel.innerHTML = "";
    const { herb } = spawn;

    const title = document.createElement("h2");
    title.className = "identify__title";
    title.textContent = strings.bestimmen.titel;
    panel.appendChild(title);

    const header = document.createElement("div");
    header.className = "identify__header";

    // Show real botanical plate when available; fall back to pixel sprite.
    // Path convention matches book.js: assets/plates/<plate>
    if (herb.plate) {
      const plateImg = document.createElement("img");
      plateImg.className = "identify__plate";
      plateImg.src = `assets/plates/${herb.plate}`;
      plateImg.alt = herb.nameLat ?? "";
      plateImg.title = "Vergrößern";

      plateImg.addEventListener("click", () => {
        getLightbox().open(`assets/plates/${herb.plate}`, herb.nameLat ?? "");
      });

      // On load error (missing/broken plate), fall back to the SAME sprite the
      // plant shows on the ground — not a generic tile.
      plateImg.addEventListener("error", () => {
        plateImg.replaceWith(buildSpriteImg(spawn.species));
      });

      header.appendChild(plateImg);
    } else {
      header.appendChild(buildSpriteImg(spawn.species));
    }

    const standort = document.createElement("dl");
    standort.className = "identify__standort";
    addRow(
      standort,
      strings.bestimmen.standort,
      herb.biotope.map((b) => strings.biotope[b]).join(", "),
    );
    addRow(standort, strings.bestimmen.sonne, herb.sonne);
    addRow(standort, strings.bestimmen.boden, herb.boden);
    header.appendChild(standort);

    panel.appendChild(header);

    const merkmaleList = document.createElement("div");
    merkmaleList.className = "identify__merkmale";
    for (const key of MERKMALE_ORDER) {
      const row = document.createElement("div");
      row.className = "identify__merkmal";

      const text = document.createElement("p");
      text.className = "identify__merkmal-text";
      text.hidden = true;

      const btn = document.createElement("button");
      btn.textContent = `${strings.bestimmen.untersuchen}: ${strings.merkmale[key]}`;
      btn.addEventListener("click", () => {
        text.textContent = `${strings.merkmale[key]}: ${herb.merkmale[key]}`;
        text.hidden = false;
        btn.hidden = true;
        if (onExamine(spawn.species, key)) close();
      });

      row.append(btn, text);
      merkmaleList.appendChild(row);
    }
    panel.appendChild(merkmaleList);

    const body = document.createElement("div");
    body.className = "identify__body";
    panel.appendChild(body);

    if (isGelernt(progress, spawn.species)) {
      const known = document.createElement("p");
      known.textContent = `${strings.bestimmen.erkanntGelernt} ${herb.nameDe}`;
      body.appendChild(known);
      renderResult(body, spawn);
    } else {
      renderCandidates(body, spawn);
    }

    const closeBtn = document.createElement("button");
    closeBtn.className = "identify__close";
    closeBtn.textContent = strings.bestimmen.schliessen;
    closeBtn.addEventListener("click", close);
    panel.appendChild(closeBtn);
  }

  return {
    open(spawn) {
      render(spawn);
      overlay.hidden = false;
    },
    close,
    isOpen() {
      return !overlay.hidden;
    },
  };
}
