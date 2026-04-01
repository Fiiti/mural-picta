/**
 * Info-Template-Renderer
 *
 * Ersetzt ${...}-Platzhalter in einem HTML-Template-String mit Werten aus einem Datenobjekt.
 *
 * Syntax:
 *   ${key}                    – einfacher Wert
 *   ${key1|key2|key3}         – Fallback-Kette: erstes nicht-leeres Feld wird verwendet
 *   ${key!prefix=Text}        – Prefix, nur wenn Wert vorhanden
 *   ${key!suffix=Text}        – Suffix, nur wenn Wert vorhanden
 *   ${key!options=year:numeric,month:long,day:2-digit}
 *                             – Datumsformatierung via Intl.DateTimeFormat
 *
 * Modifier können kombiniert werden:
 *   ${address.town|address.city!prefix=📍 !suffix=<br>}
 *
 * Fehlende oder leere Werte werden durch "" ersetzt (kein Fehler).
 * Verschachtelte Pfade via Punkt: ${address.town}
 */

/**
 * Gibt den Wert eines verschachtelten Pfads aus einem Objekt zurück.
 * @param {Object} obj
 * @param {string} path  z. B. "address.town"
 * @returns {*} Wert oder null
 */
function deepGet(obj, path) {
  return path.trim().split(".").reduce((acc, key) => {
    if (acc == null) return null;
    return acc[key] ?? null;
  }, obj);
}

/**
 * Formatiert einen Wert für die Anzeige.
 * Dates werden via Intl.DateTimeFormat formatiert, wenn optionsStr angegeben.
 * @param {*}      val
 * @param {string} [optionsStr]  z. B. "year:numeric,month:long"
 * @returns {string}
 */
function formatValue(val, optionsStr) {
  if (val instanceof Date) {
    if (optionsStr) {
      const opts = {};
      optionsStr.split(",").forEach((pair) => {
        const colonIdx = pair.indexOf(":");
        if (colonIdx !== -1) {
          opts[pair.slice(0, colonIdx).trim()] = pair.slice(colonIdx + 1).trim();
        }
      });
      try {
        return new Intl.DateTimeFormat(navigator.language || "de-DE", opts).format(val);
      } catch {
        return val.toLocaleDateString(navigator.language || "de-DE");
      }
    }
    return val.toLocaleDateString(navigator.language || "de-DE");
  }
  return String(val);
}

/**
 * Rendert einen Template-String mit Werten aus data.
 * @param {string} template  HTML-String mit ${...}-Platzhaltern
 * @param {Object} data      Datenobjekt (z. B. aus getMediaInfo())
 * @returns {string}         Fertig gerendeter HTML-String
 */
function renderTemplate(template, data) {
  if (!template) return "";
  return template.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    // Aufsplitten bei '!' für Modifier
    const bangParts = expr.split("!");
    const keyPart = bangParts[0];

    // Modifier parsen: prefix=, suffix=, options=
    const mods = {};
    for (let i = 1; i < bangParts.length; i++) {
      const eqIdx = bangParts[i].indexOf("=");
      if (eqIdx !== -1) {
        mods[bangParts[i].slice(0, eqIdx)] = bangParts[i].slice(eqIdx + 1);
      }
    }

    // Fallback-Kette auflösen
    const keys = keyPart.split("|");
    let value = null;
    for (const k of keys) {
      const v = deepGet(data, k);
      if (v != null && v !== "") {
        value = v;
        break;
      }
    }

    if (value == null) return "";

    const formatted = formatValue(value, mods.options);
    if (!formatted) return "";

    return (mods.prefix || "") + formatted + (mods.suffix || "");
  });
}
