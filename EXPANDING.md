# EXPANDING.md — Herbs Schmerbs Erweiterungsguide

> Checklisten und Copy-paste-Vorlagen für die häufigsten Erweiterungen.
> Ziel: Eine neue Pflanze, ein neues Rezept oder ein neuer Dorfbewohner lässt
> sich aus diesem Dokument + einer einzigen Beispieldatei ergänzen — ohne die
> Engine zu lesen.
>
> **Grundregel (PLAN §13.1):** Kein Arten-, Methoden- oder Bewohner-spezifischer
> Code in Engine, Sim oder UI. Neue Inhalte = Registrierungseinträge. Die Engine
> liest nur das Schema.

---

## 1. Neues Kraut hinzufügen

### Dateien, die du anfasst

| Datei | Was du machst |
|-------|---------------|
| `src/data/herbs/<id>.js` | **Neu erstellen** — vollständiges Schema (Vorlage unten) |
| `src/data/herbs/index.js` | Import + Eintrag ins `herbs`-Objekt |
| `src/data/recipes.js` | ≥ 1 Rezept hinzufügen |
| `src/world/plantSpawns.js` | Spawn-Punkt(e) in `SPAWN_POINTS` eintragen (nicht für Gartenkräuter) |
| `src/data/shop.js` | Samen-Eintrag, falls `kultivierbar: true` |
| `tools/download_plates.sh` | Botanische Tafel eintragen (optional, graceful degradation) |

### Pflanzenschema — Vorlage

```js
import { createSprite } from "../../engine/pixelSprite.js";

export const meinKraut = {
  nameDe: "Mein Kraut",                         // Anzeigename im Spiel
  nameLat: "Genus species",                      // Lateinisch (Buch, Kursiv)
  schweizerdeutsch: "Mis Chrut",                 // Dialektname (optional)
  plate: "genus-species.jpg",                    // Dateiname unter assets/plates/
  biotope: ["wiese"],                            // Wo es wächst: wiese | waldrand | wald | bachufer | alpweide | dorf | garten
  sonne: "sonnig bis halbschattig",
  boden: "durchlässig, kalkhaltig",
  saison: {
    teil: {
      // Welcher Teil wann erntbar ist.
      // Format: "jahreszeit:ersterTag-letzterTag" (Tage 1–28)
      // Jahreszeiten: fruehling | sommer | herbst | winter
      blaetter: ["fruehling:1-28", "sommer:1-20"],
      blueten:  ["sommer:5-25"],
    },
  },
  realMonths: [5, 6, 7],   // Echte Schweizer Erntemonate (1=Jan, 12=Dez) für den Almanach
  merkmale: {
    // Genau 6 Merkmale — alle Felder pflichtmässig.
    blattform: "...",
    blattstellung: "...",
    bluete: "...",
    geruch: "...",   // "(Zerreiben)" gehört dazu
    stengel: "...",
    wuchshoehe: "20–60 cm",
  },
  verwechslung: [
    // Jede gefährliche Verwechslungsart — wird im Buch und in der Verwechslungs-
    // galerie angezeigt. Die Paarung wird bidirektional aufgelöst (die andere
    // Art muss sich selbst NICHT eintragen).
    {
      art: "andereArt",        // herbs-Schlüssel der Verwechslungsart (NICHT "species")
      gefahr: "giftig",        // "wirkungslos" | "giftig" | "toedlich"
      unterscheidung: "Hauptmerkmal: Mein Kraut hat X, die andere Art Y.",
    },
  ],
  geschuetzt: false,        // true → Ernte gesperrt; Margrit-Szene; Vertrauen-Abzug
  kultivierbar: true,       // true → Samen im Dorfladen kaufbar; im Garten anpflanzbar
  verwendung: {
    // Nur Teile mit Einträgen hier sind erntbar (PLAN §13.1 — datengetrieben).
    // Giftige Lookalikes lassen diesen Block leer → nie erntbar.
    blaetter: ["tee", "trocknen"],
    blueten:  ["tee", "oelauszug"],
    wirkungTraditionell: "kurze Wirkungsbeschreibung für das Buch",
  },
  fundorte: 3,    // Ungefähre Anzahl Spawn-Punkte pro Karte (Orientierungswert)
  sprite: createSprite({
    palette: [null, "#558b2f", "#fdd835", "#ffffff"],
    // 16×16 Pixel, indexed (0 = transparent, 1/2/3/... = palette)
    rows: [
      "0000000000000000",
      // ... 16 Zeilen
    ],
  }),
  // Mehrstufige Sprites (optional, nur wenn die Pflanze verschiedene
  // Erntephasen visuell zeigt — z.B. Holunder: Blüten vs. Beeren):
  // stages: {
  //   bluehend:   { windows: ["sommer:1-20"], sprite: createSprite({...}) },
  //   fruchtend:  { windows: ["herbst:1-28"], sprite: createSprite({...}) },
  // },
};
```

### index.js — Import + Eintrag

```js
// Am Ende der passenden Gruppe:
import { meinKraut } from "./meinKraut.js";

export const herbs = {
  // ... bestehende Einträge ...
  meinKraut,
};
```

### Spawn-Punkt in plantSpawns.js

```js
// In SPAWN_POINTS["wiese"] (oder passendes Biotop):
{ id: "wiese-99", x: 12, y: 8, species: "meinKraut" },
```

`id` muss eindeutig sein. `x`/`y` sind Kachel-Koordinaten. Die Saisonfilterung
läuft automatisch über `herb.saison.teil`.

### Samen im Dorfladen (nur wenn kultivierbar)

```js
// In src/data/shop.js:
{
  id: "shop-meinkraut-samen",
  kind: "seed",
  ref: "meinKraut",   // muss mit dem herbs-Schlüssel übereinstimmen
  nameDe: "Mein-Kraut-Samen",
  descDe: "Kurze Beschreibung für den Laden",
  preis: 5,
},
```

### Rezept in recipes.js

```js
{
  id: "meinkraut-blaetter-tee",
  species: "meinKraut",
  teil: "blaetter",
  method: "tee",          // muss ein Eintrag in src/data/methods.js sein
  output: "tee",          // Wert landet in item.processed
  durationDays: 0,        // 0 = sofort; null = Methodenstandard
  inputs: [{ processed: null }],   // frisches Kraut
  mengeDe: "1 TL Blätter auf 250 ml heisses Wasser, 10 Min. ziehen",
  wirkungDe: "beruhigend, entzündungshemmend",
},
```

### Verwechslungsart (Lookalike ohne Verwendung)

Eine giftige Verwechslungsart braucht dasselbe Schema, aber **ohne** `verwendung`-Teile
(nur `wirkungTraditionell: "giftig — ..."`) → die Pflanze ist nie erntbar, erscheint
aber in der Kandidatenliste und im Verwechslungs-Kapitel.

---

## 2. Karte ändern / erweitern

### Dateien, die du anfasst

| Datei | Was du machst |
|-------|---------------|
| `src/data/maps/<id>.js` | Tile-Array, exits, stations, beds anpassen |
| `src/world/plantSpawns.js` | Spawn-Punkte für neue Biotop-Kacheln ergänzen |

### Kartenformat

```js
export const meinMap = {
  id: "meinkarte",
  tileSize: 16,
  width: 20, height: 15,   // in Kacheln
  tiles: [
    // Zeile × Spalte, Zahl = Tile-Index
    // 0 = Gras (begehbar), 1 = Wand/Baum (solid)
    // Tile-Definitionen in src/engine/tilemap.js → tileTypes
  ],
  exits: [
    // Spieler betritt diese Kachel → wechselt zur Zielkarte
    { x: 10, y: 0, target: "andereKarte", spawn: { x: 5, y: 14 } },
  ],
  stations: [
    // Interaktive Stationen (E-Taste, 1-Tile-Radius)
    { x: 3, y: 7, type: "dorfladen" },
  ],
  beds: [
    // Gartenbeete — nur für garten.js relevant
    { id: "beet-1", x: 5, y: 5 },
  ],
};
```

Neue Karte in `src/world/mapLoader.js` registrieren:

```js
import { meinMap } from "../data/maps/meinMap.js";
const MAPS = { ..., meinkarte: meinMap };
```

---

## 3. Neuer Dorfbewohner

### Dateien, die du anfasst

| Datei | Was du machst |
|-------|---------------|
| `src/data/villagers.js` | Eintrag im `villagers`-Objekt |
| `src/data/ailments.js` | ggf. neues Leiden mit `villagerId`-Referenz |

### Bewohnerschema

```js
neuerBewohner: {
  id: "neuerbewohner",
  nameDe: "Neuer Bewohner",
  dialog: {
    gruss: "Grüessech! Was bringst du mir?",
    bitte: ({ ailmentNameDe }) => `Ich leide an ${ailmentNameDe} — weisst du Rat?`,
    dank: "Merci vielmal! Das hilft bestimmt.",
    ablehnung: "Das ist leider nicht das Richtige.",
    hinweise: [
      "Ein zufälliger Hinweis für Margrit-artige NPCs.",
    ],
  },
  home:   { map: "dorf", x: 8,  y: 4 },    // Position vor 12:00
  square: { map: "dorf", x: 12, y: 10 },   // Position ab 12:00
  ailmentThemes: ["erkältung", "husten"],   // Welche Leiden dieser Bewohner haben kann
  sprite: humanSprite([null, "#f5cba7", "#5d3a1a", "#3498db", "#2980b9"]),
  // palette: [transparent, haut, haare, oberteil, hose]
},
```

Leiden verknüpfen sich über `ailmentThemes` — der Requestgenerator wählt passende
Leiden automatisch aus `src/data/ailments.js`.

---

## 4. Neues Rezept

### Dateien, die du anfasst

Nur `src/data/recipes.js` — kein Engine-Code.

### Rezeptschema (vollständig)

```js
{
  id: "spezies-teil-methode",        // eindeutig, kebab-case
  species: "speziesId",
  teil: "blaetter",                  // muss in herb.saison.teil + herb.verwendung vorhanden sein
  method: "tee",                     // muss ein Schlüssel in src/data/methods.js sein
  output: "tee",                     // Wert in item.processed
  durationDays: 0,                   // 0 sofort; null = Methodenstandard; Zahl = Override
  inputs: [
    { processed: null },             // frisches Kraut (standard)
    // { processed: "getrocknet" },  // getrocknetes Kraut als Eingang
  ],
  requiresZutat: "schnaps",          // optional — muss in src/sim/zutaten.js vorkommen
  mengeDe: "Zubereitung auf Buchkarte",
  wirkungDe: "Wirkungsbeschreibung (optional, erscheint nach erster Verarbeitung)",
},
```

Methoden-IDs: `trocknen`, `tee`, `tinktur`, `pulver`, `oelauszug`, `salbe`,
`sirup`, `honigauszug`, `wickel`, `hausmittel`.

---

## 5. Neue Verarbeitungsmethode

Eine neue Methode ist selten nötig — erst prüfen ob eine bestehende genügt.

### Dateien, die du anfasst

| Datei | Was du machst |
|-------|---------------|
| `src/data/methods.js` | Methodendefinition |
| `src/data/strings.de.js` | `verarbeitet.<id>` + ggf. `stationen.<station>` + `interaktionStation.<station>` |
| `src/sim/processing.js` | `startRecipe`/`tickAndComplete` prüfen ob station schon bekannt |
| `src/data/recipes.js` | Rezepte für die neue Methode |

### Methodenschema

```js
{
  id: "meineMethode",
  nameDe: "Meine Methode",
  station: "herd",          // Stationstyp aus der Karte
  output: "meineMethode",   // Wert in item.processed
  durationDays: 1,          // Standarddauer (Rezept kann überschreiben)
  requiresZutat: null,      // oder "schnaps" etc.
},
```

Dann in `src/data/strings.de.js`:

```js
verarbeitet: {
  // ...
  meineMethode: "Meine Methode",
},
```

---

## Häufige Fehlerquellen

- **`[hidden]` schlägt `display` nicht**: Jedes neue Overlay mit einer `display`-Regel
  braucht `.meinElement[hidden] { display: none; }` — sonst ist es permanent sichtbar.
- **Seasons-Format**: Tage gehen von 1 bis 28, nicht 0-basiert.
  `"sommer:5-25"` = Sommertage 5 bis 25.
- **`fundorte`-Zahl ist nur ein Richtwert**: Die tatsächliche Spawn-Anzahl ergibt
  sich aus den Einträgen in `SPAWN_POINTS` — `fundorte` beeinflusst nur die
  Darstellung im Buch.
- **Neue Toplevel-Keys in `main.js` speichern**: Jede neue State-Variable braucht
  einen Eintrag in `persist()` und ein `?? default` beim Laden aus `saved.*`.
  Kein `SAVE_VERSION`-Bump nötig.
- **Kein artspezifischer Code in der Engine**: Prüfe mit `grep -n "speziesId"
  src/engine/ src/sim/ src/ui/` — null Treffer ist das Ziel.
