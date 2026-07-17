const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errors = []; page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  await page.goto('http://localhost:8484/index.html'); await page.waitForTimeout(1200);
  await page.click('#btnStart'); await page.waitForTimeout(300);
  await page.fill('#obName', 'R'); await page.click('#obNext'); await page.waitForTimeout(300);

  // custom bucket named Calories
  await page.click('.chip[data-custom]'); await page.waitForTimeout(200);
  await page.click('#obNext'); await page.waitForTimeout(300);   // palette
  await page.click('#obNext'); await page.waitForTimeout(400);   // bucket:0 setup

  // 1 · mode picker visible with both cards
  const modes = await page.evaluate(() => [...document.querySelectorAll('.mode-card')].map(b => ({ t: b.querySelector('strong').textContent, on: b.classList.contains('on') })));
  console.log('MODE CARDS:', JSON.stringify(modes));
  await page.fill('[data-f=bname]', 'Calories'); await page.waitForTimeout(150);

  // 2 · choose "Throughout the day" → quantity fields appear
  await page.click('.mode-card[data-mode="allday"]'); await page.waitForTimeout(350);
  await page.screenshot({ path: 'shots/c1-ob-allday.png' });
  const hasCfg = await page.evaluate(() => !!document.querySelector('[data-f=total]'));
  console.log('QUANTITY FIELDS:', hasCfg);

  // 3 · calories example: total 2000, block 1000, chunk 250 → 8 chunks/day, block every 4
  const setNum = async (f, v) => { await page.fill(`[data-f=${f}]`, String(v)); await page.evaluate(fl => document.querySelector(`[data-f=${fl}]`).dispatchEvent(new Event('change')), f); await page.waitForTimeout(250); };
  await page.fill('[data-f=unit]', 'calories'); await page.evaluate(() => document.querySelector('[data-f=unit]').dispatchEvent(new Event('change'))); await page.waitForTimeout(250);
  await setNum('total', 2000); await setNum('block', 1000); await setNum('chunk', 250);
  const sum = await page.evaluate(() => document.querySelector('.cc-sum').textContent);
  console.log('SUMMARY:', sum);
  await page.screenshot({ path: 'shots/c2-ob-calories.png' });

  // finish onboarding
  for (let k = 0; k < 3; k++) { await page.click('#obNext'); await page.waitForTimeout(350); }
  await page.waitForTimeout(2000);

  // 4 · bank chunks via BucketSheet: block should earn at 4 and 8
  await page.evaluate(() => BucketSheet.open(0)); await page.waitForTimeout(400);
  await page.screenshot({ path: 'shots/c3-bucket-sheet.png' });
  const label0 = await page.evaluate(() => document.querySelector('#sheet .bc-label').textContent);
  console.log('SHEET LABEL:', label0);
  for (let k = 0; k < 4; k++) { await page.click('#chipPlus'); await page.waitForTimeout(250); }
  await page.waitForTimeout(1200);
  let dropped = await page.evaluate(() => S.week.blocks.filter(b => b.status === 'dropped').length);
  console.log('BLOCKS AFTER 4 CHUNKS:', dropped, '(expect 1)');
  for (let k = 0; k < 4; k++) { await page.click('#chipPlus'); await page.waitForTimeout(250); }
  await page.waitForTimeout(1200);
  dropped = await page.evaluate(() => S.week.blocks.filter(b => b.status === 'dropped').length);
  console.log('BLOCKS AFTER 8 CHUNKS:', dropped, '(expect 2)');
  const label1 = await page.evaluate(() => document.querySelector('#sheet .bc-label').textContent);
  console.log('LABEL AT 8:', label1);
  await page.evaluate(() => Sheet.close()); await page.waitForTimeout(300);

  // 5 · editor shows the same picker + config
  await page.evaluate(() => openBucketEditor(S.colors[0], { bucket: S.buckets[0], onChange: () => {} })); await page.waitForTimeout(400);
  await page.screenshot({ path: 'shots/c4-editor.png' });
  const ed = await page.evaluate(() => ({ cards: document.querySelectorAll('#sheet .mode-card').length, cfg: !!document.querySelector('#sheet [data-f=total]') }));
  console.log('EDITOR PICKER:', JSON.stringify(ed));

  // 6 · legacy shape still works (simulate old save)
  const legacy = await page.evaluate(() => { const c = chunkCfg({ target: 8, countsAt: 6 }); return c.perDay === 8 && c.perBlock === 6; });
  console.log('LEGACY SHAPE OK:', legacy);

  // 7 · voice label
  const beKind = await page.evaluate(() => VOICES.sugar.label);
  console.log('VOICE LABEL:', beKind);

  // 8 · TODAY label has no date
  const today = await page.evaluate(() => { Floor.draw(); return true; });
  console.log('DATE ONLY IN MODAL: TODAY label code =', await page.evaluate(() => Floor.draw.toString().includes('dstr') ? 'STILL HAS DATE' : 'clean'));

  console.log(errors.length ? errors.join('\n') : 'NO PAGE ERRORS');
  await browser.close();
})();
