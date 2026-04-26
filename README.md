# Shishir Ghimire — NetaNix

Personal portfolio for **Shishir Ghimire** (NetaNix) — cybersecurity student at Softwarica College (affiliated with Coventry University), Top 1% on TryHackMe, founder of [NetaNix CTF](https://netanixctf.xyz).

Live: **https://shishirghimire.info.np**

---

## Tech

- Pure HTML / CSS / vanilla JS — no build step, no framework
- Live Medium feed via `api.rss2json.com` (auto-pulls latest writeups with thumbnails)
- AVIF + WebP hero image with JPG fallback (`<picture>` element)
- PWA — installable, offline-capable shell via Service Worker
- View Transitions API for native page crossfades (Chromium 111+)
- Lenis-style inline smooth scroll
- Command palette (`⌘K` / `Ctrl+K`)
- Konami code easter egg (`↑↑↓↓←→←→ B A`) → CRT scanline mode

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Hero · stats · about · experience · projects · writeups · TryHackMe · certs · CTA |
| `about.html` | Full bio, experience timeline, skills, TryHackMe live stats |
| `projects.html` | Flagship projects + tools marquee |
| `writeups.html` | Live Medium feed |
| `certs.html` | All 13 certifications grouped by issuer |
| `contact.html` | Contact form + direct channels |

## Performance

- `content-visibility: auto` on all sections for offscreen render skipping
- All animations GPU-promoted via `translate3d` / `transform`
- rAF-throttled scroll handlers (single dispatcher)
- Service Worker stale-while-revalidate caching
- Hero image: 1.8 MB JPG → **62 KB AVIF** (96% reduction)

## SEO

- `sitemap.xml` + `robots.txt`
- JSON-LD `Person` + `WebSite` + `CollectionPage` structured data
- Per-page canonical URLs, OG + Twitter card metadata
- Google Fonts preconnected, hero image preloaded with `fetchpriority`

## Deploy on Railway

Hosted via **Railway** using a tiny Caddy + Alpine Dockerfile (~45 MB image).

1. Push this repo to GitHub (already done — `https://github.com/shishirghimir/portfolio`).
2. On https://railway.app → **New Project → Deploy from GitHub Repo → shishirghimir/portfolio**.
3. Railway auto-detects [`Dockerfile`](Dockerfile) and [`railway.toml`](railway.toml) and builds. No env vars required.
4. Once deployed, go to **Settings → Networking → Public Networking → Generate Domain** to get a `*.up.railway.app` URL.
5. To use `shishirghimire.info.np`: **Settings → Networking → Custom Domain** → enter `shishirghimire.info.np` → Railway shows the CNAME record to set at your DNS registrar. SSL provisions automatically (~1 minute).

Future updates: just `git push origin main` — Railway rebuilds and redeploys in ~60 s.

### How the deploy works

- [`Dockerfile`](Dockerfile) — pulls `caddy:2-alpine`, copies the [`Caddyfile`](Caddyfile) and validates it at build time.
- [`Caddyfile`](Caddyfile) — listens on `$PORT` (Railway-injected), serves `/srv` with gzip+zstd compression, sets aggressive 1-year cache on `/img`, `/css`, `/js`, no-cache on HTML, correct MIME types for `sw.js` / `manifest.webmanifest` / `sitemap.xml`, and security headers on every response.
- [`railway.toml`](railway.toml) — tells Railway to use the Dockerfile builder, restart on failure, and healthcheck `/`.

After deploy, submit `https://shishirghimire.info.np/sitemap.xml` to Google Search Console + Bing Webmaster Tools.

### Run locally

```bash
docker build -t portfolio .
docker run --rm -p 8080:8080 -e PORT=8080 portfolio
# open http://localhost:8080
```

Or without Docker:

```bash
python -m http.server 8000
# or
npx serve .
```

## Image regeneration

If you replace `img/shishir.jpg`, regenerate the AVIF/WebP variants:

```bash
npm i -g sharp-cli
sharp -i img/shishir.jpg -o img/shishir.webp -f webp -- resize 900 -- quality 78
sharp -i img/shishir.jpg -o img/shishir.avif -f avif -- resize 900 -- quality 55
```

---

© Shishir Ghimire — NetaNix
