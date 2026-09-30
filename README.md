# Syncopx website — publishing

Static site, no build step. Upload the **contents of `website/`**
(`index.html`, `styles.css`, `site.js`, `assets/`, `downloads/`) to any
static host (GitHub Pages, Netlify, Vercel, plain hosting).

## Per-update flow (remembered by `scripts/build_release.py`)

1. Bump `VERSION` (X.Y.Z).
2. Run `python scripts/build_release.py` — it guards (no keys, empty
   buttons, keyless default provider, no browser automation), rebuilds
   the EXE, stages `release/staging/`, and writes a fresh
   `website/downloads/Syncopx-<ver>-windows.zip` + `version.json`.
3. Upload the new ZIP + `version.json`. **Nothing else changes** — the
   download buttons, size, hash and version on the page update
   themselves from `version.json` (with baked-in fallback values).

## Local preview

```powershell
Set-Location website
python -m http.server 8931
# open http://127.0.0.1:8931/
```

## UI architecture decisions (2026-09 rebuild)

Full rationale and wireframes live in `UI_REBUILD.md`. Summary:

- Native static HTML/CSS/JS. No framework, no build step — the site stays a
  copy-paste deploy.
- Flat design system: graphite surfaces (`#091014`/`#101A1F`), 1px hairline
  borders, single mint accent (`#58D6C2`), no gradients, no glows, no shadows
  except the orb's drop shadow. Tokens are CSS custom properties in
  `styles.css`.
- The hero shows an explicitly labeled illustrative workflow (say → confirm →
  done) instead of a fake chat transcript; there are no fabricated usage
  counts or analytics anywhere.
- All icons are inline 1.5px-stroke SVGs on a 24px grid; no new raster assets
  were added, existing optimized PNGs are reused.
- Motion budget: opacity + 22px translateY reveals and small hover lifts,
  everything disabled under `prefers-reduced-motion`.
- The version/size/SHA-256 display stays driven by `downloads/version.json`
  with the same baked-in fallbacks; release URLs and hash are unchanged.
