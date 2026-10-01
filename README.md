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

## Deploy on Vercel

Hosted via **Vercel** as a static site — no build step, no framework. Configuration lives in [`vercel.json`](vercel.json).

1. Push this repo to GitHub (already done — `https://github.com/shishirghimir/portfolio`).
2. On https://vercel.com/new → **Import Git Repository → `shishirghimir/portfolio`**.
3. **Framework Preset: Other** · **Build Command: (leave empty)** · **Output Directory: `./`** · **Install Command: (leave empty)**.
4. Click **Deploy**. Vercel reads `vercel.json` automatically.
5. To use `shishirghimire.info.np`: **Project Settings → Domains → Add Domain** → enter `shishirghimire.info.np`. Vercel shows you the DNS record to set at your registrar (typically `CNAME` to `cname.vercel-dns.com`). SSL provisions automatically.

Future updates: just `git push origin main` — Vercel auto-deploys in ~30 seconds.

### What `vercel.json` does

- `Service-Worker-Allowed: /` on `sw.js` so the SW can scope the whole site
- `application/manifest+json` MIME on the PWA manifest
- 1-year immutable cache on `/img`, `/css`, `/js`
- `must-revalidate` no-cache on HTML so updates ship instantly
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
- Correct content-type for `sitemap.xml` and `robots.txt`

After deploy, submit `https://shishirghimire.info.np/sitemap.xml` to Google Search Console + Bing Webmaster Tools.

### Run locally

```bash
python -m http.server 8000
# or
npx serve .
```

Open http://localhost:8000.

## Run with Docker

The site is also containerised with **nginx** (`nginx:stable-alpine`). [`nginx.conf`](nginx.conf) mirrors every header from `vercel.json` (cache rules, security headers, service-worker scope, MIME types, custom 404), so the container behaves the same as production.

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds the nginx image and copies the site into `/usr/share/nginx/html` |
| `nginx.conf` | Server config — same headers/caching as `vercel.json` |
| `docker-compose.yml` | One-command run, maps host port `8080` → container port `80` |
| `.dockerignore` | Keeps `.git`, docs and config out of the image |

**With Docker Compose (recommended):**

```bash
docker compose up -d --build   # build + start in background
docker compose ps              # status (shows "healthy" once ready)
docker compose logs -f         # follow nginx logs
docker compose down            # stop + remove the container
```

**With plain Docker:**

```bash
docker build -t shishirghimir/portfolio .
docker run -d --name portfolio -p 8080:80 shishirghimir/portfolio
```

Open http://localhost:8080.

After editing any HTML/CSS/JS, rebuild with `docker compose up -d --build` to see the changes.

## Image regeneration

If you replace `img/shishir.jpg`, regenerate the AVIF/WebP variants:

```bash
npm i -g sharp-cli
sharp -i img/shishir.jpg -o img/shishir.webp -f webp -- resize 900 -- quality 78
sharp -i img/shishir.jpg -o img/shishir.avif -f avif -- resize 900 -- quality 55
```

---

© Shishir Ghimire — NetaNix
