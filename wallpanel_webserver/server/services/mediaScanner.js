const fs = require("fs");
const path = require("path");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".mkv", ".webm", ".avi"]);
const MAX_DEPTH = 5;

/**
 * Scannt ein Verzeichnis rekursiv (max. MAX_DEPTH Ebenen) nach Mediendateien.
 * @param {string} basePath  - Wurzelpfad des Scans
 * @param {string} subPath   - Optionaler Unterpfad relativ zu basePath
 * @param {object} config    - Aktuelle Konfiguration
 * @returns {Array<{url, type, filename, relativePath}>}
 */
function scan(basePath, subPath, config) {
  const scanRoot = subPath
    ? path.resolve(basePath, subPath)
    : path.resolve(basePath);

  // Sicherheitscheck: scanRoot muss innerhalb von basePath liegen
  if (!scanRoot.startsWith(path.resolve(basePath))) {
    throw new Error("Ungültiger Unterpfad – Path-Traversal-Versuch erkannt");
  }

  if (!fs.existsSync(scanRoot)) {
    return [];
  }

  // Regex-Slashes entfernen falls User /pattern/ eingibt (JS-Schreibweise)
  const stripSlashes = (p) => p.replace(/^\/|\/$/g, "");
  const excludePatterns = (config.exclude_filenames || []).map((p) => new RegExp(stripSlashes(p)));
  const excludeFolderPatterns = (config.exclude_folders || []).map((p) => new RegExp(stripSlashes(p)));
  const results = [];

  function walk(dir, depth) {
    if (depth > MAX_DEPTH) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(scanRoot, fullPath);

      // Ausschluss-Regex prüfen
      if (excludePatterns.some((rx) => rx.test(relativePath))) continue;

      if (entry.isDirectory()) {
        // Ordner-Ausschluss: trifft nur auf den Ordnernamen (nicht den vollen Pfad)
        if (excludeFolderPatterns.some((rx) => rx.test(entry.name))) continue;
        walk(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        let type = null;
        if (IMAGE_EXTENSIONS.has(ext)) type = "image";
        else if (VIDEO_EXTENSIONS.has(ext)) type = "video";
        if (!type) continue;

        // Medientyp-Ausschluss aus Config
        if ((config.exclude_media_types || []).includes(type)) continue;

        results.push({
          // URL-Pfad für den /media/ Endpunkt (immer relativ zu basePath)
          url: "/media/" + path.relative(basePath, fullPath).split(path.sep).join("/"),
          type,
          filename: entry.name,
          relativePath: relativePath.split(path.sep).join("/"),
        });
      }
    }
  }

  walk(scanRoot, 1);

  // Sortierung
  const order = config.media_order || "random";
  if (order === "random") {
    // Fisher-Yates Shuffle
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [results[i], results[j]] = [results[j], results[i]];
    }
  } else if (order === "name") {
    results.sort((a, b) => a.filename.localeCompare(b.filename));
  } else if (order === "date") {
    results.sort((a, b) => {
      try {
        const statA = fs.statSync(path.join(basePath, a.relativePath));
        const statB = fs.statSync(path.join(basePath, b.relativePath));
        return statA.mtimeMs - statB.mtimeMs;
      } catch {
        return 0;
      }
    });
  }

  return results;
}

// In-Memory-Fallback für den letzten erfolgreichen Scan
let _lastSuccessfulCache = null; // { key, results, ts }

/**
 * Wie scan(), aber bei Fehler wird der letzte bekannte Stand zurückgegeben.
 * Path-Traversal-Fehler werden weiterhin geworfen (kein Fallback).
 */
function scanWithFallback(basePath, subPath, config) {
  const key = basePath + "|" + (subPath || "");
  try {
    const results = scan(basePath, subPath, config);
    _lastSuccessfulCache = { key, results, ts: Date.now() };
    return results;
  } catch (err) {
    if (err.message && err.message.includes("Path-Traversal")) throw err;
    if (global.wallpanelLogError)
      global.wallpanelLogError("Scan fehlgeschlagen (Fallback aktiv): " + err.message);
    console.error("[mediaScanner] Scan-Fehler:", err.message);
    return _lastSuccessfulCache?.key === key ? _lastSuccessfulCache.results : [];
  }
}

module.exports = { scan, scanWithFallback };
