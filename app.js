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
  back:   '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  cloud:  '<path d="M7 18.5a4.5 4.5 0 01-.4-9A6 6 0 0118.2 11a3.8 3.8 0 01-.7 7.5H7z"/>',
  download:'<path d="M12 3.5v11M7.5 10l4.5 4.5L16.5 10M4.5 20.5h15"/>',
  upload: '<path d="M12 14.5v-11M7.5 8L12 3.5 16.5 8M4.5 20.5h15"/>',
  trash:  '<path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 011.3-1.3h2.4a1.3 1.3 0 011.3 1.3v1.7M6.5 6.5l.8 12.2a2 2 0 002 1.8h5.4a2 2 0 002-1.8l.8-12.2M10 10.5v6M14 10.5v6"/>',
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
  {key:'brand',  name:'Kachunk',        hint:'the brand colors',        hex:['#7C93A5','#DD7C54','#DFC289','#7E9B95','#C98D7E','#85A88E']},
  {key:'pastel', name:'Pretty pastels', hint:'soft & barely there',     hex:PALETTE.map(p=>p.fill)},
  {key:'bright', name:'Toy box',        hint:'louder, board-game pop',  hex:['#4E8AC8','#E2574C','#F2A93B','#3FA06E','#8A64C8','#E56FA1']},
  {key:'grey',   name:'Greyscale',      hint:'zero color noise',        hex:['#D9D6CF','#BDB9B1','#A19D94','#858179','#6C6862','#524F4A']},
  {key:'mono',   name:'Mono',           hint:'icons do the talking',    hex:['#E7E2D6','#E7E2D6','#E7E2D6','#E7E2D6','#E7E2D6','#E7E2D6']},
];
const blockPalByKey = k => BLOCK_PALETTES.find(p=>p.key===k) || BLOCK_PALETTES[0];
/* re-base every color to the chosen palette by slot order (custom hexes get replaced) */
function applyBlockPalette(key, colors){
  const bp = blockPalByKey(key);
  colors.forEach((c,i)=>{
    if(key==='pastel'){ c.customHex = null; c.pal = PALETTE[i%6].key; }
    else c.customHex = bp.hex[i%6];
  });
}
function palCardHTML(bp, on){
  return `<button class="pal-card ${on?'on':''}" data-bp="${bp.key}">
    <span><span class="pc-name">${bp.name}</span><span class="pc-hint">${bp.hint}</span></span>
    <span class="pal-dots">${bp.hex.map(h=>`<i style="background:${h};box-shadow:inset 0 -3px 0 ${shade(h,-0.22)}"></i>`).join('')}</span>
  </button>`;
}

const SHAPES = [
  {key:'cube',  name:'Cube'},
  {key:'plank', name:'Plank'},
  {key:'arch',  name:'Arch'},
  {key:'drum',  name:'Drum'},
];

/* ── starter colors ── */
const STARTERS = [
  {name:'Move',      icon:'dumbbell',   pal:'gentlemist',   goal:3, slots:2},
  {name:'Meal Prep', icon:'utensils',   pal:'dreamysand',  goal:2, slots:1},
  {name:'Social',    icon:'smile',      pal:'goldenglow',  goal:2, slots:3},
  {name:'Water',     icon:'droplet',    pal:'cloudyhaze',   goal:7, slots:1, chips:{target:8, countsAt:5}},
  {name:'Deep Work', icon:'brain',      pal:'softhoney',   goal:4, slots:2},
  {name:'Family',    icon:'heart',      pal:'peachwhisper',       goal:2, slots:1},
  {name:'Rest',      icon:'moon',       pal:'cloudyhaze', goal:3, slots:1},
  {name:'Read',      icon:'book_open',  pal:'softhoney',       goal:3, slots:1},
  {name:'Create',    icon:'palette',    pal:'gentlemist',  goal:2, slots:2},
  {name:'Outside',   icon:'leaf',       pal:'softhoney',       goal:4, slots:1},
  {name:'Admin',     icon:'inbox',      pal:'dreamysand',  goal:3, slots:1},
  {name:'Tidy',      icon:'sparkles',   pal:'cloudyhaze', goal:4, slots:1},
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
    chipTick:'Chip. Keep ’em coming.',
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
    chipTick:'A chip. Riveting. Keep going.',
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
  },
  sugar: {
    label:'Sugar Rush', heat:'MAXIMUM POMPOMS', sample:'YESSS! Another block in the bucket!! You’re UNSTOPPABLE!!',
    tagline:'Every block you drop is a little victory parade! 🎉',
    hint:'Did the thing? Drop that gorgeous block in its bucket!! Or toss one around — you’ve earned playtime!',
    drop:['YES!! KACHUNK!!','You DID that!','Bucket: fed. You: incredible.','Another one!! I’m so proud!!','That’s my favorite sound!!'],
    wrongBucket:(b)=>`Ooh so close!! That cutie belongs in ${b}! You’ve got this!`,
    toss:['WHEEE!!','Block airlines, now boarding!!','Joy is productive too!!'],
    entry:(n)=>n>1?`${n} WHOLE BLOCKS?! Superstar!!`:`A WHOLE BLOCK!! Superstar!!`,
    chipDone:'DING DING! That’s a full block, superstar!!',
    chipTick:'Chip!! Every sip counts!!',
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
  },
};

/* ── state ── */
const KEY = 'kachunk.v1';
let S = null;
function defaults(){
  return {
    version:1, onboarded:false,
    settings:{voice:'zesty', roundupTime:'20:30', sound:true, theme:'light', weekStartsOn:1, notifAsked:false},
    colors:[],   // {id,name,icon,pal,shape,goal}
    buckets:[],  // {id,colorId,name,notes,chips:null|{target,countsAt}}
    week:{start:null, blocks:[], chips:{}}, // blocks: {id,colorId,status,via,ts} chips: {bucketId:{'YYYY-MM-DD':n}}
    nextGoals:{}, history:[], lastRoundup:null,
    day:{date:null, mode:'grid', startMin:480, endMin:1320, slotMin:30, maxSlots:8, items:[], icalUrl:'', ical:[]}, // Day Builder: temporary plan, never reported
  };
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function load(){
  try{ const raw = localStorage.getItem(KEY); if(raw){ S = Object.assign(defaults(), JSON.parse(raw));
    (S.colors||[]).forEach(c=>{ if(PAL_MIGRATE[c.pal]) c.pal = PAL_MIGRATE[c.pal]; c.shape='cube'; if(!c.slotSize) c.slotSize=1; });
    S.day = Object.assign(defaults().day, S.day||{}); return; } }catch(e){}
  S = defaults();
}
const V = () => VOICES[S.settings.voice] || VOICES.zesty;

/* date helpers */
const dayKey = (d=new Date()) => d.toISOString().slice(0,10);
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
  const days = S.week.chips[bucket.id] || {};
  return Object.values(days).filter(n=>n>0 && n<bucket.chips.countsAt).length;
}

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

/* ═════════ ONBOARDING ═════════ */
const OB = {
  step:0,
  draft:null,
  start(){
    this.step = 0;
    this.draft = { name:'', colors: [], palKey:'brand', roundupTime:'20:30', voice:'zesty', maxSlots:8 };
    show('#screen-onboard'); this.render();
  },
  steps(){ return ['name','pick','palette', ...this.draft.colors.map((c,i)=>'bucket:'+i), 'recap','voice']; },
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
      this.paint('var(--mark)', '#FDFBF7');
      b.innerHTML = `
        <h2 class="ob-title">Pick your buckets${d.name?', '+esc(d.name.trim().split(' ')[0]):''}</h2>
        <p class="ob-sub">A bucket is a commitment — a thing you want to do some number of times a week. Each one gets its own blocks.</p>
        <div class="chip-grid">${STARTERS.map(st=>{
          const on = d.colors.some(c=>c.starter===st.name);
          return `<button class="chip white ${on?'on':''}" data-starter="${st.name}">${ic(st.icon)}${st.name}</button>`;
        }).join('')}
          <button class="chip white" data-custom="1">＋ Your own</button>
        </div>
        <div style="color:rgba(253,251,247,.85);font-size:13.5px">${d.colors.length ? d.colors.length+' picked — you can rename, resize, and set goals next.' : 'Pick a few. Six max.'}</div>`;
      $$('#obBody .chip[data-starter]').forEach(ch=>ch.onclick=()=>{
        const st = STARTERS.find(x=>x.name===ch.dataset.starter);
        const has = d.colors.findIndex(c=>c.starter===st.name);
        if(has>=0) d.colors.splice(has,1);
        else if(d.colors.length<6) d.colors.push({id:uid(), name:st.name, icon:st.icon, pal:st.pal, shape:'cube', goal:st.goal, slots:st.slots||1, chips:st.chips||null, starter:st.name});
        else return toast('Six buckets max — keep it holdable.');
        this.render();
      });
      $('#obBody .chip[data-custom]').onclick=()=>{
        if(d.colors.length>=6) return toast('Six buckets max — keep it holdable.');
        d.colors.push({id:uid(), name:'My thing', icon:'star', pal:PALETTE[d.colors.length%6].key, shape:'cube', goal:3, slots:1, chips:null, starter:null});
        this.render();
      };
    }

    if(key==='palette'){
      this.paint('#F8F6F2', '#33414D');
      applyBlockPalette(d.palKey||'brand', d.colors);
      b.innerHTML = `
        <h2 class="ob-title">Choose your block colors</h2>
        <p class="ob-sub">Six colors that go together. Your buckets wear them in order — you can re-pick any time in Settings.</p>
        ${BLOCK_PALETTES.map(bp=>palCardHTML(bp, (d.palKey||'brand')===bp.key)).join('')}
        <div class="set-note" style="padding:6px 4px">Mono makes every block the same — the icons carry the meaning.</div>`;
      $$('#obBody .pal-card').forEach(el=>el.onclick=()=>{
        d.palKey = el.dataset.bp;
        applyBlockPalette(d.palKey, d.colors);
        this.render();
      });
    }

    if(key && key.startsWith('bucket:')){
      const i = +key.split(':')[1];
      const c = d.colors[i]; if(!c){ this.step = steps.indexOf('recap'); this.render(); return; }
      const p = palFor(c);
      this.paint(p.fill, inkFor(p.fill));
      b.innerHTML = `
        <div class="ob-count" style="color:${inkFor(p.fill)};opacity:.65">bucket ${i+1} of ${d.colors.length}</div>
        <h2 class="ob-title">Set up ${esc(c.name)}</h2>
        <div class="bucket-card" data-c="${c.id}" style="border-color:${p.edge}">
          <div class="bc-head"><button class="swatch" data-f="look" style="background:${p.fill};border-color:${p.edge};--swk:${inkFor(p.fill)}" title="Change look">${ic(c.icon)}</button>
            <input type="text" data-f="bname" value="${esc(c.name)}" aria-label="Bucket name" style="font-weight:700;font-size:17px">
          </div>
          <div class="bc-label">Blocks per week — the goal</div>
          <div class="stepper"><button data-f="g-">−</button><span class="val">${c.goal}</span><button data-f="g+">＋</button></div>
          <div class="bc-label">Block size — day slots one takes</div>
          <div class="stepper"><button data-f="s-">−</button><span class="val">${c.slots||1} slot${(c.slots||1)>1?'s':''}</span><button data-f="s+">＋</button></div>
          <div class="bc-label">Notes</div>
          <textarea data-f="notes" placeholder="e.g. 3× = 2 swim + 1 yoga">${esc(c.notes||'')}</textarea>
          <div class="chips-toggle">
            <label class="switch"><input type="checkbox" data-f="chips" ${c.chips?'checked':''}><span class="knob"></span></label>
            <span>Count in <strong>chips</strong> (several small reps = one block)</span>
          </div>
          <div class="chip-config" ${c.chips?'':'hidden'}>
            <div><label>Chips per day</label><div class="stepper"><button data-f="t-">−</button><span class="val">${c.chips?.target??8}</span><button data-f="t+">＋</button></div></div>
            <div><label>Block earned at</label><div class="stepper"><button data-f="a-">−</button><span class="val">${c.chips?.countsAt??5}</span><button data-f="a+">＋</button></div></div>
          </div>
        </div>`;
      const card = $('#obBody .bucket-card');
      card.querySelector('[data-f=look]').onclick = ()=>openColorPicker(c, ()=>this.render());
      card.querySelector('[data-f=bname]').oninput = e=>{ c.name = e.target.value; c.bucketName = e.target.value; };
      card.querySelector('[data-f=notes]').oninput = e=>c.notes = e.target.value;
      card.querySelector('[data-f=chips]').onchange = e=>{ c.chips = e.target.checked?{target:8,countsAt:5}:null; this.render(); };
      const upd = ()=>this.render();
      card.querySelector('[data-f="g-"]').onclick = ()=>{ c.goal = clamp(c.goal-1,1,14); upd(); };
      card.querySelector('[data-f="g+"]').onclick = ()=>{ c.goal = clamp(c.goal+1,1,14); upd(); };
      card.querySelector('[data-f="s-"]').onclick = ()=>{ c.slots = Math.max(1,(c.slots||1)-1); upd(); };
      card.querySelector('[data-f="s+"]').onclick = ()=>{ c.slots = Math.min(8,(c.slots||1)+1); upd(); };
      card.querySelector('[data-f="t-"]')?.addEventListener('click',()=>{c.chips.target=clamp(c.chips.target-1,2,20); c.chips.countsAt=Math.min(c.chips.countsAt,c.chips.target); upd();});
      card.querySelector('[data-f="t+"]')?.addEventListener('click',()=>{c.chips.target=clamp(c.chips.target+1,2,20); upd();});
      card.querySelector('[data-f="a-"]')?.addEventListener('click',()=>{c.chips.countsAt=clamp(c.chips.countsAt-1,1,c.chips.target); upd();});
      card.querySelector('[data-f="a+"]')?.addEventListener('click',()=>{c.chips.countsAt=clamp(c.chips.countsAt+1,1,c.chips.target); upd();});
    }

    if(key==='recap'){
      this.paint('#33414D', '#F3EFE8');
      const goalSlots = this.weeklyGoalSlots();
      const capacity = d.maxSlots*7;
      const fits = goalSlots <= capacity;
      b.innerHTML = `
        <h2 class="ob-title">Does the week fit?</h2>
        <p class="ob-sub">Your goals, in day-slots — against what one of your days can hold.</p>
        <div class="paper-list">${d.colors.map(c=>{ const p = palFor(c); return `
          <div class="recap-row" style="background:${p.fill}">
            <span class="swatch" style="background:${p.light};border:none;width:32px;height:32px;border-radius:10px;--swk:${inkFor(p.light)}">${ic(c.icon)}</span>
            <strong style="flex:1;color:#33414D">${esc(c.name)}</strong>
            <span class="mono" style="font-size:12.5px;color:rgba(51,65,77,.65)">${c.goal}×/wk · ${c.slots||1} slot${(c.slots||1)>1?'s':''} = ${c.goal*(c.slots||1)}</span>
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
    $('#obNext').textContent = key==='voice' ? 'Build my floor' : 'Next';
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
    <div style="display:flex;flex-wrap:wrap;gap:10px">${PALETTE.map(p=>`
      <button class="pickdot" data-k="${p.key}" title="${p.name}" aria-label="${p.name}" style="width:46px;height:46px;border-radius:14px;background:${p.fill};border:3px solid ${(!c.customHex&&c.pal===p.key)?'var(--ink)':p.edge};cursor:pointer"></button>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-top:14px">
      <input type="color" id="pickCustom" value="${c.customHex||cur.fill}" aria-label="Custom color" style="width:46px;height:46px;border:2px solid var(--hairline);border-radius:12px;padding:2px;background:var(--surface);cursor:pointer">
      <input type="text" id="pickHex" class="mono" value="${c.customHex||''}" placeholder="#A1B2C3" maxlength="7" aria-label="Hex code" style="flex:1;min-width:0;border:2px solid var(--hairline);border-radius:10px;padding:10px 12px;font:inherit;background:var(--inset);color:var(--ink)">
      <button class="btn btn-primary" id="pickUse" style="padding:11px 18px">Use it</button>
    </div>
    <div class="bc-label" style="margin-top:16px">Icon — ${lib.length} to choose from</div>
    <input type="search" id="iconSearch" placeholder="search icons…" style="width:100%;border:2px solid var(--hairline);border-radius:10px;padding:9px 12px;font:inherit;background:var(--inset);color:var(--ink);margin-bottom:10px">
    <div id="iconGrid" style="display:flex;flex-wrap:wrap;gap:8px;max-height:240px;overflow-y:auto">${iconGrid('')}</div>`);
  const bindIcons = ()=>{
    $$('#iconGrid .iconpick').forEach(el=>el.onclick = ()=>{ c.icon = el.dataset.i; onDone(); Sheet.close(); });
  };
  bindIcons();
  $('#iconSearch').oninput = e=>{ $('#iconGrid').innerHTML = iconGrid(e.target.value.trim().toLowerCase().replace(/[ -]/g,'_')); bindIcons(); };
  $$('.pickdot').forEach(el=>el.onclick=()=>{ c.pal = el.dataset.k; delete c.customHex; Sheet.close(); onDone(); });
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
function inkFor(fill){ // text color on a block face
  const n = parseInt(fill.slice(1),16), r=n>>16, g=(n>>8)&255, b=n&255;
  return (0.299*r+0.587*g+0.114*b) > 150 ? '#33414D' : '#FDFBF7';
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
    const ink = inkFor(p.fill);
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
        const block = S.week.blocks.find(b=>b.id===id);
        const c = block && S.colors.find(k=>k.id===block.colorId);
        if(!c) continue;
        m = this.meshFor(c, Floor.sizeFor(c.id));
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
      const body = e.body; if(!body || !body.blockId) return;
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
      let hit = this.bucketAt(this.mouse.position.x, this.mouse.position.y);
      if(hit<0) hit = this.bucketAt(body.position.x, body.position.y);
      if(hit>=0){
        const bucket = S.buckets[hit];
        const block = S.week.blocks.find(b=>b.id===body.blockId);
        if(block && bucket.colorId===block.colorId){ this.capture(block, body, bucket, 'drag'); return; }
        const owner = S.buckets.find(bk=>bk.colorId===block.colorId);
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
            if(DayB.used()+cost > S.day.maxSlots){
              toast(`Today's full — ${S.day.maxSlots} slots. Protect the plan.`, {ms:2600});
              Matter.Body.setPosition(body, {x:clamp(body.position.x,30,this.W-30), y:this.planY()-120});
              Matter.Body.setVelocity(body,{x:0,y:0});
            } else { DayB.setPlanned(block, true); sfx('slide'); buzz(8); }
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

    const loop = ()=>{
      if(!this.paused){
        Matter.Engine.update(this.engine, 1000/60);
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
    if(S.day.date!==dayKey()){ S.day.date = dayKey(); save(); }
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
    // the divider — a thin physical line: the pile rests on it, today's blocks treat it as the ceiling
    const shelf = Matter.Bodies.rectangle(this.W/2, this.planY()+5, this.W*2, 10, {isStatic:true});
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
          <g transform="translate(38 48) scale(1.05)" fill="none" stroke="${inkFor(p.fill)}" stroke-opacity="0.6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon]||ICONS.star}</g>
        </svg>
        <div style="font-size:12px;font-weight:700;color:var(--ink);line-height:1.15;padding:0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(bk.name)}</div>
        <div class="mono" style="font-size:11px;color:var(--muted)">${done}/${c.goal}</div>
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
    DayB.dropFromPlan(block.id);
    save();
    sfx('drop'); buzz(18);
    const i = S.buckets.indexOf(bucket);
    const r = this.bucketRects[i];
    const pal = palFor(S.colors.find(c=>c.id===block.colorId)||{});
    if(r) this.burst(r.x+r.w/2, r.y+18, pal, true);
    this.syncBuckets(); this.updateHeader();
    if(!S.week.blocks.some(b=>b.status!=='dropped')){
      // every block home: confetti across every bucket
      setTimeout(()=>{ this.bucketRects.forEach((br,k)=>{
        const c = S.colors.find(x=>x.id===S.buckets[k].colorId);
        this.burst(br.x+br.w/2, br.y+14, palFor(c||{}), true);
      }); sfx('fanfare'); }, 420);
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
        pal:palFor(c), shape:c.shape, icon:c.icon, label:c.name, size:this.sizeFor(colorId)*0.9,
        done:()=>{
          block.status='dropped'; block.via=via; block.ts=new Date().toISOString();
          DayB.dropFromPlan(block.id);
          save();
          sfx('drop'); buzz(10); this.syncBuckets(); this.updateHeader();
          this.burst(r.x+r.w/2, r.y+18, palFor(c), true);
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

  /* ── week sweep, on the board ── */
  enterSweep(){
    S.lastRoundup = new Date().toISOString(); save();
    this.sweepMode = true;
    $('#btnRoundup').hidden = true;
    const pop = $('#sweepPop'); pop.hidden = false;
    this.updateSweepPop();
  },
  exitSweep(){ this.sweepMode = false; $('#sweepPop').hidden = true; this.updateHeader(); },
  updateSweepPop(){
    const left = S.week.blocks.filter(b=>b.status!=='dropped').length;
    const msg = $('#spMsg');
    if(msg) msg.textContent = left
      ? `Tap every block that actually happened — it drops home. ${left} out, and faded is fine.`
      : `All claimed. Restack when you're ready.`;
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
      pal:palFor(c), shape:c.shape, icon:c.icon, size:this.sizeFor(c.id)*0.9,
      done:()=>{
        block.status='dropped'; block.via='sweep'; block.ts=new Date().toISOString();
        DayB.dropFromPlan(block.id); save();
        sfx('drop'); buzz(12);
        this.burst(r.x+r.w/2, r.y+22, palFor(c));
        this.syncBuckets(); this.updateHeader(); this.updateSweepPop();
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
    spawnWeek(); this.exitSweep(); this.rebuild();
    sfx('fanfare'); toast(V().restacked, {ms:3000});
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
    x.fillText(`TODAY ${DayB.used()}/${S.day.maxSlots}`, this.W-16, this.planY()+18);
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
        drawBlockShape(f, fl.from.x, fl.from.y, fl.size, fl.shape, fl.pal, 0, iconImage(fl.icon, inkFor(fl.pal.fill)));
        return true;
      }
      const t = clamp((now-fl.t0)/fl.dur, 0, 1);
      const e = 1-Math.pow(1-t,3);
      const px = fl.from.x+(fl.to.x-fl.from.x)*e;
      const py = fl.from.y+(fl.to.y-fl.from.y)*e - Math.sin(Math.PI*t)*70;
      drawBlockShape(f, px, py, fl.size*(1-0.45*t), fl.shape, fl.pal, t*1.2, iconImage(fl.icon, inkFor(fl.pal.fill)));
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
      ? `<div class="day-bar-wrap"><span class="day-bar-label">Week</span><div class="day-bar">${segs}</div><span class="day-bar-label">${doneN}/${S.week.blocks.length}</span></div>`
      : esc(V().empty);
    // sweep fab: end of week only, dismissable
    const fab = $('#btnRoundup');
    if(fab){
      const days = S.week.start ? (Date.now()-new Date(S.week.start))/864e5 : 0;
      const due = this.mode==='week' && S.colors.length>0 && days>=6 && S.settings.sweepDismissed!==dayKey();
      fab.hidden = !due;
    }
    Notif.updateDot();
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
      <h3><span style="display:inline-flex;width:30px;height:30px;border-radius:9px;background:${p.fill};border:2px solid ${p.edge};align-items:center;justify-content:center;vertical-align:-7px;margin-right:8px">${ic(c.icon)}</span>${esc(bk.name)}</h3>
      <p class="sh-sub mono">${done}/${c.goal} this week${left?` · ${left} on the floor`:''}</p>
      ${bk.notes?`<p style="font-size:14px;color:var(--text);background:var(--inset);border-radius:12px;padding:10px 12px">${esc(bk.notes)}</p>`:''}`;
    if(bk.chips){
      const today = S.week.chips[bk.id]?.[dayKey()] || 0;
      html += `
        <div class="bc-label">Today's chips — ${today}/${bk.chips.target} (block at ${bk.chips.countsAt})</div>
        <div class="chip-tally">${Array.from({length:bk.chips.target},(_,k)=>`<div class="chip-cell ${k<today?'on':''}"></div>`).join('')}</div>
        <div class="sheet-actions">
          <button class="btn btn-ghost" id="chipMinus">− chip</button>
          <button class="btn btn-primary" id="chipPlus">＋ chip</button>
        </div>
        <hr style="border:none;border-top:2px solid var(--hairline);margin:18px 0">`;
    }
    html += `
      <div class="bc-label">${bk.chips?'Or log whole blocks':'Log it by number'}</div>
      <div class="bigcount">
        <button id="cntMinus">−</button><span class="val" id="cntVal">1</span><button id="cntPlus">＋</button>
      </div>
      <div class="sheet-actions">
        <button class="btn btn-ghost" id="shClose">Close</button>
        <button class="btn btn-primary" id="shDrop" ${left?'':'disabled style="opacity:.5"'}>Kachunk ${left?'it':'—'} in</button>
      </div>`;
    Sheet.open(html);
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
        $('.bc-label', $('#sheet')).textContent = `Today's chips — ${today}/${bk.chips.target} (block at ${bk.chips.countsAt})`;
      };
      $('#chipPlus').onclick = ()=>{
        S.week.chips[bk.id] = S.week.chips[bk.id]||{};
        const today = (S.week.chips[bk.id][dayKey()]||0);
        if(today>=bk.chips.target) return;
        S.week.chips[bk.id][dayKey()] = today+1; save(); sfx('tick'); paint();
        if(today+1===bk.chips.countsAt){
          const flew = Floor.flyIn(c.id, 1, 'chips');
          toast(flew?V().chipDone:V().chipTick);
        } else if(Math.random()<0.3) toast(V().chipTick,{ms:1200});
      };
      $('#chipMinus').onclick = ()=>{
        S.week.chips[bk.id] = S.week.chips[bk.id]||{};
        const today = (S.week.chips[bk.id][dayKey()]||0);
        if(!today) return;
        S.week.chips[bk.id][dayKey()] = today-1; save(); sfx('tick'); paint();
      };
    }
  }
};

/* ═════════ ROUNDUP ═════════ */
const Roundup = { start(){ Floor.enterSweep(); } };

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
    $('#receiptsBody').innerHTML = `
      <div class="set-group"><h3>Last ${basis.length===1?'week':basis.length+' weeks'}</h3>
        <div class="avg-row">
          <div class="avg-cell"><div class="n">${avg}</div>${miniBlocks(avg)}<div class="t">avg / week</div></div>
          <div class="avg-cell"><div class="n">${best}</div>${miniBlocks(best)}<div class="t">best week</div></div>
          <div class="avg-cell"><div class="n">${weeks.length}</div>${miniBlocks(weeks.length,7)}<div class="t">weeks tracked</div></div>
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
  open(){ show('#screen-settings'); this.render(); },
  colorRow(c){
    const p = palFor(c);
    return `<div class="color-row" data-c="${c.id}">
      <button class="swatch" style="background:${p.fill};border-color:${p.edge};--swk:${inkFor(p.fill)}" title="Change look" data-act="pal">${ic(c.icon)}</button>
      <input type="text" value="${esc(c.name)}" aria-label="Bucket name">
      <div class="stepper"><button data-act="-">−</button><span class="val">${c.goal}</span><button data-act="+">＋</button></div>
      <button class="row-x" data-act="x" aria-label="Remove">✕</button>
    </div>`;
  },
  render(){
    $('#settingsBody').innerHTML = `
      <div class="set-group"><h3>Voice</h3>
        ${Object.entries(VOICES).map(([k,v])=>`
          <button class="voice-card ${S.settings.voice===k?'on':''}" data-v="${k}">
            <span class="vc-name">${v.label} <span class="heat">${v.heat}</span></span>
            <span class="vc-line">“${v.sample}”</span>
          </button>`).join('')}
      </div>
      <div class="set-group"><h3>The Roundup</h3>
        <div class="set-card">
          <div class="set-row"><span class="grow">Daily nudge at</span>
            <input type="time" id="setTime" value="${S.settings.roundupTime}"></div>
          <div class="set-row"><span class="grow">Sounds</span>
            <label class="switch"><input type="checkbox" id="setSound" ${S.settings.sound?'checked':''}><span class="knob"></span></label></div>
          <div class="set-row"><span class="grow">Today's slot budget</span>
            <div class="stepper"><button id="setSlotsM">−</button><span class="val" id="setSlotsV">${S.day.maxSlots}</span><button id="setSlotsP">＋</button></div></div>
          <div class="set-note">Kachunk sends exactly one notification a day — the Roundup — and only when the app can. On iPhone, Add to Home Screen first.</div>
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
        <div class="set-note">Switching re-bases every bucket to the new palette, in order. Custom hexes get replaced.</div>
      </div>
      <div class="set-group"><h3>Buckets & goals</h3>
        <div id="setColors">${S.colors.map(c=>this.colorRow(c)).join('')}</div>
        <button class="btn btn-ghost" id="addColor" style="width:100%">＋ Add a bucket</button>
        <div class="set-note" style="padding:8px 2px">Goal changes apply when you restack. Removing a bucket removes its blocks.</div>
      </div>
      <div class="set-group"><h3>Buckets</h3>
        ${S.buckets.map(bk=>{
          const c = S.colors.find(x=>x.id===bk.colorId); if(!c) return '';
          const p = palFor(c);
          return `<div class="bucket-card" data-b="${bk.id}">
            <div class="bc-head"><span class="swatch" data-f="pal" role="button" title="Change color & icon" style="background:${p.fill};border-color:${p.edge};cursor:pointer;--swk:${inkFor(p.fill)}">${ic(c.icon)}</span>
              <input type="text" data-f="bname" value="${esc(bk.name)}"></div>
            <textarea data-f="notes" placeholder="Notes…">${esc(bk.notes)}</textarea>
            <div class="bc-label" style="margin-top:10px">Brick size — day slots</div>
            <div class="stepper"><button data-f="ss-">−</button><span class="val">${c.slotSize||1}</span><button data-f="ss+">＋</button></div>
            <div class="chips-toggle">
              <label class="switch"><input type="checkbox" data-f="chips" ${bk.chips?'checked':''}><span class="knob"></span></label>
              <span>Chips mode ${bk.chips?`· block at ${bk.chips.countsAt}/${bk.chips.target} per day`:''}</span>
            </div>
          </div>`;
        }).join('')}
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
    $$('#settingsBody .voice-card').forEach(el=>el.onclick=()=>{ S.settings.voice=el.dataset.v; save(); this.render(); toast(VOICES[el.dataset.v].sample,{ms:2600}); });
    $('#setTime').onchange = e=>{ S.settings.roundupTime = e.target.value||'20:30'; save(); Notif.updateDot(); };
    $('#setSound').onchange = e=>{ S.settings.sound = e.target.checked; save(); if(e.target.checked) sfx('tick'); };
    $('#setTheme').onchange = e=>{ S.settings.theme = e.target.checked?'dark':'light'; save(); applyTheme(); };
    $$('#settingsBody .pal-card').forEach(el=>el.onclick=()=>{
      S.settings.blockPal = el.dataset.bp;
      applyBlockPalette(el.dataset.bp, S.colors);
      save(); this.render(); Floor.syncBuckets(); Floor.rebuild();
    });
    $('#setSlotsM').onclick = ()=>{ S.day.maxSlots = Math.max(1,S.day.maxSlots-1); save(); $('#setSlotsV').textContent = S.day.maxSlots; };
    $('#setSlotsP').onclick = ()=>{ S.day.maxSlots = Math.min(24,S.day.maxSlots+1); save(); $('#setSlotsV').textContent = S.day.maxSlots; };
    $$('#setColors .color-row').forEach(row=>{
      const c = S.colors.find(x=>x.id===row.dataset.c);
      row.querySelector('input').onchange = e=>{ c.name = e.target.value.trim()||c.name; const bk=S.buckets.find(b=>b.colorId===c.id); save(); this.render(); };
      row.querySelector('[data-act="-"]').onclick = ()=>{ S.nextGoals[c.id] = clamp((S.nextGoals[c.id]??c.goal)-1,1,14); save(); this.renderGoalHint(row, c); };
      row.querySelector('[data-act="+"]').onclick = ()=>{ S.nextGoals[c.id] = clamp((S.nextGoals[c.id]??c.goal)+1,1,14); save(); this.renderGoalHint(row, c); };
      row.querySelector('[data-act="pal"]').onclick = ()=>openColorPicker(c, ()=>{ save(); this.render(); Floor.syncBuckets(); });
      row.querySelector('[data-act="x"]').onclick = ()=>{
        if(!confirm(`Remove the ${c.name} bucket and its blocks?`)) return;
        S.colors = S.colors.filter(x=>x.id!==c.id);
        S.buckets = S.buckets.filter(b=>b.colorId!==c.id);
        S.week.blocks = S.week.blocks.filter(b=>b.colorId!==c.id);
        save(); this.render(); Floor.rebuild();
      };
    });
    $('#addColor').onclick = ()=>{
      if(S.colors.length>=6) return toast('Six buckets max — keep it holdable.');
      const bpKey = S.settings.blockPal||'brand';
      const c = {id:uid(), name:'New thing', icon:'star', pal:PALETTE[S.colors.length%6].key,
        customHex: bpKey==='pastel' ? null : blockPalByKey(bpKey).hex[S.colors.length%6], shape:'cube', goal:3, slotSize:1};
      S.colors.push(c);
      S.buckets.push({id:uid(), colorId:c.id, name:c.name, notes:'', chips:null});
      for(let i=0;i<c.goal;i++) S.week.blocks.push({id:uid(), colorId:c.id, status:'tray', via:null, ts:null});
      save(); this.render(); Floor.rebuild();
    };
    $$('#settingsBody .bucket-card').forEach(card=>{
      const bk = S.buckets.find(b=>b.id===card.dataset.b); if(!bk) return;
      card.querySelector('[data-f=bname]').onchange = e=>{ bk.name = e.target.value.trim()||bk.name; save(); Floor.syncBuckets(); };
      card.querySelector('[data-f=notes]').onchange = e=>{ bk.notes = e.target.value; save(); };
      card.querySelector('[data-f=chips]').onchange = e=>{ bk.chips = e.target.checked?{target:8,countsAt:5}:null; save(); this.render(); };
      const cc = S.colors.find(x=>x.id===bk.colorId);
      card.querySelector('[data-f="pal"]')?.addEventListener('click',()=>openColorPicker(cc, ()=>{ save(); this.render(); Floor.syncBuckets(); Floor.rebuild(); }));
      card.querySelector('[data-f="ss-"]')?.addEventListener('click',()=>{ cc.slotSize = Math.max(1,(cc.slotSize||1)-1); save(); this.render(); });
      card.querySelector('[data-f="ss+"]')?.addEventListener('click',()=>{ cc.slotSize = Math.min(8,(cc.slotSize||1)+1); save(); this.render(); });
    });
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
    row.querySelector('.val').textContent = next!==undefined && next!==c.goal ? `${c.goal}→${next}` : c.goal;
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
  used(){ return this.items().reduce((a,i)=>a+this.unitsOf(i.colorId),0); },
  isPlanned(blockId){ return this.items().some(i=>i.blockId===blockId); },
  setPlanned(block, on){
    let items = this.items().filter(i=>i.blockId!==block.id);
    if(on) items.push({id:uid(), blockId:block.id, colorId:block.colorId});
    S.day.items = items; S.day.date = dayKey(); save();
  },
  dropFromPlan(blockId){ S.day.items = this.items().filter(i=>i.blockId!==blockId); save(); },
  staleCheck(){
    if(S.day.date && S.day.date!==dayKey() && this.items().length){ this.resetFlow(); return true; }
    return false;
  },
  resetFlow(){
    const pending = this.items().filter(i=>S.week.blocks.some(b=>b.id===i.blockId && b.status!=='dropped'));
    if(!pending.length){ S.day.items = []; S.day.date = dayKey(); save(); return; }
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
    Sheet.open(`
      <h3>Yesterday's plan is still out.</h3>
      <p class="sh-sub">Log it (into the bucket), keep it for today, or toss it back on the floor. Nothing resets into the void.</p>
      ${rows}`, {onClose:()=>{ S.day.date = dayKey(); save(); Floor.applyMode(); }});
    $$('#sheet [data-act]').forEach(btn=>btn.onclick = ()=>{
      const row = btn.closest('[data-id]'); const it = this.items().find(k=>k.id===row.dataset.id);
      if(it){
        if(btn.dataset.act==='log'){
          const block = S.week.blocks.find(b=>b.id===it.blockId);
          if(block && block.status!=='dropped'){ block.status='dropped'; block.via='day'; block.ts=new Date().toISOString(); sfx('drop'); }
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
  init(){ this.updateDot(); setInterval(()=>this.check(), 30000); this.check(); },
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
    this.updateDot();
    if(!this.due()) return;
    const key = 'kachunk.notified.'+dayKey();
    if(sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key,'1');
    if('Notification' in window && Notification.permission==='granted'){
      try{
        navigator.serviceWorker?.ready.then(reg=>{
          reg.showNotification(V().notifTitle, {body:V().notifBody, icon:'icon-192.png', badge:'icon-192.png', tag:'roundup'});
        }).catch(()=>{ new Notification(V().notifTitle,{body:V().notifBody,icon:'icon-192.png'}); });
      }catch(e){}
    }
  },
  updateDot(){ const d = $('#roundupDot'); if(d) d.hidden = !this.due(); }
};

/* ═════════ BOOT ═════════ */
function applyTheme(){
  document.documentElement.dataset.theme = S.settings.theme==='dark' ? 'dark' : 'light';
  const m = document.querySelector('meta[name=theme-color]');
  if(m) m.content = S.settings.theme==='dark' ? '#1E262D' : '#F8F6F2';
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
  $('#spClose').onclick = ()=>Floor.exitSweep();
  $('#btnSettings').onclick = ()=>Settings.open();
  $('#receiptsBack').onclick = ()=>{ show('#screen-floor'); };
  $('#settingsBack').onclick = ()=>{ show('#screen-floor'); Floor.rebuild(); };
  $('#btnRoundup').onclick = ()=>Roundup.start();
  // replace header text icons with line icons
  $('#btnReceipts').innerHTML = ic('grid');
  $('#btnSettings').innerHTML = ic('gear');
  $('#receiptsBack').innerHTML = ic('back');
  $('#settingsBack').innerHTML = ic('back');
  $('#obBack').innerHTML = ic('back');

  if(S.onboarded){ show('#screen-floor'); Floor.rebuild(); }
  Notif.init();
  if('serviceWorker' in navigator){ try{ navigator.serviceWorker.register('sw.js'); }catch(e){} }
}
document.addEventListener('DOMContentLoaded', boot);
