# WallPanel Server – Projektkontext für Claude

## Tooling
- Für Browser-Automatisierung im Projekt: `npx @playwright/cli` verwenden (installiert als `@playwright/cli`)
- KEIN eigenes Playwright-Script schreiben, solange `@playwright/cli` ausreicht
- Browser IMMER mit `--headed` öffnen, damit der User den Browser live sieht. Beispiel: `npx @playwright/cli open --headed https://...`
- `@playwright/cli` läuft standardmäßig headless (unsichtbar) – `--headed` ist PFLICHT für sichtbare Fenster

## Projektübersicht

**Ziel:** Eine eigenständige Web-Server-Lösung als Bild- und Video-Diashow für Wandpanels/Tablets. Es soll quasi die bestehende Lösung der Home Assistant HACS Erweiterung im Ordner `dev_basis/lovelace-wallpanel-main/` so nachzubauen, dass es vollständig unabhängig und ohne Home Assistant läuft und nur die Video-Bilder Diashow mit allen dazu zugehörigen Unterdiensten (GPS zu Ortnamen Anzeige, Datumanzeige, Ken-Burns Effekt). Sämtliche dort verwendeten Dienste haben sich als sehr gut bisher bewiesen. Außer beim Dienst der GPS zu Ortsnamen Ermittlung - hier sind robuste kostenlose alternative mir vorzuschlagen und dann zu verwenden. 

Die Anwendung besteht aus zwei Teilen:
1. **Diashow-Frontend** – läuft im Browser des Wandpanels (Vollbild, keine Navigation)
2. **Admin-Oberfläche** – zum Konfigurieren aller Einstellungen, erreichbar über denselben Webserver

**Referenz-Code:** `dev_basis/lovelace-wallpanel-main/` enthält das Original-Lovelace-WallPanel (Home Assistant Extension). Dieses dient **nur als Ideenquelle und Referenz** – es wird nicht direkt verwendet und der Ordner `dev_basis/` wird **nicht verändert**. Die Datei `dev_basis/Home_Assistant_Dashboard_Integration.yaml` zeigt die notwendige Konfiguration für den Referenz-Code. Aus dem Referenzcode sind die verwendeten Dienste zu ermitteln. Das betrifft vor allem die Funktionen 
  - GPS zu Ortnamen Anzeige,
  - Datumanzeige,
  - Ken-Burns Effekt und
  - die Überblendung
  - gegebenenfalls auch andere Dienste oder Funktionen, die weiter unten gewünscht sind

---

## Architektur & Tech-Stack

> Sämtliche Angaben sind jederzeit änderbar, wenn eine andere technologie sinnvoller ist!
Es ist der Basiscode aus dem Ordner `dev_basis/` zu untersuchen, was alles sinnvoll noch erscheint. Dabei sind aber alle Home Assistant Techniken zu ignorieren

| Komponente | Notizen |
|---|---|---|
| **Backend / Webserver** |  Node.js/Express - mit der Option beliebig etwas anderes zu nehmen, wenn es sich im Projekt als sinnvoll zeigt.|
| **Frontend (Diashow)** | Vanilla JS- mit der Option beliebig etwas anderes zu nehmen, wenn es sich im Projekt als sinnvoll zeigt.|
| **Frontend (Admin)** | VUE - mit der Option beliebig etwas anderes zu nehmen, wenn es sich im Projekt als sinnvoll zeigt.|
| **Konfigurationsspeicher** | JSON-Datei |
| **Medienzugriff** | SMB/Netzlaufwerk - z. B. Synology, Qnap, andere NAS Systeme oder Freigaben |
| **Deployment** | Docker und einfache Ordner auf Synology|

**Verzeichnisstruktur (Ziel, noch nicht final):**
```
wallpanel_server/
├── dev_basis/              # Referenz-Code (NICHT verändern!)
├── wallpanel_webserver
|   ├── server/             # Backend-Code
|   ├── frontend/           # Diashow-Frontend
|   ├── admin/              # Admin-Oberfläche
|   ├── config/             # Konfigurationsdateien
|   ├── doc/                # Dokumentationen zur Verwendung/Bedienungshandbuch in eng. und deu.
└── CLAUDE.md               # Diese Datei
```

---

## Medienquellen

Unterstützte und geplante Quellen für Bilder und Videos:

- **NAS/Netzwerkspeicher** (primäre Quelle)
  - via SMB / gemountetes Netzlaufwerk, wie Synology, Qnap, ugreen, FritzBox, PC Freigabe, usw.
  - Zugangsdaten (IP, User, Passwort/Token) werden in der Admin-Oberfläche konfiguriert. Anonymer Zugang (keine Anmeldedaten) muss auch unterstützt werden.
- **HTTP/S URLs** (externe Bildquellen, mit Query-Parameter
- **Immich** (self-hosted Foto-Bibliothek, API-Integration)
- **Unsplash API** (zufällige Online-Fotos)

---

## Allgemeine Features – Diashow-Core

Alle Features der Kernanwendung (Diashow im Browser), einzustellen im Admin-Panel.

### Diashow-Grundfunktionen
[x] = must have, [o] = optional, [ ] = nicht notwendig - wenn es leicht geht, dann einbauen- evtl. auch in Zukunft umgesetzt, [n] = ausschließen
- [x] **Bild-Anzeige** im Vollbild (image fit: cover/contain/fill)
- [x] **Video-Wiedergabe** (looping, muted by default, konfigurierbares Volume)
- [x] **Crossfade-Übergang** zwischen allen Medien (konfigurierbare Dauer)
- [x] **Ken Burns Effekt** (langsames Zoomen/Schwenken bei Bildern und Videos)
  - [o] Zoom-Faktor konfigurierbar (z.B. 1.3x)
  - [o] Richtung: zufällig / festgelegt
  - [o] Alternative, vollkommene kostenlose und bessere Dienste als im Basiscode sind mir gerne vorzuschlagen. Keine Test-Plan Dienste!
- [x] **Anzeigedauer pro Bild** vollkommen frei konfigurierbar in Sekunden, (Standard: 15s) - Bilder sollen andere Zeit haben können als Videos.
- [x] **Anzeigedauer pro Video** vollkommen frei konfigurierbar in Sekunden, (Standard: 15s) - Videos sollen andere Zeit haben können als Bilder.
- [x] **Reihenfolge:** zufällig oder sortiert (Name, Datum)
- [x] **Fortschrittsanzeige** (sehr sehr dünne Linie am unteren Rand)
- [x] **Medienliste** vorab laden, Intervall zum Auffrischen konfigurierbar in Minuten. Nach dieser Zeit soll die Medienliste neu erstellt werden, was z. B. bei den Zufallsprinzip besonders wichtig ist. Es muss immer Recursiv alle Ordner berücksichtigt werden mit Errorhandling auf max. 5 Ebenen. 
- [x] **Filterung:** nach Dateityp(extension), Dateiname (Regex)
- [x] **Zusatzinfoszeige** Definierbar in HTML Code für Anzeigeart, Position und Inhalt- Siehe Umfang und Funktion in `dev-basis` Basiscode in der Option "image_info_template:". Die Variablen für das Template können individuell in diesem Projekt verwendet werden und müssen sich nicht an das Beispiel halten.


### Anzeige & Vollbild
- [ ] **Vollbildmodus** (Fullscreen API), wenn technisch machbar - ansonsten muss das der Browser wie FullyKiosk übernehmen
- [ ] **Wake Lock** (Bildschirm wach halten, Screen Wake Lock API), wenn technisch machbar - ansonsten muss das der Browser wie FullyKiosk übernehmen
- [ ] **Browser-Navigationsleiste** ausblenden, wenn technisch machbar - ansonsten muss das der Browser wie FullyKiosk übernehmen

### Interaktion
- [o] **Tippen/Klicken** hält Diashow an oder wechselt Bild vor oder zurück (tap auf linker Hälfte- zurück, rechter Hälfte-vor oder Mittig-pause/weiter)
- [ ] **Touch-Zonen** (links/rechts: zurück/weiter, konfigurierbare Größe)
- [ ] **Tastatursteuerung** (Pfeiltasten, Leertaste)
- [n] **Bewegungserkennung** via Gerätekamera (Diashow startet/stoppt)
  - [n] Empfindlichkeitsschwelle konfigurierbar (z.B. 5%)
  - [n] Kamera auswählen (falls mehrere vorhanden)

### Bild-Informations-Overlay
- [x] **Metadaten-Anzeige** (Dateiname, Aufnahmedatum aus EXIF) - siehe Template!
- [x] **GPS / Standort** aus EXIF-Daten (Reverse-Geocoding via Nominatim API) - siehe Template, Alternativen denkbar - vorgaben siehe weiter oben
- [x] **Anpassbares Template** Definierbar in HTML Code für Anzeigeart, Position und Inhalt- Siehe Umfang und Funktion in `dev-basis` Basiscode in der Option "image_info_template:". Die Variablen für das Template können individuell in diesem Projekt verwendet werden und müssen sich nicht an das Beispiel halten.
- [ ] **Overlay-Bewegung** (bleibt in Ecken oder bewegt sich zufällig, Anti-Einbrennen)
- [x] **Position konfigurierbar** (oben links / unten rechts / etc.)  - siehe Template!

### Overlay-Inhalte
- [ ] **Uhr / Datum** einblenden
- [n] **Wetter-Widget** einblenden
- [n] **Eigene HTML-Widgets** einblenden

### Pfad-Angaben Steuerung
- [x] **Start Medien URL** Die Starturl in Form des Freigabenamens des Ordners in der Konfiguration fest- Es sind dann immer alle rekursiven Ordner-Dateien zu berücksichtigen!
- [x] **Bilder-Pfad als Query bestimmbar** Es muss via Query-Parameter die Bilder-Url änderbar sein. Ein Beispiel aus Home Assistant: "http://192.168.1.100:8123/lovelace/wohnzimmer?wp_enabled=true&wp_image_url=%22media-source://media_source/local/WN4_Foto%22&kiosk". Es soll nicht mehr die Home Assistant Funktionen verwendet werden - das ist nur ein Beispiel zur Verdeutlichung. Mit dieser Url sollen dann andere Subfolder als aktueller Basisordner bestimmbar sein. 
Beispiel:
  - Gegeben ist auf dem Server eine Freigabe "medien".
  - In diesem Ordner sind die Unterordner nach Jahren 2026, 2025, 2024, ...
  - jeder dieser Jahres-Ordner kann noch z. B. in Reisen oder Monaten unterteilt sein
  - dann soll mit einer URL nur der Ordner 2026 auswählbar sein, das sendet z. B. Home Assistant Automation. Alle Medien recursiv werden nun angezeigt, bis neue URL oder ein Restart der Websetite kommt
  - Irgendwann kann auch nur noch der medien-rootordner "medien" in der URL aufgerufen werden, dann werden wirklich alle Medien in diesem Ordner angezeigt. Also konkret, die Liste wird aufgebaut.
Ziel ist es somit für eine bestimmte Zeit nur die Videos/Bilder (nebst allen Unterordnern) aus dem Jahr/Ordner 2026 anzuzeigen. Nach eine Zeit x sendet dann ein anderer dritter Dienst (z. B. eine Home Assistant Automation) eine neue URL für den Unterordner 2024.
Unterstützt werden muss erst einmal nur die Bilderordner URL - keine anderen Parameter wie Zeiten oder sonst was (wie es in den Beispieln auch der Fall ist).

---

## Admin-Oberfläche
- Alle oben bestimmten Parameter sollen hier in einer schönen und einfach zu bedienenden Oberfläche konfigurierbar sein. Es müssen keine Submenus angelegt werden, können aber, wenn es der Bedienbarkeit dienlich ist. Wichtig ist eine gute Übersicht und Beschreibung aller Felder.
- Alle Parameter sind auf englisch anzuzeigen 
- [ ] mit der Option zwischen deutsch und engl. umzuschalten - später vielleicht noch mehr sprachen. gegebenenfalls Sprachfiles anlegen unbd unterstützen.
- [x] Webbasierte Konfigurationsoberfläche (eigene Route, z.B. `/admin`). Optionaler Zugriffsschutz (per Pin alphanumerich) soll angeboten werden. Änderbar in der Adminoberfläche mit den Optionen "Nicht notwendig", oder "alpanumerischer Pin" mit mind. vier Zeichen. Jederzeit deaktivierbar. Zu speichern in der Konfiguration, gerne als Hash. Da unkritischer Dienst kein besonderer Schutz notwendig. Eher nur ein Kinderschutz. 

### Allgemeine Einstellungen
siehe Beschreibungen weiter oben

### Medienquellen-Verwaltung
siehe Beschreibungen weiter oben

### Diashow-Einstellungen
siehe Beschreibungen weiter oben

### Overlay & Informationen
siehe Beschreibungen weiter oben

### Interaktion & Steuerung
siehe Beschreibungen weiter oben

### Zugriff & Sicherheit
siehe Beschreibungen weiter oben

### System & Status
- [ ] **Aktuelle Diashow-Vorschau** (Thumbnail der laufenden Anzeige)
- [ ] **Medienbibliothek-Statistiken** (Anzahl Bilder/Videos, Gesamtgröße)
- [x] **Serverlog** / letzte Fehler anzeigen
- [x] **Neustart** des Servers auslösen
- [x] **Versionsinformation**

---

## Geplante zukünftige Features

> Ideen und Nice-to-haves – noch nicht priorisiert.

- [ ] Gesichtserkennung bei Ken-Burns-Effekt Lösung / Smart-Album-Integration (Immich)
- [ ] Remote-Steuerung (z.B. über Smartphone-Browser)
- [ ] MQTT-Integration für externe Steuerung

---

## Entwicklungshinweise
keine

**Projekt Arbeitsverzeichnis:** `~/claude-projekte/wallpanel_server/`
**Coding-Basisverzeichnis:** `~/claude-projekte/wallpanel_server/wallpanel_webserver`

**Wichtig:**
- `dev_basis/` ist **nur Referenz** – niemals Dateien darin verändern
- Der Referenz-Code (`dev_basis/lovelace-wallpanel-main/wallpanel-src.js`) zeigt wie Features technisch umgesetzt wurden – für Inspiration und Abschauen, nicht zum Copy-Paste

**Referenz-Dateien:**
- `dev_basis/lovelace-wallpanel-main/wallpanel-src.js` – Original-Implementierung (182 KB, sehr gut lesbar)
- `dev_basis/lovelace-wallpanel-main/docs/configuration.md` – alle Konfigurations-Optionen dokumentiert
- `dev_basis/lovelace-wallpanel-main/docs/media-sources.md` – Medienquellen-Integration
- `dev_basis/Home_Assistant_Dashboard_Integration.yaml` – Beispiel-Konfiguration (zeigt typische Einstellungen)

**Build & Start:**
```bash
# TODO: Befehle eintragen sobald Tech-Stack festgelegt
# npm start / python main.py / docker compose up
```

**Coding-Konventionen:**
> Noch festzulegen – hier eintragen sobald bekannt.
