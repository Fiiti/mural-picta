/**
 * EXIF-Auslesen + Reverse Geocoding
 * Verwendet exifr (via CDN UMD, window.exifr) für EXIF-Daten.
 * GPS-Koordinaten werden als Dezimalgrad zurückgeliefert (exifr konvertiert automatisch).
 * Geocoding läuft über den Backend-Proxy /api/geocode (Rate-Limit + Cache serverseitig).
 */

/**
 * Liest EXIF-Daten eines Bildes aus.
 * @param {string} imageUrl
 * @returns {Promise<Object>} EXIF-Felder, z. B. { DateTimeOriginal, latitude, longitude, ... }
 */
async function extractExif(imageUrl) {
  if (typeof exifr === "undefined") return {};
  try {
    const data = await exifr.parse(imageUrl, { gps: true, tiff: true, exif: true }) || {};
    return data;
  } catch (e) {
    console.warn("EXIF-Fehler für", imageUrl, e.message);
    return {};
  }
}

/**
 * Datum aus GPS-Tags rekonstruieren (GPSDateStamp + GPSTimeStamp).
 * Panorama-Stitcher behalten oft nur diese Tags.
 */
function dateFromGps(exifData) {
  if (!exifData.GPSDateStamp) return null;
  const d = exifData.GPSDateStamp.replace(/:/g, "-"); // "2025:05:28" → "2025-05-28"
  if (exifData.GPSTimeStamp) {
    const t = exifData.GPSTimeStamp; // [h, m, s] (Dezimal möglich)
    const h = String(Math.floor(t[0])).padStart(2, "0");
    const m = String(Math.floor(t[1])).padStart(2, "0");
    const s = String(Math.floor(t[2])).padStart(2, "0");
    return new Date(`${d}T${h}:${m}:${s}Z`);
  }
  return new Date(`${d}T00:00:00Z`);
}

/**
 * Datum aus Dateinamen parsen – letzter Fallback.
 * Unterstützt: IMG_20250528_114447.jpg und photo_2026-01-06_15-18-06.jpg
 */
function dateFromFilename(filename) {
  if (!filename) return null;
  // YYYYMMDD_HHMMSS (z.B. IMG_20250528_114447709.jpg)
  const m1 = filename.match(/(\d{4})(\d{2})(\d{2})[_-](\d{2})(\d{2})(\d{2})/);
  if (m1) return new Date(`${m1[1]}-${m1[2]}-${m1[3]}T${m1[4]}:${m1[5]}:${m1[6]}`);
  // YYYY-MM-DD_HH-MM-SS (z.B. photo_2026-01-06_15-18-06.jpg)
  const m2 = filename.match(/(\d{4})-(\d{2})-(\d{2})[_-](\d{2})-(\d{2})-(\d{2})/);
  if (m2) return new Date(`${m2[1]}-${m2[2]}-${m2[3]}T${m2[4]}:${m2[5]}:${m2[6]}`);
  return null;
}

/**
 * Sammelt alle Anzeige-Informationen zu einem Medienelement.
 * Bei Bildern: EXIF auslesen, optional GPS → Ortsname.
 * @param {Object} item            - Medieobjekt { url, type, filename, ... }
 * @param {boolean} fetchAddress   - GPS-Daten via /api/geocode auflösen?
 * @param {string}  geocodingLang - Sprache für Ortsnamen (z.B. "de", "en", "fr")
 * @returns {Promise<Object>} Datenobjekt für template.js
 */
async function getMediaInfo(item, fetchAddress = false, geocodingLang = "en") {
  const info = {
    filename: item.filename,
    relativePath: item.relativePath || "",
  };

  if (item.type !== "image") return info;

  const exifData = await extractExif(item.url);

  // Datum: Fallback-Kette – Panorama-Stitcher und manche Kameras entfernen DateTimeOriginal
  const dateValue = exifData.DateTimeOriginal
    || exifData.DateTime
    || exifData.CreateDate
    || dateFromFilename(item.filename)
    || dateFromGps(exifData);
  if (dateValue) info.DateTimeOriginal = dateValue;

  if (exifData.Make)  info.Make  = exifData.Make;
  if (exifData.Model) info.Model = exifData.Model;

  // GPS-Koordinaten immer übernehmen (auch ohne Geocoding, für Debug-Overlay)
  if (exifData.latitude  != null) info.latitude  = exifData.latitude;
  if (exifData.longitude != null) info.longitude = exifData.longitude;

  // GPS → Ortsname
  if (fetchAddress && exifData.latitude != null && exifData.longitude != null) {
    try {
      const res = await fetch(
        `/api/geocode?lat=${exifData.latitude}&lon=${exifData.longitude}&lang=${encodeURIComponent(geocodingLang)}`
      );
      if (res.ok) {
        const geo = await res.json();
        if (geo && geo.address) info.address = geo.address;
      }
    } catch (e) {
      console.warn("Geocode-Anfrage fehlgeschlagen:", e.message);
    }
  }

  return info;
}
