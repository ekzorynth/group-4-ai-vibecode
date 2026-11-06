# LAB 5–6: Build and startup verification

This verification reproduces the **existing checkout**, not a new implementation from scratch. It does not establish who originally implemented each file, historical agent concurrency, or completion of every stage in BUILD-PROMPT. The parent delegated this bounded build/verification task. The session used one fresh verifier subagent, not sixteen simultaneous agents.

Started UTC: **2026-11-06T11:45:03Z** (first recorded clock observation after initial reads). Successful verification: **2026-11-06T11:46:29.987Z → 11:46:33.569Z**. Cleanup and evidence finalized UTC: **2026-11-06T11:47:03.896629Z**.

## Inputs and independence

The first read was `BUILD-PROMPT.md`. Then the explicitly named specifications were read in order: `REQUIREMENTS.md`, `USER-STORIES.md`, `TEST-DATA.md`, `DESIGN.md`; followed by `web/API-CONTRACT.md` and build configuration `compose.yaml`, `Dockerfile`, `package.json`. No runtime source, test implementation, or `web/BUGS.md` was inspected to find bugs. The money oracle was established from TEST-DATA before requests: Regular1800−STAGE10(180)+fee30+VAT2 = **1652**.

The scoped task exercised the build and basic normal-mode smoke path. BUILD-PROMPT stages A/B provide documented requirements and ownership guidance; this run does not claim to have replayed the original implementation waves. Its stages C32–42 include migration, independent reviews, controlled boundary tests, parallel workers and bug comparison that require separate evidence outside this report.

## Commands and observed outcomes

All commands ran from the ENCORE project checkout. The verifier is retained as `fresh-verification.mjs`, with raw responses and check results in `FRESH-BUILD.json`.

| Command / action | Result |
| --- | --- |
| `ENCORE_PORT=4385 docker compose -p encore-fresh-lab6 up -d --build --wait` | Successful build and healthy container; Docker used available cached dependency layers. |
| `ENCORE_PORT=4385 docker compose -p encore-fresh-lab6 exec -T web id -u` | `1000`, Node process runs as the node user. |
| `ENCORE_PORT=4385 docker compose -p encore-fresh-lab6 ps --format json` | Healthy project container bound only to `127.0.0.1:4385`; internal target4310 is container-local. |
| `node exploration/lab6/fresh-verification.mjs` | First attempt reached paid order but verifier incorrectly treated holder JSON snapshot as an object. Preserved in `first-attempt.json`; corrected parser only, with no product edits. |
| `ENCORE_PORT=4385 docker compose -p encore-fresh-lab6 down --volumes` followed by the same `up ... --wait` | Recreated only this task's project and fresh volume for a clean repeat. |
| `node exploration/lab6/fresh-verification.mjs` | Successful clean repeat: **22 checks passed**. |
| Playwright Chromium screenshots | Actual desktop1440×1000 and mobile375×812 viewports; full-page PNGs retained. Inspected both rendered images. Document widths1440 and375 matched viewports. |
| `curl -sS http://127.0.0.1:4385/api/health` | Final normal mode response retained in `final-health.json`: `ok:true`, `bugMode:0`. |
| `ENCORE_PORT=4385 docker compose -p encore-fresh-lab6 down --volumes` | Own container, volume and network removed successfully; `cleanup.log` retained. |
| `ENCORE_PORT=4385 docker compose -p encore-fresh-lab6 ps --format json` | No remaining containers in this project; `after-cleanup.json` retained (empty output). |

Image manifest observed: `sha256:e8e6e40488b88f286fe5e5103dc295d6d3e60d2b4682e23987c0478bb0c87c08`.

## Successful checks

- Health200 with `ok:true`, `bugMode:0`; public HTML `data-bug-mode="0"`.
- `/api/test/reset` rejected403 in the default container.
- Catalog contained12 events.
- Member `fan` login, NEON Member active queue, membership number grant and seat-map access succeeded.
- C01 + STAGE10 hold and complete buyer/holder checkout succeeded; QR payment pending then resolved `succeeded`; canonical server amount **1652** matched the independent oracle.
- One ticket had the expected holder JSON snapshot and an opaque64hex code.
- Downloaded ticket PNG was decoded with independent **jsQR**, and its payload exactly matched the ticket code.
- One sandbox outbox message addressed the buyer with status `delivered_sandbox`; mail detail and EML succeeded and EML contained inline PNG content.
- Actual public catalog screenshots displayed marker0 at both viewport sizes and no horizontal document overflow.

## Evidence and limits

[Raw structured results](FRESH-BUILD.json), [verifier](fresh-verification.mjs), [first attempt](first-attempt.json), [desktop screenshot](desktop.png), [mobile screenshot](mobile.png), [QR PNG](ticket-qr.png), [sandbox EML](sandbox-mail.eml), [final health](final-health.json), [cleanup](cleanup.log).

Only host port4385 and Docker project `encore-fresh-lab6` were used for application interactions and lifecycle changes. No shared4310 service or other project was stopped, reset, or inspected. No product code, plan, or commit was changed. This is scoped smoke coverage: it does not establish all requirements, migration persistence, payment boundary behavior, all methods, all browsers, provider payments, SMTP delivery, or high load. Screenshots cover the public catalog, not every checkout step. QR decoding used an independent decoder; external payment and email remain the specified local simulation.
