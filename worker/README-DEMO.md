# Syncopx web demo — Cloudflare Worker proxy

Live demo box in the hero talks to Gemini, but the key NEVER ships to the browser.

## What it enforces
- 2 free replies per visitor per day (`demoId`, auto-expires in 24h) + IP soft cap 50/day against bulk abuse. Hard limit enforced via bound `DEMO_KV`.
- Firewall pre + post: message >800 chars or desktop-only intent (PC/screen control, files, terminal, WhatsApp, transcription, multi-file projects), or model output >450 words / >30 code lines / >3500 chars → upsell, original output is discarded. Normal questions and code get real answers.
- Identity scrub: any mention of Gemini/Google/GPT/OpenAI/LLM/API/worker/B2 → replaced with `Syncopx - Alpha`. Errors are generic.
- Storage: every turn + file upload is logged to your Backblaze B2 bucket (`demo-logs/YYYY-MM-DD/`, `demo-uploads/`). Counters live in KV (fast), not B2.

## Deploy (LIVE, demo answers for real since 2026-09-10)
- Worker: `https://syncopx-demo.ssgginfotech.workers.dev` (model `gemini-3.5-flash-lite`; `2.0-flash`/`2.5-flash-lite` are retired for new keys)
- Identity is `Syncopx - Alpha` everywhere; provider names are scrubbed to it. The key lives only in `wrangler secret` — never in the browser.
- KV `DEMO_KV` bound → hard 2-reply limit verified live (left 1 → 0 → `blocked:limit`)
- Secrets set: `GEMINI_API_KEY`. Still missing: `B2_KEY_ID` / `B2_APP_KEY` + `B2_BUCKET_NAME` (chat logging to B2 skips until then)
- `site.js` `DEMO_API` already points at the live URL.

To re-deploy after edits: `wrangler deploy` from this folder. Never commit secrets.

## Rotate the leaked B2 key
The `web` applicationKey in your screenshot is now public — create a NEW key in Backblaze (same bucket, least privilege), `wrangler secret put` it, then DELETE the old `web` key. Never paste keys in chat/screenshots again.
