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
let mediaListRefreshTimer = null;
let isPaused = false;

// ── DOM-Referenzen ────────────────────────────────────────────────────────────
const slotA = document.getElementById("slot-a");
const slotB = document.getElementById("slot-b");
const progressBar = document.getElementById("progress-bar");
const infoOverlay = document.getElementById("info-overlay");
const loadingScreen = document.getElementById("loading");

// ── Initialisierung ───────────────────────────────────────────────────────────
async function init() {
  try {
    config = await fetchConfig();
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

  // Info-Overlay Position
  if (config.info_position) {
    infoOverlay.className = "pos-" + config.info_position;
  } else {
    infoOverlay.className = "pos-bottom-right";
  }
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

    // Ken Burns starten
    if (config.ken_burns_enabled && item.type === "image") {
      const mediaEl = inactiveEl.querySelector("img, video");
      if (mediaEl) {
        const displayTime = (item.type === "image" ? config.display_time_image : config.display_time_video) || 15;
        const kbDuration = displayTime + (config.crossfade_time || 3) * 2;
        startKenBurns(mediaEl, config.ken_burns_zoom || 1.3, kbDuration);
      }
    }

    // Fortschrittsbalken neu starten
    if (config.show_progress_bar) {
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

function getDisplayTimeMs(item) {
  const seconds = item.type === "video"
    ? (config.display_time_video || 15)
    : (config.display_time_image || 15);
  return seconds * 1000;
}

function loadMediaIntoSlot(slotEl, item, onReady) {
  // Alten Inhalt entfernen
  slotEl.innerHTML = "";

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

// ── Touch-Interaktion (einfach für M1) ───────────────────────────────────────
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
    isPaused = !isPaused;
    if (!isPaused) {
      showNextMedia();
    } else {
      if (displayTimer) clearTimeout(displayTimer);
      // Transition einfrieren: aktuelle Breite festhalten
      const currentWidth = getComputedStyle(progressBar).width;
      progressBar.style.transition = "none";
      progressBar.style.width = currentWidth;
    }
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);
