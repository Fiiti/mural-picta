const express = require("express");
const cors = require("cors");
const path = require("path");

const apiRouter = require("./routes/api");
const mediaRouter = require("./routes/media");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

// Statische Dateien: Diashow-Frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Admin-Oberfläche unter /admin
app.use("/admin", express.static(path.join(__dirname, "../admin")));

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
  console.log(`WallPanel Server läuft auf http://localhost:${PORT}`);
  console.log(`Admin-Oberfläche: http://localhost:${PORT}/admin`);
});
