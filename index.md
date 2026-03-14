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

    <!-- SKILLS -->
    <div class="profile-skills">

      <p class="skills-label">Languages</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="">Python</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg" alt="">Scala</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqldeveloper/sqldeveloper-original.svg" alt="">SQL</span>
      </div>

      <p class="skills-label">Data Engineering</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg" alt="">Spark</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg" alt="">Airflow</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" alt="">S3</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="">MongoDB</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hadoop/hadoop-original.svg" alt="">Hive</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="">BigQuery</span>
      </div>

      <p class="skills-label">Cloud</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="">GCP</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg" alt="">Azure</span>
        <span class="skill-pill"><img src="https://upload.wikimedia.org/wikipedia/commons/2/24/IBM_Cloud_logo.png" alt="">IBM Cloud</span>
        <span class="skill-pill"><img src="https://static.wikia.nocookie.net/logopedia/images/a/aa/Microsoft_Fabric_2023.svg/revision/latest?cb=20230528223239" alt="MS Fabric" style="border-radius:2px">MS Fabric</span>
      </div>

      <p class="skills-label">ML / Data Science</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg" alt="">Scikit-Learn</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg" alt="">Pandas</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg" alt="">NumPy</span>
        <span class="skill-pill">⚙️ MLOps</span>
        <span class="skill-pill">📈 XGBoost</span>
      </div>

      <p class="skills-label">DevOps / Tools</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="">Docker</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="">Git</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg" alt="">GitLab</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original-wordmark.svg" alt="" style="filter:invert(1)">GitHub</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg" alt="">Jira</span>
      </div>

      <p class="skills-label">Viz / BI</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://1000logos.net/wp-content/uploads/2022/12/Power-BI-Logo-2013.png" alt="">Power BI</span>
        <span class="skill-pill">📊 Looker Studio</span>
        <span class="skill-pill">📊 Tableau</span>
      </div>

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

