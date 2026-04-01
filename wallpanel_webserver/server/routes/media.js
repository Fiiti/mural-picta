const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const configService = require("../services/configService");

// GET /media/:filePath*
// Liefert Mediendateien sicher aus dem konfigurierten Basispfad aus.
router.get("/*", (req, res) => {
  const config = configService.load();
  const basePath = path.resolve(config.media_base_path);

  // req.params[0] enthält alles nach /media/
  const requestedPath = req.params[0] || "";
  const filePath = path.resolve(basePath, requestedPath);

  // Path-Traversal-Schutz
  if (!filePath.startsWith(basePath + path.sep) && filePath !== basePath) {
    return res.status(403).json({ error: "Zugriff verweigert" });
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return res.status(404).json({ error: "Datei nicht gefunden" });
  }

  res.sendFile(filePath);
});

module.exports = router;
