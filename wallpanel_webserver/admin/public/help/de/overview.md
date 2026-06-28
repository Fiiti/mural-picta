# MuralPicta – Übersicht

**MuralPicta** ist ein selbst gehosteter Diashow-Server für Wandpanels, Tablets und Displays. Er läuft vollständig im lokalen Netzwerk — keine Cloud, kein Abo, keine externen Dienste nötig. Nach der Installation funktioniert er komplett offline (abgesehen von der optionalen GPS-Ortsnamenerkennung).

Typischer Anwendungsfall: Ein an der Wand montiertes Tablet oder Display zeigt eine kontinuierliche, schöne Diashow mit eigenen Fotos und Videos, die direkt vom NAS (Synology, QNAP usw.) oder einem Netzlaufwerk kommen.

---

## Erste Schritte

1. **Media Source** — konfiguriere, wo Fotos und Videos gespeichert sind (NAS-Pfad oder Netzwerkfreigabe)
2. **Slideshow** — Anzeigezeiten, Reihenfolge und Überblendung einstellen
3. Die Diashow unter **`http://<Server-IP>:3000`** in einem beliebigen Browser öffnen

Alles andere ist optional und kann jederzeit angepasst werden.

---

## Einstellungen im Überblick

### Media Source
Definiert, wo MuralPicta nach Bildern und Videos sucht. Das ist die wichtigste Einstellung.

- **Media Base Path** — der lokale Pfad zum Ordner (z. B. `/mnt/nas/fotos` oder ein Docker-Bind-Mount)
- **Unterstützte Quellen:** eingebundene Netzlaufwerke (SMB/NAS), lokale Ordner
- Ein **Test**-Button prüft den Pfad und zeigt, wie viele Dateien gefunden wurden

→ *Mehr zur NAS-Einrichtung und Docker-Volume-Konfiguration in der Doku „Media Sources".*

---

### Slideshow
Steuert das Kernverhalten der Diashow.

- **Anzeigezeit Bilder** — wie lange ein Foto angezeigt wird (Sekunden)
- **Anzeigezeit Videos** — wie lange ein Video läuft, bevor das nächste startet
- **Reihenfolge** — zufällig, nach Name oder nach Datum
- **Überblendedauer** — Übergangsdauer zwischen zwei Medien (Sekunden)
- **Medienlisten-Aktualisierungsintervall** — wie oft die Dateiliste neu eingelesen wird (Minuten); wichtig im Zufallsmodus, damit neue Dateien berücksichtigt werden

---

### Ken Burns Effekt und Panoramadarstellung
Fügt eine langsame, cinematische Zoom-und-Schwenk-Animation zu Bildern hinzu.

- **An/Aus** — Effekt aktivieren oder deaktivieren
- **Zoom-Faktor** — wie weit das Bild heranzoomt (z. B. 1.3 = 30 % Zoom)
- Die Schwenkrichtung wird pro Bild zufällig gewählt

**Panoramamodus (für Breitbilder)**

Breite Bilder wie 180°-Panoramen oder zusammengesetzte Landschaftsaufnahmen werden separat behandelt: Statt zu zoomen, schwenkt MuralPicta horizontal über das Bild – für ein kinematografisches Ergebnis.

- **Panoramamodus aktivieren** — schaltet die automatische Erkennung ein
- **Seitenverhältnis-Schwellenwert** — ab welchem Breite-zu-Höhe-Verhältnis ein Bild als Panorama gilt

**Wie wird das Seitenverhältnis berechnet?**

Ganz einfach: `Breite ÷ Höhe = Verhältnis`

| Verhältnis | Beispiel | Einschätzung |
|-----------:|----------|-------------|
| 1,33 | 4:3 — Standardfoto | Normal |
| 1,78 | 16:9 — Widescreen | Normal |
| 2,00 | Doppelt so breit wie hoch | Grenzbereich |
| 2,35 | Kinoformat | Sehr breit |
| **2,50** | **★ Standard-Schwellenwert** | **Empfohlen** |
| 3,0+ | Echtes Panorama | Panorama ✓ |

Der Standard von **2,5** erkennt echte Panoramen zuverlässig und lässt normale Fotos (4:3 = 1,33; 16:9 = 1,78) vollständig unberührt — egal wie viele Pixel das Bild hat oder welche Kamera es aufgenommen hat.

- **Schwenkrichtung** — Links→Rechts, Rechts→Links oder pro Bild zufällig
- **Max. Schwenkgeschwindigkeit (px/s)** — ist die Anzeigezeit zu kurz für einen vollständigen Schwenk, wird die Dauer automatisch verlängert

---

### Info Overlay
Zeigt Informationen zum aktuellen Foto/Video auf dem Bild an — wie eine Bildunterschrift.

- **An/Aus** — Overlay aktivieren oder deaktivieren
- **Position** — unten rechts, unten links, oben rechts, oben links
- **Bild-Overlay-Template** — vollständig anpassbares HTML-Template; kann Dateiname, Datum, GPS-Standort, Kameramodell und mehr anzeigen
- **GPS-Standort abfragen** — löst GPS-Koordinaten aus EXIF-Daten in einen Ortsnamen auf (verwendet OpenStreetMap / Nominatim)
- **Sprache der Ortsnamen** — Sprache für GPS-ermittelte Ortsnamen wählen (z. B. Deutsch, Englisch, Französisch) — unabhängig von der Admin-Oberflächensprache

→ *Alle verfügbaren Template-Variablen und Beispiele in der Doku „Bild Overlay".*

---

### Video
Einstellungen speziell für die Videowiedergabe.

- **Lautstärke** — Standard-Lautstärke (0 = stumm, 1 = volle Lautstärke)
- **Wiederholen** — ob ein Video neu startet, wenn es endet (bevor die Anzeigezeit abläuft)

---

### Display
Visuelle Einstellungen für die Diashow.

- **Image fit** — wie Bilder den Bildschirm füllen: `cover` (ausfüllend, ggf. abgeschnitten), `contain` (vollständiges Bild, ggf. Ränder), `fill` (gestreckt)
- **Fortschrittsbalken anzeigen** — dünne Fortschrittslinie am unteren Bildschirmrand
- **Hintergrundfarbe** — sichtbar bei `contain`-Fit mit Rändern

---

### Filter / Exclude
Legt fest, welche Dateien und Ordner aus der Diashow **ausgeschlossen** werden sollen.

- **Dateien ausschließen** — Reguläre Ausdrücke, die gegen den Dateinamen geprüft werden
- **Ordner ausschließen** — Reguläre Ausdrücke gegen Ordnernamen (z. B. `^@` zum Überspringen von Synology-Thumbnail-Ordnern)

→ *Regex-Beispiele und Tipps in der Doku „Filter / Exclude".*

---

### Debug
Entwickleroptionen — nur für die Fehlersuche gedacht.

- **Debug-Modus** — zeigt ein Informations-Overlay mit EXIF-Daten und Dateidetails auf jedem Bild

---

### Security / PIN
Schützt die Admin-Oberfläche mit einem PIN-Code.

- **PIN aktivieren/deaktivieren**
- Mindestens 4 Zeichen, nur Buchstaben und Zahlen
- Die Diashow (`/`) ist immer ohne PIN erreichbar

→ *Wenn du deinen PIN vergessen hast, hilft die Doku „PIN Reset" weiter.*

---

### System & Status
Zeigt Server-Informationen und Steuerungsoptionen.

- **Version** — aktuelle MuralPicta-Version
- **Laufzeit** — wie lange der Server bereits läuft
- **Diashow öffnen** — öffnet die Diashow in einem neuen Browser-Tab
- **Log anzeigen** — zeigt aktuelle Server-Fehler
- **Server stoppen** — stoppt den Server-Prozess (im Docker nicht verfügbar; dort `docker stop` verwenden)

---

## Fernsteuerung per API

MuralPicta hat eine eingebaute HTTP-API, mit der die Diashow ferngesteuert werden kann — über Home Assistant, ein Skript oder einen beliebigen Browser.

Beispiel: `http://<Server-IP>:3000/api/command/pause`

→ *Alle verfügbaren Befehle und Beispiele in der Doku „API Reference".*
