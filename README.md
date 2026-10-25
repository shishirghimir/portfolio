# Shishir Ghimire · shishirghimire.info.np

[![Deploy to Docker](https://github.com/shishirghimir/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/shishirghimir/portfolio/actions/workflows/deploy.yml)

Personal site of **Shishir Ghimire** (NetaNix): Founder & CEO of [Netanix Lab](https://netanixlab.com), founder of [NetanixCTF](https://netanixctf.com), cybersecurity engineer and CTF creator in Kathmandu, Nepal.

Live: **https://shishirghimire.info.np**

---

## Stack

- **Next.js 16** (App Router) as a fully static export: every page is plain HTML at build time
- **Tailwind CSS v4** design tokens, **Framer Motion** (lazy-loaded features) for motion
- **Zustand** for UI state (command palette, terminal, mobile menu)
- **three.js** 3D Netanix mark, loaded only when visible and the browser is idle
- A hand-written canvas globe for the hero (no WebGL library on first load)

## Features

- `Ctrl/⌘ + K` command palette and a `` ` `` terminal (`help`, `whoami`, `projects`, `open <name>`...)
- Case study page for every project, with Shishir's role and team credits
- Per-page and per-project Open Graph images (`/og/*.png`)
- JSON-LD: `Person`, `ProfilePage`, `WebSite`, `Organization`, `BreadcrumbList`, `SoftwareApplication` / `CreativeWork` per project
- `sitemap.xml` with image entries, `robots.txt` open to search and AI crawlers, `llms.txt`
- Old `.html` URLs from the previous site redirect permanently to the new pages

## Content

Everything lives in `src/content/`:

| File | What it holds |
|------|---------------|
| `profile.ts` | Bio, links, stats, wins, experience, skills, certifications, "now" |
| `projects.ts` | Every project: role, team credits, story, results, stack, images |
| `team.ts` | The Netanix Lab crew credited on projects |
| `writeups.ts` | Security writeups (full posts on Medium) |

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
npm run assets       # regenerate photos, icons and OG images after changing sources in assets/
```

## Deploy

**Vercel** reads `vercel.json` (build command, `out/` output, redirects, headers). Push to `main` and it deploys.

**Docker**: `docker compose up -d --build` builds the site in a Node stage and serves it with nginx on port 8080 (`nginx.conf` mirrors the Vercel headers and redirects). The GitHub Actions workflow in `.github/workflows/deploy.yml` does this automatically on the self-hosted runner for every push to `main`.

After a deploy, submit `https://shishirghimire.info.np/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

---

© Shishir Ghimire · Netanix Lab
