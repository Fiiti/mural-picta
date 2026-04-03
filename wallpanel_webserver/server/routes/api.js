const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const configService = require("../services/configService");
const mediaScanner = require("../services/mediaScanner");
const geocodeService = require("../services/geocodeService");
const { version } = require("../../package.json");
// Im Docker-Image wird BUILD_SHA vom CI gesetzt → "1.0.0+a3f9c12", lokal bleibt "1.0.0"
const displayVersion = process.env.BUILD_SHA
  ? `${version}+${process.env.BUILD_SHA}`
  : version;
const crypto = require("crypto");

// Einfaches Session-Flag fuer PIN-Authentifizierung (in-memory, reicht fuer lokalen Dienst)
// Fuer persistente Sessions wuerde man express-session benoetigen
const authenticatedSessions = new Set();

const startTime = Date.now();
const recentErrors = [];
const isDocker = require("fs").existsSync("/.dockerenv");

// Fehler global sammeln (max. 50 Einträge)
function logError(msg) {
  recentErrors.unshift({ ts: new Date().toISOString(), msg });
  if (recentErrors.length > 50) recentErrors.pop();
}
global.wallpanelLogError = logError;

// GET /api/config
router.get("/config", (req, res) => {
  res.json(configService.load());
});

// POST /api/config
router.post("/config", express.json(), (req, res) => {
  try {
    const current = configService.load();
    const updated = { ...current, ...req.body };
    configService.save(updated);
    res.json({ ok: true });
  } catch (err) {
    logError("Config-Speicherfehler: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/media/list
router.get("/media/list", (req, res) => {
  const config = configService.load();
  const subPath = req.query.subpath || "";
  try {
    const isCached = !fs.existsSync(config.media_base_path);
    const list = mediaScanner.scanWithFallback(config.media_base_path, subPath, config);
    if (isCached) res.set("X-Media-From-Cache", "true");
    res.json(list);
  } catch (err) {
    logError("Media-Scan-Fehler: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/media-source/test — interaktiver Verbindungstest, kein Produktionsfehler
router.get("/media-source/test", (req, res) => {
  const config = configService.load();
  const testPath = req.query.path || config.media_base_path;
  if (path.normalize(testPath).includes("..")) {
    return res.json({ ok: false, error: "Ungültiger Pfad" });
  }
  if (!fs.existsSync(testPath) || !fs.statSync(testPath).isDirectory()) {
    return res.json({ ok: false, error: "Pfad existiert nicht oder ist kein Verzeichnis", path: testPath });
  }
  const t0 = Date.now();
  try {
    const list = mediaScanner.scan(testPath, "", config);
    const images = list.filter((f) => f.type === "image").length;
    const videos = list.filter((f) => f.type === "video").length;
    res.json({ ok: true, path: testPath, fileCount: list.length, imageCount: images, videoCount: videos, responseTimeMs: Date.now() - t0 });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// GET /api/geocode?lat=X&lon=Y
router.get("/geocode", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: "lat/lon fehlt oder ungültig" });
  }
  try {
    const result = await geocodeService.reverseGeocode(lat, lon);
    res.json(result || {});
  } catch (err) {
    logError("Geocode-Fehler: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/status
router.get("/status", (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    version: displayVersion,
    uptime: uptimeSeconds,
    isDocker,
    recentErrors: recentErrors.slice(0, 20),
  });
});

// POST /api/restart
router.post("/restart", (req, res) => {
  res.json({ ok: true, message: "Server wird neu gestartet..." });
  setTimeout(() => process.exit(0), 300);
});

// POST /api/stop
router.post("/stop", (req, res) => {
  res.json({ ok: true, message: "Server wird gestoppt..." });
  setTimeout(() => process.exit(2), 300);
});

// Hilfsfunktion: PIN hashen (SHA-256, ausreichend fuer Kinderschutz-Zweck)
function hashPin(pin) {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

// GET /api/auth-status — prueft ob PIN aktiv und ob Session authentifiziert ist
router.get("/auth-status", (req, res) => {
  const config = configService.load();
  const pinSet = !!config.admin_pin;
  // Einfaches Session-Cookie-Konzept: IP + User-Agent als Session-Key
  const sessionKey = (req.ip || "") + "|" + (req.headers["user-agent"] || "");
  const isAuthenticated = authenticatedSessions.has(sessionKey);
  res.json({
    pinSet,
    requiresPin: pinSet && !isAuthenticated
  });
});

// POST /api/login — PIN ueberpruefen
router.post("/login", express.json(), (req, res) => {
  const config = configService.load();
  if (!config.admin_pin) {
    return res.json({ ok: true });
  }
  const { pin } = req.body || {};
  if (!pin) return res.status(400).json({ error: "PIN fehlt" });
  const hashed = hashPin(String(pin));
  if (hashed !== config.admin_pin) {
    return res.status(401).json({ error: "Falscher PIN" });
  }
  const sessionKey = (req.ip || "") + "|" + (req.headers["user-agent"] || "");
  authenticatedSessions.add(sessionKey);
  res.json({ ok: true });
});

// POST /api/logout
router.post("/logout", (req, res) => {
  const sessionKey = (req.ip || "") + "|" + (req.headers["user-agent"] || "");
  authenticatedSessions.delete(sessionKey);
  res.json({ ok: true });
});

// POST /api/set-pin — neuen PIN setzen (serverseitig gehasht)
router.post("/set-pin", express.json(), (req, res) => {
  const { pin } = req.body || {};
  if (!pin || String(pin).length < 4) {
    return res.status(400).json({ error: "PIN muss mindestens 4 Zeichen haben" });
  }
  if (!/^[a-zA-Z0-9]+$/.test(String(pin))) {
    return res.status(400).json({ error: "PIN darf nur Buchstaben und Zahlen enthalten" });
  }
  try {
    const config = configService.load();
    config.admin_pin = hashPin(String(pin));
    configService.save(config);
    res.json({ ok: true });
  } catch (err) {
    logError("PIN-Setzen-Fehler: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/remove-pin — PIN-Schutz entfernen
router.post("/remove-pin", (req, res) => {
  try {
    const config = configService.load();
    config.admin_pin = null;
    configService.save(config);
    // Alle Sessions invalidieren, da kein PIN mehr noetig
    authenticatedSessions.clear();
    res.json({ ok: true });
  } catch (err) {
    logError("PIN-Entfernen-Fehler: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
