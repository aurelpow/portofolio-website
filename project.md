---
layout: default
title: Projects
---

# Projects

{%- for p in site.projects -%}
### [{{ p.title }}]({{ p.url | relative_url }})
{{ p.summary }}
{%- endfor -%}