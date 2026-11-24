/**
 * Capturas reales de la aplicación para la memoria de la Actividad 2.
 * Usa el Chrome instalado en el sistema (no descarga navegadores).
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://127.0.0.1:4200';
const OUT = path.join(__dirname, '..', 'recursos');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const logs = [];
  page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-package-card');

  await page.screenshot({ path: path.join(OUT, '01_listado_escritorio.png'), fullPage: true });

  await page.setViewportSize({ width: 412, height: 915 });
  await page.screenshot({ path: path.join(OUT, '02_listado_movil.png'), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });

  const search = page.locator('ion-searchbar input');
  await search.fill('LTK-4032');
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, '03_busqueda.png'), fullPage: true });

  await search.fill('');
  await page.evaluate(() => {
    const select = document.querySelector('ion-select');
    select.value = 'CRITICAL';
    select.dispatchEvent(new CustomEvent('ionChange', { detail: { value: 'CRITICAL' }, bubbles: true }));
  });
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, '04_filtro_critical.png'), fullPage: true });

  await page.evaluate(() => {
    const select = document.querySelector('ion-select');
    select.value = 'ALL';
    select.dispatchEvent(new CustomEvent('ionChange', { detail: { value: 'ALL' }, bubbles: true }));
  });
  await page.waitForTimeout(250);
  await page.locator('.btn-approve').first().click({ force: true });
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, '05_inspeccionado.png'), fullPage: true });

  await search.fill('NO-EXISTE');
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, '06_estado_vacio.png'), fullPage: true });

  await search.fill('');
  await page.locator('.theme-toggle').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, '07_modo_claro.png'), fullPage: true });

  await page.locator('.theme-toggle').click();
  await page.waitForTimeout(300);
  await page.locator('ion-select').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, '08_desplegable_prioridad.png') });
  await page.keyboard.press('Escape');

  const inspector = await page.evaluate(() => {
    const card = document.querySelector('app-package-card ion-item');
    return card ? card.outerHTML.slice(0, 2200) : 'No se encontró el elemento.';
  });

  fs.writeFileSync(path.join(OUT, 'consola.txt'), logs.length ? logs.join('\n') : '(sin mensajes en consola)', 'utf8');
  fs.writeFileSync(path.join(OUT, 'inspector.txt'), inspector, 'utf8');
  fs.writeFileSync(
    path.join(OUT, 'capturas_manifiesto.json'),
    JSON.stringify({ url: URL, viewport: '1280x900 / 412x915', capturas: 8, mensajesConsola: logs.length }, null, 2),
    'utf8'
  );

  console.log('Capturas guardadas en', OUT);
  console.log('Mensajes de consola:', logs.length);
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
