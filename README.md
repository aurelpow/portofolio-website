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
