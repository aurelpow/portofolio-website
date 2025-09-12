---
layout: blog
title: Blog
permalink: /blog/
---

# Blog

<ul>
{%- for post in site.posts -%}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> ({{ post.date | date: "%b %d, %Y" }})</li>
{%- endfor -%}
</ul>