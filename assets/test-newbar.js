const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  // fast onboard
  await page.goto('http://localhost:8484/index.html'); await page.waitForTimeout(1200);
  await page.click('#btnStart'); await page.waitForTimeout(300);
  await page.fill('#obName', 'Raina'); await page.click('#obNext'); await page.waitForTimeout(300);
  for (const n of ['Move','Water']) { await page.click(`.chip[data-starter="${n}"]`); await page.waitForTimeout(80); }
  for (let k = 0; k < 6; k++) { await page.click('#obNext'); await page.waitForTimeout(300); }
  await page.waitForTimeout(2200);

  // 1 · bottom bar present + dated TODAY label
  await page.screenshot({ path: 'shots/n1-board-bar.png' });
  const bar = await page.evaluate(() => !!document.querySelector('#actionBar') && getComputedStyle(document.querySelector('#actionBar')).display !== 'none');
  console.log('BAR VISIBLE:', bar);

  // 2 · add-entry modal: open, +2 Move today, screenshot, day nav
  await page.click('#abAdd'); await page.waitForTimeout(400);
  await page.screenshot({ path: 'shots/n2-entry-modal.png' });
  const plus = () => page.evaluate(() => { const b = document.querySelector('#sheet [data-plus]'); if (b) b.click(); return !!b; });
  await plus(); await page.waitForTimeout(250); await plus(); await page.waitForTimeout(250);
  const cnt = await page.evaluate(() => document.querySelector('#sheet .stepper .val').textContent);
  console.log('ENTRY COUNT AFTER +2:', cnt);
  await page.evaluate(() => { const b = document.querySelector('#sheet [data-minus]'); b.click(); });
  await page.waitForTimeout(250);
  const cnt2 = await page.evaluate(() => document.querySelector('#sheet .stepper .val').textContent);
  console.log('AFTER -1:', cnt2);
  await page.screenshot({ path: 'shots/n3-entry-after.png' });
  const nav = await page.evaluate(() => ({ prev: document.querySelector('#elPrev').disabled, next: document.querySelector('#elNext').disabled }));
  console.log('DAY NAV (mon-start week, thu): prev', nav.prev, 'next', nav.next);
  await page.evaluate(() => { const b = document.querySelector('#elPrev'); if (b && !b.disabled) b.click(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/n4-entry-prevday.png' });
  await page.click('#elDone'); await page.waitForTimeout(500);

  // 3 · undo (last entry was a manual drop)
  await page.click('#abUndo'); await page.waitForTimeout(500);
  const afterUndo = await page.evaluate(() => S.week.blocks.filter(b => b.status === 'dropped').length);
  console.log('DROPPED AFTER UNDO:', afterUndo, '(was 2 after +2/-1... expect 1 less)');

  // 4 · goodnight sweep — day kind, restack hidden, live bg
  await page.click('#abNight'); await page.waitForTimeout(500);
  const night = await page.evaluate(() => ({
    popShown: !document.querySelector('#sweepPop').hidden,
    strong: document.querySelector('#sweepPop strong').textContent,
    restackHidden: document.querySelector('#spRestack').hidden,
    live: document.querySelector('#screen-floor').classList.contains('board-live'),
  }));
  console.log('GOODNIGHT:', JSON.stringify(night));
  await page.screenshot({ path: 'shots/n5-goodnight.png' });
  await page.click('#spClose'); await page.waitForTimeout(400);
  const liveOff = await page.evaluate(() => document.querySelector('#screen-floor').classList.contains('board-live'));
  console.log('LIVE CLASS CLEARED:', !liveOff);

  // 5 · reset day
  await page.click('#abReset'); await page.waitForTimeout(400);
  await page.screenshot({ path: 'shots/n6-resetday.png' });
  const hasGo = await page.evaluate(() => !!document.querySelector('#rdGo'));
  if (hasGo) { await page.click('#rdGo'); await page.waitForTimeout(500); }
  const afterReset = await page.evaluate(() => S.week.blocks.filter(b => b.status === 'dropped').length);
  console.log('DROPPED AFTER RESET DAY:', afterReset, '(expect 0)');

  // 6 · full-screen celebration — force via Celebrate.run
  await page.evaluate(() => Celebrate.run(V().perfect));
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shots/n7-celebrate.png' });
  const cb = await page.evaluate(() => !!document.querySelector('#celebrate'));
  console.log('CELEBRATE OVERLAY:', cb);
  await page.waitForTimeout(2400);

  // 7 · stale check ask — simulate yesterday with a planned item
  await page.evaluate(() => {
    const b = S.week.blocks.find(x => x.status !== 'dropped');
    S.day.items = [{ id: 'tst1', blockId: b.id, colorId: b.colorId, done: false, day: 'today' }];
    const y = new Date(); y.setDate(y.getDate() - 1);
    S.day.date = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
    save();
  });
  await page.reload(); await page.waitForTimeout(1800);
  await page.click('#btnStart').catch(() => {}); await page.waitForTimeout(600);
  await page.screenshot({ path: 'shots/n8-newday-ask.png' });
  const ask = await page.evaluate(() => ({ sheet: !document.querySelector('#sheet').hidden, go: !!document.querySelector('#ndGo') }));
  console.log('NEW DAY ASK SHOWN:', JSON.stringify(ask));
  if (ask.go) { await page.click('#ndGo'); await page.waitForTimeout(600); }
  await page.screenshot({ path: 'shots/n9-after-start-day.png' });
  const flow = await page.evaluate(() => !document.querySelector('#sheet').hidden);
  console.log('RESET FLOW SHEET AFTER CONFIRM:', flow);

  // 8 · restack confirm from bar
  await page.evaluate(() => Sheet.close()); await page.waitForTimeout(300);
  await page.click('#abRestack'); await page.waitForTimeout(400);
  await page.screenshot({ path: 'shots/n10-restack-confirm.png' });
  const rw = await page.evaluate(() => !!document.querySelector('#rwGo'));
  console.log('RESTACK CONFIRM:', rw);

  console.log(errors.length ? errors.join('\n') : 'NO PAGE ERRORS');
  await browser.close();
})();
