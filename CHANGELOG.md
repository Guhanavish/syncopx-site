# Syncopx changelog

## 1.5.0 (2026-10-07)
- Agent Chat Loop Repair: Resolved runtime TypeError on chat turns by making `cancel_check` a first-class constructor parameter and attribute.
- Unified Cancellation Protocol: Wired `cancel_check` directly into the existing `CANCELLED` protocol across loop iterations, tool call execution, request retry, and stream chunk processing.
- Live Token & Cost Accounting: First-class `on_token_stats` reporting prompt, completion, total tokens, and USD cost directly to the UI stats panel.
- Bridge & Worker Hardening: Removed legacy `hasattr` checks in worker bridge; all 17 unit test suites verified green offline across 69 repo-wide call sites.

## 1.4.9 (2026-10-07)
- Start-on-Boot Architecture & Diagnostics: Robust autostart resolution prioritizing active app_shell entrypoint, dead-target path verification, automatic path refresh after folder moves, boot diagnostics logger (`%TEMP%\syncopx_boot.log`), and unified single-instance mutex (`Local\Syncopx_SingleInstance`).
- Provider Switching & Curated Models: Instant URL & model updates on provider switch, curated models for Ollama (including Phi-4 14B), Groq (Llama 3.3 70B, Llama 3.1 8B, Llama Guard 3), and OpenRouter with all deprecated models removed.
- Honest Connection Diagnostics: Full multi-candidate error reporting in ConnectionTester with classification for auth, network, rate limit, quota, and invalid model errors.
- Slash Command Engine: Inline `/model`, `/provider`, `/clear`, `/new`, `/shortcuts`, `/help`, `/tokens`, `/cost` command parsing with instant execution.
- Vibe Pass Polish: Enhanced dark mode theme tokens, responsive header and composer actions, smoother animations, and subtle badge/state indicators.

## 1.4.8 (2026-10-05)
- Modern Agent UI Rebuild: Borderless fullscreen agent window with Graphite & Mint theme, responsive availableGeometry layout, antialiased JetBrains Mono and IBM Plex Sans typography.
- Resolution-Independent Icons: 100% vector SVG icons with runtime QSvgRenderer rasterization and per-DPR caching, eliminating pixelation across standard and HiDPI displays.
- Official App & Taskbar Identity: Seamless Windows taskbar integration with embedded multi-resolution mipmaps (16px to 256px + 1536px HD circle) and explicit AppUserModelID binding.
- Progressive Streaming & Provenance: Throttled rich message streaming, initial skeleton shimmer, and expandable collapsed step headers (`✓ N steps · 12s ▸`) with running stop affordance.
- Keyboard First Navigation: Universal keyboard shortcuts (`Ctrl+K` focus input, `Ctrl+Enter` send, `Esc` stop/clear, `Ctrl+L` new chat, `Ctrl+J` toggle tasks, `?` shortcuts guide).
- Task Subagents & Persistent Sessions: Sequential tool-driven general and explore subagents with disk-backed resume and accumulation.
- Structured Questioning & Permission Gates: Multi-question dialogs, per-tool permission policies (allow once, always allow, reject with feedback), and plan-mode reuse.
- Trust & Safety: Live token & cost accounting across providers, doom-loop detection with break-glass modal, session undo/redo and conversation forking.
- Syncopx Originals: Local Program Library, scheduled background task execution, and file-defined custom tool registry.
- Smart Model Routing: Heuristic per-task model routing (code -> strong models, explore -> fast/cheap, chat -> default) with conversation branching and model retry.
- Output Secret Scanning: Automatic redaction of sensitive API keys and tokens across display bubbles, clipboard copy, and voice speech.
- One-Click Data Backup & Restore: Portable ZIP packaging of user chats, notes, schedules, programs, and subagents with credentials stripped for security.
- Bulletproof Installer: Added automatic task-kill, robocopy retry guards, and explicit shortcut icon bindings to prevent file locks during installation or upgrades.

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
