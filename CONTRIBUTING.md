# Contributing to the Syncopx download site

This repo is the static download site only (the desktop app lives elsewhere). No build, no dependencies.

## Quick start

```powershell
Set-Location website
python -m http.server 8931
# open http://127.0.0.1:8931/
```

## What to change

- Copy, links, SEO tags, styles in `styles.css`, `site.js` behavior.
- Keep the flat system: graphite `#091014`/`#101A1F`, 1px hairlines, mint `#58D6C2` only, no new raster assets.
- Never touch release truth by hand: `downloads/version.json` + ZIPs come from `scripts/build_release.py` in the app repo.

## Pull requests

- One concern per PR, small diffs, clear message (e.g. `Fix FAQ anchor offset on mobile`).
- Check: `node --check site.js`, open home + Terms + Privacy at 1440px and 390px, confirm no horizontal scroll.
- Do not commit secrets, keys, ZIPs you built locally (except the release flow), or `.vercel/` output.
