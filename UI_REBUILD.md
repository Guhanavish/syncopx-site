# Syncopx website — UI rebuild wireframe

## Scope and constraints

- Desktop site handled separately; this rebuild targets the website only.
- Native static HTML/CSS/JS. No React, no Cloudflare, no demo.
- Preserved untouched: `downloads/version.json` wiring, known release URLs and
  SHA-256, SEO kit (canonical, OG, JSON-LD, sitemap, llms.txt, robots),
  legal pages and security headers.
- Brand: graphite `#091014` / `#101A1F`, mint `#58D6C2`, JetBrains Mono + IBM
  Plex Sans. Flat surfaces, 1px hairline borders, no gradients, no glows.
- Removed: fake static conversation box and fabricated counts. The hero shows
  a clearly illustrative workflow instead. No analytics/charts anywhere.
- Tools unavailable, disclosed alternatives used instead of pretending:
  Balsamiq → this low-fi textual wireframe; CSS Scan → hand-written utility
  CSS in `styles.css`; Squoosh → reuse of existing optimized PNGs (no new
  raster assets); ReadMe → this document plus README updates.

## Tooling disclosure

| Unavailable | Local alternative |
|---|---|
| Balsamiq | This textual wireframe (narrow/wide) |
| CSS Scan | Hand-authored flat CSS, tokenized |
| Squoosh | Reuse existing optimized assets only |
| ReadMe | `UI_REBUILD.md` + `README.md` |

Reference sites fetched as inspiration (no libraries imported):
kokonutui.com (component hierarchy, quiet surfaces), animista.net (restrained
transition patterns), uiverse.io (returned HTTP 403, not used).

## Design tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#091014` | page |
| `--panel` | `#101A1F` | flat raised surfaces |
| `--panel-2` | `#17242A` | inset blocks |
| `--border` | `#294047` | 1px hairlines |
| `--accent` | `#58D6C2` | single signal color |
| `--text` / `--muted` / `--dim` | `#F2F7F7` / `#A6B8BA` / `#71878B` | type |
| `--mono` / `--sans` | JetBrains Mono / IBM Plex Sans | headings+code / body |
| radius | 10 / 14 px | small / cards |

Principles: one accent line per section max; icons are 1.5px-stroke inline SVG,
24px grid; motion = small translateY + fade, 0.2–0.5s, one distance; everything
gated by `prefers-reduced-motion`; touch targets ≥44px; contrast ≥4.5:1.

## Page structure (single landing page)

1. Skip link → sticky nav (brand+version · section links · Download CTA)
2. Hero: eyebrow status, H1, lede, primary download CTA + hash, workflow panel
3. Features: numbered flat cards, 2 asymmetric rows on wide, 1 col narrow
4. Install: 3 numbered steps, registry panel + SmartScreen note
5. Providers: BYOK chips, Ollama first
6. FAQ: 7 native `<details>`
7. Final CTA + footer (legal links, security headers note stays in vercel.json)

## Wireframe — narrow (≤760px, single column)

```
|----------------------------------------|
| [orb] Syncopx 1.4.7            [≡]     |
|----------------------------------------|
| Syncopx 1.4.7 · Windows · ZIP, no admin|
|                                        |
| YOUR PC,                               |
| ON YOUR WORDS.                         |
| (mono, ~12ch)                          |
|                                        |
| Floating desktop assistant that talks, |
| listens, sees the screen and does the  |
| work. No signup. You bring the key.    |
|                                        |
| [ ███ DOWNLOAD ZIP · 155 MB ]          |
| [ SHA-256 d3fbbb91… (copy) ]           |
|                                        |
| | ILLUSTRATIVE WORKFLOW (flat panel) | |
| | 1 type/voice  →  2 confirm  →      | |
| | 3 done · paths on your PC          | |
| | (labeled illustrative; no fake     | |
| |  conversation, no fake counts)     | |
|----------------------------------------|
| WHAT IT DOES                           |
| ONE ORB. THE WHOLE MACHINE.            |
| | 01 voice      |  (full width cards,  |
| | 02 screen     |   1px border, number |
| | 03 programs   |   top-left, icon     |
| | 04 files      |   top-right)         |
| | 05 memory     |                      |
|----------------------------------------|
| INSTALL                                |
| THREE STEPS. NO ADMIN.                 |
| | 1 Download ZIP                       |
| | 2 Run installer bat                  |
| | 3 Pick provider                      |
| | registry panel                       |
| | SmartScreen note (mint left rule)    |
|----------------------------------------|
| PROVIDERS                              |
| BRING YOUR OWN KEY. OR NONE.           |
| (Ollama)(Gemini)(Groq)… chip wrap      |
|----------------------------------------|
| FAQ                                    |
| | ▸ question summary (+)               |
| | ▸ …                                  |
|----------------------------------------|
| TAKE THE ORB FOR A SPIN.               |
| [ ███ DOWNLOAD ]                       |
|----------------------------------------|
| footer: legal links · no tracking note |
|----------------------------------------|
```

## Wireframe — wide (≥900px, 12-col grid)

```
|------------------------------------------------------------------|
| [orb] Syncopx [1.4.7]      What  Install  Providers  FAQ  [DL]   |
|------------------------------------------------------------------|
|                            |                    |                |
| ● Syncopx 1.4.7 · Windows  |   ORB (decor,      |                |
| YOUR PC,                   |   absolute, slow   |                |
| ON YOUR WORDS.             |   drift only)      |                |
| (mono clamp ~5rem, 16ch)   |                    |                |
|                            |  | WORKFLOW PANEL  |                |
| lede ~42rem, muted         |  | right-aligned,  |                |
|                            |  | 3 steps + orb   |                |
| [ ███ DOWNLOAD ZIP ·155MB] |  | docked top-left |                |
| No signup · no bundled     |  |                 |                |
| keys · SHA-256 d3fbbb91…   |  |                 |                |
|------------------------------------------------------------------|
| WHAT IT DOES            ONE ORB. THE WHOLE MACHINE.               |
| | 01 voice (span 7)      | | 02 screen (span 5)  |                |
| | 03 programs (span 4)   | | 04 files (span 4)   | | 05 mem (4) | |
|------------------------------------------------------------------|
| INSTALL   THREE STEPS. NO ADMIN. REVERSIBLE.                      |
| | 1 ZIP |  | 2 installer |  | 3 provider |   (3 equal cols)       |
| | registry panel (span 6)  | | SmartScreen note (span 6) |       |
|------------------------------------------------------------------|
| PROVIDERS  chips one row, wrap to two                             |
|------------------------------------------------------------------|
| FAQ  max 46rem, left-aligned column                               |
|------------------------------------------------------------------|
| TAKE THE ORB FOR A SPIN.        [ ███ DOWNLOAD ]   (centered)     |
|------------------------------------------------------------------|
| footer: brand+ver · Terms · Privacy · FAQ · no-tracking note      |
|------------------------------------------------------------------|
```

## Interaction and motion budget

- Reveal: opacity + 22px translateY, 0.7s ease-out, stagger ≤0.4s in hero.
- Hover: border-color swap only on cards/chips; translateY(-3px) on cards.
- Buttons: active press = 1px down; no shadows added anywhere.
- All animation/transition gated by `prefers-reduced-motion: reduce`.
- Mobile nav: plain show/hide, no slide animation.

## Accessibility contract

- Landmarks: header/nav/main/footer, one h1, ordered h2→h3, no skipped levels.
- Skip link first tab stop; visible 2px mint outline on `:focus-visible`.
- Icon-only buttons carry `aria-label`; decorative SVGs `aria-hidden`.
- `role="status"` for hash-copied confirmation; mock panels labeled as
  illustrative so they are not read as real UI state.
- Contrast: mint on graphite ≥ 4.5:1 for text use; dim text only ≥18px or
  non-essential; never color-only state.

## Implementation map

| File | Change |
|---|---|
| `index.html` | New hero workflow panel replacing static chat mock; SVG icon set; labeled-illustrative copy; preserved SEO/legal/download wiring |
| `styles.css` | Rebuilt flat token system, hairline borders, no glow/gradient, reduced-motion block |
| `site.js` | Same version.json logic; workflow panel is static, no JS needed; nav + reveal + hash copy kept |
| `404.html` / `privacy.html` / `terms.html` | Align to new tokens/classes |
| `README.md` | Architecture decisions note |

Out of scope: release ZIPs, version.json values, changelog history, git
commit/push, deployment.
