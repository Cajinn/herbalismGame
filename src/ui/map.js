import { strings } from "../data/strings.de.js";

// ── Overview map panel ──────────────────────────────────────────────────────
// A hand-drawn SVG overview of the world centred on Oberbottigen (Dorf).
// Opened via the HUD "Karte" button or the M key.
// API: { open(currentMapId), close(), toggle(currentMapId), isOpen() }

const AREAS = [
  // id, label, x, y (SVG coords, centre of node), icon, description
  { id: "alpweide",         label: "Alpweide",          x: 300, y:  55, icon: "⛰", note: "Bergkräuter (Vertrauen nötig)" },
  { id: "wald",             label: "Wald",               x: 300, y: 145, icon: "🌲", note: "Wildkräuter im Unterholz"       },
  { id: "waldrand",         label: "Waldrand",           x: 300, y: 235, icon: "🌿", note: "Kräuter am Waldrand"            },
  { id: "dorf",             label: "Oberbottigen",       x: 300, y: 330, icon: "🏘", note: "Dorf · Laden · Anschlagbrett"  },
  { id: "kraeuterhaeuschen",label: "Kräuterhäuschen",   x: 180, y: 330, icon: "🏡", note: "Dein Zuhause & Werkstatt"       },
  { id: "wiese",            label: "Wiese",              x: 430, y: 330, icon: "🌸", note: "Blumenwiese & Wiesenblumen"    },
  { id: "bachufer",         label: "Bachufer",           x: 160, y: 430, icon: "💧", note: "Feuchte Uferpflanzen"          },
  { id: "garten",           label: "Garten",             x: 300, y: 430, icon: "🌱", note: "Eigener Kräutergarten"         },
];

// Connections (undirected edges between area ids)
const CONNECTIONS = [
  ["alpweide",          "wald"],
  ["wald",              "waldrand"],
  ["waldrand",          "dorf"],
  ["dorf",              "kraeuterhaeuschen"],
  ["dorf",              "wiese"],
  ["dorf",              "bachufer"],
  ["dorf",              "garten"],
];

// Key spots shown as small labelled markers inside nodes
const KEY_SPOTS = {
  dorf:              ["Dorfladen", "Anschlagbrett", "Abgabebox"],
  kraeuterhaeuschen: ["Werkstatt", "Dachboden", "Bett"],
  wald:              ["Wildkräuter"],
  waldrand:          ["Waldkräuter"],
  wiese:             ["Wiesenblumen"],
  bachufer:          ["Uferpflanzen"],
  garten:            ["Anbaubeete"],
  alpweide:          ["Bergkräuter"],
};

// ── SVG builder ─────────────────────────────────────────────────────────────

function buildSvg(currentMapId) {
  const SVG_W = 580;
  const SVG_H = 510;

  // Parchment paper pattern fill for background
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
  svg.setAttribute("xmlns", svgNS);
  svg.style.cssText = "width:100%;height:100%;display:block;";

  // ── Defs ────────────────────────────────────────────────────────────────
  const defs = document.createElementNS(svgNS, "defs");

  // Paper texture pattern
  const pattern = document.createElementNS(svgNS, "pattern");
  pattern.setAttribute("id", "paper");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("width", "60");
  pattern.setAttribute("height", "60");
  const paperRect = document.createElementNS(svgNS, "rect");
  paperRect.setAttribute("width", "60");
  paperRect.setAttribute("height", "60");
  paperRect.setAttribute("fill", "#f5ead6");
  // Light noise lines for aged-paper texture
  const line1 = document.createElementNS(svgNS, "line");
  line1.setAttribute("x1", "0"); line1.setAttribute("y1", "20");
  line1.setAttribute("x2", "60"); line1.setAttribute("y2", "20");
  line1.setAttribute("stroke", "#e8d9ba"); line1.setAttribute("stroke-width", "0.3");
  const line2 = document.createElementNS(svgNS, "line");
  line2.setAttribute("x1", "0"); line2.setAttribute("y1", "45");
  line2.setAttribute("x2", "60"); line2.setAttribute("y2", "45");
  line2.setAttribute("stroke", "#e8d9ba"); line2.setAttribute("stroke-width", "0.2");
  pattern.append(paperRect, line1, line2);

  // Drop shadow filter for nodes
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", "shadow");
  filter.setAttribute("x", "-20%"); filter.setAttribute("y", "-20%");
  filter.setAttribute("width", "140%"); filter.setAttribute("height", "140%");
  const feDropShadow = document.createElementNS(svgNS, "feDropShadow");
  feDropShadow.setAttribute("dx", "2"); feDropShadow.setAttribute("dy", "3");
  feDropShadow.setAttribute("stdDeviation", "3");
  feDropShadow.setAttribute("flood-color", "#7a5c30");
  feDropShadow.setAttribute("flood-opacity", "0.35");
  filter.appendChild(feDropShadow);

  // Glow filter for current area
  const glow = document.createElementNS(svgNS, "filter");
  glow.setAttribute("id", "glow");
  glow.setAttribute("x", "-30%"); glow.setAttribute("y", "-30%");
  glow.setAttribute("width", "160%"); glow.setAttribute("height", "160%");
  const feGlow = document.createElementNS(svgNS, "feDropShadow");
  feGlow.setAttribute("dx", "0"); feGlow.setAttribute("dy", "0");
  feGlow.setAttribute("stdDeviation", "5");
  feGlow.setAttribute("flood-color", "#e8a020");
  feGlow.setAttribute("flood-opacity", "0.9");
  glow.appendChild(feGlow);

  defs.append(pattern, filter, glow);
  svg.appendChild(defs);

  // ── Background ──────────────────────────────────────────────────────────
  const bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("width", SVG_W);
  bg.setAttribute("height", SVG_H);
  bg.setAttribute("fill", "url(#paper)");
  bg.setAttribute("rx", "8");
  svg.appendChild(bg);

  // Aged border frame
  const border = document.createElementNS(svgNS, "rect");
  border.setAttribute("x", "6"); border.setAttribute("y", "6");
  border.setAttribute("width", SVG_W - 12); border.setAttribute("height", SVG_H - 12);
  border.setAttribute("fill", "none");
  border.setAttribute("stroke", "#9a7448");
  border.setAttribute("stroke-width", "2.5");
  border.setAttribute("rx", "5");
  border.setAttribute("opacity", "0.7");
  svg.appendChild(border);

  // Inner border line (double-line frame effect)
  const border2 = document.createElementNS(svgNS, "rect");
  border2.setAttribute("x", "11"); border2.setAttribute("y", "11");
  border2.setAttribute("width", SVG_W - 22); border2.setAttribute("height", SVG_H - 22);
  border2.setAttribute("fill", "none");
  border2.setAttribute("stroke", "#b89060");
  border2.setAttribute("stroke-width", "1");
  border2.setAttribute("rx", "3");
  border2.setAttribute("opacity", "0.5");
  svg.appendChild(border2);

  // ── Title ────────────────────────────────────────────────────────────────
  const title = document.createElementNS(svgNS, "text");
  title.setAttribute("x", SVG_W / 2);
  title.setAttribute("y", "32");
  title.setAttribute("text-anchor", "middle");
  title.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
  title.setAttribute("font-size", "18");
  title.setAttribute("font-weight", "bold");
  title.setAttribute("fill", "#4a3010");
  title.setAttribute("letter-spacing", "2");
  title.textContent = strings.karte?.titel ?? "Karte des Umlands";
  svg.appendChild(title);

  // Decorative line under title
  const titleLine = document.createElementNS(svgNS, "line");
  titleLine.setAttribute("x1", "60"); titleLine.setAttribute("y1", "38");
  titleLine.setAttribute("x2", SVG_W - 60); titleLine.setAttribute("y2", "38");
  titleLine.setAttribute("stroke", "#9a7448");
  titleLine.setAttribute("stroke-width", "1.2");
  titleLine.setAttribute("opacity", "0.7");
  svg.appendChild(titleLine);

  // Compass rose (top-right corner)
  drawCompass(svg, svgNS, SVG_W - 52, 60);

  // ── Connections (paths) ─────────────────────────────────────────────────
  const areaById = Object.fromEntries(AREAS.map((a) => [a.id, a]));
  for (const [aId, bId] of CONNECTIONS) {
    const a = areaById[aId];
    const b = areaById[bId];
    if (!a || !b) continue;

    // Quest-gated path (alpweide) shown dashed
    const isQuestPath = (aId === "alpweide" || bId === "alpweide");

    const path = document.createElementNS(svgNS, "line");
    path.setAttribute("x1", a.x); path.setAttribute("y1", a.y);
    path.setAttribute("x2", b.x); path.setAttribute("y2", b.y);
    path.setAttribute("stroke", isQuestPath ? "#b09060" : "#8a6838");
    path.setAttribute("stroke-width", isQuestPath ? "1.5" : "2.5");
    if (isQuestPath) path.setAttribute("stroke-dasharray", "5,4");
    path.setAttribute("opacity", isQuestPath ? "0.55" : "0.7");
    svg.appendChild(path);
  }

  // ── Area nodes ──────────────────────────────────────────────────────────
  for (const area of AREAS) {
    const isCurrent = area.id === currentMapId;
    const isQuestGated = area.id === "alpweide";

    const nodeGroup = document.createElementNS(svgNS, "g");

    // Node shape — use rounded rect for Dorf (hub), circles for others
    const isDorf = area.id === "dorf";
    const nodeW = isDorf ? 96 : 80;
    const nodeH = isDorf ? 56 : 46;
    const rx = isDorf ? 12 : 23;

    // Outer glow for current location
    if (isCurrent) {
      const glowRect = document.createElementNS(svgNS, "rect");
      glowRect.setAttribute("x", area.x - nodeW / 2 - 4);
      glowRect.setAttribute("y", area.y - nodeH / 2 - 4);
      glowRect.setAttribute("width", nodeW + 8);
      glowRect.setAttribute("height", nodeH + 8);
      glowRect.setAttribute("rx", rx + 4);
      glowRect.setAttribute("fill", "#e8a020");
      glowRect.setAttribute("opacity", "0.35");
      glowRect.setAttribute("filter", "url(#glow)");
      nodeGroup.appendChild(glowRect);
    }

    // Node background
    const nodeBg = document.createElementNS(svgNS, "rect");
    nodeBg.setAttribute("x", area.x - nodeW / 2);
    nodeBg.setAttribute("y", area.y - nodeH / 2);
    nodeBg.setAttribute("width", nodeW);
    nodeBg.setAttribute("height", nodeH);
    nodeBg.setAttribute("rx", rx);
    nodeBg.setAttribute("filter", "url(#shadow)");

    // Colour coding
    let fillColor, strokeColor;
    if (isCurrent) {
      fillColor   = "#e8c056";
      strokeColor = "#c07820";
    } else if (isQuestGated) {
      fillColor   = "#d4c4a0";
      strokeColor = "#8a7040";
    } else if (isDorf) {
      fillColor   = "#d4b87c";
      strokeColor = "#8a6030";
    } else {
      fillColor   = "#e0d4b0";
      strokeColor = "#8a7040";
    }
    nodeBg.setAttribute("fill", fillColor);
    nodeBg.setAttribute("stroke", strokeColor);
    nodeBg.setAttribute("stroke-width", isCurrent ? "2.5" : "1.5");
    nodeGroup.appendChild(nodeBg);

    // Icon (emoji rendered as SVG text)
    const iconEl = document.createElementNS(svgNS, "text");
    iconEl.setAttribute("x", area.x);
    iconEl.setAttribute("y", area.y - 4);
    iconEl.setAttribute("text-anchor", "middle");
    iconEl.setAttribute("dominant-baseline", "middle");
    iconEl.setAttribute("font-size", "16");
    iconEl.textContent = area.icon;
    nodeGroup.appendChild(iconEl);

    // Area label
    const labelEl = document.createElementNS(svgNS, "text");
    labelEl.setAttribute("x", area.x);
    labelEl.setAttribute("y", area.y + 10);
    labelEl.setAttribute("text-anchor", "middle");
    labelEl.setAttribute("dominant-baseline", "middle");
    labelEl.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
    labelEl.setAttribute("font-size", isDorf ? "11" : "9.5");
    labelEl.setAttribute("font-weight", isCurrent || isDorf ? "bold" : "normal");
    labelEl.setAttribute("fill", isQuestGated ? "#8a7040" : "#2a1800");
    if (isQuestGated) labelEl.setAttribute("font-style", "italic");
    labelEl.textContent = area.label;
    nodeGroup.appendChild(labelEl);

    // "Du bist hier" marker for current location
    if (isCurrent) {
      const marker = document.createElementNS(svgNS, "text");
      marker.setAttribute("x", area.x);
      marker.setAttribute("y", area.y - nodeH / 2 - 10);
      marker.setAttribute("text-anchor", "middle");
      marker.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
      marker.setAttribute("font-size", "8");
      marker.setAttribute("fill", "#b05010");
      marker.setAttribute("font-weight", "bold");
      marker.textContent = strings.karte?.hierBin ?? "▼ Du bist hier";
      nodeGroup.appendChild(marker);
    }

    // Quest-gated label
    if (isQuestGated) {
      const questLabel = document.createElementNS(svgNS, "text");
      questLabel.setAttribute("x", area.x);
      questLabel.setAttribute("y", area.y + nodeH / 2 + 11);
      questLabel.setAttribute("text-anchor", "middle");
      questLabel.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
      questLabel.setAttribute("font-size", "7.5");
      questLabel.setAttribute("fill", "#8a7040");
      questLabel.setAttribute("font-style", "italic");
      questLabel.textContent = strings.karte?.questGated ?? "(Vertrauen nötig)";
      nodeGroup.appendChild(questLabel);
    }

    svg.appendChild(nodeGroup);
  }

  // ── Legend / key spots panel ─────────────────────────────────────────────
  // Show key spots for the current area in a small legend box
  const legendX = 20;
  const legendY = 380;
  const legendW = 130;

  const legendBg = document.createElementNS(svgNS, "rect");
  legendBg.setAttribute("x", legendX);
  legendBg.setAttribute("y", legendY);
  legendBg.setAttribute("width", legendW);
  legendBg.setAttribute("height", 105);
  legendBg.setAttribute("rx", "6");
  legendBg.setAttribute("fill", "#ede0c0");
  legendBg.setAttribute("stroke", "#9a7448");
  legendBg.setAttribute("stroke-width", "1");
  legendBg.setAttribute("opacity", "0.9");
  svg.appendChild(legendBg);

  const legendTitle = document.createElementNS(svgNS, "text");
  legendTitle.setAttribute("x", legendX + legendW / 2);
  legendTitle.setAttribute("y", legendY + 14);
  legendTitle.setAttribute("text-anchor", "middle");
  legendTitle.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
  legendTitle.setAttribute("font-size", "9");
  legendTitle.setAttribute("font-weight", "bold");
  legendTitle.setAttribute("fill", "#4a3010");
  legendTitle.textContent = strings.karte?.legende ?? "Legende";
  svg.appendChild(legendTitle);

  // Legend items (global key)
  const legendItems = [
    { icon: "●", color: "#c07820", label: strings.karte?.aktuellerOrt ?? "Aktueller Ort" },
    { icon: "─ ─", color: "#b09060", label: strings.karte?.questPfad   ?? "Questpfad"    },
    { icon: "────", color: "#8a6838", label: strings.karte?.pfad        ?? "Pfad"         },
    { icon: "🌿",  color: "#3a6020", label: strings.karte?.forageZone  ?? "Sammelgebiet" },
    { icon: "🏡",  color: "#3a6020", label: strings.karte?.heim        ?? "Heimat"       },
  ];
  legendItems.forEach((item, i) => {
    const ly = legendY + 26 + i * 15;
    const iconT = document.createElementNS(svgNS, "text");
    iconT.setAttribute("x", legendX + 8);
    iconT.setAttribute("y", ly);
    iconT.setAttribute("font-size", "8");
    iconT.setAttribute("fill", item.color);
    iconT.setAttribute("dominant-baseline", "middle");
    iconT.textContent = item.icon;
    svg.appendChild(iconT);

    const lbl = document.createElementNS(svgNS, "text");
    lbl.setAttribute("x", legendX + 28);
    lbl.setAttribute("y", ly);
    lbl.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
    lbl.setAttribute("font-size", "8");
    lbl.setAttribute("fill", "#3a2000");
    lbl.setAttribute("dominant-baseline", "middle");
    lbl.textContent = item.label;
    svg.appendChild(lbl);
  });

  // ── Key spots for current area ───────────────────────────────────────────
  const spotX = SVG_W - 155;
  const spotY = 380;
  const spotW = 135;
  const spots = KEY_SPOTS[currentMapId] ?? [];
  const spotH = Math.max(55, 28 + spots.length * 14);

  const spotBg = document.createElementNS(svgNS, "rect");
  spotBg.setAttribute("x", spotX);
  spotBg.setAttribute("y", spotY);
  spotBg.setAttribute("width", spotW);
  spotBg.setAttribute("height", spotH);
  spotBg.setAttribute("rx", "6");
  spotBg.setAttribute("fill", "#ede0c0");
  spotBg.setAttribute("stroke", "#9a7448");
  spotBg.setAttribute("stroke-width", "1");
  spotBg.setAttribute("opacity", "0.9");
  svg.appendChild(spotBg);

  const currentArea = areaById[currentMapId];
  const spotTitle = document.createElementNS(svgNS, "text");
  spotTitle.setAttribute("x", spotX + spotW / 2);
  spotTitle.setAttribute("y", spotY + 14);
  spotTitle.setAttribute("text-anchor", "middle");
  spotTitle.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
  spotTitle.setAttribute("font-size", "9");
  spotTitle.setAttribute("font-weight", "bold");
  spotTitle.setAttribute("fill", "#4a3010");
  spotTitle.textContent = currentArea
    ? (strings.karte?.hierFinden ?? "Hier findest du") + ":"
    : (strings.karte?.orte ?? "Orte");
  svg.appendChild(spotTitle);

  if (spots.length === 0) {
    const noSpot = document.createElementNS(svgNS, "text");
    noSpot.setAttribute("x", spotX + spotW / 2);
    noSpot.setAttribute("y", spotY + 30);
    noSpot.setAttribute("text-anchor", "middle");
    noSpot.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
    noSpot.setAttribute("font-size", "8");
    noSpot.setAttribute("fill", "#8a7050");
    noSpot.setAttribute("font-style", "italic");
    noSpot.textContent = "–";
    svg.appendChild(noSpot);
  } else {
    spots.forEach((spot, i) => {
      const sy = spotY + 28 + i * 14;
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", spotX + 12); dot.setAttribute("cy", sy - 2);
      dot.setAttribute("r", "2.5");
      dot.setAttribute("fill", "#8a6030");
      svg.appendChild(dot);

      const sl = document.createElementNS(svgNS, "text");
      sl.setAttribute("x", spotX + 20);
      sl.setAttribute("y", sy);
      sl.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
      sl.setAttribute("font-size", "8.5");
      sl.setAttribute("fill", "#2a1800");
      sl.setAttribute("dominant-baseline", "middle");
      sl.textContent = spot;
      svg.appendChild(sl);
    });
  }

  // ── Area note (description of current location) ──────────────────────────
  if (currentArea) {
    const noteY = SVG_H - 14;
    const note = document.createElementNS(svgNS, "text");
    note.setAttribute("x", SVG_W / 2);
    note.setAttribute("y", noteY);
    note.setAttribute("text-anchor", "middle");
    note.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
    note.setAttribute("font-size", "9");
    note.setAttribute("fill", "#5a4020");
    note.setAttribute("font-style", "italic");
    note.textContent = currentArea.note;
    svg.appendChild(note);
  }

  return svg;
}

// ── Compass rose helper ──────────────────────────────────────────────────────
function drawCompass(svg, ns, cx, cy) {
  const r = 18;
  // N arrow (filled)
  const nArrow = document.createElementNS(ns, "polygon");
  nArrow.setAttribute("points", `${cx},${cy - r} ${cx - 5},${cy + 2} ${cx + 5},${cy + 2}`);
  nArrow.setAttribute("fill", "#4a3010");
  nArrow.setAttribute("opacity", "0.8");
  svg.appendChild(nArrow);
  // S arrow (outline)
  const sArrow = document.createElementNS(ns, "polygon");
  sArrow.setAttribute("points", `${cx},${cy + r} ${cx - 5},${cy - 2} ${cx + 5},${cy - 2}`);
  sArrow.setAttribute("fill", "#9a7448");
  sArrow.setAttribute("opacity", "0.5");
  svg.appendChild(sArrow);
  // N label
  const nLabel = document.createElementNS(ns, "text");
  nLabel.setAttribute("x", cx);
  nLabel.setAttribute("y", cy - r - 4);
  nLabel.setAttribute("text-anchor", "middle");
  nLabel.setAttribute("font-family", "Georgia, serif");
  nLabel.setAttribute("font-size", "9");
  nLabel.setAttribute("font-weight", "bold");
  nLabel.setAttribute("fill", "#4a3010");
  nLabel.textContent = "N";
  svg.appendChild(nLabel);
  // Circle
  const circle = document.createElementNS(ns, "circle");
  circle.setAttribute("cx", cx); circle.setAttribute("cy", cy);
  circle.setAttribute("r", "4");
  circle.setAttribute("fill", "#4a3010");
  circle.setAttribute("opacity", "0.6");
  svg.appendChild(circle);
}

// ── Panel factory ────────────────────────────────────────────────────────────
export function createMapPanel(root) {
  const overlay = document.createElement("div");
  overlay.className = "book"; // reuse book overlay class for backdrop
  overlay.hidden = true;
  root.appendChild(overlay);

  // Inner container styled like a parchment panel
  const panel = document.createElement("div");
  panel.className = "book__notebook";
  panel.style.cssText = [
    "max-width: 640px",
    "width: 92vw",
    "max-height: 90vh",
    "display: flex",
    "flex-direction: column",
    "padding: 0",
    "overflow: hidden",
  ].join(";");
  overlay.appendChild(panel);

  // Header bar
  const header = document.createElement("div");
  header.className = "book__header";
  header.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:8px 14px;";

  const titleEl = document.createElement("h1");
  titleEl.className = "book__title";
  titleEl.style.margin = "0";
  titleEl.textContent = strings.karte?.titel ?? "Karte";

  const closeBtn = document.createElement("button");
  closeBtn.className = "book__close";
  closeBtn.textContent = strings.karte?.schliessen ?? "Schliessen";
  closeBtn.addEventListener("click", close);

  header.append(titleEl, closeBtn);
  panel.appendChild(header);

  // SVG container
  const svgWrap = document.createElement("div");
  svgWrap.style.cssText = "flex:1;overflow:auto;padding:8px 12px 12px;";
  panel.appendChild(svgWrap);

  let svgEl = null;

  function open(currentMapId = "dorf") {
    // Rebuild SVG each open so it always reflects the current map
    svgWrap.innerHTML = "";
    svgEl = buildSvg(currentMapId);
    svgWrap.appendChild(svgEl);
    overlay.hidden = false;
  }

  function close() {
    overlay.hidden = true;
  }

  function toggle(currentMapId = "dorf") {
    if (overlay.hidden) open(currentMapId);
    else close();
  }

  return {
    open,
    close,
    toggle,
    isOpen() { return !overlay.hidden; },
  };
}
