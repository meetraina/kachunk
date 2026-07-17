// Kachunk — store & launch asset pack compositor
// Renders device-framed store screenshots, Play feature graphic, OG image, PH gallery.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'assets');
fs.mkdirSync(OUT, { recursive: true });

const FONTS = `
@font-face{font-family:"Bricolage Grotesque";font-weight:700;src:url("../fonts/bricolage-grotesque-latin-700-normal.woff2") format("woff2");}
@font-face{font-family:"Bricolage Grotesque";font-weight:800;src:url("../fonts/bricolage-grotesque-latin-800-normal.woff2") format("woff2");}
@font-face{font-family:"Inclusive Sans";font-weight:400;src:url("../fonts/inclusive-sans-latin-400-normal.woff2") format("woff2");}
@font-face{font-family:"Inclusive Sans";font-weight:600;src:url("../fonts/inclusive-sans-latin-600-normal.woff2") format("woff2");}
@font-face{font-family:"Figtree";font-weight:300;src:url("../fonts/figtree-latin-300-normal.woff2") format("woff2");}
@font-face{font-family:"Figtree";font-weight:600;src:url("../fonts/figtree-latin-600-normal.woff2") format("woff2");}
*{box-sizing:border-box;margin:0}
:root{--paper:#F8F6F2;--ink:#33414D;--muted:#8B949B;--terra:#DD7C54;--aqua:#8FB0BC;--hairline:#E6E1D6;
--mist:#C9D7DA;--peachw:#F4C7BA;--glow:#FDDAA1;--haze:#FDF9EF;--sand:#EDE5B9;--honey:#DFC289;}
body{font-family:"Inclusive Sans",sans-serif;background:var(--paper);color:var(--ink);overflow:hidden}
.brico{font-family:"Bricolage Grotesque",sans-serif;letter-spacing:-0.015em}
`;

// tiny decorative brick strip
function bricks(size, gap) {
  const cols = ['--mist','--peachw','--glow','--sand','--honey'];
  return `<div style="display:flex;gap:${gap}px">` + cols.map((c,i) =>
    `<div style="width:${size}px;height:${size}px;border-radius:${Math.round(size*0.24)}px;background:var(${c});transform:rotate(${(i%2? 4:-5)}deg);box-shadow:inset 0 -${Math.round(size*0.12)}px 0 rgba(51,65,77,.12)"></div>`).join('') + '</div>';
}
function markBlock(px) {
  return `<div class="brico" style="width:${px}px;height:${px}px;border-radius:${Math.round(px*0.26)}px;background:var(--aqua);transform:rotate(-8deg);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${Math.round(px*0.52)}px;color:#FDFBF7">k<span style="color:var(--terra)">.</span></div>`;
}
function phone(shot, w) {
  const r = Math.round(w * 0.115);
  return `<div style="width:${w}px;border-radius:${r}px;border:1px solid var(--hairline);overflow:hidden;background:#fff;box-shadow:0 30px 60px -30px rgba(51,65,77,.28)">
    <img src="../shots/${shot}" style="width:100%;display:block"></div>`;
}

// ── 1 · Store screenshots 1080×1920 — alternating color floods, not all paper ──
const STORE = [
  { shot:'f7-board.png',  file:'store-1-board.png',   k:'THE BOARD',      h:'Your week is a<br>pile of blocks.',        s:'Every block is one time you said you’d do the thing.',
    bg:'#1E262D', ink:'#E9EDF0', sub:'#8C99A3', kick:'#DD7C54' },
  { shot:'f8-board-live.png', file:'store-2-kachunk.png', k:'THE SOUND',  h:'Drag it home.<br><em>Kachunk.</em>',        s:'Real 3D bricks. Real physics. Confetti when it lands.',
    bg:'#DD7C54', ink:'#FDFBF7', sub:'rgba(253,251,247,.85)', kick:'#FDFBF7', em:'#33414D' },
  { shot:'f9-sweep.png',  file:'store-3-sweep.png',   k:'NO STREAK SHAME', h:'Your week never<br>resets on its own.',    s:'The sweep asks “did you do it?” — you tap what happened.',
    bg:'#F8F6F2', ink:'#33414D', sub:'#8B949B', kick:'#DD7C54' },
  { shot:'f10-receipts.png', file:'store-4-receipts.png', k:'RECEIPTS',   h:'Proof, not<br>pressure.',                  s:'Averages built from your actual blocks. No red. Ever.',
    bg:'#8FB0BC', ink:'#22303A', sub:'rgba(34,48,58,.75)', kick:'#FDFBF7' },
  { shot:'f5-recap.png',  file:'store-5-fit.png',     k:'REALITY CHECK',  h:'A week that<br>actually fits.',            s:'Kachunk does the math before you overpromise.',
    bg:'#DFC289', ink:'#33414D', sub:'rgba(51,65,77,.72)', kick:'#B95F3D' },
];
function storePage(a) {
  return `<!doctype html><html><head><style>${FONTS}
  body{width:1080px;height:1920px;display:flex;flex-direction:column;align-items:center;padding:96px 90px 0;background:${a.bg};color:${a.ink}}
  em{font-style:normal;color:${a.em||a.kick}}
  </style></head><body>
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:56px">${markBlock(64)}
      <span class="brico" style="font-weight:800;font-size:40px;color:${a.ink}">Kachunk<span style="color:${a.kick}">.</span></span></div>
    <div class="brico" style="font-size:24px;letter-spacing:.22em;color:${a.kick};margin-bottom:22px;font-weight:700">${a.k}</div>
    <h1 class="brico" style="font-weight:800;font-size:84px;line-height:1.04;text-align:center;margin-bottom:24px;color:${a.ink}">${a.h}</h1>
    <p style="font-size:31px;color:${a.sub};text-align:center;max-width:760px;line-height:1.4;margin-bottom:64px">${a.s}</p>
    <div style="filter:drop-shadow(0 34px 44px rgba(0,0,0,.28))">${phone(a.shot, 620)}</div>
  </body></html>`;
}

// ── 2 · Play feature graphic 1024×500 ──
const FEATURE = `<!doctype html><html><head><style>${FONTS}
body{width:1024px;height:500px;display:flex;align-items:center;padding:0 72px;gap:56px}
</style></head><body>
  ${markBlock(150)}
  <div>
    <div class="brico" style="font-weight:800;font-size:82px;line-height:1">Kachunk<span style="color:var(--terra)">.</span></div>
    <div style="font-size:30px;color:var(--muted);margin:16px 0 26px;line-height:1.35">The week you can hold.<br>Blocks you can move. Nothing you can break.</div>
    ${bricks(44,14)}
  </div>
</body></html>`;

// ── 3 · OG image 1200×630 ──
const OG = `<!doctype html><html><head><style>${FONTS}
body{width:1200px;height:630px;display:flex;align-items:center;padding:0 0 0 84px;gap:64px}
</style></head><body>
  <div style="flex:1">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:34px">${markBlock(58)}
      <span class="brico" style="font-weight:800;font-size:36px">Kachunk<span style="color:var(--terra)">.</span></span></div>
    <h1 class="brico" style="font-weight:800;font-size:64px;line-height:1.05;margin-bottom:20px">Buckets,<br>not calendars.</h1>
    <p style="font-size:25px;color:var(--muted);line-height:1.4;margin-bottom:30px">Weekly habits as toy bricks you toss,<br>stack, and drop home. One notification.<br>Zero streak shame.</p>
    ${bricks(38,12)}
  </div>
  <div style="align-self:flex-end;margin-bottom:-210px">${phone('f7-board.png', 430)}</div>
</body></html>`;

// ── 4 · PH gallery 1270×760 ×3 ──
const PH = [
  { file:'ph-1-hero.png', h:'The week you can hold.', s:'Kachunk turns weekly habits into physical 3D blocks. Do the thing, drag the block home — kachunk.', shots:['f7-board.png','f8-board-live.png'] },
  { file:'ph-2-sweep.png', h:'It never resets without asking.', s:'End of week, you sweep the board: tap what actually happened. No streaks, no red, no shame spiral.', shots:['f9-sweep.png','f10-receipts.png'] },
  { file:'ph-3-fit.png', h:'ADHD-honest by design.', s:'Goal-fit math during onboarding, one daily notification, four voices from Plain to Extra Spicy.', shots:['f5-recap.png','f6-voice.png'] },
];
function phPage(a) {
  return `<!doctype html><html><head><style>${FONTS}
  body{width:1270px;height:760px;display:flex;align-items:center;padding:0 80px;gap:60px}
  </style></head><body>
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:30px">${markBlock(50)}
        <span class="brico" style="font-weight:800;font-size:30px">Kachunk<span style="color:var(--terra)">.</span></span></div>
      <h1 class="brico" style="font-weight:800;font-size:52px;line-height:1.06;margin-bottom:18px">${a.h}</h1>
      <p style="font-size:22px;color:var(--muted);line-height:1.45">${a.s}</p>
    </div>
    <div style="display:flex;gap:34px;align-items:flex-end">
      <div style="margin-bottom:-260px">${phone(a.shots[0], 300)}</div>
      <div style="margin-bottom:-160px">${phone(a.shots[1], 300)}</div>
    </div>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files'] });
  const jobs = [
    ...STORE.map(a => ({ html: storePage(a), w:1080, h:1920, file:a.file })),
    { html: FEATURE, w:1024, h:500, file:'feature-graphic-1024x500.png' },
    { html: OG, w:1200, h:630, file:'og-1200x630.png' },
    ...PH.map(a => ({ html: phPage(a), w:1270, h:760, file:a.file })),
  ];
  for (const j of jobs) {
    const tmp = path.join(__dirname, '_tmp-compose.html');
    fs.writeFileSync(tmp, j.html);
    const page = await browser.newPage({ viewport:{ width:j.w, height:j.h } });
    await page.goto('file://' + tmp);
    await page.waitForTimeout(450); // fonts + images
    await page.screenshot({ path: path.join(OUT, j.file) });
    await page.close();
    console.log('✓', j.file);
  }
  fs.unlinkSync(path.join(__dirname, '_tmp-compose.html'));
  await browser.close();
  console.log('DONE');
})();
