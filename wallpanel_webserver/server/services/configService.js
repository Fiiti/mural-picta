const fs = require("fs");
const path = require("path");

const DEFAULT_CONFIG_PATH = path.join(__dirname, "../config/default.json");
const USER_CONFIG_PATH = path.join(__dirname, "../../config/config.json");

let _defaults = null;

function getDefaults() {
  if (!_defaults) {
    _defaults = JSON.parse(fs.readFileSync(DEFAULT_CONFIG_PATH, "utf8"));
  }
  return _defaults;
}

function load() {
  const defaults = getDefaults();
  if (!fs.existsSync(USER_CONFIG_PATH)) {
    return { ...defaults };
  }
  try {
    const user = JSON.parse(fs.readFileSync(USER_CONFIG_PATH, "utf8"));
    return { ...defaults, ...user };
  } catch (err) {
    console.error("Fehler beim Laden der Konfiguration:", err.message);
    return { ...defaults };
  }
}

function save(config) {
  const dir = path.dirname(USER_CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // Nur die Felder speichern, die von den Defaults abweichen
  const defaults = getDefaults();
  const delta = {};
  for (const key of Object.keys(config)) {
    if (JSON.stringify(config[key]) !== JSON.stringify(defaults[key])) {
      delta[key] = config[key];
    }
  }
  fs.writeFileSync(USER_CONFIG_PATH, JSON.stringify(delta, null, 2), "utf8");
}

module.exports = { load, save };
