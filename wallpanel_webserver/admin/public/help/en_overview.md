# MuralPicta – Overview

**MuralPicta** is a self-hosted slideshow server for wall panels, tablets, and displays. It runs entirely on your local network — no cloud, no subscription, no external services required. Once installed, it works completely offline (except for the optional GPS place name lookup).

Typical use case: a tablet or screen mounted on the wall shows a continuous, beautiful slideshow of your own photos and videos, sourced directly from your NAS (Synology, QNAP, etc.) or any shared network folder.

---

## First Steps

1. **Media Source** — configure where your photos and videos are stored (NAS path or network share)
2. **Slideshow** — set display times, order, and crossfade
3. Open the slideshow at **`http://<your-server-ip>:3000`** in any browser

Everything else is optional and can be adjusted at any time.

---

## Settings Overview

### Media Source
Defines where MuralPicta looks for images and videos. This is the most important setting.

- **Media Base Path** — the local path to the folder (e.g. `/mnt/nas/photos` or a Docker bind mount)
- **Supported sources:** mounted network drives (SMB/NAS), local folders
- A **Test** button checks the path and shows how many files were found

→ *See the "Media Sources" documentation for NAS setup and Docker volume configuration.*

---

### Slideshow
Controls the core slideshow behaviour.

- **Image display time** — how long each photo is shown (seconds)
- **Video display time** — how long each video plays before the next starts
- **Order** — random, by name, or by date
- **Crossfade duration** — transition time between slides (seconds)
- **Media list refresh interval** — how often the file list is reloaded (minutes); important for random mode so new files are picked up

---

### Ken Burns Effect
Adds a slow, cinematic zoom-and-pan animation to images while they are displayed.

- **Enable/Disable** — toggle the effect
- **Zoom factor** — how far in the image zooms (e.g. 1.3 = 30% zoom)
- The pan direction is chosen randomly per image for a natural feel

---

### Info Overlay
Displays information about the current photo/video on top of the image — like a caption.

- **Enable/Disable** — toggle the overlay
- **Position** — bottom-right, bottom-left, top-right, top-left
- **Template** — fully customisable HTML template; can show filename, date, GPS location, camera model, and more
- **Fetch GPS location** — resolves GPS coordinates from photo EXIF data to a place name (uses OpenStreetMap / Nominatim)

→ *See the "Info Template" documentation for all available template variables and examples.*

---

### Video
Settings specific to video playback.

- **Volume** — default playback volume (0 = muted, 1 = full)
- **Loop** — whether a video restarts when it ends (before the display time is up)

---

### Display
Visual settings for the slideshow.

- **Image fit** — how images fill the screen: `cover` (fill, may crop), `contain` (full image, may have borders), `fill` (stretch)
- **Show progress bar** — thin progress line at the bottom of the screen
- **Background color** — visible when using `contain` fit with borders

---

### Filter / Exclude
Defines which files and folders should be **excluded** from the slideshow.

- **Exclude filenames** — regular expressions matched against the filename
- **Exclude folders** — regular expressions matched against folder names (e.g. `^@` to skip Synology thumbnail folders)

→ *See the "Filter / Exclude" documentation for regex examples and tips.*

---

### Debug
Developer options — only needed for troubleshooting.

- **Debug mode** — shows an information overlay with EXIF data and file details on every image

---

### Security / PIN
Protects the Admin interface with a PIN code.

- **Enable/Disable** PIN protection
- Minimum 4 characters, alphanumeric
- The slideshow (`/`) is always accessible without PIN

→ *See the "PIN Reset" documentation if you have forgotten your PIN.*

---

### System & Status
Shows server information and controls.

- **Version** — current MuralPicta version
- **Uptime** — how long the server has been running
- **Open Slideshow** — opens the slideshow in a new browser tab
- **View Log** — shows recent server errors
- **Stop Server** — stops the server process (not available in Docker; use `docker stop` instead)

---

## Remote Control via API

MuralPicta has a built-in HTTP API that lets you control the slideshow remotely — from Home Assistant, a script, or any browser.

Example: `http://<server-ip>:3000/api/command/pause`

→ *See the "API Reference" documentation for all available commands and examples.*
