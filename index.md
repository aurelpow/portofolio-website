---
layout: default
title: Home
---

<section class="hero reveal">
  <img class="avatar" src="{{ '/assets/img/home/avatar.png' | relative_url }}" width="104" alt="Profile Picture">
  <h1>Aurélien Darracq</h1>
  <span class="hero-role" data-roles='["ML Engineer","Machine Learning Engineer","Google Cloud Professional ML Engineer"]'>ML Engineer</span>

  <p class="hero-bio">I'm a machine learning engineer who builds reliable ML systems end to end: from feature data and training pipelines to production inference and monitoring. My data engineering background means models get the quality, scale, and reliability they need to create real impact.</p>

  <div class="hero-stats">
    <div class="stat">
      <span class="stat-number" data-target="{{ site.posts.size }}">0</span>
      <span class="stat-label">Blog Posts</span>
    </div>
    <div class="stat">
      <span class="stat-number" data-target="{{ site.projects.size }}">0</span>
      <span class="stat-label">Projects</span>
    </div>
  </div>

  <div class="profile-social">
    <a href="https://www.linkedin.com/in/aur%C3%A9lien-darracq/" target="_blank">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Linkedin_icon.svg" alt="LinkedIn Logo"> LinkedIn
    </a>
    <a href="https://github.com/aurelpow" target="_blank">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub Logo" style="filter:invert(1)"> GitHub
    </a>
    <a href="https://x.com/aureldata" target="_blank">
      <img src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=338&ext=jpg" alt="Twitter Logo"> Twitter
    </a>
  </div>

  <div class="hero-cta">
    <a class="btn btn-primary" href="mailto:darracq.aurelien@gmail.com">Contact Me</a>
  </div>
</section>

<section class="skills-panel reveal">
  <h2>What I Work With</h2>
  <div class="skills-layout">

    <div class="skills-venn">
      <svg class="venn" viewBox="35 20 460 425" role="img" aria-label="Venn diagram: data engineering, machine learning, and cloud overlap in production ML">
        <circle class="venn-fill venn-f1" cx="195" cy="175" r="140"/>
        <circle class="venn-fill venn-f2" cx="325" cy="175" r="140"/>
        <circle class="venn-fill venn-f3" cx="260" cy="287" r="140"/>
        <circle class="venn-circle venn-c1" cx="195" cy="175" r="140" pathLength="1"/>
        <circle class="venn-circle venn-c2" cx="325" cy="175" r="140" pathLength="1"/>
        <circle class="venn-circle venn-c3" cx="260" cy="287" r="140" pathLength="1"/>
        <text class="venn-label" x="112" y="118">Data<tspan x="112" dy="19">Engineering</tspan></text>
        <text class="venn-label" x="408" y="118">Machine<tspan x="408" dy="19">Learning</tspan></text>
        <text class="venn-label" x="260" y="388">Cloud &amp;<tspan x="260" dy="19">DevOps</tspan></text>
        <text class="venn-sub" x="260" y="112">Feature Pipelines</text>
        <text class="venn-sub" x="165" y="298">Streaming</text>
        <text class="venn-sub" x="355" y="298">MLOps</text>
        <text class="venn-center" x="260" y="207">Production<tspan x="260" dy="19">ML</tspan></text>
      </svg>
    </div>

    <div class="skills-grid">

    <div class="skills-group">
      <p class="skills-label">Languages</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg" alt="">Scala</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="">Python</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqldeveloper/sqldeveloper-original.svg" alt="">SQL</span>
      </div>
    </div>

    <div class="skills-group">
      <p class="skills-label">Machine Learning</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg" alt="">TensorFlow</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg" alt="">Scikit-Learn</span>
        <span class="skill-pill">📈 XGBoost</span>
        <span class="skill-pill">⚡ LightGBM</span>
      </div>
    </div>

    <div class="skills-group">
      <p class="skills-label">MLOps &amp; CI/CD</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="">Vertex AI</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/npm/aws-icons@3.2.0/icons/architecture-service/AmazonSageMaker.svg" alt="">SageMaker</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="">Docker</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="">Git</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="" style="filter:invert(1)">GitHub</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" alt="">GitHub Actions</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg" alt="">GitLab CI</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" alt="">Terraform</span>
      </div>
    </div>

    <div class="skills-group">
      <p class="skills-label">Data Engineering</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg" alt="">Spark</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg" alt="" style="filter:invert(1)">Kafka</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg" alt="">Airflow</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/googlebigquery.svg" alt="" style="filter:invert(1)">BigQuery</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="">Dataproc</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/npm/aws-icons@3.2.0/icons/architecture-service/AmazonAthena.svg" alt="">Athena</span>
      </div>
    </div>

    <div class="skills-group">
      <p class="skills-label">Other Data Tools</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/pandas.svg" alt="" style="filter:invert(1)">Pandas</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg" alt="">NumPy</span>
        <span class="skill-pill"><img src="{{ '/assets/img/home/powerbi.png' | relative_url }}" alt="">Power BI</span>
      </div>
    </div>

    <div class="skills-group">
      <p class="skills-label">Cloud</p>
      <div class="skills-row">
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" alt="">GCP</span>
        <span class="skill-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="" style="filter:invert(1)">AWS</span>
      </div>
    </div>

  </div>

  </div>
  <p class="skills-secondary">also: Jira</p>
</section>

<section class="github-activity" data-username="aurelpow">
  <h2>GitHub Activity</h2>
  <p class="gh-sub">Live from <a href="https://github.com/aurelpow" target="_blank" rel="noopener">github.com/aurelpow</a></p>

  <div class="gh-contrib">
    <div class="gh-contrib-head">
      <span class="gh-big-number" data-gh-contrib="total">0</span>
      <span class="gh-big-label">contributions in <span data-gh-contrib="year"></span> so far</span>
      <span class="gh-delta" data-gh-contrib="delta" hidden></span>
    </div>
    <div class="gh-heatmap-scroll">
      <div class="gh-heatmap" role="img" aria-label="GitHub contribution heatmap for the last 12 months"></div>
    </div>
    <div class="gh-legend">
      <span>Less</span>
      <span class="gh-cell"></span>
      <span class="gh-cell" data-level="1"></span>
      <span class="gh-cell" data-level="2"></span>
      <span class="gh-cell" data-level="3"></span>
      <span class="gh-cell" data-level="4"></span>
      <span>More</span>
    </div>
  </div>

  <div class="gh-panel">
  <div class="gh-layout">
    <div class="gh-stats">
      <div class="stat">
        <span class="stat-number" data-gh-stat="repos">0</span>
        <span class="stat-label">Public Repos</span>
      </div>
      <div class="stat">
        <span class="stat-number" data-gh-stat="commits">0</span>
        <span class="stat-label">Commits</span>
      </div>
      <div class="stat">
        <span class="stat-number" data-gh-stat="prs">0</span>
        <span class="stat-label">Merged PRs</span>
      </div>
      <a class="recent-link gh-profile-link" href="https://github.com/aurelpow" target="_blank" rel="noopener">View GitHub Profile ↗</a>
    </div>

    <ul class="gh-feed">
      <li class="gh-feed-skeleton">Loading recent activity…</li>
    </ul>
  </div>
  </div>
</section>

<section class="recent-work reveal">
  <h2>Featured ML &amp; AI Work</h2>

  {% assign featured_projects = site.projects | where: "featured", true %}
  {% assign sorted = featured_projects | sort: "date" | reverse %}

  <div class="work-grid">
  {% for item in sorted limit: 6 %}
    <article class="work-card">
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
    </article>
  {% endfor %}
  </div>

  <div class="recent-actions">
    <a class="recent-link" href="{{ '/projects/' | relative_url }}">All Projects</a>
    <a class="recent-link" href="{{ '/blog/' | relative_url }}">All Articles</a>
  </div>
</section>

