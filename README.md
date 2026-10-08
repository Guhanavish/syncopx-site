# Syncopx — Autonomous Agentic Desktop Assistant for Windows

Live site: **https://syncopx.vercel.app/** · Download (1.5.0 ZIP, no admin): **https://github.com/Guhanavish/syncopx-site/releases/download/v1.5.0/Syncopx-1.5.0-windows.zip** · SHA-256: `b70c5bde69227f36cecb8e3df4eab62b6b9a4e3c76e33ce44be23e8a1bcf2e6f`

Static download site for Syncopx, the autonomous agentic desktop AI assistant for Windows 10/11. Multi-step task subagents, real-time voice conversation, screen vision, files, programs, terminal execution, and in-app self-updates — zero signup, bring your own AI key or run 100% offline with Ollama.

## What this is

This repo hosts the public download site for Syncopx. Native static HTML/CSS/JS, no framework, no build step — deployed directly to Vercel. Download buttons, size, hash, and version update themselves from `downloads/version.json` with baked-in fallback values.

## Features (of the app)

- **Autonomous Task Subagents**: Decomposes complex tasks into multi-turn plans using subagents (`general` and read-only `explore`) with persistent disk sessions and step provenance tracking.
- **Real-Time Voice Conversation**: Continuous hands-free loop with instant barge-in interruption. Local Whisper transcription + speech synthesis (~1s latency).
- **Computer Vision & Screen Control**: Reads active window contents using local OCR and coordinates native clicks/keystrokes across Windows apps, Word, Settings, and installers.
- **Code & Local Program Library**: Generates complete multi-file projects, Python scripts, and tools. Built-in Program Library for one-click launches and recurring scheduled automation.
- **Keyboard-First Studio & Slash Commands**: Borderless agent studio window and floating desktop orb. Universal shortcuts (`Ctrl+K`, `Ctrl+Enter`, `Ctrl+L`, `Ctrl+J`, `Esc`) and inline `/commands` (`/model`, `/provider`, `/tokens`, `/cost`, `/clear`, `/new`, `/help`).
- **Safety, Privacy & Live Cost Accounting**: Live token counters and exact USD billing estimates. Permission gates for sensitive operations (`Allow once`, `Always allow`, `Reject`). API keys encrypted locally with Windows DPAPI. Zero telemetry.
- **Built-in Auto-Updates**: In-app one-click update checks directly against `version.json` with SHA-256 verification and atomic restart installation.

## Features (of the site)

- Single landing page: hero workflow panel, 7-card bento grid, 3-step install guide, provider chips, 9-question FAQ, final CTA, footer with Terms/Privacy.
- Illustrative hero workflow panel (instruct → plan & gate → subagents → delivered).
- Flat design system: graphite `#091014`/`#101A1F`, 1px hairlines, single mint accent `#58D6C2`, inline SVG icons; motion gated by `prefers-reduced-motion`.
- SEO kit: canonical + OG/Twitter cards, `sitemap.xml`, `robots.txt`, `llms.txt`, JSON-LD (`WebSite`, `SoftwareApplication`, `FAQPage`), legal pages, security headers in `vercel.json`.

## How it works

1. Visitor clicks Download → serves the versioned ZIP from GitHub Releases.
2. `site.js` fetches `downloads/version.json` (`no-store`) and refreshes buttons/size/hash; on `file://` or offline it keeps baked-in fallback values.
3. Installer (`Install-Syncopx.bat` inside the ZIP) copies the app to `%LOCALAPPDATA%\Syncopx`, adds Start Menu/Desktop shortcuts, sets up verified autostart with boot diagnostics.
4. Installed apps check `downloads/version.json` automatically in Settings to download and apply future updates seamlessly.

## Local preview

```powershell
Set-Location website
python -m http.server 8931
# open http://127.0.0.1:8931/
```

## Publishing (per release)

1. Bump `VERSION` (X.Y.Z) in the app repo.
2. Run `python scripts/build_release.py` — verifies guards (no keys, empty buttons, keyless default, no browser automation), compiles `Syncopx.exe` with PyInstaller, stages release, packages `website/downloads/Syncopx-<ver>-windows.zip` and updates `version.json`.
3. Commit and push `website/` to trigger automatic Vercel deployment.
4. Publish GitHub Release with the generated ZIP attached.

## Configuration

| File | Purpose |
|---|---|
| `downloads/version.json` | Release metadata (version, file URL, bytes, SHA-256, date, notes, requires). Single source of truth. |
| `vercel.json` | Security headers (CSP, frame deny, nosniff, referrer, permissions) + cache rules. |
| `robots.txt` / `sitemap.xml` | Crawl rules + absolute page list. |

## License

MIT — see `LICENSE`.
