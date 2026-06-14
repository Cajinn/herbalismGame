import { strings } from "../data/strings.de.js";
import { shopCatalog } from "../data/shop.js";

// Dorfladen dialog. onBuy(item, preis) → bool (false = not enough coins or sold out).
// Returns { open(coins, { hardMode, stock }), close(), isOpen() }.
export function createShopDialog(root, { onBuy }) {
  const overlay = document.createElement("div");
  overlay.className = "shop-dialog";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "shop-dialog__panel";
  overlay.appendChild(panel);
  root.appendChild(overlay);

  let _coins = 0;
  let _hardMode = false;
  let _stock = {};

  function close() {
    overlay.hidden = true;
    panel.innerHTML = "";
  }

  function el(tag, text) {
    const e = document.createElement(tag);
    e.textContent = text;
    return e;
  }

  function render() {
    panel.innerHTML = "";

    const title = el("h2", strings.laden.titel);
    title.className = "shop-dialog__title";
    panel.appendChild(title);

    const coinsEl = el("p", `${strings.laden.muenzen} ${_coins}`);
    coinsEl.className = "shop-dialog__coins";
    panel.appendChild(coinsEl);

    const list = document.createElement("div");
    list.className = "shop-dialog__list";

    for (const item of shopCatalog) {
      const row = document.createElement("div");
      row.className = "shop-dialog__row";

      const nameEl = el("span", item.nameDe);
      nameEl.className = "shop-dialog__item-name";

      const descEl = el("span", item.descDe);
      descEl.className = "shop-dialog__item-desc";

      const preisEl = el("span", `${item.preis} Münzen`);
      preisEl.className = "shop-dialog__item-preis";

      // WP4b: In Hard Mode, show stock count / sold-out state for tracked items.
      const isTracked = _hardMode && item.stock != null;
      const remaining = isTracked ? (_stock[item.id] ?? 0) : Infinity;
      const soldOut = isTracked && remaining <= 0;

      if (isTracked) {
        const stockEl = document.createElement("span");
        stockEl.className = "shop-dialog__item-stock";
        if (soldOut) {
          stockEl.textContent = strings.laden.ausverkauft;
          stockEl.classList.add("shop-dialog__item-stock--out");
        } else {
          stockEl.textContent = `${strings.laden.vorrat} ${remaining}`;
        }
        row.appendChild(stockEl);
      }

      const btn = document.createElement("button");
      btn.textContent = strings.laden.kaufen;
      // Disable when not enough coins OR sold out in Hard Mode.
      btn.disabled = _coins < item.preis || soldOut;
      btn.addEventListener("click", () => {
        const ok = onBuy(item, item.preis);
        if (ok) {
          // coins updated externally; caller must re-open or we re-render
          // We get the updated coins via re-render triggered by re-open.
          // Simplest: close and let player re-open.
          close();
        }
      });

      row.append(nameEl, descEl, preisEl, btn);
      list.appendChild(row);
    }

    panel.appendChild(list);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = strings.bestimmen.schliessen;
    closeBtn.className = "shop-dialog__close";
    closeBtn.addEventListener("click", close);
    panel.appendChild(closeBtn);
  }

  return {
    open(coins, { hardMode = false, stock = {} } = {}) {
      _coins = coins;
      _hardMode = hardMode;
      _stock = stock;
      overlay.hidden = false;
      render();
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
