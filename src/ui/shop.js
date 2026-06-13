import { strings } from "../data/strings.de.js";
import { shopCatalog } from "../data/shop.js";

// Dorfladen dialog. onBuy(item, preis) → bool (false = not enough coins).
// Returns { open(coins), close(), isOpen() }.
export function createShopDialog(root, { onBuy }) {
  const overlay = document.createElement("div");
  overlay.className = "shop-dialog";
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "shop-dialog__panel";
  overlay.appendChild(panel);
  root.appendChild(overlay);

  let _coins = 0;

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

      const btn = document.createElement("button");
      btn.textContent = strings.laden.kaufen;
      btn.disabled = _coins < item.preis;
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
    open(coins) {
      _coins = coins;
      overlay.hidden = false;
      render();
    },
    close,
    isOpen() { return !overlay.hidden; },
  };
}
