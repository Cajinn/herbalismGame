import { baerlauch } from "./baerlauch.js";
import { maigloeckchen } from "./maigloeckchen.js";
import { herbstzeitlose } from "./herbstzeitlose.js";
import { loewenzahn } from "./loewenzahn.js";
import { gaensebluemchen } from "./gaensebluemchen.js";
import { spitzwegerich } from "./spitzwegerich.js";
import { schafgarbe } from "./schafgarbe.js";
import { brennnessel } from "./brennnessel.js";
import { veilchen } from "./veilchen.js";
import { huflattich } from "./huflattich.js";
import { ringelblume } from "./ringelblume.js";
import { kamille } from "./kamille.js";
import { pfefferminze } from "./pfefferminze.js";
// WP0 küchenzutaten anchors
import { zwiebel } from "./zwiebel.js";
import { zitrone } from "./zitrone.js";
// WP2 wiese/wegrand
import { johanniskraut } from "./johanniskraut.js";
import { rotklee } from "./rotklee.js";
import { frauenmantel } from "./frauenmantel.js";
import { malve } from "./malve.js";
import { wegwarte } from "./wegwarte.js";
import { koenigskerze } from "./koenigskerze.js";
import { giersch } from "./giersch.js";
import { gundelrebe } from "./gundelrebe.js";
import { hundskamille } from "./hundskamille.js";
import { gefleckterSchierling } from "./gefleckterSchierling.js";
import { jakobskreuzkraut } from "./jakobskreuzkraut.js";
// WP3 wald/waldrand
import { holunder } from "./holunder.js";
import { hagebutte } from "./hagebutte.js";
import { weissdorn } from "./weissdorn.js";
import { schlehe } from "./schlehe.js";
import { birke } from "./birke.js";
import { fichte } from "./fichte.js";
import { schluesselblume } from "./schluesselblume.js";
import { attich } from "./attich.js";
import { pestwurz } from "./pestwurz.js";
// WP4 bachufer
import { madesüss } from "./madesuss.js";
import { beinwell } from "./beinwell.js";
import { weide } from "./weide.js";
import { roterfingerhut } from "./roterfingerhut.js";
// WP5 garten
import { zitronenmelisse } from "./zitronenmelisse.js";
import { salbei } from "./salbei.js";
import { thymian } from "./thymian.js";
import { lavendel } from "./lavendel.js";
import { baldrian } from "./baldrian.js";
// WP6 dorf
import { linde } from "./linde.js";
import { hundspetersilie } from "./hundspetersilie.js";
// WP7 alpweide
import { arnika } from "./arnika.js";
import { gelberEnzian } from "./gelberEnzian.js";
import { alpenfrauenmantel } from "./alpenfrauenmantel.js";
import { quendel } from "./quendel.js";
import { wacholder } from "./wacholder.js";

// Registry of all herb species (PLAN.md §12). Keyed by species id, used by
// the spawn system, identification dialog and inventory.
export const herbs = {
  // M4 starters
  baerlauch,
  maigloeckchen,
  herbstzeitlose,
  loewenzahn,
  gaensebluemchen,
  spitzwegerich,
  schafgarbe,
  brennnessel,
  veilchen,
  huflattich,
  ringelblume,
  kamille,
  pfefferminze,
  // WP0 kitchen anchors
  zwiebel,
  zitrone,
  // WP2 wiese/wegrand
  johanniskraut,
  rotklee,
  frauenmantel,
  malve,
  wegwarte,
  koenigskerze,
  giersch,
  gundelrebe,
  hundskamille,
  gefleckterSchierling,
  jakobskreuzkraut,
  // WP3 wald/waldrand
  holunder,
  hagebutte,
  weissdorn,
  schlehe,
  birke,
  fichte,
  schluesselblume,
  attich,
  pestwurz,
  // WP4 bachufer
  madesüss,
  beinwell,
  weide,
  roterfingerhut,
  // WP5 garten
  zitronenmelisse,
  salbei,
  thymian,
  lavendel,
  baldrian,
  // WP6 dorf
  linde,
  hundspetersilie,
  // WP7 alpweide
  arnika,
  gelberEnzian,
  alpenfrauenmantel,
  quendel,
  wacholder,
};
