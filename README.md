# Shishir Ghimire — NetaNix Labs

[![Deploy to Docker](https://github.com/shishirghimir/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/shishirghimir/portfolio/actions/workflows/deploy.yml)

Personal portfolio for **Shishir Ghimire** (NetaNix) — cybersecurity engineer, CTF creator and founder & CEO of **NetaNix Labs**, Kathmandu, Nepal.

Live: **https://shishirghimire.info.np**

---

## Stack

Pure **HTML / CSS / vanilla JS** — no framework, no build step.

- Custom dark design system (`css/style.css`) with a security-engineering aesthetic
- Motion: scroll reveals, magnetic buttons, card spotlight, animated counters, typed hero role, marquee — all vanilla JS (`js/main.js`), fully `prefers-reduced-motion` aware
- Real inline brand/tech logos rendered client-side (`js/icons.js`) so nothing 404s offline
- Live Medium feed via `api.rss2json.com`
- Live TryHackMe badge
- PWA — installable, offline shell via Service Worker (`sw.js`)

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Hero · stats · about · wins · work · experience · writeups · TryHackMe · CTA |
| `about.html` | Full bio, timeline, skills |
| `projects.html` | Flagship, security tooling and production-software catalogue |
| `writeups.html` | Live Medium feed |
| `certs.html` | 13 certifications grouped by issuer |
| `contact.html` | Contact channels + mailto form |
| `now.html` | Current focus |

## SEO

- `sitemap.xml` + `robots.txt`
- JSON-LD `Person` + `WebSite` + `FAQPage` + `BreadcrumbList`
- Per-page canonical URLs, Open Graph + Twitter cards, custom OG image
- Geo + keyword metadata targeting "Shishir Ghimire" / NetaNix Labs

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

Static site — hosted via Vercel (`vercel.json`) and also containerised with nginx
(`Dockerfile`, `docker-compose.yml`, `nginx.conf`). Every push to `main` redeploys
through GitHub Actions (`.github/workflows/deploy.yml`).

### Regenerate the OG image

The social card is generated with Pillow — source script lives outside the repo; the
output is committed at `img/og.png` (1200×630).

---

© Shishir Ghimire — NetaNix Labs
