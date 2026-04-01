const express = require("express");
const router = express.Router();
const configService = require("../services/configService");
const mediaScanner = require("../services/mediaScanner");
const { version } = require("../../package.json");

const startTime = Date.now();
const recentErrors = [];

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
    const list = mediaScanner.scan(config.media_base_path, subPath, config);
    res.json(list);
  } catch (err) {
    logError("Media-Scan-Fehler: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/status
router.get("/status", (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    version,
    uptime: uptimeSeconds,
    recentErrors: recentErrors.slice(0, 20),
  });
});

// POST /api/restart
router.post("/restart", (req, res) => {
  res.json({ ok: true, message: "Server wird neu gestartet..." });
  setTimeout(() => process.exit(0), 300);
});

module.exports = router;
