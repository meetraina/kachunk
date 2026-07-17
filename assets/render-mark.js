// render app-icon PNGs from an HTML replica of the mark (real Bricolage font)
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await (await browser.newContext({ viewport: { width: 512, height: 512 } })).newPage();
  const html = (size, radius, pad) => `<!doctype html><html><head><style>
    @font-face{font-family:"Bricolage";font-weight:800;src:url("/node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2") format("woff2")}
    body{margin:0;width:${size}px;height:${size}px;background:#F8F6F2;border-radius:${radius}px;overflow:hidden;display:flex;align-items:center;justify-content:center}
    .blk{width:${size*0.52}px;height:${size*0.52}px;border-radius:${size*0.115}px;background:#7E9B95;transform:rotate(-8deg);
      box-shadow:0 ${size*0.05}px ${size*0.075}px -${size*0.03}px rgba(51,65,77,.5), inset 0 -${size*0.012}px 0 rgba(0,0,0,.10), inset 0 ${size*0.006}px 0 rgba(255,255,255,.22);
      display:flex;align-items:center;justify-content:center;font-family:"Bricolage";font-weight:800;font-size:${size*0.30}px;color:#FDFBF7;line-height:1}
    .blk span{color:#DD7C54}
  </style></head><body><div class="blk">k<span>.</span></div></body></html>`;
  const shots = [[512,'icon-512.png',116],[192,'icon-192.png',44],[180,'apple-touch-icon.png',0],[512,'icon-maskable-512.png',0]];
  for (const [size, out, radius] of shots) {
    await page.setViewportSize({ width: size, height: size });
    await page.goto('http://localhost:8484/'); // establish origin for font path
    await page.setContent(html(size, radius, 0), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({ path: out, omitBackground: radius > 0 });
    console.log('wrote', out);
  }
  await browser.close();
})();
