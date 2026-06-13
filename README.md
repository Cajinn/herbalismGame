# Herbs Schmerbs

Ein gemütliches Pixel-Art-Browserspiel über Schweizer Kräuterheilkunde. Siehe
[PLAN.md](PLAN.md) für das vollständige Konzept.

## Starten

ES-Module benötigen einen lokalen Server (kein `file://`):

```sh
python3 -m http.server
```

Dann im Browser öffnen: http://localhost:8000

## Stand: M5 — Inhalt & Politur

- **Vollständiges Kräuter-Roster** (~32 Arten + 9 Lookalikes): alle Biotope
  abgedeckt — Wiese/Wegrand (WP2), Wald/Waldrand (WP3), Bachufer (WP4),
  Garten-Kultivierbares (WP5), Dorf (WP6), Alpweide (WP7). Jede Art hat
  vollständiges Schema (nameDe/nameLat/schweizerdeutsch, plate, biotope,
  merkmale, verwechslung, saison, realMonths, sprite).
- **Küchenzutaten & Hausmittel** (WP0): Zwiebel, Honig, Zucker, Zitrone im
  Dorfladen; neue Methoden Sirup, Honigauszug, Wickel, Hausmittel; Zwiebelsirup
  und weitere Rezepte ergänzt.
- **Mehrstufige Sprites** (WP1): optionales `stages`-Feld auf Kräuterdaten —
  Holunder zeigt Blüten im Sommer, Beeren im Herbst; Linde analog. Engine liest
  nur das Schema, kennt keine Artnamen.
- **Alpweide-Quest + geschützte Arten** (WP7): Alpweide ist Vertrauen-gegattet
  (≥ 20 Dorf-Vertrauen); Margrit bietet den Quest an. Arnika und Gelber Enzian
  sind `geschuetzt: true` — Ernte löst Margrit-Szene + Vertrauensabzug aus;
  legale Pfade (Garten / Dorfladen) sind datengetrieben, kein Sondercode.
- **Giftige Verwechslungs-Konsequenzen** (WP8): Falsche Bestimmung beim
  Bestimmen-Dialog → Ernte unter falschem Label (`item.labeledAs`). Lieferung
  eines falsch beschrifteten giftigen Krauts → Bewohner krank (2–3 Tage zu
  Hause, Vertrauensverlust). `evaluateDelivery` gibt `"toxic"` zurück; Sim
  (`villagerStatus`) verfolgt Genesungszähler; NPC verschwindet von der Karte
  bis zur Genesung.
- **Buch: Verwechslungen-Kapitel** (WP9): Galerie aller gefährlichen Paare,
  freigeschaltet sobald beide Arten gesehen wurden. Farbkodiert nach Gefahr
  (wirkungslos / giftig / tödlich).
- **Buch: Almanach-Kapitel** (WP10): Zwei Spalten — Spieljahr (was gerade in
  der aktuellen Spielsaison erntbar ist) und «Draussen vor deiner Tür» (welche
  Spielkräuter im echten aktuellen Monat in der Schweiz zu finden sind, via
  `herb.realMonths` + `new Date()`).
- **Titelbildschirm + Disclaimer** (WP11): Vollbild-Overlay beim ersten Start;
  medizinischer Disclaimer; «Neu beginnen» / «Weiterspielen»; `introSeen`-Flag
  verhindert erneute Anzeige.
- **EXPANDING.md**: Schritt-für-Schritt-Checklisten für Neues Kraut,
  Karte, Dorfbewohner, Rezept, Verarbeitungsmethode — mit Copy-paste-Vorlagen.

### Entscheidungen M5

- **Vollständige Vorratshaltung (§10.1) auf M6 verschoben.** M5 baut nur die
  Mislabeling-Scheibe, die §8.2 braucht (wahrer `species` + optionaler
  `labeledAs`). Braunglas, Haltbarkeit, Schimmel = M6.
- **Giftige Konsequenzen selten und verdient.** Nur erreichbar, wenn Spieler
  trotz falscher Bestimmung erntet und liefert. Mastery (`gelernt`) eliminiert
  das Risiko für bekannte Arten vollständig.
- **Kräuter-Batches nach Biotop** (WP2–WP6), je browser-verifiziert vor dem
  nächsten. Natürliche M5a/M5b-Grenze nach WP6.
- **Mehrstufige Sprites datengetrieben** (`herb.stages`-Map). Engine nennt
  keine Artnamen.
- **Hausmittel-Scheibe begrenzt** (Zwiebel + Honig + Zucker + Zitrone).
  Exotische Gewürze (Kurkuma, Ingwer) sind Stretch für M6.
- **Energie-Stat weiterhin übersprungen.** Gleiche Begründung wie M4 —
  selbstenthalten, addierbar, nicht im M5-Pflichtenheft.
- **Audio optional / Stretch.** CC0-Quellen, Stummschalttaste — in M5 nicht
  implementiert.

## Stand: M4 — Dorf & Requests

- **Dorfbewohner** (`src/data/villagers.js`): 7 NPCs mit Pixel-Sprites und
  tageszeit-abhängigen Positionen (vor 12:00 Uhr zuhause, ab 12:00 auf dem
  Dorfplatz). Margrit (Mentorin) hat keine Anfragen, aber `hinweise`-Array.
  NPC-Rendering via `drawSprite` im `render()`-Loop; Proximity-Prompt zeigt
  Name und [E]-Hinweis.
- **Dorfbewohner-Dialog** (`src/ui/dialog.js`): öffnet mit Gruss-Text und
  aktiver Anfrage. Inventar-Items aus `groupInventory` sind aufgelistet. Match
  → Dankestext (grün, schliessen nach 1,6 s); Mismatch → Ablehnung-Text (rot,
  Dialog bleibt offen). Margrit zeigt einen zufälligen Hinweis.
- **Anschlagbrett** (`src/ui/board.js`): Read-only-Übersicht aller offenen
  Anfragen mit Bewohner-Name, Beschwerde-Text und Saison-Badge.
- **Anfragen-Simulation** (`src/sim/requests.js`): pro Tageswechsel werden neue
  Anfragen generiert (50 % Wahrscheinlichkeit, saisonal gefiltert, max. 4
  gleichzeitig). `evaluateDelivery` prüft `species` + `processed` gegen die
  `validRemedies` der passenden Beschwerde.
- **Beschwerden-Daten** (`src/data/ailments.js`): 7 Beschwerden (Erkältung,
  Husten, Magenbeschwerden, Frühjahrsmüdigkeit, Kopfschmerzen, Gelenkschmerzen,
  Kleine Wunde) mit Saison-Fenstern und gültigen Zubereitungen.
- **Dorfladen** (`src/ui/shop.js`): 6 Artikel — 3 Handelsgüter (Schnaps,
  Olivenöl, Bienenwachs) und 3 Samen (Ringelblume, Kamille, Pfefferminze).
  Kauf kostet Münzen; bei Erfolg schliessen.
- **Garten-Simulation** (`src/sim/garden.js`): 5 Beete; Samen setzen →
  Keimling (Tag 4) → Wachsend (Tag 10) → Reif; Wachstum pausiert bei >2 Tagen
  ohne Wasser. Ernte fügt Pflanzenteil ins Inventar ein und löst `recordSighting`
  aus.
- **Garten-Dialog** (`src/ui/garden.js`): zeigt Beet-Status; Säen, Giessen,
  Ernten. Giessen rendert das Panel in-place; nach erfolgreichem Säen schliessen.
- **3 Gartenkräuter** (`src/data/herbs/`): Ringelblume (Calendula), Echte
  Kamille, Pfefferminze — alle `kultivierbar: true`, biotope `["garten"]`.
  8 neue Rezepte in `src/data/recipes.js`.
- **Zutaten-Store** (`src/sim/zutaten.js`): Münzen-gesteuerter Count-Speicher
  für Handelsgüter. Workshop-Dialog prüft Verfügbarkeit und zeigt „im Dorfladen
  kaufen" statt Fehler, wenn Zutat fehlt.
- **Münzen & Vertrauen**: HUD zeigt Münzen-Stand; Lieferung bringt +10 Münzen
  und +5 Vertrauen (per Bewohner + Dorf-Summe in `src/sim/reputation.js`).
  Fortschritt als `recordDelivery` in `src/sim/progress.js`.

## Stand: M3 — Verarbeiten & Kräuterbuch

- **Kräuterhäuschen** (`src/data/maps/kraeuterhaeuschen.js`): begehbarer
  20×12-Innenraum mit 7 Stationen — Dachboden, Herd, Mörser, Vorratsregal,
  Sonnenfenster, Buchstand, Bett. Dorf-Exit bei Haus (x=5, y=6).
- **Stationsinteraktion**: E-Taste öffnet den passenden Dialog bei jeder
  Station (1-Tile-Radius, gleiches System wie Pflanzenspawns). Der Buchstand
  öffnet direkt das Kräuterbuch; alle anderen Stationen den Werkstatt-Dialog.
- **Werkstatt-Dialog** (`src/ui/workshop.js`): listet verfügbare Rohkräuter
  (Dachboden) oder Rezepte (alle anderen Stationen), zeigt laufende Verarbeit-
  ungen mit Restzeit an, Zutaten-Prüfung greift Buttons aus bei fehlenden
  Zutaten oder noch nicht verfügbaren Handelsgütern (Schnaps, Olivenöl,
  Bienenwachs → „bald im Dorfladen").
- **Verarbeitungs-Sim** (`src/sim/processing.js`): Trocknen (6 Tage,
  Dachboden), Tee (sofort, Herd), Tinktur (21 Tage, Vorratsregal + Schnaps),
  Pulver (sofort, Mörser, benötigt Getrocknet), Ölauszug (42 Tage,
  Sonnenfenster + Olivenöl), Salbe (sofort, Herd, benötigt Ölauszug +
  Bienenwachs). `tickAndComplete` prüft bei jedem Tageswechsel fertige
  Zubereitungen und legt sie ins Inventar.
- **Rezept-Daten** (`src/data/recipes.js`): 18 Rezepte für alle 7
  Starter-Heilkräuter (Löwenzahn, Brennnessel, Spitzwegerich, Schafgarbe,
  Gänseblümchen, Huflattich, Veilchen) mit `mengeDe`-Beschreibungen.
- **Kräuterbuch** (`src/ui/book.js` + `css/book.css`): Pergament-Overlay mit
  zwei Kapiteln:
  - *Pflanzen*: progressive Enthüllung — Art-Sidebar (? bis zur ersten
    Sichtung), Sprite + botanische Tafel, Standort + Erntezeit (nach 1.
    Ernte), Wirkung (nach erstem Verarbeiten oder `gelernt`),
    Verwechslungsgefahr-Panel (rot, nach Sichtung einer Verwechslungsart).
  - *Rezepte*: Karten je gesehener Spezies mit Station, Dauer, Zubereitungs-
    notiz und Wirkung (nach erstem Verarbeiten oder `gelernt`).
- **Fortschritts-Tracking** erweitert: `recordSighting` / `isGesehen` (erste
  Sichtung), `recordMerkmalReveal` / `getRevealedMerkmale` (untersuchte
  Merkmale), `recordCraft` / `hasCrafted` (verarbeitete Zubereitungen).
- **Botanische Tafeln**: Platzhalter-Infrastruktur unter `assets/plates/`
  (öffentliche Gemeinfreiheit-Vorlagen aus Köhlers Medizinal-Pflanzen 1887),
  Download-Skript `tools/download_plates.sh`. Fehlt das Bild, wird nur der
  Pixel-Sprite gezeigt — graceful degradation.
- **HUD**: Neuer Button „Buch" neben Inventar.
- **Save-Migration**: Sichtungs-Flag (`gesehen`) wird beim Laden alter Stände
  (M2) anhand bestehender `correct`-Einträge rückwärtskompatibel befüllt.

## Stand: M2 — Foraging & Bestimmen

- Alle 7 Karten begehbar und über Exits verbunden: Dorf (Hub), Garten,
  Wiese, Waldrand, Wald, Bachufer, Alpweide.
- 10 Kräuter mit vollem Datensatz (`src/data/herbs/`): die 8 Starter-Heilkräuter
  plus die Bärlauch-Verwechslungsgruppe (Maiglöckchen, Herbstzeitlose) —
  jeweils mit Standort, 6 Merkmalen, Verwendung und code-gezeichnetem
  16×16-Pixelsprite (§3.2).
- Saisonale Pflanzenspawns (`SPAWN_POINTS` in `src/world/plantSpawns.js`) auf
  Wald (7), Waldrand (6) und Wiese (22), gefiltert über die
  `saison.teil`-Fenster der jeweiligen Kräuter.
- Bestimmen-Dialog (§7): Sprite + Standort, 6 untersuchbare Merkmale (kosten
  Spielzeit), Kandidatenliste (wahre Art + Verwechslungen + Biotop-Nachbarn),
  bei korrekter Bestimmung Ernte-Auswahl je Pflanzenteil.
- Mastery: 3 korrekte Bestimmungen einer Art → „gelernt“, danach
  Auto-Erkennung ohne Rätselraten.
- Inventar-Panel (HUD-Button „Inventar“), gruppiert nach Art + Pflanzenteil.
- Speicherstand erweitert um `inventory`, `progress`, `harvested`.

## Stand: M1 — Walking Skeleton

- Eine Karte (Dorf), Spielerbewegung (Pfeiltasten/WASD) mit Kollision,
  Kamera folgt dem Spieler und clamped an die Kartengrenzen.
- Tag-/Jahreszeitenuhr (06:00–24:00, 4 Jahreszeiten à 28 Tage). „Schlafen“
  beendet den Tag manuell; um 24:00 schläft man automatisch ein.
- Speichern/Laden über `localStorage` (versioniertes Schema).
- Platzhalter-Grafik: Tiles sind Farbflächen, der Spieler ein Farbblock mit
  Blickrichtungs-Indikator. Das Kenney-CC0-Tileset kommt erst mit dem
  echten Asset-Einbau (noch offen).

## Entscheidungen (§16)

- **Platzhalter-Tiles** statt Kenney-Assets für M1, damit Engine, Bewegung
  und Kollision ohne externe Downloads testbar sind. `tilemap.js` liest pro
  Tile nur `solid` + `color`. Der Umstieg auf echte Tile-Grafiken ist ein
  reiner Datenwechsel in `src/data/maps/*.js`, kein Engine-Umbau.
- **Zeitskala**: 1 Spieltag (06:00–24:00) ≈ 10 Echtzeit-Minuten (PLAN.md §5).
- **Pflanzen-Sprites (M2)**: pro Spezies genau ein 16×16-Sprite statt der in
  §3.2 vorgesehenen bis zu drei Saison-Stadien (vegetativ/blühend/fruchtend).
  Die saisonale Differenzierung läuft über die `saison.teil`-Fenster (welcher
  Pflanzenteil aktuell verfügbar ist), nicht über unterschiedliche Grafiken.
  Volle Stadien-Sets sind für M5 vorgesehen, wenn die übrigen ~22 Kräuter
  dazukommen.
- **Merkmale um `wuchshoehe` erweitert**: zusätzlich zu den 5 in PLAN §7
  genannten Merkmalen (Blattform, Blattstellung, Blüte, Geruch, Stängel) hat
  jede Pflanze ein 6. Merkmal `wuchshoehe` — nützlich, um z.B. Bärlauch von
  Maiglöckchen anhand der Wuchshöhe zu unterscheiden.
- **Erntefähigkeit ist datengetrieben**: ein Pflanzenteil ist nur erntbar,
  wenn er (a) gerade saisonal verfügbar ist (`saison.teil`) UND (b) einen
  Eintrag in `verwendung` hat. Giftige Verwechslungsarten (Maiglöckchen,
  Herbstzeitlose) haben keine teilspezifischen `verwendung`-Einträge, nur
  `wirkungTraditionell` („giftig — ...“), und bieten dadurch nie eine
  Ernte-Option — ganz ohne artspezifischen Code (§13.1).
- **Kandidatenliste** (`getCandidates` in `src/ui/identify.js`): wahre Spezies
  + alle Arten aus `verwechslung` (bidirektional — auch Arten, die die wahre
  Spezies als ihre Verwechslung listen) + Biotop-Nachbarn, max. 4, gemischt.
  So zeigen sich Bärlauch, Maiglöckchen und Herbstzeitlose gegenseitig als
  Kandidaten, obwohl nur Bärlauchs Datensatz `verwechslung` populiert hat.
- **Mastery-Schwelle**: 3 korrekte unabhängige Bestimmungen je Spezies →
  `gelernt` (`src/sim/progress.js`), danach automatische Erkennung.
- **Pflanzenspawn-Punkte**: feste Positionen pro Karte (`SPAWN_POINTS` in
  `src/world/plantSpawns.js`); Anzahl pro Spezies orientiert sich an
  `fundorte` aus den Kräuterdaten. Geerntete Punkte bleiben dauerhaft
  verschwunden (`harvested`-Set im Speicherstand) — kein Respawn in M2.
- **Stationen statt Tile-Events (M3)**: Stationsinteraktion läuft über ein
  `stations`-Array in der Kartendefinition (analog zu `exits`), nicht über
  Tile-Zeichen. So braucht `tilemap.js` keine Stationslogik, und `main.js`
  prüft Nähe mit demselben Abs-Diff-≤1-Pattern wie Pflanzenspawns.
- **`gesehen`-Flag statt `correct`-Proxy**: Das Kräuterbuch zeigt eine Art,
  sobald der Spieler den Bestimmen-Dialog öffnet (`recordSighting`) — unabhängig
  von Erfolg. So erscheinen auch giftige Verwechslungsarten im Buch, sobald man
  ihnen begegnet, aber die Wirkung bleibt verborgen bis zur ersten Verarbeitung
  oder Meisterschaft.
- **`onDayComplete` als gemeinsamer Hook**: `tickAndComplete` wird bei jedem
  Tageswechsel aufgerufen — ob durch manuelles Schlafen (HUD, Bett-Station)
  oder automatischen Mitternachts-Kollaps. Ein einziger `onDayComplete()`-
  Helfer in `main.js` eliminiert die Duplizierung.
- **Keine Seiten-Fenster im Buch**: Statt echter „gedruckter Bücher"-Pagination
  scrollt der rechte Seiten-Bereich als normales `overflow-y: auto`-Div. Das
  deckt M3-Inhalte vollständig ab; eine Seitennummerierung wäre Overengineering.
- **DOM-Overlay-CSS-Fixes**: `#ui-root` setzt `line-height: normal`, weil
  `#game` zur Vermeidung von Canvas-Whitespace `line-height: 0` setzt — ohne
  Reset kollabieren Text-Elemente (z.B. Dialog-Titel) in den Overlays auf
  Höhe 0. Ausserdem braucht `.identify[hidden] { display: none; }`, da die
  `display: flex`-Regel der Klasse sonst das `hidden`-Attribut per
  Cascade-Origin aussticht und der Dialog dauerhaft sichtbar (und klickbar)
  bliebe.
