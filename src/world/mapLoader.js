import { dorf } from "../data/maps/dorf.js";
import { garten } from "../data/maps/garten.js";
import { wiese } from "../data/maps/wiese.js";
import { waldrand } from "../data/maps/waldrand.js";
import { wald } from "../data/maps/wald.js";
import { bachufer } from "../data/maps/bachufer.js";
import { alpweide } from "../data/maps/alpweide.js";
import { kraeuterhaeuschen } from "../data/maps/kraeuterhaeuschen.js";

const MAPS = { dorf, garten, wiese, waldrand, wald, bachufer, alpweide, kraeuterhaeuschen };

export function loadMap(id) {
  const map = MAPS[id];
  if (!map) throw new Error(`Unbekannte Karte: "${id}"`);
  return map;
}
