# PRIMO web demo — Cloudflare Worker proxy

Live demo box in the hero talks to Gemini, but the key NEVER ships to the browser.

## What it enforces
- 2 free replies per visitor (`demoId` + IP soft cap 6/day). Hard limit needs KV bound.
- Firewall pre + post: message >500 chars, heavy keywords (build app / control PC / transcribe / PDF / WhatsApp / multi-step), code fences, or model output >200 words / >12 code lines / >1400 chars → upsell, original output is discarded.
- Identity scrub: any mention of Gemini/Google/GPT/OpenAI/LLM/API/worker/B2 → replaced with `PRIMO`. Errors are generic.
- Storage: every turn + file upload is logged to your Backblaze B2 bucket (`demo-logs/YYYY-MM-DD/`, `demo-uploads/`). Counters live in KV (fast), not B2.

## Deploy (LIVE since 2026-09-08)
- Worker: `https://primo-demo.ssgginfotech.workers.dev` (model `gemini-3.5-flash-lite`; `2.0-flash`/`2.5-flash-lite` are retired for new keys)
- KV `DEMO_KV` bound → hard 2-reply limit verified live (left 1 → 0 → `blocked:limit`)
- Secrets set: `GEMINI_API_KEY`. Still missing: `B2_KEY_ID` / `B2_APP_KEY` + `B2_BUCKET_NAME` (chat logging to B2 skips until then)
- `site.js` `DEMO_API` already points at the live URL.

To re-deploy after edits: `wrangler deploy` from this folder. Never commit secrets.

## Rotate the leaked B2 key
The `web` applicationKey in your screenshot is now public — create a NEW key in Backblaze (same bucket, least privilege), `wrangler secret put` it, then DELETE the old `web` key. Never paste keys in chat/screenshots again.
