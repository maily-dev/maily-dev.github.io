(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- theme ---- */
  var toggle = document.getElementById('theme-toggle');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return media && media.matches ? 'dark' : 'light';
  }
  function syncToggle() {
    if (!toggle) return;
    var dark = currentTheme() === 'dark';
    toggle.textContent = dark ? 'Light mode' : 'Dark mode';
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggle();
    });
  }
  if (media && media.addEventListener) media.addEventListener('change', syncToggle);
  syncToggle();

  /* ---- section highlight in the sidebar ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[data-spy]'));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('data-spy')); });
  if (links.length && sections.every(Boolean)) {
    var ticking = false;
    // A clicked link stays current while the page scrolls to it, even if the page can't scroll its heading up to the line.
    var pinned = null;
    links.forEach(function (a) {
      a.addEventListener('click', function () { pinned = a.getAttribute('data-spy'); setActive(pinned); });
    });
    ['wheel', 'touchstart', 'keydown'].forEach(function (type) {
      window.addEventListener(type, function () { pinned = null; }, { passive: true });
    });
    var spy = function () {
      ticking = false;
      if (pinned) return;
      var vh = window.innerHeight;
      var remaining = document.documentElement.scrollHeight - vh - window.scrollY;
      // A section is current once its heading passes a line 35% down the screen. The short sections
      // at the end can't scroll that high, so over the last half screen the line slides to the bottom.
      var tail = vh * 0.5;
      var line = vh * 0.35 + (remaining < tail ? (vh * 0.6) * (1 - Math.max(remaining, 0) / tail) : 0);
      var active = 0;
      sections.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) active = i; });
      setActive(links[active].getAttribute('data-spy'));
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(spy); }
    }, { passive: true });
    window.addEventListener('resize', spy);
    spy();
  }

  function setActive(id) {
    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-spy') === id); });
  }

  /* ---- year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
