# Aurélien Darracq — Portfolio Website

Personal portfolio and blog built with [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/).

**Live site:** https://aurelpow.github.io/portofolio-website

---

## Stack

- **Jekyll** (via `github-pages` gem) — static site generator
- **Rouge** — syntax highlighting for code blocks
- **GitHub Pages** — hosting and CI/CD (auto-deploys on push to `main`)
- Custom HTML/CSS layouts — no external theme

---

## Project Structure

```
.
├── _config.yml          # Production config (baseurl, Google Analytics, etc.)
├── _config.dev.yml      # Local dev overrides (empty baseurl, localhost url)
├── _layouts/            # Page templates (default, post, project, blog, projects)
├── _includes/           # Reusable HTML partials
├── _posts/              # Blog posts (Markdown, named YYYY-MM-DD-slug.md)
├── _projects/           # Project pages (Markdown collection)
├── assets/
│   ├── css/site.css     # Main stylesheet
│   └── img/             # Images organised by section (blog, home, project)
├── index.md             # Home page
├── blog.md              # Blog listing page
├── project.md           # Projects listing page
├── about.md             # About page
└── Gemfile              # Ruby dependencies
```

---

## Local Development

### Prerequisites

- Ruby (tested with 3+)
- Bundler (`gem install bundler`)

### Install dependencies

```bash
bundle install
```

### Run the local server

```bash
bundle exec jekyll serve --livereload --force_polling --config _config.yml,_config.dev.yml
```

The site will be available at **http://127.0.0.1:4000**.

- `--livereload` — auto-refreshes the browser on file changes
- `--force_polling` — needed on Windows / WSL / Docker to detect file changes reliably
- `--config _config.yml,_config.dev.yml` — layers the dev config on top of production, stripping `baseurl` so local asset paths resolve correctly

### Preview on mobile (same WiFi network)

1. Start the server with the `--host 0.0.0.0` flag (required to accept connections from other devices):
   ```bash
   bundle exec jekyll serve --livereload --force_polling --host 0.0.0.0 --config _config.yml,_config.dev.yml
   ```
2. Find your machine's local IP — run `ipconfig` on Windows and look for `IPv4 Address` under your WiFi adapter (e.g. `192.168.1.42`)
3. On your phone, open `http://<your-ip>:4000`
4. If it still doesn't connect, allow port 4000 through Windows Firewall (run in PowerShell as Administrator):
   ```powershell
   New-NetFirewallRule -DisplayName "Jekyll Dev Server" -Direction Inbound -Protocol TCP -LocalPort 4000 -Action Allow
   ```

> The phone must be on the same WiFi network as your machine (not mobile data or a guest network).

---

## Adding Content

### New blog post

Create a file in `_posts/` following the naming convention:

```
_posts/YYYY-MM-DD-your-post-slug.md
```

Front matter template:

```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
links:
  - label: "View on LinkedIn"
    url: ""
    kind: linkedin
tags: [Tag1, Tag2, Tag3]
---
```

> Important: the date in the filename must match the `date` field in the front matter, otherwise Jekyll will generate a broken URL.

### New project page

Create a file in `_projects/`:

```
_projects/your-project-slug.md
```

Front matter template:

```yaml
---
layout: project
title: "Your Project Title"
description: "Short description"
tags: [Tag1, Tag2]
---
```

---

## Deployment

The site deploys automatically to GitHub Pages on every push to `main`.

No manual build step required — GitHub Pages runs Jekyll server-side.

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deployed to GitHub Pages |
| `dev` | Integration branch — merge feature branches here first |
| `feature/*` | New features or content |
| `docs/*` | Documentation changes |

Always branch from `dev`, not `main`. PR flow: `feature/*` → `dev` → `main`.

