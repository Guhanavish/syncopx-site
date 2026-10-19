# Syncopx changelog

## 1.5.3 (2026-10-19)
- Model Context Protocol (MCP) Client: Added external MCP server integration over standard JSON-RPC 2.0 stdio protocol; connects servers defined in `%USERPROFILE%/.agentic_assistant/mcp_servers.json` or local workspaces and dynamically exposes external tools to the agent.
- Concurrent Parallel Subagents: Added multi-agent execution engine (`parallel_tasks`) allowing the assistant to launch up to 4 concurrent subagents across worker threads, executing background research and code audits concurrently with aggregated results.
- Persistent Long-Term Memory: Built-in associative memory engine (`agentic_ai/memory.py`) with relevance scoring and automatic context injection; stores user preferences, project conventions, and environment rules across reboots.
- Codebase Symbol & AST Indexing: Fast local AST parsing for Python and regex extractors for JS/TS/Go/Rust (`agentic_ai/indexer.py`); provides instant symbol navigation (`search_symbols`) and architectural summaries (`codebase_overview`).
- Interactive Accept / Reject Diff Drawers: Upgraded unified diff cards with interactive inline "Accept" and "Reject" staging controls and batch actions on collapsible drawers.
- Inbound Webhooks & Automation Triggers: Added `POST /api/webhook/<trigger_name>` endpoint with HMAC-SHA256 signature verification (`X-Hub-Signature-256`), payload template interpolation, and headless turn execution.
- Dock & Remote UI Polish: Fixed dock resizing constraints in `QSplitter`, removed horizontal scrollbar clipping, and cleaned up tunnel status formatting.

## 1.5.2 (2026-10-16)
- Real-Time Two-Way Voice Conversation: Hands-free continuous voice conversation mode with Voice Activity Detection (VAD), silence detection, and automatic turn-taking for desktop.
- Barge-In Interruption & Ducking: Instant barge-in speech interruption cutting TTS audio playback and thinking loops the moment the user starts speaking; automatic mic threshold ducking during speech synthesis prevents the assistant from interrupting itself.
- Fast Offline Speech Synthesis: Native offline text-to-speech cascade powered directly by Windows SAPI (via COM direct streaming), Piper, Kokoro, and pyttsx3 fallback with streaming sentence chunking (`SentenceChunker`) and instant speech prewarming.
- Web Remote Voice Mode: Browser-based speech recognition (STT) and native synthesis (TTS) integrated directly into the zero-config Web Remote App with hands-free conversation toggle and auto-listen loop.
- Desktop UI Voice Controls: Added speaker mute/unmute and hands-free conversation toggle buttons to the desktop composer row with live waveform feedback and vector SVG status icons.

## 1.5.1 (2026-10-09)
- Browser & Mobile Web Remote: Embedded, zero-dependency Web Remote App served on `GET /`, `/remote`, and `/index.html` with token auto-pairing (`?token=...`), live chat, quick-job chips, execution statistics, stop controls, and one-click Web Link copying in the desktop Remote sidebar.
- Docked Chat Switcher: Added docked sidebar chat list with live running/active indicators and header dropdown backed by a unified list model; `Ctrl+Tab` and `Ctrl+Shift+Tab` rapid chat switching with wrap-around and mid-turn busy protection.
- Per-Chat Project Folder: Scoped command execution, file reading, and document generation to a session-specific folder with header chip selector, History row configuration, and first-run scope announcement.
- Safety Permission Profiles: Introduced Safe, Balanced, Unleashed, and Custom security profiles in Settings with `allowedDirs` filesystem boundary enforcement and headless fail-closed protection.
- Per-Chat Time Tracking: Durable tracking of elapsed turn time per session and aggregate daily total across chats in TaskStore, rendered on switcher rows, headers, and history dialogs with minimize pause handling.
- Execution Display & Clean Data: Live inline command execution cards, unified diff drawers for file edits, and preservation of code blocks and formatted tables.

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
