/**
 * Ken Burns Effekt
 * transform-origin wird per JS auf das Element gesetzt (NICHT in @keyframes),
 * da transform-origin in keyframes browserübergreifend unzuverlässig ist.
 */

const KB_ORIGINS = [
  "top left",
  "top right",
  "bottom left",
  "bottom right",
  "center",
];

/**
 * Startet den Ken Burns Effekt auf einem Medienelement.
 * @param {HTMLElement} element  - img oder video Element
 * @param {number}      zoom     - Zoom-Faktor, z.B. 1.3
 * @param {number}      duration - Animationsdauer in Sekunden
 */
function startKenBurns(element, zoom, duration) {
  // Animation zuerst vollständig stoppen
  element.style.animation = "none";
  element.style.transform = "scale(1)";
  element.style.setProperty("--kb-zoom", zoom);

  // transform-origin direkt am Element setzen – zuverlässiger als in @keyframes
  const origin = KB_ORIGINS[Math.floor(Math.random() * KB_ORIGINS.length)];
  element.style.transformOrigin = origin;

  // Kurzer Timeout, damit der Browser den Reset verarbeitet (Reflow)
  setTimeout(() => {
    element.style.animation = `kenBurns ${duration}s linear forwards`;
  }, 30);
}

/**
 * Stoppt und setzt den Ken Burns Effekt zurück.
 * @param {HTMLElement} element
 */
function stopKenBurns(element) {
  element.style.animation = "none";
  element.style.transform = "";
  element.style.transformOrigin = "";
}

/**
 * Panorama-Sweep für Breitbilder (z.B. 180°-Panoramas).
 * Skaliert das Bild auf volle Containerhöhe (object-fit: cover) und schwenkt
 * horizontal von links nach rechts oder umgekehrt. Die Dauer wird nach oben
 * angepasst, wenn die Anzeigezeit eine zu hohe Scrollgeschwindigkeit ergäbe.
 *
 * @param {HTMLImageElement} element       - Das img-Element
 * @param {"ltr"|"rtl"}     direction      - Schwenkrichtung
 * @param {number}          displayTime    - Anzeigezeit in Sekunden
 * @param {number}          maxSpeedPxSec  - Maximale Scrollgeschwindigkeit in px/s
 */
function startPanorama(element, direction, displayTime, maxSpeedPxSec) {
  const containerW = element.parentElement?.offsetWidth  || window.innerWidth;
  const containerH = element.parentElement?.offsetHeight || window.innerHeight;
  const naturalW   = element.naturalWidth  || containerW;
  const naturalH   = element.naturalHeight || containerH;

  // Mit object-fit: cover ist der Skalierungsfaktor das Maximum beider Achsen
  const scale      = Math.max(containerW / naturalW, containerH / naturalH);
  const scaledW    = naturalW * scale;
  const scrollable = Math.max(0, scaledW - containerW);

  // Dauer: mindestens displayTime, aber nie schneller als maxSpeedPxSec
  const minDuration = scrollable > 0 ? scrollable / maxSpeedPxSec : displayTime;
  const duration    = Math.max(displayTime, minDuration);

  element.style.animation    = "none";
  element.style.objectFit    = "cover";
  element.style.objectPosition = direction === "rtl" ? "100% center" : "0% center";
  element.style.transform    = "";
  element.style.transformOrigin = "";

  void element.offsetWidth; // Reflow erzwingen

  const animName = direction === "rtl" ? "panoramaSweepRTL" : "panoramaSweepLTR";
  element.style.animation = `${animName} ${duration}s linear forwards`;
}
