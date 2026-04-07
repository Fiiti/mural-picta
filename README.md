# MuralPicta – WallPanel Server
<img src="assets/logo.jpg" alt="MuralPicta Logo" width="300">

**A self-hosted image and video slideshow server for wall panels and tablets.**  
Runs entirely on your local network — no cloud, no subscription, no external services required.

---

## Features

### Slideshow
- Full-screen image and video slideshow with configurable display times (separate for images and videos)
- Smooth crossfade transitions with configurable duration
- Ken Burns effect (slow zoom/pan) with configurable zoom factor and random direction
- Playback order: random, by name, or by date
- Progress bar (thin line at the bottom of the screen)
- Automatic media list refresh at a configurable interval (important for random mode with changing folders)
- Recursive file scanning across all subfolders (up to 5 levels deep)
- Image fit modes: `cover`, `contain`, `fill`

### Different Languages
 - Supports de, en, es, fr & it in both the GUI and the help files. 
    - The documentation is available either via the admin interface at `http://<yourwallpanelserver>:3000/admin` 
    - or directly at github `wallpanel_webserver/admin/public/help/xx`.

### Media Sources
- NAS / network drives via SMB or any mounted path (Synology, QNAP, UGREEN, FritzBox, Windows shares, etc.)
- Multiple folders can be mounted side by side under a single base path
- Path override via URL query parameter: `?media_path=2026/Summer`

### Advanced Info Overlay on each picture
- Customisable HTML template displayed over each image
- Variables: filename, date, camera model, GPS coordinates, reverse-geocoded place name
- GPS reverse geocoding via OpenStreetMap / Nominatim (cached, privacy-friendly) — optional; place-name language independently configurable
- Configurable position (bottom-right, bottom-left, top-right, top-left)
- ⚠️ **Privacy note:** This is the only part of the app that contacts the internet — it sends the GPS coordinates stored in the photo's EXIF data to Nominatim. Disable it in the Admin GUI if you need full privacy; the slideshow works without it.

### Touch & Remote Control
- Tap left/right/center: previous / next / pause-resume
- On pause: image is displayed full-frame (`contain` fit, no crop, no zoom)
- **REST API** for remote control from Home Assistant, scripts, or any browser:
  - `GET/POST /api/command/pause` — pause slideshow
  - `GET/POST /api/command/play` — resume slideshow
  - `GET/POST /api/command/blank` — black out the screen
  - `GET/POST /api/command/unblank` — restore the screen
  - `GET/POST /api/command/next` — skip forward
  - `GET/POST /api/command/prev` — go back

### Filter & Exclusion
- Exclude files and folders by regular expression
- Automatic stripping of surrounding `/` in regex patterns (works with or without delimiters)
- Built-in Synology support: `^@` excludes `@eaDir` and other thumbnail folders

### Admin Interface
- Web-based at `/admin` — configure all settings with descriptions in English
- Dark and light theme
- Bilingual (English / German)
- Persistent banner reminds to restart after saving settings
- Heartbeat indicator shows server status live
- Server log viewer for recent errors
- Built-in documentation with API reference, template guide, and more
- Automatic update check via GitHub (shows badge when a new version is available)
- Optional alphanumeric PIN protection (stored as SHA-256 hash)

### Deployment
- Docker with Synology-friendly `PUID`/`PGID` support
- Config stored in a bind-mounted folder (easily editable on the host, e.g. via Synology File Station)
- Direct install without Docker also supported

---

## Quick Start – Docker (Generic / Local)

Suitable for Linux, macOS, Windows or any Docker host where you have direct shell access.

```bash
# 1. Copy and edit the environment file
cp wallpanel_webserver/docker/.env.example wallpanel_webserver/docker/.env

# 2. Edit .env: set MEDIA_PATH and optionally PUID/PGID
#    Example: MEDIA_PATH=/mnt/photos

# 3. Start
cd wallpanel_webserver/docker
docker compose up -d

# 4. Open in browser
#    Slideshow: http://localhost:3000
#    Admin:     http://localhost:3000/admin
```

---

## Quick Start – Docker (Synology NAS)

**Before starting:** create the config folder via Synology File Station:  
`/docker/muralpicta/config`

Then add the following as a new stack in **Synology Container Manager**:

```yaml
services:
  wallpanel:
    image: galseq/mural-picta:latest
    container_name: MuralPicta
    restart: on-failure:5
    ports:
      - "3000:3000"
    volumes:
      - /volume1/docker/muralpicta/config:/app/config:rw
      - /volume1/photo:/data/media:ro
    environment:
      - NODE_ENV=production
      - PORT=3000
      - TZ=Europe/Berlin
    mem_limit: 512m
    cpu_shares: 512
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
```

Adjust `/volume1/photo` to point to your actual photo/video share.  
The slideshow will be available at `http://<NAS-IP>:3000`, the admin at `http://<NAS-IP>:3000/admin`.  
If port 3000 is already in use, change the left side of the port mapping, e.g. `- "3123:3000"`.  
Adjust the timezone (`TZ`) if needed.

To exclude Synology’s internal working folders such as `@eaDir` (normally hidden, but would otherwise appear in the slideshow), add the exclude filter `^@` in **Admin → Filter**. Without it you will see low-resolution thumbnails and images without GPS or capture date.

You can also use the ready-made compose file directly:  
[`wallpanel_webserver/docker/docker-compose.synology.yml`](wallpanel_webserver/docker/docker-compose.synology.yml)

> For a full step-by-step guide with screenshots, see  
> [`assets/synology/How_to_install_on_Synology.md`](assets/synology/How_to_install_on_Synology.md)

## Multiple Media Folders

Mount several NAS shares e. g. for your separte year subfolders side by side:

```yaml
volumes:
  - /volume1/photos/2024:/data/media/2024:ro
  - /volume1/photos/2025:/data/media/2025:ro
  - /volume1/photos/2026:/data/media/2026:ro
```

Set `media_base_path` to `/data/media` in the admin. The scanner finds all files recursively.

## Without Docker

```bash
cd wallpanel_webserver
npm install
npm run build:admin
npm start
```

## Configuration

All settings are managed through the admin interface at `http://localhost:3000/admin`.  
Configuration is stored in `wallpanel_webserver/config/config.json` (not versioned).

## REST API (Remote Control)

All slideshow control commands accept both `GET` (browser-friendly) and `POST` (scripts/HA).

| Endpoint | Description |
|---|---|
| `GET /api/command/state` | Current control state (blank, paused, sequence counters) |
| `GET\|POST /api/command/pause` | Pause slideshow |
| `GET\|POST /api/command/play` | Resume slideshow |
| `GET\|POST /api/command/blank` | Black out screen |
| `GET\|POST /api/command/unblank` | Restore screen |
| `GET\|POST /api/command/next` | Next image/video |
| `GET\|POST /api/command/prev` | Previous image/video |
| `GET /api/status` | Version, uptime, recent errors |
| `GET /api/media/list` | Full media file list |
| `GET /api/config` | Current configuration |
| `POST /api/config` | Save configuration (partial updates supported) |

Full documentation is available in the admin interface under **Docs → API Reference**.

## Documentation

- **Admin → Docs** — built-in documentation (overview, API reference, template guide, filter examples, PIN reset)
- [`assets/synology/How_to_install_on_Synology.md`](assets/synology/How_to_install_on_Synology.md) — step-by-step Synology installation guide
- `wallpanel_webserver/docker/docker-compose.yml` — annotated Docker Compose example

## License

GPL-3.0-only — see [LICENSE](LICENSE)
