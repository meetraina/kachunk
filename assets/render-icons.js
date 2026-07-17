const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const svg = fs.readFileSync(path.join(__dirname, 'icon.svg'), 'utf8');
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  async function shot(html, size, out) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${html}</body></html>`);
    await page.waitForTimeout(100);
    await page.screenshot({ path: out, omitBackground: true });
    console.log('wrote', out);
  }

  const plain = (s) => svg.replace('<svg xmlns', `<svg width="${s}" height="${s}" xmlns`);
  await shot(plain(512), 512, path.join(__dirname, '..', 'icon-512.png'));
  await shot(plain(192), 192, path.join(__dirname, '..', 'icon-192.png'));

  // apple touch icon: no transparency, square (iOS applies its own mask) — remove rounded corners
  const appleSvg = svg.replace('rx="116"', 'rx="0"').replace('<svg xmlns', '<svg width="180" height="180" xmlns');
  await shot(appleSvg, 180, path.join(__dirname, '..', 'apple-touch-icon.png'));

  // maskable 512: content scaled to 80% safe zone on full-bleed cream
  const maskable = `<div style="width:512px;height:512px;background:#FAF6EF;display:flex;align-items:center;justify-content:center">${svg.replace('rx="116"', 'rx="0"').replace('<svg xmlns', '<svg width="410" height="410" xmlns')}</div>`;
  await shot(maskable, 512, path.join(__dirname, '..', 'icon-maskable-512.png'));

  await browser.close();
})();
