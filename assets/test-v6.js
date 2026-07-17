const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:8484/index.html'); await page.waitForTimeout(1300);
  await page.screenshot({ path: 'shots/o1-splash.png' });
  await page.click('#btnStart'); await page.waitForTimeout(350);
  await page.fill('#obName', 'Raina');
  await page.click('#obNext'); await page.waitForTimeout(350);
  for (const n of ['Move','Social','Water']) { await page.click(`.chip[data-starter="${n}"]`); await page.waitForTimeout(100); }
  await page.screenshot({ path: 'shots/o2-pick.png' });
  await page.click('#obNext'); await page.waitForTimeout(350);
  await page.screenshot({ path: 'shots/o2b-palette.png' });
  await page.click('#obNext'); await page.waitForTimeout(350);
  await page.screenshot({ path: 'shots/o3-bucket-move.png' });
  await page.click('#obNext'); await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/o4-bucket-social.png' });
  await page.click('#obNext'); await page.waitForTimeout(300);
  await page.click('#obNext'); await page.waitForTimeout(350);
  await page.screenshot({ path: 'shots/o5-recap.png' });
  await page.click('#obNext'); await page.waitForTimeout(350);
  await page.click('#obNext'); await page.waitForTimeout(2400);
  await page.screenshot({ path: 'shots/o6-board.png' });

  // drag a block into the today zone
  const drag = async (fracY) => {
    const from = await page.evaluate(() => {
      const bodies = [...Floor.bodies.values()].sort((a,b)=>a.position.y-b.position.y);
      const b = bodies[0]; const st = document.getElementById('floorStage').getBoundingClientRect();
      return { x: b.position.x + st.left, y: b.position.y + st.top, top: st.top, h: st.height };
    });
    const toY = from.top + from.h * fracY, toX = 195;
    await page.mouse.move(from.x, from.y); await page.mouse.down(); await page.waitForTimeout(120);
    for (let i = 1; i <= 12; i++) { await page.mouse.move(from.x+(toX-from.x)*i/12, from.y+(toY-from.y)*i/12); await page.waitForTimeout(28); }
    await page.waitForTimeout(200); await page.mouse.up(); await page.waitForTimeout(600);
  };
  await drag(0.80); // into today zone (just above buckets)
  await drag(0.80);
  await page.screenshot({ path: 'shots/o7-today-zone.png' });
  // drag one onto its bucket = complete
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
  await page.waitForTimeout(250); await page.mouse.up(); await page.waitForTimeout(900);
  await page.screenshot({ path: 'shots/o8-after-drop.png' });

  // sweep on the board
  await page.evaluate(() => Floor.enterSweep()); await page.waitForTimeout(600);
  await page.screenshot({ path: 'shots/o9-sweep.png' });
  // tap two blocks to claim
  for (let k = 0; k < 2; k++) {
    const pos = await page.evaluate(() => {
      const bs = [...Floor.bodies.values()].filter(b => b.position.y < Floor.planY()-20).sort((a,b)=>a.position.y-b.position.y);
      const b = bs[0]; if (!b) return null;
      const stg = document.getElementById('floorStage').getBoundingClientRect();
      return { x: b.position.x + stg.left, y: b.position.y + stg.top };
    });
    if (pos) { await page.mouse.click(pos.x, pos.y); await page.waitForTimeout(900); }
  }
  await page.screenshot({ path: 'shots/o10-sweep-claimed.png' });
  await page.click('#spRestack'); await page.waitForTimeout(1500);
  await page.screenshot({ path: 'shots/o11-restacked.png' });
  await page.click('#btnReceipts'); await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/o12-receipts.png' });

  const st = await page.evaluate(() => {
    const S2 = JSON.parse(localStorage.getItem('kachunk.v1'));
    return { name: S2.settings.userName, maxSlots: S2.day.maxSlots, history: S2.history.length,
      hist0: S2.history[0] ? S2.history[0].perColor.reduce((a,x)=>a+x.done+x.partial,0) : null,
      total: S2.week.blocks.length };
  });
  console.log('STATE:', JSON.stringify(st));
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO PAGE ERRORS');
  await browser.close();
})();
