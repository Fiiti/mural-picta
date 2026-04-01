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
