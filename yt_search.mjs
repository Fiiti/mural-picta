import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false, slowMo: 800 });
const page = await browser.newPage();

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded' });

// Cookie-Banner wegklicken falls vorhanden
try {
  await page.click('button:has-text("Alle ablehnen")', { timeout: 5000 });
} catch {}
try {
  await page.click('button:has-text("Accept all")', { timeout: 3000 });
} catch {}

// Suchfeld – YouTube nutzt verschiedene Selektoren je nach Layout
await page.waitForSelector('input[name="search_query"], input#search, ytd-searchbox input', { timeout: 10000 });
const searchInput = page.locator('input[name="search_query"], input#search, ytd-searchbox input').first();
await searchInput.click();
await searchInput.type('Toastbrot', { delay: 120 });
await searchInput.press('Enter');

await page.waitForSelector('ytd-video-renderer', { timeout: 15000 });
console.log('Suchergebnisse für "Toastbrot" geladen!');

// Browser offen lassen für 30 Sekunden zum Betrachten
await page.waitForTimeout(30000);
await browser.close();
