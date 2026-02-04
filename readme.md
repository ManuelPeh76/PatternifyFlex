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
   Öffne `index.html` direkt im Browser. Für beste Ergebnisse empfiehlt sich ein lokaler Webserver ([wie etwa mit Python](https://docs.python.org/3/library/http.server.html))  
   Beispiel:  
   ```sh
   python -m http.server
   ```
   oder einfach per Doppelklick, z. B. mit Firefox (Dateiprotokoll funktioniert oft problemlos).

3. **Info:**  
   Weitere Details und Tipps findest du im Tool-Menü unter “Information”.

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
matrix={
 [
  [[255,255,255,1],[255,255,255,1],[255,255,255,1],[255,255,255,1],[255,255,255,1]],
  [[255,255,255,1],0,0,0,[255,255,255,1]],
  [[255,255,255,1],0,0,0,[255,255,255,1]],
  ...
 ]
}
```
Dieses Beispiel zeigt einen 5x5-Pixel-Rahmen mit transparentem Inneren.

## Installation

Keine komplizierte Installation:

- Download oder git clone:
  ```sh
  git clone https://github.com/ManuelPeh76/PatternifyFlex
  ```
- Öffne die `index.html` im Browser.

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

Im Interface findest du einen Bereich oder Button namens **“Recorder”** oder **“Aufnahme”**. Die grundlegenden Aktionen sind:

#### a) Aufnahme starten/stoppen

- Klicke auf „Record“/„Aufnahme“, um deine Zeichenaktionen festzuhalten.
- Während der Aufnahme werden alle Aktionen (Pinselstriche, Formen, Farbänderungen usw.) in einer Liste gespeichert.
- Fertig? Mit „Stop“ wird die Aufnahme beendet.

#### b) Abspielen/Pausieren

- Mit „Play“ wird die gerade aufgezeichnete .rec-Datei Schritt-für-Schritt auf dem Grid ausgeführt – ideal zur Vorschau!
- Du kannst pausieren („Pause“), fortsetzen und mittels „Next/Prev“ einzelne Schritte vor- und zurückspringen.

#### c) Speichern & Laden

- Über „Save“ kannst du deine Aufzeichnung herunterladen (Dateiendung: `.rec`).
- Über „Load“ (Dateiwahlfeld) kannst du eine bereits existierende .rec-Datei (z.B. aus vorherigen Sitzungen oder von anderen Usern) laden und abspielen oder editieren.

#### d) Geschwindigkeit

- Beim Abspielen lässt sich die Geschwindigkeit vorgeben („Speed Slider“).

---

### **3. Rec-Editor – Aufzeichnungen bearbeiten**

Hier beginnt der “Profi-Modus”: Jedes aufgenommene Element in deinem Record-Log kann einzeln eingesehen, verändert, gelöscht, verschoben oder ergänzt werden.

#### a) Aufzeichnung aufrufen/bearbeiten

- Nach dem Stoppen der Aufnahme klickst du auf „Edit“ oder öffnest über das Recorder-Menü den *Rec-Editor*.
- Es erscheint eine Listenansicht aller Einträge (Draw, Move, Toolchange, Pattern etc.).

#### b) Schrittweises Editieren

- Jeder Eintrag lässt sich **anzeigen, bearbeiten, verschieben oder löschen**:
    - Klick auf einen Listeneintrag öffnet ein Modal/Editorfenster mit Feldern zu Zeitstempel, Aktionstyp, Koordinaten, Farben, etc.
    - Einzelne Einträge können gelöscht werden, um Fehler oder unerwünschte Aktionen zu entfernen.
    - Über „Insert“ kannst du nachträglich neue Aktionen manuell eintragen – etwa einen speziellen Farbwechsel oder eine Pause.
    - Einträge lassen sich in der Reihenfolge verschieben, um z.B. Animationsabfolgen zu optimieren.

#### c) Komplexe Änderungen

- Der Rec-Editor unterstützt das Kopieren von Einträgen, das Einfügen von Mustern (Matrix), das Zusammenfassen/Splitten von Aufzeichnungen sowie die präzise Anpassung von Parametern wie Zeitabständen und Koordinaten.
- Über das Kontextmenü oder zusätzliche Einstellungen lassen sich auch Meta-Daten wie die Pattern-Größe oder Cursor-Limits bearbeiten.

#### d) Vorschau & Test

- Nach Änderungen kann die gesamte Aufzeichnung erneut abgespielt oder als Vorschau getestet werden, bevor du sie endgültig speicherst oder exportierst.

---

### **4. Technische Hinweise (Hintergrund & Dateiformat)**

- Die Aufnahmen werden als Array von Aktionen (“recLog”) gespeichert. Jede Aktion enthält Zeitstempel, Typ (z.B. Draw, Fill, Rectangle, Ellipse, MoveCursor, etc.) und je nach Typ unterschiedliche Parameter.
- Das Editieren ist somit nicht auf reine Pixelbeschreibungen beschränkt, sondern bietet die Möglichkeit, tatsächliche “Ablaufskripte” für Pixel-Animationen oder interaktive Muster zu bauen.
- Beispiel wie ein Auszug aus einer .rec-Datei (JSON) aufgebaut ist, sowie den grundsätzlichen Aufbau des Rec-Arrays findest du in der Datei "readme_rec.md".

---

### **Praxis-Tipps**

- **Experimentieren!** Der beste Weg den Recorder und Editor zu beherrschen, ist einfach mal eine Zeichnung aufzunehmen, abzuspeichern und dann gezielt einzelne Schritte zu editieren.
- **Timing:** Über den Editor kannst du die Abspielzeiten der einzelnen Schritte verändern (z.B. längere Pausen gezielt setzen).
- **Komplexe Animationen:** Du kannst einzelne .rec-Dateien miteinander kombinieren, wiederverwenden und daraus komplexe Pattern-Videos oder Pixel-Filme machen.

---

**Kurzum:**  
Mit Recorder und Rec-Editor verwandelst du Patternify Flex vom Pixel-Editor in ein leistungsfähiges Animations- und Ablauf-Toolkit – perfekt für kreative Pixel-Playbacks, Tutorials, Showcases oder persönliche Pattern-Macros.

---

## Lizenz

Bitte prüfe die Datei `LICENSE` im Repo für die aktuellen Lizenzbedingungen.

---

## Weiterführende Links

- [PatternifyFlex auf GitHub](https://github.com/ManuelPeh76/PatternifyFlex)
- [Original Patternify](http://www.patternify.com)
