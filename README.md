# Syncopx — Floating Desktop AI Assistant for Windows

Live site: **https://syncopx.vercel.app/** · Download (1.4.7 ZIP, no admin): **https://github.com/Guhanavish/syncopx-site/releases/download/v1.4.7/Syncopx-1.4.7-windows.zip** · SHA-256: `d3fbbb91b3838d12786f52a6de8ea9eb8ba2d972ee2271129e195b1087d59a3b`

Static download site for Syncopx, the floating desktop AI assistant for Windows 10/11. Voice conversation, screen control, files and programs — no signup, bring your own AI key or run local Ollama.

<!-- TODO: add screenshots here -->
<!-- Capture: 1) hero at 1440px showing headline + illustrative workflow panel, 2) same hero at 390px single column, 3) install + providers sections. Save under assets/ and reference here. -->

## What this is

This repo hosts the public download site only (the desktop app lives elsewhere). Native static HTML/CSS/JS, no framework, no build step — upload the contents of `website/` to any static host. Download buttons, size, hash and version update themselves from `downloads/version.json` with baked-in fallbacks.

## Features (of the site)

- Single landing page: hero workflow, features, 3-step install, provider chips, 7-question FAQ, final CTA, footer with Terms/Privacy.
- Illustrative hero workflow panel (say → confirm → done), labeled as illustrative — no fake chat transcript, no fabricated counts, no analytics.
- Flat design system: graphite `#091014`/`#101A1F`, 1px hairlines, single mint accent `#58D6C2`; inline SVG icons; motion gated by `prefers-reduced-motion`.
- SEO kit: canonical + OG/Twitter cards, `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD (`WebSite`, `SoftwareApplication`, `FAQPage`), legal pages, security headers in `vercel.json`.

## How it works

1. Visitor clicks Download → serves the versioned ZIP from GitHub Releases.
2. `site.js` fetches `downloads/version.json` (`no-store`) and refreshes buttons/size/hash; on `file://` or offline it keeps baked-in fallback values.
3. Installer (`Install-Syncopx.bat` inside the ZIP) copies the app to the user profile, adds shortcuts, optional autostart. Update = new ZIP, extract, run installer; chats/keys/buttons are kept.

## Local preview

```powershell
Set-Location website
python -m http.server 8931
# open http://127.0.0.1:8931/
```

## Publishing (per release)

1. Bump `VERSION` (X.Y.Z) in the app repo.
2. Run `python scripts/build_release.py` there — guards (no keys, empty buttons, keyless default, no browser automation), rebuilds the EXE, stages `release/staging/`, writes fresh `website/downloads/Syncopx-<ver>-windows.zip` + `version.json`.
3. Upload the new ZIP + `version.json`. Nothing else changes.

## Configuration

| File | Purpose |
|---|---|
| `downloads/version.json` | Release metadata (version, file URL, bytes, SHA-256, date, requires). Single source of truth. |
| `vercel.json` | Security headers (CSP, frame deny, nosniff, referrer, permissions) + cache rules. |
| `robots.txt` / `sitemap.xml` | Crawl rules + absolute page list. Update both if the domain changes. |

## FAQ (about the site)

**Is there a demo I can try in the browser?**
No — the site is download-only by design. Voice, screen control and files run in the desktop app.

**Where do I report a site bug?**
Open an issue with page, viewport width, and screenshot. See `CONTRIBUTING.md`.

## Contributing

See `CONTRIBUTING.md`. Content and copy fixes welcome; no build to run — preview with `python -m http.server` and keep the flat design tokens.

## License

MIT — see `LICENSE`.

## UI architecture decisions (2026-09 rebuild)

Full rationale and wireframes live in `UI_REBUILD.md`. Summary:

- Native static HTML/CSS/JS. No framework, no build step — the site stays a copy-paste deploy.
- Flat design system: graphite surfaces (`#091014`/`#101A1F`), 1px hairline borders, single mint accent (`#58D6C2`), no gradients, no glows, no shadows except the orb's drop shadow. Tokens are CSS custom properties in `styles.css`.
- The hero shows an explicitly labeled illustrative workflow (say → confirm → done) instead of a fake chat transcript; there are no fabricated usage counts or analytics anywhere.
- All icons are inline 1.5px-stroke SVGs on a 24px grid; no new raster assets were added, existing optimized PNGs are reused.
- Motion budget: opacity + 22px translateY reveals and small hover lifts, everything disabled under `prefers-reduced-motion`.
- The version/size/SHA-256 display stays driven by `downloads/version.json` with the same baked-in fallbacks; release URLs and hash are unchanged.
