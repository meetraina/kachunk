# Kachunk.

**The week you can hold.** A habit tracker and habit builder where weekly habits are physical 3D blocks you toss, stack, and drop into buckets — built for ADHD brains, visual thinkers, and anyone whose calendar keeps winning.

**Live app:** deployed via GitHub Pages from this repo · installable PWA · works offline · no account, no server — your blocks live in your browser.

## How it works

- Each **bucket** is a weekly intention (Move ×3, Read ×5…). Each **block** is one time you said you'd do it.
- Do the thing → drag the block into its bucket → *kachunk* (confetti included).
- Plan your day by dragging blocks below the shelf — a slot budget keeps you honest.
- The week **never auto-resets**. At week's end, **Restack** asks *"did you do it?"* — you tap what happened, and a fresh stack is built from your goals.
- **Receipts, not streaks.** Averages built from your actual blocks. There is no red in this app.

## Tech

| Layer | Choice |
|---|---|
| Physics | [Matter.js](https://brm.io/matter-js/) (MIT) — 2D world, drag, toss, stacking |
| Rendering | [Three.js](https://threejs.org/) (MIT) — real 3D bricks (clearcoat, tumble, settle) skinned over the 2D bodies |
| Icons | [Lucide](https://lucide.dev/) (ISC) — 100-icon line set |
| Sound | WebAudio, fully synthesized — no audio files |
| Fonts | Bricolage Grotesque, Inclusive Sans, Figtree ([Fontsource](https://fontsource.org/), OFL) — **bundled in `/fonts/`, never CDN** |
| Storage | `localStorage`, local-first; Google Drive appData sync planned |
| Shell | PWA — manifest + service worker, offline-capable |

No build step. No framework. Open `index.html` over any static server.

```bash
python3 -m http.server 8484   # then open http://localhost:8484
```

## Repo map

```
index.html, styles.css, app.js, icons.js   the entire app
fonts/                                     bundled woff2 (brand law: no CDN fonts)
docs/                                      internal strategy suite — command center,
                                           brand bible, positioning, launch plan,
                                           store metadata, purchase list, asset pack
assets/                                    build tooling: E2E tests (Playwright),
                                           screenshot suite, icon + asset-pack renderers
```

## Testing

```bash
node assets/test-v6.js        # headless E2E: onboarding → board → toss → capture →
                              # day planning → claim → restack → receipts → settings
node assets/shoot-final.js    # regenerate the f1–f11 screen suite
node assets/compose-pack.js   # regenerate the full store/launch asset pack
```

## Credits

Physics by Matter.js (MIT), 3D by Three.js (MIT), icons by Lucide (ISC), type via Fontsource (SIL OFL). Everything else — concept, design system ("Pretty Palettes #003"), sound, copy, strategy docs — original to this project.

---

*Built as a live case study: concept → research → six founder design passes → deployed prototype in one sprint.*
