/**
 * Geocoding-Service (Reverse Geocoding via Nominatim)
 * - Backend-Proxy: vermeidet CORS, kontrolliert Rate-Limit
 * - Persistenter File-Cache: überlebt Browser-Reload und Server-Neustart
 * - Koordinaten-Rundung auf 3 Dezimalstellen (≈111m) → viele Fotos vom gleichen Ort = 1 Anfrage
 * - Request-Queue: min. 1100ms zwischen Anfragen (Nominatim-Nutzungsrichtlinie)
 * - Einmaliger Retry nach 2s bei Fehler
 * - Negativ-Cache: Koordinaten ohne Ergebnis werden auch gecacht (null)
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const CACHE_PATH = path.join(__dirname, "../../config/geocode_cache.json");
const QUEUE_DELAY_MS = 1100;

let cache = {};
let lastRequestTime = 0;
let requestQueue = Promise.resolve();

// ── Cache laden/speichern ─────────────────────────────────────────────────────
function loadCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    }
  } catch {
    cache = {};
  }
}

function saveCache() {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error("Geocode-Cache konnte nicht gespeichert werden:", e.message);
  }
}

loadCache();

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
function cacheKey(lat, lon) {
  return `${parseFloat(lat).toFixed(3)}_${parseFloat(lon).toFixed(3)}`;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function fetchNominatim(lat, lon) {
  return new Promise((resolve) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const req = https.get(url, { headers: { "User-Agent": "WallPanel-Server/1.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.address ? { address: json.address } : null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function fetchWithRetry(lat, lon) {
  let result = await fetchNominatim(lat, lon);
  if (!result) {
    await delay(2000);
    result = await fetchNominatim(lat, lon);
  }
  return result; // kann null sein → Negativ-Cache
}

// ── Öffentliche API ───────────────────────────────────────────────────────────
async function reverseGeocode(lat, lon) {
  const key = cacheKey(lat, lon);

  // Cache-Treffer (inkl. null = Negativ-Cache)
  if (key in cache) {
    return cache[key];
  }

  // Neue Anfrage in Queue einreihen
  return (requestQueue = requestQueue.then(async () => {
    // Nochmal prüfen – könnte inzwischen von paralleler Anfrage befüllt sein
    if (key in cache) return cache[key];

    const wait = QUEUE_DELAY_MS - (Date.now() - lastRequestTime);
    if (wait > 0) await delay(wait);
    lastRequestTime = Date.now();

    const result = await fetchWithRetry(lat, lon);
    cache[key] = result;
    saveCache();
    return result;
  }));
}

module.exports = { reverseGeocode };
