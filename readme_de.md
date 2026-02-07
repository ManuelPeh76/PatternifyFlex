[English Readme](https://github.com/ManuelPeh76/PatternifyFlex/blob/main/readme_de.md)

# Patternify Flex

**Patternify Flex** ist ein vielseitiger Pixel-Editor und kleines Grafik-Toolkit, mit dem du Pixelmuster, Grafiken und Animationen direkt im Browser entwerfen, speichern und abspielen kannst.

Basierend auf dem ursprünglichen [Patternify von Sacha Greiff](http://www.patternify.com), erweitert Patternify Flex das Konzept enorm: Statt einer fixen 10x10-Pixel-Grenze bietet Patternify Flex flexible Rastergrößen bis zu **400x400 Pixel**, umfangreiche Zeichenfunktionen, Text-Tools und die Möglichkeit, deine Arbeiten als JSON-Datei zu exportieren oder Animationen abzuspielen.

## Features

- **Extrem flexible Rastergröße:** Bis zu 400x400 Pixel einstellbar
- **Vielfältige Zeichenwerkzeuge:** Formen, Linien, Text, Muster
- **JSON-Export & Playback:** Zeichnungen können gespeichert und später wieder abgespielt werden
- **Parameter-Steuerung:** Starte den Editor mit benutzerdefinierten Einstellungen direkt über die URL
- **Backup & Keybindings:** Projektstände und individuelle Tastenkürzel werden im LocalStorage gesichert
- **Mehrsprachigkeit:** Benutzeroberfläche auf Deutsch und Englisch verfügbar
- **Live-Preview und interaktive Bedienung**
- **Matrix-Import:** Zeichnungen können als Matrix direkt übergeben und angezeigt werden

## Schnelleinstieg

1. **Download:**  
   Klone oder lade das Projekt herunter.

2. **Start:**  
   Öffne `index.html` direkt im Browser. Du kannst einen lokalen Web-Server starten ([wie etwa mit Python](https://docs.python.org/3/library/http.server.html)) und das Tool darüber öffnen, oder einfach per Doppelklick z.B. mit Firefox (Dateiprotokoll funktioniert oft problemlos).

3. **Info:**  
   Weitere Details und Tipps, die Tastenkürzel und deren Anpassung sowie den Recorder findest du im Tool-Menü (drei Striche).
   Nach dem Öffnen des Menüs siehst du oben drei Symbole:
   - i: Informationen rund um dieses Tool
   - Filmkamera: Hier versteckt sich der Recorder
   - Tastatur: Hier findest du sämtliche Tastenkürzel und kannst die Tastenbelegung auch ändern. Nach Änderungen wird die neue Belegung im localStorage dess Browsers gesichert, so dass deine Tastenbelegung dir nach jedem erneuten Öffnen von Patternify Flex sofort zur Verfügung steht. Du kannst deine Belegung auch herunterladen ("customKeys.js"). Kopiere diese Datei in den Unterordner "js". Aber Vorsicht! Benenne die originale "customKeys.js" zuerst um, damit sie im Falle von Problemen mit der Tastenbindung wiederhergestellt werden kann.

## URL-Parameter & Konfiguration

Patternify Flex lässt sich bequem über URL-Parameter oder Hash-Konfigurationen steuern, z. B.:

| Parameter         | Bedeutung                                                |
|-------------------|---------------------------------------------------------|
| idleTime          | Verzögerung nach Minimierung (z. B. nach 3000ms)        |
| width             | Breite des Grids                                        |
| height            | Höhe des Grids                                          |
| xcursor           | Maximale Pixel pro Zeile                                |
| ycursor           | Maximale Pixel pro Spalte                               |
| size              | Kurznotation für width & height                         |
| cursors           | Kurznotation für xcursor & ycursor                      |
| color             | Vorgegebene Farbe & Transparenz                         |
| destroybackup     | Löscht Backups im LocalStorage                          |
| destroykeys       | Löscht Keybindings im LocalStorage                      |
| lang              | Spracheinstellung (`de`/`en`)                           |
| matrix            | Übergibt eine Pattern-Matrix für das Grid               |

**Beispiel-URLs:**
- Start mit 32x32 Pixel Grid:  
  `/index.html?width=32&height=32`
- Limitiere Grid auf 16x16 Pixel:  
  `/index.html?xcursor=16&ycursor=16`
- Kombiniert:  
  `/index.html?size=[32,32]&cursors=[16,16]`
- Matrix übergeben:  
  `/index.html?matrix={...}`

Mit **Hash** (`#width=32&height=32`) statt **Query** (`?width=32&height=32`) können Änderungen ohne Neuladen übernommen werden.

## Matrix-Beispiel

Eine einfache Matrix-Übergabe, die ein Muster im Grid erzeugt:
```json
{
   "matrix": [
      [[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1]],
      [[255,255,64,1],0,0,0,[255,255,64,1]],
      [[255,255,64,1],0,0,0,[255,255,64,1]],
      [[255,255,64,1],0,0,0,[255,255,64,1]],
      [[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1],[255,255,64,1]]
   ],
   "xcursor":5,
   "ycursor":5,
   "pixelsX":10,
   "pixelsY":10
}
```
Natürlich wird die Matrix OHNE Leerzeichen und Zeilenumbrüche an  die URL gehangen, die Darstellung hier dient lediglich der Übersicht.  
Dieses Beispiel zeigt ein 10x10 Pixel Grid, darauf ein 5x5 Pixel Rechteck mit gelbem Rahmen und transparentem Inneren.

## Installation

Keine komplizierte Installation:

- Download oder git clone:
  ```sh
  git clone https://github.com/ManuelPeh76/PatternifyFlex
  ```
- Öffne die `index.html` im Browser. Das file:--Protokoll funktioniert hier problemlos.

---

## Nutzung von Recorder und Rec-Editor in Patternify Flex

### **1. Was ist der Recorder?**

Der **Recorder** nimmt alle Zeichenaktionen auf, die du auf dem Grid ausführst: Zeichenschritte, Farbwechsel, Werkzeugwechsel usw. Das Ergebnis ist eine aufzeichnungsbasierte “.rec”-Datei, die du exportieren (herunterladen), erneut abspielen, schrittweise durchgehen oder gezielt bearbeiten kannst.

**Typische Anwendungsfälle sind:**
- Animationen deiner Muster abspielen
- Tutorials oder Demo-Abläufe aufzeichnen
- Wiederverwendbare Malfolgen speichern

---

### **2. Recorder – Bedienung**

Öffne das Interface-Menü (drei Striche, oben hinter "Pixel Editor Plus") auf klicke dort auf die Filmkamera, um den Recorder zu öffnen (F3 erfüllt den gleichen Zweck).

#### a) Aufnahme starten/stoppen

- Wähle einen der Buttons, je nachdem, ob du aufnehmen oder abspielen, anhalten usw. willst.
- Alternativ: F11 startet die Aufnahme, Strg+F11 startet die Wiedergabe, Strg+F12 stoppt die Aufnahme und pausiert die Wiedergabe (wird bei erneutem Strg+F12 ganz gestoppt, oder durch Strg+F11 fortgesetzt).
- Während der Aufnahme werden alle Aktionen (Pinselstriche, Formen, Farbänderungen usw.) einschließlich der verstrichenen Zeit in einer Liste gespeichert.
- Fertig? Mit Klick auf Stop (oder Strg+F12) wird die Aufnahme beendet.

#### b) Abspielen/Pausieren

- Mit dem Button "Play" im Recorder (oder Strg+F11) wird die gerade aufgezeichnete .rec-Datei Schritt-für-Schritt auf dem Grid ausgeführt – ideal zur Vorschau!
- Du kannst pausieren (Pause-Button, Strg+F12), fortsetzen und mittels "Next/Prev" durch die Aufnahmen blättern.

#### c) Speichern & Laden

- Über den "Save"-Button im Recorder (oder F10) kannst du deine Aufzeichnung herunterladen (Dateiendung: ".rec").
- Über den Button "Load" (bzw. F9) kannst du eine bereits existierende .rec-Datei (z.B. aus vorherigen Sitzungen oder von anderen Usern) laden und abspielen oder editieren.

#### d) Geschwindigkeit

- Beim Abspielen lässt sich die Geschwindigkeit im Recorder einstellen (Standard: 3-fach).

---

### **3. Rec-Editor – Aufzeichnungen bearbeiten**

Hier beginnt der “Profi-Modus”: Jedes aufgenommene Element in deinem Record-Log kann einzeln eingesehen, verändert, gelöscht, verschoben oder ergänzt werden.

#### a) Aufzeichnung aufrufen/bearbeiten

- Nach dem Stoppen der Aufnahme öffnest du den Editor mit F8 oder du öffnest den Recorder mit F3 und klickst dort ganz rechts auf "Details", was ebenfalls den Editor öffnet.
- Es erscheint eine Listenansicht aller Aufnahmen (es wird nur die Demo-Aufnahme zu sehen sein, sofern du noch keine eigenen Aufnahmen gemacht hast).
- Ein Klick auf eine Aufnahme öffnet die Aktionen, aus denen die Aufnahme besteht.

#### b) Schrittweises Editieren

- Jeder Eintrag lässt sich **anzeigen, bearbeiten, verschieben oder löschen**:
    - Klick auf einen Listeneintrag öffnet ein Modal/Editorfenster mit Feldern zu Zeitstempel, Aktionstyp, Koordinaten, Farben, etc.
    - Einzelne Einträge können gelöscht werden, um Fehler oder unerwünschte Aktionen zu entfernen.
    - Über das Plus-Symbol kannst du nachträglich neue Aktionen manuell eintragen – etwa einen speziellen Farbwechsel oder eine Pause.
    - Viele Aktionen erlauben einen "Live"-Modus, um weitere Aktionen hinzuzufügen: Klicke auf das Plus-Symbol hinter einem Eintrag und wähle "Live-Modus". Nun wird der Editor geschlossen und ein Hinweis eingeblendet ('Drücke "Enter", um den Live-Modus zu beenden'). Alles, was du nun tust, wird aufgezeichnet. Nach Drücken von Enter öffnet sich der Editor wieder und die Aktionen werden in die Aufnahme eingefügt.
    - Einträge lassen sich in der Reihenfolge verschieben, um z.B. Animationsabfolgen zu optimieren.

#### c) Komplexe Änderungen

- Der Rec-Editor unterstützt das Kopieren von Einträgen, das Einfügen von Mustern (Matrix), das Zusammenfassen/Splitten von Aufzeichnungen sowie die präzise Anpassung von Parametern wie Zeitabständen und Koordinaten.
- Über das Kontextmenü oder zusätzliche Einstellungen lassen sich auch Meta-Daten wie die Pattern-Größe oder Cursor-Limits bearbeiten.

#### d) Vorschau & Test

- Nach Änderungen kann die gesamte Aufzeichnung erneut abgespielt oder als Vorschau getestet werden, bevor du sie endgültig speicherst oder exportierst.

---

### **Praxis-Tipps**

- **Experimentieren!** Der beste Weg den Recorder und Editor zu beherrschen, ist einfach mal eine Zeichnung aufzunehmen, abzuspeichern und dann gezielt einzelne Schritte zu editieren.
- **Timing:** Über den Editor kannst du die Abspielzeiten der einzelnen Schritte verändern (z.B. längere Pausen gezielt setzen).
- **Komplexe Animationen:** Du kannst einzelne .rec-Dateien miteinander kombinieren, wiederverwenden und daraus komplexe Pattern-Videos oder Pixel-Filme machen.

---

**Kurzum:**  
Mit Recorder und Rec-Editor verwandelst du Patternify Flex vom Pixel-Editor in ein leistungsfähiges Animations- und Ablauf-Toolkit – perfekt für kreative Pixel-Playbacks, Tutorials, Showcases oder persönliche Pattern-Macros.

---

# **Technische Hinweise (Hintergrund, Dateiformat und Beschreibung)**

- Die Aufnahmen werden als Array von Aktionen (“recLog”) gespeichert. Jede Aktion enthält Zeitstempel, Typ (z.B. Draw, Fill, Rectangle, Ellipse, MoveCursor, etc.) und je nach Typ unterschiedliche Parameter.
- Das Editieren ist somit nicht auf reine Pixelbeschreibungen beschränkt, sondern bietet die Möglichkeit, tatsächliche “Ablaufskripte” für Pixel-Animationen oder interaktive Muster zu bauen.
- Beispiel wie ein Auszug aus einer .rec-Datei (JSON) aufgebaut ist, sowie den grundsätzlichen Aufbau des Rec-Arrays findest du im Folgenden.

Das Eltern-Element aller rec-Daten (das 'recLog'-Array), besteht aus  Arrays, die einzelnen Aufnahme-Sessions entsprechen. Jedes Array im Reclog-Array ist eine Aufnahme von Aktionen und wird als Kassettensymbol in der UI angezeigt (im Tab "Aufnahmen"). Bei der Wiedergabe (z.B. durch das Anklicken eines der Kassetten-Symbole) wird nur der Inhalt dieser Aufnahme abgespielt und am Ende der Aufnahme wird gestoppt. Mit den Vor- und Zurück-Buttons im Player kannst du die nächste bzw. vorherige Aufnahme abspielen.
Jede Aufnahme besteht wiederum aus vielen Elementen, die ebenfalls jeweils einem Array entsprechen. Das sind die einzelnen Aktionen, die der Benutzer während der Aufnahme durchgeführt hat.

```
recLog = [                     ← Eltern-Array
   [                           ← Erste Aufnahme
      [0,0,[matrix]],          ← Header (ist immer das erste Element einer Aufnahme)
      [delay, mode, [item]],   ← Aktion 1
      [delay, mode, [item]],   ← Aktion 2
      [delay, mode, [item]],   ← Aktion 3
      ....
   ], [                        ← Zweite Aufnahme
      [0,0,[matrix]],          ← Header
      [delay, mode, [item]],   ← Aktion 1
      [delay, mode, [item]],   ← Aktion 2
      [delay, mode, [item]],   ← Aktion 3
      ....
   ]
];
```

### Ein Beispiel für eine Aufnahme

```
recLog = [
           [
             [0,0,[matrix]],                  ← Der Header einer Aufnahme besteht immer aus
                                                der Aktion: Verzögerung 0, Werkzeug 0
                                                und einer Start-Matrix. Diese wird am Anfang
                                                der Wiedergabe auf's Grid gerendert.
             [100,1,[0,0,1]],                 ← Nächste Aktion: Verzögere um 100ms, wähle das Werkzeug "Pixel"(1)
                                                und zeichne ein Pixel an x/y-Koordinate 0/0.
             [100,4,[18,10,0,1,null,null],1]  ← Warte 100ms, dann wechsle zum Linien-Werkzeug(4), aktiviere
                                                den Radierer und setze 18/10 als Startpunkt für die Redierer-Linie.
           ]
        ];
```
### Der Aufbau einer Aktion
```text
Eine Aktion ist wie folgt aufgebaut:
[Verzögerung in ms, Werkzeug-Nummer, [Aktion-Array](,ID)]

Verzögerung    Details (unterschiedlich, je nach Werkzeug)
        ↓        ↓
       [0,0,[matrix]]
          ↑
        Werkzeug
Der Header ist IMMER die erste Aktion einer Aufnahme!
Er enthält die Matrix, die bei Beginn der Wiedergabe
auf das Grid gerendert wird.

Am Beispiel eines zu zeichnenden Rechtecks:

          Rechteck   Radierer?
                | StartY |  EndY   ID der Form (wichtig für das Editing im Rec-Editor)
                |    |   |    |     |
Aktion:    [275,6,[1,2,1,0,16,23,0],1]  <-- Warte 275ms, dann beende das Rechteck
            |      |   |    |    |        von x1/y2 nach x16/y23.
            |  StartX  |   EndX  |
       Verzögerung   Fertig?   Gefüllt?

EndX == EndY == NULL bedeutet: Dies ist der Anfang der Form.
Der Radierer ist verfügbar bei Pixel, Linie und Rechteck.

Die ID existiert nur bei Linie, Rechteck, Polygon, Parallelogramm und Ellipse.
Angenommen, du willst im Editor ein gezeichnetes Rechteck (also alle Einzel-Aktionen dieser Form)
löschen, dann sucht der Editor den Anfang der Form (wo endX=null und endY=null), liest dort die ID
und löscht dann alle Aktionen mit gleicher ID. Vorausgesetzt, das Häkchen ist gesetzt bei "Lösche Formen als Ganzes",
ansonsten wird nur die Einzelaktion gelöscht, hinter der das Minus-Symbol angeklickt wurde.

```
### Die folgende Liste enthält alle Möglichkeiten für alle Werkzeuge:
```text
Aktion:
[Verzögerung, Werkzeug, [Details]]
                ↓          ↓
                0:HEADER
                           0: Date
                           1: Name
                           2: Matrix
                           3: X-Limit
                           4: Y-Limit
                           5: X-Fields total
                           6: Y-Fields total
                           7: Color Red (0-255)
                           8: Color Green (0-255)
                           9: Color Blue (0-255)
                           10: Opacity (0.01-1.00)
                           11: Status of the resize checkbox 'Take Pattern'
                           12: Status of the image load checkbox 'Original size'

                1: SINGLE PIXEL
                           0: X Coordinate
                           1: Y Coordinate
                           2: Erase

                2: WHOLE PATTERN
                           0: Matrix incl. pixelsX, pixelsY, xcursor and ycursor

                3: X and Y CURSOR
                           0: X Cursor
                           1: Y Cursor

                4: MOVE CURSOR
                           0: X Coordinate
                           1: Y Coordinate

                5: CALL JQUERY
                           0: Left Hand part (Replacements: '#' => ~id~, '.' => ~class~)
                           1: Right hand part

                6: RECTANGLE
                           0: Start X
                           1: Start Y
                           2: Finish
                           3: Erase
                           4: Target X
                           5: Target Y
                           6: Filled

                7: LINE
                           0: Start X
                           1: Start Y
                           2: Finish
                           3: Erase
                           4: Target X
                           5: Target Y

                8: MOVE GRID
                           0: Direction

                9: COLOR CHANGE
                           0: Red
                           1: Green
                           2: Blue
                           3: Opacity

                10: OPACITY CHANGE
                           0: Opacity (in percent)

                11: TEXT OUTPUT
                           0: Input Field number, one of
                                0: Resize: X value
                                1: Resize: Y value
                                2: Base64 Textfield
                                3: Image: New Width
                                4: Image: New Height
                                5: Color Field (Hex)
                                6: Opacity Field (0-100)
                           1: Text Content

                12: HIGHLIGHT TOOL (the 'none' entries are important for compatibility with the draw modes)
                           0: Tool Number
                                0: (none)
                                1: Pencil
                                2: Eraser
                                3: Eyedropper
                                4: Line
                                5: (none)
                                6: Rectangle
                                7: (none)
                                8: Ellipse
                                9: (none)
                                10: Move
                                11: Parallelogramm
                                12: (none)
                                13: (none)
                                14: Polygon
                                15: (none)
                                16: Open Image
                                17: Get Matrix

                13: ELLIPSE
                           0: Start X
                           1: Start Y
                           2: Finish
                           3: Erase
                           4: Target X
                           5: Target Y

                   14: OPEN / CLOSE AREA
                           0: Area
                                info
                                help
                                keys
                                record
                                x (close areas)

                15: EXECUTE INSTRUCTION
                           0: User Command
                                0: Preview off
                                1: Preview on
                                2: Hide Preview
                                3: Show Preview
                                4: Hide Tools
                                5: Show Tools
                                6: Hide Presets
                                7: Show Presets
                                8: Set playback speed
                                        0: Speed value
                                9: Run pattern as marquee
                                        0: Matrix object incl.
                                           pixelsX = pixelsY ('Window' size)
                                           and marquee (total length of the image)
                                10: User command
                                        0: command (Javascript)
                                11: Jump to Item
                                        0: Item number (visible in editor)

                16: CALL FUNCTION
                           0: function name
                           1: function parameter
                           2: async function

                17: LOAD NEW GRID CONFIGURATION
                           0: Matrix (array)
                           1: X-Limit
                           2: Y-Limit
                           3: X-Fields total
                           4: Y-Fields total

                18: PARALLELOGRAM
                           0: a X coordinate
                           1: a Y coordinate
                           2: b X coordinate
                           3: b Y coordinate
                           4: Line ab finished
                           5: c X coordinate
                           6: c Y coordinate
                           7: finish

                19: POLYGON
                           0: (array) [ (object/s) {xc: X coordinate, yc: Y coordinate}, {xc: ...} ]
                           1: finish

                20: RUN TEXT MARQUEE
                           0: Text
                           1: Font Family
                           2: Font Size

                21: DRAW TEXT
                           0: Text
                           1: Font Family
                           2: Font Size

                22: CHANGE TEXTAREA VALUE
                           0: Id
                                draw-text
                                font
                                text-size
                           1: Content
                                draw-text: Text
                                font: Name of the Font Family
                                text-size: (size in pixels)px
```

---

## Lizenz

MIT License

---

## Weiterführende Links

- [PatternifyFlex auf GitHub](https://github.com/ManuelPeh76/PatternifyFlex)
- [Original Patternify](http://www.patternify.com)
