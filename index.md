---
layout: default
title: Home
---

<div class="home-hero">
  <!-- LEFT: profile -->
  <aside class="profile-card">
    <img class="avatar" src="assets/img/home/avatar.png" width="150" alt="Profile Picture">
    <h1>Aurélien Darracq</h1>
    <h2>Data Engineer | ML Engineer | Google Cloud Professional ML Engineer <br> GCP · Spark · Scala · Python</h2>
    <div class="profile-social">
      <a href="https://www.linkedin.com/in/aur%C3%A9lien-darracq/" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Linkedin_icon.svg" alt="LinkedIn Logo"> LinkedIn
      </a>
      <a href="https://github.com/aurelpow" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub Logo"> GitHub
      </a>
      <a href="https://x.com/aureldata" target="_blank">
        <img src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=338&ext=jpg" alt="Twitter Logo"> Twitter
      </a>
    </div>
  </aside>

  <!-- RIGHT: recent posts/projects -->
  <section class="recent-posts">
    <h2>Recent Posts</h2>

    {% assign all_items = site.posts | concat: site.projects %}
    {% assign sorted = all_items | sort: "date" | reverse %}

    <ul class="recent-list">
    {% for item in sorted limit: 6 %}
      <li class="recent-item">
        <a class="recent-title" href="{{ item.url | relative_url }}">{{ item.title }}</a>
        <div class="recent-meta">
        <span class="recent-date">{{ item.date | date: "%B %-d, %Y" }}</span>
        <span class="sep">·</span>
        <span class="recent-type">
            {% if item.collection == "posts" %}📝 Blog{% else %}🚀 Project{% endif %}
        </span>
        </div>
        {% assign one_sentence = item.summary
        | default: item.description
        | default: item.excerpt
        | strip_html
        | replace: '!', '.'
        | replace: '?', '.'
        | split: '.'
        | first
        | strip %}
        <p class="recent-excerpt">{{ one_sentence }}.</p>
      </li>
    {% endfor %}
    </ul>

    <div class="recent-actions">
      <a class="recent-link" href="{{ '/projects/' | relative_url }}">All Projects</a>
      <a class="recent-link" href="{{ '/blog/' | relative_url }}">All Articles</a>
    </div>
  </section>
</div>

