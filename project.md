---
layout: default
title: Projects
permalink: /projects/
---

# Projects

A selection of data engineering & ML projects.

<div class="proj-list">
{% assign projects = site.projects | sort: "date" | reverse %}
{% for p in projects %}
  <a class="proj-card" href="{{ p.url | relative_url }}">
    <figure class="proj-figure">
      <img
        src="{{ p.thumb | default: p.image | default: '/assets/img/project-placeholder.jpg' | relative_url }}"
        alt="{{ p.title }} thumbnail"
        class="proj-img">
      <figcaption class="proj-caption">
        <h3 class="proj-title">{{ p.title }}</h3>
        <p class="proj-meta">{{ p.date | date: "%B %-d, %Y" }} · 🚀 Project</p>
        <p class="proj-summary">
          {{ p.summary | default: p.description | default: p.excerpt | strip_html | truncate: 120 }}
        </p>
      </figcaption>
    </figure>
  </a>
{% endfor %}
</div>
