/**
 * WallPanel Diashow – Kern-Logik
 * Lädt Config + Medienliste vom Backend und steuert den Wechsel inkl. Crossfade und Ken Burns.
 */

// ── Zustand ──────────────────────────────────────────────────────────────────
let config = {};
let mediaList = [];
let mediaIndex = 0;
let activeSlot = "a"; // "a" | "b"
let displayTimer = null;
let progressBarTimer = null;
let mediaListRefreshTimer = null;
let isPaused = false;
let appVersion = "";

// ── Fernsteuerung (API-Polling) ───────────────────────────────────────────────
let lastCmdState = { blank: false, paused: false, nextSeq: 0, prevSeq: 0 };
let cmdPollTimer = null;
// Blank-Screen-Overlay (reines CSS-Schwarz, kein Bild nötig)
const blankOverlay = document.createElement("div");
blankOverlay.style.cssText =
  "display:none;position:fixed;inset:0;background:#000;z-index:9999;";
document.body.appendChild(blankOverlay);

// ── DOM-Referenzen ────────────────────────────────────────────────────────────
const slotA = document.getElementById("slot-a");
const slotB = document.getElementById("slot-b");
const progressBar = document.getElementById("progress-bar");
const debugOverlay = document.getElementById("debug-overlay");
const loadingScreen = document.getElementById("loading");

// Info-Position aus Config – wird beim Erstellen jedes Slot-Info-Divs gesetzt
let infoPosition = "bottom-right";

// ── Initialisierung ───────────────────────────────────────────────────────────
async function init() {
  try {
    config = await fetchConfig();

    // App-Version einmalig laden
    try {
      const statusRes = await fetch("/api/status");
      if (statusRes.ok) appVersion = (await statusRes.json()).version || "";
    } catch {}

    applyCssVariables();

    // Query-Parameter auswerten: ?media_path=2026/Sommer
    const params = new URLSearchParams(window.location.search);
    const mediaPath = params.get("media_path") || "";

    await loadMediaList(mediaPath);

    if (mediaList.length === 0) {
      showLoading("Keine Mediendateien gefunden. Bitte Pfad in /admin konfigurieren.");
      return;
    }

    hideLoading();
    showNextMedia(true);
    scheduleMediaListRefresh(mediaPath);

    // Fernsteuerungs-Polling starten
    cmdPollTimer = setInterval(pollCommandState, 2000);
  } catch (err) {
    showLoading("Fehler beim Starten: " + err.message);
    console.error(err);
  }
}

// ── Config + Medienliste laden ────────────────────────────────────────────────
async function fetchConfig() {
  const res = await fetch("/api/config");
  if (!res.ok) throw new Error("Config-Ladefehler: " + res.status);
  return res.json();
}

async function loadMediaList(subPath) {
  const url = "/api/media/list" + (subPath ? "?subpath=" + encodeURIComponent(subPath) : "");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Medienlisten-Ladefehler: " + res.status);
  mediaList = await res.json();
  mediaIndex = 0;
}

function scheduleMediaListRefresh(subPath) {
  if (mediaListRefreshTimer) clearInterval(mediaListRefreshTimer);
  const intervalMs = (config.media_list_update_interval || 600) * 1000;
  mediaListRefreshTimer = setInterval(async () => {
    await loadMediaList(subPath);
  }, intervalMs);
}

// ── CSS-Variablen aus Config setzen ──────────────────────────────────────────
function applyCssVariables() {
  const crossfadeMs = Math.round((config.crossfade_time || 3) * 1000);
  document.documentElement.style.setProperty("--crossfade-ms", crossfadeMs + "ms");
  document.documentElement.style.setProperty("--image-fit", config.image_fit || "cover");
  document.documentElement.style.setProperty("--kb-zoom", config.ken_burns_zoom || 1.3);

  // Info-Position für spätere Slot-Erstellung merken
  infoPosition = "pos-" + (config.info_position || "bottom-right");
}

// ── Medien-Wechsel ────────────────────────────────────────────────────────────
function showNextMedia(isFirst = false) {
  if (mediaList.length === 0) return;

  const item = mediaList[mediaIndex % mediaList.length];
  mediaIndex = (mediaIndex + 1) % mediaList.length;

  const inactiveSlot = activeSlot === "a" ? "b" : "a";
  const inactiveEl = inactiveSlot === "a" ? slotA : slotB;
  const activeEl = activeSlot === "a" ? slotA : slotB;

  // Neues Medienelement in den inaktiven Slot laden
  loadMediaIntoSlot(inactiveEl, item, () => {
    // Crossfade: inaktiver Slot wird aktiv
    activeEl.classList.remove("active");
    inactiveEl.classList.add("active");
    activeSlot = inactiveSlot;

    // ITemp in den neuen Slot laden – fadert automatisch mit dem Slot mit
    loadAndDisplayOverlays(item, inactiveEl);

    // Ken Burns starten
    if (config.ken_burns_enabled && item.type === "image") {
      const mediaEl = inactiveEl.querySelector("img, video");
      if (mediaEl) {
        const displayTime = (item.type === "image" ? config.display_time_image : config.display_time_video) || 15;
        const kbDuration = displayTime + (config.crossfade_time || 3) * 2;
        startKenBurns(mediaEl, config.ken_burns_zoom || 1.3, kbDuration);
      }
    }

    // Fortschrittsbalken sofort beim Crossfade-Start auf 0% setzen.
    // Läuft genau display_time Sekunden → erreicht 100% wenn das nächste Bild beginnt.
    if (config.show_progress_bar) {
      if (progressBarTimer) clearTimeout(progressBarTimer);
      restartProgressBar(item);
    }

    // Timer für nächstes Medium
    const displayMs = getDisplayTimeMs(item);
    if (displayTimer) clearTimeout(displayTimer);
    if (!isPaused) {
      displayTimer = setTimeout(() => showNextMedia(), displayMs);
    }
  });
}

// ── Overlays (Info + Debug) ───────────────────────────────────────────────────
// slotEl = der Slot, der gerade aktiv wurde. Das ITemp wird in dessen .slot-info
// geschrieben und fadert automatisch mit dem Slot-opacity mit.
async function loadAndDisplayOverlays(item, slotEl) {
  const infoEl = slotEl ? slotEl.querySelector(".slot-info") : null;
  const needsInfo = (config.show_image_info && config.image_info_template) || config.debug_mode;

  if (debugOverlay) debugOverlay.style.display = "none";

  if (!needsInfo) {
    if (infoEl) infoEl.innerHTML = "";
    return;
  }

  try {
    const mediaInfo = await getMediaInfo(item, config.fetch_address_data || false);

    // Info in den Slot schreiben (fadert mit Bild mit)
    if (infoEl && config.show_image_info && config.image_info_template) {
      infoEl.innerHTML = renderTemplate(config.image_info_template, mediaInfo);
    } else if (infoEl) {
      infoEl.innerHTML = "";
    }

    // Debug-Overlay bleibt global (Entwicklerwerkzeug)
    if (config.debug_mode && debugOverlay) {
      debugOverlay.innerHTML = buildDebugHtml(item, mediaInfo);
      debugOverlay.style.display = "block";
    }
  } catch (e) {
    console.warn("Overlay-Fehler:", e);
  }
}

function buildDebugHtml(item, mediaInfo) {
  const row = (label, val) =>
    val != null && val !== "" && val !== "-"
      ? `<tr><td>${label}&nbsp;</td><td>${val}</td></tr>`
      : "";

  const addrRows = mediaInfo.address
    ? ["country","state","county","municipality","city","town","village","road","postcode"]
        .filter(k => mediaInfo.address[k])
        .map(k => row(`addr.${k}`, mediaInfo.address[k]))
        .join("")
    : row("addr", "-");

  return `<table>
    ${row("MuralPicta", `v${appVersion}`)}
    ${row("Datei", mediaInfo.filename || item.filename)}
    ${row("Pfad", mediaInfo.relativePath || item.relativePath || "-")}
    ${row("Typ", item.type)}
    ${mediaInfo.latitude != null
      ? row("GPS", `${mediaInfo.latitude.toFixed(5)}, ${mediaInfo.longitude.toFixed(5)}`)
      : row("GPS", "–")}
    ${mediaInfo.DateTimeOriginal
      ? row("Datum", mediaInfo.DateTimeOriginal instanceof Date
          ? mediaInfo.DateTimeOriginal.toLocaleString()
          : mediaInfo.DateTimeOriginal)
      : ""}
    ${mediaInfo.Make  ? row("Kamera", [mediaInfo.Make, mediaInfo.Model].filter(Boolean).join(" ")) : ""}
    ${addrRows}
  </table>`;
}

function getDisplayTimeMs(item) {
  const seconds = item.type === "video"
    ? (config.display_time_video || 15)
    : (config.display_time_image || 15);
  return seconds * 1000;
}

function loadMediaIntoSlot(slotEl, item, onReady) {
  // Alten Inhalt entfernen
  slotEl.innerHTML = "";

  // Pro-Slot Info-Overlay erzeugen (fadert mit dem Slot mit)
  const infoEl = document.createElement("div");
  infoEl.className = "slot-info " + infoPosition;
  slotEl.appendChild(infoEl);

  if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.filename;
    img.onload = onReady;
    img.onerror = () => {
      console.warn("Bild konnte nicht geladen werden:", item.url);
      onReady(); // Trotzdem wechseln
    };
    slotEl.appendChild(img);
  } else if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.url;
    video.muted = true;
    video.volume = config.video_volume || 0;
    video.loop = config.video_loop || false;
    video.autoplay = true;
    video.playsInline = true;
    video.oncanplay = onReady;
    video.onerror = () => {
      console.warn("Video konnte nicht geladen werden:", item.url);
      onReady();
    };
    slotEl.appendChild(video);
  }
}

// ── Fortschrittsbalken ────────────────────────────────────────────────────────
// Transition statt CSS-Animation: sofort auf 0% setzen (ohne Übergang),
// dann Übergangs-Dauer setzen und auf 100% fahren.
function restartProgressBar(item) {
  // Dauer = Anzeigezeit. Zusammen mit dem verzögerten Start (um crossfade_time)
  // endet der Balken exakt wenn das nächste Bild vollständig sichtbar ist.
  const seconds = getDisplayTimeMs(item) / 1000;
  // Schritt 1: Transition deaktivieren und auf 0 zurücksetzen
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";
  // Schritt 2: Reflow erzwingen, damit der Browser den Reset verarbeitet
  void progressBar.offsetWidth;
  // Schritt 3: Transition aktivieren und auf 100% fahren
  progressBar.style.transition = `width ${seconds}s linear`;
  progressBar.style.width = "100%";
}

// ── Ladebildschirm ────────────────────────────────────────────────────────────
function showLoading(msg) {
  loadingScreen.textContent = msg || "Lädt...";
  loadingScreen.classList.remove("hidden");
}

function hideLoading() {
  loadingScreen.classList.add("hidden");
}

// ── Pause / Play ─────────────────────────────────────────────────────────────
function doPause() {
  if (isPaused) return;
  isPaused = true;
  if (displayTimer) clearTimeout(displayTimer);
  // Fortschrittsbalken einfrieren
  const currentWidth = getComputedStyle(progressBar).width;
  progressBar.style.transition = "none";
  progressBar.style.width = currentWidth;
  // Aktuelles Bild: Ken Burns stoppen + Vollbild-Fit (object-fit: contain)
  const activeEl = activeSlot === "a" ? slotA : slotB;
  const mediaEl = activeEl ? activeEl.querySelector("img, video") : null;
  if (mediaEl) {
    stopKenBurns(mediaEl);
    mediaEl.style.objectFit = "contain";
  }
}

function doPlay() {
  if (!isPaused) return;
  isPaused = false;
  // Inline-Override zurücksetzen
  const activeEl = activeSlot === "a" ? slotA : slotB;
  const mediaEl = activeEl ? activeEl.querySelector("img, video") : null;
  if (mediaEl) mediaEl.style.objectFit = "";
  showNextMedia();
}

// ── Touch-Interaktion ─────────────────────────────────────────────────────────
document.addEventListener("click", (e) => {
  const w = window.innerWidth;
  const x = e.clientX;
  if (x < w * 0.3) {
    // Links: zurück
    mediaIndex = (mediaIndex - 2 + mediaList.length) % mediaList.length;
    if (displayTimer) clearTimeout(displayTimer);
    showNextMedia();
  } else if (x > w * 0.7) {
    // Rechts: vor
    if (displayTimer) clearTimeout(displayTimer);
    showNextMedia();
  } else {
    // Mitte: Pause / Weiter
    if (!isPaused) doPause();
    else doPlay();
  }
});

// ── API-Fernsteuerung (Polling alle 2 s) ──────────────────────────────────────
async function pollCommandState() {
  try {
    const res = await fetch("/api/command/state");
    if (!res.ok) return;
    const state = await res.json();

    // Blank-Screen
    blankOverlay.style.display = state.blank ? "block" : "none";

    // Pause / Play: nur auf Änderungen im Server-State reagieren,
    // damit lokaler Tap-Pause nicht vom Polling überschrieben wird
    if (state.paused !== lastCmdState.paused) {
      if (state.paused) doPause();
      else doPlay();
    }

    // Vor (one-shot via Sequenznummer)
    if (state.nextSeq > lastCmdState.nextSeq) {
      lastCmdState.nextSeq = state.nextSeq;
      if (displayTimer) clearTimeout(displayTimer);
      showNextMedia();
    }
    // Zurück
    if (state.prevSeq > lastCmdState.prevSeq) {
      lastCmdState.prevSeq = state.prevSeq;
      mediaIndex = (mediaIndex - 2 + mediaList.length) % mediaList.length;
      if (displayTimer) clearTimeout(displayTimer);
      showNextMedia();
    }

    lastCmdState = { ...state };
  } catch {}
}

// ── Start ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);
