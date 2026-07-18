/* ═══════════════════════════════════════════════════════════
   KACHUNK — app.js
   Local-first. No accounts. Physics blocks → weekly buckets.
   ═══════════════════════════════════════════════════════════ */
"use strict";

/* ── tiny utils ── */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── line icon set (24×24, stroke) ── */
const ICONS = {
  move:   '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  water:  '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>',
  focus:  '<path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z"/>',
  heart:  '<path d="M12 20s-7.5-4.7-9.3-9A5.2 5.2 0 0112 6.3 5.2 5.2 0 0121.3 11c-1.8 4.3-9.3 9-9.3 9z"/>',
  rest:   '<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>',
  read:   '<path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v14c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-14c-4.5 0-6.5.5-8 2zM12 6.5v14"/>',
  create: '<path d="M14.5 5.5l4 4L8 20H4v-4L14.5 5.5zM12.5 7.5l4 4"/>',
  outside:'<path d="M12 21V11M12 11c-4 0-7-2.5-7-7 4.5 0 7 3 7 7zm0-2c.5-3 2.5-5 6-5 0 3.5-2 6-6 6"/>',
  sun:    '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19"/>',
  music:  '<path d="M9 18.5V5.5l11-2v13"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="16.5" r="2.5"/>',
  coffee: '<path d="M4 8.5h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5v-6zM17 9.5h1.5a2.5 2.5 0 010 5H17M7.5 5.5V3.5M11 5.5V3M14.5 5.5V3.5"/>',
  star:   '<path d="M12 3.5l2.5 5.4 5.9.7-4.4 4 1.2 5.9L12 16.6l-5.2 2.9 1.2-5.9-4.4-4 5.9-.7L12 3.5z"/>',
  run:    '<circle cx="15" cy="5" r="2"/><path d="M12.5 21l1.5-6-3-2.5 1-5L8 9 5.5 11.5M12 7.5l3.5 2 3 .5M9 16.5l-1.5 2-3 1"/>',
  flag:   '<path d="M5.5 21V4M5.5 4.5c4-2.5 8 2 12.5 0v9c-4.5 2-8.5-2.5-12.5 0"/>',
  sparkle:'<path d="M12 4l1.7 4.8L18.5 10l-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.2L12 4zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/>',
  broom:  '<path d="M4 17l5-5m0 0l7-7a2.1 2.1 0 013 3l-7 7m-3-3l3 3m-6 0l-2.5 2.5M9 20l-1.5 1M13 21l.5-2"/>',
  cal:    '<rect x="4" y="5.5" width="16" height="15" rx="3"/><path d="M4 10.5h16M8.5 3.5v4M15.5 3.5v4"/>',
  clock:  '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  grid:   '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  gear:   '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/>',
  sliders:'<path d="M4 7.5h9M17.5 7.5H20M4 16.5h3M11.5 16.5H20"/><circle cx="15.25" cy="7.5" r="2.25"/><circle cx="9.25" cy="16.5" r="2.25"/>',
  moon:   '<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>',
  back:   '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  cloud:  '<path d="M7 18.5a4.5 4.5 0 01-.4-9A6 6 0 0118.2 11a3.8 3.8 0 01-.7 7.5H7z"/>',
  download:'<path d="M12 3.5v11M7.5 10l4.5 4.5L16.5 10M4.5 20.5h15"/>',
  upload: '<path d="M12 14.5v-11M7.5 8L12 3.5 16.5 8M4.5 20.5h15"/>',
  trash:  '<path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 011.3-1.3h2.4a1.3 1.3 0 011.3 1.3v1.7M6.5 6.5l.8 12.2a2 2 0 002 1.8h5.4a2 2 0 002-1.8l.8-12.2M10 10.5v6M14 10.5v6"/>',
  undo:   '<path d="M8 5.5L4.5 9 8 12.5M4.5 9h9.25a5.75 5.75 0 110 11.5H9"/>',
  refresh:'<path d="M20 12a8 8 0 11-2.4-5.7M20 3.5V8h-4.5"/>',
  plus:   '<path d="M12 5v14M5 12h14"/>',
  layers: '<path d="M12 3.5l8.5 4.7L12 12.9 3.5 8.2 12 3.5z"/><path d="M3.5 12.5l8.5 4.7 8.5-4.7"/><path d="M3.5 16.6l8.5 4.7 8.5-4.7"/>',
};
const ic = (name, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]||ICONS.star}</svg>`;

/* ── block palette v4 — founder-supplied reference ("Color Palette #003"):
      Blue Dusk · Mineral Blue · Golden Rod · Light Peach · Peach · Dusty Rose ── */
const PALETTE = [
  {key:'gentlemist',   name:'Gentle Mist',   fill:'#C9D7DA', edge:'#8FA6AA', light:'#E0EAEC'},
  {key:'peachwhisper', name:'Peach Whisper', fill:'#F4C7BA', edge:'#C08D7E', light:'#F9DED6'},
  {key:'goldenglow',   name:'Golden Glow',   fill:'#FDDAA1', edge:'#C89F58', light:'#FEE9C6'},
  {key:'cloudyhaze',   name:'Cloudy Haze',   fill:'#FDF9EF', edge:'#C4B694', light:'#FFFDF8'},
  {key:'dreamysand',   name:'Dreamy Sand',   fill:'#EDE5B9', edge:'#B4A870', light:'#F4EFD3'},
  {key:'softhoney',    name:'Soft Honey',    fill:'#DFC289', edge:'#A78A4E', light:'#EBD7AF'},
];
const palByKey = k => PALETTE.find(p=>p.key===k) || PALETTE[0];
/* legacy key migration (older palettes → v4) */
const PAL_MIGRATE = {lilac:'gentlemist', sky:'gentlemist', mint:'dreamysand', coral:'peachwhisper',
  butter:'goldenglow', sage:'gentlemist', mist:'gentlemist', mauve:'gentlemist', clay:'softhoney',
  dusk:'gentlemist', mineral:'gentlemist', gold:'softhoney', lightpeach:'cloudyhaze', peach:'peachwhisper', rose:'peachwhisper'};
/* lighten/darken a hex; pct in -1..1 */
function shade(hex, pct){
  const n = parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255;
  if(pct>=0){ r+=(255-r)*pct; g+=(255-g)*pct; b+=(255-b)*pct; } else { r*=1+pct; g*=1+pct; b*=1+pct; }
  return '#'+[r,g,b].map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
}
/* resolve a color object (palette key OR custom hex) to {fill, edge, light} */
function palFor(c){
  if(c && c.customHex) return {key:'custom', name:'Custom', fill:c.customHex, edge:shade(c.customHex,-0.34), light:shade(c.customHex,0.30)};
  return palByKey(c && c.pal);
}

/* ── block color palettes — pick one, blocks re-base by slot order ── */
const BLOCK_PALETTES = [
  {key:'brand',  name:'Kachunk.',       hint:'default brights',                    hex:['#7C93A5','#DD7C54','#DFC289','#7E9B95','#C98D7E','#85A88E']},
  {key:'pastel', name:'Almost Neutral', hint:'soft and barely there',              hex:PALETTE.map(p=>p.fill)},
  {key:'zen',    name:'Spa Day',        hint:'low-stim and relaxing',              hex:['#B3C5C7','#A8BBA8','#E3D7C3','#CFC8BC','#D8C0B4','#8FA08A']},
  {key:'bright', name:'Toy Box',        hint:'classic bright pop',                 hex:['#4E8AC8','#E2574C','#F2A93B','#3FA06E','#8A64C8','#E56FA1']},
  {key:'gem',    name:'Moody',          hint:'rich, deep gemtones',                hex:['#35558A','#2F7D5D','#6E4F8E','#9E3B4D','#C98A2E','#2E7D83']},
  {key:'mono',   name:'Mono',           hint:'let the icons speak for themselves', hex:['#E7E2D6','#E7E2D6','#E7E2D6','#E7E2D6','#E7E2D6','#E7E2D6']},
];
const blockPalByKey = k => BLOCK_PALETTES.find(p=>p.key===k) || BLOCK_PALETTES[0];
/* the build-my-own picker — founder-supplied flat-UI swatches arranged as a spectrum,
   ending in a paper → grey → ink neutral ramp */
const PICKER_COLORS = [
  '#CD4760','#802F35','#802D3F','#CD9181','#E84C3D','#CE7057','#CE4C4C','#D45729',
  '#C23A2C','#805B53','#7F4537','#CCB394','#E4C15B','#CF8552','#F59D1F','#E77E23',
  '#F0C514','#B39147','#805334','#6FC387','#4ABA70','#26AF5F','#4B8056','#81CCB9',
  '#1AB99B','#517F72','#20A286','#86B6CD','#67BACD','#3597D4','#2581BC','#547480',
  '#427681','#8798CC','#4383C3','#275680','#7D649B','#3F324E','#975BA5','#894B9E',
  '#CD66A5','#80426B','#FDFBF7','#F8F6F2','#EFE8DA','#EEF3F6','#BDC2C8','#93A5A5',
  '#808E8D','#7F6E5D','#55607E','#33414D','#34495E','#2D3E50','#232E37','#141B21',
];
/* re-base every color to the chosen palette by slot order (custom hexes get replaced) */
function applyBlockPalette(key, colors, customHexes){
  if(key==='custom' || (key && key.startsWith('saved:'))){
    let hx = customHexes;
    if(key.startsWith('saved:')){
      const sp = (S.settings.savedPals||[]).find(p=>'saved:'+p.id===key);
      hx = sp && sp.hex;
    }
    if(!hx || !hx.length) hx = blockPalByKey('brand').hex;
    colors.forEach((c,i)=>{ c.customHex = hx[i%hx.length]; });
    return;
  }
  const bp = blockPalByKey(key);
  colors.forEach((c,i)=>{
    if(key==='pastel'){ c.customHex = null; c.pal = PALETTE[i%6].key; }
    else c.customHex = bp.hex[i%6];
  });
}
/* ongoing-habit setup — real quantities, in the user's own unit.
   Model: {unit, total (the day's full amount), chunk (one small chunk),
   block (minimum amount — the day's block counts here even short of total)}.
   Example (water): total 68 oz · small chunk 8 oz · minimum 48 oz · 7 days. */
function chunkVizHTML(cfg){
  if(!cfg) return '';
  const u = cfg.unit ? esc(cfg.unit) : 'times';
  const shown = Math.min(cfg.perDay, 16), over = cfg.perDay - shown;
  const cells = Array.from({length:shown},(_,k)=>`<i class="${k<cfg.perBlock?'fill':''}"></i>`).join('');
  const bpd = Math.floor(cfg.perDay/cfg.perBlock);
  return `<div class="cc-viz">
    <div class="cc-cells">${cells}${over>0?`<em>+${over}</em>`:''}</div>
    <div class="cc-cap">Each small chunk is ${cfg.chunk} ${u}. Your block counts at ${cfg.block}${cfg.block<cfg.total?` — ${cfg.total} is the full day`:''}.${bpd>1?` Up to ${bpd} blocks a day.`:''}</div>
  </div>`;
}
function chipConfigHTML(chips, goal, name){
  if(!chips) return '';
  const cfg = chunkCfg(chips);
  const inp = 'border:none;background:var(--surface);border-radius:10px;padding:9px 12px;font:inherit;font-size:15px;color:var(--ink);width:100%;text-align:center';
  const gsel = goal!==undefined ? Math.min(Math.max(Math.round(goal)||7,1),7) : 7;
  return `<div class="chip-config">
    <div class="be-lab" style="margin-top:14px">How much do you want to track per day?</div>
    <div class="cc-main">
      <input type="number" data-f="total" inputmode="numeric" min="1" value="${cfg.total}" aria-label="Daily total" style="${inp};flex:1;min-width:0">
      <input type="text" data-f="unit" value="${esc(chips.unit||'')}" placeholder="oz, cal…" maxlength="18"
        aria-label="Unit" style="${inp};flex:0 0 32%">
    </div>
    <div class="cc-grid${goal!==undefined?' cc-3':''}">
      ${goal!==undefined?`<div><label># of days</label><select data-f="days" aria-label="Days per week" style="${inp};appearance:none;-webkit-appearance:none;text-align-last:center">${[1,2,3,4,5,6,7].map(d=>`<option value="${d}"${gsel===d?' selected':''}>${d===7?'everyday':d+(d===1?' day':' days')}</option>`).join('')}</select></div>`:''}
      <div><label>Small chunk</label><input type="number" data-f="chunk" inputmode="numeric" min="1" value="${cfg.chunk}" style="${inp}"></div>
      <div><label>Minimum</label><input type="number" data-f="block" inputmode="numeric" min="1" value="${cfg.block}" style="${inp}"></div>
    </div>
    ${chunkVizHTML(cfg)}
  </div>`;
}
function bindChipConfig(card, getChips, upd, goalIO){
  const chips = getChips(); if(!chips) return;
  // editing always lands in the quantity shape (converts old saves on first touch)
  const modern = ()=>{
    if(chips.total===undefined){
      const c0 = chunkCfg(chips);
      chips.unit = c0.unit; chips.total = c0.total; chips.chunk = c0.chunk; chips.block = c0.block;
      delete chips.target; delete chips.countsAt;
    }
    return chips;
  };
  card.querySelector('[data-f="unit"]')?.addEventListener('change', e=>{ modern().unit = e.target.value.trim(); upd(); });
  card.querySelector('[data-f="days"]')?.addEventListener('change', e=>{
    if(goalIO) goalIO.set(Math.max(1, Math.min(7, Math.round(+e.target.value)||1)));
    upd();
  });
  for(const f of ['total','block','chunk']){
    card.querySelector(`[data-f="${f}"]`)?.addEventListener('change', e=>{
      const m = modern();
      m[f] = Math.max(1, Math.round(+e.target.value)||1);
      // keep it coherent: chunk ≤ block (minimum) ≤ total
      m.chunk = Math.max(1, Math.min(m.chunk, m.total));
      m.block = Math.min(m.total, Math.max(m.chunk, m.block));
      upd();
    });
  }
}
function savedCardHTML(sp, on){
  return `<button class="pal-card ${on?'on':''}" data-bp="saved:${sp.id}">
    <span><span class="pc-name">${esc(sp.name)}</span><span class="pc-hint">saved by you</span></span>
    <span class="pal-dots">${sp.hex.map(palDot).join('')}</span>
    <span class="sp-del" data-del="${sp.id}" role="button" aria-label="Delete palette">✕</span>
  </button>`;
}
function bindSavedPalDeletes(rootSel, onChange){
  $$(rootSel+' .sp-del').forEach(el=>el.onclick = e=>{
    e.stopPropagation();
    S.settings.savedPals = (S.settings.savedPals||[]).filter(p=>p.id!==el.dataset.del);
    save(); onChange(el.dataset.del);
  });
}
function palDot(h){ return `<i style="background:${h};box-shadow:inset 0 -3px 0 ${shade(h,-0.22)}"></i>`; }
function palCardHTML(bp, on){
  return `<button class="pal-card ${on?'on':''}" data-bp="${bp.key}">
    <span><span class="pc-name">${bp.name}</span><span class="pc-hint">${bp.hint}</span></span>
    <span class="pal-dots">${bp.hex.map(palDot).join('')}</span>
  </button>`;
}
/* the "build my own" card — opens the picker sheet */
function customCardHTML(sel, on){
  const dots = Array.from({length:6},(_,i)=> sel[i] ? palDot(sel[i]) : '<i class="empty"></i>').join('');
  return `<button class="pal-card ${on?'on':''}" data-bp="custom">
    <span><span class="pc-name">Build my own</span><span class="pc-hint">any six colors, any shade</span></span>
    <span class="pal-dots">${dots}</span>
  </button>`;
}
/* full-screen picker sheet: 4 shades per hue, 2 hues per row (8 swatches), plus a free hex tile */
function openCustomPicker(getSel, setSel, onComplete, onClose, onSaved){
  const paint = ()=>{
    const sel = getSel();
    const slots = Array.from({length:6},(_,i)=> sel[i]
      ? `<i data-ord="${sel[i]}" style="background:${sel[i]};box-shadow:inset 0 -3px 0 ${shade(sel[i],-0.22)}"><b class="drag-h" style="color:${inkFor(sel[i])==='#33414D'?'rgba(51,65,77,.55)':'rgba(253,251,247,.7)'}">⠿</b></i>`
      : '<i class="empty"></i>').join('');
    $('#cbpPreview').innerHTML = slots;
    $('#cbpHint').textContent = `${sel.length}/6 picked` + (sel.length===6 ? ' — applied to your buckets' : '');
    $$('#cbpGrid .cb-sw').forEach(el=>el.classList.toggle('on', sel.includes(el.dataset.h)));
    enableReorderX($('#cbpPreview'), order=>{
      const cur = getSel();
      if(order.length===cur.length){ if(cur.length===6) onComplete(order); setSel(order); paint(); }
    });
  };
  const tap = h=>{
    const sel = [...getSel()], i = sel.indexOf(h);
    if(i>=0) sel.splice(i,1);
    else { if(sel.length>=6) return toast('Six colors — tap one to swap it out.'); sel.push(h); }
    if(sel.length===6) onComplete(sel);
    setSel(sel); paint();
  };
  Sheet.open(`
    <h3 style="margin-bottom:2px">Build your palette</h3>
    <p class="muted" style="font-size:13.5px;margin:0 0 12px">Tap any six — the whole spectrum, paper to ink. Tap a pick again to drop it.</p>
    <div class="pal-dots cb-preview" id="cbpPreview"></div>
    <div class="cb-grid" id="cbpGrid">
      ${PICKER_COLORS.map(h=>`<button class="cb-sw" data-h="${h}" style="background:${h}" aria-label="${h}"></button>`).join('')}
      <label class="cb-sw cb-any" title="Any color"><input type="color" id="cbpAny" value="#8A64C8"><span>＋ any</span></label>
      <button class="cb-sw cb-any cb-dice" id="cbpSurprise" type="button">🎲 surprise me</button>
    </div>
    <div style="display:flex;align-items:center;gap:12px;justify-content:center">
      <div class="cb-hint" id="cbpHint" style="margin-top:10px"></div>
      <button id="cbpClear" type="button" style="appearance:none;border:none;background:transparent;color:var(--mark);font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;padding:10px 2px 0">clear it</button>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <input type="text" id="cbpName" placeholder="Name it to save it…" maxlength="22"
        style="flex:1;border:none;background:var(--inset);border-radius:12px;padding:11px 14px;font:inherit;font-size:14.5px;color:var(--ink)">
      <button class="btn btn-ghost" id="cbpSave" style="flex:none;padding:11px 18px">Save</button>
    </div>
    <button class="btn btn-primary" id="cbpDone" style="width:100%;margin-top:12px">Done</button>
  `, {onClose});
  $$('#cbpGrid .cb-sw[data-h]').forEach(el=>el.onclick = ()=>tap(el.dataset.h));
  $('#cbpAny').onchange = e=>tap(e.target.value.toUpperCase());
  $('#cbpSurprise').onclick = ()=>{
    const chromatic = PICKER_COLORS.slice(0, 42);
    const pick = [...chromatic].sort(()=>Math.random()-0.5).slice(0,6);
    onComplete(pick); setSel(pick); paint(); sfx('drop');
  };
  $('#cbpClear').onclick = ()=>{ setSel([]); paint(); sfx('tick'); };
  $('#cbpSave').onclick = ()=>{
    const sel = getSel();
    if(sel.length!==6) return toast('Pick all six first — then save.');
    const sp = {id:uid(), name:($('#cbpName').value.trim()||'My palette'), hex:[...sel]};
    S.settings.savedPals = (S.settings.savedPals||[]).concat([sp]); save();
    if(onSaved) onSaved('saved:'+sp.id);
    Sheet.close();
  };
  $('#cbpDone').onclick = ()=>Sheet.close();
  paint();
}

const SHAPES = [
  {key:'cube',  name:'Cube'},
  {key:'plank', name:'Plank'},
  {key:'arch',  name:'Arch'},
  {key:'drum',  name:'Drum'},
];

/* ── recommended starting points — 100 of them, grouped; `top` = the front grid ──
   Ongoing habits carry a chips config {unit, total (daily), chunk, block (minimum amount)}.
   goal = times/week for start-to-finish · days-tracked/week for ongoing. */
const STARTERS = [
  /* Body & movement */
  {name:'Move',        icon:'dumbbell',    pal:'gentlemist',   goal:3, slots:2, cat:'Body & movement', top:true},
  {name:'Walk',        icon:'footprints',  pal:'dreamysand',   goal:5, slots:1, cat:'Body & movement'},
  {name:'Run',         icon:'flame',       pal:'peachwhisper', goal:3, slots:2, cat:'Body & movement'},
  {name:'Ride',        icon:'bike',        pal:'goldenglow',   goal:2, slots:2, cat:'Body & movement'},
  {name:'Swim',        icon:'waves',       pal:'gentlemist',   goal:2, slots:2, cat:'Body & movement'},
  {name:'Stretch',     icon:'heart_pulse', pal:'cloudyhaze',   goal:4, slots:0.5, cat:'Body & movement'},
  {name:'Yoga',        icon:'sun',         pal:'softhoney',    goal:3, slots:2, cat:'Body & movement'},
  {name:'Cardio',      icon:'activity',    pal:'peachwhisper', goal:3, slots:2, cat:'Body & movement'},
  {name:'Dance',       icon:'party_popper',pal:'goldenglow',   goal:1, slots:2, cat:'Body & movement'},
  {name:'Team sport',  icon:'trophy',      pal:'dreamysand',   goal:1, slots:3, cat:'Body & movement'},
  {name:'Race prep',   icon:'medal',      pal:'gentlemist',   goal:3, slots:2, cat:'Body & movement'},
  {name:'Push-ups',    icon:'dumbbell',    pal:'cloudyhaze',   goal:5, slots:0.5, cat:'Body & movement', chips:{unit:'push-ups', total:50, chunk:10, block:30}},
  {name:'Hike',        icon:'mountain',    pal:'softhoney',    goal:1, slots:3, cat:'Body & movement'},
  {name:'Outside',     icon:'leaf',        pal:'softhoney',    goal:4, slots:1, cat:'Body & movement', top:true},
  /* Food & drink */
  {name:'Meal Prep',   icon:'utensils',    pal:'dreamysand',   goal:2, slots:1, cat:'Food & drink', top:true},
  {name:'Water',       icon:'droplet',     pal:'cloudyhaze',   goal:7, slots:0.5, cat:'Food & drink', top:true, chips:{unit:'oz', total:68, chunk:8, block:48}},
  {name:'Cook',        icon:'chef_hat',    pal:'peachwhisper', goal:4, slots:1, cat:'Food & drink'},
  {name:'Veggies',     icon:'carrot',      pal:'dreamysand',   goal:5, slots:0.5, cat:'Food & drink', chips:{unit:'servings', total:4, chunk:1, block:3}},
  {name:'Fruit',       icon:'apple',       pal:'peachwhisper', goal:5, slots:0.5, cat:'Food & drink', chips:{unit:'servings', total:3, chunk:1, block:2}},
  {name:'Protein',     icon:'egg',         pal:'cloudyhaze',   goal:5, slots:0.5, cat:'Food & drink', chips:{unit:'grams', total:100, chunk:20, block:80}},
  {name:'Good lunch',  icon:'salad',       pal:'gentlemist',   goal:4, slots:1, cat:'Food & drink'},
  {name:'Bake',        icon:'cake',        pal:'goldenglow',   goal:1, slots:2, cat:'Food & drink'},
  {name:'New recipe',  icon:'cookie',      pal:'softhoney',    goal:1, slots:2, cat:'Food & drink'},
  {name:'Slow coffee', icon:'coffee',      pal:'softhoney',    goal:3, slots:1, cat:'Food & drink'},
  {name:'Groceries',   icon:'shopping_cart',pal:'gentlemist',  goal:1, slots:1, cat:'Food & drink'},
  {name:'Calories',    icon:'clipboard_list',pal:'dreamysand', goal:6, slots:0.5, cat:'Food & drink', chips:{unit:'calories', total:2000, chunk:250, block:1750}},
  {name:'Pizza night', icon:'pizza',       pal:'peachwhisper', goal:1, slots:2, cat:'Food & drink'},
  /* Mind & spirit */
  {name:'Deep Work',   icon:'brain',       pal:'softhoney',    goal:4, slots:2, cat:'Mind & spirit', top:true},
  {name:'Meditate',    icon:'cloud',       pal:'gentlemist',   goal:5, slots:1, cat:'Mind & spirit'},
  {name:'Journal',     icon:'notebook_pen',pal:'dreamysand',   goal:3, slots:1, cat:'Mind & spirit'},
  {name:'Read',        icon:'book_open',   pal:'softhoney',    goal:3, slots:1, cat:'Mind & spirit', top:true},
  {name:'Study',       icon:'graduation_cap',pal:'gentlemist', goal:3, slots:2, cat:'Mind & spirit'},
  {name:'Language',    icon:'globe',       pal:'goldenglow',   goal:4, slots:1, cat:'Mind & spirit'},
  {name:'Scripture',   icon:'book_open',   pal:'cloudyhaze',   goal:5, slots:1, cat:'Mind & spirit'},
  {name:'Screen rest', icon:'eye',        pal:'peachwhisper', goal:5, slots:0.5, cat:'Mind & spirit', chips:{unit:'breaks', total:6, chunk:1, block:4}},
  {name:'Daily plan',  icon:'list_checks', pal:'dreamysand',   goal:5, slots:1, cat:'Mind & spirit'},
  {name:'Week plan',   icon:'calendar',   pal:'gentlemist',   goal:1, slots:1, cat:'Mind & spirit'},
  {name:'Puzzles',     icon:'puzzle',      pal:'goldenglow',   goal:2, slots:1, cat:'Mind & spirit'},
  {name:'Pray',        icon:'prayer',      pal:'cloudyhaze',   goal:5, slots:1, cat:'Mind & spirit'},
  {name:'Gratitude',   icon:'star',        pal:'softhoney',    goal:7, slots:0.5, cat:'Mind & spirit', chips:{unit:'moments', total:3, chunk:1, block:3}},
  /* People & pets */
  {name:'Family',      icon:'heart',       pal:'peachwhisper', goal:2, slots:1, cat:'People & pets', top:true},
  {name:'Social',      icon:'smile',       pal:'goldenglow',   goal:2, slots:3, cat:'People & pets', top:true},
  {name:'Call home',   icon:'phone',       pal:'gentlemist',   goal:1, slots:1, cat:'People & pets'},
  {name:'Date night',  icon:'landmark',    pal:'peachwhisper', goal:1, slots:3, cat:'People & pets'},
  {name:'Movie night', icon:'film',        pal:'dreamysand',   goal:1, slots:2, cat:'People & pets'},
  {name:'Kid time',    icon:'baby',        pal:'goldenglow',   goal:3, slots:1, cat:'People & pets'},
  {name:'Dog walk',    icon:'dog',         pal:'softhoney',    goal:7, slots:1, cat:'People & pets'},
  {name:'Pet time',    icon:'paw_print',   pal:'cloudyhaze',   goal:3, slots:1, cat:'People & pets'},
  {name:'Game night',  icon:'gamepad_2',   pal:'gentlemist',   goal:1, slots:2, cat:'People & pets'},
  {name:'Snail mail',  icon:'feather',     pal:'dreamysand',   goal:1, slots:1, cat:'People & pets'},
  {name:'Give back',   icon:'gift',        pal:'goldenglow',   goal:1, slots:2, cat:'People & pets'},
  {name:'Hosting',     icon:'house',       pal:'peachwhisper', goal:1, slots:3, cat:'People & pets'},
  {name:'Listen more', icon:'ear',         pal:'cloudyhaze',   goal:3, slots:1, cat:'People & pets'},
  /* Rest & recovery */
  {name:'Rest',        icon:'moon',        pal:'cloudyhaze',   goal:3, slots:1, cat:'Rest & recovery', top:true},
  {name:'Sleep by 10', icon:'bed',         pal:'gentlemist',   goal:5, slots:1, cat:'Rest & recovery'},
  {name:'Up early',    icon:'alarm_clock', pal:'goldenglow',   goal:5, slots:1, cat:'Rest & recovery'},
  {name:'Lunch break', icon:'armchair',    pal:'dreamysand',   goal:5, slots:1, cat:'Rest & recovery'},
  {name:'Bath night',  icon:'bath',        pal:'gentlemist',   goal:1, slots:1, cat:'Rest & recovery'},
  {name:'Unplug',      icon:'sofa',        pal:'softhoney',    goal:3, slots:1, cat:'Rest & recovery'},
  {name:'Breathe',     icon:'wind',        pal:'cloudyhaze',   goal:5, slots:0.5, cat:'Rest & recovery', chips:{unit:'breathers', total:5, chunk:1, block:3}},
  {name:'Meds',        icon:'pill',        pal:'peachwhisper', goal:7, slots:0.5, cat:'Rest & recovery', chips:{unit:'doses', total:2, chunk:1, block:2}},
  {name:'Checkup',     icon:'stethoscope', pal:'gentlemist',   goal:1, slots:1, cat:'Rest & recovery'},
  {name:'Sunlight',    icon:'sun',        pal:'goldenglow',   goal:5, slots:1, cat:'Rest & recovery'},
  {name:'Self-care',   icon:'scissors',    pal:'dreamysand',   goal:2, slots:1, cat:'Rest & recovery'},
  {name:'Power nap',   icon:'bed',         pal:'softhoney',    goal:2, slots:1, cat:'Rest & recovery'},
  /* Home & errands */
  {name:'Tidy',        icon:'sparkles',    pal:'cloudyhaze',   goal:4, slots:1, cat:'Home & errands', top:true},
  {name:'Admin',       icon:'inbox',       pal:'dreamysand',   goal:3, slots:1, cat:'Home & errands', top:true},
  {name:'Laundry',     icon:'shirt',       pal:'gentlemist',   goal:1, slots:1, cat:'Home & errands'},
  {name:'Fix it',      icon:'wrench',      pal:'goldenglow',   goal:1, slots:2, cat:'Home & errands'},
  {name:'DIY project', icon:'hammer',      pal:'peachwhisper', goal:1, slots:3, cat:'Home & errands'},
  {name:'Plants',      icon:'flower',      pal:'dreamysand',   goal:2, slots:1, cat:'Home & errands'},
  {name:'Garden',      icon:'sprout',      pal:'softhoney',    goal:2, slots:2, cat:'Home & errands'},
  {name:'Errands',     icon:'car',         pal:'gentlemist',   goal:1, slots:1, cat:'Home & errands'},
  {name:'Budget',      icon:'wallet',      pal:'goldenglow',   goal:1, slots:1, cat:'Home & errands'},
  {name:'Pay bills',   icon:'credit_card', pal:'cloudyhaze',   goal:1, slots:1, cat:'Home & errands'},
  {name:'Savings',     icon:'banknote',    pal:'dreamysand',   goal:1, slots:1, cat:'Home & errands'},
  {name:'Declutter',   icon:'folder',      pal:'peachwhisper', goal:1, slots:1, cat:'Home & errands'},
  {name:'Pack ahead',  icon:'backpack',    pal:'gentlemist',   goal:5, slots:1, cat:'Home & errands'},
  /* Create & play */
  {name:'Create',      icon:'palette',     pal:'gentlemist',   goal:2, slots:2, cat:'Create & play', top:true},
  {name:'Write',       icon:'pen',         pal:'dreamysand',   goal:3, slots:1, cat:'Create & play'},
  {name:'Practice',    icon:'music',       pal:'goldenglow',   goal:4, slots:1, cat:'Create & play'},
  {name:'Sing',        icon:'mic',         pal:'peachwhisper', goal:2, slots:1, cat:'Create & play'},
  {name:'Draw',        icon:'brush',       pal:'softhoney',    goal:3, slots:1, cat:'Create & play'},
  {name:'Photos',      icon:'camera',      pal:'cloudyhaze',   goal:2, slots:1, cat:'Create & play'},
  {name:'Scrapbook',   icon:'image',       pal:'gentlemist',   goal:1, slots:1, cat:'Create & play'},
  {name:'Side project',icon:'rocket',      pal:'goldenglow',   goal:2, slots:2, cat:'Create & play'},
  {name:'Code',        icon:'code',        pal:'dreamysand',   goal:2, slots:2, cat:'Create & play'},
  {name:'Adventure',   icon:'tent',        pal:'softhoney',    goal:1, slots:3, cat:'Create & play'},
  {name:'Explore',     icon:'compass',     pal:'peachwhisper', goal:1, slots:2, cat:'Create & play'},
  {name:'Fishing',     icon:'fish',        pal:'gentlemist',   goal:1, slots:3, cat:'Create & play'},
  {name:'Podcasts',    icon:'headphones',  pal:'cloudyhaze',   goal:3, slots:1, cat:'Create & play'},
  /* Work & growth */
  {name:'Inbox zero',  icon:'mail',        pal:'dreamysand',   goal:5, slots:1, cat:'Work & growth'},
  {name:'Log off by 6',icon:'laptop',      pal:'gentlemist',   goal:5, slots:1, cat:'Work & growth'},
  {name:'Reach out',   icon:'briefcase',   pal:'goldenglow',   goal:1, slots:1, cat:'Work & growth'},
  {name:'New skill',   icon:'lightbulb',   pal:'peachwhisper', goal:3, slots:1, cat:'Work & growth'},
  {name:'Out on time', icon:'clock',       pal:'cloudyhaze',   goal:5, slots:1, cat:'Work & growth'},
  {name:'Spending',    icon:'dollar_sign', pal:'softhoney',    goal:3, slots:1, cat:'Work & growth'},
  {name:'Plan a trip', icon:'plane',       pal:'gentlemist',   goal:1, slots:2, cat:'Work & growth'},
  {name:'Goal check',  icon:'flag',        pal:'dreamysand',   goal:1, slots:1, cat:'Work & growth'},
  {name:'Research',    icon:'glasses',     pal:'goldenglow',   goal:2, slots:1, cat:'Work & growth'},
];

/* ── voices ── */
const VOICES = {
  plain: {
    label:'Plain', heat:'NO FROSTING', sample:'Block recorded. 2 remaining this week.',
    tagline:'A weekly board for commitments. Drag blocks into buckets.',
    hint:'Drag a block onto its bucket to record it. Tap a block to toss it.',
    drop:['Recorded.','Block placed.','Logged.'],
    wrongBucket:(b)=>`That block belongs to ${b}.`,
    toss:['','',''],
    entry:(n)=>`${n} recorded.`,
    chipDone:'Daily target met. Block placed.',
    chipTick:'Noted.',
    ruIntro:(n)=>`${n} block${n>1?'s':''} unplaced. Review each one.`,
    ruDid:(c)=>`${c}: did this happen?`,
    ruYes:'Yes — record it', ruNo:'It didn’t happen',
    ruHowMany:'How many?',
    ruAdjust:(c,g)=>`${c}: keep the goal at ${g}, or adjust it?`,
    ruKeep:'Keep it', ruAdjustBtn:'Adjust',
    restackTitle:'Week complete.',
    restackBody:(d,g)=>`${d} of ${g} blocks placed. Reset the board for next week?`,
    restackBtn:'Reset the board',
    restacked:'New week ready.',
    notifTitle:'Kachunk', notifBody:'Roundup time. Review your blocks.',
    allDone:'All blocks placed.',
    empty:'No blocks configured. Open Settings.',
    perfect:'Goal met: all blocks placed.',
    goodnight:'Day closed.',
    nightIntro:'End of day. Tap each block that happened today.',
    newDay:'Yesterday’s board is still out. Starting fresh reviews what’s left.',
  },
  zesty: {
    label:'Zesty', heat:'DEFAULT · A LITTLE CHEEK', sample:'KACHUNK. That’s the sound of you actually doing the thing.',
    tagline:'The week you can hold. Blocks you can move. Nothing you can break.',
    hint:'Done a thing? Drag its block onto the bucket. Bored? Tap one and toss it. We won’t tell.',
    drop:['KACHUNK. Nice.','That’s the good sound.','Another one in the bucket. Look at you.','Filed. Beautifully.','The bucket approves.'],
    wrongBucket:(b)=>`Close! That one’s a ${b} block. Right church, wrong bucket.`,
    toss:['Wheee.','Very productive. Do it again.','Physics: free. Guilt: none.'],
    entry:(n)=>n>1?`${n} blocks, kachunked in bulk. Efficient.`:`One block, kachunked. Efficient.`,
    chipDone:'That counts as a whole block. In it goes. KACHUNK.',
    chipTick:'Small chunk in. Keep ’em coming.',
    ruIntro:(n)=>`Roundup time. ${n} block${n>1?'s are':' is'} still wandering the floor. Let’s ask them some questions.`,
    ruDid:(c)=>`Be honest — did ${c} happen?`,
    ruYes:'It happened ✓', ruNo:'Not this week',
    ruHowMany:'How many times, champ?',
    ruAdjust:(c,g)=>`${c} came up short at ${g}/week. Trim the goal, or run it back?`,
    ruKeep:'Run it back', ruAdjustBtn:'Trim it',
    restackTitle:'That’s a wrap.',
    restackBody:(d,g)=>`${d} of ${g} blocks bucketed. Zero shame either way — fresh blocks await.`,
    restackBtn:'Restack my week',
    restacked:'Fresh stack. New week. Same you, but with data.',
    notifTitle:'Kachunk 🧱', notifBody:'Roundup o’clock. Your blocks are loitering. Come deal with them.',
    allDone:'Every block bucketed. Absolute legend behavior.',
    empty:'No blocks yet. Hit Settings and give yourself something to drop.',
    perfect:'Full bucket. FULL. BUCKET.',
    goodnight:'Day banked. Goodnight.',
    nightIntro:'Goodnight roundup — tap every block that actually happened today. Then bed.',
    newDay:'New day, fresh floor. Yesterday’s blocks want a word before they move on.',
  },
  spicy: {
    label:'Extra Spicy', heat:'ROAST ME', sample:'Oh look who finally did a thing. The bucket nearly forgot you.',
    tagline:'Blocks don’t lie. Buckets don’t care about your excuses.',
    hint:'Drag it to the bucket when it’s ACTUALLY done. Tossing blocks around does not count and you know it.',
    drop:['Finally.','Was that so hard?','One down. The bucket remains unimpressed but I’m proud-ish.','Recorded. Don’t make it weird.'],
    wrongBucket:(b)=>`Wrong bucket. It says ${b} right there. RIGHT there.`,
    toss:['Yes, very busy, much productive.','That block has done nothing wrong and yet.','Play time won’t fill buckets, chief.'],
    entry:(n)=>n>1?`${n} at once? Suspicious. Recorded anyway.`:`One. Recorded. Baby steps.`,
    chipDone:'Fine, that’s a real block. Credit where due.',
    chipTick:'A small chunk. Riveting. Keep going.',
    ruIntro:(n)=>`Roundup. ${n} block${n>1?'s':''} just sitting there. Explain yourself.`,
    ruDid:(c)=>`${c}. Did it happen or are we lying to a habit app now?`,
    ruYes:'It happened, relax', ruNo:'No. Moving on.',
    ruHowMany:'Numbers. Now.',
    ruAdjust:(c,g)=>`${c} flopped at ${g}/week. Lower the bar or pretend next week is different?`,
    ruKeep:'Next week is different', ruAdjustBtn:'Lower the bar',
    restackTitle:'Week’s done. Somehow.',
    restackBody:(d,g)=>`${d} of ${g}. The blocks have seen things. Restack and try again.`,
    restackBtn:'Restack. Again.',
    restacked:'Clean slate. Don’t waste it.',
    notifTitle:'Kachunk 🌶️', notifBody:'Your blocks called. They’re bored. Roundup. Now.',
    allDone:'All bucketed?? Who ARE you.',
    empty:'Zero blocks. Bold strategy. Settings is that way.',
    perfect:'Perfect week. I have literally nothing to roast. Unsettling.',
    goodnight:'Done. Go to bed.',
    nightIntro:'Day’s over. Tap what ACTUALLY happened. No embellishing.',
    newDay:'It’s tomorrow. It has been for a while. Deal with yesterday?',
  },
  sugar: {
    label:'Be Kind', heat:'MAXIMUM POMPOMS', sample:'YESSS! Another block in the bucket!! You’re UNSTOPPABLE!!',
    tagline:'Every block you drop is a little victory parade! 🎉',
    hint:'Did the thing? Drop that gorgeous block in its bucket!! Or toss one around — you’ve earned playtime!',
    drop:['YES!! KACHUNK!!','You DID that!','Bucket: fed. You: incredible.','Another one!! I’m so proud!!','That’s my favorite sound!!'],
    wrongBucket:(b)=>`Ooh so close!! That cutie belongs in ${b}! You’ve got this!`,
    toss:['WHEEE!!','Block airlines, now boarding!!','Joy is productive too!!'],
    entry:(n)=>n>1?`${n} WHOLE BLOCKS?! Superstar!!`:`A WHOLE BLOCK!! Superstar!!`,
    chipDone:'DING DING! That’s a full block, superstar!!',
    chipTick:'Small chunk!! Every little bit counts!!',
    ruIntro:(n)=>`Roundup party!! ${n} little block${n>1?'s':''} to check in on. You’re doing amazing!`,
    ruDid:(c)=>`Did wonderful ${c} happen this week?!`,
    ruYes:'YES it did!!', ruNo:'Not this time (still love you)',
    ruHowMany:'How many?! Tell me tell me!',
    ruAdjust:(c,g)=>`${c} was a stretch at ${g} — and stretching is GROWTH! Adjust or go again?`,
    ruKeep:'GO AGAIN!!', ruAdjustBtn:'Right-size it 💜',
    restackTitle:'WEEK COMPLETE!!',
    restackBody:(d,g)=>`${d} of ${g} blocks!! Every single one is a win! Ready for a fresh stack?!`,
    restackBtn:'FRESH STACK!!',
    restacked:'New week, new blocks, same legend!! ✨',
    notifTitle:'Kachunk 💜', notifBody:'It’s Roundup time!! Your blocks miss you!!',
    allDone:'EVERY BLOCK IS HOME!! I’m crying!!',
    empty:'No blocks yet — let’s make some magic in Settings!!',
    perfect:'PERFECT WEEK!! Confetti forever!!',
    goodnight:'Goodnight, superstar!! 🌙',
    nightIntro:'Goodnight roundup!! Tap every block you did today — then sweet dreams!!',
    newDay:'A brand new day!! Let’s tuck yesterday in and start fresh!!',
  },
};

/* ── state ── */
const KEY = 'kachunk.v1';
let S = null;
const DEMO = new URLSearchParams(location.search).has('demo');

/* rich placeholder state for the sandbox + screenshot assets — never touches real storage */
function demoState(){
  const s = defaults();
  const day = 864e5, now = Date.now();
  const mk = (name, icon, hex, goal, slotSize) => ({id:uid(), name, icon, pal:'gentlemist', customHex:hex, shape:'cube', goal, slotSize});
  const cols = [
    mk('Move','dumbbell','#7C93A5',3,2), mk('Read','read','#DD7C54',5,1),
    mk('Water','droplet','#DFC289',7,1), mk('Rest','moon','#7E9B95',3,1), mk('Create','palette','#C98D7E',4,1),
  ];
  s.colors = cols;
  s.buckets = cols.map(c=>({id:uid(), colorId:c.id, name:c.name, notes:'', chips: c.name==='Water'?{unit:'glasses', total:8, chunk:1, block:8}:null}));
  s.settings.userName = 'Sam'; s.settings.blockPal = 'brand'; s.onboarded = true;
  // this week, mid-flight: start 3 days ago, ~half the blocks banked with spread timestamps
  s.week = {start:new Date(now-3*day).toISOString(), blocks:[], chips:{}};
  cols.forEach((c,ci)=>{
    const doneN = [2,3,4,1,2][ci];
    for(let i=0;i<c.goal;i++){
      const done = i < doneN;
      s.week.blocks.push({id:uid(), colorId:c.id, status:done?'dropped':'tray', via:done?'drag':null,
        ts:done ? new Date(now - (i%3)*day - 3600e3*(2+i)).toISOString() : null});
    }
  });
  // today: two planned, one already banked
  const tray = s.week.blocks.filter(b=>b.status==='tray');
  const banked = s.week.blocks.find(b=>b.status==='dropped');
  s.day = {date:dayKey(), maxSlots:8, celebrated:false, items:[
    {id:uid(), blockId:tray[0].id, colorId:tray[0].colorId, done:false, day:'today'},
    {id:uid(), blockId:tray[1].id, colorId:tray[1].colorId, done:false, day:'today'},
    {id:uid(), blockId:banked.id, colorId:banked.colorId, done:true, day:'today'},
  ]};
  // three finished weeks of history
  s.history = [1,2,3].map(w=>({
    start:new Date(now-(3+7*w)*day).toISOString(), end:new Date(now-(3+7*(w-1))*day).toISOString(),
    perColor: cols.map((c,ci)=>({colorId:c.id, name:c.name, pal:c.pal, customHex:c.customHex, icon:c.icon, goal:c.goal,
      done: Math.max(0, c.goal - ((w+ci)%3)), partial: (w+ci)%3===1 ? 1 : 0})),
  }));
  return s;
}

function defaults(){
  return {
    version:1, onboarded:false,
    settings:{voice:'zesty', roundupTime:'20:30', sound:true, theme:'dark', weekStartsOn:1, notifAsked:false, planTomorrow:false},
    colors:[],   // {id,name,icon,pal,shape,goal}
    buckets:[],  // {id,colorId,name,notes,chips:null|{unit,total,chunk,block}} (legacy saves: {target,countsAt})
    week:{start:null, blocks:[], chips:{}}, // blocks: {id,colorId,status,via,ts} chips: {bucketId:{'YYYY-MM-DD':n}}
    nextGoals:{}, history:[], lastRoundup:null,
    day:{date:null, mode:'grid', startMin:480, endMin:1320, slotMin:30, maxSlots:8, items:[], icalUrl:'', ical:[]}, // Day Builder: temporary plan, never reported
  };
}
function save(){ if(DEMO) return; try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function load(){
  if(DEMO){ S = demoState(); return; } // sandbox: seeded, in-memory, resets on refresh
  try{ const raw = localStorage.getItem(KEY); if(raw){ S = Object.assign(defaults(), JSON.parse(raw));
    (S.colors||[]).forEach(c=>{ if(PAL_MIGRATE[c.pal]) c.pal = PAL_MIGRATE[c.pal]; c.shape='cube'; if(!c.slotSize) c.slotSize=1; });
    S.day = Object.assign(defaults().day, S.day||{}); return; } }catch(e){}
  S = defaults();
}
const V = () => VOICES[S.settings.voice] || VOICES.zesty;

/* date helpers */
const dayKey = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; // local date, not UTC — "today" must not flip at 5pm
function weekStartDate(from=new Date()){
  const d = new Date(from); const dow = (d.getDay()-S.settings.weekStartsOn+7)%7;
  d.setHours(0,0,0,0); d.setDate(d.getDate()-dow); return d;
}
function fmtRange(startIso){
  const s = new Date(startIso); const e = new Date(s); e.setDate(e.getDate()+6);
  const f = d => d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  return `${f(s)} – ${f(e)}`;
}

/* week lifecycle */
function spawnWeek(){
  S.week = {start: weekStartDate().toISOString(), blocks:[], chips:{}};
  for(const c of S.colors){
    const goal = S.nextGoals[c.id] ?? c.goal;
    c.goal = goal;
    for(let i=0;i<goal;i++) S.week.blocks.push({id:uid(), colorId:c.id, status:'tray', via:null, ts:null});
  }
  S.nextGoals = {};
  save();
}
function trayBlocks(colorId=null){
  return S.week.blocks.filter(b=>b.status==='tray' && (!colorId || b.colorId===colorId));
}
function droppedCount(colorId){ return S.week.blocks.filter(b=>b.colorId===colorId && b.status==='dropped').length; }
function partialCount(colorId){
  const bucket = S.buckets.find(b=>b.colorId===colorId);
  if(!bucket || !bucket.chips) return 0;
  const cfg = chunkCfg(bucket.chips);
  const days = S.week.chips[bucket.id] || {};
  return Object.values(days).filter(n=>n>0 && n<cfg.perBlock).length;
}

/* ── "small chunks" (chips) config — normalize either shape:
   new  {unit,total,chunk,block}: real quantities, e.g. 2000 cal · chunk 250 · block 1000
   old  {target,countsAt}: N chunks a day, block at countsAt (pre-2026-07-17 saves)
   Derived: perDay = chunks per day, perBlock = chunks that fill one block. ── */
function chunkCfg(chips){
  if(!chips) return null;
  if(chips.total!==undefined){
    const chunk = Math.max(1, Math.round(+chips.chunk)||1);
    const total = Math.max(chunk, Math.round(+chips.total)||chunk);
    const block = Math.min(total, Math.max(chunk, Math.round(+chips.block)||total));
    return {unit:String(chips.unit||'').trim(), total, chunk, block,
      perDay: Math.max(1, Math.round(total/chunk)), perBlock: Math.max(1, Math.round(block/chunk))};
  }
  const perDay = Math.max(1, +chips.target||8);
  const perBlock = Math.max(1, Math.min(perDay, +chips.countsAt||perDay));
  return {unit:'', total:perDay, chunk:1, block:perBlock, perDay, perBlock};
}
const freshChunks = () => ({unit:'', total:8, chunk:1, block:8}); // default: 8 little reps = the day's block

/* ── sounds (WebAudio synth — no files) ── */
let AC = null;
function ac(){ if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); return AC; }
function sfx(kind, opt={}){
  if(!S.settings.sound) return;
  try{
    const ctx = ac(), t = ctx.currentTime;
    const out = (g0=0.2)=>{ const g = ctx.createGain(); g.connect(ctx.destination); return g; };
    if(kind==='tap'){
      const g = out(); const o = ctx.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(520,t); g.gain.setValueAtTime(0.07,t);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
      o.connect(g); o.start(t); o.stop(t+0.06);
    } else if(kind==='tick'){
      const g = out(); const o = ctx.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(640,t); g.gain.setValueAtTime(0.12,t);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
      o.connect(g); o.start(t); o.stop(t+0.09);
    } else if(kind==='drop'){
      // video-game success: thud + rising two-note chime + sparkle
      const g1 = out(); const o1 = ctx.createOscillator(); o1.type='triangle';
      o1.frequency.setValueAtTime(170,t); o1.frequency.exponentialRampToValueAtTime(60,t+0.1);
      g1.gain.setValueAtTime(0.45,t); g1.gain.exponentialRampToValueAtTime(0.001,t+0.14);
      o1.connect(g1); o1.start(t); o1.stop(t+0.15);
      [[659.25,0.05],[987.77,0.13]].forEach(([f,dt])=>{
        const g = out(); const o = ctx.createOscillator(); o.type='triangle';
        o.frequency.setValueAtTime(f,t+dt); g.gain.setValueAtTime(0.16,t+dt);
        g.gain.exponentialRampToValueAtTime(0.001,t+dt+0.18);
        o.connect(g); o.start(t+dt); o.stop(t+dt+0.2);
      });
      const gs = out(); const os = ctx.createOscillator(); os.type='sine';
      os.frequency.setValueAtTime(1975,t+0.2); gs.gain.setValueAtTime(0.07,t+0.2);
      gs.gain.exponentialRampToValueAtTime(0.001,t+0.32);
      os.connect(gs); os.start(t+0.2); os.stop(t+0.33);
    } else if(kind==='toss'){
      // bouncy boing
      const g = out(); const o = ctx.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(420,t); o.frequency.exponentialRampToValueAtTime(150,t+0.09);
      o.frequency.exponentialRampToValueAtTime(260,t+0.17);
      g.gain.setValueAtTime(0.14,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.connect(g); o.start(t); o.stop(t+0.21);
    } else if(kind==='impact'){
      const v = clamp(opt.v||0.4, 0.05, 1);
      const g = out(); const o = ctx.createOscillator(); o.type='triangle';
      o.frequency.setValueAtTime(120+60*v,t); o.frequency.exponentialRampToValueAtTime(55,t+0.07);
      g.gain.setValueAtTime(0.12*v,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.09);
      o.connect(g); o.start(t); o.stop(t+0.1);
    } else if(kind==='clink'){
      // blocks softly colliding: a woody knock with just a hint of tone — melodic, never chimey.
      // pitch scales with physical size: big blocks knock deep, little chunks tap high.
      const v = clamp(opt.v||0.5, 0.08, 1);
      const notes = [523.25,587.33,659.25]; // narrow set — variation, not melody
      const f = notes[Math.floor(Math.random()*notes.length)] * clamp(opt.pitch||1, 0.6, 2.2) * (1 + (Math.random()-.5)*0.015);
      const flt = ctx.createBiquadFilter(); flt.type='lowpass'; flt.frequency.value = 1500; flt.Q.value = 0.3;
      const g = out(); flt.connect(g);
      // the knock — a quick low thud carries the body of the sound (own path, own envelope)
      const kOut = out();
      const ko = ctx.createOscillator(); ko.type='triangle';
      ko.frequency.setValueAtTime(f*0.32, t); ko.frequency.exponentialRampToValueAtTime(f*0.2, t+0.045);
      kOut.gain.setValueAtTime(0.085*v, t); kOut.gain.exponentialRampToValueAtTime(0.0008, t+0.06);
      ko.connect(kOut);
      // the tone — short and quiet on top, decays fast so it taps instead of rings
      const o = ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(f, t);
      const o2 = ctx.createOscillator(); o2.type='sine'; o2.frequency.setValueAtTime(f*2.41, t);
      const g2 = ctx.createGain(); g2.gain.value = 0.12; o2.connect(g2); g2.connect(flt);
      o.connect(flt);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.04*v, t+0.006);
      g.gain.exponentialRampToValueAtTime(0.0008, t+0.085);
      ko.start(t); ko.stop(t+0.07);
      o.start(t); o.stop(t+0.1); o2.start(t); o2.stop(t+0.05);
    } else if(kind==='slide'){
      // sliding into today: soft descending shoop
      const g = out(); const o = ctx.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(680,t); o.frequency.exponentialRampToValueAtTime(220,t+0.22);
      g.gain.setValueAtTime(0.001,t); g.gain.exponentialRampToValueAtTime(0.12,t+0.05);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.26);
      o.connect(g); o.start(t); o.stop(t+0.27);
    } else if(kind==='fanfare'){
      [392,494,587,784].forEach((f,i)=>{
        const g = out(); const o = ctx.createOscillator(); o.type='triangle';
        o.frequency.setValueAtTime(f, t+i*0.11);
        g.gain.setValueAtTime(0.16, t+i*0.11); g.gain.exponentialRampToValueAtTime(0.001, t+i*0.11+0.22);
        o.connect(g); o.start(t+i*0.11); o.stop(t+i*0.11+0.24);
      });
    }
  }catch(e){}
}
const buzz = (ms=12) => { try{ navigator.vibrate && navigator.vibrate(ms); }catch(e){} };

/* ── toasts ── */
function toast(msg, {undo=null, ms=2600}={}){
  const w = $('#toastWrap');
  const t = document.createElement('div'); t.className='toast';
  t.innerHTML = `<span>${esc(msg)}</span>${undo?'<button class="undo">Undo</button>':''}`;
  if(undo) t.querySelector('.undo').onclick = ()=>{ undo(); t.remove(); };
  w.appendChild(t);
  setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(), 350); }, ms);
  while(w.children.length>3) w.firstChild.remove();
}

/* ── screens ── */
function show(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
  if(id==='#screen-floor'){ Floor.ensure(); Floor.resume(); } else { Floor.pause(); }
}

/* ── sheet ── */
const Sheet = {
  open(html, {onClose=null}={}){
    $('#sheet').innerHTML = `<div class="sheet-grab"></div>${html}`;
    $('#sheet').hidden = false; $('#scrim').hidden = false;
    this._onClose = onClose;
    $('#scrim').onclick = ()=>this.close();
  },
  close(){
    $('#sheet').hidden = true; $('#scrim').hidden = true;
    if(this._onClose){ const f = this._onClose; this._onClose=null; f(); }
  }
};

/* ═════════ UNDO — last recorded rep, popped off a small stack ═════════ */
const Undo = {
  stack:[],
  push(e){ this.stack.push(e); if(this.stack.length>40) this.stack.shift(); },
  clear(){ this.stack.length = 0; },
  pop(){
    while(this.stack.length){
      const e = this.stack.pop();
      if(e.type==='drop'){
        const block = S.week.blocks.find(b=>b.id===e.blockId);
        if(!block || block.status!=='dropped') continue; // stale (restacked / already undone) — try next
        Floor.undoDrop(e.blockId);
        const it = DayB.items().find(i=>i.blockId===e.blockId); if(it) it.done = false;
        S.day.celebrated = false; save();
        toast('Undone — block’s back on the floor.');
        return;
      }
      if(e.type==='chip'){
        const cur = (S.week.chips[e.bucketId]||{})[e.day]||0;
        if(!cur && !e.parentId) continue;
        if(cur) S.week.chips[e.bucketId][e.day] = cur-1;
        if(e.parentId){
          const p = S.week.blocks.find(b=>b.id===e.parentId);
          if(p && p.status==='dropped'){ p.status='tray'; p.via=null; p.ts=null; }
          const it = DayB.items().find(i=>i.blockId===e.parentId); if(it) it.done = false;
          S.day.celebrated = false;
        }
        save(); Floor.rebuild(); sfx('tick');
        toast('Small chunk undone.');
        return;
      }
    }
    toast('Nothing to undo.');
  }
};

/* ═════════ FULL-SCREEN CELEBRATION — confetti storm + the word (still no message boxes) ═════════ */
const Celebrate = {
  run(sub=''){
    if($('#celebrate')) return;
    const el = document.createElement('div'); el.id = 'celebrate'; el.className = 'celebrate';
    el.innerHTML = `<canvas></canvas><div class="cb-word">KACHUNK<span>.</span></div>${sub?`<div class="cb-sub">${esc(sub)}</div>`:''}`;
    document.body.appendChild(el);
    const cv = el.querySelector('canvas'); const x = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    const W = cv.width = innerWidth*dpr, H = cv.height = innerHeight*dpr;
    const pals = S.colors.length ? S.colors.map(c=>palFor(c)) : [{fill:'#DD7C54',light:'#F4C7BA',edge:'#B95F3D'}];
    const cols = pals.flatMap(p=>[p.fill,p.light,p.edge]).concat(['#DD7C54','#DFC289','#FFFFFF']);
    const ps = [];
    for(let i=0;i<170;i++) ps.push({
      x:Math.random()*W, y:-Math.random()*H*0.6, vx:(Math.random()-.5)*2.4*dpr, vy:(2+Math.random()*4.5)*dpr,
      s:(3+Math.random()*6.5)*dpr, rot:Math.random()*6.3, vr:(Math.random()-.5)*0.32,
      color:cols[Math.floor(Math.random()*cols.length)], shape:Math.random()<.3?'dot':'rect'});
    const t0 = performance.now();
    sfx('fanfare'); buzz(40);
    let dead = false;
    const kill = ()=>{ dead = true; el.remove(); };
    el.onpointerdown = kill; // tap to skip
    const tick = now=>{
      if(dead) return;
      const t = (now-t0)/1000;
      x.clearRect(0,0,W,H);
      for(const p of ps){
        p.x += p.vx; p.y += p.vy; p.vy += 0.05*dpr; p.rot += p.vr;
        x.save(); x.translate(p.x,p.y); x.rotate(p.rot);
        x.globalAlpha = clamp(2.8-t, 0, 1); x.fillStyle = p.color;
        if(p.shape==='dot'){ x.beginPath(); x.arc(0,0,p.s/2,0,6.3); x.fill(); }
        else x.fillRect(-p.s/2, -p.s*0.35, p.s, p.s*0.7);
        x.restore();
      }
      if(t<2.7) requestAnimationFrame(tick); else kill();
    };
    requestAnimationFrame(tick);
  }
};

/* ═════════ ONBOARDING ═════════ */
const OB = {
  step:0,
  draft:null,
  start(){
    this.step = 0;
    this.draft = { name:'', colors: [], palKey:'brand', roundupTime:'20:30', voice:'zesty', maxSlots:8 };
    this.pickEdit = null; this.newDraft = null; this.pickAll = false;
    show('#screen-onboard'); this.render();
  },
  steps(){ return ['name','pick','palette', ...this.draft.colors.map((c,i)=>'bucket:'+i), 'recap','voice','go']; },
  weeklyGoalSlots(){ return this.draft.colors.reduce((a,c)=>a+(c.goal*(c.slots||1)),0); },

  paint(bg, inkOverride){
    const sec = $('#screen-onboard');
    sec.style.background = bg || '';
    sec.style.setProperty('--obInk', inkOverride || 'var(--ink)');
    sec.classList.toggle('colored', !!bg);
  },

  render(){
    const steps = this.steps();
    $('#obSteps').innerHTML = steps.map((_,i)=>`<i class="${i<=this.step?'on':''}"></i>`).join('');
    const b = $('#obBody'); const d = this.draft;
    const key = steps[this.step];

    if(key==='name'){
      this.paint('#DFC289', '#33414D');
      b.innerHTML = `
        <h2 class="ob-title">First — what should we call you?</h2>
        <p class="ob-sub">Just a name. It stays on this device, like everything else here.</p>
        <input type="text" id="obName" value="${esc(d.name)}" placeholder="Your name" autocomplete="given-name"
          style="width:100%;border:2px solid var(--hairline);border-radius:14px;padding:15px 16px;font:inherit;font-size:17px;background:var(--surface);color:var(--ink);outline:none">`;
      const inp = $('#obName');
      inp.oninput = e=>d.name = e.target.value;
      inp.onkeydown = e=>{ if(e.key==='Enter') this.next(); };
      setTimeout(()=>inp.focus(), 80);
    }

    if(key==='pick'){
      this.paint('#DFC289', '#33414D');
      // choosing only — each pick gets its own setup page after the palette step
      const picked = c=>{ const p = palFor(c); return `<button type="button" class="pk-card on" data-unpick="${c.id}">
          <span class="swatch pk-sw" style="background:${p.fill};border-color:${p.edge};--swk:${iconInkFor(c,p.fill)}">${ic(c.icon)}</span>
          <span class="pk-name">${esc(c.name)}</span><span class="pk-act">✓</span></button>`; };
      const cardFor = st=>{
        const c = d.colors.find(x=>x.starter===st.name);
        if(c) return picked(c);
        return `<button type="button" class="pk-card" data-starter="${st.name}">${ic(st.icon)}<span class="pk-name">${st.name}</span><span class="pk-act">＋</span></button>`;
      };
      const customs = d.colors.filter(c=>!c.starter).map(picked).join('');
      const nd = this.newDraft;
      const newCard = nd ? (()=>{ const p = palFor(nd); return `<div class="pk-expand"><div class="bucket-card be-card be-new">
          <div class="bc-head">
            <button class="swatch" data-f="look" style="width:46px;height:46px;background:${p.fill};border-color:${p.edge};--swk:${iconInkFor(nd,p.fill)}" title="Change look">${ic(nd.icon)}</button>
            <input type="text" data-f="bname" placeholder="Name your bucket" aria-label="Bucket name" style="font-weight:700;font-size:17px">
          </div>
          <div class="set-note" style="padding:6px 2px 0">Icon + name together give the best starting guess — you'll set it up in a moment.</div>
          <div class="sheet-actions" style="margin-top:12px">
            <button class="btn btn-ghost" data-f="cancel" style="flex:none;padding:11px 16px">Cancel</button>
            <button class="btn btn-primary" data-f="create" style="flex:1">Add it</button>
          </div></div></div>`; })()
        : `<button type="button" class="pk-card" data-custom="1"><span class="pk-name">＋ Your own</span></button>`;
      let gridInner;
      if(this.pickAll){
        const cats = [...new Set(STARTERS.map(s=>s.cat))];
        gridInner = cats.map(cat=>`<div class="pk-cat">${cat}</div>`
          + STARTERS.filter(s=>s.cat===cat).map(cardFor).join('')).join('');
      } else {
        gridInner = STARTERS.filter(s=>s.top || d.colors.some(c=>c.starter===s.name)).map(cardFor).join('');
      }
      const moreCard = `<button type="button" class="pk-card pk-more" data-more="1">${ic(this.pickAll?'back':'sparkle')}<span class="pk-name">${this.pickAll?'Show fewer':`See all ${STARTERS.length}`}</span></button>`;
      b.innerHTML = `
        <h2 class="ob-title">Pick your buckets${d.name?', '+esc(d.name.trim().split(' ')[0]):''}</h2>
        <p class="ob-sub">A bucket is a loose plan, not a commitment. Choose your blocks now, then claim the blocks you complete as you go. That's it.</p>
        <div class="pk-grid">${gridInner}${customs}${moreCard}${newCard}</div>
        <div style="color:rgba(51,65,77,.72);font-size:13.5px">${d.colors.length ? d.colors.length+' of 6 picked — you’ll set each one up in a moment.' : 'Pick a few — six max, keeps the board easy to hold.'}</div>`;
      const more = $('#obBody .pk-card[data-more]');
      if(more) more.onclick = ()=>{ this.pickAll = !this.pickAll; this.render(); };
      $$('#obBody .pk-card[data-starter]').forEach(el=>el.onclick=()=>{
        if(d.colors.length>=6) return toast('Six buckets max — keep it holdable.');
        const st = STARTERS.find(x=>x.name===el.dataset.starter);
        d.colors.push({id:uid(), name:st.name, icon:st.icon, pal:st.pal, shape:'cube', goal:st.goal, slots:st.slots||1, chips:st.chips?{...st.chips}:null, starter:st.name});
        this.render();
      });
      $$('#obBody .pk-card[data-unpick]').forEach(el=>el.onclick=()=>{
        d.colors.splice(d.colors.findIndex(x=>x.id===el.dataset.unpick), 1);
        this.render();
      });
      const cu = $('#obBody .pk-card[data-custom]');
      if(cu) cu.onclick = ()=>{
        if(d.colors.length>=6) return toast('Six buckets max — keep it holdable.');
        this.newDraft = {id:uid(), name:'', icon:'star', pal:PALETTE[d.colors.length%6].key, shape:'cube'};
        this.render();
      };
      const ndRoot = $('#obBody .be-new');
      if(ndRoot){
        const nameI = ndRoot.querySelector('[data-f=bname]');
        nameI.value = nd.name||'';
        nameI.oninput = e=>{ nd.name = e.target.value; };
        const createIt = ()=>{
          const nm = (nd.name||'').trim(); if(!nm){ toast('Give it a name first.'); return; }
          const g = starterGuess(nm, nd.icon);
          d.colors.push({id:nd.id, name:nm, icon:nd.icon, pal:nd.pal, shape:'cube', goal:g.goal, slots:g.slots, chips:g.chips, starter:null});
          this.newDraft = null; this.render();
        };
        nameI.onkeydown = e=>{ if(e.key==='Enter') createIt(); };
        ndRoot.querySelector('[data-f=look]').onclick = ()=>openColorPicker(nd, ()=>this.render());
        ndRoot.querySelector('[data-f=create]').onclick = createIt;
        ndRoot.querySelector('[data-f=cancel]').onclick = ()=>{ this.newDraft = null; this.render(); };
        if(!nd.name) setTimeout(()=>nameI.focus(), 60);
      }
    }

    if(key && key.startsWith('bucket:')){
      const i = +key.split(':')[1];
      const c = d.colors[i];
      if(!c){ this.step = this.steps().indexOf('recap'); this.render(); return; }
      const p = palFor(c);
      this.paint(p.fill, inkFor(p.fill));
      b.innerHTML = `
        <div class="ob-count" style="color:var(--obInk);opacity:.65">Bucket ${i+1} of ${d.colors.length}</div>
        <h2 class="ob-title">Make ${esc(c.name)} yours</h2>
        <p class="ob-sub">Tweak anything — or just keep going.</p>
        ${bucketEditorHTML(c, {draft:true, actions:false})}`;
      const be = $('#obBody .be-card[data-be]');
      if(be) bindBucketEditor(be, c, {draft:true, draftColors:d.colors,
        onChange: ()=>this.render(), onClose: ()=>{}});
    }

    if(key==='palette'){
      this.paint('#F8F6F2', '#33414D');
      d.customPal = d.customPal||[];
      if(d.palKey!=='custom' || d.customPal.length===6) applyBlockPalette(d.palKey||'brand', d.colors, d.customPal);
      b.innerHTML = `
        <h2 class="ob-title">Choose your block colors</h2>
        <p class="ob-sub">Six colors that go together. Your buckets wear them in order — you can re-pick any time in Settings.</p>
        ${BLOCK_PALETTES.map(bp=>palCardHTML(bp, (d.palKey||'brand')===bp.key)).join('')}
        ${(S.settings.savedPals||[]).map(sp=>savedCardHTML(sp, (d.palKey||'brand')==='saved:'+sp.id)).join('')}
        ${customCardHTML(d.customPal, (d.palKey||'brand')==='custom')}
        <div class="set-note" style="padding:6px 4px">Mono makes every block the same — the icons carry the meaning.</div>`;
      $$('#obBody .pal-card').forEach(el=>el.onclick=()=>{
        d.palKey = el.dataset.bp;
        if(d.palKey!=='custom'){ applyBlockPalette(d.palKey, d.colors); this.render(); return; }
        this.render();
        openCustomPicker(()=>d.customPal, sel=>{ d.customPal = sel; },
          sel=>applyBlockPalette('custom', d.colors, sel),
          ()=>this.render(),
          key=>{ d.palKey = key; applyBlockPalette(key, d.colors); });
      });
      bindSavedPalDeletes('#obBody', delId=>{
        if(d.palKey==='saved:'+delId){ d.palKey = 'brand'; applyBlockPalette('brand', d.colors); }
        this.render();
      });
    }

    if(key==='recap'){
      this.paint('#33414D', '#F3EFE8');
      const goalSlots = this.weeklyGoalSlots();
      const capacity = d.maxSlots*7;
      const fits = goalSlots <= capacity;
      b.innerHTML = `
        <h2 class="ob-title">Does the week fit?</h2>
        <p class="ob-sub">Your goals, in day-slots — against what one of your days can hold.</p>
        <div class="paper-list" id="recapList">${d.colors.map(c=>{ if(this.recapEdit===c.id) return bucketEditorHTML(c, {draft:true}); const p = palFor(c); return `
          <div class="recap-row" data-ord="${c.id}" style="background:${p.fill}">
            <span class="drag-h" style="color:rgba(51,65,77,.5)" aria-label="Drag to reorder">⠿</span>
            <span class="swatch" style="background:${p.light};border:none;width:32px;height:32px;border-radius:10px;--swk:${iconInkFor(c, p.light)}">${ic(c.icon)}</span>
            <strong style="flex:1;color:#33414D">${esc(c.name)}</strong>
            <span class="mono" style="font-size:12.5px;color:rgba(51,65,77,.65)">${fmtSlots(c.slots||1)} · ${c.goal}×/wk = ${c.goal*(c.slots||1)}</span>
            <span class="cr-pencil" style="color:rgba(51,65,77,.55)">${ic('pen')}</span>
          </div>`; }).join('')}</div>
        <div class="bc-label" style="margin-top:18px">Slots you'll give one day</div>
        <div style="display:flex;align-items:center;gap:14px">
          <input type="range" id="rcSlider" min="2" max="16" step="1" value="${d.maxSlots}" style="flex:1;accent-color:var(--ink)">
          <span class="mono" style="font-size:20px;min-width:34px;text-align:center" id="rcVal">${d.maxSlots}</span>
        </div>
        <div class="fit-card ${fits?'ok':'over'}">
          <div><strong>${goalSlots}</strong> slots of goals per week</div>
          <div><strong>${capacity}</strong> slots you'd have (${d.maxSlots} × 7 days)</div>
          <div class="fit-verdict">${fits ? '✓ It fits — with '+(capacity-goalSlots)+' slots of air.' : '✕ Over by '+(goalSlots-capacity)+' — shrink a goal or give days more room.'}</div>
        </div>`;
      $('#rcSlider').oninput = e=>{ d.maxSlots = +e.target.value; this.render(); };
      $$('#recapList .recap-row').forEach(row=>{
        const c = d.colors.find(x=>x.id===row.dataset.ord);
        row.onclick = e=>{
          if(e.target.closest('.drag-h')) return;
          this.recapEdit = (this.recapEdit===c.id) ? null : c.id;
          this.render();
        };
      });
      const beRecap = $('#recapList .be-card[data-be]');
      if(beRecap){
        const c = d.colors.find(x=>x.id===beRecap.dataset.be);
        bindBucketEditor(beRecap, c, {draft:true, draftColors:d.colors,
          onChange: ()=>this.render(), onClose: ()=>{ this.recapEdit = null; }});
      }
      enableReorder($('#recapList'), ids=>{
        d.colors.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));
        if(d.palKey && d.palKey!=='custom') applyBlockPalette(d.palKey, d.colors, d.customPal); // colors follow the new order
        else if(d.customPal && d.customPal.length===6) applyBlockPalette('custom', d.colors, d.customPal);
        this.render();
      });
    }

    if(key==='voice'){
      this.paint(null);
      b.innerHTML = `
        <h2 class="ob-title">One notification. Yours.</h2>
        <p class="ob-sub">The Roundup — a once-a-day nudge to reconcile stray blocks. That's the only ping Kachunk will ever send.</p>
        <div class="set-group"><h3>The Roundup</h3>
          <div class="set-card">
            <div class="set-row"><span class="grow">Daily nudge at</span>
              <input type="time" id="obTime" value="${d.roundupTime}"></div>
          </div>
        </div>
        <div class="set-group"><h3>Voice</h3>
          ${Object.entries(VOICES).map(([k,v])=>`
            <button class="voice-card ${d.voice===k?'on':''}" data-v="${k}">
              <span class="vc-name">${v.label} <span class="heat">${v.heat}</span></span>
              <span class="vc-line">“${v.sample}”</span>
            </button>`).join('')}
        </div>`;
      $('#obTime').onchange = e=>d.roundupTime = e.target.value || '20:30';
      $$('#obBody .voice-card').forEach(el=>el.onclick=()=>{ d.voice = el.dataset.v; this.render(); });
    }

    if(key==='go'){
      this.paint('#F8F6F2', '#33414D');
      const first = d.name ? esc(d.name.trim().split(' ')[0]) : '';
      const blocks = d.colors.reduce((a,c)=>a+c.goal, 0);
      b.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:9vh">
          <div class="mark-block" aria-hidden="true"><b>k</b><span>.</span></div>
          <h2 class="ob-title">You're ready${first?', '+first:''}.</h2>
          <p class="ob-sub mono" style="margin:2px 0 18px;opacity:.75">${d.colors.length} bucket${d.colors.length===1?'':'s'} · ${blocks} blocks a week</p>
          <p class="ob-sub" style="max-width:300px">Do the thing, drop the block, hear the sound. Nothing here can break.</p>
        </div>`;
    }
    $('#obNext').textContent = key==='go' ? 'KACHUNK — let’s go' : 'Next';
    $('#obNext').classList.toggle('obnext-ink', key==='go');
  },

  next(){
    const steps = this.steps();
    const key = steps[this.step];
    if(key==='pick'){
      this.draft.colors = this.draft.colors.filter(c=>c.name.trim());
      if(!this.draft.colors.length) return toast('Pick at least one bucket to get blocks.');
    }
    if(this.step < this.steps().length-1){ this.step++; this.render(); return; }
    const d = this.draft;
    S.settings.userName = (d.name||'').trim();
    S.colors = d.colors.map(c=>({id:c.id, name:c.name.trim(), icon:c.icon, pal:c.pal, customHex:c.customHex||null, shape:'cube', goal:c.goal, slotSize:c.slots||1}));
    S.buckets = d.colors.map(c=>({id:uid(), colorId:c.id, name:(c.bucketName||c.name).trim(), notes:c.notes||'', chips:c.chips||null}));
    S.settings.roundupTime = d.roundupTime; S.settings.voice = d.voice;
    S.settings.blockPal = d.palKey||'brand';
    if(d.customPal && d.customPal.length) S.settings.customPal = d.customPal;
    S.day.maxSlots = d.maxSlots;
    S.onboarded = true;
    if('Notification' in window && Notification.permission==='default' && !S.settings.notifAsked){
      S.settings.notifAsked = true;
      try{ Notification.requestPermission(); }catch(e){}
    }
    this.paint(null);
    spawnWeek(); save();
    show('#screen-floor'); Floor.rebuild();

  },
  back(){ if(this.step===0){ this.paint(null); show('#screen-splash'); return; } this.step--; this.render(); }
};

/* ── inline bucket editor — expands inside the card (settings rows + recap rows), no modal ── */
const fmtSlots = v => v===1 ? '1 slot' : `${v} slots`;
/* the size control's mockup block: the bucket's own block, scaled like the physics floor scales it */
function drawSizeBlock(cv, c, v){
  if(!cv) return;
  const x = cv.getContext('2d');
  x.setTransform(2,0,0,2,0,0); // canvas is @2x of 150×166 css
  const p = palFor(c);
  // TRUE floor size: same math the physics floor uses, so what you see is what drops
  const base = clamp(Math.min(Math.min(window.innerWidth,520), 520)/9, 38, 54);
  const size = base * (1 + 0.22*(v-1));
  const img = iconImage(c.icon, iconInkFor(c, p.fill));
  const draw = ()=>{ x.clearRect(0,0,150,166); drawBlockShape(x, 75, 76, size, 'cube', p, -0.07, img); };
  if(img.complete) draw(); else img.addEventListener('load', draw, {once:true});
}
function starterGuess(name, icon){
  const n = (name||'').trim().toLowerCase();
  let cands = n ? STARTERS.filter(s=>{ const sn=s.name.toLowerCase(); return sn===n || n.includes(sn) || sn.includes(n); }) : [];
  if(cands.length>1){ const im = cands.find(s=>s.icon===icon); if(im) cands = [im]; }
  const st = cands[0] || (icon!=='star' && STARTERS.find(s=>s.icon===icon)) || null; // 'star' is the untouched default — no signal
  return st ? {goal:st.goal, slots:st.slots||1, chips:st.chips?{...st.chips}:null}
            : {goal:3, slots:1, chips:null};
}

function bucketEditorHTML(c, opts={}){
  const isDraft = !!opts.draft;
  const bk = opts.bucket || null;
  const chipsHost = isDraft ? c : bk;
  const slotKey = isDraft ? 'slots' : 'slotSize';
  const p = palFor(c);
  const goal = isDraft ? c.goal : (S.nextGoals[c.id] ?? c.goal);
  const slots = c[slotKey]||1;
  return `<div class="bucket-card be-card" data-be="${c.id}" data-ord="${c.id}">
    <div class="bc-head">
      <button class="swatch" data-f="look" style="width:46px;height:46px;background:${p.fill};border-color:${p.edge};--swk:${iconInkFor(c,p.fill)}" title="Change look">${ic(c.icon)}</button>
      <input type="text" data-f="bname" value="${esc(c.name)}" aria-label="Bucket name" style="font-weight:700;font-size:17px">
    </div>
    ${chipsHost ? `<div class="mode-pick" style="margin-top:14px">
      <button type="button" class="mode-card ${!chipsHost.chips?'on':''}" data-mode="chunk">
        <strong>Start to Finish</strong>
        <span>One block of time — gym, coffee, meditation.</span>
      </button>
      <button type="button" class="mode-card ${chipsHost.chips?'on':''}" data-mode="allday">
        <strong>Ongoing</strong>
        <span>Small chunks that add up — water, calories, gratitude.</span>
      </button>
    </div>
    <div data-f="chipcfg">${chipConfigHTML(chipsHost.chips, goal, c.name)}</div>` : ''}
    <div class="be-group">
      <div class="be-lab">How big is your block?</div>
      <div class="size-pick">
        <button data-f="s-" aria-label="Smaller">−</button>
        <div class="size-stage">
          <canvas data-f="scv" width="300" height="332" aria-hidden="true"></canvas>
          <div class="size-cap mono" data-f="scap">${fmtSlots(slots)}</div>
        </div>
        <button data-f="s+" aria-label="Bigger">＋</button>
      </div>
      <div class="be-note">Bigger blocks take more of your day.</div>
    </div>
    ${(chipsHost&&chipsHost.chips)?'':`<div class="be-group">
      <div class="be-lab">How many times a week?</div>
      <div class="stepper stepper-center"><button data-f="g-">−</button><span class="val">${goal}</span><button data-f="g+">＋</button></div>
      <div class="be-note">This adds blocks into your stack.${isDraft?'':' Changes land when you restack.'}</div>
    </div>`}
    ${opts.actions===false?'':`<div class="sheet-actions" style="margin-top:14px">
      <button class="btn-danger" data-f="del" style="flex:none;padding:11px 16px">Remove</button>
      <button class="btn btn-primary" data-f="done" style="flex:1">Done</button>
    </div>`}
  </div>`;
}

function bindBucketEditor(root, c, opts={}){
  if(!root || !c) return;
  const isDraft = !!opts.draft;
  const bk = opts.bucket || null;
  const chipsHost = isDraft ? c : bk;
  const slotKey = isDraft ? 'slots' : 'slotSize';
  const onChange = opts.onChange || (()=>{});
  const onClose = opts.onClose || (()=>{});
  const commit = ()=>{ if(!isDraft) save(); onChange(); };   // onChange re-renders the host list
  const f = k => root.querySelector(`[data-f="${k}"]`);
  const on = (k,fn)=>{ const el = f(k); if(el) el.onclick = fn; };
  const setGoal = v=>{ if(isDraft){ c.goal = clamp(v,1,14); } else { S.nextGoals[c.id] = clamp(v,1,14); } };
  on('look', ()=>openColorPicker(c, ()=>commit()));
  f('bname').onchange = e=>{
    const nm = e.target.value.trim(); if(!nm) return;
    c.name = nm; if(isDraft) c.bucketName = nm; if(bk) bk.name = nm;
    commit();
  };
  on('g-', ()=>{ setGoal((isDraft ? c.goal : (S.nextGoals[c.id]??c.goal))-1); commit(); });
  on('g+', ()=>{ setGoal((isDraft ? c.goal : (S.nextGoals[c.id]??c.goal))+1); commit(); });
  on('s-', ()=>{ c[slotKey] = Math.max(0.5,(c[slotKey]||1)-0.5); commit(); });
  on('s+', ()=>{ c[slotKey] = Math.min(8,(c[slotKey]||1)+0.5); commit(); });
  drawSizeBlock(f('scv'), c, c[slotKey]||1);
  if(chipsHost){
    root.querySelectorAll('.mode-card').forEach(btn=>btn.onclick = ()=>{
      const toAllday = btn.dataset.mode==='allday';
      if(toAllday && !chipsHost.chips) setGoal(7); // ongoing defaults to everyday
      chipsHost.chips = toAllday ? (chipsHost.chips||freshChunks()) : null;
      commit();
    });
    bindChipConfig(root, ()=>chipsHost.chips, ()=>commit(), {set:setGoal});
  }
  on('del', ()=>{
    if(!confirm(`Remove the ${c.name} bucket${isDraft?'':' and its blocks'}?`)) return;
    if(isDraft){ opts.draftColors.splice(opts.draftColors.indexOf(c),1); }
    else {
      S.colors = S.colors.filter(x=>x.id!==c.id);
      S.buckets = S.buckets.filter(b=>b.colorId!==c.id);
      S.week.blocks = S.week.blocks.filter(b=>b.colorId!==c.id);
    }
    onClose(); commit();
  });
  on('done', ()=>{ onClose(); onChange(); });
}

/* horizontal drag-to-reorder (palette preview dots) */
function enableReorderX(list, onCommit){
  if(!list) return;
  list.querySelectorAll('.drag-h').forEach(h=>{
    h.style.touchAction = 'none';
    let item = null, startX = 0;
    h.addEventListener('pointerdown', e=>{
      item = h.closest('[data-ord]'); if(!item) return;
      e.preventDefault(); e.stopPropagation();
      try{ h.setPointerCapture(e.pointerId); }catch(_){}
      startX = e.clientX; item.classList.add('dragging');
    });
    h.addEventListener('pointermove', e=>{
      if(!item) return;
      item.style.transform = `translateX(${e.clientX-startX}px)`;
      const sibs = [...list.querySelectorAll('[data-ord]')].filter(x=>x!==item);
      for(const s of sibs){
        const r = s.getBoundingClientRect(), mid = r.left + r.width/2;
        const before = !!(item.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_PRECEDING);
        if(before && e.clientX < mid){ list.insertBefore(item, s); startX = e.clientX; item.style.transform=''; break; }
        if(!before && e.clientX > mid){ list.insertBefore(item, s.nextSibling); startX = e.clientX; item.style.transform=''; break; }
      }
    });
    const end = ()=>{
      if(!item) return;
      item.classList.remove('dragging'); item.style.transform = '';
      onCommit([...list.querySelectorAll('[data-ord]')].map(x=>x.dataset.ord));
      item = null;
    };
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
  });
}

/* pointer-based drag-to-reorder for card lists (works on touch) */
function enableReorder(list, onCommit){
  if(!list) return;
  list.querySelectorAll('.drag-h').forEach(h=>{
    h.style.touchAction = 'none';
    let item = null, startY = 0;
    h.addEventListener('pointerdown', e=>{
      item = h.closest('[data-ord]'); if(!item) return;
      e.preventDefault(); e.stopPropagation();
      try{ h.setPointerCapture(e.pointerId); }catch(_){}
      startY = e.clientY; item.classList.add('dragging');
    });
    h.addEventListener('pointermove', e=>{
      if(!item) return;
      item.style.transform = `translateY(${e.clientY-startY}px)`;
      const sibs = [...list.querySelectorAll('[data-ord]')].filter(x=>x!==item);
      for(const s of sibs){
        const r = s.getBoundingClientRect(), mid = r.top + r.height/2;
        const before = !!(item.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_PRECEDING);
        if(before && e.clientY < mid){ list.insertBefore(item, s); startY = e.clientY; item.style.transform=''; break; }
        if(!before && e.clientY > mid){ list.insertBefore(item, s.nextSibling); startY = e.clientY; item.style.transform=''; break; }
      }
    });
    const end = ()=>{
      if(!item) return;
      item.classList.remove('dragging'); item.style.transform = '';
      onCommit([...list.querySelectorAll('[data-ord]')].map(x=>x.dataset.ord));
      item = null;
    };
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
  });
}

/* ── appearance picker: palette + custom hex + 100-icon library ── */
function openColorPicker(c, onDone){
  const cur = palFor(c);
  const lib = (typeof ICON_LIBRARY!=='undefined') ? ICON_LIBRARY : Object.keys(ICONS);
  const iconGrid = q => lib.filter(n=>!q || n.includes(q)).slice(0,120).map(n=>`
    <button class="iconpick ${c.icon===n?'on':''}" data-i="${n}" title="${n.replace(/_/g,' ')}"
      style="width:44px;height:44px;border-radius:12px;border:2px solid ${c.icon===n?'var(--ink)':'var(--hairline)'};background:var(--surface);cursor:pointer;display:inline-flex;align-items:center;justify-content:center">
      <svg viewBox="0 0 24 24" style="width:21px;height:21px;stroke:var(--ink);stroke-width:1.2;fill:none;stroke-linecap:round;stroke-linejoin:round">${ICONS[n]||ICONS.star}</svg>
    </button>`).join('');
  Sheet.open(`
    <h3>Looks</h3>
    <p class="sh-sub">Color + icon. The palette keeps things calm — or go rogue with your own hex.</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px">${(()=>{
      // offer the ACTIVE palette's six, not always the pastels (draft palette mid-onboarding)
      const inOB = typeof OB!=='undefined' && OB.draft && document.querySelector('#screen-onboard.active');
      const key = inOB ? (OB.draft.palKey||'brand') : (S.settings.blockPal||'brand');
      if(key==='pastel') return PALETTE.map(p=>`
        <button class="pickdot" data-k="${p.key}" title="${p.name}" aria-label="${p.name}" style="width:46px;height:46px;border-radius:14px;background:${p.fill};border:3px solid ${(!c.customHex&&c.pal===p.key)?'var(--ink)':p.edge};cursor:pointer"></button>`).join('');
      let hx;
      if(key==='custom'){ const cp = inOB ? OB.draft.customPal : S.settings.customPal; hx = (cp&&cp.length===6)?cp:blockPalByKey('brand').hex; }
      else if(key.startsWith('saved:')){ const sp=(S.settings.savedPals||[]).find(p=>'saved:'+p.id===key); hx=(sp&&sp.hex)||blockPalByKey('brand').hex; }
      else hx = blockPalByKey(key).hex;
      return hx.map(h=>`
        <button class="pickdot" data-hex="${h}" aria-label="${h}" style="width:46px;height:46px;border-radius:14px;background:${h};border:3px solid ${c.customHex===h?'var(--ink)':shade(h,-0.3)};cursor:pointer"></button>`).join('');
    })()}
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-top:14px">
      <input type="color" id="pickCustom" value="${c.customHex||cur.fill}" aria-label="Custom color" style="width:46px;height:46px;border:2px solid var(--hairline);border-radius:12px;padding:2px;background:var(--surface);cursor:pointer">
      <input type="text" id="pickHex" class="mono" value="${c.customHex||''}" placeholder="#A1B2C3" maxlength="7" aria-label="Hex code" style="flex:1;min-width:0;border:2px solid var(--hairline);border-radius:10px;padding:10px 12px;font:inherit;background:var(--inset);color:var(--ink)">
      <button class="btn btn-primary" id="pickUse" style="padding:11px 18px">Use it</button>
    </div>
    <div class="bc-label" style="margin-top:16px">Icon color</div>
    <div class="seg segsw" id="pickInk">${(eff=>`
      <button data-k="ink" class="${eff==='ink'?'on':''}" aria-label="Ink" title="Ink"><i style="background:#33414D;box-shadow:inset 0 0 0 1px var(--hairline)"></i></button>
      <button data-k="paper" class="${eff==='paper'?'on':''}" aria-label="Paper" title="Paper"><i style="background:#FDFBF7;box-shadow:inset 0 0 0 1px var(--hairline)"></i></button>`)(c.iconInk || (inkFor(cur.fill)==='#33414D'?'ink':'paper'))}
    </div>
    <div class="bc-label" style="margin-top:16px">Icon — ${lib.length} to choose from</div>
    <input type="search" id="iconSearch" placeholder="search icons…" style="width:100%;border:2px solid var(--hairline);border-radius:10px;padding:9px 12px;font:inherit;background:var(--inset);color:var(--ink);margin-bottom:10px">
    <div id="iconGrid" style="display:flex;flex-wrap:wrap;gap:8px;max-height:240px;overflow-y:auto">${iconGrid('')}</div>`);
  const bindIcons = ()=>{
    $$('#iconGrid .iconpick').forEach(el=>el.onclick = ()=>{
      c.icon = el.dataset.i;
      if(/^(New thing|My thing)$/.test((c.name||'').trim()) || !(c.name||'').trim()){
        c.name = iconNiceName(el.dataset.i);
        const bk = S.buckets.find(b=>b.colorId===c.id); if(bk) bk.name = c.name;
        if(c.bucketName!==undefined) c.bucketName = c.name;
      }
      onDone(); Sheet.close();
    });
  };
  bindIcons();
  $$('#pickInk button').forEach(el=>el.onclick = ()=>{
    c.iconInk = el.dataset.k;
    $$('#pickInk button').forEach(b=>b.classList.toggle('on', b===el));
    onDone(); // repaint the host behind the sheet; stay open — color/icon are still being chosen
  });
  $('#iconSearch').oninput = e=>{ $('#iconGrid').innerHTML = iconGrid(e.target.value.trim().toLowerCase().replace(/[ -]/g,'_')); bindIcons(); };
  $$('.pickdot').forEach(el=>el.onclick=()=>{
    if(el.dataset.hex){ c.customHex = el.dataset.hex; }
    else { c.pal = el.dataset.k; delete c.customHex; }
    Sheet.close(); onDone();
  });
  $('#pickCustom').oninput = e=>{ $('#pickHex').value = e.target.value.toUpperCase(); };
  $('#pickUse').onclick = ()=>{
    const hex = ($('#pickHex').value || $('#pickCustom').value || '').trim();
    if(!/^#[0-9a-fA-F]{6}$/.test(hex)) return toast('Hex wants to look like #A1B2C3.');
    c.customHex = hex.toUpperCase(); Sheet.close(); onDone();
  };
}

/* shape preview drawing (used in onboarding + settings) */
function drawShapePreview(cv, shape, pal){
  const x = cv.getContext('2d'); const w=cv.width, h=cv.height;
  x.clearRect(0,0,w,h);
  drawBlockShape(x, w/2, h/2+2, 34, shape, pal, 0);
}

/* core 3D glossy block painter — toy brick with sheen that sweeps as it spins.
   Light is fixed in WORLD space (top-left), so rotation animates the highlight. */
function inkFor(fill){ // icon/text color on a block face — leans paper on mid-tones (founder call)
  const n = parseInt(fill.slice(1),16), r=n>>16, g=(n>>8)&255, b=n&255;
  return (0.299*r+0.587*g+0.114*b) > 165 ? '#33414D' : '#FDFBF7';
}
/* icon → a starter bucket name that goes with it */
const ICON_NAMES = {dumbbell:'Move', bike:'Ride', footprints:'Walk', activity:'Cardio', heart:'Care', prayer:'Pray',
  droplet:'Water', pill:'Meds', brain:'Deep work', stethoscope:'Health', bed:'Sleep', moon:'Rest', alarm_clock:'Up early',
  bath:'Unwind', salad:'Eat well', apple:'Snack smart', carrot:'Veggies', egg:'Protein', utensils:'Meal prep', coffee:'Slow coffee',
  pen:'Write', laptop:'Focus', code:'Code', briefcase:'Work', mail:'Inbox zero', inbox:'Admin', folder:'Organize',
  lightbulb:'Ideas', calendar:'Plan', clock:'On time', phone:'Call someone', house:'Home', wrench:'Fix it', hammer:'Projects',
  dog:'Dog walk', cat:'Cat time', baby:'Kid time', flower:'Garden', leaf:'Outside', sprout:'Grow', trees:'Nature', sun:'Sunlight',
  music:'Practice', guitar:'Guitar', palette:'Create', brush:'Paint', camera:'Photos', film:'Film', headphones:'Listen',
  mic:'Record', puzzle:'Puzzle', party_popper:'Celebrate', sparkles:'Tidy', trophy:'Win', medal:'Train',
  gift:'Give', cake:'Bake', cookie:'Treat', pizza:'Cook', wallet:'Budget', banknote:'Save', car:'Errands', plane:'Travel prep',
  globe:'Language', compass:'Explore', mountain:'Hike', tent:'Adventure', waves:'Swim', smile:'Check in', glasses:'Study',
  shirt:'Laundry', scissors:'Groom', umbrella:'Prepared', key:'Lock up', feather:'Journal', eye:'Screen break', ear:'Listen up',
  wind:'Breathe', armchair:'Sit less', sofa:'Reset the room', backpack:'Pack', landmark:'Errand run', image:'Scrapbook',
  fish:'Aquarium', rocket:'Ship it', read:'Read', book:'Read'};
function iconNiceName(key){
  return ICON_NAMES[key] || (key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g,' '));
}

/* per-bucket icon ink override: auto (by luminance) | ink | paper */
function iconInkFor(c, fill){
  if(c && c.iconInk==='ink') return '#33414D';
  if(c && c.iconInk==='paper') return '#FDFBF7';
  return inkFor(fill);
}
function drawBlockShape(x, cx, cy, size, shape, pal, angle, iconImg=null, label=null){
  x.save(); x.translate(cx, cy); x.rotate(angle);
  const r = size*0.26, depth = size*0.14;
  // world-down expressed in local (rotated) coords — the extruded "side" of the brick
  const dn = {x:Math.sin(angle)*depth, y:Math.cos(angle)*depth};
  // world-up unit vector in local coords — where the sheen lives
  const up = {x:-Math.sin(angle), y:-Math.cos(angle)};
  const lf = {x:up.y, y:-up.x}; // world-left in local coords

  const path = (()=> {
    if(shape==='plank'){ const w=size*1.85,h=size*0.64; return ()=>rrect(x,-w/2,-h/2,w,h,h*0.34); }
    if(shape==='drum'){ return ()=>{ x.beginPath(); x.arc(0,0,size*0.54,0,Math.PI*2); }; }
    if(shape==='arch'){ const s=size; return ()=>{ x.beginPath(); x.moveTo(-s/2,s/2); x.lineTo(-s/2,-s*0.08);
      x.arc(0,-s*0.08,s/2,Math.PI,0); x.lineTo(s/2,s/2); x.closePath(); }; }
    const s=size; return ()=>rrect(x,-s/2,-s/2,s,s,r);
  })();

  // 1 · extruded dark side (offset toward world-down)
  x.save(); x.translate(dn.x, dn.y); x.fillStyle = pal.edge; path(); x.fill(); x.restore();
  // 2 · top face with world-oriented gradient (light from above)
  const g = x.createLinearGradient(up.x*size*0.55, up.y*size*0.55, -up.x*size*0.55, -up.y*size*0.55);
  g.addColorStop(0, pal.light); g.addColorStop(0.55, pal.fill); g.addColorStop(1, pal.fill);
  x.fillStyle = g; path(); x.fill();
  x.lineWidth = 1.5; x.strokeStyle = 'rgba(43,42,58,.28)'; path(); x.stroke();
  // 3 · sheen — clipped to face, positioned toward world-up-left, sweeps with rotation
  x.save(); path(); x.clip();
  const gx = up.x*size*0.30 + lf.x*size*0.10, gy = up.y*size*0.30 + lf.y*size*0.10;
  x.globalAlpha = 0.42; x.fillStyle = '#FFFFFF';
  x.beginPath(); x.ellipse(gx, gy, size*0.34, size*0.115, Math.atan2(up.y, up.x)+Math.PI/2, 0, Math.PI*2); x.fill();
  x.globalAlpha = 0.5;
  x.beginPath(); x.arc(up.x*size*0.30 + lf.x*size*0.30, up.y*size*0.30 + lf.y*size*0.30, size*0.055, 0, Math.PI*2); x.fill();
  x.restore();
  // 4 · icon on the face
  if(iconImg && iconImg.complete){
    const iw = shape==='plank' ? size*0.42 : size*0.5;
    x.drawImage(iconImg, -iw/2, -iw/2, iw, iw);
  }
  x.restore();
}
function rrect(x,px,py,w,h,r){
  x.beginPath();
  x.moveTo(px+r,py); x.arcTo(px+w,py,px+w,py+h,r); x.arcTo(px+w,py+h,px,py+h,r);
  x.arcTo(px,py+h,px,py,r); x.arcTo(px,py,px+w,py,r); x.closePath();
}

/* icon image cache (ink strokes rendered to bitmaps for canvas) */
const iconCache = {};
function iconImage(name, color='#33414D'){
  const k = name+'|'+color;
  if(iconCache[k]) return iconCache[k];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><g fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||ICONS.star}</g></svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml,'+encodeURIComponent(svg);
  iconCache[k] = img; return img;
}


/* ═════════ 3D RENDERER — real lit bricks (Three.js), physics stays Matter ═════════ */
const Renderer3D = {
  ready:false, meshes:new Map(),
  init(canvas){
    if(!window.THREE3D) return;
    const {THREE} = THREE3D;
    try{
      this.renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    }catch(e){ return; }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 0, -1, -4000, 4000);
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-420, 520, 640); this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff0e0, 0.8); fill.position.set(480, -240, 420); this.scene.add(fill);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    this.ready = true;
  },
  resize(w, h){
    if(!this.ready) return;
    this.renderer.setSize(w, h, false);
    this.camera.left = 0; this.camera.right = w; this.camera.top = 0; this.camera.bottom = -h;
    this.camera.updateProjectionMatrix();
  },
  meshFor(c, size){
    const {THREE, RoundedBoxGeometry} = THREE3D;
    const p = palFor(c);
    const geo = new RoundedBoxGeometry(size, size, size, 3, size*0.16);
    const mat = new THREE.MeshPhysicalMaterial({
      color:new THREE.Color(p.fill), roughness:0.3, metalness:0,
      clearcoat:0.9, clearcoatRoughness:0.28, transparent:true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    // icon decal on front + back faces
    const ink = iconInkFor(c, p.fill);
    const img = iconImage(c.icon, ink);
    const tex = new THREE.Texture(img);
    tex.colorSpace = THREE.SRGBColorSpace;
    const ready = ()=>{ tex.needsUpdate = true; };
    if(img.complete) ready(); else img.addEventListener('load', ready);
    for(const zdir of [1,-1]){
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(size*0.52, size*0.52),
        new THREE.MeshBasicMaterial({map:tex, transparent:true})
      );
      plane.position.z = zdir*(size/2 + 0.6);
      if(zdir<0) plane.rotation.y = Math.PI;
      mesh.add(plane);
    }
    mesh.userData = {spinX:0, spinY:0};
    return mesh;
  },
  tumble(blockId, vigor=1){
    const m = this.meshes.get(blockId);
    if(m){ m.userData.spinX = (Math.random()-.5)*0.55*vigor; m.userData.spinY = (Math.random()-.5)*0.55*vigor; }
  },
  sync(bodies, size, picked){
    if(!this.ready) return;
    for(const [id, m] of this.meshes){
      if(!bodies.has(id)){ this.scene.remove(m); this.meshes.delete(id); }
    }
    for(const [id, body] of bodies){
      let m = this.meshes.get(id);
      if(!m){
        const c = body.isChip
          ? S.colors.find(k=>k.id===body.colorId)
          : (b0=>b0 && S.colors.find(k=>k.id===b0.colorId))(S.week.blocks.find(b=>b.id===id));
        if(!c) continue;
        m = this.meshFor(c, body.isChip ? body.chipSize : Floor.sizeFor(c.id));
        this.meshes.set(id, m); this.scene.add(m);
      }
      m.position.set(body.position.x, -body.position.y, 0);
      m.rotation.z = -body.angle;
      const u = m.userData;
      m.rotation.x += u.spinX; m.rotation.y += u.spinY;
      u.spinX *= 0.962; u.spinY *= 0.962;
      const resting = Math.abs(body.velocity.x)+Math.abs(body.velocity.y) < 0.7;
      if(resting && Math.abs(u.spinX)<0.012 && Math.abs(u.spinY)<0.012){
        // toy rights itself: ease back to face-forward so the icon returns
        const wrap = a => { a %= Math.PI*2; if(a>Math.PI) a -= Math.PI*2; if(a<-Math.PI) a += Math.PI*2; return a; };
        m.rotation.x = wrap(m.rotation.x)*0.86;
        m.rotation.y = wrap(m.rotation.y)*0.86;
      }
      const dim = picked && !picked.has(id);
      const op = dim ? 0.42 : 1;
      if(m.material.opacity !== op){
        m.material.opacity = op;
        m.children.forEach(ch=>{ ch.material.opacity = op; });
      }
    }
    this.renderer.render(this.scene, this.camera);
  },
  refreshColor(){ // palette/icon edits: rebuild all meshes lazily
    for(const [id, m] of this.meshes){ this.scene.remove(m); }
    this.meshes.clear();
  }
};

/* ═════════ THE FLOOR — physics ═════════ */
const Floor = {
  mode:'week',
  sweepMode:false,
  engine:null, runner:null, mouse:null, mc:null, canvas:null, ctx:null,
  W:0, H:0, dpr:1, bodies:new Map(), // blockId -> body
  bucketRects:[], dragging:null, dragStart:null, particles:[], flights:[],
  hotBucket:-1, built:false, paused:true, undoStack:[],

  ensure(){ if(!this.built){ this.build(); } this.layout(); this.syncBuckets(); this.updateHeader(); },

  build(){
    this.canvas = $('#worldCanvas'); this.ctx = this.canvas.getContext('2d');
    this.fxCanvas = $('#fxCanvas'); this.fx = this.fxCanvas.getContext('2d');
    Renderer3D.init($('#glCanvas'));
    this.engine = Matter.Engine.create({enableSleeping:false});
    this.engine.gravity.y = 1.15;
    this.built = true;
    this.layout();
    this.rebuild();

    const stage = $('#floorStage');
    this.mouse = Matter.Mouse.create(stage); // stage, not canvas: bucket buttons swallow mouseup, but events bubble to stage
    this.mc = Matter.MouseConstraint.create(this.engine, {mouse:this.mouse, constraint:{stiffness:0.18, damping:0.12, render:{visible:false}}});
    Matter.World.add(this.engine.world, this.mc);

    Matter.Events.on(this.mc, 'startdrag', e=>{
      const body = e.body; if(!body || !body.blockId || body.fadeT0) return;
      this.dragging = body; this.dragStart = {x:this.mouse.position.x, y:this.mouse.position.y, t:Date.now()};
      body.collisionFilter.mask = 0; // pass through floor while held
      buzz(6);
    });
    Matter.Events.on(this.mc, 'enddrag', e=>{
      const body = e.body; if(!body || !body.blockId) return;
      const start = this.dragStart; this.dragging = null; this.setHot(-1);
      const dx = this.mouse.position.x-start.x, dy = this.mouse.position.y-start.y;
      const dist = Math.hypot(dx,dy), dt = Date.now()-start.t;
      if(dist<10 && dt<260 && this.sweepMode){ // sweep: tap = claim
        this.claimBlock(body);
        return;
      }
      if(dist<10 && dt<260){ // tap → toss
        body.collisionFilter.mask = -1;
        Matter.Body.setVelocity(body, {x:(Math.random()*10-5), y:-(9+Math.random()*5)});
        Matter.Body.setAngularVelocity(body, (Math.random()<.5?-1:1)*(0.35+Math.random()*0.5)); // real spin — it's a fidget toy
        Renderer3D.tumble(body.blockId, 1.4);
        sfx('toss');
        const lines = V().toss.filter(Boolean);
        if(lines.length && Math.random()<0.35) toast(lines[Math.floor(Math.random()*lines.length)], {ms:1400});
        return;
      }
      // ── chips are their own species: bank one, or carry one up to regroup them all ──
      if(body.isChip){
        body.collisionFilter.mask = -1;
        let chit = this.bucketAt(this.mouse.position.x, this.mouse.position.y);
        if(chit<0) chit = this.bucketAt(body.position.x, body.position.y);
        if(chit>=0){
          const bucket = S.buckets[chit];
          if(bucket.colorId===body.colorId && bucket.chips){ this.bankChip(body, bucket); return; }
          toast(V().wrongBucket(S.buckets.find(bk=>bk.colorId===body.colorId)?.name||'its bucket'), {ms:2000});
          sfx('tick');
        }
        if(this.mouse.position.y <= this.planY()){ this.gatherChips(body.chipParent, {x:this.mouse.position.x, y:this.mouse.position.y}); return; }
        return;
      }
      let hit = this.bucketAt(this.mouse.position.x, this.mouse.position.y);
      if(hit<0) hit = this.bucketAt(body.position.x, body.position.y);
      if(hit>=0){
        const bucket = S.buckets[hit];
        const block = S.week.blocks.find(b=>b.id===body.blockId);
        if(block && bucket.colorId===block.colorId){ this.capture(block, body, bucket, 'drag'); return; }
        const owner = block && S.buckets.find(bk=>bk.colorId===block.colorId);
        toast(V().wrongBucket(owner?owner.name:'another bucket'), {ms:2200});
        sfx('tick');
      }
      // sweep: dragging a block downward claims it
      if(this.sweepMode){
        if(this.mouse.position.y > this.planY()){ this.claimBlock(body); return; }
        body.collisionFilter.mask = -1;
        return;
      }
      // no bucket hit → today-zone membership by where the pointer let go
      const block = S.week.blocks.find(b=>b.id===body.blockId);
      const py = this.mouse.position.y;
      if(block){
        if(py > this.planY() && py < this.floorY()+20){
          if(!DayB.isPlanned(block.id)){
            const cost = DayB.unitsOf(block.colorId);
            const target = DayB.target();
            if(target==='tomorrow' && !this._tomorrowToasted){
              this._tomorrowToasted = true;
              toast(`Today's banked — you're planning tomorrow now.`, {ms:2600});
            }
            if(DayB.used(target)+cost > S.day.maxSlots){
              toast(`${target==='tomorrow'?'Tomorrow':'Today'}'s full — ${S.day.maxSlots} slots. Protect the plan.`, {ms:2600});
              Matter.Body.setPosition(body, {x:clamp(body.position.x,30,this.W-30), y:this.planY()-120});
              Matter.Body.setVelocity(body,{x:0,y:0});
            } else {
              DayB.setPlanned(block, true); sfx('slide'); buzz(8);
              const bk = S.buckets.find(k=>k.colorId===block.colorId);
              if(bk && bk.chips){ this.shatterToChips(block, body, bk); return; }
            }
          }
        } else if(py <= this.planY() && DayB.isPlanned(block.id)){
          DayB.setPlanned(block, false); sfx('tap');
        }
        body.collisionFilter.mask = -1;
        if(!DayB.isPlanned(block.id) && body.position.y > this.planY()-10){
          Matter.Body.setPosition(body, {x:clamp(body.position.x,30,this.W-30), y:this.planY()-90});
          Matter.Body.setVelocity(body,{x:0,y:0});
        }
      } else {
        body.collisionFilter.mask = -1;
      }
      if(body.position.y > this.floorY()-16){
        Matter.Body.setPosition(body, {x:clamp(body.position.x,30,this.W-30), y:this.floorY()-50});
        Matter.Body.setVelocity(body,{x:0,y:0});
      }
      this.updateHeader();
    });
    stage.addEventListener('pointermove', ()=>{
      if(!this.dragging) return;
      this.setHot(this.bucketAt(this.mouse.position.x, this.mouse.position.y));
    });
    // sweep: instant taps can release before the engine tick grabs — claim directly on click
    stage.addEventListener('click', ()=>{
      if(!this.sweepMode || this.dragging) return;
      const hit = Matter.Query.point([...this.bodies.values()], this.mouse.position)[0];
      if(hit) this.claimBlock(hit);
    });

    // shake the phone → the blocks tumble inside their own sections
    let lastAcc = null, lastShake = 0;
    window.addEventListener('devicemotion', e=>{
      const a = e.accelerationIncludingGravity; if(!a || a.x==null) return;
      if(lastAcc){
        const d = Math.abs(a.x-lastAcc.x)+Math.abs(a.y-lastAcc.y)+Math.abs(a.z-lastAcc.z);
        if(d > 24 && performance.now()-lastShake > 380){ lastShake = performance.now(); this.shakeBoard(); }
      }
      lastAcc = {x:a.x, y:a.y, z:a.z};
    });

    // pool-ball divider: a block slammed up into the shelf from below stays below,
    // but its energy carries through and knocks the cubes sitting above it into the air
    Matter.Events.on(this.engine, 'collisionStart', e=>{
      for(const pair of e.pairs){
        const a = pair.bodyA, b = pair.bodyB;
        // block-on-block: soft ambient clinks, velocity-scaled and throttled so a pile never rattles
        if(a.blockId && b.blockId && !a.isStatic && !b.isStatic){
          const rel = Math.hypot(a.velocity.x-b.velocity.x, a.velocity.y-b.velocity.y);
          const now = performance.now();
          if(rel > 2.2 && now - (this._lastClink||0) > 90){
            this._lastClink = now;
            const szOf = k => k.isChip ? (k.chipSize||20) : this.sizeFor(k.colorId);
            const sz = (szOf(a)+szOf(b))/2; // avg physical size of the pair
            sfx('clink', {v: clamp(rel/16, 0.12, 0.8), pitch: clamp(44/sz, 0.65, 2.1)});
          }
        }
        const shelf = a.isShelf ? a : (b.isShelf ? b : null);
        if(!shelf) continue;
        const blk = shelf===a ? b : a;
        if(blk.isStatic || blk.position.y < shelf.position.y) continue; // only hits from underneath
        const up = -blk.velocity.y;
        if(up < 6) continue; // needs a real slam, not a resting nudge
        const power = Math.min(up, 24);
        let thumped = false;
        for(const other of this.bodies.values()){
          if(other === blk || other.position.y > shelf.position.y) continue;      // stays their side
          if(other.position.y < shelf.position.y - 170) continue;                 // only the shelf layer
          const dx = Math.abs(other.position.x - blk.position.x);
          if(dx > 110) continue;                                                  // local, like a cue hit
          const falloff = 1 - dx/130;
          Matter.Body.setVelocity(other, {x: other.velocity.x + (Math.random()*2-1)*1.5, y: -power*0.8*falloff});
          Matter.Body.setAngularVelocity(other, (Math.random()*2-1)*0.28);
          thumped = true;
        }
        if(thumped){ sfx('impact'); buzz(12); }
      }
    });

    const loop = ()=>{
      if(!this.paused){
        // chips can never live above the divider — flung up, they ghost through
        // the pile and the shelf and fall back home to the today zone
        for(const body of this.bodies.values()){
          if(!body.isChip || this.dragging === body) continue;
          const above = body.position.y < this.planY();
          const want = above ? 0 : -1;
          if(body.collisionFilter.mask !== want){ body.collisionFilter.mask = want; if(!above) Matter.Sleeping.set(body, false); }
        }
        Matter.Engine.update(this.engine, 1000/60);
        // backstop: any chip queued to pop that somehow lingered despawns quietly
        const now = performance.now();
        for(const body of [...this.bodies.values()]){
          if(body.fadeT0 && now - body.fadeT0 > 5000){
            Matter.World.remove(this.engine.world, body); this.bodies.delete(body.blockId);
          }
        }
        // safety net: if a block ever tunnels across the divider, its plan state follows reality
        if(!this.sweepMode && !this.dragging){
          for(const body of this.bodies.values()){
            if(body.position.y < this.planY()-30 && DayB.isPlanned(body.blockId)){
              const blk = S.week.blocks.find(x=>x.id===body.blockId);
              if(blk){ DayB.setPlanned(blk, false); this.updateHeader(); }
            }
          }
        }
        this.draw();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    window.addEventListener('resize', ()=>{ this.layout(); this.syncBuckets(); });
  },

  BUCKET_H:118,
  floorY(){ return this.H - this.BUCKET_H; },
  planY(){ return this.floorY() - 236; },  // the darker Today shelf sits just above the buckets
  applyMode(){
    this.layout(); this.syncBuckets(); this.updateHeader();
    DayB.staleCheck();
    for(const [id, body] of this.bodies){
      body.collisionFilter.mask = -1;
      if(DayB.isPlanned(id)){
        Matter.Body.setPosition(body, {x:30+Math.random()*(this.W-60), y:this.planY()+50+Math.random()*40});
        Matter.Body.setVelocity(body, {x:0,y:0});
      }
    }
  },

  layout(){
    const stage = $('#floorStage'); if(!stage) return;
    const r = stage.getBoundingClientRect();
    this.dpr = window.devicePixelRatio||1;
    this.W = r.width; this.H = r.height;
    this.canvas.width = r.width*this.dpr; this.canvas.height = r.height*this.dpr;
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
    if(this.fxCanvas){ this.fxCanvas.width = r.width*this.dpr; this.fxCanvas.height = r.height*this.dpr; this.fx.setTransform(this.dpr,0,0,this.dpr,0,0); }
    Renderer3D.resize(r.width, r.height);
    if(this.mouse) Matter.Mouse.setScale(this.mouse, {x:1, y:1});
    // rebuild static walls
    if(this.walls) Matter.World.remove(this.engine.world, this.walls);
    const t=60;
    this.walls = [
      Matter.Bodies.rectangle(this.W/2, this.floorY()+t/2, this.W*2, t, {isStatic:true}),
      Matter.Bodies.rectangle(-t/2, this.H/2, t, this.H*3, {isStatic:true}),
      Matter.Bodies.rectangle(this.W+t/2, this.H/2, t, this.H*3, {isStatic:true}),
      Matter.Bodies.rectangle(this.W/2, -this.H-t/2, this.W*2, t, {isStatic:true}),
    ];
    // the divider — solid both ways, but kinetic: slam a block into it from below
    // and the impact thumps through to the pile above (pool-ball rules)
    const shelf = Matter.Bodies.rectangle(this.W/2, this.planY()+5, this.W*2, 10, {isStatic:true, restitution:0.9});
    shelf.isShelf = true;
    this.walls.push(shelf);
    Matter.World.add(this.engine.world, this.walls);
  },

  blockSize(){ return clamp(Math.min(this.W,520)/9, 38, 54); },
  sizeFor(colorId){
    const c = S.colors.find(k=>k.id===colorId);
    return this.blockSize() * (1 + 0.22*(((c && c.slotSize)||1) - 1)); // bigger commitments are physically bigger
  },

  bodyFor(block){
    const c = S.colors.find(x=>x.id===block.colorId); if(!c) return null;
    const s = this.sizeFor(block.colorId);
    const x = 30+Math.random()*(this.W-60), y = 60+Math.random()*120;
    let body;
    const opts = {restitution:0.34, friction:0.42, frictionAir:0.006, density:0.0022}; // fidget-tuned: bouncier, spins longer
    if(c.shape==='plank') body = Matter.Bodies.rectangle(x,y,s*1.85,s*0.64,{...opts, chamfer:{radius:s*0.18}});
    else if(c.shape==='drum') body = Matter.Bodies.circle(x,y,s*0.54,opts);
    else body = Matter.Bodies.rectangle(x,y,s,s,{...opts, chamfer:{radius:s*0.2}});
    body.blockId = block.id; body.colorId = c.id;
    Matter.Body.setAngle(body, Math.random()*0.6-0.3);
    return body;
  },

  rebuild(){
    // clear existing block bodies
    for(const b of this.bodies.values()) Matter.World.remove(this.engine.world, b);
    this.bodies.clear();
    for(const block of trayBlocks()){
      const body = this.bodyFor(block); if(!body) continue;
      // planned blocks respawn in the today zone, not the week pile
      if(DayB.isPlanned(block.id)){
        Matter.Body.setPosition(body, {x:40+Math.random()*(this.W-80), y:this.planY()+70+Math.random()*80});
        Matter.Body.setVelocity(body, {x:0, y:0});
      }
      this.bodies.set(block.id, body);
      Matter.World.add(this.engine.world, body);
    }
    Renderer3D.refreshColor();
    this.syncBuckets(); this.updateHeader();
  },

  syncBuckets(){
    const row = $('#bucketRow'); if(!row) return;
    row.style.height = this.BUCKET_H+'px';
    row.innerHTML = S.buckets.map((bk,i)=>{
      const c = S.colors.find(x=>x.id===bk.colorId); if(!c) return '';
      const p = palFor(c);
      const done = droppedCount(c.id);
      return `<button class="bucket-hit" data-i="${i}" aria-label="${esc(bk.name)} bucket, ${done} of ${c.goal}">
        <svg viewBox="0 0 100 96" width="100%" height="78" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <path d="M20 32 L80 32 L73 90 L27 90 Z" fill="${p.edge}" transform="translate(0 3)"/>
          ${Array.from({length:Math.min(done,4)},(_,k)=>`<rect x="${33+k*9}" y="${21-(k%2)*5}" width="12" height="12" rx="4" fill="${p.light}" stroke="${p.edge}" stroke-width="2.5"/>`).join('')}
          <path d="M20 32 L80 32 L73 90 L27 90 Z" fill="${p.fill}" stroke="${p.edge}" stroke-width="3" stroke-linejoin="round"/>
          <ellipse cx="50" cy="32" rx="30" ry="8" fill="${p.edge}"/>
          <ellipse cx="50" cy="32" rx="24.5" ry="6" fill="rgba(43,42,58,.42)"/>
          <path d="M31.5 44 Q29.5 64 32.5 82" fill="none" stroke="${p.light}" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
          <g transform="translate(38 48) scale(1.05)" fill="none" stroke="${iconInkFor(c, p.fill)}" stroke-opacity="0.6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon]||ICONS.star}</g>
        </svg>
        <div style="font-size:12px;font-weight:700;color:var(--ink);line-height:1.15;padding:0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(bk.name)}</div>
        <div class="mono" style="font-size:11px;color:var(--muted)">${done}/${c.goal}${(n=>n?` <span style="color:var(--good);font-weight:700">+${n}</span>`:'')(S.week.blocks.filter(b=>b.colorId===c.id && b.status==='dropped' && b.ts && dayKey(new Date(b.ts))===dayKey()).length * ((c.slotSize||1)))}</div>
      </button>`;
    }).join('');
    this.bucketRects = $$('#bucketRow .bucket-hit').map(el=>{
      const r = el.getBoundingClientRect(), s = $('#floorStage').getBoundingClientRect();
      return {x:r.left-s.left, y:r.top-s.top, w:r.width, h:r.height};
    });
    $$('#bucketRow .bucket-hit').forEach(el=>el.onclick=()=>BucketSheet.open(+el.dataset.i));
  },

  bucketAt(x,y){
    for(let i=0;i<this.bucketRects.length;i++){
      const r = this.bucketRects[i];
      if(x>=r.x && x<=r.x+r.w && y>=r.y-14 && y<=r.y+r.h) return i;
    }
    return -1;
  },
  setHot(i){
    if(this.hotBucket===i) return;
    this.hotBucket = i;
    $$('#bucketRow .bucket-hit').forEach((el,k)=>el.style.transform = k===i?'scale(1.09)':'');
  },

  capture(block, body, bucket, via){
    if(body){ Matter.World.remove(this.engine.world, body); this.bodies.delete(block.id); }
    block.status='dropped'; block.via=via; block.ts=new Date().toISOString();
    Undo.push({type:'drop', blockId:block.id});
    DayB.markDone(block.id); // banked planned blocks keep counting toward today
    save();
    sfx('drop'); buzz(18);
    const i = S.buckets.indexOf(bucket);
    const r = this.bucketRects[i];
    const pal = palFor(S.colors.find(c=>c.id===block.colorId)||{});
    if(r) this.burst(r.x+r.w/2, r.y+18, pal, true);
    this.syncBuckets(); this.updateHeader();
    if(!S.week.blocks.some(b=>b.status!=='dropped')){
      // every block home: confetti across every bucket, then the full-screen storm
      setTimeout(()=>{ this.bucketRects.forEach((br,k)=>{
        const c = S.colors.find(x=>x.id===S.buckets[k].colorId);
        this.burst(br.x+br.w/2, br.y+14, palFor(c||{}), true);
      }); }, 420);
      setTimeout(()=>Celebrate.run(V().allDone), 560);
    }
  },

  undoDrop(blockId){
    const block = S.week.blocks.find(b=>b.id===blockId);
    if(!block || block.status!=='dropped') return;
    block.status='tray'; block.via=null; block.ts=null; save();
    const body = this.bodyFor(block);
    if(body){ Matter.Body.setPosition(body,{x:this.W/2, y:80}); this.bodies.set(block.id, body); Matter.World.add(this.engine.world, body); }
    this.syncBuckets(); this.updateHeader(); sfx('tick');
  },

  /* animated bulk entry: n blocks of colorId fly into bucket */
  flyIn(colorId, n, via){
    const bucket = S.buckets.find(b=>b.colorId===colorId); if(!bucket) return 0;
    const i = S.buckets.indexOf(bucket); const r = this.bucketRects[i];
    const targets = trayBlocks(colorId).slice(0,n);
    targets.forEach((block, k)=>{
      const body = this.bodies.get(block.id);
      const from = body ? {x:body.position.x, y:body.position.y} : {x:this.W/2, y:this.H/3};
      if(body){ Matter.World.remove(this.engine.world, body); this.bodies.delete(block.id); }
      const c = S.colors.find(x=>x.id===colorId);
      this.flights.push({from, to:{x:r.x+r.w/2, y:r.y+30}, t0:performance.now()+k*110, dur:520,
        pal:palFor(c), shape:c.shape, icon:c.icon, ink:iconInkFor(c, palFor(c).fill), label:c.name, size:this.sizeFor(colorId)*0.9,
        done:()=>{
          block.status='dropped'; block.via=via; block.ts=new Date().toISOString();
          Undo.push({type:'drop', blockId:block.id});
          DayB.markDone(block.id);
          save();
          sfx('drop'); buzz(10); this.syncBuckets(); this.updateHeader();
          this.burst(r.x+r.w/2, r.y+18, palFor(c), true);
          const sheetEl = document.querySelector('#sheet');
          if(sheetEl && sheetEl.dataset.bkId===bucket.id){
            const weekLine = sheetEl.querySelector('#bsWeekLine');
            if(weekLine){ const d2=droppedCount(colorId), l2=trayBlocks(colorId).length; weekLine.textContent = `${d2}/${c.goal} this week${l2?` · ${l2} on the floor`:''}`; }
          }
        }});
    });
    return targets.length;
  },

  shakeBoard(){
    for(const [id, body] of this.bodies){
      Matter.Body.setVelocity(body, {x:(Math.random()-.5)*12, y:-(3+Math.random()*8)});
      Matter.Body.setAngularVelocity(body, (Math.random()-.5)*0.6);
      Renderer3D.tumble(id, 0.9);
    }
    sfx('toss'); buzz(24);
  },

  /* ── sweeps, on the board: 'week' (end of week) and 'day' (goodnight roundup) ── */
  sweepKind:'week',
  enterSweep(kind='week'){
    this.sweepKind = kind;
    S.lastRoundup = new Date().toISOString(); save();
    this.rejoinAllChips(); // loose chips regroup before the sweep
    this.sweepMode = true;
    $('#btnRoundup').hidden = true;
    $('#screen-floor').classList.add('board-live');
    const pop = $('#sweepPop'); pop.hidden = false;
    const strong = pop.querySelector('strong');
    if(strong) strong.textContent = kind==='day' ? 'Goodnight.' : 'Week sweep.';
    $('#spRestack').hidden = (kind==='day');
    this.updateSweepPop();
  },
  exitSweep(){
    this.sweepMode = false; $('#sweepPop').hidden = true;
    $('#screen-floor').classList.remove('board-live');
    this.updateHeader();
  },
  closeSweep(){ // the ✕ — in goodnight mode this IS "end my day"
    const wasDay = this.sweepMode && this.sweepKind==='day';
    this.exitSweep();
    if(wasDay) toast(V().goodnight || 'Goodnight.', {ms:2800});
  },
  updateSweepPop(){
    const left = S.week.blocks.filter(b=>b.status!=='dropped').length;
    const msg = $('#spMsg');
    if(!msg) return;
    if(this.sweepKind==='day'){
      msg.textContent = left
        ? `${V().nightIntro || 'Tap each block that happened today.'} Close when you’re done.`
        : `Everything’s home. Close it out and sleep well.`;
    } else {
      msg.textContent = left
        ? `Tap every block that actually happened — it drops home. ${left} out, and faded is fine.`
        : `All claimed. Restack when you're ready.`;
    }
  },
  claimBlock(body){
    const block = S.week.blocks.find(b=>b.id===body.blockId); if(!block) return;
    const c = S.colors.find(k=>k.id===block.colorId);
    const bucket = S.buckets.find(bk=>bk.colorId===block.colorId);
    const i = S.buckets.indexOf(bucket);
    const r = this.bucketRects[i] || {x:this.W/2-20, y:this.H-80, w:40, h:60};
    const from = {x:body.position.x, y:body.position.y};
    Matter.World.remove(this.engine.world, body); this.bodies.delete(block.id);
    this.flights.push({from, to:{x:r.x+r.w/2, y:r.y+30}, t0:performance.now(), dur:430,
      pal:palFor(c), shape:c.shape, icon:c.icon, ink:iconInkFor(c, palFor(c).fill), size:this.sizeFor(c.id)*0.9,
      done:()=>{
        block.status='dropped'; block.via='sweep'; block.ts=new Date().toISOString();
        Undo.push({type:'drop', blockId:block.id});
        DayB.markDone(block.id); save();
        sfx('drop'); buzz(12);
        this.burst(r.x+r.w/2, r.y+22, palFor(c));
        this.syncBuckets(); this.updateHeader(); this.updateSweepPop();
        // last block claimed during the week sweep → the big one
        if(this.sweepMode && this.sweepKind==='week' && !S.week.blocks.some(b=>b.status!=='dropped'))
          setTimeout(()=>Celebrate.run(V().allDone), 320);
      }});
  },
  restackWeek(){
    S.history.unshift({
      start:S.week.start, end:new Date().toISOString(),
      perColor:S.colors.map(c=>({colorId:c.id, name:c.name, pal:c.pal, customHex:c.customHex||null, icon:c.icon, goal:c.goal,
        done:droppedCount(c.id), partial:partialCount(c.id)})),
    });
    if(S.history.length>52) S.history.length = 52;
    S.day.items = []; S.day.date = null;
    S.settings.sweepDismissed = null;
    Undo.clear(); // the old week's reps are history now — nothing on the new board to undo
    spawnWeek(); this.exitSweep(); this.rebuild();
    sfx('fanfare'); toast(V().restacked, {ms:3000});
  },

  /* ── chips-mode blocks are physical too: shatter on plan, regroup on the way back ── */
  shatterToChips(block, body, bucket){
    const cfg = chunkCfg(bucket.chips);
    const banked = (S.week.chips[bucket.id]||{})[dayKey()]||0;
    const n = clamp(cfg.perDay - banked, 1, Math.min(cfg.perDay, 24)); // only what's left today (visual cap 24)
    const px = clamp(body.position.x, 40, this.W-40);
    const py = clamp(Math.max(body.position.y, this.planY()+70), this.planY()+60, this.floorY()-40);
    Matter.World.remove(this.engine.world, body); this.bodies.delete(block.id);
    const s = this.sizeFor(block.colorId)*0.5;
    for(let i=0;i<n;i++){
      const chip = Matter.Bodies.rectangle(px+(Math.random()-.5)*8, py+(Math.random()-.5)*8, s, s,
        {restitution:0.52, friction:0.34, frictionAir:0.008, density:0.0022, chamfer:{radius:s*0.22}});
      chip.isChip = true; chip.chipParent = block.id; chip.colorId = block.colorId;
      chip.blockId = 'chip:'+block.id+':'+i; chip.chipSize = s;
      const a = (i/n)*Math.PI*2 + (Math.random()-.5)*0.6;
      Matter.Body.setVelocity(chip, {x:Math.cos(a)*(5+Math.random()*5), y:Math.abs(Math.sin(a))*-(4+Math.random()*4)});
      Matter.Body.setAngularVelocity(chip, (Math.random()-.5)*0.7);
      this.bodies.set(chip.blockId, chip);
      Matter.World.add(this.engine.world, chip);
      Renderer3D.tumble(chip.blockId, 1.5);
    }
    this.burst(px, py, palFor(S.colors.find(c=>c.id===block.colorId)||{}));
    sfx('impact'); buzz(18);
  },
  chipsOf(parentId){ return [...this.bodies.values()].filter(b=>b.isChip && b.chipParent===parentId); },
  /* the block was earned — its leftover chips pop into confetti, one by one */
  fadeChips(parentId){
    this.chipsOf(parentId).forEach((ch,i)=>{
      if(ch.fadeT0) return;
      ch.fadeT0 = performance.now(); // undraggable while waiting for its pop
      setTimeout(()=>{
        if(!this.bodies.has(ch.blockId)) return;
        const pal = palFor(S.colors.find(c=>c.id===ch.colorId)||{});
        this.burst(ch.position.x, ch.position.y, pal);
        Matter.World.remove(this.engine.world, ch); this.bodies.delete(ch.blockId);
        sfx('tick');
      }, 90 + i*110);
    });
  },
  gatherChips(parentId, at){
    const block = S.week.blocks.find(b=>b.id===parentId);
    if(!block || block.status==='dropped'){ this.fadeChips(parentId); return; }
    const chips = this.chipsOf(parentId);
    const target = {x: clamp(at.x, 40, this.W-40), y: Math.min(at.y, this.planY()-70)};
    const c = S.colors.find(k=>k.id===block.colorId);
    const p = palFor(c||{});
    let arrived = 0;
    chips.forEach((ch,i)=>{
      const from = {x:ch.position.x, y:ch.position.y};
      Matter.World.remove(this.engine.world, ch); this.bodies.delete(ch.blockId);
      this.flights.push({from, to:{...target}, t0:performance.now()+i*45, dur:340,
        pal:p, shape:'cube', icon:c?c.icon:'star', ink:iconInkFor(c, p.fill), size:(ch.chipSize||18),
        done:()=>{
          arrived++;
          if(arrived < chips.length) return;
          const nb = this.bodyFor(block);
          if(nb){
            Matter.Body.setPosition(nb, target); Matter.Body.setVelocity(nb, {x:0, y:-2.5});
            this.bodies.set(block.id, nb); Matter.World.add(this.engine.world, nb);
            Renderer3D.tumble(block.id, 1.1);
          }
          DayB.setPlanned(block, false);
          sfx('drop'); buzz(12);
          this.updateHeader();
        }});
    });
    sfx('slide');
  },
  rejoinAllChips(){
    const parents = [...new Set([...this.bodies.values()].filter(b=>b.isChip).map(b=>b.chipParent))];
    parents.forEach(p=>this.gatherChips(p, {x:this.W/2, y:this.planY()-120}));
  },
  bankChip(body, bucket){
    Matter.World.remove(this.engine.world, body); this.bodies.delete(body.blockId);
    const cfg = chunkCfg(bucket.chips);
    S.week.chips[bucket.id] = S.week.chips[bucket.id]||{};
    const today = S.week.chips[bucket.id][dayKey()]||0;
    if(today >= cfg.perDay){ sfx('tick'); this.updateHeader(); return; }
    S.week.chips[bucket.id][dayKey()] = today+1; save();
    const i = S.buckets.indexOf(bucket);
    const r = this.bucketRects[i];
    const pal = palFor(S.colors.find(c=>c.id===bucket.colorId)||{});
    sfx('tick'); buzz(8);
    let earnedParentId = null;
    if((today+1) % cfg.perBlock === 0){
      // enough small chunks → a block is earned (can happen more than once a day, e.g. 2000 cal / 1000-cal blocks)
      const parent = S.week.blocks.find(b=>b.id===body.chipParent && b.status!=='dropped')
        || S.week.blocks.find(b=>b.colorId===bucket.colorId && b.status!=='dropped');
      if(parent){
        parent.status='dropped'; parent.via='chips'; parent.ts=new Date().toISOString();
        earnedParentId = parent.id;
        DayB.markDone(parent.id); save();
        if(r) this.burst(r.x+r.w/2, r.y+18, pal, true);
        sfx('drop'); buzz(18);
      }
      if(today+1 >= cfg.perDay) this.fadeChips(body.chipParent); // day complete — leftovers pop away
    } else if(r) this.burst(r.x+r.w/2, r.y+22, pal);
    Undo.push({type:'chip', bucketId:bucket.id, day:dayKey(), parentId:earnedParentId});
    this.syncBuckets(); this.updateHeader();
  },

  /* today's whole plan banked → full-screen confetti storm (D-16 amended: animation, still never a message box) */
  dayCelebrate(){
    const y = this.planY();
    const pals = S.colors.map(c=>palFor(c));
    [0.2,0.42,0.62,0.82].forEach((fx,k)=>{
      setTimeout(()=>this.burst(this.W*fx, y, pals[k%pals.length]||{fill:'#DD7C54',light:'#F4C7BA',edge:'#B95F3D'}, true), k*130);
    });
    Celebrate.run(V().perfect);
    buzz(30); // fanfare comes from Celebrate
  },

  burst(x,y,pal,big=false){
    const n = big ? 34 : 16;
    const colors = [pal.fill, pal.light, pal.edge, '#DD7C54', '#DFC289', '#FFFFFF'];
    for(let i=0;i<n;i++){
      this.particles.push({x:x+(Math.random()-.5)*16, y, vx:(Math.random()-.5)*(big?11:7), vy:-(3+Math.random()*(big?9:6)),
        s:2.5+Math.random()*(big?6:4.5), a:1, rot:Math.random()*6, vr:(Math.random()-.5)*0.45,
        shape: Math.random()<.35?'dot':'rect', fade: big?0.011:0.02,
        color: colors[Math.floor(Math.random()*colors.length)]});
    }
  },

  draw(){
    // bg canvas: floor line (+ today zone)
    const x = this.ctx; x.clearRect(0,0,this.W,this.H);
    const css = getComputedStyle(document.body);
    const hair = css.getPropertyValue('--hairline').trim()||'#E6E1D6';
    x.fillStyle = css.getPropertyValue('--inset-2').trim()||'#EFEBE2';
    x.fillRect(0, this.planY(), this.W, this.floorY()-this.planY());
    x.strokeStyle = hair; x.lineWidth = 1.5; x.setLineDash([2,6]); x.lineCap='round';
    x.beginPath(); x.moveTo(14,this.planY()); x.lineTo(this.W-14,this.planY()); x.stroke(); x.setLineDash([]);
    x.fillStyle = css.getPropertyValue('--muted').trim()||'#8B949B';
    x.font = '600 10.5px Figtree, sans-serif'; x.textAlign='right';
    {
      // today: simple text — banked/scheduled, plus tomorrow's pre-plan when it exists
      const sched = DayB.used('today'), done = DayB.doneUnits(), tmrw = DayB.used('tomorrow');
      const label = `TODAY ${done}/${sched||S.day.maxSlots}` + (tmrw ? `  ·  TMRW ${tmrw}/${S.day.maxSlots}` : ''); // date lives in the ＋ entry modal, not here
      x.fillText(label, this.W-16, this.planY()+18);
    }
    x.strokeStyle = hair; x.lineWidth = 1.5; x.setLineDash([2,6]); x.lineCap='round';
      x.beginPath(); x.moveTo(14,this.planY()); x.lineTo(this.W-14,this.planY()); x.stroke(); x.setLineDash([]);
      x.fillStyle = css.getPropertyValue('--muted').trim()||'#8B949B';
    x.strokeStyle = hair;
    x.lineWidth = 2; x.setLineDash([1,7]); x.lineCap='round';
    x.beginPath(); x.moveTo(14,this.floorY()); x.lineTo(this.W-14,this.floorY()); x.stroke(); x.setLineDash([]);

    // 3D bricks
    Renderer3D.sync(this.bodies, this.blockSize(), this.sweepMode ? new Set() : null);

    // fx canvas: flights + particles above the bricks
    const f = this.fx; f.clearRect(0,0,this.W,this.H);
    const now = performance.now();
    this.flights = this.flights.filter(fl=>{
      if(now < fl.t0){
        drawBlockShape(f, fl.from.x, fl.from.y, fl.size, fl.shape, fl.pal, 0, iconImage(fl.icon, fl.ink||inkFor(fl.pal.fill)));
        return true;
      }
      const t = clamp((now-fl.t0)/fl.dur, 0, 1);
      const e = 1-Math.pow(1-t,3);
      const px = fl.from.x+(fl.to.x-fl.from.x)*e;
      const py = fl.from.y+(fl.to.y-fl.from.y)*e - Math.sin(Math.PI*t)*70;
      drawBlockShape(f, px, py, fl.size*(1-0.45*t), fl.shape, fl.pal, t*1.2, iconImage(fl.icon, fl.ink||inkFor(fl.pal.fill)));
      if(t>=1){ fl.done && fl.done(); return false; }
      return true;
    });
    this.particles = this.particles.filter(p=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.26; p.vx*=0.99; p.a-=(p.fade||0.02); p.rot+=p.vr;
      if(p.a<=0) return false;
      f.save(); f.globalAlpha = Math.max(p.a,0); f.translate(p.x,p.y); f.rotate(p.rot);
      f.fillStyle = p.color;
      if(p.shape==='dot'){ f.beginPath(); f.arc(0,0,p.s/2,0,Math.PI*2); f.fill(); }
      else f.fillRect(-p.s/2,-p.s/1.4,p.s,p.s*1.4);
      f.restore();
      return true;
    });
  },

  updateHeader(){
    $('#weekLabel').textContent = S.week.start ? fmtRange(S.week.start) : '';
    // week progress line: completed blocks per bucket / total
    const total = S.week.blocks.length || 1;
    const segs = S.colors.map(c=>{
      const n = droppedCount(c.id); if(!n) return '';
      const p = palFor(c);
      return `<i style="width:${n/total*100}%;background:${p.fill};border-right:1.5px solid var(--bg)"></i>`;
    }).join('');
    const doneN = S.week.blocks.filter(b=>b.status==='dropped').length;
    $('#floorHint').innerHTML = S.colors.length
      ? `<div class="day-bar-wrap"><span class="day-bar-label">Week</span><div class="day-bar">${segs}</div><span class="day-bar-label">${doneN}/${S.week.blocks.length}</span></div>
         <div class="floor-whisper">Drop a block in today. Drag one to its bucket to claim it done. Just throw some around — it's allowed.</div>`
      : esc(V().empty);
    // sweep fab: end of week only, dismissable
    const fab = $('#btnRoundup');
    if(fab){
      const days = S.week.start ? (Date.now()-new Date(S.week.start))/864e5 : 0;
      const due = this.mode==='week' && S.colors.length>0 && days>=6 && S.settings.sweepDismissed!==dayKey();
      fab.hidden = !due;
    }
  },
  pause(){ this.paused = true; },
  resume(){ this.paused = false; },
};

/* ═════════ BUCKET SHEET ═════════ */
const BucketSheet = {
  open(i){
    const bk = S.buckets[i]; const c = S.colors.find(x=>x.id===bk.colorId);
    const p = palFor(c);
    const done = droppedCount(c.id), left = trayBlocks(c.id).length;
    let html = `
      <h3><span class="swatch" style="display:inline-flex;width:30px;height:30px;border-radius:9px;background:${p.fill};border-color:${p.edge};--swk:${iconInkFor(c, p.fill)};vertical-align:-7px;margin-right:8px">${ic(c.icon)}</span>${esc(bk.name)}</h3>
      <p class="sh-sub mono" id="bsWeekLine">${done}/${c.goal} this week${left?` · ${left} on the floor`:''}</p>`;
    const cfg = chunkCfg(bk.chips);
    const chunkLabel = t => `Today's small chunks — ${t}/${cfg.perDay}`
      + (cfg.unit ? ` · ${t*cfg.chunk} of ${cfg.total} ${esc(cfg.unit)}` : '')
      + (cfg.perBlock<cfg.perDay ? ` · block every ${cfg.perBlock}` : '');
    if(bk.chips){
      const today = S.week.chips[bk.id]?.[dayKey()] || 0;
      html += `
        <div class="bc-label">${chunkLabel(today)}</div>
        <div class="chip-tally">${Array.from({length:Math.min(cfg.perDay,32)},(_,k)=>`<div class="chip-cell ${k<today?'on':''}"></div>`).join('')}</div>
        <div class="sheet-actions">
          <button class="btn btn-ghost" id="chipMinus">− small chunk</button>
          <button class="btn btn-primary" id="chipPlus">＋ small chunk</button>
        </div>
        <hr style="border:none;border-top:2px solid var(--hairline);margin:18px 0">`;
    }
    html += `
      <div class="bc-label">${bk.chips?'Or log whole blocks':'Log it by number'}</div>
      <div class="stepper stepper-center" style="margin:12px 0 2px"><button id="cntMinus">−</button><span class="val" id="cntVal">1</span><button id="cntPlus">＋</button></div>
      <div class="sheet-actions">
        <button class="btn btn-ghost" id="shClose">Close</button>
        <button class="btn btn-primary" id="shDrop" ${left?'':'disabled style="opacity:.5"'}>Kachunk it.</button>
      </div>`;
    Sheet.open(html);
    const sheetEl = $('#sheet'); if(sheetEl) sheetEl.dataset.bkId = bk.id;
    let n = 1;
    const val = $('#cntVal');
    $('#cntMinus').onclick = ()=>{ n = clamp(n-1,1,Math.max(left,1)); val.textContent = n; };
    $('#cntPlus').onclick = ()=>{ n = clamp(n+1,1,Math.max(left,1)); val.textContent = n; };
    $('#shClose').onclick = ()=>Sheet.close();
    $('#shDrop').onclick = ()=>{
      if(!left) return;
      Sheet.close();
      Floor.flyIn(c.id, Math.min(n,left), 'entry');
    };
    if(bk.chips){
      const paint = ()=>{
        const today = S.week.chips[bk.id]?.[dayKey()] || 0;
        $$('.chip-cell', $('#sheet')).forEach((el,k)=>el.classList.toggle('on', k<today));
        $('.bc-label', $('#sheet')).innerHTML = chunkLabel(today);
        const weekLine = $('#bsWeekLine'); if(weekLine){ const d2=droppedCount(c.id), l2=trayBlocks(c.id).length; weekLine.textContent = `${d2}/${c.goal} this week${l2?` · ${l2} on the floor`:''}`; }
      };
      /* set today's count to an exact point — fills up OR trims down; banks any blocks crossed on the way up */
      const setChips = n=>{
        S.week.chips[bk.id] = S.week.chips[bk.id]||{};
        const o = S.week.chips[bk.id][dayKey()]||0;
        n = clamp(n, 0, cfg.perDay);
        if(n===o) n = o-1; // tapping the last filled chunk un-fills it
        if(n<0) n = 0;
        S.week.chips[bk.id][dayKey()] = n; save();
        const crossed = Math.floor(n/cfg.perBlock) - Math.floor(o/cfg.perBlock);
        if(crossed>0){
          const flew = Floor.flyIn(c.id, crossed, 'chips');
          toast(flew?V().chipDone:V().chipTick);
        } else sfx('tick');
        paint();
      };
      $$('.chip-cell', $('#sheet')).forEach((el,k)=>el.onclick = ()=>setChips(k+1));
      $('#chipPlus').onclick = ()=>{
        const today = (S.week.chips[bk.id]?.[dayKey()]||0);
        if(today>=cfg.perDay) return;
        setChips(today+1);
      };
      $('#chipMinus').onclick = ()=>{
        const today = (S.week.chips[bk.id]?.[dayKey()]||0);
        if(!today) return;
        setChips(today-1);
      };
    }
  }
};

/* ═════════ ROUNDUP ═════════ */
const Roundup = { start(){ Floor.enterSweep('week'); } };

/* ═════════ RESET TODAY — undo the day's play/fake recordings, keep the week ═════════ */
const DayReset = {
  todayDrops(){ return S.week.blocks.filter(b=>b.status==='dropped' && b.ts && dayKey(new Date(b.ts))===dayKey()); },
  todayChipBuckets(){ return Object.keys(S.week.chips||{}).filter(bid=>((S.week.chips[bid]||{})[dayKey()]||0) > 0); },
  confirm(){
    const drops = this.todayDrops().length, chips = this.todayChipBuckets().length;
    if(!drops && !chips){ toast('Nothing recorded today — the board is already clean.'); return; }
    const what = [drops?`${drops} block${drops>1?'s':''}`:null, chips?'today’s small chunks':null].filter(Boolean).join(' and ');
    Sheet.open(`
      <h3>Reset today?</h3>
      <p class="sh-sub">Puts ${what} back on the floor, like today never got recorded. The rest of the week keeps its receipts. Been playing with the blocks? This is the eraser.</p>
      <div class="sheet-actions" style="margin-top:14px">
        <button class="btn btn-ghost" id="rdCancel" style="flex:1">Keep it</button>
        <button class="btn-danger" id="rdGo" style="flex:1;padding:12px 16px">Reset today</button>
      </div>`);
    $('#rdCancel').onclick = ()=>Sheet.close();
    $('#rdGo').onclick = ()=>{ Sheet.close(); this.run(); };
  },
  run(){
    this.todayDrops().forEach(b=>{ b.status='tray'; b.via=null; b.ts=null; });
    this.todayChipBuckets().forEach(bid=>{ delete S.week.chips[bid][dayKey()]; });
    (S.day.items||[]).forEach(i=>{ i.done = false; });
    S.day.celebrated = false;
    Undo.clear(); save();
    Floor.exitSweep(); Floor.rebuild(); sfx('toss'); buzz(16);
    toast('Today’s recordings reset — blocks are back on the floor.');
  }
};

/* ═════════ ADD ENTRY — count a rep after the fact, any day this week, no dragging ═════════ */
const EntryLog = {
  sel:null,
  open(){ this.sel = dayKey(); this.render(); },
  days(){
    const out = [];
    const start = new Date(S.week.start || new Date()); start.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    for(const d = new Date(start); d <= today; d.setDate(d.getDate()+1)) out.push(dayKey(d));
    return out.length ? out : [dayKey()];
  },
  fmt(day){ return new Date(day+'T12:00:00').toLocaleDateString('en-US',{weekday:'short', month:'short', day:'numeric'}); },
  countFor(colorId, day){
    return S.week.blocks.filter(b=>b.colorId===colorId && b.status==='dropped' && b.ts && dayKey(new Date(b.ts))===day).length;
  },
  add(colorId){
    const block = trayBlocks(colorId)[0];
    if(!block){ toast('No blocks left for that bucket this week.'); return; }
    const isToday = this.sel===dayKey();
    block.status='dropped'; block.via='manual';
    block.ts = isToday ? new Date().toISOString() : new Date(this.sel+'T12:00:00').toISOString();
    Undo.push({type:'drop', blockId:block.id});
    if(isToday) DayB.markDone(block.id);
    save(); sfx('drop'); buzz(10);
    this.render(); Floor.syncBuckets(); Floor.updateHeader();
  },
  remove(colorId){
    const cand = S.week.blocks
      .filter(b=>b.colorId===colorId && b.status==='dropped' && b.ts && dayKey(new Date(b.ts))===this.sel)
      .sort((a,b)=>a.ts<b.ts?1:-1)[0];
    if(!cand) return;
    cand.status='tray'; cand.via=null; cand.ts=null;
    const it = DayB.items().find(i=>i.blockId===cand.id); if(it) it.done = false;
    S.day.celebrated = false;
    save(); sfx('tick');
    this.render(); Floor.syncBuckets(); Floor.updateHeader();
  },
  render(){
    const days = this.days();
    let i = days.indexOf(this.sel); if(i<0){ i = days.length-1; this.sel = days[i]; }
    const isToday = this.sel===dayKey();
    const rows = S.colors.map(c=>{
      const p = palFor(c); const n = this.countFor(c.id, this.sel); const left = trayBlocks(c.id).length;
      const bk = S.buckets.find(b=>b.colorId===c.id);
      return `<div class="el-row">
        <span class="swatch" style="background:${p.fill};border-color:${p.edge};--swk:${iconInkFor(c,p.fill)}">${ic(c.icon)}</span>
        <span class="el-name">${esc(c.name)}${bk&&bk.chips?'<i class="el-chip-hint">small chunks count on the bucket — this logs whole blocks</i>':''}</span>
        <div class="stepper"><button data-minus="${c.id}" ${n?'':'disabled'}>−</button><span class="val">${n}</span><button data-plus="${c.id}" ${left?'':'disabled'}>＋</button></div>
      </div>`;
    }).join('');
    Sheet.open(`
      <h3>Add an entry</h3>
      <p class="sh-sub">Count it after the fact — no dragging required. Entries still come out of this week’s blocks.</p>
      <div class="el-day">
        <button class="btn-icon" id="elPrev" ${i===0?'disabled':''} aria-label="Previous day">‹</button>
        <div class="el-date"><strong>${esc(this.fmt(this.sel))}</strong>${isToday?' <span class="el-today">TODAY</span>':''}</div>
        <button class="btn-icon" id="elNext" ${i===days.length-1?'disabled':''} aria-label="Next day">›</button>
      </div>
      ${rows || '<p class="sh-sub">No buckets yet — add one in Settings.</p>'}
      <div class="sheet-actions" style="margin-top:14px"><button class="btn btn-primary" id="elDone" style="flex:1">Done</button></div>`,
      {onClose:()=>Floor.rebuild()});
    $('#elPrev').onclick = ()=>{ if(i>0){ this.sel = days[i-1]; this.render(); } };
    $('#elNext').onclick = ()=>{ if(i<days.length-1){ this.sel = days[i+1]; this.render(); } };
    $('#elDone').onclick = ()=>Sheet.close();
    $$('#sheet [data-plus]').forEach(b=>b.onclick = ()=>this.add(b.dataset.plus));
    $$('#sheet [data-minus]').forEach(b=>b.onclick = ()=>this.remove(b.dataset.minus));
  }
};

/* ═════════ RESTACK (reset week) — confirmed, voice-flavored ═════════ */
const WeekRestack = {
  confirm(){
    const d = S.week.blocks.filter(b=>b.status==='dropped').length, g = S.week.blocks.length;
    Sheet.open(`
      <h3>${esc(V().restackTitle)}</h3>
      <p class="sh-sub">${esc(V().restackBody(d,g))} Unplaced blocks go down as not-done, and a fresh stack is built from your goals.</p>
      <div class="sheet-actions" style="margin-top:14px">
        <button class="btn btn-ghost" id="rwCancel" style="flex:1">Not yet</button>
        <button class="btn btn-primary" id="rwGo" style="flex:1">${esc(V().restackBtn)}</button>
      </div>`);
    $('#rwCancel').onclick = ()=>Sheet.close();
    $('#rwGo').onclick = ()=>{ Sheet.close(); Floor.restackWeek(); };
  }
};

/* ═════════ RECEIPTS ═════════ */
const Receipts = {
  open(){ show('#screen-receipts'); this.render(); },
  weekData(){
    const live = {start:S.week.start, perColor:S.colors.map(c=>({colorId:c.id, name:c.name, pal:c.pal, customHex:c.customHex||null,
      done:droppedCount(c.id), partial:partialCount(c.id)})), live:true};
    return [live, ...S.history];
  },
  completedOf(w){ return w.perColor.reduce((a,x)=>a+x.done+x.partial, 0); },
  render(){
    const weeks = this.weekData();
    $('#receiptsWeekLabel').textContent = '';
    const archived = weeks.slice(1, 5);
    const basis = archived.length ? archived : weeks.slice(0,1);
    const avg = Math.round(basis.reduce((a,w)=>a+this.completedOf(w),0) / basis.length * 10) / 10;
    const best = Math.max(...weeks.map(w=>this.completedOf(w)));
    const palOf = i => PALETTE[i % PALETTE.length];
    const miniBlocks = (n, cap=12) => {
      const full = Math.min(Math.floor(n), cap);
      const frac = n - Math.floor(n);
      let h = '';
      for(let i=0;i<full;i++){ const p = palOf(i); h += `<i style="background:${p.fill};border:1px solid ${p.edge}"></i>`; }
      if(frac > 0.05 && full < cap){ const p = palOf(full); h += `<i style="background:${p.fill};border:1px solid ${p.edge};opacity:.45"></i>`; }
      if(Math.floor(n) > cap) h += `<em>+${Math.floor(n)-cap}</em>`;
      return `<div class="mini-blocks">${h||'<i style="background:var(--hairline);border:1px solid var(--hairline)"></i>'}</div>`;
    };
    const cards = weeks.map(w=>{
      const n = this.completedOf(w);
      const dots = w.perColor.map(x=>{
        const p = palFor(x);
        const count = x.done + x.partial;
        if(!count) return '';
        return Array.from({length:Math.min(count,14)},()=>`<i style="background:${p.fill};border:1px solid ${p.edge}" title="${esc(x.name)}"></i>`).join('') + '<span class="gap"></span>';
      }).join('');
      return `<div class="wk-card">
        <div class="wk-head"><span class="wk-n">${n}</span><span class="muted" style="font-size:13px">block${n===1?'':'s'}${w.live?' · this week':''}</span>
        <span class="wk-range">${fmtRange(w.start)}</span></div>
        ${dots?`<div class="wk-dots">${dots}</div>`:'<div class="muted" style="font-size:12px;margin-top:6px">nothing claimed yet</div>'}
      </div>`;
    }).join('');
    const avgLabel = archived.length
      ? `avg blocks / week<br>(last ${archived.length===1?'week':archived.length+' weeks'})`
      : `blocks so far<br>(this week)`;
    $('#receiptsBody').innerHTML = `
      <div class="set-group"><h3>How it's going</h3>
        <div class="avg-row">
          <div class="avg-cell"><div class="n">${avg}</div>${miniBlocks(avg)}<div class="t">${avgLabel}</div></div>
          <div class="avg-cell"><div class="n">${best}</div>${miniBlocks(best)}<div class="t">best week<br>yet</div></div>
          <div class="avg-cell"><div class="n">${weeks.length}</div>${miniBlocks(weeks.length,7)}<div class="t">weeks<br>tracked</div></div>
        </div>
      </div>
      <div class="set-group"><h3>Week by week</h3>
        ${cards}
      </div>
      <p class="muted" style="text-align:center;font-size:12px;margin-top:14px">Only claimed blocks are counted. Unclaimed weeks aren't held against you.</p>`;
  }
};

/* ═════════ SETTINGS ═════════ */
const Settings = {
  open(){ this.editingId = null; this.newDraft = null; show('#screen-settings'); this.render(); },
  /* the recap fit check, permanent: goals in day-slots vs what one day can hold */
  fitHTML(){
    const goalSlots = S.colors.reduce((a,c)=>a+((S.nextGoals[c.id]??c.goal)*(c.slotSize||1)),0);
    const capacity = S.day.maxSlots*7;
    const fits = goalSlots <= capacity;
    return `<div class="fit-card ${fits?'ok':'over'}" id="setFitCard">
      <div><strong>${goalSlots}</strong> slots of goals per week</div>
      <div><strong>${capacity}</strong> slots you'd have (${S.day.maxSlots} × 7 days)</div>
      <div class="fit-verdict">${fits ? '✓ It fits — with '+(capacity-goalSlots)+' slots of air.' : '✕ Over by '+(goalSlots-capacity)+' — shrink a goal or give days more room.'}</div>
    </div>`;
  },
  addBucket(){
    if(S.colors.length>=6){ toast('Six buckets max — keep it holdable.'); return; }
    const bpKey = S.settings.blockPal||'brand';
    let hexes;
    if(bpKey==='custom') hexes = (S.settings.customPal&&S.settings.customPal.length===6)?S.settings.customPal:blockPalByKey('brand').hex;
    else if(bpKey.startsWith('saved:')){ const sp=(S.settings.savedPals||[]).find(p=>'saved:'+p.id===bpKey); hexes = (sp&&sp.hex)||blockPalByKey('brand').hex; }
    else hexes = blockPalByKey(bpKey).hex;
    this.editingId = null;
    this.newDraft = {id:uid(), name:'', icon:'star', pal:PALETTE[S.colors.length%6].key,
      customHex: bpKey==='pastel' ? null : hexes[S.colors.length%6], shape:'cube'};
    this.render();
  },
  newCardHTML(){
    const nd = this.newDraft; const p = palFor(nd);
    return `<div class="bucket-card be-card be-new">
      <div class="bc-head">
        <button class="swatch" data-f="look" style="width:46px;height:46px;background:${p.fill};border-color:${p.edge};--swk:${iconInkFor(nd,p.fill)}" title="Change look">${ic(nd.icon)}</button>
        <input type="text" data-f="bname" placeholder="Name your bucket" aria-label="Bucket name" style="font-weight:700;font-size:17px">
      </div>
      <div class="set-note" style="padding:6px 2px 0">Icon + name together give the best starting guess — everything's tunable after.</div>
      <div class="sheet-actions" style="margin-top:12px">
        <button class="btn btn-ghost" data-f="cancel" style="flex:none;padding:11px 16px">Cancel</button>
        <button class="btn btn-primary" data-f="create" style="flex:1">Create</button>
      </div>
    </div>`;
  },
  colorRow(c){
    const p = palFor(c);
    const bk = S.buckets.find(b=>b.colorId===c.id);
    if(this.editingId===c.id) return bucketEditorHTML(c, {bucket:bk});
    const goal = S.nextGoals[c.id] ?? c.goal;
    const meta = [`${goal}×/wk`, (c.slotSize||1)!==1?fmtSlots(c.slotSize):null, (bk&&bk.chips)?'small chunks':null].filter(Boolean).join(' · ');
    return `<div class="color-row cr-tap" data-c="${c.id}" data-ord="${c.id}" role="button">
      <span class="drag-h" aria-label="Drag to reorder">⠿</span>
      <span class="swatch" style="background:${p.fill};border-color:${p.edge};--swk:${iconInkFor(c, p.fill)}">${ic(c.icon)}</span>
      <span class="cr-name">${esc(c.name)}</span>
      <span class="cr-meta mono">${meta}</span>
      <span class="cr-pencil" aria-hidden="true">${ic('pen')}</span>
    </div>`;
  },
  render(){
    $('#settingsBody').innerHTML = `
      <div class="set-group"><h3>The Roundup</h3>
        <div class="set-card">
          <div class="set-row"><span class="grow">Daily nudge at</span>
            <input type="time" id="setTime" value="${S.settings.roundupTime}"></div>
          <div class="set-row"><span class="grow">Sounds</span>
            <label class="switch"><input type="checkbox" id="setSound" ${S.settings.sound?'checked':''}><span class="knob"></span></label></div>
          <div class="set-row"><span class="grow">Plan tomorrow ahead</span>
            <label class="switch"><input type="checkbox" id="setPlanTmrw" ${S.settings.planTomorrow?'checked':''}><span class="knob"></span></label></div>
          <div class="set-note">Kachunk sends exactly one notification a day — the Roundup — and only when the app can. On iPhone, Add to Home Screen first. “Plan tomorrow ahead” lets new picks pre-fill tomorrow’s shelf once today’s plan is fully banked.</div>
        </div>
      </div>
      <div class="set-group"><h3>Appearance</h3>
        <div class="set-card">
          <div class="set-row"><span class="grow">Dark mode</span>
            <label class="switch"><input type="checkbox" id="setTheme" ${S.settings.theme==='dark'?'checked':''}><span class="knob"></span></label></div>
        </div>
      </div>
      <div class="set-group"><h3>Block colors</h3>
        ${BLOCK_PALETTES.map(bp=>palCardHTML(bp, (S.settings.blockPal||'brand')===bp.key)).join('')}
        ${(S.settings.savedPals||[]).map(sp=>savedCardHTML(sp, (S.settings.blockPal||'brand')==='saved:'+sp.id)).join('')}
        ${customCardHTML(S.settings.customPal||[], (S.settings.blockPal||'brand')==='custom')}
        <div class="set-note">Switching re-bases every bucket to the new palette, in order. Build your own to name &amp; save palettes.</div>
      </div>
      <div class="set-group"><h3>Buckets & goals</h3>
        <div id="setColors">${S.colors.map(c=>this.colorRow(c)).join('')}${this.newDraft ? this.newCardHTML() : ''}</div>
        <button class="btn btn-ghost" id="addColor" style="width:100%" ${S.colors.length>=6?'disabled style="opacity:.5"':''}>${S.colors.length>=6?"Six\u2019s the max — swap one out to add another":`＋ Add a bucket (${S.colors.length}/6)`}</button>
        <div class="set-note" style="padding:8px 2px">Tap a bucket to edit everything about it. Drag ⠿ to reorder — palettes apply their colors in this order. Goal changes land when you restack.</div>
      </div>
      <div class="set-group"><h3>Does the week fit?</h3>
        <div class="set-card" style="padding:4px 18px 14px">
          <div class="bc-label" style="margin-top:12px">Slots you'll give one day</div>
          <div style="display:flex;align-items:center;gap:14px">
            <input type="range" id="setFitSlider" min="2" max="${Math.max(16,S.day.maxSlots)}" step="1" value="${S.day.maxSlots}" style="flex:1;accent-color:var(--ink)">
            <span class="mono" style="font-size:20px;min-width:34px;text-align:center" id="setFitVal">${S.day.maxSlots}</span>
          </div>
        </div>
        ${this.fitHTML()}
      </div>
      <div class="set-group"><h3>Voice</h3>
        ${Object.entries(VOICES).map(([k,v])=>`
          <button class="voice-card ${S.settings.voice===k?'on':''}" data-v="${k}">
            <span class="vc-name">${v.label} <span class="heat">${v.heat}</span></span>
            <span class="vc-line">“${v.sample}”</span>
          </button>`).join('')}
      </div>
      <div class="set-group"><h3>Your data</h3>
        <div class="set-card">
          <div class="set-row set-act" id="expData" role="button" tabindex="0">
            <span class="set-ic">${ic('download')}</span><span class="grow">Export backup</span><span class="set-hint">.json</span></div>
          <div class="set-row set-act" id="impData" role="button" tabindex="0">
            <span class="set-ic">${ic('upload')}</span><span class="grow">Import backup</span><span class="set-hint">restores everything</span></div>
          <div class="set-row set-act set-act-danger" id="resetAll" role="button" tabindex="0">
            <span class="set-ic">${ic('trash')}</span><span class="grow">Start completely over</span></div>
        </div>
        <div class="set-note">Everything lives on this device — no account, no server. Export a backup any time; import it on a new phone.</div>
        <input type="file" id="impFile" accept=".json" hidden>
      </div>
      <p class="muted" style="text-align:center;font-size:12px">Kachunk v1 prototype · local-first · no tracking, no server, no streaks</p>`;
    // bindings
    $$('#settingsBody .voice-card').forEach(el=>el.onclick=()=>{
      S.settings.voice=el.dataset.v; save(); this.render();
      const v = VOICES[el.dataset.v];
      const pool = [...(v.drop||[]), ...(v.toss||[]).filter(Boolean), v.chipDone, v.allDone, v.perfect, v.restacked].filter(Boolean);
      toast(pool[Math.floor(Math.random()*pool.length)] || v.sample, {ms:2600});
    });
    $('#setTime').onchange = e=>{ S.settings.roundupTime = e.target.value||'20:30'; save(); };
    $('#setSound').onchange = e=>{ S.settings.sound = e.target.checked; save(); if(e.target.checked) sfx('tick'); };
    $('#setPlanTmrw').onchange = e=>{ S.settings.planTomorrow = e.target.checked; save(); };
    $('#setTheme').onchange = e=>{ S.settings.theme = e.target.checked?'dark':'light'; save(); applyTheme(); };
    $$('#settingsBody .pal-card').forEach(el=>el.onclick=()=>{
      S.settings.blockPal = el.dataset.bp;
      if(el.dataset.bp!=='custom'){
        applyBlockPalette(el.dataset.bp, S.colors);
        save(); this.render(); Floor.syncBuckets(); Floor.rebuild(); return;
      }
      if((S.settings.customPal||[]).length===6) applyBlockPalette('custom', S.colors, S.settings.customPal);
      save(); this.render();
      openCustomPicker(()=>S.settings.customPal||[],
        sel=>{ S.settings.customPal = sel; save(); },
        sel=>{ applyBlockPalette('custom', S.colors, sel); save(); },
        ()=>{ this.render(); Floor.syncBuckets(); Floor.rebuild(); },
        key=>{ S.settings.blockPal = key; applyBlockPalette(key, S.colors); save(); });
    });
    bindSavedPalDeletes('#settingsBody', delId=>{
      if(S.settings.blockPal==='saved:'+delId){ S.settings.blockPal = 'brand'; applyBlockPalette('brand', S.colors); }
      save(); this.render(); Floor.syncBuckets(); Floor.rebuild();
    });
    $('#setFitSlider').oninput = e=>{
      S.day.maxSlots = +e.target.value; save();
      $('#setFitVal').textContent = S.day.maxSlots;
      const fc = $('#setFitCard'); if(fc) fc.outerHTML = this.fitHTML();
    };
    $$('#setColors .color-row').forEach(row=>{
      const c = S.colors.find(x=>x.id===row.dataset.c);
      row.onclick = e=>{
        if(e.target.closest('.drag-h')) return;
        this.editingId = (this.editingId===c.id) ? null : c.id;
        this.newDraft = null;
        this.render();
      };
    });
    const beRoot = $('#setColors .be-card[data-be]');
    if(beRoot){
      const bc = S.colors.find(x=>x.id===beRoot.dataset.be);
      bindBucketEditor(beRoot, bc, {
        bucket: S.buckets.find(b=>b.colorId===bc.id),
        onChange: ()=>{ this.render(); Floor.syncBuckets(); Floor.rebuild(); Renderer3D.refreshColor(); },
        onClose: ()=>{ this.editingId = null; }
      });
    }
    const ndRoot = $('#setColors .be-new');
    if(ndRoot){
      const nd = this.newDraft;
      const nameI = ndRoot.querySelector('[data-f=bname]');
      nameI.value = nd.name||'';
      nameI.oninput = e=>{ nd.name = e.target.value; };
      const createIt = ()=>{
        const nm = (nd.name||'').trim(); if(!nm){ toast('Give it a name first.'); return; }
        const g = starterGuess(nm, nd.icon);
        const c = {id:nd.id, name:nm, icon:nd.icon, pal:nd.pal, customHex:nd.customHex||null, shape:'cube', goal:g.goal, slotSize:g.slots};
        S.colors.push(c);
        S.buckets.push({id:uid(), colorId:c.id, name:nm, notes:'', chips:g.chips});
        for(let i=0;i<c.goal;i++) S.week.blocks.push({id:uid(), colorId:c.id, status:'tray', via:null, ts:null});
        save();
        this.newDraft = null; this.editingId = c.id;
        this.render(); Floor.syncBuckets(); Floor.rebuild();
      };
      nameI.onkeydown = e=>{ if(e.key==='Enter') createIt(); };
      ndRoot.querySelector('[data-f=look]').onclick = ()=>openColorPicker(nd, ()=>this.render());
      ndRoot.querySelector('[data-f=create]').onclick = createIt;
      ndRoot.querySelector('[data-f=cancel]').onclick = ()=>{ this.newDraft = null; this.render(); };
      if(!nd.name) setTimeout(()=>nameI.focus(), 60);
    }
    enableReorder($('#setColors'), ids=>{
      S.colors.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));
      S.buckets.sort((a,b)=>ids.indexOf(a.colorId)-ids.indexOf(b.colorId));
      save(); this.render(); Floor.syncBuckets();
    });
    $('#addColor').onclick = ()=>this.addBucket();
    $('#expData').onclick = ()=>{
      const blob = new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `kachunk-backup-${dayKey()}.json`; a.click();
    };
    $('#impData').onclick = ()=>$('#impFile').click();
    $('#impFile').onchange = e=>{
      const f = e.target.files[0]; if(!f) return;
      const r = new FileReader();
      r.onload = ()=>{ try{
        const data = JSON.parse(r.result);
        if(!data.version || !data.colors) throw 0;
        S = Object.assign(defaults(), data); save();
        this.render(); Floor.rebuild(); toast('Imported. Welcome back.');
      }catch(err){ toast('That file isn’t a Kachunk backup.'); } };
      r.readAsText(f);
    };
    $('#resetAll').onclick = ()=>{
      if(!confirm('Wipe everything — colors, buckets, history — and start over?')) return;
      localStorage.removeItem(KEY); S = defaults(); save();
      show('#screen-splash'); location.reload();
    };
  },
  renderGoalHint(row, c){
    const next = S.nextGoals[c.id];
    row.querySelector('.val').textContent = next!==undefined ? next : c.goal;
  }
};


/* ═════════ TODAY — plan zone state (a temporary plan, never reported) ═════════ */
const DayB = {
  items(){ return S.day.items || []; },
  pickedSet(){
    if(S.day.date!==dayKey()) return null;
    const act = this.items();
    return act.length ? new Set(act.map(i=>i.blockId)) : null;
  },
  unitsOf(colorId){ const c = S.colors.find(k=>k.id===colorId); return (c && c.slotSize) || 1; },
  dayOf(i){ return i.day||'today'; },
  used(day='today'){ return this.items().filter(i=>this.dayOf(i)===day).reduce((a,i)=>a+this.unitsOf(i.colorId),0); },
  doneUnits(){ return this.items().filter(i=>this.dayOf(i)==='today' && i.done).reduce((a,i)=>a+this.unitsOf(i.colorId),0); },
  todayComplete(){ const t = this.items().filter(i=>this.dayOf(i)==='today'); return t.length>0 && t.every(i=>i.done); },
  /* once today's plan is fully banked, new plans can pre-fill tomorrow — opt-in (Settings), off by default */
  target(){ return (S.settings.planTomorrow && this.todayComplete()) ? 'tomorrow' : 'today'; },
  isPlanned(blockId){ return this.items().some(i=>i.blockId===blockId); },
  setPlanned(block, on){
    let items = this.items().filter(i=>i.blockId!==block.id);
    if(on) items.push({id:uid(), blockId:block.id, colorId:block.colorId, done:false, day:this.target()});
    S.day.items = items; S.day.date = dayKey(); save();
  },
  dropFromPlan(blockId){ S.day.items = this.items().filter(i=>i.blockId!==blockId); save(); },
  /* banked blocks keep counting toward the day — mark done instead of vanishing */
  markDone(blockId){
    const it = this.items().find(i=>i.blockId===blockId);
    if(!it) return false;
    it.done = true; save();
    if(this.todayComplete() && !S.day.celebrated){
      S.day.celebrated = true; save();
      setTimeout(()=>Floor.dayCelebrate(), 380);
    }
    return true;
  },
  _newDayAsking:false, _newDaySnoozed:false,
  staleCheck(){
    if(!S.day.date || S.day.date===dayKey()) return false;
    // nothing was planned → nothing to review; roll the date silently, no popup
    if(!this.items().length){ S.day.date = dayKey(); S.day.celebrated = false; save(); return false; }
    if(this._newDayAsking || this._newDaySnoozed) return false;
    // ask before assuming — the flow only starts on her say-so
    this._newDayAsking = true;
    const nice = new Date().toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric'});
    let confirmed = false;
    $('#screen-floor').classList.add('board-live');
    Sheet.open(`
      <h3>Start a new day?</h3>
      <p class="sh-sub">${esc(V().newDay || 'A new day is here.')}</p>
      <p class="sh-sub" style="opacity:.75">It’s ${esc(nice)}. Yesterday’s plan gets a quick review — nothing resets into the void.</p>
      <div class="sheet-actions" style="margin-top:14px">
        <button class="btn btn-ghost" id="ndLater" style="flex:1">Not yet</button>
        <button class="btn btn-primary" id="ndGo" style="flex:1">Start the day</button>
      </div>`, {onClose:()=>{
        this._newDayAsking = false;
        $('#screen-floor').classList.remove('board-live');
        if(confirmed) this.beginNewDay();
        else { this._newDaySnoozed = true; Floor.applyMode(); } // re-asks next time the app comes back
      }});
    $('#ndLater').onclick = ()=>Sheet.close();
    $('#ndGo').onclick = ()=>{ confirmed = true; Sheet.close(); };
    return true;
  },
  beginNewDay(){
    // banked items retire, tomorrow's pre-plan becomes today, celebration re-arms
    S.day.items = this.items().filter(i=>!i.done);
    const staleIds = new Set(this.items().filter(i=>this.dayOf(i)==='today').map(i=>i.id));
    this.items().forEach(i=>{ if(this.dayOf(i)==='tomorrow') i.day='today'; });
    S.day.celebrated = false; save();
    if(staleIds.size){ this.resetFlow(staleIds); return; }
    S.day.date = dayKey(); save(); Floor.applyMode();
  },
  resetFlow(onlyIds){
    S.day.date = dayKey(); save(); // stamp first so repeated repaints can't re-run the migration
    const pending = this.items().filter(i=>(!onlyIds || onlyIds.has(i.id)) && S.week.blocks.some(b=>b.id===i.blockId && b.status!=='dropped'));
    if(!pending.length){ S.day.items = []; save(); return; }
    const rows = pending.map(it=>{
      const c = S.colors.find(k=>k.id===it.colorId); const p = c?palFor(c):{fill:'#DDD',edge:'#AAA'};
      return `<div class="ru-blockline" data-id="${it.id}" style="justify-content:space-between">
        <span style="display:flex;align-items:center;gap:9px;min-width:0"><span class="ru-mini" style="background:${p.fill};border-color:${p.edge}">${ic(c?c.icon:'star')}</span><strong>${esc(c?c.name:'Block')}</strong></span>
        <span style="display:flex;gap:6px;flex:none">
          <button class="btn btn-ghost" data-act="log" style="padding:7px 12px;font-size:12.5px">It happened ✓</button>
          <button class="btn btn-ghost" data-act="keep" style="padding:7px 12px;font-size:12.5px">Keep</button>
          <button class="btn btn-ghost" data-act="toss" style="padding:7px 12px;font-size:12.5px">Toss</button>
        </span></div>`;
    }).join('');
    $('#screen-floor').classList.add('board-live');
    Sheet.open(`
      <h3>Yesterday's plan is still out.</h3>
      <p class="sh-sub">Log it (into the bucket), keep it for today, or toss it back on the floor. Nothing resets into the void.</p>
      ${rows}`, {onClose:()=>{ $('#screen-floor').classList.remove('board-live'); S.day.date = dayKey(); save(); Floor.applyMode(); }});
    $$('#sheet [data-act]').forEach(btn=>btn.onclick = ()=>{
      const row = btn.closest('[data-id]'); const it = this.items().find(k=>k.id===row.dataset.id);
      if(it){
        if(btn.dataset.act==='log'){
          const block = S.week.blocks.find(b=>b.id===it.blockId);
          if(block && block.status!=='dropped'){ block.status='dropped'; block.via='day'; block.ts=new Date().toISOString(); Undo.push({type:'drop', blockId:block.id}); sfx('drop'); }
          this.dropFromPlan(it.blockId);
        }
        if(btn.dataset.act==='toss') this.dropFromPlan(it.blockId);
        // keep = leave item
        save();
      }
      row.remove();
      if(!$('#sheet [data-id]')) Sheet.close();
    });
  }
};

/* ═════════ NOTIFICATIONS ═════════ */
const Notif = {
  timer:null,
  init(){ setInterval(()=>this.check(), 30000); this.check(); },
  due(){
    if(!S.onboarded) return false;
    const [h,m] = (S.settings.roundupTime||'20:30').split(':').map(Number);
    const now = new Date();
    const target = new Date(); target.setHours(h,m,0,0);
    const lastRu = S.lastRoundup ? new Date(S.lastRoundup) : null;
    const doneToday = lastRu && lastRu.toDateString()===now.toDateString();
    return now>=target && !doneToday && trayBlocks().length>0;
  },
  check(){
    if(!this.due()) return;
    const key = 'kachunk.notified.'+dayKey();
    if(sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key,'1');
    if('Notification' in window && Notification.permission==='granted'){
      try{
        navigator.serviceWorker?.ready.then(reg=>{
          reg.showNotification(V().notifTitle, {body:V().notifBody, icon:'icon-192.png', badge:'badge-96.png', tag:'roundup'});
        }).catch(()=>{ new Notification(V().notifTitle,{body:V().notifBody,icon:'icon-192.png'}); });
      }catch(e){}
    }
  }
};

/* ═════════ BOOT ═════════ */
function applyTheme(){
  const dark = S.settings.theme==='dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const m = document.querySelector('meta[name=theme-color]');
  if(m) m.content = dark ? '#1E262D' : '#F8F6F2';
  const t = $('#btnTheme');
  if(t){ t.innerHTML = ic(dark ? 'sun' : 'moon'); t.title = dark ? 'Light mode' : 'Dark mode'; }
}
function boot(){
  load();
  applyTheme();
  // week rollover check: if stored week started 7+ days ago, we do NOT auto-reset — Roundup handles it.
  document.body.addEventListener('pointerdown', ()=>{
    if(S.settings.sound) ac();
    try{ if(window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission==='function') DeviceMotionEvent.requestPermission().catch(()=>{}); }catch(e){}
  }, {once:true});
  document.addEventListener('click', e=>{
    if(e.target.closest('button, .chip, .voice-card, .swatch, .pickdot, .iconpick, .knob, input[type=time], input[type=checkbox], input[type=range]')) sfx('tap');
  }, true);

  $('#btnStart').onclick = ()=>{ if(S.onboarded){ show('#screen-floor'); Floor.rebuild(); } else OB.start(); };
  $('#obNext').onclick = ()=>OB.next();
  $('#obBack').onclick = ()=>OB.back();
  $('#btnReceipts').onclick = ()=>Receipts.open();
  $('#fabDismiss').onclick = e=>{ e.stopPropagation(); S.settings.sweepDismissed = dayKey(); save(); $('#btnRoundup').hidden = true; };
  $('#spRestack').onclick = ()=>Floor.restackWeek();
  $('#spClose').onclick = ()=>Floor.closeSweep();
  // bottom action bar
  $$('#actionBar .ab-ic').forEach(el=>el.innerHTML = ic(el.dataset.ic));
  $('#abUndo').onclick = ()=>Undo.pop();
  $('#abReset').onclick = ()=>DayReset.confirm();
  $('#abAdd').onclick = ()=>EntryLog.open();
  $('#abNight').onclick = ()=>{ if(!Floor.sweepMode) Floor.enterSweep('day'); };
  $('#abRestack').onclick = ()=>WeekRestack.confirm();
  $('#btnSettings').onclick = ()=>Settings.open();
  $('#receiptsBack').onclick = ()=>{ show('#screen-floor'); };
  $('#settingsBack').onclick = ()=>{ show('#screen-floor'); Floor.rebuild(); };
  $('#btnRoundup').onclick = ()=>Roundup.start();
  // replace header text icons with line icons
  $('#btnReceipts').innerHTML = ic('grid');
  $('#btnSettings').innerHTML = ic('sliders');
  $('#btnTheme').onclick = ()=>{ S.settings.theme = S.settings.theme==='dark'?'light':'dark'; save(); applyTheme(); };
  applyTheme(); // sets the moon/sun icon
  $('#receiptsBack').innerHTML = ic('back');
  $('#settingsBack').innerHTML = ic('back');
  $('#obBack').innerHTML = ic('back');

  if(S.onboarded){ show('#screen-floor'); Floor.rebuild(); if(!DayB.staleCheck()) Floor.applyMode(); }
  // roll the day over when the app is brought back to the foreground (left open overnight)
  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState==='hidden'){ DayB._newDaySnoozed = false; return; } // "Not yet" holds only until the app is put away
    if(document.visibilityState==='visible' && S.onboarded && S.day.date!==dayKey()){
      if(!DayB.staleCheck()) Floor.applyMode();
    }
  });
  if(!DEMO) Notif.init();
  if(!DEMO && 'serviceWorker' in navigator){ try{ navigator.serviceWorker.register('sw.js'); }catch(e){} }
}
document.addEventListener('DOMContentLoaded', boot);
