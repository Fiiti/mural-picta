/**
 * Ken Burns Effekt
 * Wählt zufällig eine der 5 Animations-Varianten und startet sie auf dem Element.
 */

const KB_ANIMATIONS = ["kenBurns-tl", "kenBurns-tr", "kenBurns-bl", "kenBurns-br", "kenBurns-center"];

/**
 * Startet den Ken Burns Effekt auf einem Medienelement.
 * @param {HTMLElement} element  - img oder video Element
 * @param {number}      zoom     - Zoom-Faktor, z.B. 1.3
 * @param {number}      duration - Animationsdauer in Sekunden
 */
function startKenBurns(element, zoom, duration) {
  // Zuerst Animation zurücksetzen (nötig, damit sie neu startet)
  element.style.animation = "none";
  element.style.setProperty("--kb-zoom", zoom);

  // Kurzer Timeout, damit der Browser das "none" tatsächlich verarbeitet
  setTimeout(() => {
    const name = KB_ANIMATIONS[Math.floor(Math.random() * KB_ANIMATIONS.length)];
    element.style.animation = `${name} ${duration}s linear forwards`;
  }, 30);
}

/**
 * Stoppt und setzt den Ken Burns Effekt zurück.
 * @param {HTMLElement} element
 */
function stopKenBurns(element) {
  element.style.animation = "none";
}
