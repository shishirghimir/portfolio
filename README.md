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

## Deploy

Drop the folder on any static host:

- **Netlify** / **Vercel** / **Cloudflare Pages** — connect this repo, no build command
- **GitHub Pages** — Settings → Pages → Branch `main`, root `/`
- **Self-hosted** — serve the folder over HTTPS with a static file server

After deploy, submit `https://your-domain/sitemap.xml` to Google Search Console + Bing Webmaster Tools.

## Local development

```bash
# any static server works
python -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`.

## Image regeneration

If you replace `img/shishir.jpg`, regenerate the AVIF/WebP variants:

```bash
npm i -g sharp-cli
sharp -i img/shishir.jpg -o img/shishir.webp -f webp -- resize 900 -- quality 78
sharp -i img/shishir.jpg -o img/shishir.avif -f avif -- resize 900 -- quality 55
```

---

© Shishir Ghimire — NetaNix
