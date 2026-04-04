# API-Referenz

MuralPicta stellt eine einfache HTTP-REST-API bereit. Du kannst sie von jedem Gerät im selben Netzwerk aus nutzen – einem Browser, einem Smarthome-System wie Home Assistant, einer Kommandozeile oder einem eigenen Skript.

---

## Schnellstart-Beispiele

### Was du wissen musst

Ersetze `192.168.1.100` durch die IP-Adresse des Geräts, auf dem MuralPicta läuft, und `3000` durch den konfigurierten Port (Standard: `3000`).

### Linux / macOS (Terminal)

```bash
# Diashow pausieren
curl -X POST http://192.168.1.100:3000/api/command/pause

# Diashow fortsetzen
curl -X POST http://192.168.1.100:3000/api/command/play

# Bildschirm schwärzen
curl -X POST http://192.168.1.100:3000/api/command/blank

# Bildschirm wieder einschalten
curl -X POST http://192.168.1.100:3000/api/command/unblank

# Nächstes Bild
curl -X POST http://192.168.1.100:3000/api/command/next
```

### Windows (Eingabeaufforderung oder PowerShell)

```bat
REM Diashow pausieren
curl -X POST http://192.168.1.100:3000/api/command/pause

REM Diashow fortsetzen
curl -X POST http://192.168.1.100:3000/api/command/play
```

> **Tipp:** `curl` ist ab Windows 10 eingebaut. Öffne **Start → „cmd" eingeben → Enter**, dann den Befehl einfügen.

### Home Assistant (REST-Befehl)

```yaml
rest_command:
  wallpanel_blank:
    url: "http://192.168.1.100:3000/api/command/blank"
    method: POST
  wallpanel_unblank:
    url: "http://192.168.1.100:3000/api/command/unblank"
    method: POST
  wallpanel_pause:
    url: "http://192.168.1.100:3000/api/command/pause"
    method: POST
  wallpanel_play:
    url: "http://192.168.1.100:3000/api/command/play"
    method: POST
  wallpanel_next:
    url: "http://192.168.1.100:3000/api/command/next"
    method: POST
  wallpanel_prev:
    url: "http://192.168.1.100:3000/api/command/prev"
    method: POST
```

---

## Diashow-Steuerung

Alle Steuerbefehle liefern bei Erfolg `{ "ok": true }` zurück.

> **Hinweis:** Das Diashow-Frontend fragt `/api/command/state` alle 2 Sekunden ab, Befehle wirken also innerhalb von 2 Sekunden.

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| `GET`   | `/api/command/state` | Aktuellen Steuerstatus abfragen (siehe unten) |
| `POST`  | `/api/command/blank` | Bildschirm schwarz schalten. Diashow läuft nicht weiter. |
| `POST`  | `/api/command/unblank` | Bildschirm wieder einschalten. Diashow läuft weiter. |
| `POST`  | `/api/command/pause` | Diashow auf aktuellem Bild pausieren. Das Bild wird vollflächig angezeigt (kein Zoom, keine Ränder abgeschnitten). |
| `POST`  | `/api/command/play` | Diashow fortsetzen. |
| `POST`  | `/api/command/next` | Ein Bild/Video vorspringen. |
| `POST`  | `/api/command/prev` | Ein Bild/Video zurückspringen. |

### GET /api/command/state — Antwort

```json
{
  "blank": false,
  "paused": false,
  "nextSeq": 3,
  "prevSeq": 1
}
```

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `blank` | boolean | `true` = Bildschirm ist geschwärzt |
| `paused` | boolean | `true` = Diashow ist pausiert |
| `nextSeq` | Zahl | Zähler, steigt bei jedem `/next`-Aufruf |
| `prevSeq` | Zahl | Zähler, steigt bei jedem `/prev`-Aufruf |

> **Hinweis:** `nextSeq` und `prevSeq` sind Sequenznummern. Das Frontend erkennt eine Erhöhung und springt entsprechend. Der Server-Status wird bei einem Neustart zurückgesetzt.

---

## Konfiguration

### GET /api/config

Gibt die vollständige Konfiguration als JSON-Objekt zurück.

```bash
curl http://192.168.1.100:3000/api/config
```

### POST /api/config

Speichert Konfiguration (vollständig oder teilweise). Nur die gewünschten Felder müssen mitgeschickt werden.

```bash
curl -X POST http://192.168.1.100:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"display_time_image": 20}'
```

**Antwort:** `{ "ok": true }`

> Für die meisten Konfigurationsänderungen ist ein Server-Neustart erforderlich, damit sie in der Diashow wirksam werden.

---

## Medien

### GET /api/media/list

Gibt die Liste aller gefundenen Mediendateien zurück (Bilder und Videos).

```bash
curl http://192.168.1.100:3000/api/media/list
```

**Optionaler Query-Parameter:**

| Parameter | Beschreibung |
|-----------|--------------|
| `subpath` | Unterordner relativ zum konfigurierten Medienpfad, z. B. `?subpath=2026/Sommer` |

**Beispiel-Antwort:**

```json
[
  {
    "filename": "urlaub.jpg",
    "url": "/media/2026/urlaub.jpg",
    "type": "image",
    "relativePath": "2026/urlaub.jpg"
  }
]
```

### GET /api/media-source/test

Prüft, ob der konfigurierte Medienpfad erreichbar ist, und gibt Statistiken zurück.

```bash
curl http://192.168.1.100:3000/api/media-source/test
```

**Optionaler Query-Parameter:** `?path=/eigener/pfad`

**Beispiel-Antwort:**

```json
{
  "ok": true,
  "path": "/mnt/media",
  "fileCount": 342,
  "imageCount": 310,
  "videoCount": 32,
  "responseTimeMs": 85
}
```

---

## Geocodierung

### GET /api/geocode

Wandelt GPS-Koordinaten (Breitengrad/Längengrad) über Nominatim/OpenStreetMap in einen Ortsnamen um. Ergebnisse werden serverseitig gecacht.

```bash
curl "http://192.168.1.100:3000/api/geocode?lat=48.1351&lon=11.5820"
```

**Pflichtparameter:** `lat`, `lon`

**Beispiel-Antwort:**

```json
{
  "city": "München",
  "state": "Bayern",
  "country": "Deutschland",
  "address": {
    "city": "München",
    "state": "Bayern",
    "country": "Deutschland",
    "postcode": "80331"
  }
}
```

---

## System & Status

### GET /api/status

Gibt Serverversion, Laufzeit, Docker-Flag und aktuelle Fehler zurück.

```bash
curl http://192.168.1.100:3000/api/status
```

**Beispiel-Antwort:**

```json
{
  "version": "1.2.0",
  "uptime": 3724,
  "isDocker": true,
  "recentErrors": []
}
```

| Feld | Beschreibung |
|------|--------------|
| `version` | App-Version (+ Git-SHA bei Docker-Builds) |
| `uptime` | Serverlaufzeit in Sekunden |
| `isDocker` | `true`, wenn im Docker-Container |
| `recentErrors` | Letzte bis zu 20 serverseitige Fehler |

### POST /api/restart

Startet den Serverprozess neu (Docker startet den Container automatisch neu).

```bash
curl -X POST http://192.168.1.100:3000/api/restart
```

### POST /api/stop

Stoppt den Serverprozess (Exit-Code 2, Docker startet **nicht** neu).

```bash
curl -X POST http://192.168.1.100:3000/api/stop
```

---

## Authentifizierung / PIN

Diese Endpunkte werden von der Admin-Oberfläche genutzt. Eine direkte Verwendung ist nur für fortgeschrittene Anwendungsfälle nötig.

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| `GET`   | `/api/auth-status` | Gibt `{ "pinSet": true/false, "requiresPin": true/false }` zurück |
| `POST`  | `/api/login` | Mit PIN authentifizieren. Body: `{ "pin": "1234" }` |
| `POST`  | `/api/logout` | Session beenden |
| `POST`  | `/api/set-pin` | Neuen PIN setzen. Body: `{ "pin": "neupin" }`. Mind. 4 Zeichen, nur Buchstaben und Zahlen. |
| `POST`  | `/api/remove-pin` | PIN-Schutz entfernen. Kein Body erforderlich. |
