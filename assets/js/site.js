(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Shared count-up used by the hero stats and the GitHub panel. */
  function countUpTo(el, target) {
    if (!el) return;
    target = target || 0;
    if (reduceMotion) { el.textContent = target; return; }

    var start = null;
    var duration = 900;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step); else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---- Typewriter hero role ---- */
  function initTypewriter() {
    var el = document.querySelector('.hero-role[data-roles]');
    if (!el || reduceMotion) return;

    var roles;
    try {
      roles = JSON.parse(el.getAttribute('data-roles'));
    } catch (e) {
      return;
    }
    if (!roles || roles.length < 2) return;

    var roleIndex = 0;
    var charIndex = roles[0].length;
    var deleting = false;

    function tick() {
      var current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }

      el.textContent = roles[roleIndex].slice(0, charIndex);
      setTimeout(tick, deleting ? 35 : 60);
    }

    setTimeout(tick, 1400);
  }

  /* ---- Scroll-reveal ---- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Animated stat counters ---- */
  function initCounters() {
    var items = document.querySelectorAll('.stat-number[data-target]');
    if (!items.length) return;

    function countUp(el) {
      countUpTo(el, parseInt(el.getAttribute('data-target'), 10) || 0);
    }

    if (!('IntersectionObserver' in window)) {
      items.forEach(countUp);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    items.forEach(function (el) { observer.observe(el); });
  }


  /* ---- Live GitHub activity (public REST API, no auth, no build step) ---- */
  function initGithubActivity() {
    var root = document.querySelector('.github-activity');
    if (!root) return;
    var username = root.getAttribute('data-username');
    if (!username) return;

    var panel = root.querySelector('.gh-panel');
    var feedEl = root.querySelector('.gh-feed');
    var statEls = {
      repos: root.querySelector('[data-gh-stat="repos"]'),
      commits: root.querySelector('[data-gh-stat="commits"]'),
      prs: root.querySelector('[data-gh-stat="prs"]')
    };

    function timeAgo(dateStr) {
      var seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      var units = [
        ['year', 31536000], ['month', 2592000], ['week', 604800],
        ['day', 86400], ['hour', 3600], ['minute', 60]
      ];
      for (var i = 0; i < units.length; i++) {
        var value = Math.floor(seconds / units[i][1]);
        if (value >= 1) return value + ' ' + units[i][0] + (value > 1 ? 's' : '') + ' ago';
      }
      return 'just now';
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str || '';
      return div.innerHTML;
    }

    var EVENT_ICONS = {
      PushEvent: '⬆️', PullRequestEvent: '🔀', IssuesEvent: '🐛', CreateEvent: '✨',
      ReleaseEvent: '🏷️', WatchEvent: '⭐', ForkEvent: '🍴',
      IssueCommentEvent: '💬', PullRequestReviewEvent: '👀'
    };

    function describeEvent(e) {
      switch (e.type) {
        case 'PushEvent':
          var n = (e.payload.commits || []).length || 1;
          return 'Pushed ' + n + ' commit' + (n > 1 ? 's' : '') + ' to';
        case 'PullRequestEvent':
          if (e.payload.action === 'closed' && e.payload.pull_request && e.payload.pull_request.merged) {
            return 'Merged a pull request in';
          }
          return capitalize(e.payload.action) + ' a pull request in';
        case 'IssuesEvent':
          return capitalize(e.payload.action) + ' an issue in';
        case 'CreateEvent':
          return 'Created a ' + e.payload.ref_type + ' in';
        case 'ReleaseEvent':
          return 'Published a release in';
        case 'WatchEvent':
          return 'Starred';
        case 'ForkEvent':
          return 'Forked';
        case 'IssueCommentEvent':
          return 'Commented on an issue in';
        case 'PullRequestReviewEvent':
          return 'Reviewed a pull request in';
        default:
          return null;
      }
    }

    function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

    var api = 'https://api.github.com/';
    Promise.all([
      fetch(api + 'users/' + username).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(api + 'search/commits?q=author:' + username).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(api + 'search/issues?q=author:' + username + '+type:pr+is:merged').then(function (r) { return r.ok ? r.json() : null; }),
      fetch(api + 'users/' + username + '/events/public?per_page=8').then(function (r) { return r.ok ? r.json() : null; })
    ]).then(function (results) {
      var user = results[0], commits = results[1], prs = results[2], events = results[3];
      if (!user || !commits || !prs || !events) throw new Error('incomplete github data');

      countUpTo(statEls.repos, user.public_repos);
      countUpTo(statEls.commits, commits.total_count);
      countUpTo(statEls.prs, prs.total_count);

      if (feedEl && Array.isArray(events)) {
        var rows = [];
        for (var i = 0; i < events.length && rows.length < 5; i++) {
          var e = events[i];
          var label = describeEvent(e);
          if (!label) continue;
          var repo = e.repo ? e.repo.name : '';
          rows.push(
            '<li class="gh-feed-item">' +
              '<span class="gh-feed-icon">' + (EVENT_ICONS[e.type] || '●') + '</span>' +
              '<span class="gh-feed-text">' + escapeHtml(label) + ' ' +
                '<a href="https://github.com/' + escapeHtml(repo) + '" target="_blank" rel="noopener">' + escapeHtml(repo) + '</a>' +
              '</span>' +
              '<span class="gh-feed-time">' + timeAgo(e.created_at) + '</span>' +
            '</li>'
          );
        }
        if (rows.length) feedEl.innerHTML = rows.join('');
      }

      root.classList.add('is-loaded');
    }).catch(function () {
      /* GitHub's public API is unauthenticated here (60 req/hr, 10/min for search) —
         if it's rate-limited or unreachable, hide this block instead of showing broken data. */
      if (panel) panel.classList.add('is-hidden');
    });
  }

  /* ---- Contributions: year-to-date total, YoY delta, and heatmap ----
     GitHub's REST API doesn't expose the contribution calendar (only the
     authenticated GraphQL API does), so this reads a public mirror of the
     same data. Fails independently of the panel above. */
  function initGithubContributions() {
    var root = document.querySelector('.github-activity');
    if (!root) return;
    var username = root.getAttribute('data-username');
    if (!username) return;

    var block = root.querySelector('.gh-contrib');
    var totalEl = root.querySelector('[data-gh-contrib="total"]');
    var yearEl = root.querySelector('[data-gh-contrib="year"]');
    var deltaEl = root.querySelector('[data-gh-contrib="delta"]');
    var heatmapEl = root.querySelector('.gh-heatmap');
    if (!block || !totalEl) return;

    var now = new Date();
    var curYear = now.getFullYear();
    var prevYear = curYear - 1;
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    var monthDay = '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    var curCutoff = curYear + monthDay;
    var prevCutoff = prevYear + monthDay;

    var base = 'https://github-contributions-api.jogruber.de/v4/' + username;

    function sumThrough(data, cutoff) {
      return (data.contributions || []).reduce(function (acc, day) {
        return day.date <= cutoff ? acc + day.count : acc;
      }, 0);
    }

    function renderHeatmap(days) {
      if (!heatmapEl || !days.length) return;

      var todayStr = curCutoff;
      var past = days.filter(function (d) { return d.date <= todayStr; });
      var recent = past.slice(-364);
      if (!recent.length) return;

      // Pad so the first column starts on the correct weekday (Sunday-first, like GitHub).
      var lead = new Date(recent[0].date + 'T00:00:00').getDay();
      var html = '';
      for (var i = 0; i < lead; i++) html += '<span class="gh-cell is-empty"></span>';

      recent.forEach(function (d) {
        var label = new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        html += '<span class="gh-cell" data-level="' + d.level + '" title="' +
                d.count + (d.count === 1 ? ' contribution on ' : ' contributions on ') + label + '"></span>';
      });

      heatmapEl.innerHTML = html;
    }

    Promise.all([
      fetch(base + '?y=' + curYear).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(base + '?y=' + prevYear).then(function (r) { return r.ok ? r.json() : null; })
    ]).then(function (res) {
      var cur = res[0], prev = res[1];
      if (!cur || !cur.contributions) throw new Error('no contribution data');

      var curTotal = sumThrough(cur, curCutoff);
      countUpTo(totalEl, curTotal);
      if (yearEl) yearEl.textContent = curYear;

      if (deltaEl && prev && prev.contributions) {
        var prevTotal = sumThrough(prev, prevCutoff);
        if (prevTotal > 0) {
          var pct = Math.round(((curTotal - prevTotal) / prevTotal) * 100);
          var up = pct >= 0;
          deltaEl.textContent = (up ? '▲ +' : '▼ ') + pct + '%';
          deltaEl.classList.add(up ? 'is-up' : 'is-down');
          var prevCutoffLabel = new Date(prevCutoff + 'T00:00:00').toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
          });
          deltaEl.title = 'Compared with ' + prevTotal + ' contributions on the same date last year (' +
                          prevCutoffLabel + ')';
          deltaEl.hidden = false;
        }
      }

      renderHeatmap((prev && prev.contributions ? prev.contributions : []).concat(cur.contributions));
      root.classList.add('is-loaded');
    }).catch(function () {
      block.classList.add('is-hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTypewriter();
    initReveal();
    initCounters();
    initGithubActivity();
    initGithubContributions();
  });
})();
