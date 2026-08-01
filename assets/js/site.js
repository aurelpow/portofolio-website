(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if (reduceMotion) {
        el.textContent = target;
        return;
      }
      var start = null;
      var duration = 900;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
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

  document.addEventListener('DOMContentLoaded', function () {
    initTypewriter();
    initReveal();
    initCounters();
  });
})();
