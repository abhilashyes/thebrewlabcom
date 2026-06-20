# The Brew Lab — Website

> Sourced well. Served better. · Coffee. Connect. Create.

The marketing website for **The Brew Lab**, a developer/creator-themed coffee
house. Built as an advanced, **mobile-first**, fully static site — no build step,
no backend — so it deploys straight to GitHub Pages while still doing genuinely
modern things in the browser.

## What's inside

| Page | File | Highlights |
|------|------|-----------|
| Home | `index.html` | WebGL hero, interactive **REPL** terminal, pinned scroll cinematics |
| Menu | `menu.html` | Categorised sample menu (editor-style cards) |
| Rewards | `rewards.html` | 5-tier loyalty ladder + animated progression |
| Story / Events / Locations | `story.html` | Scroll cinematics, count-up stats, map placeholder |
| Partner / Franchise | `franchise.html` | Partnership models, FAQ, inquiry form |
| Pitch deck | `pitch.html` | Full-screen slide deck (keys / swipe / dots / print) |

## Tech

- **Static HTML/CSS/JS**, no bundler. Advanced libraries load at runtime via an
  ES-module `importmap` from CDN: **Three.js** (WebGL hero), **GSAP +
  ScrollTrigger** (cinematics).
- Native browser **smooth scrolling** (`scroll-behavior: smooth`) and the
  **View Transitions API** for page transitions (graceful fade fallback).
- All optional modules are dynamically imported and **fail soft** — if a CDN or
  WebGL is unavailable, the page still works (the CSS hero stands in).

### Design system
`assets/css/tokens.css` is the single source of truth — every color, type, space,
radius, and shadow value lives there as a custom property (dark + light themes).
No other stylesheet hardcodes hex.

### Structure
```
index · menu · rewards · story · franchise · pitch   (pages)
assets/css/   tokens · base · effects · deck
assets/js/    main · theme · transitions
              cinematics · hero3d · repl · deck
assets/img/   logo + brace mark + favicon + OG image (SVG)
```

## Mobile-first & accessibility
- Built mobile-up: fluid `clamp()` type, `100dvh`, safe-area insets, ≥44px tap
  targets, slide-in nav, no horizontal overflow.
- Heavy effects are gated: WebGL caps DPR + particle counts and pauses
  offscreen; **`prefers-reduced-motion`** disables motion everywhere.
- WCAG 2.1 AA target: skip link, semantic landmarks, visible focus, full keyboard
  operability, ARIA live regions for the REPL and deck, labelled forms.

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
(A server is needed because pages use ES modules — opening files directly won't
load the JS.)

## Deploy (GitHub Pages)
The site is plain static files at the repo root with a `.nojekyll` marker.
In **Settings → Pages**, set the source to this branch and folder `/ (root)`.
No build action required.

## Before launch — swap the placeholders
Everything marked `[PLACEHOLDER]` / `[sample]` is dummy content:
menu items & prices, locations & hours, events, deck figures, and the demo
forms (wire `rewards.html` and `franchise.html` to your email provider /
Formspree, and update the `partners@thebrewlab.example` address).
