# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static website** (WallFixTV.pt — a Portuguese TV wall-mounting service marketing site). It is plain HTML/CSS/vanilla JS with no backend, no database, and no build step required to view it. `package.json` declares **zero dependencies**; the npm scripts are optional Node tooling only.

### Running the site (dev)
- Serve the repo root over HTTP and open it in a browser. Example: `python3 -m http.server 8000` then visit `http://localhost:8000/`. Localized pages live at `/en/`, `/es/`, `/fr/`.
- A static server (not `file://`) is recommended so relative paths, the language dropdown, and the scheduling modal behave as in production.
- Core user flow to smoke-test: click **"Agendar montagem da TV"** to open the scheduling modal, fill the form, accept the RGPD checkbox, and submit — this builds a pre-filled `wa.me`/`api.whatsapp.com` link to `351932504112`. The WhatsApp link itself requires internet; the link generation works offline.

### Tooling scripts (optional, Node)
- `npm run generate:i18n` regenerates `index.html` and `en|es|fr/index.html` from `scripts/i18n-data.js`. NOTE: the committed HTML has been **hand-edited after generation** (e.g. the `#artigos` nav link), so running this overwrites those manual edits. Do not commit regenerated HTML unless you intend to also re-apply the manual tweaks. Revert with `git checkout -- index.html en/index.html es/index.html fr/index.html` if you ran it only to inspect output.
- `npm run export:review` writes a code dump to `review-export/` (gitignored).
- `node scripts/validate-i18n.js` validates `i18n-data.js`. Its "Source duplicate keys" check is a **known false positive** (its naive line parser flags legitimately-repeated keys across array-of-object entries like service cards), so it currently exits non-zero by design — treat the object-walk "Duplicate keys", "Empty strings", and "Missing sections" results as the meaningful signals.

### Lint / test / build
- There is no lint config, no automated test suite, and no production build/bundler. "Build" = serve the static files.
- `scripts/*.ps1` are Windows/PowerShell-only image-optimization utilities and are not needed in this environment.
