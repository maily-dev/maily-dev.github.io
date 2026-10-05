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
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('data-spy')] = a; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var active = null;
      links.forEach(function (a) {
        var id = a.getAttribute('data-spy');
        if (!active && visible[id]) active = id;
      });
      if (active && !atBottom()) setActive(active);
    }, { rootMargin: '-35% 0px -55% 0px' });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });

    // The last section is too short to reach the middle band, so mark it at the bottom of the page.
    window.addEventListener('scroll', function () {
      if (atBottom()) {
        setActive(links[links.length - 1].getAttribute('data-spy'));
      }
    }, { passive: true });
  }

  function atBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  }

  function setActive(id) {
    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-spy') === id); });
  }

  /* ---- year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
