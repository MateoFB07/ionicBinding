/**
 * Abre los informes HTML generados por Lighthouse en Google Chrome y captura
 * la pantalla del informe (la misma interfaz de la herramienta, en el navegador).
 */
const { chromium } = require('playwright-core');
const path = require('path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const REC = path.join(__dirname, '..', 'recursos');

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });

  for (const [name, out] of [
    ['lighthouse_inicial.html', 'lighthouse_inicial_chrome.png'],
    ['lighthouse_final.html', 'lighthouse_final_chrome.png'],
  ]) {
    await page.goto('file://' + path.join(REC, name), { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(REC, out) });
    console.log('Captura guardada:', out);
  }
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
