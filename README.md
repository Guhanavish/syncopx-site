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
