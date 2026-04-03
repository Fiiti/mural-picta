const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const apiRouter = require("./routes/api");
const mediaRouter = require("./routes/media");
const configService = require("./services/configService");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

// Statische Dateien: Diashow-Frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Admin-Oberfläche unter /admin (Vite-Build aus admin/dist/)
const adminDistPath = path.join(__dirname, "../admin/dist");
app.use("/admin", express.static(adminDistPath));
// SPA-Fallback: alle /admin/* Routen liefern index.html
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});

// Vendor-Bibliotheken aus node_modules mit korrektem Content-Type
app.get("/vendor/exifr.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.sendFile(path.join(__dirname, "../node_modules/exifr/dist/full.umd.js"));
});

// API-Routen
app.use("/api", apiRouter);

// Mediendateien-Serving
app.use("/media", mediaRouter);

// Diashow ist die Root-Seite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Nicht gefundene Routen
app.use((req, res) => {
  res.status(404).json({ error: "Route nicht gefunden" });
});

// Fehlerbehandlung
app.use((err, req, res, _next) => {
  if (global.wallpanelLogError) global.wallpanelLogError(err.message);
  console.error("Server-Fehler:", err);
  res.status(500).json({ error: "Interner Server-Fehler" });
});

app.listen(PORT, () => {
  const isDocker = fs.existsSync("/.dockerenv");
  const configPath = path.resolve(__dirname, "../config");
  const mediaPath  = configService.load().media_base_path || "/data/media";

  console.log("=".repeat(55));
  console.log("  MuralPicta WallPanel Server");
  console.log("=".repeat(55));
  console.log(`  URL:        http://localhost:${PORT}`);
  console.log(`  Admin:      http://localhost:${PORT}/admin`);
  console.log(`  Umgebung:   ${isDocker ? "Docker" : "Direkt (npm start)"}`);
  console.log(`  Node-User:  uid=${process.getuid?.() ?? "?"} gid=${process.getgid?.() ?? "?"}`);
  console.log("-".repeat(55));

  // Config-Pfad prüfen
  const configFile = path.join(configPath, "config.json");
  const configExists = fs.existsSync(configFile);
  console.log(`  Config-Pfad:  ${configPath}`);
  console.log(`  config.json:  ${configExists ? "gefunden ✓" : "NICHT gefunden – wird beim ersten Start erzeugt"}`);

  // Medienpfad prüfen
  const mediaExists = fs.existsSync(mediaPath);
  let mediaInfo = isDocker ? "NICHT vorhanden ✗ – Volume gemountet?" : "NICHT vorhanden ✗ – Pfad in Admin → Media Source prüfen";
  if (mediaExists) {
    try {
      const entries = fs.readdirSync(mediaPath);
      mediaInfo = `vorhanden ✓ (${entries.length} Einträge sichtbar)`;
    } catch (e) {
      mediaInfo = `vorhanden, aber kein Lesezugriff ✗ (${e.code}) – PUID/PGID prüfen!`;
    }
  }
  console.log(`  Medienpfad:   ${mediaPath} → ${mediaInfo}`);
  console.log("=".repeat(55));
});
