# API Reference

MuralPicta provides a simple HTTP REST API. You can use it from any device on the same network — a browser, a smart home system like Home Assistant, a terminal command, or a custom script.

---

## Quick Start Examples

### What you need to know first

Replace `192.168.1.100` with the IP address of the device running MuralPicta, and `3000` with the configured port (default: `3000`).

### Linux / macOS (Terminal)

```bash
# Pause the slideshow
curl -X POST http://192.168.1.100:3000/api/command/pause

# Resume the slideshow
curl -X POST http://192.168.1.100:3000/api/command/play

# Blank the screen (black out)
curl -X POST http://192.168.1.100:3000/api/command/blank

# Restore the screen
curl -X POST http://192.168.1.100:3000/api/command/unblank

# Skip to next image
curl -X POST http://192.168.1.100:3000/api/command/next
```

### Windows (Command Prompt or PowerShell)

```bat
REM Pause the slideshow
curl -X POST http://192.168.1.100:3000/api/command/pause

REM Resume the slideshow
curl -X POST http://192.168.1.100:3000/api/command/play
```

> **Tip:** `curl` is built into Windows 10 and newer. Open **Start → type "cmd" → Enter**, then paste the command.

### Home Assistant (REST command)

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

## Slideshow Control

All control commands return `{ "ok": true }` on success.

> **Note:** The slideshow frontend polls `/api/command/state` every 2 seconds, so commands take effect within 2 seconds.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/command/state` | Returns current control state (see below) |
| `POST` | `/api/command/blank` | Turn the screen black. Slideshow pauses in the background. |
| `POST` | `/api/command/unblank` | Restore the screen. Resumes if it was running. |
| `POST` | `/api/command/pause` | Pause the slideshow on the current image. The image is shown full-frame (no zoom, no crop). |
| `POST` | `/api/command/play` | Resume the slideshow. |
| `POST` | `/api/command/next` | Skip forward one image/video. |
| `POST` | `/api/command/prev` | Go back one image/video. |

### GET /api/command/state — Response

```json
{
  "blank": false,
  "paused": false,
  "nextSeq": 3,
  "prevSeq": 1
}
```

| Field | Type | Description |
|-------|------|-------------|
| `blank` | boolean | `true` = screen is blacked out |
| `paused` | boolean | `true` = slideshow is paused |
| `nextSeq` | number | Counter that increases on each `/next` call |
| `prevSeq` | number | Counter that increases on each `/prev` call |

> **Note:** `nextSeq` and `prevSeq` are sequence numbers. The frontend detects an increase and jumps accordingly. The server state is reset when the server restarts.

---

## Configuration

### GET /api/config

Returns the full configuration as a JSON object.

```bash
curl http://192.168.1.100:3000/api/config
```

### POST /api/config

Saves (partial or full) configuration. Send only the fields you want to change.

```bash
curl -X POST http://192.168.1.100:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"display_time_image": 20}'
```

**Response:** `{ "ok": true }`

> A server restart is required for most config changes to take full effect in the slideshow.

---

## Media

### GET /api/media/list

Returns the list of all media files the server found (images and videos).

```bash
curl http://192.168.1.100:3000/api/media/list
```

**Optional query parameter:**

| Parameter | Description |
|-----------|-------------|
| `subpath` | Subfolder relative to the configured media base path, e.g. `?subpath=2026/Sommer` |

**Response example:**

```json
[
  {
    "filename": "holiday.jpg",
    "url": "/media/2026/holiday.jpg",
    "type": "image",
    "relativePath": "2026/holiday.jpg"
  }
]
```

### GET /api/media-source/test

Tests whether the configured media path is accessible and returns statistics.

```bash
curl http://192.168.1.100:3000/api/media-source/test
```

**Optional query parameter:** `?path=/custom/path`

**Response example:**

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

## Geocoding

### GET /api/geocode

Converts GPS coordinates (latitude/longitude) to a place name using Nominatim / OpenStreetMap. Results are cached on the server.

```bash
curl "http://192.168.1.100:3000/api/geocode?lat=48.1351&lon=11.5820"
```

**Required parameters:** `lat`, `lon`

**Response example:**

```json
{
  "city": "Munich",
  "state": "Bavaria",
  "country": "Germany",
  "address": {
    "city": "Munich",
    "state": "Bavaria",
    "country": "Germany",
    "postcode": "80331"
  }
}
```

---

## System & Status

### GET /api/status

Returns server uptime, version, Docker flag, and recent errors.

```bash
curl http://192.168.1.100:3000/api/status
```

**Response example:**

```json
{
  "version": "1.2.0",
  "uptime": 3724,
  "isDocker": true,
  "recentErrors": []
}
```

| Field | Description |
|-------|-------------|
| `version` | App version (+ git SHA in Docker builds) |
| `uptime` | Server uptime in seconds |
| `isDocker` | `true` if running inside a Docker container |
| `recentErrors` | Last up to 20 server-side errors |

### POST /api/restart

Restarts the server process (Docker will restart the container automatically).

```bash
curl -X POST http://192.168.1.100:3000/api/restart
```

### POST /api/stop

Stops the server process (exit code 2, Docker will **not** restart).

```bash
curl -X POST http://192.168.1.100:3000/api/stop
```

---

## Authentication / PIN

These endpoints are used by the Admin UI. Direct use is only needed for advanced scenarios.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/auth-status` | Returns `{ "pinSet": true/false, "requiresPin": true/false }` |
| `POST` | `/api/login` | Authenticate with PIN. Body: `{ "pin": "1234" }` |
| `POST` | `/api/logout` | End session |
| `POST` | `/api/set-pin` | Set a new PIN. Body: `{ "pin": "newpin" }`. Min. 4 characters, alphanumeric only. |
| `POST` | `/api/remove-pin` | Remove PIN protection. No body required. |
