# Syncopx changelog

## Site (2026-09-14, app still 1.4.7)
- Removed the Cloudflare web demo (Worker + demo box + quota/CSP wiring).
  The hero now shows a static chat preview; the site is download-only.

## 1.4.7
- Desktop chat input is now effectively unlimited (500k chars); length caps
  stay web-demo-only in the Worker firewall.
- Thinking bloom shrunk (150px center → 64px corner-dock) so it never covers
  bubbles in the small 440px panel.
- File read/convert reliability: rich documents parsed locally, all creators
  resolve via the Save folder, verify bytes on disk, and report the exact
  verified path.
- In-app updates: Settings, Updates checks the published version, downloads
  with progress, verifies size + SHA-256, and installs on restart.
  A toast confirms the new version and announces available ones.

## 1.4.5
- UI state coverage: history pagination, todo empty state, custom-URL
  validation, demo offline and network-error states.

## 1.4.4
- Pre-launch audit: Terms/Privacy pages, SEO kit (sitemap, llms.txt,
  JSON-LD, OG cards), security headers, CORS lockdown, copy cleanup.

## 1.4.3
- Settings save no longer demands an API key. Stale startup entries from
  old product names are removed automatically. Demo AI is Syncopx - Alpha.

## 1.4.2
- Rename to Syncopx. Fixed uninstaller deferred-removal quoting.

## 1.4.1 / 1.4.0
- Earlier renames and the first public website + demo Worker.
