const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  page.on('pageerror', () => {});
  await page.goto('http://localhost:8484/index.html'); await page.waitForTimeout(1400);
  await page.screenshot({ path: 'shots/f1-splash.png' });
  await page.click('#btnStart'); await page.waitForTimeout(300);
  await page.fill('#obName', 'Raina'); await page.screenshot({ path: 'shots/f2-name.png' });
  await page.click('#obNext'); await page.waitForTimeout(300);
  for (const n of ['Move','Social','Water','Read']) { await page.click(`.chip[data-starter="${n}"]`); await page.waitForTimeout(80); }
  await page.screenshot({ path: 'shots/f3-pick.png' });
  await page.click('#obNext'); await page.waitForTimeout(350);
  await page.screenshot({ path: 'shots/f4-bucket.png' });
  await page.click('#obNext'); await page.waitForTimeout(250);
  await page.screenshot({ path: 'shots/f4b-bucket2.png' });
  await page.click('#obNext'); await page.waitForTimeout(250);
  await page.click('#obNext'); await page.waitForTimeout(250);
  await page.click('#obNext'); await page.waitForTimeout(350);
  await page.screenshot({ path: 'shots/f5-recap.png' });
  await page.click('#obNext'); await page.waitForTimeout(350);
  await page.screenshot({ path: 'shots/f6-voice.png' });
  await page.click('#obNext'); await page.waitForTimeout(2600);
  await page.screenshot({ path: 'shots/f7-board.png' });
  // plan two blocks into today
  const drag = async (fy) => {
    const from = await page.evaluate(() => {
      const bs = [...Floor.bodies.values()].filter(b=>b.position.y < Floor.planY()-20).sort((a,b)=>a.position.y-b.position.y);
      const b = bs[0]; const st = document.getElementById('floorStage').getBoundingClientRect();
      return b ? { x: b.position.x + st.left, y: b.position.y + st.top, top: st.top, h: st.height } : null;
    });
    if (!from) return;
    const toY = from.top + from.h * fy, toX = 190;
    await page.mouse.move(from.x, from.y); await page.mouse.down(); await page.waitForTimeout(130);
    for (let i = 1; i <= 12; i++) { await page.mouse.move(from.x+(toX-from.x)*i/12, from.y+(toY-from.y)*i/12); await page.waitForTimeout(28); }
    await page.waitForTimeout(200); await page.mouse.up(); await page.waitForTimeout(650);
  };
  await drag(0.80); await drag(0.80);
  // drop one on its bucket
  const st1 = await page.evaluate(() => {
    const grabbed = [...Floor.bodies.values()][0];
    const S2 = JSON.parse(localStorage.getItem('kachunk.v1'));
    const bi = S2.buckets.findIndex(bk => bk.colorId === grabbed.colorId);
    const br = document.querySelectorAll('.bucket-hit')[bi].getBoundingClientRect();
    const stg = document.getElementById('floorStage').getBoundingClientRect();
    return { fx: grabbed.position.x + stg.left, fy: grabbed.position.y + stg.top, tx: br.left+br.width/2, ty: br.top+br.height/2 };
  });
  await page.mouse.move(st1.fx, st1.fy); await page.mouse.down(); await page.waitForTimeout(140);
  for (let i = 1; i <= 12; i++) { await page.mouse.move(st1.fx+(st1.tx-st1.fx)*i/12, st1.fy+(st1.ty-st1.fy)*i/12); await page.waitForTimeout(30); }
  await page.waitForTimeout(250); await page.mouse.up(); await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shots/f8-board-live.png' });
  // sweep
  await page.evaluate(() => Floor.enterSweep()); await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/f9-sweep.png' });
  await page.evaluate(() => Floor.exitSweep()); await page.waitForTimeout(300);
  // receipts + settings (quiet style)
  await page.click('#btnReceipts'); await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/f10-receipts.png' });
  await page.click('#receiptsBack'); await page.waitForTimeout(250);
  await page.click('#btnSettings'); await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/f11-settings.png' });
  console.log('final shots done');
  await browser.close();
})();
