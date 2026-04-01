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
 * Sammelt alle Anzeige-Informationen zu einem Medienelement.
 * Bei Bildern: EXIF auslesen, optional GPS → Ortsname.
 * @param {Object} item            - Medieobjekt { url, type, filename, ... }
 * @param {boolean} fetchAddress   - GPS-Daten via /api/geocode auflösen?
 * @returns {Promise<Object>} Datenobjekt für template.js
 */
async function getMediaInfo(item, fetchAddress = false) {
  const info = {
    filename: item.filename,
    relativePath: item.relativePath || "",
  };

  if (item.type !== "image") return info;

  const exifData = await extractExif(item.url);

  if (exifData.DateTimeOriginal) info.DateTimeOriginal = exifData.DateTimeOriginal;
  if (exifData.Make)             info.Make  = exifData.Make;
  if (exifData.Model)            info.Model = exifData.Model;

  // GPS-Koordinaten immer übernehmen (auch ohne Geocoding, für Debug-Overlay)
  if (exifData.latitude  != null) info.latitude  = exifData.latitude;
  if (exifData.longitude != null) info.longitude = exifData.longitude;

  // GPS → Ortsname
  if (fetchAddress && exifData.latitude != null && exifData.longitude != null) {
    try {
      const res = await fetch(
        `/api/geocode?lat=${exifData.latitude}&lon=${exifData.longitude}`
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
